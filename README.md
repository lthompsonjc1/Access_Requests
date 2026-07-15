# Circuit Playground

**Circuit Design System — Version 0.0.99**

A Storybook-based sandbox for experimenting with the **JumpCloud Circuit Design System**, prototyping pages with real code, and leveraging the **Figma MCP server** in Cursor to translate designs into production-quality Vue components.

## What This Repo Is For

1. **Circuit DS exploration** — Browse and interact with every Circuit DS and PrimeVue component through isolated Storybook stories (`src/stories/circuit-ds/`).
2. **Figma-to-code with Cursor** — Use the Figma MCP server integration in Cursor to pull design context, tokens, and Code Connect mappings directly from Figma into your code. Cursor rules in `.cursor/rules/` enforce that all generated UI code uses Circuit tokens and components.
3. **Prototyping with real code** — Build full-page prototypes under `src/stories/projects/` using actual Circuit components, PrimeVue primitives, and mock data. These prototypes run in Storybook and behave like real application screens.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Vue 3 |
| Design system | `@jumpcloud/circuit` + `@jumpcloud/icons` |
| UI primitives | PrimeVue 4 (styled via Circuit passthrough) |
| Styling | Tailwind CSS 4 with Circuit preset |
| Component dev | Storybook 8 |
| Build | Vite 6 |
| AI tooling | Cursor with Figma MCP server |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- Access to the `@jumpcloud` npm registry (for `@jumpcloud/circuit` and `@jumpcloud/icons`)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd circuit-playground

# Install dependencies
npm install
```

> If you hit authentication errors during install, make sure your `.npmrc` is configured with the correct registry and token for the `@jumpcloud` scope.

### Running Storybook

```bash
npm run storybook
```

This starts Storybook on **http://localhost:6006**. You can browse:

- **Circuit DS** — Individual component stories showcasing props, variants, and theming.
- **Projects** — Full-page prototypes (e.g. Asset Management pages) with mock data and navigation.

Use the theme switcher in the Storybook toolbar to toggle between **Light** and **Dark** Circuit themes.

## Fonts

Circuit DS uses **Inter** (sans) and **Fira Code** (mono). These are loaded from Google Fonts via `.storybook/preview-head.html` so no local font files are needed.

## Project Structure

```
circuit-playground/
├── .cursor/rules/           # Cursor AI rules for consistent Circuit usage
├── .storybook/              # Storybook configuration (main.ts, preview.ts)
├── src/
│   ├── assets/              # Global styles (Tailwind entry point)
│   ├── components/          # Shared Vue components (e.g. TopBar)
│   └── stories/
│       ├── Introduction.mdx           # Welcome page
│       ├── circuit-ds/                # Component-level stories
│       └── projects/                  # Page-level prototype stories
│           ├── asset-management/      # Asset management prototype
│           └── buraks-playground/     # Experimental pages
├── tailwind.config.ts       # Tailwind config with Circuit preset
├── vite.config.ts           # Vite config with Vue + Tailwind plugins
└── package.json
```

## Working with Figma + Cursor

This repo is set up to work with the **Figma MCP server** in Cursor:

1. **Select a Figma node** in the Figma desktop app.
2. **Ask Cursor to implement it** — Cursor will use Code Connect to find the right Circuit component, pull design tokens, and generate Vue code that follows the design system rules.
3. **Cursor rules** (`.cursor/rules/circuit-design-system.mdc`) enforce that all generated code uses Circuit typography tokens, color tokens, and existing components — no hardcoded values or duplicate components.

## Adding a New Prototype Page

1. Create a new folder under `src/stories/projects/<your-project>/pages/`.
2. Create a `*.stories.ts` file with your page story.
3. Use Circuit components and PrimeVue primitives for all UI.
4. Add mock data in a `mock-data/` folder if needed.
5. Run Storybook to see your page live.

## Access Requests AWS SAM deploy

`Circuit-access-requests` uses **AWS SAM** for the API (Lambda + DynamoDB) and **Cloudflare R2** for the shareable HTTPS demo UI.

Prerequisites: AWS CLI, [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html), and credentials for the stack in `us-west-2` (`produx-pdlc` SSO works for SAM deploy).

```bash
aws sso login --profile produx-pdlc
AWS_PROFILE=produx-pdlc AWS_REGION=us-west-2 pnpm run deploy:access-requests
```

That deploys the API and syncs static assets to S3 (HTTP-only fallback). For the **shareable HTTPS URL**, publish to R2 (requires Cloudflare secrets — run via GitHub Action or locally):

```bash
AWS_PROFILE=produx-pdlc AWS_REGION=us-west-2 pnpm run deploy:access-requests:public
```

**Share this URL:**

- **https://demos.jumpcloud-test.workers.dev/Circuit-access-requests-latest/**
- Password: `demo`

The demo UI calls the SAM API for preferences and saved views (`VITE_API_BASE_URL` is set at build time).

GitHub Action: `.github/workflows/deploy-sam-access-requests.yml` deploys SAM + R2 on push/dispatch.

Template validation / build smoke test:

```bash
cd backend && npm install
cd ../infra && sam validate && sam build
```

Local API (requires Docker):

```bash
cd infra && sam local start-api
curl http://127.0.0.1:3000/health
```

The previous R2-only URL without the SAM API is retired; use the HTTPS URL above.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run storybook` | Start Storybook dev server on port 6006 |
| `npm run build-storybook` | Build static Storybook for deployment |
| `npm run deploy:access-requests` | Deploy SAM API + S3 fallback |
| `npm run deploy:access-requests:public` | Publish HTTPS demo to R2 |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
