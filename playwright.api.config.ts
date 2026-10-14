import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser-api",
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [["list"], ["html", { outputFolder: "playwright-report-api", open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4182", timezoneId: "America/Argentina/Buenos_Aires", locale: "es-AR", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [{ name: "real-api-desktop", use: { ...devices["Desktop Chrome"] } }, { name: "real-api-mobile", use: { ...devices["Pixel 7"] } }],
  webServer: { command: "npx tsx scripts/e2e-server.ts", url: "http://127.0.0.1:4182/api/config", reuseExistingServer: false, timeout: 120000 },
});
