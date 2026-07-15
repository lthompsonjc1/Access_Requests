#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STACK_NAME="${STACK_NAME:-circuit-access-requests}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-2}}"
DEMO_ID="Circuit-access-requests"
DIST_DIR="dist-demos/${DEMO_ID}"
AWS_ARGS=(--region "$REGION")
SAM_ARGS=(--region "$REGION" --no-confirm-changeset --no-fail-on-empty-changeset)
if [[ -n "${AWS_PROFILE:-}" ]]; then
  AWS_ARGS+=(--profile "$AWS_PROFILE")
  SAM_ARGS+=(--profile "$AWS_PROFILE")
fi

if ! command -v sam >/dev/null 2>&1; then
  echo "Error: AWS SAM CLI is required (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)" >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "Error: AWS CLI is required" >&2
  exit 1
fi

echo "▸ Using profile=${AWS_PROFILE:-default} region=${REGION}"

echo "▸ Installing backend dependencies"
(cd backend && npm install --omit=dev)

echo "▸ Building SAM application"
(cd infra && sam build)

echo "▸ Deploying stack ${STACK_NAME} (${REGION})"
(cd infra && sam deploy "${SAM_ARGS[@]}")

API_URL="$(aws cloudformation describe-stacks \
  "${AWS_ARGS[@]}" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text)"

SITE_BUCKET="$(aws cloudformation describe-stacks \
  "${AWS_ARGS[@]}" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='SiteBucketName'].OutputValue" \
  --output text)"

WEBSITE_URL="$(aws cloudformation describe-stacks \
  "${AWS_ARGS[@]}" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteUrl'].OutputValue" \
  --output text)"

if [[ -z "$API_URL" || "$API_URL" == "None" ]]; then
  echo "Error: could not resolve ApiUrl stack output" >&2
  exit 1
fi

if [[ -z "$WEBSITE_URL" || "$WEBSITE_URL" == "None" ]]; then
  WEBSITE_URL="$(aws cloudformation describe-stacks \
    "${AWS_ARGS[@]}" \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontUrl'].OutputValue" \
    --output text)"
fi

echo "▸ Building frontend with VITE_API_BASE_URL=${API_URL}"
VITE_API_BASE_URL="$API_URL" pnpm exec vite build --config vite.config.access-requests.ts
if [[ -f "${DIST_DIR}/access-requests-demo.html" ]]; then
  mv "${DIST_DIR}/access-requests-demo.html" "${DIST_DIR}/index.html"
elif [[ -f "${DIST_DIR}/.demo-${DEMO_ID}.html" ]]; then
  mv "${DIST_DIR}/.demo-${DEMO_ID}.html" "${DIST_DIR}/index.html"
fi


echo "▸ Syncing static assets to s3://${SITE_BUCKET}"
aws s3 sync "${DIST_DIR}/" "s3://${SITE_BUCKET}/" --delete "${AWS_ARGS[@]}"

cat <<EOF

Deploy complete.

  Website URL: ${WEBSITE_URL}  (HTTP-only fallback)
  API URL:     ${API_URL}

For the shareable HTTPS URL, publish to R2:

  pnpm run deploy:access-requests:public

Live URL after R2 deploy:

  https://demos.jumpcloud-test.workers.dev/${DEMO_ID}-latest/
  Password: demo

EOF
