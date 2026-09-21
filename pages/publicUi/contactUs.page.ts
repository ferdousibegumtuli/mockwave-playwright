import { Page, Locator } from "@playwright/test";
import { BasePublicPage } from "./base.page";

export class ContactUsPage extends BasePublicPage {
  readonly heading: Locator;
  readonly supportParagraph: Locator;
  readonly emailText: Locator;
  readonly emailLink: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "Contact us" });
    this.supportParagraph = page.getByText(
      /Questions\? Need any help\?.*We will respond as quick as possible/i,
    );
    this.emailText = page.getByText(/Email:\s*admin@mockwave\.io/i);
    this.emailLink = page.locator('a[href="mailto:admin@mockwave.io"]');
  }

  async goto() {
    await super.goto("https://mockwave.io/contact-us");
  }
}