import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyPlayer, restorePlayer, CurrentPlayer } from "./player-session";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("axios", async importOriginal => {
  const actual = await importOriginal<typeof import("axios")>();
  return { ...actual, default: { ...actual.default, get } };
});
const player: CurrentPlayer = { _id: "new-session", name: "Ana", points: 10, history: "[]", isAnonymous: true };
beforeEach(() => { localStorage.clear(); get.mockReset(); });
describe("restoring the current player", () => {
  it("restores server data for the unchanged startup identity", async () => {
    get.mockResolvedValue({ data: player });
    await restorePlayer();
    expect(localStorage.getItem("userID")).toBe(player._id);
    expect(localStorage.getItem("userPoints")).toBe("10");
  });
  it("backs up a legacy identity when its session is unavailable", async () => {
    localStorage.setItem("userID", "legacy");
    get.mockRejectedValue({ isAxiosError: true, response: { status: 401 } });
    await restorePlayer();
    expect(localStorage.getItem("userID")).toBeNull();
    expect(JSON.parse(localStorage.getItem("legacyPlayerSnapshot")!).userID).toBe("legacy");
  });
  it("keeps a newly registered player when an older startup request fails", async () => {
    let fail!: (error: unknown) => void;
    get.mockReturnValue(new Promise((_, reject) => { fail = reject; }));
    const pending = restorePlayer();
    applyPlayer(player);
    fail({ isAxiosError: true, response: { status: 401 } });
    await pending;
    expect(localStorage.getItem("userID")).toBe(player._id);
    expect(localStorage.getItem("legacyPlayerSnapshot")).toBeNull();
  });
  it("does not apply an older identity after a new player is established", async () => {
    let finish!: (response: { data: CurrentPlayer }) => void;
    get.mockReturnValue(new Promise(resolve => { finish = resolve; }));
    const pending = restorePlayer();
    applyPlayer(player);
    finish({ data: { ...player, _id: "old-session", points: 1 } });
    await pending;
    expect(localStorage.getItem("userID")).toBe(player._id);
    expect(localStorage.getItem("userPoints")).toBe("10");
  });
});
