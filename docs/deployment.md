# Deployment and configuration

## Current deployment

The live game remains on [GitHub Pages](https://martin-fenocchio.github.io/rapidamente/), calling the original AWS API Gateway/Lambda in São Paulo. The consolidated application uses the personal Hobby Vercel project `personal-385b/rapidamente`, Node.js 24, the Next.js preset, and `npm run build`. No static export is used. The project root is this repository.

Preview uses the separate MongoDB database `test_nextjs_preview`. It began empty; only synthetic verification players are written there. No source player records have been read, copied, or modified. Server code requires an explicit database name and never falls back to the URI's default database. MongoDB must support transactions (a replica set).

The MongoDB connection credential and a newly generated Better Auth secret were added to **Preview** following explicit approval. The existing credential may retain access to the source database: obtain a database-scoped preview credential before sharing staging broadly. Secrets are not included in source, docs, browser bundles, or CLI arguments. `.env*`, `.vercel`, and `.migration-private` are ignored; `.vercelignore` also excludes them from uploads (except the empty `.env.example`).

## Variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Server | MongoDB connection credential |
| `MONGODB_DB` | Server | Mandatory explicit application database |
| `BETTER_AUTH_SECRET` | Server | Random signing secret, at least 32 characters |
| `BETTER_AUTH_URL` | Server | Canonical app URL; localhost for development |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Server | Optional Google OAuth client; both required to enable sign-in |
| `NEXT_PUBLIC_BASE_PATH` | Build/public | Empty for the Vercel root deployment |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_SENTRY_DSN` | Build/public | Optional observability |
| `SENTRY_AUTH_TOKEN` | Build | Optional source-map upload |

For previews without `BETTER_AUTH_URL`, auth derives its URL from `VERCEL_BRANCH_URL` or `VERCEL_URL`. Those exact platform-provided origins are also trusted for mutations; unrelated origins are denied. Set a stable explicit canonical URL before configuring Google OAuth. Public variables and the base path require a rebuild when changed. Production and Preview secrets are separate Vercel configurations.

For development, copy `.env.example` to `.env.local` and supply an isolated replica-set database and random secret. Automated tests supply their own local databases and never read private preview credentials.

## Preview releases

```sh
vercel link --scope personal-385b --project rapidamente
vercel deploy --scope personal-385b --target=preview --yes
vercel curl /api/config --deployment <preview-url> --scope personal-385b
```

Always specify `--target=preview`: Vercel assigned the initial deployment of the new project to Production despite no `--prod` flag. That temporary deployment was removed; the existing live game was unaffected. Preview deployment protection remains enabled. Authorized Vercel users can access previews; `vercel curl` handles protection for CLI checks.

GitHub automatic deployment is pending: the Vercel GitHub integration could not link this repository because it needs repository admin/write access. Grant the Vercel GitHub app access to `Martin-Fenocchio/rapidamente`, then connect this existing personal project. Until then releases use the CLI. GitHub Actions independently runs all checks; configure its `checks` job as required for merges when repository permissions allow.

## Google OAuth and returning players

Google credentials were deliberately deferred. Guest play works; Google sign-in remains disabled. In a Google Cloud project you control, configure a web OAuth client, the chosen canonical origin, and redirect URI `<canonical-url>/api/auth/callback/google`. Store both client values in the appropriate Vercel environment and redeploy. Verify real sign-in, sign-out, and account linking in staging with a test account before release.

A verified Google email can recover a unique legacy player while preserving the player ID, points, and serialized history. Duplicate emails or an already-linked identity fail explicitly. Existing Firebase sessions and localStorage IDs do not authorize new API writes. Guest identities on the old GitHub Pages origin cannot transfer automatically to a new origin; agree on a recovery flow before cutover.

## Cutover and rollback

1. Obtain approval for an owner-only source backup and any staging copy of player emails/history. Validate a restore into an isolated database, including ObjectIds, totals, history, and duplicate-email handling. This data transfer is still pending approval; the deployed preview contains no copied production players.
2. Verify Google OAuth, returning accounts, guest recovery, canonical timezone/daily limits, and monitoring. Review intentional API/auth changes in `api.md` and `authentication.md`.
3. Pause legacy score writes during the transition, take a final backup, and validate the final snapshot. Avoid simultaneous writes through incompatible backends.
4. Configure Production variables for the approved database, stable URL, and Google client. Run all CI checks and production-build acceptance journeys before switching the public link/domain.
5. Keep the old AWS deployment available while validating the release. If rollback is needed before new writes, restore the old traffic path. After new writes, pause writes and reconcile the recorded results first: do not blindly restore an older backup or run both writers.
6. Retire AWS only after the agreed verification period and retain backups according to the chosen policy.

No production cutover, source-data backup/copy, or AWS retirement has been performed by the preview milestone.
