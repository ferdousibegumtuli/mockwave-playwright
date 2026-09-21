import { Page, Locator } from "@playwright/test";
import { BasePublicPage } from "./base.page";

/** Every feature heading exactly as rendered on the page. */
export const FEATURE_HEADINGS = [
  "Manage unlimited projects",
  "Manage unlimited endpoints",
  "Configure multiple & dynamic response at the same endpoint",
  "Use Incoming Query and Body Parameters in Mock Responses",
  "Automatically Generate Realistic Fake Data in Responses",
  "Simulate errors and delays for comprehensive testing.",
  "Easily Integrate Mocks into Your Workflow",
  "Simplify Microservice Testing and Development with mockwave",
  "Instant Mock Services: No Environment Setup Required",
] as const;

/** A stable fragment of each feature description paragraph. */
export const FEATURE_DESCRIPTIONS = [
  "Effortlessly manage unlimited projects with mockwave",
  "Create as many endpoints as you need with mockwave",
  "Easily configure multiple dynamic responses, like 200, 201, and more",
  "Effortlessly access and use the query and body parameters",
  "Automatically create realistic fake data in your mock responses",
  "Simulate delays, server errors, timeouts, and other edge cases",
  "Effortlessly integrate mocks into your workflow with mockwave",
  "mockwave is ideal for microservice testing and development",
  "Instantly use mockwave for mock services without any server configuration",
] as const;

export class FeaturePage extends BasePublicPage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto("https://mockwave.io/feature");
  }

  heading(name: string): Locator {
    return this.page.getByRole("heading", { level: 3, name });
  }

  description(fragment: string): Locator {
    return this.page.getByText(new RegExp(fragment, "i"));
  }
}