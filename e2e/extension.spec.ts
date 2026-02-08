import { test, expect } from "./fixtures";

test.describe("Rozszerzenie A11Y Order Helper", () => {
  test("ładuje popup i wyświetla nagłówek", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
    await expect(page.locator(".popup-title")).toHaveText("A11Y Order Helper");
  });

  test("popup zawiera przyciski Uruchom i Wyłącz", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
    await expect(page.getByRole("button", { name: "Uruchom" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Wyłącz" })).toBeVisible();
  });
});

test.describe("Popup E2E (4.2)", () => {
  test("suwak przezroczystości jest widoczny", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
    await expect(page.getByLabel("Przezroczystość", { exact: true })).toBeVisible();
    const slider = page.locator("#opacity-slider");
    await expect(slider).toHaveAttribute("min", "0");
    await expect(slider).toHaveAttribute("max", "100");
  });

  test("radio Typ czytnika: Focus order, VoiceOver, NVDA", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
    await expect(page.getByRole("group", { name: "Typ czytnika" })).toBeVisible();
    await expect(page.getByLabel("Focus order", { exact: true })).toBeVisible();
    await expect(page.getByLabel("VoiceOver", { exact: true })).toBeVisible();
    await expect(page.getByLabel("NVDA", { exact: true })).toBeVisible();
    expect(await page.locator('input[name="reader"]:checked').count()).toBe(1);
  });

  test("select Styl overlay: Domyślny i Minimalny", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
    await expect(page.getByLabel("Wygląd overlay")).toBeVisible();
    await expect(page.locator('option[value="default"]')).toHaveText("Domyślny");
    await expect(page.locator('option[value="minimal"]')).toHaveText("Minimalny");
  });

  test("zapis w chrome.storage.local po zmianie wyboru", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
    await page.getByLabel("NVDA", { exact: true }).click();
    await page.getByLabel("Wygląd overlay").selectOption("minimal");
    const stored = await page.evaluate(() =>
      new Promise<Record<string, string>>((resolve) => {
        chrome.storage.local.get(["readerType", "overlayTheme"], (data: Record<string, string>) => resolve(data));
      })
    );
    expect(stored.readerType).toBe("nvda");
    expect(stored.overlayTheme).toBe("minimal");
  });
});
