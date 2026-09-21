/// <reference types="node" />

import { test, expect } from "@playwright/test";
import {
  FeaturePage,
  FEATURE_HEADINGS,
  FEATURE_DESCRIPTIONS,
} from "../../pages/publicUi/feature.page";

test.describe("Public UI — Feature page", () => {
  // TC01
  test("TC01 - Feature page opens at the correct URL", async ({ page }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    await expect(page).toHaveURL(/\/feature$/);
  });

  // TC02
  test("TC02 - Feature page title is correct", async ({ page }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    await expect(page).toHaveTitle(
      "Feature | MockWave-Free tools to mock your API",
    );
  });

  // TC03 - TC11
  for (const [index, name] of FEATURE_HEADINGS.entries()) {
    test(`TC${String(index + 3).padStart(2, "0")} - Feature heading is visible: "${name}"`, async ({
      page,
    }) => {
      const feature = new FeaturePage(page);
      await feature.goto();
      await expect(feature.heading(name)).toBeVisible();
    });
  }

  // TC12 - TC20
  for (const [index, fragment] of FEATURE_DESCRIPTIONS.entries()) {
    test(`TC${String(index + 12).padStart(2, "0")} - Feature description is visible: "${fragment}"`, async ({
      page,
    }) => {
      const feature = new FeaturePage(page);
      await feature.goto();
      await expect(feature.description(fragment)).toBeVisible();
    });
  }

  // TC21
  test("TC21 - All nine feature headings are present", async ({ page }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    const headings = page.locator("h3");
    await expect(headings).toHaveCount(9);
  });

  // TC22
  test("TC22 - Sign up today CTA heading is visible", async ({ page }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    await expect(feature.signUpTodayHeading).toBeVisible();
  });

  // TC23
  test("TC23 - Sign Up CTA button is visible and enabled", async ({ page }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    await expect(feature.signUpCtaButton).toBeVisible();
    await expect(feature.signUpCtaButton).toBeEnabled();
  });

  // TC24
  test("TC24 - Feature nav link points to /feature", async ({ page }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    await expect(feature.featureLink).toHaveAttribute("href", "/feature");
  });

  // TC25
  test("TC25 - Documentation nav link points to the docs intro", async ({
    page,
  }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    await expect(feature.documentationLink).toHaveAttribute(
      "href",
      "/documentation#introduction",
    );
  });

  // TC26
  test("TC26 - Terms link and copyright are visible", async ({ page }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    await expect(feature.termsLink).toBeVisible();
    await expect(feature.copyrightText).toBeVisible();
  });

  // TC27
  test("TC27 - Clicking FAQ navigates to the FAQ page", async ({ page }) => {
    const feature = new FeaturePage(page);
    await feature.goto();
    await feature.faqLink.click();
    await expect(page).toHaveURL(/\/faq$/);
  });
});