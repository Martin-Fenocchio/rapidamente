import { MongoMemoryReplSet } from "mongodb-memory-server";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";

const server = await MongoMemoryReplSet.create({ binary: { version: "8.0.17" }, replSet: { count: 1 } });
const uri = server.getUri();
if (!uri.startsWith("mongodb://127.0.0.1:")) { await server.stop(); throw new Error("TEST_DATABASE_NOT_LOOPBACK"); }
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "4182"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production", MONGODB_URI: uri, MONGODB_DB: "rapidamente_browser_test", BETTER_AUTH_URL: "http://127.0.0.1:4182", BETTER_AUTH_SECRET: randomBytes(32).toString("hex"), GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "", NEXT_PUBLIC_GA_ID: "", NEXT_PUBLIC_SENTRY_DSN: "" },
});
let stopping = false;
async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  child.kill("SIGTERM");
  await server.stop();
  process.exit(code);
}
process.on("SIGINT", () => { void stop(); });
process.on("SIGTERM", () => { void stop(); });
child.on("exit", code => { void stop(code ?? 1); });
