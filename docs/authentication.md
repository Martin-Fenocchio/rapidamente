# Better Auth

The free MIT-licensed Better Auth 1.7.8 framework replaces Firebase. It uses the same MongoDB deployment as game data but separate collections: `authUsers`, `authAccounts`, `authSessions`, and `authVerifications`. Existing game records remain in `users`, with an explicit `authUserId` mapping; existing IDs, totals, and history are preserved.

## Sessions and guest play

Named registration first establishes an anonymous Better Auth session, then creates its game profile. Cookies are signed and HttpOnly, using HTTPS security attributes in hosted environments. Private data and mutations validate the session on the server. Sessions expire after seven days and are refreshed according to Better Auth's session policy; cookie caching is disabled for server authorization. Logout invalidates the database session and clears local active-player data.

Guest sign-in does not prove ownership of a legacy browser ID. The app preserves an old local snapshot before asking the player to authenticate again. A verified Google login recovers an unambiguous email-linked legacy player. A guest without email cannot be safely recovered merely by presenting a name or raw ID; keep original snapshots/data available for a separately verified recovery process.

When a guest signs in with Google, a trusted server callback maps the verified account, transfers its new daily results transactionally, preserves an existing target day's result when dates overlap, and retires the source guest from rankings. Repeated linking does not double-count points. Retired guest sessions cannot submit new results. Source game records remain available for migration audit.

## Required configuration

- `MONGODB_URI` and explicit `MONGODB_DB` (server only).
- `BETTER_AUTH_SECRET`: random server-only signing secret of at least 32 characters.
- `BETTER_AUTH_URL`: trusted application URL; a Vercel preview can fall back to its platform-provided branch URL.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: enable Google OAuth when both are present. With neither configured, named guest play remains available and Google is shown as pending.

## Google setup (user deferred)

Create a Web application OAuth client in a Google Cloud project you control. Configure its consent audience and test users while in testing. Register the exact local and deployed redirect URIs, for example `http://localhost:3000/api/auth/callback/google` and `https://YOUR-STABLE-HOST/api/auth/callback/google`. A subpath deployment requires that subpath in the callback URL. Save the secret only in the ignored local environment and Vercel's appropriate environment scope.

Google credentials were explicitly deferred by the user. Real Google OAuth has not been exercised; its callback/configuration must be checked with a test account after credentials are supplied. Automated tests exercise real Better Auth guest cookies, expiry, logout, server authorization, verified recovery rules, and guest linking without impersonating a live Google user.

References: [Next.js integration](https://better-auth.com/docs/integrations/next), [MongoDB adapter](https://better-auth.com/docs/adapters/mongo), [Google OAuth](https://better-auth.com/docs/authentication/google), [Anonymous sessions](https://better-auth.com/docs/plugins/anonymous).
