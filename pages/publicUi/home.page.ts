import { Page, Locator } from "@playwright/test";
import { BasePublicPage } from "./base.page";

export class HomePage extends BasePublicPage {
  readonly h1: Locator;
  readonly introParagraph: Locator;
  readonly featuresHeading: Locator;
  readonly saveTimeHeading: Locator;
  readonly frontendBenefitHeading: Locator;
  readonly backendBenefitHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.h1 = page.getByRole("heading", {
      level: 1,
      name: "Build your perfect mock api Free",
    });
    this.introParagraph = page.getByText(
      /Introducing mockwave.*go-to tool for effortless API mocking/i,
    );
    this.featuresHeading = page.getByRole("heading", {
      level: 3,
      name: "We Provide Many Features You Can Use",
    });
    this.saveTimeHeading = page.getByRole("heading", {
      level: 3,
      name: "Save time and focus on what truly matters.",
    });
    this.frontendBenefitHeading = page.getByRole("heading", {
      level: 3,
      name: "How frontend developers will be benefited ?",
    });
    this.backendBenefitHeading = page.getByRole("heading", {
      level: 6,
      name: "How Backend developers will be benefited ?",
    });
  }

  async goto() {
    await super.goto("https://mockwave.io/");
  }
}