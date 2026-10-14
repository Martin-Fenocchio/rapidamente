# Integrated API

All handlers run in Next.js. MongoDB and Better Auth are server-only; the legacy AWS bridge has been removed.

| Endpoint | Method | Access and behavior |
| --- | --- | --- |
| `/api/players` | GET | Public ranking: `_id`, `name`, `points`; excludes emails/history and retired guests |
| `/api/players` | POST | Session required; `{ name }` resolves/creates this session's player at zero points |
| `/api/me` | GET | Session required; own player ID, name, points, history, anonymous status |
| `/api/results` | POST | Session + exact trusted Origin required; `{ date, pointsOfDay, time }` |
| `/api/config` | GET | Public Google-provider availability and current challenge date |
| `/api/auth/*` | GET/POST | Better Auth session, guest sign-in, Google OAuth, logout endpoints |

Mutations reject client-provided target IDs, accumulated totals, emails, and extra fields. Results are bounded to integers 0–10, duration 0–300 seconds, and today's canonical Buenos Aires date. The server increments totals transactionally once per player/day. Existing historical totals are preserved. Retries return the recorded result rather than adding points again; existing known daily history also prevents replay of a legacy score.

Private data is selected from a validated server session, never a browser-storage ID. New Google sessions map verified emails to existing players only when there is one unambiguous match. Conflicts return `ACCOUNT_LINK_CONFLICT` (409); no guessing or automatic combination of duplicate legacy email records. Old `/users/email`, `/link-email`, and `/update-points` endpoints are not exposed in Next.js.

Errors are JSON `{ message }`: invalid input 400, missing/expired identity 401, bad origin 403, missing player 404, linking/date conflict 409, and missing configuration or service failure 503. Driver errors and credential values are not included in responses. API responses use `Cache-Control: no-store`.

Scores are still bounded browser-reported daily results; individual answer/timing validation is part of the later game-engine refactor. Authentication protects ownership and the total calculation, not every possible cheating strategy.
