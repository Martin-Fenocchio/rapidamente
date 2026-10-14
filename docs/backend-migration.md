# Backend consolidation

## Milestone 1: Domain services

The frontend repository now contains MongoDB domain services under `src/server/players`, a reusable server-only connection under `src/server/db`, and runtime validation. These services are not exposed through unauthenticated mutation endpoints. The UI still uses the temporary bridge until Better Auth and authenticated routes are integrated.

The native MongoDB driver uses the existing `users` collection and preserves ObjectId player IDs, names, original score totals, email, and serialized history. Better Auth identities will be mapped through a separate `authUserId` field. Rankings project only IDs, names, and points. Recovery requires verified identity; duplicate legacy emails produce an explicit conflict rather than silently merging records.

New daily results use a separate `dailyResults` collection, a unique player/date index, and a transaction that records the result and increments the stored total together. The server accepts a bounded daily score, not a client-supplied accumulated total or target player ID. First completed attempt wins; retries return the existing total. This requires a replica set, as provided by MongoDB Atlas and the isolated test harness. The later game-engine milestone can validate individual answers; bounded reported scores are not comprehensive anti-cheat protection.

The canonical new challenge date is the Buenos Aires calendar day. Legacy date strings/extra history fields remain unchanged. New history entries include `isoDate` while retaining a compatible displayed date. Old ambiguous history dates will need an explicit recovery policy; do not silently rewrite them.

`MONGODB_URI` and `MONGODB_DB` are server-only and both mandatory. There is no production fallback and no database connection during module import or static builds. Configuration variable names are recorded in `.env.example`; credentials are never documented. Runtime connections reuse a bounded pool.

Testing is staged: pure history/date validation is covered in this milestone; the next milestone adds real isolated MongoDB integration coverage before these services become active API endpoints. No production database was connected or mutated for this milestone.

## Milestone 2: Isolated database integration tests

`npm run test:integration` starts its own ephemeral MongoDB 8.0.17 replica set on a random loopback port and stops it afterward. It does not read `MONGODB_URI`, `DATA_BASE`, or any `.env` file. A loopback guard rejects unexpected server addresses. No Docker installation or external database is required; the first run downloads the MongoDB binary.

The initial ten real database tests pass: guest persistence/retries, verified existing-player recovery, unverified-email rejection, conflicting-email rejection, public-field projection, atomic daily score updates, concurrent deduplication, rejection of target-ID/total manipulation, invalid/expired submissions, and transaction rollback for corrupted stored history. These checks are now part of CI.

## Milestone 3: Authenticated application

Next.js now owns all active API routes. Firebase and the AWS bridge are removed. Better Auth supplies real signed guest sessions and optional Google OAuth. Browser code submits bounded daily results and receives authoritative totals; it cannot target another player. Public rankings exclude emails/history. Canonical dates are carried in new history entries so restored history is visible across browser date formats.

Verified locally: production build, lint/typecheck, 39 unit/component tests, 20 real MongoDB/Better Auth integration tests, and 16 desktop/mobile UI cases. Real Google OAuth is pending the credentials the user chose to configure later. Production has not been connected or changed.

## Milestone 4: Browser-to-database verification

Six browser journeys pass through the actual Next.js API, real Better Auth cookies, and real MongoDB transactions on desktop/mobile. The harness owns a loopback replica set and injects only its generated URI/signing secret into its child server. It contains no production authentication bypass and never reads the private preview configuration. Tests cover guest registration/private recovery/logout, ten correct answers with authoritative persistence/retry/reload/daily blocking, and denial of unauthenticated, cross-origin, or impersonated updates.

Real browser checks found and fixed the unavailable-Google prompt and a canvas that intercepted logout clicks. These checks are now included in CI alongside the 16 fixture-based UI journeys. Google OAuth itself still requires the user-supplied credentials and a staging test account.

Preview origin configuration is tested separately: explicit canonical URLs take precedence, exact branch/deployment hosts are trusted, and missing or short signing secrets fail closed. CI uses one browser worker because concurrent animated screens overloaded the runner in the previous milestone.
