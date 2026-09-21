/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/publicUi/home.page";

const HOME_URL = "https://mockwave.io/";
const BUG_URL =
  "https://github.com/mock-wave/mockwave.io-disscussion/issues";

test.describe("Public UI — Home page", () => {
  // TC01
  test("TC01 - Home page opens at the root URL", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveURL(HOME_URL);
  });

  // TC02
  test("TC02 - Home page title is correct", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveTitle("MockWave-Free tools to mock your API");
  });

  // TC03
  test("TC03 - Main hero heading is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.h1).toBeVisible();
  });

  // TC04
  test("TC04 - Hero heading has the expected text", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.h1).toHaveText("Build your perfect mock api Free");
  });

  // TC05
  test("TC05 - Introducing mockwave paragraph is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.introParagraph).toBeVisible();
  });

  // TC06
  test("TC06 - Features section heading is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.featuresHeading).toBeVisible();
  });

  // TC07
  test("TC07 - Save time heading is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.saveTimeHeading).toBeVisible();
  });

  // TC08
  test("TC08 - Frontend benefit heading is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.frontendBenefitHeading).toBeVisible();
  });

  // TC09
  test("TC09 - Backend benefit heading is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.backendBenefitHeading).toBeVisible();
  });

  // TC10
  test("TC10 - Sign up today CTA heading is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.signUpTodayHeading).toBeVisible();
  });

  // TC11
  test("TC11 - Sign Up CTA button is visible and enabled", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.signUpCtaButton).toBeVisible();
    await expect(home.signUpCtaButton).toBeEnabled();
  });

  // TC12
  test("TC12 - Logo link points to the home page", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.logoLink).toBeVisible();
    await expect(home.logoLink).toHaveAttribute("href", "https://mockwave.io");
  });

  // TC13
  test("TC13 - Feature nav link points to /feature", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.featureLink).toHaveAttribute("href", "/feature");
  });

  // TC14
  test("TC14 - FAQ nav link points to /faq", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.faqLink).toHaveAttribute("href", "/faq");
  });

  // TC15
  test("TC15 - Bug nav link points to the GitHub issues page", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.bugLink).toHaveAttribute("href", BUG_URL);
  });

  // TC16
  test("TC16 - Documentation nav link points to the docs intro", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.documentationLink).toHaveAttribute(
      "href",
      "/documentation#introduction",
    );
  });

  // TC17
  test("TC17 - Contact Us nav link points to /contact-us", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.contactLink).toHaveAttribute("href", "/contact-us");
  });

  // TC18
  test("TC18 - Sign In nav link points to the admin sign-in page", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.signInLink).toHaveAttribute(
      "href",
      "https://admin.mockwave.io/sign-in",
    );
  });

  // TC19
  test("TC19 - Sign Up nav link points to the admin sign-up page", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.signUpLink).toHaveAttribute(
      "href",
      "https://admin.mockwave.io/sign-up",
    );
  });

  // TC20
  test("TC20 - Bottom Feature link exists and points to /feature", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page.locator('a[href="/feature"]').last()).toHaveAttribute(
      "href",
      "/feature",
    );
  });

  // TC21
  test("TC21 - Bottom FAQ link exists and points to /faq", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(page.locator('a[href="/faq"]').last()).toHaveAttribute(
      "href",
      "/faq",
    );
  });

  // TC22
  test("TC22 - Bottom Documentation link exists and points to /documentation", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(
      page.locator('a[href="/documentation"]').last(),
    ).toHaveAttribute("href", "/documentation");
  });

  // TC23
  test("TC23 - Bottom Contact us link exists and points to /contact-us", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(
      page.locator('a[href="/contact-us"]').last(),
    ).toHaveAttribute("href", "/contact-us");
  });

  // TC24
  test("TC24 - Terms and conditions link is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.termsLink).toBeVisible();
    await expect(home.termsLink).toHaveAttribute(
      "href",
      "/terms-and-conditions",
    );
  });

  // TC25
  test("TC25 - Copyright text is visible", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.copyrightText).toBeVisible();
  });

  // TC26
  test("TC26 - Clicking Feature navigates to the feature page", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.featureLink.click();
    await expect(page).toHaveURL(/\/feature$/);
  });

  // TC27
  test("TC27 - Clicking FAQ navigates to the FAQ page", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.faqLink.click();
    await expect(page).toHaveURL(/\/faq$/);
  });

  // TC28
  test("TC28 - Clicking Documentation navigates to the docs page", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.documentationLink.click();
    await expect(page).toHaveURL(/\/documentation/);
  });

  // TC29
  test("TC29 - Clicking Contact Us navigates to the contact page", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.contactLink.click();
    await expect(page).toHaveURL(/\/contact-us$/);
  });

  // TC30
  test("TC30 - Clicking Sign In opens the admin sign-in page", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.signInLink.click();
    await expect(page).toHaveURL(/admin\.mockwave\.io\/sign-in/);
  });
});