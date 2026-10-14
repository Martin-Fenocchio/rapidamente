import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { queueScore, syncPendingScore } from "./score-sync";
import { savePointsOfDay } from "src/utils/points/points-utils";

vi.mock("axios");
describe("authenticated score synchronization", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userID", "test-user");
    localStorage.setItem("userPoints", "12");
    savePointsOfDay(3, 6);
  });
  it("sends the queued total once, refreshes the cache, and skips subsequent result visits", async () => {
    queueScore();
    vi.mocked(axios.post).mockResolvedValue({ data: { points: 15, history: "[]" } });
    const first = syncPendingScore();
    const second = syncPendingScore();
    expect(first).toBe(second);
    await first;
    await syncPendingScore();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/results"), expect.objectContaining({ pointsOfDay: 3, time: 6 }));
    expect(localStorage.getItem("userPoints")).toBe("15");
    expect(localStorage.getItem("pendingScore")).toBeNull();
  });
  it("retains a failed save and retries the same total", async () => {
    queueScore();
    const pending = localStorage.getItem("pendingScore");
    vi.mocked(axios.post).mockRejectedValueOnce(new Error("offline"));
    await expect(syncPendingScore()).rejects.toThrow("offline");
    expect(localStorage.getItem("pendingScore")).toBe(pending);
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { points: 15, history: "[]" } });
    await syncPendingScore();
    expect(localStorage.getItem("pendingScore")).toBeNull();
  });
});
