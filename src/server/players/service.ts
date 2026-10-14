import "server-only";
import { MongoClient, Db, ObjectId } from "mongodb";
import { z } from "zod";
import { randomInt } from "node:crypto";
import { AppError } from "../http/errors";
import { challengeDate, historyEntry, mergeHistory, readLegacyHistory } from "./history";

export interface Player {
  _id: ObjectId;
  name: string;
  points: number;
  email?: string;
  history?: string;
  authUserId?: string;
  retiredInto?: ObjectId;
}
export interface Identity { id: string; name: string; email?: string; emailVerified: boolean; isAnonymous: boolean }
const nameInput = z.string().trim().min(1).max(60);
export const resultInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pointsOfDay: z.number().int().min(0).max(10),
  time: z.number().finite().min(0).max(300),
}).strict();

export function playerService(db: Db, client: MongoClient) {
  const players = db.collection<Player>("users");
  const results = db.collection<{ playerId: ObjectId; date: string; pointsOfDay: number; time: number }>("dailyResults");
  const publicPlayer = (player: Player) => ({ _id: player._id.toHexString(), name: player.name, points: player.points });
  const privatePlayer = (player: Player) => ({ ...publicPlayer(player), history: player.history ?? "[]" });

  return {
    async prepareIndexes() {
      await players.createIndex({ authUserId: 1 }, { unique: true, partialFilterExpression: { authUserId: { $type: "string" } } });
      await results.createIndex({ playerId: 1, date: 1 }, { unique: true });
      await players.createIndex({ points: -1 });
    },
    async leaderboard() {
      const records = await players.find({ retiredInto: { $exists: false } }, { projection: { name: 1, points: 1 } }).sort({ points: -1, _id: 1 }).limit(500).toArray();
      return records.map(publicPlayer);
    },
    async resolve(identity: Identity, requestedName?: string) {
      const bound = await players.findOne({ authUserId: identity.id });
      if (bound?.retiredInto) throw new AppError("ACCOUNT_ALREADY_LINKED", 409);
      if (bound) return privatePlayer(bound);
      if (!identity.isAnonymous && identity.emailVerified && identity.email) {
        const escaped = identity.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const candidates = await players.find({ email: { $regex: `^${escaped}$`, $options: "i" }, retiredInto: { $exists: false } }).limit(2).toArray();
        if (candidates.length > 1) throw new AppError("ACCOUNT_LINK_CONFLICT", 409);
        if (candidates.length === 1) {
          const player = candidates[0];
          if (player.authUserId && player.authUserId !== identity.id) throw new AppError("ACCOUNT_LINK_CONFLICT", 409);
          const updated = await players.findOneAndUpdate({ _id: player._id, $or: [{ authUserId: { $exists: false } }, { authUserId: identity.id }] }, { $set: { authUserId: identity.id } }, { returnDocument: "after" });
          if (!updated) throw new AppError("ACCOUNT_LINK_CONFLICT", 409);
          return privatePlayer(updated);
        }
      }
      const name = nameInput.parse(requestedName ?? identity.name);
      const duplicate = await players.findOne({ name });
      const player: Player = { _id: new ObjectId(), authUserId: identity.id, name: duplicate ? `${name}-${randomInt(1000, 10000)}` : name, points: 0, history: "[]" };
      if (!identity.isAnonymous && identity.emailVerified && identity.email) player.email = identity.email.toLowerCase();
      try { await players.insertOne(player); }
      catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
          const existing = await players.findOne({ authUserId: identity.id });
          if (existing) return privatePlayer(existing);
        }
        throw error;
      }
      return privatePlayer(player);
    },
    async linkGuest(guestAuthId: string, targetAuthId: string) {
      if (guestAuthId === targetAuthId) return;
      const session = client.startSession();
      try {
        await session.withTransaction(async () => {
          const source = await players.findOne({ authUserId: guestAuthId }, { session });
          const target = await players.findOne({ authUserId: targetAuthId }, { session });
          if (!source || !target || source.retiredInto) return;
          const sourceResults = await results.find({ playerId: source._id }, { session }).toArray();
          let earned = 0;
          const accepted = [];
          for (const result of sourceResults) {
            const day = new Date(`${result.date}T12:00:00-03:00`).toLocaleDateString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
            const exists = await results.findOne({ playerId: target._id, date: result.date }, { session });
            const legacyExists = readLegacyHistory(target.history).some(record => record.isoDate === result.date || record.date === day);
            if (!exists && !legacyExists) {
              await results.updateOne({ _id: result._id }, { $set: { playerId: target._id } }, { session });
              earned += result.pointsOfDay;
              accepted.push({ date: day, isoDate: result.date, pointsOfDay: result.pointsOfDay, time: result.time });
            }
          }
          await players.updateOne({ _id: target._id }, { $inc: { points: earned }, $set: { history: mergeHistory(target.history, accepted) } }, { session });
          await players.updateOne({ _id: source._id }, { $set: { retiredInto: target._id } }, { session });
        });
      } finally { await session.endSession(); }
    },
    async current(authUserId: string) {
      const player = await players.findOne({ authUserId, retiredInto: { $exists: false } });
      if (!player) throw new AppError("PLAYER_NOT_FOUND", 404);
      return privatePlayer(player);
    },
    async saveResult(authUserId: string, raw: unknown, now = new Date()) {
      const input = resultInput.parse(raw);
      if (input.date !== challengeDate(now)) throw new AppError("CHALLENGE_EXPIRED", 409);
      const session = client.startSession();
      try {
        return await session.withTransaction(async () => {
          const player = await players.findOne({ authUserId, retiredInto: { $exists: false } }, { session });
          if (!player) throw new AppError("PLAYER_NOT_FOUND", 404);
          const day = new Date(`${input.date}T12:00:00-03:00`).toLocaleDateString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
          if (readLegacyHistory(player.history).some(record => record.isoDate === input.date || record.date === day)) return { ...privatePlayer(player), alreadySaved: true };
          const prior = await results.findOne({ playerId: player._id, date: input.date }, { session });
          if (prior) return { ...privatePlayer(player), alreadySaved: true };
          await results.insertOne({ playerId: player._id, ...input }, { session });
          const history = mergeHistory(player.history, [historyEntry.parse({ date: day, isoDate: input.date, pointsOfDay: input.pointsOfDay, time: input.time })]);
          const updated = await players.findOneAndUpdate({ _id: player._id }, { $inc: { points: input.pointsOfDay }, $set: { history } }, { session, returnDocument: "after" });
          return { ...privatePlayer(updated!), alreadySaved: false };
        });
      } finally { await session.endSession(); }
    },
  };
}
