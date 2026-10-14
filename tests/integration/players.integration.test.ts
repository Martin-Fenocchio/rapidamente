import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { ObjectId } from "mongodb";
import { isolatedDatabase } from "./database";
import { playerService, Identity } from "../../src/server/players/service";

let database: Awaited<ReturnType<typeof isolatedDatabase>>;
let service: ReturnType<typeof playerService>;
const guest: Identity = { id: "guest", name: "Ana", emailVerified: false, isAnonymous: true };
const google: Identity = { id: "google", name: "Ana", email: "ana@example.com", emailVerified: true, isAnonymous: false };
const now = new Date("2026-10-14T15:00:00Z");
const result = { date: "2026-10-14", pointsOfDay: 4, time: 8 };

beforeAll(async () => {
  database = await isolatedDatabase();
  service = playerService(database.db, database.client);
  await service.prepareIndexes();
});
afterAll(async () => { if (database) await database.close(); });
beforeEach(async () => { await database.db.collection("users").deleteMany({}); await database.db.collection("dailyResults").deleteMany({}); });

describe("real MongoDB player persistence", () => {
  it("creates a guest with zero points and returns the same player on retries", async () => {
    const first = await service.resolve(guest, "Ana");
    const second = await service.resolve(guest, "Other");
    expect(second).toEqual(first);
    expect(first.points).toBe(0);
    expect(await database.db.collection("users").countDocuments()).toBe(1);
  });
  it("preserves legacy ID, points, and history on verified Google recovery", async () => {
    const _id = new ObjectId();
    const history = JSON.stringify([{ date: "9/1/2026", pointsOfDay: 8, extra: "original" }]);
    await database.db.collection("users").insertOne({ _id, name: "Old name", points: 80, email: "ANA@example.com", history });
    const player = await service.resolve(google);
    expect(player).toEqual({ _id: _id.toHexString(), name: "Old name", points: 80, history });
    expect(await database.db.collection("users").countDocuments()).toBe(1);
  });
  it("does not recover legacy players from an unverified email", async () => {
    await database.db.collection("users").insertOne({ name: "Legacy", points: 80, email: "ana@example.com" });
    expect((await service.resolve({ ...google, emailVerified: false })).points).toBe(0);
    expect(await database.db.collection("users").countDocuments()).toBe(2);
  });
  it("rejects ambiguous legacy emails without changing records", async () => {
    await database.db.collection("users").insertMany([{ name: "A", points: 10, email: "ana@example.com" }, { name: "B", points: 20, email: "ANA@example.com" }]);
    await expect(service.resolve(google)).rejects.toMatchObject({ code: "ACCOUNT_LINK_CONFLICT", status: 409 });
    expect(await database.db.collection("users").countDocuments({ authUserId: { $exists: true } })).toBe(0);
  });
  it("returns only public ranking fields", async () => {
    await service.resolve(google);
    const list = await service.leaderboard();
    expect(Object.keys(list[0]).sort()).toEqual(["_id", "name", "points"]);
  });
  it("stores a first attempt and increments the authoritative total once", async () => {
    await service.resolve(guest);
    const first = await service.saveResult(guest.id, result, now);
    const retry = await service.saveResult(guest.id, { ...result, pointsOfDay: 10 }, now);
    expect(first!.points).toBe(4);
    expect(retry!.points).toBe(4);
    expect(retry!.alreadySaved).toBe(true);
    expect(await database.db.collection("dailyResults").countDocuments()).toBe(1);
  });
  it("deduplicates simultaneous submissions", async () => {
    await service.resolve(guest);
    const saved = await Promise.all(Array.from({ length: 4 }, () => service.saveResult(guest.id, result, now)));
    expect(saved.every(player => player!.points === 4)).toBe(true);
    expect(await database.db.collection("dailyResults").countDocuments()).toBe(1);
  });
  it("cannot address another player or replace totals through a result payload", async () => {
    await service.resolve(guest);
    await expect(service.saveResult(guest.id, { ...result, id: "another-user", points: 1000 }, now)).rejects.toThrow();
    expect((await service.current(guest.id)).points).toBe(0);
  });
  it("rejects missing players, invalid scores, and expired challenges", async () => {
    await expect(service.saveResult("missing", result, now)).rejects.toMatchObject({ code: "PLAYER_NOT_FOUND" });
    await service.resolve(guest);
    await expect(service.saveResult(guest.id, { ...result, pointsOfDay: 11 }, now)).rejects.toThrow();
    await expect(service.saveResult(guest.id, { ...result, date: "2026-10-13" }, now)).rejects.toMatchObject({ code: "CHALLENGE_EXPIRED" });
    expect(await database.db.collection("dailyResults").countDocuments()).toBe(0);
  });
  it("rolls back the result and increment if existing history is corrupt", async () => {
    await service.resolve(guest);
    await database.db.collection("users").updateOne({ authUserId: guest.id }, { $set: { history: "invalid" } });
    await expect(service.saveResult(guest.id, result, now)).rejects.toThrow();
    expect((await service.current(guest.id)).points).toBe(0);
    expect(await database.db.collection("dailyResults").countDocuments()).toBe(0);
  });
});

describe("guest linking and legacy preservation", () => {
  it("moves guest results into the verified player without changing the original ID", async () => {
    const source = await service.resolve(guest);
    await service.saveResult(guest.id, result, now);
    const target = await service.resolve(google);
    await service.linkGuest(guest.id, google.id);
    expect((await service.current(google.id)).points).toBe(4);
    expect((await service.current(google.id))._id).toBe(target._id);
    expect((await service.leaderboard()).map(player => player._id)).not.toContain(source._id);
    await service.linkGuest(guest.id, google.id);
    expect((await service.current(google.id)).points).toBe(4);
    await expect(service.saveResult(guest.id, result, now)).rejects.toMatchObject({ code: "PLAYER_NOT_FOUND" });
  });
  it("keeps an existing target attempt when a guest already played the same day", async () => {
    await service.resolve(guest);
    await service.saveResult(guest.id, result, now);
    await service.resolve(google);
    await service.saveResult(google.id, { ...result, pointsOfDay: 2 }, now);
    await service.linkGuest(guest.id, google.id);
    expect((await service.current(google.id)).points).toBe(2);
  });
  it("does not add today's legacy score again after verified recovery", async () => {
    await database.db.collection("users").insertOne({ name: "Legacy", email: google.email, points: 80, history: JSON.stringify([{ date: "10/14/2026", pointsOfDay: 8 }]) });
    await service.resolve(google);
    expect((await service.saveResult(google.id, result, now))!.points).toBe(80);
  });
});
