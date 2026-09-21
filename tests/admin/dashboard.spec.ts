/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { DashboardPage } from "../../pages/admin/dashboard.page";

// Authenticated session created once by the global set-up (global-setup.ts).
test.use({ storageState: "playwright/.auth/admin.json" });

test.describe("Admin — Dashboard page", () => {
  // TC01
  test("TC01 - Dashboard opens at /dashboard", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  // TC02
  test("TC02 - Sidebar APPS heading is visible", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.sideHeading).toBeVisible();
  });

  // TC03
  test("TC03 - Welcome greeting for the logged-in user is visible", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.welcomeHeading).toBeVisible();
  });

  // TC04
  test("TC04 - Welcome to mockwave text is visible", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.welcomeSubText).toBeVisible();
  });

  // TC05
  test("TC05 - Sidebar Dashboard link points to /dashboard", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  // TC06
  test("TC06 - Sidebar Project link points to /projects", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.projectLink).toHaveAttribute("href", "/projects");
  });

  // TC07
  test("TC07 - Sidebar Endpoint link points to /endpoints", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.endpointLink).toHaveAttribute("href", "/endpoints");
  });

  // TC08
  test("TC08 - Sidebar Faker link points to /faker-function-list", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.fakerLink).toHaveAttribute(
      "href",
      "/faker-function-list",
    );
  });

  // TC09
  test("TC09 - Projects stat card label is rendered", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    // The app renders the stat cards inside a `hidden` container, so we
    // assert presence rather than visibility.
    await expect(dashboard.projectsStatLabel).toBeAttached();
  });

  // TC10
  test("TC10 - Endpoints stat card label is rendered", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.endpointsStatLabel).toBeAttached();
  });

  // TC11
  test("TC11 - Responses stat card label is rendered", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.responsesStatLabel).toBeAttached();
  });

  // TC12
  test("TC12 - Signed-in user email is shown in the user menu", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const email = page
      .locator('a[href="javascript:;"]')
      .filter({ hasText: "@" });
    // The user menu is hidden until the avatar button is clicked.
    await expect(email).not.toBeVisible();
    await dashboard.openUserMenu();
    await expect(dashboard.userEmail).toBeVisible();
  });

  // TC13
  test("TC13 - Sign Out button is visible after opening the user menu", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.openUserMenu();
    await expect(dashboard.signOutButton).toBeVisible();
  });

  // TC14
  test("TC14 - Footer copyright and app version are visible", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.copyrightText).toBeVisible();
    await expect(dashboard.appVersionText).toBeVisible();
  });

  // TC15
  test("TC15 - Clicking Project in the sidebar navigates to /projects", async ({
    page,
  }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.projectLink.click();
    await expect(page).toHaveURL(/\/projects$/);
  });
});