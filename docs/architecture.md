# Application architecture

## Current migration milestone

Next.js App Router owns `/`, `/game`, `/score`, and `/players`. `/lab` exposes the old experimental tools only in development; production displays an unavailable message. `src/app/layout.tsx` supplies Spanish metadata, global styles, local font assets, optional analytics, and shared providers. Vite remains only as a Vitest dependency; React Router and GitHub Pages deployment scripts were removed.

The page files dynamically load existing feature screens with SSR disabled. This is an intentional migration boundary: localStorage, canvas/WebGL, charts, and game timers currently require the browser. The server renders an initial loading shell. Future work can render suitable profile/ranking content on the server without changing the interactive game boundary.

`src/features` retains onboarding, game, scores, and players. Shared visual components remain in `src/components`; utility rules remain in `src/utils`. Public image URLs go through `src/lib/assets.ts` to honor the optional base path. Browser navigation uses `next/navigation` and `next/link`. `src/lib/legacy-route.ts` maps the old known hash routes to App Router paths and rejects unknown/external destinations.

## Backend boundary

Browser code calls the same-origin `/api/legacy` bridge. The server reads `LEGACY_API_URL` and forwards only the supported legacy user endpoints. Empty configuration makes upstream access unavailable. This avoids cross-origin browser configuration and accidental production calls during local work. It does not replace the NestJS business logic or repair its identity contract.

No MongoDB code or database credentials are bundled into this UI milestone. Better Auth and MongoDB services will move into server-only modules during the next milestone. Authentication records will be separate from existing game records, preserving player IDs through an explicit mapping.

## Local state

Existing keys `userID`, `userPoints`, `points`, `timestamp`, and `GOOGLE_SIGNED_IN` are retained. Daily records keep the existing locale-formatted date strings. New `pendingScore` stores a fixed legacy update payload after game completion. Results sync that pending payload, retain it on failure, and offer retry. An in-flight promise prevents concurrent submissions in one tab; success refreshes cached total and clears that payload. Opening or refreshing results without a pending payload makes no score update.

This is an interim legacy synchronization fix. The next backend stage must define authoritative totals and cross-device conflict rules. It must also address a failed pending submission carried into a later day and multiple tabs/devices; current queueing is not a general synchronization engine.

Local history and guest identity are origin-scoped. Changing from GitHub Pages to Vercel requires a deliberate guest recovery/transfer strategy. Existing Google-linked players can be mapped from verified identity after conflict checks.

## Observability

Analytics is loaded only when `NEXT_PUBLIC_GA_ID` is configured. Sentry browser initialization is opt-in through `NEXT_PUBLIC_SENTRY_DSN`; build source-map integration is enabled only with a build-only `SENTRY_AUTH_TOKEN`. Server observability will be configured with the integrated backend. Test environments leave external observability off.
