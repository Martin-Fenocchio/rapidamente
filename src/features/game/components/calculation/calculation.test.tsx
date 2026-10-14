import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Calculation from "./calculation";
import { generateOptions } from "src/utils/game/game-utils";

describe("question interaction", () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout", "Date", "performance"] }));
  afterEach(() => vi.useRealTimers());
  const setup = (index = 0) => {
    const onAnswer = vi.fn();
    const view = render(<Calculation operation={{ operation: "8 + 7", result: 15 }} operationIndex={index} onAnswer={onAnswer} setCountdown={vi.fn()} />);
    return { onAnswer, ...view };
  };

  it("offers exactly four unique nonnegative choices, including the answer", () => {
    for (const result of [0, 1, 15, 100]) {
      const choices = generateOptions(result, () => 0);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(result);
      expect(choices.every(choice => choice >= 0)).toBe(true);
    }
  });
  it("accepts a correct answer once and cancels the timeout", () => {
    const { onAnswer } = setup();
    fireEvent.click(screen.getByRole("button", { name: "15" }));
    act(() => vi.advanceTimersByTime(10000));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true);
    expect(screen.getByText("Correcto!")).toBeInTheDocument();
  });
  it("ends the question on a wrong answer", () => {
    const { onAnswer } = setup();
    fireEvent.click(screen.getAllByRole("button").find(button => button.textContent !== "15")!);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(false);
    expect(screen.getByText("La respuesta correcta es 15")).toBeInTheDocument();
  });
  it.each([[0, 2500], [4, 4000]])("expires question %i at its exact configured deadline", (index, milliseconds) => {
    const { onAnswer } = setup(index);
    act(() => vi.advanceTimersByTime(milliseconds - 1));
    expect(onAnswer).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(false);
    expect(screen.getByText("Se agotó el tiempo")).toBeInTheDocument();
  });
  it("cleans up the question when leaving the screen", () => {
    const { onAnswer, unmount } = setup();
    unmount();
    act(() => vi.advanceTimersByTime(10000));
    expect(onAnswer).not.toHaveBeenCalled();
  });
});
