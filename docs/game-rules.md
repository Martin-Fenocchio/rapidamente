# Current game rules

The browser chooses ten questions by local weekday (`Date.getDay()`), using the first seven sets in the static question bank. Challenges repeat weekly. One point is earned for each correct answer. A wrong answer or timeout ends the run; completing ten answers earns ten points.

The opening countdown lasts four seconds. Questions 1–4 allow 2.5 seconds each; questions 5–10 allow 4 seconds. The migrated timer uses a monotonic deadline with 50 ms updates, rejects answers received at or after the deadline, and cancels on answer/unmount. Background-tab scheduling can delay the feedback callback but cannot make a late answer valid. A run produces one completion and navigates to results after 2.5 seconds of feedback.

Daily history retains the first attempt for each date, including a zero-point attempt. Home blocks another attempt today; direct `/game` navigation also redirects to results if the current local history already contains today. These are browser rules, not server-enforced anti-cheat protections.

## Corrections in the migration

- Completion compares against the active challenge's length, fixing a crash after ten correct answers.
- Time limits now match the configured 2.5/4 seconds; the previous implementation used coarse one-second ticks and delayed expiration.
- Answer/timeout callbacks are single-use and cleaned up when leaving a question.
- Wrong stored results corrected: `28 + 12 / 4 + 10` → 41; `40 / 8 + 4 + 12` → 21; `20 + 12 / 4 + 18` → 41; `18 + 12 / 4 + 23` → 44; `18 + 30 / 5 + 18` → 42.
- Choice generation uses a finite pool instead of an unbounded random loop.
- Results refresh does not submit a score again after a successful save.

Existing historical scores are not recalculated. Date locale assumptions, Monday calendar offsets on Sundays, zero-score share/speed formatting, challenge uniqueness, ranking resets, and cross-device daily limits remain follow-up game refactor work. Changing these requires a documented rule and regression tests.
