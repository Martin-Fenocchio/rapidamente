import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 1 : 2,
  timeout: process.env.CI ? 60000 : 30000,
  expect: { timeout: process.env.CI ? 10000 : 5000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4181",
    timezoneId: "America/Argentina/Buenos_Aires",
    locale: "en-US",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 4181",
    url: "http://127.0.0.1:4181",
    reuseExistingServer: false,
    timeout: 60000,
    env: { LEGACY_API_URL: "", NEXT_PUBLIC_GA_ID: "", NEXT_PUBLIC_SENTRY_DSN: "" },
  },
});
