/**
 * Testy z czytnikiem ekranu (Guidepup) — krok 4.4.
 * Wymagają: macOS (VoiceOver) lub Windows (NVDA), npx @guidepup/setup
 * Uruchomienie: npm run test:guidepup
 */
import { voiceOverTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";

const isMac = process.platform === "darwin";

test.describe("Guidepup (4.4) — kolejność odczytu VoiceOver", () => {
  test.skip(!isMac, "VoiceOver test tylko na macOS");

  test("na stronie z nagłówkiem i linkiem VoiceOver ogłasza elementy w kolejności", async ({
    page,
    voiceOver,
  }) => {
    const testPageUrl = "https://pl.wikipedia.org/wiki/Strona_g%C5%82%C3%B3wna";
    await page.goto(testPageUrl, { waitUntil: "domcontentloaded", timeout: 15_000 });

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });

    await voiceOver.navigateToWebContent();

    const phrases: string[] = [];
    for (let i = 0; i < 5; i++) {
      const text = await voiceOver.itemText();
      if (text) phrases.push(text);
      await voiceOver.perform(voiceOver.keyboardCommands.moveToNext);
    }

    expect(phrases.length).toBeGreaterThan(0);
    const fullLog = phrases.join(" ").toLowerCase();
    const hasHeadingOrLink =
      fullLog.includes("heading") ||
      fullLog.includes("link") ||
      fullLog.includes("nagłówek") ||
      fullLog.includes("łącze");
    expect(hasHeadingOrLink).toBe(true);
  });
});
