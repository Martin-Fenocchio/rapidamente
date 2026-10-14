# RápidaMente

Spanish-language daily mental arithmetic game, migrating to one Next.js application on Vercel.

## Local development

Use Node.js 24 and npm. From this repository:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The application now contains the UI, MongoDB player services, protected API, and Better Auth sessions. Configure a local replica-set database and signing secret in `.env.local` for development. Public ranking and private player data use separate endpoints. There is no AWS or production-database fallback.

Named guest play works without Google credentials. Configure Google OAuth later to enable sign-in and verified existing-player recovery. Production credentials are not needed for automated tests; integration tests start an isolated loopback replica set.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint; no automatic file edits |
| `npm run typecheck` | TypeScript validation |
| `npm test` | Unit, component, and mocked API contract tests |
| `npm run test:integration` | Real MongoDB and Better Auth integration tests |
| `npm run test:watch` | Watch unit/component tests |
| `npm run test:e2e` | Playwright desktop/mobile suite; build first |
| `npm run check` | Lint, typecheck, tests, production build |

For browser tests, install Chromium once with `npx playwright install chromium`. CI installs browser system dependencies too.

## Documentation

- [Engineering agreement](docs/ENGINEERING.md)
- [Architecture](docs/architecture.md)
- [Game rules](docs/game-rules.md)
- [API](docs/api.md)
- [Authentication](docs/authentication.md)
- [Backend migration](docs/backend-migration.md)
- [Testing](docs/testing.md)
- [Verified migration results](docs/validation.md)
- [Deployment and configuration](docs/deployment.md)
- [Migration decision](docs/decisions/001-nextjs-migration.md)
- [Baseline observations](docs/baseline/README.md)

All behavior changes require appropriate automated tests and documentation updates. Live cutover, real Google OAuth verification, and additional games are subsequent milestones.
