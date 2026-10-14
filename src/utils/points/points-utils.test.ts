import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { checkVavePlayedToday, getHistoricalPoints, getScoreOfToday, savePointsOfDay } from "./points-utils";

describe("daily history", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 14, 12));
  });
  afterEach(() => vi.useRealTimers());
  it("stores score and duration and marks today as played", () => {
    expect(checkVavePlayedToday()).toBe(false);
    savePointsOfDay(4, 8);
    expect(checkVavePlayedToday()).toBe(true);
    expect(getScoreOfToday()).toMatchObject({ pointsOfDay: 4, time: 8 });
  });
  it("retains the first attempt for each day", () => {
    savePointsOfDay(0, 3);
    savePointsOfDay(10, 20);
    expect(getHistoricalPoints()).toHaveLength(1);
    expect(getScoreOfToday()?.pointsOfDay).toBe(0);
  });
  it("allows tomorrow's attempt without losing yesterday", () => {
    savePointsOfDay(3, 5);
    vi.setSystemTime(new Date(2026, 9, 15, 12));
    expect(checkVavePlayedToday()).toBe(false);
    savePointsOfDay(5, 9);
    expect(getHistoricalPoints()).toHaveLength(2);
    expect(getScoreOfToday()?.pointsOfDay).toBe(5);
  });
});
