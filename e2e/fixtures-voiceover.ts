/**
 * Fixture łączący rozszerzenie Chrome (e2e/fixtures) z VoiceOver (Guidepup).
 * Używane przez testy E2E sterowane czytnikiem (Analiza.md 4.4).
 * Wymaga: macOS, npx @guidepup/setup, VoiceOver.
 */
import { voiceOver, macOSActivate } from "@guidepup/guidepup";
import type { VoiceOver } from "@guidepup/guidepup";
import { test as extensionTest } from "./fixtures";

/** Nazwa aplikacji Chromium na macOS do aktywacji przez Guidepup (zgodnie z applicationNameMap). */
export const CHROMIUM_APP_NAME_MACOS = "Google Chrome For Testing";

const isMac = process.platform === "darwin";

/** Komunikat przy pomijaniu testu, gdy VoiceOver nie jest dostępny. */
export const VOICEOVER_SKIP_MESSAGE =
  "VoiceOver niedostępny. Wymagane: macOS oraz uruchomienie: npx @guidepup/setup";

/** Eksport dla użycia w teście (start/stop/detect/macOSActivate). */
export { voiceOver, macOSActivate };

export const test = extensionTest.extend<{ voiceOver: VoiceOver }>({
  voiceOver: async ({ page }, use) => {
    if (!isMac) {
      await use(voiceOver);
      return;
    }
    await use(voiceOver);
  },
});

export const { expect } = test;
