/// <reference types="node" />

import { test, expect } from "@playwright/test";
import {
  DocumentationPage,
  DOC_SECTIONS,
} from "../../pages/publicUi/documentation.page";

test.describe("Public UI — Documentation page", () => {
  // TC01
  test("TC01 - Documentation page opens with the introduction anchor", async ({
    page,
  }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(page).toHaveURL(/\/documentation#introduction$/);
  });

  // TC02
  test("TC02 - Documentation page title is correct", async ({ page }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(page).toHaveTitle("Docs | MockWave-Free tools to mock your API");
  });

  // TC03
  test("TC03 - Introduction section heading is visible", async ({ page }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.heading).toBeVisible();
  });

  // TC04 - TC09 : every sidebar link is visible with the right href
  for (const [index, section] of DOC_SECTIONS.entries()) {
    test(`TC${String(index + 4).padStart(2, "0")} - Sidebar link "${section.sidebarName}" has the correct href`, async ({
      page,
    }) => {
      const docs = new DocumentationPage(page);
      await docs.goto();
      await expect(docs.sectionLink(section.sidebarName)).toBeVisible();
      await expect(docs.sectionLink(section.sidebarName)).toHaveAttribute(
        "href",
        section.href,
      );
    });
  }

  // TC10 - TC15 : clicking each sidebar link shows its section
  for (const [index, section] of DOC_SECTIONS.entries()) {
    test(`TC${String(index + 10).padStart(2, "0")} - Clicking "${section.sidebarName}" shows the "${section.heading}" section`, async ({
      page,
    }) => {
      const docs = new DocumentationPage(page);
      await docs.goto();
      await docs.sectionLink(section.sidebarName).click();
      await expect(page).toHaveURL(new RegExp(`documentation#${section.href.split("#")[1]}$`));
      await expect(docs.sectionHeading(section.heading)).toBeVisible();
    });
  }

  // TC16
  test("TC16 - Introduction description paragraph is visible", async ({
    page,
  }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(
      page.getByText(/Introducing mockwave.*go-to tool for effortless API mocking/i),
    ).toBeVisible();
  });

  // TC17
  test("TC17 - Sign up today CTA heading is visible", async ({ page }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.signUpTodayHeading).toBeVisible();
  });

  // TC18
  test("TC18 - Sign Up CTA button is visible", async ({ page }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.signUpCtaButton).toBeVisible();
  });

  // TC19
  test("TC19 - Feature nav link points to /feature", async ({ page }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.featureLink).toHaveAttribute("href", "/feature");
  });

  // TC20
  test("TC20 - FAQ nav link points to /faq", async ({ page }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.faqLink).toHaveAttribute("href", "/faq");
  });

  // TC21
  test("TC21 - Contact Us nav link points to /contact-us", async ({ page }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.contactLink).toHaveAttribute("href", "/contact-us");
  });

  // TC22
  test("TC22 - Sign Up nav link points to the admin sign-up page", async ({
    page,
  }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.signUpLink).toHaveAttribute(
      "href",
      "https://admin.mockwave.io/sign-up",
    );
  });

  // TC23
  test("TC23 - Bug nav link points to the GitHub issues page", async ({
    page,
  }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.bugLink).toHaveAttribute(
      "href",
      "https://github.com/mock-wave/mockwave.io-disscussion/issues",
    );
  });

  // TC24
  test("TC24 - Terms link and copyright are visible", async ({ page }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await expect(docs.termsLink).toBeVisible();
    await expect(docs.copyrightText).toBeVisible();
  });

  // TC25
  test("TC25 - Clicking FAQ in the nav navigates to the FAQ page", async ({
    page,
  }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await docs.faqLink.click();
    await expect(page).toHaveURL(/\/faq$/);
  });

  // TC26
  test("TC26 - Clicking Contact Us navigates to the contact page", async ({
    page,
  }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await docs.contactLink.click();
    await expect(page).toHaveURL(/\/contact-us$/);
  });

  // TC27
  test("TC27 - Clicking Feature navigates to the feature page", async ({
    page,
  }) => {
    const docs = new DocumentationPage(page);
    await docs.goto();
    await docs.featureLink.click();
    await expect(page).toHaveURL(/\/feature$/);
  });
});