import { Page, Locator } from "@playwright/test";

/**
 * Base page object holding everything shared by all public (non-admin)
 * pages on mockwave.io: the header navigation, sign-up CTA and the bottom
 * bar links/copyright.
 */
export class BasePublicPage {
  readonly page: Page;

  // Header navigation
  readonly logoLink: Locator;
  readonly featureLink: Locator;
  readonly faqLink: Locator;
  readonly bugLink: Locator;
  readonly documentationLink: Locator;
  readonly contactLink: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;

  // Bottom bar
  readonly termsLink: Locator;
  readonly copyrightText: Locator;

  // Common CTA / section present on every page
  readonly signUpCtaButton: Locator;
  readonly signUpTodayHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoLink = page.locator('header a[href="https://mockwave.io"]');
    this.featureLink = page.locator('a[href="/feature"]').first();
    this.faqLink = page.locator('a[href="/faq"]').first();
    this.bugLink = page
      .locator('a[href*="github.com/mock-wave"]')
      .first();
    this.documentationLink = page
      .locator('a[href="/documentation#introduction"]')
      .first();
    this.contactLink = page.locator('a[href="/contact-us"]').first();
    this.signInLink = page
      .locator('a[href="https://admin.mockwave.io/sign-in"]')
      .first();
    this.signUpLink = page
      .locator('a[href="https://admin.mockwave.io/sign-up"]')
      .first();

    this.termsLink = page.locator('a[href="/terms-and-conditions"]');
    this.copyrightText = page.getByText(/©\d{4}\s*-\s*mockwave\.io/i);

    this.signUpCtaButton = page.getByRole("button", {
      name: /sign up/i,
    });
    this.signUpTodayHeading = page.getByRole("heading", {
      name: "Sign up today! It's free",
    });
  }

  async goto(url: string) {
    await this.page.goto(url);
  }
}