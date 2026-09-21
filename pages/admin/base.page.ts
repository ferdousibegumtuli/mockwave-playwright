import { Page, Locator } from "@playwright/test";

/**
 * Everything shared by the admin pages at admin.mockwave.io: the sidebar
 * navigation, the user menu and the footer.
 */
export class BaseAdminPage {
  readonly page: Page;

  // Sidebar
  readonly sideHeading: Locator;
  readonly dashboardLink: Locator;
  readonly projectLink: Locator;
  readonly endpointLink: Locator;
  readonly fakerLink: Locator;

  // User menu (hidden until the avatar button is clicked)
  readonly userMenuButton: Locator;
  readonly userEmail: Locator;
  readonly signOutButton: Locator;

  // Footer
  readonly copyrightText: Locator;
  readonly appVersionText: Locator;

  // SweetAlert confirmations
  readonly confirmDialog: Locator;

  constructor(page: Page) {
    this.page = page;

    this.sideHeading = page.getByRole("heading", { name: "APPS" });
    this.dashboardLink = page.locator('a[href="/dashboard"]').first();
    this.projectLink = page.locator('a[href="/projects"]').first();
    this.endpointLink = page.locator('a[href="/endpoints"]').first();
    this.fakerLink = page.locator('a[href="/faker-function-list"]').first();

    this.userMenuButton = page.locator(".dropdown button").first();
    this.userEmail = page
      .locator('a[href="javascript:;"]')
      .filter({ hasText: "@" })
      .first();
    this.signOutButton = page.getByRole("button", { name: "Sign Out" });

    // The copyright line is split across nested elements, so match the
    // wrapping div whose full text contains the whole sentence.
    this.copyrightText = page
      .locator("div")
      .filter({ hasText: /All rights reserved/ })
      .last();
    this.appVersionText = page.getByText(/App version:/);

    this.confirmDialog = page.locator(".swal2-container");
  }

  async openUserMenu() {
    await this.userMenuButton.click();
  }

  async confirmSwal() {
    await this.confirmDialog.locator(".swal2-confirm").click();
  }

  async cancelSwal() {
    // The "No" (swal2-deny) button stays hidden on this site — use "Cancel".
    await this.confirmDialog.locator(".swal2-cancel").click();
  }

  /** The toast notification whose message matches `text` (newest first). */
  toastWithText(text: string | RegExp) {
    return this.page
      .locator("[data-testid=toast-body]", { hasText: text })
      .first();
  }

  async goto(url: string) {
    // Retry once against transient network errors on the live site.
    const lastError: unknown[] = [];
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
        return;
      } catch (err) {
        lastError.push(err);
        await this.page.waitForTimeout(1500);
      }
    }
    throw lastError[lastError.length - 1];
  }
}