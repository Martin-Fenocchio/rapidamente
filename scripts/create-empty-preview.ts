import { MongoClient } from "mongodb";
import { parseEnv } from "node:util";
import { mkdirSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { randomBytes } from "node:crypto";

const sourceEnv = process.argv[2];
if (!sourceEnv) throw new Error("SOURCE_ENV_PATH_REQUIRED");
const uri = parseEnv(readFileSync(sourceEnv, "utf8")).DATA_BASE;
if (!uri) throw new Error("SOURCE_DATABASE_NOT_CONFIGURED");
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
try {
  // Derive a separate name locally; never query the source database or player records.
  const sourceName = client.db().databaseName;
  const name = `${sourceName}_nextjs_preview`;
  if (name === sourceName || !/^[A-Za-z0-9_-]+$/.test(name)) throw new Error("PREVIEW_DATABASE_INVALID");
  await client.connect();
  const preview = client.db(name);
  if (!(await preview.listCollections({ name: "users" }).toArray()).length) await preview.createCollection("users");
  mkdirSync(".migration-private", { recursive: true, mode: 0o700 }); chmodSync(".migration-private", 0o700);
  writeFileSync(".migration-private/preview-env.json", JSON.stringify({ MONGODB_URI: uri, MONGODB_DB: name, BETTER_AUTH_SECRET: randomBytes(32).toString("hex") }), { mode: 0o600, flag: "wx" });
  console.log(JSON.stringify({ previewDatabase: name, sourceRecordsRead: 0, productionRecordsCopied: 0 }));
} catch {
  console.error("EMPTY_PREVIEW_CONFIGURATION_FAILED"); process.exitCode = 1;
} finally { await client.close(); }
