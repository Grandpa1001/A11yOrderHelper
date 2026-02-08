/**
 * Playwright: testy E2E z rozszerzeniem w Chrome + VoiceOver (Guidepup).
 * Uruchomienie: npm run test:e2e:voiceover (wymaga macOS, npx @guidepup/setup).
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  testMatch: "**/extension-voiceover.spec.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "html",
  timeout: 90_000,
  use: {
    ...devices["Desktop Chrome"],
    headless: false,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium-extension-voiceover", use: { channel: "chromium" } }],
});
