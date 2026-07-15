---
name: aws-sam-deploy
description: Deploy the Circuit Access Requests demo (SAM API + S3 fallback + R2 HTTPS). Use when deploying access-requests, running sam deploy, publishing the public demo URL, or configuring AWS SSO for produx-pdlc.
---

# AWS SAM Deploy — Circuit Access Requests

Deploy the **Circuit-access-requests** demo: AWS SAM stack (API + S3 fallback) and optional Cloudflare R2 publish (HTTPS share link).

## Architecture

| Layer | Host | Purpose |
|-------|------|---------|
| API | AWS Lambda + API Gateway + DynamoDB | Preferences + saved views |
| S3 website | HTTP fallback | Direct bucket URL (not for sharing) |
| R2 + Workers | `demos.jumpcloud-test.workers.dev` | **Shareable HTTPS URL** (password `demo`) |

## AWS profile (required for local SAM deploy)

Add to `~/.aws/config` if missing. Use JumpCloud SSO — **not** `aws login` (stale OAuth causes 400 errors).

```ini
# Produx jc-nonprod UX account (112284275763 — SAM stack lives here).
[profile produx-pdlc]
sso_start_url = https://jumpcloudsso.awsapps.com/start
sso_region = us-west-2
sso_account_id = 112284275763
sso_role_name = pdlc
region = us-west-2
output = json
```

Login before every deploy session:

```bash
aws sso login --profile produx-pdlc
```

**Do not use** `jumpcloud`, `prod-workstation`, or `read-only-*` profiles for SAM deploy — they lack CloudFormation/S3 permissions or hit `GetRoleCredentials: No access`.

**IAM limits on `produx-pdlc`:** CloudFront, Route53, and ACM are denied. HTTPS uses R2, not CloudFront.

## Deploy commands

### 1. AWS API + S3 (local)

```bash
aws sso login --profile produx-pdlc
AWS_PROFILE=produx-pdlc AWS_REGION=us-west-2 pnpm run deploy:access-requests
```

Prints:

- **API URL** — baked into frontend as `VITE_API_BASE_URL`
- **Website URL** — HTTP-only S3 fallback

### 2. HTTPS public URL

**GitHub Action (recommended — has Cloudflare secrets):**

```bash
gh workflow run "Deploy Access Requests (SAM)" \
  --repo TheJumpCloud/circuit-playground \
  --ref circuit-access-requests-demo
```

**Local (requires Cloudflare env vars):**

```bash
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_API_TOKEN=...
export KV_NAMESPACE_ID=...
export R2_ACCESS_KEY_ID=...
export R2_SECRET_ACCESS_KEY=...
export ACCESS_REQUESTS_API_URL=https://5o4efrj7o1.execute-api.us-west-2.amazonaws.com

pnpm run deploy:access-requests:public
```

## Shareable URL

After R2 deploy:

- **https://demos.jumpcloud-test.workers.dev/Circuit-access-requests-latest/**
- Password: `demo`

## Key files

| Path | Role |
|------|------|
| `infra/template.yaml` | SAM stack (S3, Lambda, DynamoDB, HTTP API) |
| `infra/samconfig.toml` | Stack name + region (`us-west-2`) |
| `backend/src/handler.mjs` | API routes: `/health`, `/preferences`, `/saved-views` |
| `scripts/deploy-sam.sh` | Build + SAM deploy + S3 sync |
| `scripts/deploy-access-requests-r2.sh` | Build + R2 upload + KV registration |
| `vite.config.access-requests.ts` | Standalone demo build (includes Vue compiler alias) |
| `.github/workflows/deploy-sam-access-requests.yml` | CI: SAM (optional) + R2 publish |

## Production build note

Access Requests pages use `defineComponent({ template: \`...\` })` in `.ts` files. `vite.config.access-requests.ts` must alias Vue to `vue.esm-bundler.js` or the deployed site mounts empty (`#app` shows `<!---->` only).

## Smoke tests

```bash
# API
curl https://5o4efrj7o1.execute-api.us-west-2.amazonaws.com/health

# SAM validate / build
cd backend && npm install
cd ../infra && sam validate && sam build

# Local API (Docker)
cd infra && sam local start-api
curl http://127.0.0.1:3000/health
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Blank page on S3 or R2 | Rebuild with Vue compiler alias in `vite.config.access-requests.ts`; redeploy |
| `Unable to locate credentials` | `aws sso login --profile produx-pdlc` |
| `GetRoleCredentials: No access` | Wrong SSO profile — use `produx-pdlc` |
| R2 deploy fails locally | Missing Cloudflare secrets — use GitHub Action |
| CI `deploy-api` job fails | Expected (CI role lacks SAM stack perms); `deploy-public` still publishes R2 |
| Mixed content errors | Share the HTTPS R2 URL, not the HTTP S3 URL |

## When the user asks to deploy

1. Confirm `aws sso login --profile produx-pdlc` succeeded.
2. Run `pnpm run deploy:access-requests` with `AWS_PROFILE=produx-pdlc AWS_REGION=us-west-2`.
3. Trigger GitHub Action for R2 HTTPS publish unless Cloudflare env vars are set locally.
4. Return the shareable URL and password `demo`.
