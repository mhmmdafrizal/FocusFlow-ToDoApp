const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // ponytail: 1 worker — a single dev server drops Server Action POSTs
  // (ECONNRESET) when hammered by parallel workers; serial is reliable.
  workers: 1,
  reporter: "list",
  use: {
    // Dedicated port: :3000 is used by another local app's dev server.
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
    actionTimeout: 15_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run dev -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },
});