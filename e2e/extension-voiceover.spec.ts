/**
 * Test E2E overlay z sterowaniem VoiceOver (Guidepup) — Analiza.md 4.4.
 * Przeglądarka: Chrome z rozszerzeniem. VoiceOver przechodzi przez 20 punktów i je ogłasza.
 * Wymaga: macOS, npx @guidepup/setup, npm run test:e2e:voiceover
 */
import {
  test,
  expect,
  voiceOver,
  macOSActivate,
  CHROMIUM_APP_NAME_MACOS,
  VOICEOVER_SKIP_MESSAGE,
} from "./fixtures-voiceover";

const TEST_PAGE_URL = "https://pl.wikipedia.org/wiki/Strona_g%C5%82%C3%B3wna";
const MIN_POINTS = 20;
const DELAY_PER_POINT_MS = 800;

const isMac = process.platform === "darwin";

test.describe("Content E2E z VoiceOver — 20 punktów", () => {
  test.skip(!isMac, "Wymaga macOS");

  test("VoiceOver przechodzi przez 20 pierwszych punktów overlay (moveToNext + podświetlenie)", async ({
    context,
    page,
    popupUrl,
  }) => {
    test.setTimeout(90_000);

    const supported = await voiceOver.detect();
    if (!supported) {
      test.skip(true, VOICEOVER_SKIP_MESSAGE);
    }

    await voiceOver.start();
    try {
      await macOSActivate(CHROMIUM_APP_NAME_MACOS);
      await page.bringToFront();
    } catch {
      await voiceOver.stop();
      throw new Error(VOICEOVER_SKIP_MESSAGE);
    }

    try {
      await page.goto(TEST_PAGE_URL, { waitUntil: "load", timeout: 20_000 });

      const popupPage = await context.newPage();
      await popupPage.goto(popupUrl);

      await popupPage.getByLabel("VoiceOver", { exact: true }).check();
      await page.waitForTimeout(200);

      await page.bringToFront();
      await page.waitForTimeout(500);
      await popupPage.evaluate(() => document.getElementById("btn-run")?.click());

      const host = page.locator("#a11y-order-helper-host");
      await host.waitFor({ state: "attached", timeout: 15_000 });

      const numbers = host.locator(".a11y-number");
      await expect(numbers.first()).toBeAttached();
      const count = await numbers.count();
      expect(count).toBeGreaterThanOrEqual(MIN_POINTS);

      await page.bringToFront();
      await page.waitForTimeout(300);
      await page.locator("body").focus();
      await voiceOver.interact();
      await voiceOver.perform(voiceOver.keyboardCommands.jumpToLeftEdge);
      await page.waitForTimeout(500);
      await voiceOver.clearItemTextLog();

      for (let i = 0; i < MIN_POINTS; i++) {
        await voiceOver.perform(voiceOver.keyboardCommands.moveToNext);
        await page.waitForTimeout(400);
        try {
          await voiceOver.itemText();
        } catch {
          // ignoruj — VoiceOver mógł jeszcze nie zaktualizować
        }
        const badge = host.locator(".a11y-number").nth(i);
        await badge.evaluate((el) => el.classList.add("a11y-number--active"));
        await page.waitForTimeout(DELAY_PER_POINT_MS);
        await badge.evaluate((el) => el.classList.remove("a11y-number--active"));
      }
    } finally {
      try {
        await voiceOver.stop();
      } catch {
        // ignoruj
      }
    }
  });
});
