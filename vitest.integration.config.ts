import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: { alias: { src: fileURLToPath(new URL("./src", import.meta.url)), "server-only": fileURLToPath(new URL("./tests/integration/server-only.ts", import.meta.url)) } },
  test: { environment: "node", include: ["tests/integration/**/*.integration.test.ts"], testTimeout: 30000, hookTimeout: 120000, fileParallelism: false },
});
