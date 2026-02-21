import { test, expect } from "./fixtures";

const TEST_PAGE_URL = "https://pl.wikipedia.org/wiki/Strona_g%C5%82%C3%B3wna";

test.describe("Popup", () => {
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

  test("suwak przezroczystości ma domyślną wartość 50", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
    const slider = page.locator("#opacity-slider");
    await expect(slider).toHaveAttribute("min", "0");
    await expect(slider).toHaveAttribute("max", "100");
    await expect(slider).toHaveAttribute("value", "50");
  });

  test("radio Typ czytnika: Focus order, VoiceOver, NVDA", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
    await expect(page.getByLabel("Focus order", { exact: true })).toBeVisible();
    await expect(page.getByLabel("VoiceOver", { exact: true })).toBeVisible();
    await expect(page.getByLabel("NVDA", { exact: true })).toBeVisible();
  });

  test("select Styl overlay: Domyślny i Minimalny", async ({ context, popupUrl }) => {
    const page = await context.newPage();
    await page.goto(popupUrl);
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

test.describe("Overlay na stronie", () => {
  test("po Uruchom pojawia się overlay z numeracją", async ({ context, popupUrl }) => {
    const contentPage = await context.newPage();
    await contentPage.goto(TEST_PAGE_URL, { waitUntil: "load", timeout: 20_000 });

    const popupPage = await context.newPage();
    await popupPage.goto(popupUrl);

    await contentPage.bringToFront();
    await contentPage.waitForTimeout(300);
    await popupPage.evaluate(() => document.getElementById("btn-run")?.click());

    const host = contentPage.locator("#a11y-order-helper-host");
    await host.waitFor({ state: "attached", timeout: 15_000 });
    await expect(host.locator(".a11y-number").first()).toBeAttached();
  });

  test("po Wyłącz overlay znika", async ({ context, popupUrl }) => {
    const contentPage = await context.newPage();
    await contentPage.goto(TEST_PAGE_URL, { waitUntil: "load", timeout: 20_000 });

    const popupPage = await context.newPage();
    await popupPage.goto(popupUrl);

    await contentPage.bringToFront();
    await contentPage.waitForTimeout(300);
    await popupPage.evaluate(() => document.getElementById("btn-run")?.click());
    await contentPage.locator("#a11y-order-helper-host").waitFor({ state: "attached", timeout: 15_000 });

    await contentPage.bringToFront();
    await contentPage.waitForTimeout(300);
    await popupPage.evaluate(() => document.getElementById("btn-stop")?.click());

    await expect(contentPage.locator("#a11y-order-helper-host")).toHaveCount(0, { timeout: 5_000 });
  });
});
