import { MongoMemoryReplSet } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

export async function isolatedDatabase() {
  // Never read an application URI: the test process owns this ephemeral replica set.
  const server = await MongoMemoryReplSet.create({ binary: { version: "8.0.17" }, replSet: { count: 1 } });
  const uri = server.getUri();
  if (!uri.startsWith("mongodb://127.0.0.1:")) { await server.stop(); throw new Error("TEST_DATABASE_NOT_LOOPBACK"); }
  const client = await new MongoClient(uri).connect();
  const db = client.db("rapidamente_test");
  return { server, client, db, close: async () => { await client.close(); await server.stop(); } };
}
