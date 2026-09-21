import { Page, Locator } from "@playwright/test";
import { BaseAdminPage } from "./base.page";

export class DashboardPage extends BaseAdminPage {
  readonly welcomeHeading: Locator;
  readonly welcomeSubText: Locator;
  readonly projectsStatLabel: Locator;
  readonly endpointsStatLabel: Locator;
  readonly responsesStatLabel: Locator;

  constructor(page: Page) {
    super(page);

    this.welcomeHeading = page.getByText(/Hi, Tuli/i);
    this.welcomeSubText = page.getByText("Welcome to mockwave");
    this.projectsStatLabel = page.getByText("Projects", { exact: true });
    this.endpointsStatLabel = page.getByText("Endpoints", { exact: true });
    this.responsesStatLabel = page.getByText("Responses", { exact: true });
  }

  async goto() {
    await super.goto("https://admin.mockwave.io/dashboard");
  }
}