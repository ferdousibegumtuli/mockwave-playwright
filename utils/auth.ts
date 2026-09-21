import { Browser } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ADMIN_URL = process.env.MOCKWAVE_BASE_URL || "https://admin.mockwave.io";
const STATE_PATH = "playwright/.auth/admin.json";

/**
 * Logs in with the MOCKWAVE_USERNAME / MOCKWAVE_PASSWORD credentials and
 * saves the authenticated session so every test in the file starts signed in.
 * Retries a few times against transient network hiccups on the live site.
 */
export async function loginAndSaveState(browser: Browser) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto(`${ADMIN_URL}/sign-in`, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await page.locator("#username").waitFor({ state: "visible", timeout: 30_000 });
      await page.locator("#username").fill(process.env.MOCKWAVE_USERNAME || "");
      await page.locator("#password").fill(process.env.MOCKWAVE_PASSWORD || "");
      await page.getByRole("button", { name: "SIGN IN" }).click();
      await page.waitForURL(/\/dashboard/, { timeout: 45_000 });

      mkdirSync(path.dirname(STATE_PATH), { recursive: true });
      await context.storageState({ path: STATE_PATH });
      await context.close();
      return;
    } catch (err) {
      lastError = err;
      await context.close().catch(() => {});
    }
  }
  throw lastError;
}