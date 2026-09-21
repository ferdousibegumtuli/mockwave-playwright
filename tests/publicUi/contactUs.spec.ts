/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { ContactUsPage } from "../../pages/publicUi/contactUs.page";

test.describe("Public UI — Contact Us page", () => {
  // TC01
  test("TC01 - Contact page opens at the correct URL", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(page).toHaveURL(/\/contact-us$/);
  });

  // TC02
  test("TC02 - Contact page title is correct", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(page).toHaveTitle(
      "Contact us | MockWave-Free tools to mock your API",
    );
  });

  // TC03
  test("TC03 - Contact us heading is visible", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.heading).toBeVisible();
  });

  // TC04
  test("TC04 - Support paragraph is visible", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.supportParagraph).toBeVisible();
  });

  // TC05
  test("TC05 - Email address text is visible", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.emailText).toBeVisible();
  });

  // TC06
  test("TC06 - Email is a mailto link with the correct address", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.emailLink).toBeVisible();
    await expect(contact.emailLink).toHaveAttribute(
      "href",
      "mailto:admin@mockwave.io",
    );
  });

  // TC07
  test("TC07 - Sign up today CTA heading is visible", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.signUpTodayHeading).toBeVisible();
  });

  // TC08
  test("TC08 - Sign Up CTA button is visible", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.signUpCtaButton).toBeVisible();
  });

  // TC09
  test("TC09 - Logo link points to the home page", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.logoLink).toHaveAttribute(
      "href",
      "https://mockwave.io",
    );
  });

  // TC10
  test("TC10 - Feature nav link points to /feature", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.featureLink).toHaveAttribute("href", "/feature");
  });

  // TC11
  test("TC11 - FAQ nav link points to /faq", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.faqLink).toHaveAttribute("href", "/faq");
  });

  // TC12
  test("TC12 - Documentation nav link points to the docs intro", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.documentationLink).toHaveAttribute(
      "href",
      "/documentation#introduction",
    );
  });

  // TC13
  test("TC13 - Contact nav link points to /contact-us", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.contactLink).toHaveAttribute("href", "/contact-us");
  });

  // TC14
  test("TC14 - Sign In nav link points to the admin sign-in page", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.signInLink).toHaveAttribute(
      "href",
      "https://admin.mockwave.io/sign-in",
    );
  });

  // TC15
  test("TC15 - Sign Up nav link points to the admin sign-up page", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.signUpLink).toHaveAttribute(
      "href",
      "https://admin.mockwave.io/sign-up",
    );
  });

  // TC16
  test("TC16 - Bug nav link points to the GitHub issues page", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.bugLink).toHaveAttribute(
      "href",
      "https://github.com/mock-wave/mockwave.io-disscussion/issues",
    );
  });

  // TC17
  test("TC17 - Terms link and copyright are visible", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(contact.termsLink).toBeVisible();
    await expect(contact.copyrightText).toBeVisible();
  });

  // TC18
  test("TC18 - Bottom Feature link exists and points to /feature", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(page.locator('a[href="/feature"]').last()).toHaveAttribute(
      "href",
      "/feature",
    );
  });

  // TC19
  test("TC19 - Bottom FAQ link exists and points to /faq", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(page.locator('a[href="/faq"]').last()).toHaveAttribute(
      "href",
      "/faq",
    );
  });

  // TC20
  test("TC20 - Bottom Documentation link exists and points to /documentation", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(
      page.locator('a[href="/documentation"]').last(),
    ).toHaveAttribute("href", "/documentation");
  });

  // TC21
  test("TC21 - Bottom Contact us link exists and points to /contact-us", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await expect(
      page.locator('a[href="/contact-us"]').last(),
    ).toHaveAttribute("href", "/contact-us");
  });

  // TC22
  test("TC22 - Clicking FAQ navigates to the FAQ page", async ({ page }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await contact.faqLink.click();
    await expect(page).toHaveURL(/\/faq$/);
  });

  // TC23
  test("TC23 - Clicking Documentation navigates to the docs page", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await contact.documentationLink.click();
    await expect(page).toHaveURL(/\/documentation/);
  });

  // TC24
  test("TC24 - Clicking Feature navigates to the feature page", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await contact.featureLink.click();
    await expect(page).toHaveURL(/\/feature$/);
  });

  // TC25
  test("TC25 - Clicking the logo returns to the home page", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await contact.logoLink.click();
    await expect(page).toHaveURL("https://mockwave.io/");
  });

  // TC26
  test("TC26 - Clicking Terms and conditions opens the terms page", async ({
    page,
  }) => {
    const contact = new ContactUsPage(page);
    await contact.goto();
    await contact.termsLink.click();
    await expect(page).toHaveURL(/\/terms-and-conditions$/);
  });
});