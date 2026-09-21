/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { FaqPage, FAQ_QUESTIONS } from "../../pages/publicUi/faq.page";

test.describe("Public UI — FAQ page", () => {
  // TC01
  test("TC01 - FAQ page opens at the correct URL", async ({ page }) => {
    const faq = new FaqPage(page);
    await faq.goto();
    await expect(page).toHaveURL(/\/faq$/);
  });

  // TC02
  test("TC02 - FAQ page title is correct", async ({ page }) => {
    const faq = new FaqPage(page);
    await faq.goto();
    await expect(page).toHaveTitle(
      "FAQ | MockWave-Free tools to mock your API",
    );
  });

  // TC03
  test("TC03 - Frequently Asked Questions heading is visible", async ({
    page,
  }) => {
    const faq = new FaqPage(page);
    await faq.goto();
    await expect(faq.heading).toBeVisible();
  });

  // TC04
  test("TC04 - Sign up today CTA heading is visible", async ({ page }) => {
    const faq = new FaqPage(page);
    await faq.goto();
    await expect(faq.signUpTodayHeading).toBeVisible();
  });

  // TC05
  test("TC05 - Sign Up CTA button is visible", async ({ page }) => {
    const faq = new FaqPage(page);
    await faq.goto();
    await expect(faq.signUpCtaButton).toBeVisible();
  });

  // TC06 - TC21 : every question is visible
  for (const [index, question] of FAQ_QUESTIONS.entries()) {
    test(`TC${String(index + 6).padStart(2, "0")} - FAQ question is visible: "${question}"`, async ({
      page,
    }) => {
      const faq = new FaqPage(page);
      await faq.goto();
      await expect(faq.questionButton(question)).toBeVisible();
    });
  }

  // TC22 - TC37 : clicking a question expands its answer
  for (const [index, question] of FAQ_QUESTIONS.entries()) {
    test(`TC${String(index + 22).padStart(2, "0")} - Clicking "${question}" reveals the answer`, async ({
      page,
    }) => {
      const faq = new FaqPage(page);
      await faq.goto();
      await faq.questionButton(question).click();
      await expect(faq.answerBox(question)).toBeVisible();
      // "Read docs to know more" only exists inside the first 13 answers
      if (index < FAQ_QUESTIONS.length - 3) {
        await expect(faq.readDocsLink(question)).toBeVisible();
      }
    });
  }

  // TC38
  test("TC38 - Clicking a question again collapses the answer", async ({
    page,
  }) => {
    const faq = new FaqPage(page);
    await faq.goto();
    const question = FAQ_QUESTIONS[0];
    const box = faq.answerBox(question);

    await faq.questionButton(question).click();
    await expect(box).toBeVisible();

    await faq.questionButton(question).click();
    await expect(box).toBeHidden();
  });

  // TC39
  test("TC39 - Main navigation links are present", async ({ page }) => {
    const faq = new FaqPage(page);
    await faq.goto();
    await expect(faq.featureLink).toHaveAttribute("href", "/feature");
    await expect(faq.documentationLink).toHaveAttribute(
      "href",
      "/documentation#introduction",
    );
    await expect(faq.contactLink).toHaveAttribute("href", "/contact-us");
    await expect(faq.signInLink).toHaveAttribute(
      "href",
      "https://admin.mockwave.io/sign-in",
    );
    await expect(faq.signUpLink).toHaveAttribute(
      "href",
      "https://admin.mockwave.io/sign-up",
    );
  });

  // TC40
  test("TC40 - Footer links and copyright are present", async ({ page }) => {
    const faq = new FaqPage(page);
    await faq.goto();
    await expect(faq.termsLink).toBeVisible();
    await expect(faq.copyrightText).toBeVisible();
    await expect(
      page.locator('a[href="/documentation"]').last(),
    ).toHaveAttribute("href", "/documentation");
  });
});