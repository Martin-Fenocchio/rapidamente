// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, PUT } from "./[...path]/route";

describe("temporary API bridge", () => {
  const fetchMock = vi.fn();
  beforeEach(() => { vi.stubGlobal("fetch", fetchMock); vi.stubEnv("LEGACY_API_URL", "http://127.0.0.1:3001"); });
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
  const context = (path: string[]) => ({ params: Promise.resolve({ path }) });
  it("does not contact AWS or any upstream when unconfigured", async () => {
    vi.stubEnv("LEGACY_API_URL", "");
    const response = await GET(new NextRequest("http://localhost/api/legacy/users"), context(["users"]));
    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("blocks paths outside the existing contract", async () => {
    const response = await GET(new NextRequest("http://localhost/api/legacy/admin"), context(["admin"]));
    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("forwards a leaderboard response without caching", async () => {
    fetchMock.mockResolvedValue(new Response('[{"name":"Test","points":3}]', { status: 200, headers: { "Content-Type": "application/json" } }));
    const response = await GET(new NextRequest("http://localhost/api/legacy/users"), context(["users"]));
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual([{ name: "Test", points: 3 }]);
    expect(fetchMock.mock.calls[0][0].href).toBe("http://127.0.0.1:3001/users");
  });
  it.each([["POST", ["users"], POST], ["PUT", ["users", "update-points"], PUT]])("forwards %s bodies and upstream error statuses", async (method, path, handler) => {
    fetchMock.mockResolvedValue(new Response('{"message":"INVALID_INPUT"}', { status: 400 }));
    const body = JSON.stringify({ name: "Test", points: 3 });
    const response = await handler(new NextRequest("http://localhost/api/legacy/users", { method, body }), context(path));
    expect(response.status).toBe(400);
    expect(fetchMock.mock.calls[0][1].body).toBe(body);
  });
  it("returns a controlled error when the upstream fails", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    const response = await GET(new NextRequest("http://localhost/api/legacy/users"), context(["users"]));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ message: "LEGACY_API_UNAVAILABLE" });
  });
});
