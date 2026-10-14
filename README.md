# RápidaMente

Spanish-language daily mental arithmetic game, migrating to one Next.js application on Vercel.

## Local development

Use Node.js 24 and npm. From this repository:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. This milestone migrates the UI to Next.js App Router; the original NestJS backend remains separate. To register players or load rankings locally, explicitly configure `LEGACY_API_URL` for a local backend. There is no automatic production API fallback. With no upstream configured the API bridge returns 503, and the UI shows recoverable errors. A production database connection is not needed to build or run the mocked browser tests.

Legacy Firebase support is temporary and optional. Blank Firebase settings hide Google sign-in. Better Auth is the chosen replacement for the backend integration stage.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint; no automatic file edits |
| `npm run typecheck` | TypeScript validation |
| `npm test` | Unit, component, and mocked API contract tests |
| `npm run test:watch` | Watch unit/component tests |
| `npm run test:e2e` | Playwright desktop/mobile suite; build first |
| `npm run check` | Lint, typecheck, tests, production build |

For browser tests, install Chromium once with `npx playwright install chromium`. CI installs browser system dependencies too.

## Documentation

- [Engineering agreement](docs/ENGINEERING.md)
- [Architecture](docs/architecture.md)
- [Game rules](docs/game-rules.md)
- [API bridge](docs/api.md)
- [Testing](docs/testing.md)
- [Verified migration results](docs/validation.md)
- [Deployment and configuration](docs/deployment.md)
- [Migration decision](docs/decisions/001-nextjs-migration.md)
- [Baseline observations](docs/baseline/README.md)

All behavior changes require appropriate automated tests and documentation updates. Live cutover, MongoDB integration, Better Auth, and additional games are subsequent milestones.
