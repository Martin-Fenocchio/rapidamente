import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { randomBytes } from "node:crypto";
import { isolatedDatabase } from "./database";
import { createAuth } from "../../src/server/auth/config";
import { playerService } from "../../src/server/players/service";
import { GET as me } from "../../src/app/api/me/route";
import { POST as register } from "../../src/app/api/players/route";
import { POST as saveResult } from "../../src/app/api/results/route";
import { challengeDate } from "../../src/shared/game-date";

let database: Awaited<ReturnType<typeof isolatedDatabase>>;
let auth: ReturnType<typeof createAuth>;
const url = "http://localhost:3000";
const secret = randomBytes(32).toString("hex");

vi.mock("../../src/server/db", () => ({ getDatabase: async () => database }));
vi.mock("../../src/server/auth/config", async importOriginal => {
  const original = await importOriginal<typeof import("../../src/server/auth/config")>();
  return { ...original, getAuth: async () => auth, authConfig: () => ({ url, secret }) };
});
beforeAll(async () => {
  database = await isolatedDatabase();
  await playerService(database.db, database.client).prepareIndexes();
  auth = createAuth(database.db, database.client, { url, secret });
});
afterAll(async () => { if (database) await database.close(); });
beforeEach(async () => {
  for (const collection of await database.db.listCollections().toArray()) await database.db.collection(collection.name).deleteMany({});
});

function request(path: string, method = "GET", cookie = "", body?: unknown, origin = url) {
  return new Request(`${url}${path}`, { method, headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
}
async function login() {
  const response = await auth.handler(request("/api/auth/sign-in/anonymous", "POST", "", {}));
  expect(response.status).toBe(200);
  const cookies = response.headers.getSetCookie().map(cookie => cookie.split(";")[0]).join("; ");
  expect(cookies).toContain("session_token");
  return cookies;
}

describe("real Better Auth and protected routes", () => {
  it("creates a signed HttpOnly guest session and registers its player", async () => {
    const cookie = await login();
    const response = await register(request("/api/players", "POST", cookie, { name: "Ana" }));
    expect(response.status).toBe(200);
    const player = await response.json();
    expect(player.points).toBe(0);
    expect((await me(request("/api/me", "GET", cookie))).status).toBe(200);
    expect(await database.db.collection("authUsers").countDocuments()).toBe(1);
    expect(await database.db.collection("users").countDocuments()).toBe(1);
  });
  it("requires an authenticated session for private data and mutations", async () => {
    expect((await me(request("/api/me"))).status).toBe(401);
    expect((await register(request("/api/players", "POST", "", { name: "Ana" }))).status).toBe(401);
    expect((await saveResult(request("/api/results", "POST", "", { date: challengeDate(), pointsOfDay: 10, time: 20 }))).status).toBe(401);
  });
  it("rejects forged cookies", async () => {
    const cookie = await login();
    const forged = cookie.replace(/session_token=[^;]+/, "session_token=forged");
    expect((await me(request("/api/me", "GET", forged))).status).toBe(401);
  });
  it("expires sessions on the server even while a cookie remains", async () => {
    const cookie = await login();
    await register(request("/api/players", "POST", cookie, { name: "Ana" }));
    await database.db.collection("authSessions").updateMany({}, { $set: { expiresAt: new Date(0) } });
    expect((await me(request("/api/me", "GET", cookie))).status).toBe(401);
  });
  it("invalidates a session on logout", async () => {
    const cookie = await login();
    await register(request("/api/players", "POST", cookie, { name: "Ana" }));
    const response = await auth.handler(request("/api/auth/sign-out", "POST", cookie, {}));
    expect(response.status).toBe(200);
    expect((await me(request("/api/me", "GET", cookie))).status).toBe(401);
  });
  it("denies cross-origin mutations and keeps the total unchanged", async () => {
    const cookie = await login();
    await register(request("/api/players", "POST", cookie, { name: "Ana" }));
    const response = await saveResult(request("/api/results", "POST", cookie, { date: challengeDate(), pointsOfDay: 10, time: 20 }, "https://another.example"));
    expect(response.status).toBe(403);
    expect((await (await me(request("/api/me", "GET", cookie))).json()).points).toBe(0);
  });
  it("rejects impersonation fields and deduplicates legitimate results", async () => {
    const cookie = await login();
    await register(request("/api/players", "POST", cookie, { name: "Ana" }));
    const body = { date: challengeDate(), pointsOfDay: 4, time: 8 };
    expect((await saveResult(request("/api/results", "POST", cookie, { ...body, id: "other", points: 1000 }))).status).toBe(400);
    const first = await saveResult(request("/api/results", "POST", cookie, body));
    expect((await first.json()).points).toBe(4);
    const retry = await saveResult(request("/api/results", "POST", cookie, { ...body, pointsOfDay: 10 }));
    expect((await retry.json()).points).toBe(4);
  });
});
