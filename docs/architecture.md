# Application architecture

## Integrated application

Next.js App Router owns `/`, `/game`, `/score`, and `/players`. `/lab` exposes the old experimental tools only in development; production displays an unavailable message. `src/app/layout.tsx` supplies Spanish metadata, global styles, local font assets, optional analytics, and shared providers. Vite remains only as a Vitest dependency; React Router and GitHub Pages deployment scripts were removed.

The page files dynamically load existing feature screens with SSR disabled. This is an intentional migration boundary: localStorage, canvas/WebGL, charts, and game timers currently require the browser. The server renders an initial loading shell. Future work can render suitable profile/ranking content on the server without changing the interactive game boundary.

`src/features` retains onboarding, game, scores, and players. Shared visual components remain in `src/components`; utility rules remain in `src/utils`. Public image URLs go through `src/lib/assets.ts` to honor the optional base path. Browser navigation uses `next/navigation` and `next/link`. `src/lib/legacy-route.ts` maps the old known hash routes to App Router paths and rejects unknown/external destinations.

## Backend boundary

Browser code calls same-origin `/api/players`, `/api/me`, `/api/results`, and `/api/auth`. Next.js Route Handlers validate requests and call server-only MongoDB services. The AWS transport bridge and Firebase dependency are removed. MongoDB credentials and the Better Auth signing secret never enter browser bundles.

Existing `users` documents retain their ObjectIds and original totals/history. New `dailyResults` enforce one result per player/date; transactions update the result and accumulated total together. Better Auth uses separate `auth*` collections and maps its identity to the legacy player via `authUserId`. Recovery uses a verified email and rejects ambiguous matches. API mutations derive ownership from the signed database-backed session and validate the request Origin.

## Local state

Existing keys `userID`, `userPoints`, `points`, `timestamp`, and `GOOGLE_SIGNED_IN` remain display/cache data, not authorization. Server sessions establish ownership. New history entries carry a canonical Buenos Aires `isoDate` as well as the display date; legacy records remain intact. `pendingScore` queues a bounded daily result with a local identity marker; the API receives only date, daily points, and duration. Success refreshes the authoritative total/history. Retries retain the payload, and successful result refreshes do not resubmit.

On reload, `/api/me` restores the current server profile. An unrecognized legacy browser ID is retained in `legacyPlayerSnapshot`, then the player is asked to authenticate again. A raw ID cannot claim a player. Account changes do not replay pending scores into a different identity. A failed result carried across midnight needs an explicit expired-result resolution policy; the server rejects stale challenge dates rather than adding them silently.

Local history and guest identity are origin-scoped. Changing from GitHub Pages to Vercel requires a deliberate guest recovery/transfer strategy. Existing Google-linked players can be mapped from verified identity after conflict checks.

## Observability

Analytics is loaded only when `NEXT_PUBLIC_GA_ID` is configured. Sentry browser initialization is opt-in through `NEXT_PUBLIC_SENTRY_DSN`; build source-map integration is enabled only with a build-only `SENTRY_AUTH_TOKEN`. Server observability will be configured with the integrated backend. Test environments leave external observability off.
