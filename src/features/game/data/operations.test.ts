import { afterEach, describe, expect, it, vi } from "vitest";
import { getOperationsOfDay, OPERATIONS } from "./operations";
import { getGameTime } from "src/utils/game/game-utils";

describe("game rules", () => {
  afterEach(() => vi.useRealTimers());
  it("selects a ten-question challenge by weekday", () => {
    vi.useFakeTimers();
    for (let day = 0; day < 7; day++) {
      vi.setSystemTime(new Date(2026, 9, 11 + day, 12));
      expect(getOperationsOfDay()).toEqual(OPERATIONS[day]);
      expect(getOperationsOfDay()).toHaveLength(10);
    }
  });
  it("gives the first four questions 2.5 seconds, then 4 seconds", () => {
    expect(getGameTime(0)).toBe(2.5);
    expect(getGameTime(3)).toBe(2.5);
    expect(getGameTime(4)).toBe(4);
    expect(getGameTime(9)).toBe(4);
  });
  it("has mathematically correct answers in every question set", () => {
    for (const set of OPERATIONS) {
      for (const question of set) {
        expect(question.operation).toMatch(/^[\d\s+x/()-]+$/);
        const result = Function(`return (${question.operation.replaceAll("x", "*")})`)();
        expect(question.result, question.operation).toBe(result);
      }
    }
  });
});
