import { Browser } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ADMIN_URL = process.env.MOCKWAVE_BASE_URL || "https://admin.mockwave.io";
const STATE_PATH = "playwright/.auth/admin.json";

/**
 * Logs in with the MOCKWAVE_USERNAME / MOCKWAVE_PASSWORD credentials and
 * saves the authenticated session so every test in the file starts signed in.
 */
export async function loginAndSaveState(browser: Browser) {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${ADMIN_URL}/sign-in`);
  await page.locator("#username").fill(process.env.MOCKWAVE_USERNAME || "");
  await page.locator("#password").fill(process.env.MOCKWAVE_PASSWORD || "");
  await page.getByRole("button", { name: "SIGN IN" }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 30_000 });

  mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  await context.storageState({ path: STATE_PATH });
  await context.close();
}