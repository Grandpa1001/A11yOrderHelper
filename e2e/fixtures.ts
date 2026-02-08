import {
  test as base,
  chromium,
  type BrowserContext,
} from "@playwright/test";
import path from "path";

const pathToExtension = path.join(process.cwd(), "dist");

type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
  popupUrl: string;
};

export const test = base.extend<ExtensionFixtures>({
  context: async ({}, use) => {
    const userDataDir = path.join(process.cwd(), "e2e", "test-user-data");
    const headed = process.env.HEADED === "1";
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: "chromium",
      headless: !headed,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) serviceWorker = await context.waitForEvent("serviceworker");
    const extensionId = serviceWorker.url().split("/")[2];
    await use(extensionId);
  },

  popupUrl: async ({ extensionId }, use) => {
    await use(`chrome-extension://${extensionId}/src/popup/popup.html`);
  },
});

export const { expect } = test;
