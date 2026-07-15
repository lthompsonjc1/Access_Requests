#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STACK_NAME="${STACK_NAME:-circuit-access-requests}"
REGION="${AWS_REGION:-us-east-2}"
DEMO_ID="Circuit-access-requests"
DIST_DIR="dist-demos/${DEMO_ID}"

if ! command -v sam >/dev/null 2>&1; then
  echo "Error: AWS SAM CLI is required (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)" >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "Error: AWS CLI is required" >&2
  exit 1
fi

echo "▸ Installing backend dependencies"
(cd backend && npm install --omit=dev)

echo "▸ Building SAM application"
(cd infra && sam build)

echo "▸ Deploying stack ${STACK_NAME} (${REGION})"
(cd infra && sam deploy --no-confirm-changeset --no-fail-on-empty-changeset)

API_URL="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text)"

SITE_BUCKET="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='SiteBucketName'].OutputValue" \
  --output text)"

DISTRIBUTION_ID="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" \
  --output text)"

CLOUDFRONT_URL="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontUrl'].OutputValue" \
  --output text)"

if [[ -z "$API_URL" || "$API_URL" == "None" ]]; then
  echo "Error: could not resolve ApiUrl stack output" >&2
  exit 1
fi

echo "▸ Building frontend with VITE_API_BASE_URL=${API_URL}"
VITE_API_BASE_URL="$API_URL" pnpm exec vite build --config vite.config.access-requests.ts
mv "${DIST_DIR}/.demo-${DEMO_ID}.html" "${DIST_DIR}/index.html"

echo "▸ Syncing static assets to s3://${SITE_BUCKET}"
aws s3 sync "${DIST_DIR}/" "s3://${SITE_BUCKET}/" --delete --region "$REGION"

echo "▸ Invalidating CloudFront distribution ${DISTRIBUTION_ID}"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" >/dev/null

cat <<EOF

Deploy complete.

  CloudFront URL: ${CLOUDFRONT_URL}
  API URL:        ${API_URL}

The previous R2 public-demo URL for Circuit-access-requests is retired.
Use the CloudFront URL above.

EOF
