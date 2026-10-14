# Deployment and configuration

## Current and target hosting

The live site remains at https://martin-fenocchio.github.io/rapidamente/. The old backend remains AWS API Gateway/Lambda in São Paulo. This local milestone does not deploy, retire AWS, or modify production data.

The target is Vercel's Next.js runtime, with the existing frontend repository as project root, Node.js 24, build command `npm run build`, and framework preset Next.js. Use the standard framework output; no static-export or GitHub Pages publish script is configured. Complete backend/auth integration and acceptance checks before live cutover.

## Variables

See `.env.example` for variable names and empty defaults. Use `.env.local` locally; `.env*` files are ignored except `.env.example`.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `LEGACY_API_URL` | Server only | Explicit temporary NestJS upstream; unset returns 503 |
| `NEXT_PUBLIC_BASE_PATH` | Build/public | Empty for root deployment; `/rapidamente` if preserving a subpath |
| `NEXT_PUBLIC_GA_ID` | Build/public | Optional Google Analytics measurement ID |
| `NEXT_PUBLIC_SENTRY_DSN` | Build/public | Optional Sentry browser reporting |
| `SENTRY_AUTH_TOKEN` | Build only | Optional source-map/release upload |
| `NEXT_PUBLIC_FIREBASE_*` | Build/public | Six optional legacy Firebase fields until Better Auth replaces it |

Public values are embedded at build time; rebuild when they change. Changing the base path also requires rebuilding; image URLs and browser API requests honor it. No database URI is needed by this UI milestone. Future Better Auth OAuth client secret and signing secret must remain server-only, and must be configured separately from public values.

For the currently known upstream, the AWS endpoint is `https://mog81hbjjf.execute-api.sa-east-1.amazonaws.com`. Configure it only when intentionally exercising production; do not use it for automated write tests. For development prefer the separate backend on another local port and a development database.

## Cutover checklist for later

Back up MongoDB, integrate verified identities, test returning players, and define a recovery flow for guests whose localStorage lives on the old origin. Configure controlled Google OAuth redirect URLs, trusted origins, isolated preview databases, monitoring, and rollback compatibility. Validate production-build behavior before switching domains/traffic. Retain the original AWS backend until cutover is verified. CI branch protection and Vercel account/project linking have not been configured by this milestone.
