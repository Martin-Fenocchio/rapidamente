import "server-only";
import { MongoClient } from "mongodb";
import { AppError } from "../http/errors";

const connections = globalThis as typeof globalThis & { rapidlyMongo?: { uri: string; promise: Promise<MongoClient> } };

export function databaseConfig() {
  const uri = process.env.MONGODB_URI;
  const name = process.env.MONGODB_DB;
  if (!uri || !name) throw new AppError("DATABASE_NOT_CONFIGURED", 503);
  if (!/^mongodb(?:\+srv)?:\/\//.test(uri) || !/^[A-Za-z0-9_-]+$/.test(name)) throw new AppError("DATABASE_CONFIGURATION_INVALID", 503);
  return { uri, name };
}

export async function getDatabase() {
  const { uri, name } = databaseConfig();
  if (!connections.rapidlyMongo || connections.rapidlyMongo.uri !== uri) {
    const client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 10000 });
    const promise = client.connect().catch(error => { connections.rapidlyMongo = undefined; throw error; });
    connections.rapidlyMongo = { uri, promise };
  }
  const client = await connections.rapidlyMongo.promise;
  return { client, db: client.db(name) };
}
