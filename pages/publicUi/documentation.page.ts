import { Page, Locator } from "@playwright/test";
import { BasePublicPage } from "./base.page";

/** Documentation sections in sidebar order. */
export const DOC_SECTIONS = [
  {
    sidebarName: "1. Introduction",
    href: "/documentation#introduction",
    heading: "Introduction",
  },
  {
    sidebarName: "2. How mockwave work",
    href: "/documentation#howItWork",
    heading: "How it work",
  },
  {
    sidebarName: "3. Configuration lifecycle",
    href: "/documentation#configurationLifecycle",
    heading: "Configuration lifecycle",
  },
  {
    sidebarName: "4. Project",
    href: "/documentation#project",
    heading: "Project",
  },
  {
    sidebarName: "5. Endpoints",
    href: "/documentation#endpoints",
    heading: "Endpoints",
  },
  {
    sidebarName: "6. Responses",
    href: "/documentation#responses",
    heading: "Responses",
  },
] as const;

export class DocumentationPage extends BasePublicPage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Introduction" });
  }

  async goto() {
    await super.goto("https://mockwave.io/documentation#introduction");
  }

  sectionLink(sidebarName: string): Locator {
    return this.page.getByRole("link", { name: sidebarName });
  }

  sectionHeading(heading: string): Locator {
    return this.page.getByRole("heading", { name: heading });
  }
}