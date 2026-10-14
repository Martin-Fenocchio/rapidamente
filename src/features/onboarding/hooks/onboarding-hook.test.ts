import { act, renderHook } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { useOnboardingLogic } from "./onboarding-hook";

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

describe("onboarding interactions", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ googleSignInEnabled: false }) })));
  afterEach(() => vi.unstubAllGlobals());
  afterEach(() => vi.useRealTimers());
  it("keeps the name dialog open and loading until registration completes", async () => {
    const { result } = renderHook(useOnboardingLogic);
    act(() => result.current.setNameController("Ana"));
    let complete!: () => void;
    const save = vi.fn(() => new Promise<void>(resolve => { complete = resolve; }));
    let pending!: Promise<void>;
    act(() => { pending = result.current.handleOnSaveName(save); });
    expect(result.current.isSavingName).toBe(true);
    expect(result.current.openModalName).toBe(true);
    await act(async () => { complete(); await pending; });
    expect(save).toHaveBeenCalledWith("Ana");
    expect(result.current.isSavingName).toBe(false);
    expect(result.current.openModalName).toBe(false);
  });
  it("shows a recoverable error for a failed registration", async () => {
    const { result } = renderHook(useOnboardingLogic);
    act(() => result.current.setNameController("Ana"));
    await act(() => result.current.handleOnSaveName(async () => { throw new Error("offline"); }));
    expect(result.current.errormessage).toContain("Ocurrió un error");
    expect(result.current.openModalName).toBe(true);
    expect(result.current.isSavingName).toBe(false);
  });
  it("requires a name before sending registration", async () => {
    const { result } = renderHook(useOnboardingLogic);
    const save = vi.fn();
    await act(() => result.current.handleOnSaveName(save));
    expect(save).not.toHaveBeenCalled();
    expect(result.current.errormessage).toBe("Debes escribir un nombre");
  });
  it("navigates to the Next.js game route after the entry animation", () => {
    vi.useFakeTimers();
    const { result } = renderHook(useOnboardingLogic);
    act(() => result.current.handleStartGame());
    expect(result.current.showAnimation).toBe(true);
    act(() => vi.advanceTimersByTime(799));
    expect(router.push).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(router.push).toHaveBeenCalledWith("/game");
  });
  it("cancels delayed navigation when leaving onboarding", () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(useOnboardingLogic);
    act(() => result.current.handleStartGame());
    unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(router.push).not.toHaveBeenCalled();
  });
});
