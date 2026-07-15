#!/usr/bin/env bash
# Publish the Access Requests demo to Cloudflare R2 for HTTPS at
# https://demos.jumpcloud-test.workers.dev/Circuit-access-requests-<ref>/
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DEMO_ID="Circuit-access-requests"
REF="${R2_REF:-latest}"
DIST_DIR="dist-demos/${DEMO_ID}"
STACK_NAME="${STACK_NAME:-circuit-access-requests}"
AWS_ARGS=()
if [[ -n "${AWS_REGION:-}" ]]; then
  AWS_ARGS+=(--region "$AWS_REGION")
elif [[ -n "${AWS_DEFAULT_REGION:-}" ]]; then
  AWS_ARGS+=(--region "$AWS_DEFAULT_REGION")
fi
if [[ -n "${AWS_PROFILE:-}" ]]; then
  AWS_ARGS+=(--profile "$AWS_PROFILE")
fi

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Error: ${name} is required for R2 deploy" >&2
    exit 1
  fi
}

resolve_api_url() {
  if [[ -n "${VITE_API_BASE_URL:-}" ]]; then
    echo "$VITE_API_BASE_URL"
    return
  fi

  if command -v aws >/dev/null 2>&1; then
    local from_stack
    from_stack="$(aws cloudformation describe-stacks \
      "${AWS_ARGS[@]}" \
      --stack-name "$STACK_NAME" \
      --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
      --output text 2>/dev/null || true)"
    if [[ -n "$from_stack" && "$from_stack" != "None" ]]; then
      echo "$from_stack"
      return
    fi
  fi

  if [[ -n "${ACCESS_REQUESTS_API_URL:-}" ]]; then
    echo "$ACCESS_REQUESTS_API_URL"
    return
  fi

  echo "Error: set VITE_API_BASE_URL, ACCESS_REQUESTS_API_URL, or deploy the SAM stack first" >&2
  exit 1
}

require_env CLOUDFLARE_ACCOUNT_ID
require_env CLOUDFLARE_API_TOKEN
require_env KV_NAMESPACE_ID
require_env R2_ACCESS_KEY_ID
require_env R2_SECRET_ACCESS_KEY

if ! command -v rclone >/dev/null 2>&1; then
  echo "Error: rclone is required (brew install rclone)" >&2
  exit 1
fi

if ! command -v wrangler >/dev/null 2>&1; then
  echo "Error: wrangler is required (npm install -g wrangler)" >&2
  exit 1
fi

API_URL="$(resolve_api_url)"
echo "▸ Building frontend for R2 with VITE_API_BASE_URL=${API_URL}"
VITE_API_BASE_URL="$API_URL" pnpm exec vite build --config vite.config.access-requests.ts

if [[ -f "${DIST_DIR}/access-requests-demo.html" ]]; then
  mv "${DIST_DIR}/access-requests-demo.html" "${DIST_DIR}/index.html"
elif [[ -f "${DIST_DIR}/.demo-${DEMO_ID}.html" ]]; then
  mv "${DIST_DIR}/.demo-${DEMO_ID}.html" "${DIST_DIR}/index.html"
fi

export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ENDPOINT="https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"
export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true

echo "▸ Uploading to R2: circuit-playground/${DEMO_ID}/${REF}/"
rclone copy "${DIST_DIR}/" "r2:jc-customer-demos/circuit-playground/${DEMO_ID}/${REF}/" --transfers 16

echo "▸ Registering demo:${DEMO_ID} in KV"
wrangler kv key put --namespace-id "$KV_NAMESPACE_ID" --remote \
  "demo:${DEMO_ID}" "{\"r2Prefix\":\"circuit-playground/${DEMO_ID}\",\"password\":\"demo\"}"

PUBLIC_URL="https://demos.jumpcloud-test.workers.dev/${DEMO_ID}-${REF}/"
cat <<EOF

R2 deploy complete.

  Public URL: ${PUBLIC_URL}
  Password:   demo
  API URL:    ${API_URL}

EOF
