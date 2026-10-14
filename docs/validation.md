# Migration verification

Verified locally on 2026-10-14 with Node.js 24.21.0, Next.js 16.4.1, and React 18.3.1.

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, zero warnings |
| `npm run typecheck` | Passed, including Next.js route types |
| `npm test` | 39 tests passed across eight files |
| `npm run test:integration` | 23 tests passed across three files |
| `npm run build` | Passed: screens and consolidated auth/player/result APIs |
| `npm run test:e2e` | 16 desktop/mobile Chromium UI cases passed |
| `npm run test:e2e:api` | Six desktop/mobile real API/database cases passed |
| `git diff --check` | Passed before each milestone commit |

The unit/component suite uses fixtures and controlled clocks. Integration tests own a MongoDB 8.0.17 loopback replica set and verify real transactions, duplicate concurrent submissions, rollback, verified legacy recovery, guest linking, signed sessions, expiry/logout, input rejection, and origins. Browser suites run production Next.js builds: one isolates the UI with API fixtures; the other uses actual Better Auth cookies and real MongoDB transactions. External requests are blocked. No production account or production database credential is used by automated tests.

The real browser suite exposed an unavailable-Google prompt and a background canvas intercepting logout; both were fixed and the complete suite passed. Earlier fixture browser checks failed on the shared GitHub runner with timeouts; CI now runs those animated screens sequentially and retains traces without automatic retries. Final remote results are recorded below after completion.

Desktop/mobile screenshots were inspected against the original UI during the initial migration. Layout, typography, logo, and controls were preserved. This was a manual visual review, not an exact pixel comparison; original and migration captures are in `docs/baseline/`.

## Release limits

Google OAuth is disabled until the deferred client credentials are configured. Verified-identity recovery is integration-tested using synthetic legacy fixtures, but real OAuth and returning production players are not yet verified. Automated tests cover the migration's critical paths, not every legacy component, accessibility behavior, browser engine, or comprehensive anti-cheat rules.

No source player records have been queried, copied, or changed. The separate preview database was created empty and hosted verification uses synthetic players only. Live GitHub Pages and AWS traffic remain unchanged. Source backup/copy requires separate approval. Vercel GitHub integration and repository branch protection still require configuration.

The build warns that React 18 is deprecated by Next.js because the current card-flip dependency requires it. Legacy Sass test compilation warns about its older API. Both are documented follow-up work in `testing.md`.

## Hosted preview evidence

[Protected preview](https://rapidamente-cfyan98ws-personal-385b.vercel.app) deployed successfully from application commit `97f895d`. Twelve hosted checks passed: configuration, denied anonymous private access, real guest cookie, registration, owned-player retrieval, score persistence, first-result retention on retry, target-ID rejection, origin rejection, public-field projection, logout, and session invalidation. Verification created one synthetic player only in `test_nextjs_preview`; source records read: zero. Preview protection remains enabled.

The earlier database milestone passed [GitHub Actions run 38639197462](https://github.com/Martin-Fenocchio/rapidamente/actions/runs/38639197462). The browser verification milestone is undergoing [run 38642570978](https://github.com/Martin-Fenocchio/rapidamente/actions/runs/38642570978); consult its final result and the branch's latest run before merging. Deployment documentation commits trigger the same complete workflow.
