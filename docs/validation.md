# UI migration validation

Verified locally on 2026-10-14 with Node.js 24.21.0, Next.js 16.4.1, and React 18.3.1.

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, zero warnings |
| `npm run typecheck` | Passed, including Next.js route type generation |
| `npm test` | Passed: 37 tests across 8 files |
| `npm run build` | Passed: home, game, score, players, lab, and temporary API bridge |
| `npm run test:e2e` | Passed: 16 tests across desktop and mobile Chromium |
| `git diff --check` | Passed |
| Repository documentation links | All relative links resolved |
| Local environment ignore | `.env.local` confirmed ignored |

Browser checks ran against a production build, with mocked legacy API responses and all non-local browser requests blocked. Each browser case asserted no uncaught page errors. The first browser run exposed test-harness clock freezing and an overly broad alert selector; those were corrected before the final complete passing run.

Desktop and mobile screenshots were inspected against the original UI. Layout, typography, logo, and controls were preserved. Ranking fixture data, viewport sizes, and animated backgrounds differ; this was a manual visual review rather than an exact pixel comparison. Current captures are saved beside the original images in `docs/baseline/`.

No production records were queried or written during implementation/testing, and no live deployment was changed. Real Google login, database persistence, Vercel deployment, and CI execution on GitHub remain unverified until the corresponding milestone.

The build emits a React 18 deprecation warning because the existing card-flip dependency requires React 18. Legacy Sass unit-test compilation also warns about its older API. These warnings do not fail current checks and are recorded as follow-up work in `testing.md`.
