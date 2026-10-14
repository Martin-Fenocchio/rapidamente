import { describe, expect, it } from "vitest";
import { challengeDate, mergeHistory, readLegacyHistory, historyEntry } from "./history";

describe("server history", () => {
  it("preserves legacy fields and existing daily results", () => {
    const old = JSON.stringify([{ date: "10/14/2026", pointsOfDay: 4, extra: "legacy" }]);
    const merged = JSON.parse(mergeHistory(old, [{ date: "10/14/2026", pointsOfDay: 10, time: 20 }, { date: "10/15/2026", pointsOfDay: 2, time: 5 }]));
    expect(merged).toEqual([{ date: "10/14/2026", pointsOfDay: 4, extra: "legacy" }, { date: "10/15/2026", pointsOfDay: 2, time: 5 }]);
  });
  it("deduplicates dates inside the incoming payload", () => {
    expect(JSON.parse(mergeHistory(undefined, [{ date: "a", pointsOfDay: 3, time: 5 }, { date: "a", pointsOfDay: 8, time: 9 }]))).toHaveLength(1);
  });
  it.each(['{}', '[null]', '[{"pointsOfDay":4}]', 'invalid'])("rejects malformed stored history without overwriting it: %s", history => {
    expect(() => readLegacyHistory(history)).toThrow();
  });
  it("validates score/time bounds", () => {
    expect(historyEntry.safeParse({ date: "a", pointsOfDay: 11, time: 0 }).success).toBe(false);
    expect(historyEntry.safeParse({ date: "a", pointsOfDay: 1, time: -1 }).success).toBe(false);
  });
  it("uses the Buenos Aires date at midnight boundaries", () => {
    expect(challengeDate(new Date("2026-10-15T02:59:59Z"))).toBe("2026-10-14");
    expect(challengeDate(new Date("2026-10-15T03:00:00Z"))).toBe("2026-10-15");
  });
});
