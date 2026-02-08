import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  timeout: 30_000,
  use: { trace: "on-first-retry" },
  projects: [
    { name: "chromium-extension", use: { ...devices["Desktop Chrome"] } },
  ],
});
