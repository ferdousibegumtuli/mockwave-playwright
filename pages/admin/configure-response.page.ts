import { Page, Locator } from "@playwright/test";
import { BaseAdminPage } from "./base.page";

/**
 * Configure Response page at admin.mockwave.io/configure-response/{endpointId}.
 */
export class ConfigureResponsePage extends BaseAdminPage {
  readonly newResponseButton: Locator;
  readonly tableHeaders: Locator;
  readonly rows: Locator;
  readonly paginationInfo: Locator;
  readonly infoLabels: Locator;

  // New/Edit response modal
  readonly modal: Locator;
  readonly modalCloseButton: Locator;
  readonly codeSelect: Locator;
  readonly responseTextarea: Locator;
  readonly ruleFieldTypeSelect: Locator;
  readonly ruleNameInput: Locator;
  readonly ruleOperatorSelect: Locator;
  readonly ruleValueTypeSelect: Locator;
  readonly customValueInput: Locator;
  readonly addRuleButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);

    this.newResponseButton = page.getByRole("button", { name: "New Response" });
    this.tableHeaders = page.locator("table thead th");
    this.rows = page.locator("tbody tr");
    this.paginationInfo = page.getByText(/Total \d+ entries/);
    this.infoLabels = page.locator("div").filter({ hasText: /Project name/ }).last();

    this.modal = page.locator("[role=dialog]");
    this.modalCloseButton = this.modal.locator("button").first();
    this.codeSelect = this.modal.locator("#ctnSelect1");
    this.responseTextarea = this.modal.locator("textarea");
    this.ruleFieldTypeSelect = this.modal.locator("select").nth(1);
    this.ruleNameInput = this.modal.locator('input[placeholder="Query param name"]');
    this.ruleOperatorSelect = this.modal.locator("select").nth(2);
    this.ruleValueTypeSelect = this.modal.locator("select").nth(3);
    this.customValueInput = this.modal.locator('input[placeholder="custom value"]');
    this.addRuleButton = this.modal.getByRole("button", { name: "Add new rule" });
    this.saveButton = this.modal.getByRole("button", { name: "Save" });
  }

  async goto(endpointId: number) {
    await super.goto(
      `https://admin.mockwave.io/configure-response/${endpointId}`,
    );
  }

  responseRow(codeLabel: string) {
    // Match the response-code cell exactly so e.g. "200" never matches a
    // different code (or unrelated text elsewhere in the row).
    return this.page
      .locator("tbody tr")
      .filter({
        has: this.page.getByRole("cell", { name: codeLabel, exact: true }),
      })
      .first();
  }

  editLink(row: Locator) {
    return row.locator('a[title="Edit Response"]');
  }

  deleteLink(row: Locator) {
    return row.locator('a[title="Delete Response"]');
  }

  /** The rule icon in the "Have any rule ?" column of a row. */
  ruleIcon(row: Locator) {
    return row.locator("td").nth(1).locator("svg").first();
  }

  async openNewResponseModal() {
    await this.newResponseButton.click();
    await this.codeSelect.waitFor({ state: "visible" });
  }

  /**
   * Fills the New/Edit response form. `rule` is optional:
   * { fieldType: "Query"|"Body"|"Params", fieldName, operator: "="|"!",
   *   valueType: "Empty"|"String"|...|"Custom", customValue? }
   */
  async fillResponseForm(
    codeLabel: string,
    responseBody: string,
    rule?: {
      fieldType: string;
      fieldName: string;
      operator: string;
      valueType: string;
      customValue?: string;
    },
  ) {
    await this.codeSelect.selectOption({ label: codeLabel });
    await this.responseTextarea.fill(responseBody);
    if (rule) {
      await this.ruleFieldTypeSelect.selectOption({ label: rule.fieldType });
      await this.ruleNameInput.fill(rule.fieldName);
      await this.ruleOperatorSelect.selectOption({ label: rule.operator });
      await this.ruleValueTypeSelect.selectOption({
        label: rule.valueType,
      });
      if (rule.valueType === "Custom" && rule.customValue !== undefined) {
        await this.customValueInput.fill(rule.customValue);
      }
    }
  }

  async save() {
    await this.saveButton.click();
    // Wait until the modal is fully closed, like the other admin modals.
    await this.modal
      .waitFor({ state: "detached", timeout: 20_000 })
      .catch(() => {});
  }

  async createResponse(
    codeLabel: string,
    responseBody: string,
    rule?: {
      fieldType: string;
      fieldName: string;
      operator: string;
      valueType: string;
      customValue?: string;
    },
  ) {
    await this.openNewResponseModal();
    await this.fillResponseForm(codeLabel, responseBody, rule);
    await this.save();
  }
}