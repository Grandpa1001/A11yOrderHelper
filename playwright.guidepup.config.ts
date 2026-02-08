import { screenReaderConfig } from "@guidepup/playwright";
import { defineConfig, devices } from "@playwright/test";

/**
 * Konfiguracja testów z czytnikiem ekranu (Guidepup).
 * VoiceOver na macOS, NVDA na Windows — wymaga: npx @guidepup/setup
 * Uruchomienie: npm run test:guidepup
 */
export default defineConfig({
  ...screenReaderConfig,
  testDir: "e2e",
  testMatch: "guidepup.spec.ts",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  timeout: 3 * 60 * 1000,
  reportSlowTests: null,
  use: {
    ...screenReaderConfig.use,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "voiceover",
      use: { ...devices["Desktop Safari"], headless: false },
    },
  ],
});
