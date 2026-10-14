# Pre-migration baseline

Captured on 2026-10-14 before replacing the Vite runtime, using Node.js 24.21.0.

- `npm ci`: passed.
- Original `npm run build`: passed, with Sentry-token, base-path, Sass, sourcemap, and large-bundle warnings.
- Original `npm run lint`: failed before scanning code because the flat ESLint config mixed incompatible legacy configuration entries (`Unexpected key "0"`).
- Original `npx vitest run`: failed while collecting tests (`auth/invalid-api-key`) because Firebase initialized without environment configuration. Vitest also inherited the Vite Sentry build plugin.
- After isolating the test setup, the question-bank test detected incorrect arithmetic values. Five stored answers were corrected; the complete bank is now checked.
- Source review found completion compared the question index to the number of sets, and question timers allowed more than their configured deadlines.

`vite-desktop.png` and `vite-mobile.png` show the original home screen at 1280×900 and 390×844. Capture mocked the API and blocked other external requests. Browser uncaught-error lists were empty for both captures. The six public legacy Firebase fields were recovered from the deployed bundle into the ignored `.env.local` for this capture, then renamed to Next.js-compatible prefixes during migration. No values are recorded in these docs.

Current screenshots are attached to the Playwright test report for comparison. Baseline captures are visual references, not pixel-diff golden tests, because animated backgrounds are time-dependent.
