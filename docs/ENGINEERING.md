# Testing and documentation agreement

This project treats automated tests and maintained documentation as part of implementation. These requirements apply to the Next.js migration, backend integration, game improvements, and new games.

## Completion requirements

Every change must include:

1. A clear description of the expected behavior and acceptance criteria.
2. Appropriate verification of what changed, including relevant error cases and boundaries. Behavior changes require automated tests; documentation-only changes need review of accuracy and links rather than artificial code tests.
3. Updates to affected documentation, or an explicit explanation that no documentation update is needed.
4. A report of checks actually run, their results, and any unresolved limitations.

Bug fixes should include a regression test that fails for the original defect. Migration tests should verify intended product behavior rather than freeze known bugs into the specification. Changes to rules must identify intentional differences from the previous version.

## Test layers

| Layer | Tool/approach | What belongs here |
| --- | --- | --- |
| Game and utility logic | Vitest | Scoring, question correctness, timers, dates, streaks, daily limits, history conflicts |
| Client components | React Testing Library + Vitest | Input, answer feedback, loading/error states, keyboard interaction |
| Server/API | Integration tests with isolated database | Validation, identity, authorization, persistence, retries, duplicate submissions |
| Browser journeys | Playwright | Registration, complete game, timeout, results, history, rankings, navigation/refresh, mobile flows |
| Exploration | AI-assisted and manual browser review | Visual issues and unexpected flows; repeatable issues become automated regressions |

Prefer behavior assertions over implementation snapshots or tests that duplicate the implementation. Test critical rules at their narrowest useful layer; do not repeat every case through the browser. Async server-rendered flows are verified through integration/browser tests where unit tooling is unsuitable.

## Determinism and isolation

- Control dates, randomness, and clocks for rule and timer tests. Verify both configured durations and boundary behavior.
- Stub external APIs in UI tests. Maintain a separate integration/browser suite using the real local application and an isolated test database.
- Never run automated write tests against production. Use explicit test environment configuration and fail clearly if it is absent or points at production.
- Test sign-in through a supported emulator or test identity boundary; verify real provider integration separately in staging with a test account.
- Include retry, network failure, duplicate completion, refresh, and concurrent-client scenarios when implementing persistence.
- Capture browser traces/screenshots on failure. Investigate flaky tests rather than relying on retries to hide them.

## CI and release checks

The migration must establish CI jobs for lint, type checking, unit/component tests, API integration tests, a production build, and critical Playwright journeys. Configure these as required checks where repository settings permit. Commands below describe the target interface; unit/component and browser checks are implemented in this milestone. Real database integration tests remain pending:

```text
npm run lint
npm run typecheck
npm run test
npm run test:integration
npm run build
npm run test:e2e
```

Playwright release checks should exercise a production build. Begin with Chromium and mobile viewport coverage; add WebKit/Firefox coverage for the supported browser matrix. A release must not proceed with unexplained failing required checks.

The frontend now has lint, typecheck, Vitest, production build, and Playwright commands plus a CI workflow. The workflow has not yet run remotely and branch-protection requirements are not configured. Real database integration gates will be added with backend integration.

## Documentation system

Keep implementation documentation in this repository so it is reviewed and versioned with code:

- `README.md`: purpose, local setup, supported runtime, available commands, links to detailed docs.
- `docs/architecture.md`: client/server boundaries, feature organization, dependencies, and important data flows.
- `docs/game-rules.md`: scoring, timing, challenge selection, daily limits, timezone, and future game-specific rules.
- `docs/api.md`: endpoints, validation, identity requirements, errors, and compatibility notes.
- `docs/testing.md`: commands, fixtures, environment isolation, browser coverage, and troubleshooting.
- `docs/deployment.md`: Vercel setup, configuration variable names, domains, preview checks, cutover and rollback.
- `docs/decisions/`: short architecture decision records for consequential choices, including context, decision, consequences, and status.

Create these documents as the corresponding systems are established; keep an honest distinction between planned and implemented behavior. Record configuration names and setup steps, never secret values. Use code comments for intent or non-obvious constraints, with the broader explanation in docs. Avoid duplicating facts across many documents.

During migration, retain and update the shared workspace's `PROJECT_OVERVIEW.md` and `NEXTJS_MIGRATION_PLAN.md`. Move durable implementation details into the repository documents as each stage is delivered.

## Review checklist

- Does the change satisfy its acceptance criteria?
- Are relevant success, failure, and boundary cases covered?
- Have appropriate checks passed, with evidence reported?
- Are affected docs current and do documented commands work?
- Does the change preserve player data or explain its migration?
- Have intentional behavior changes and material deployment implications been explained?

## Current deployment evidence

Verified on 2026-10-14 by fetching the public HTML and deployed JavaScript:

- Frontend: https://martin-fenocchio.github.io/rapidamente/ (GitHub Pages).
- The deployed bundle calls `https://mog81hbjjf.execute-api.sa-east-1.amazonaws.com` (AWS API Gateway, São Paulo region).
- The API root responded with `Hello World!`.
- Local frontend scripts publish the built `dist` directory using `gh-pages`.
- AWS CLI confirmed the API integrates with Lambda `rapidamente`, running `nodejs22.x` with handler `dist/index.handler`. Its `DATA_BASE` value was saved only in the ignored backend `.env`. Database connectivity and the active backend commit have not been inspected.
- Agreed target: one Next.js application deployed on Vercel.
