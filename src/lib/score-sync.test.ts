import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { queueScore, syncPendingScore } from "./score-sync";
import { savePointsOfDay } from "src/utils/points/points-utils";

vi.mock("axios");
describe("legacy score synchronization", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userID", "test-user");
    localStorage.setItem("userPoints", "12");
    savePointsOfDay(3, 6);
  });
  it("sends the queued total once, refreshes the cache, and skips subsequent result visits", async () => {
    queueScore();
    vi.mocked(axios.put).mockResolvedValue({ data: { points: 15 } });
    const first = syncPendingScore();
    const second = syncPendingScore();
    expect(first).toBe(second);
    await first;
    await syncPendingScore();
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining("/users/update-points"), expect.objectContaining({ id: "test-user", points: 15 }));
    expect(localStorage.getItem("userPoints")).toBe("15");
    expect(localStorage.getItem("pendingScore")).toBeNull();
  });
  it("retains a failed save and retries the same total", async () => {
    queueScore();
    const pending = localStorage.getItem("pendingScore");
    vi.mocked(axios.put).mockRejectedValueOnce(new Error("offline"));
    await expect(syncPendingScore()).rejects.toThrow("offline");
    expect(localStorage.getItem("pendingScore")).toBe(pending);
    vi.mocked(axios.put).mockResolvedValueOnce({ data: { points: 15 } });
    await syncPendingScore();
    expect(localStorage.getItem("pendingScore")).toBeNull();
  });
});
