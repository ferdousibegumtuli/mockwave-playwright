import { chromium, FullConfig } from "@playwright/test";
import { loginAndSaveState } from "./utils/auth";

/**
 * Runs once before the whole test run: signs in with the admin credentials
 * and saves the authenticated state so every spec can start signed in via
 * `test.use({ storageState: "playwright/.auth/admin.json" })`.
 */
export default async function globalSetup(config: FullConfig) {
  void config;
  const browser = await chromium.launch();
  await loginAndSaveState(browser);
  await browser.close();
}