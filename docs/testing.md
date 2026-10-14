# Testing

## Run checks

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:e2e:api
```

Node.js 24 is the development/CI target. Playwright starts its own production server on port 4181 and fails if that port is already occupied. Build before browser tests. The production-build base path must be empty for the current browser-suite configuration; a subpath deployment needs a separate smoke check.

## Isolation

Vitest configuration is independent of Next.js and Sentry. It uses jsdom for browser components and a Node environment for mocked route-handler tests. Component tests stub external requests; integration tests use their own database. Component tests mock Next.js navigation where needed. History is cleared between tests, and clocks are controlled for timing/date cases.

Playwright covers desktop Chromium and a Pixel 7 viewport, using a fixed Wednesday date and controlled browser clocks. Same-origin API requests receive test fixtures in the UI suite. All non-local browser requests are blocked, including analytics. The legacy AWS bridge has been removed. No database or personal login is required.

## Coverage

- Daily history storage, first-attempt retention, and next-day access.
- Weekday challenge selection, timing constants, and arithmetic correctness of the entire bank.
- Unique answer options, correct/wrong answers, exact deadlines, and timer cleanup.
- Registration awaiting completion, failure recovery, required input, and entry navigation.
- Pending-score single-flight behavior, cache refresh, retry persistence, and stale startup responses after registration.
- Signed sessions, expiry/logout, verified recovery/linking, origin checks, input validation, transaction rollback, and duplicate concurrent results.
- Legacy hash routing, rejecting unknown/external routes.
- Browser journeys: registration/reload and failed registration, ten correct answers, wrong answer/daily blocker, direct route guard, timeout, failed-save retry, leaderboard/hash links/refresh, and desktop/mobile home assets.

The current suite is a migration safety net, not exhaustive coverage of every legacy component. Real Google OAuth, broader cross-device game rules, other browser engines, accessibility, and remaining calendar/streak edge cases require subsequent coverage.

Backend-service and authentication milestones: `npm run test:integration` now exercises real MongoDB transactions in an ephemeral loopback replica set. It never reads production environment files. First run downloads MongoDB 8.0.17; later runs reuse the cached binary. The suite now includes 23 service/session/endpoint/configuration cases.

## CI and evidence

`.github/workflows/ci.yml` runs lint, tests, production build, typecheck, and both browser projects on pushes to main and codex/nextjs-migration and on pull requests. It retains Playwright reports and traces on failure. Remote checks run after each pushed milestone. CI runs browser cases sequentially to avoid competing graphics workloads on its shared runner; retries remain disabled. Repository branch-protection settings still need these checks marked required.

`docs/baseline/` contains pre-migration screenshots and original check results. Browser runs attach current home screenshots in the test report. Review screenshots visually rather than interpreting a successful capture as proof of visual equivalence.

Known tooling debt: React 18 is temporarily retained because `react-card-flip` declares React 18 peers. Next.js 16 supports it but emits a deprecation warning; replace that component and migrate to React 19 in a separate tested change. Legacy Sass imports emit deprecation warnings. Explicit-any lint exceptions are scoped to existing graphics and a few legacy helpers; rule-of-hooks, unused-variable, and TypeScript checks remain active. Hook dependencies are enforced for App Router and game components; remaining legacy hook dependency auditing should be tightened as those hooks are refactored.

## Real API browser suite

`npm run test:e2e:api` uses `scripts/e2e-server.ts` to start a production Next.js server on port 4182 with an ephemeral MongoDB replica set. Six desktop/mobile journeys exercise real cookies and persistence. External requests are blocked; Google OAuth is not faked in production. The current date is used to avoid passing a stale daily challenge in future CI runs. Controlled browser clocks accelerate game waits without freezing module loading.

The database-service suite, real API browser suite, and fixture UI suite all remain separate so failures identify the layer involved. CI runs every suite and preserves both Playwright reports on failure.
