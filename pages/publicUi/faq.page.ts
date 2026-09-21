import { Page, Locator } from "@playwright/test";
import { BasePublicPage } from "./base.page";

/** All FAQ questions exactly as rendered on the page. */
export const FAQ_QUESTIONS = [
  "What is mockwave?",
  "Why should I use mockwave?",
  "How do I create a project in mockwave?",
  "What is an endpoint in mockwave?",
  "How do I configure a mock API endpoint?",
  "What happens if I don't configure any response for an endpoint?",
  "How do I create a mock response?",
  "What are response rules, and how do they work?",
  "Can I generate dynamic or fake data in responses?",
  "How do I simulate a list or array of objects in a response?",
  "Can I introduce a delay in the API response?",
  "Is there a limit to the response size or depth?",
  "Is possible to access query and body parameters during configure response?",
  "Is possible to access header parameters during configure response?",
  "Have any limit to request api per second?",
  "Cam we add collaborator to manage a project?",
] as const;

export class FaqPage extends BasePublicPage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", {
      name: "Frequently Asked Questions",
    });
  }

  async goto() {
    await super.goto("https://mockwave.io/faq");
  }

  questionButton(question: string): Locator {
    return this.page.getByRole("button", { name: question });
  }

  /** The collapsible answer box belonging to a question. */
  answerBox(question: string): Locator {
    return this.page
      .locator(".mb-4", { has: this.questionButton(question) })
      .locator("div.overflow-hidden");
  }

  readDocsLink(question: string): Locator {
    return this.answerBox(question).getByText("Read docs to know more");
  }
}