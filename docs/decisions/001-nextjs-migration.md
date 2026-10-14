# Decision 001: Staged Next.js migration

Date: 2026-10-14. Status: UI/backend/auth/test milestones implemented; Vercel preview configured; production cutover pending.

## Context

Rapidamente had a Vite/React UI on GitHub Pages and a small NestJS API backed by MongoDB on AWS Lambda. The user wants one codebase on Vercel, strong tests/documentation, improved game logic, and additional games. The old Firebase project is under an inaccessible account.

## Decision

Use Next.js App Router in the existing frontend repository. Preserve feature components/design and browser-based game/history initially. Use a configurable same-origin legacy API bridge until the backend services move into server-only TypeScript modules. Maintain MongoDB and existing player IDs/history. Use the free Better Auth framework with Google OAuth for the integrated application's authentication; optional paid auth infrastructure is not required.

Establish automated tests and CI with the migration. Small game correctness fixes needed to validate complete runs are documented and covered, while the broader engine/data redesign is deferred. Recover public Firebase settings from the existing deployed bundle for optional compatibility; do not depend on access to the old project.

## Consequences

Existing screens initially render through client-only dynamic boundaries, so they do not yet benefit from server-rendered game data. The interim bridge retains legacy backend security/score limitations and is not the final authenticated API. Domain changes require guest recovery planning. Vercel hosting and MongoDB costs remain separate from the free auth framework. Existing production systems remain available while checkpoints are validated.

## Implementation checkpoint

The temporary AWS bridge and Firebase dependency have been removed. Thin Node.js Route Handlers use native MongoDB domain services, real Better Auth signed sessions, and explicit database configuration. Returning users require a verified identity; public rankings expose no emails. Isolated replica-set integration tests and desktop/mobile browser journeys verify persistence and authorization. The personal Vercel preview uses a separate initially empty database. Google OAuth and source-data transfer remain release gates, and the old live deployment remains available.
