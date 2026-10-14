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
```

Node.js 24 is the development/CI target. Playwright starts its own production server on port 4181 and fails if that port is already occupied. Build before browser tests. The production-build base path must be empty for the current browser-suite configuration; a subpath deployment needs a separate smoke check.

## Isolation

Vitest configuration is independent of Next.js and Sentry. It uses jsdom for browser components and a Node environment for mocked route-handler tests. API tests stub `fetch`; they do not contact AWS or a database. Component tests mock Next.js navigation where needed. History is cleared between tests, and clocks are controlled for timing/date cases.

Playwright covers desktop Chromium and a Pixel 7 viewport, using a fixed Wednesday date and controlled browser clocks. All legacy API requests receive test fixtures. All non-local browser requests are blocked, including analytics and Firebase. The test server has an empty `LEGACY_API_URL`, so unmocked bridge calls cannot fall through to AWS. No database or personal login is required.

## Coverage

- Daily history storage, first-attempt retention, and next-day access.
- Weekday challenge selection, timing constants, and arithmetic correctness of the entire bank.
- Unique answer options, correct/wrong answers, exact deadlines, and timer cleanup.
- Registration awaiting completion, failure recovery, required input, and entry navigation.
- Pending-score single-flight behavior, cache refresh, and retry persistence.
- Allowed API bridge paths, unavailable configuration/upstream, request bodies/statuses, and no-cache responses.
- Legacy hash routing, rejecting unknown/external routes.
- Browser journeys: registration/reload and failed registration, ten correct answers, wrong answer/daily blocker, direct route guard, timeout, failed-save retry, leaderboard/hash links/refresh, and desktop/mobile home assets.

The current suite is a migration safety net, not exhaustive coverage of every legacy component. Real MongoDB integration, Better Auth sessions, Google OAuth, cross-device conflicts, other browser engines, accessibility, and remaining calendar/streak edge cases require subsequent coverage.

Backend-service milestone: `npm run test:integration` now exercises real MongoDB transactions in an ephemeral loopback replica set. It never reads production environment files. First run downloads MongoDB 8.0.17; later runs reuse the cached binary. Better Auth and endpoint/session tests are added in the authentication milestone.

## CI and evidence

`.github/workflows/ci.yml` runs lint, tests, production build, typecheck, and both browser projects on pushes to main and pull requests. It retains Playwright reports and traces on failure. The workflow is prepared locally; it runs remotely once pushed. Repository branch-protection settings still need these checks marked required.

`docs/baseline/` contains pre-migration screenshots and original check results. Browser runs attach current home screenshots in the test report. Review screenshots visually rather than interpreting a successful capture as proof of visual equivalence.

Known tooling debt: React 18 is temporarily retained because `react-card-flip` declares React 18 peers. Next.js 16 supports it but emits a deprecation warning; replace that component and migrate to React 19 in a separate tested change. Legacy Sass imports emit deprecation warnings. Explicit-any lint exceptions are scoped to existing graphics and a few legacy helpers; rule-of-hooks, unused-variable, and TypeScript checks remain active. Hook dependencies are enforced for App Router and game components; remaining legacy hook dependency auditing should be tightened as those hooks are refactored.
