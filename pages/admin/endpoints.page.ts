import { Page, Locator, expect } from "@playwright/test";
import { BaseAdminPage } from "./base.page";

/**
 * Endpoints page at admin.mockwave.io/endpoints. Endpoints belong to the
 * pre-existing "test/api/v1" project (id 117) which tests must never touch.
 */
export class EndpointsPage extends BaseAdminPage {
  readonly pageHeading: Locator;
  readonly newEndpointButton: Locator;
  readonly searchInput: Locator;
  readonly csvButton: Locator;
  readonly txtButton: Locator;
  readonly printButton: Locator;
  readonly tableHeaders: Locator;
  readonly entriesSelect: Locator;
  readonly paginationInfo: Locator;
  readonly rows: Locator;

  // Create / edit modal
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalCloseButton: Locator;
  readonly projectSelect: Locator;
  readonly endpointNameInput: Locator;
  readonly methodSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole("heading", { name: "Endpoints" });
    this.newEndpointButton = page.getByRole("button", { name: "New Endpoint" });
    this.searchInput = page.locator('input[placeholder="Search by endpoint"]');
    this.csvButton = page.getByRole("button", { name: "CSV" });
    this.txtButton = page.getByRole("button", { name: "TXT" });
    this.printButton = page.getByRole("button", { name: "PRINT" });
    this.tableHeaders = page.locator("table thead th");
    this.entriesSelect = page.locator("select").first();
    this.paginationInfo = page.getByText(/Showing \d+ to \d+ of \d+ entries/);
    this.rows = page.locator("tbody tr");

    this.modal = page.locator("[role=dialog]");
    this.modalTitle = this.modal.locator("div.text-lg").first();
    this.modalCloseButton = this.modal.locator("button").first();
    this.projectSelect = this.modal.locator("select").first();
    this.endpointNameInput = this.modal.locator("#apiPrefix");
    this.methodSelect = this.modal.locator("#ctnSelect1");
    this.saveButton = this.modal.getByRole("button", { name: "Save" });
  }

  async goto() {
    await super.goto("https://admin.mockwave.io/endpoints");
  }

  row(name: string) {
    // Match the endpoint-name cell exactly: the project cell also contains
    // the text "API Prefix: api", so a plain hasText would match every row.
    return this.page.locator("tbody tr").filter({
      has: this.page.getByRole("cell", { name, exact: true }),
    });
  }

  configureResponseLink(row: Locator) {
    return row.locator('a[title="Configure response for this endpoint"]');
  }

  editLink(row: Locator) {
    return row.locator('a[title="Edit endpoint"]');
  }

  deleteLink(row: Locator) {
    return row.locator('a[title="Delete endpoint"]');
  }

  async openNewEndpointModal() {
    await this.newEndpointButton.click();
    await this.endpointNameInput.waitFor({ state: "visible" });
  }

  /**
   * Selects the project. The project list is fetched asynchronously and the
   * <select> can be re-rendered (resetting the value) while it loads, so keep
   * selecting until the value actually sticks.
   */
  async selectProject(label = "test/api/v1") {
    await expect
      .poll(
        async () => {
          try {
            await this.projectSelect.selectOption({ label });
          } catch {
            // The option may not have been rendered yet.
          }
          return this.projectSelect.inputValue();
        },
        { timeout: 15_000 },
      )
      .not.toBe("");
  }

  async createEndpoint(name: string, method: string) {
    await this.openNewEndpointModal();
    await this.selectProject();
    await this.endpointNameInput.fill(name);
    await this.methodSelect.selectOption({ label: method });
    await this.saveButton.click();
    // Wait until the modal is fully gone so consecutive creates never race.
    await this.modal
      .waitFor({ state: "detached", timeout: 20_000 })
      .catch(() => {});
  }

  async deleteEndpoint(name: string) {
    await this.deleteLink(this.row(name)).click();
    await this.confirmDialog.waitFor({ state: "visible" });
  }
}