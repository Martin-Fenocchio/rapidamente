# Temporary API bridge

`src/app/api/legacy/[...path]/route.ts` uses the Next.js Node.js runtime. It is a temporary transport for the existing NestJS backend; domain services have not moved yet.

| Browser endpoint | Method | Upstream endpoint |
| --- | --- | --- |
| `/api/legacy/users` | GET | `/users` |
| `/api/legacy/users` | POST | `/users` |
| `/api/legacy/users/update-points` | PUT | `/users/update-points` |
| `/api/legacy/users/link-email` | PUT | `/users/link-email` |
| `/api/legacy/users/email/:email` | GET | `/users/email/:email` |

Only these method/path combinations are accepted. Upstream URL comes exclusively from server-only `LEGACY_API_URL`; no query or client header can select it. Requests have a 10-second timeout and reject upstream redirects. Responses preserve upstream status/body/content type and use `Cache-Control: no-store`. Requests never forward browser cookies or authorization headers. Unsupported paths return 404, missing upstream configuration returns 503 (`LEGACY_API_NOT_CONFIGURED`), and network failures return 502 (`LEGACY_API_UNAVAILABLE`).

Legacy payloads remain `{ name, points, email? }`, `{ id, points, history? }`, and `{ userId, email, history? }`. History is serialized JSON. The old backend accepts client-supplied identity and total scores. This bridge is not the final authenticated API; do not treat it as a completed Better Auth migration.

The next stage will introduce verified sessions, input validation, protected mutations, private/public response shapes, and database integration tests. Keep legacy compatibility and intentional contract changes separately documented.
