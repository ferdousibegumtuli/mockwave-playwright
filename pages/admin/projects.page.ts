import { Page, Locator } from "@playwright/test";
import { BaseAdminPage } from "./base.page";

/**
 * Projects page at admin.mockwave.io/projects.
 */
export class ProjectsPage extends BaseAdminPage {
  readonly pageHeading: Locator;
  readonly newProjectButton: Locator;
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
  readonly projectNameInput: Locator;
  readonly apiPrefixInput: Locator;
  readonly apiVersionInput: Locator;
  readonly saveButton: Locator;
  readonly urlPreviewText: Locator;

  // Notifications
  readonly confirmDialog: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole("heading", { name: "Projects" });
    this.newProjectButton = page.getByRole("button", { name: "New Project" });
    this.searchInput = page.locator(
      'input[placeholder*="Search by project name"]',
    );
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
    this.projectNameInput = this.modal.locator("#projectName");
    this.apiPrefixInput = this.modal.locator("#apiPrefix");
    this.apiVersionInput = this.modal.locator("#apiVersionError");
    this.saveButton = this.modal.getByRole("button", { name: "Save" });
    this.urlPreviewText = page
      .locator("div")
      .filter({ hasText: /Your api endpoint base url will be/ })
      .last();

    this.confirmDialog = page.locator(".swal2-container");
  }

  async goto() {
    await super.goto("https://admin.mockwave.io/projects");
  }

  /** The toast notification whose message matches `text` (newest first). */
  toastWithText(text: string | RegExp) {
    return this.page
      .locator("[data-testid=toast-body]", { hasText: text })
      .first();
  }

  row(name: string) {
    return this.page.locator("tbody tr", { hasText: name });
  }

  async openNewProjectModal() {
    await this.newProjectButton.click();
    // The headless-ui dialog wrapper has zero size, so wait for a real
    // element inside the modal instead.
    await this.projectNameInput.waitFor({ state: "visible" });
  }

  async fillProjectForm(name: string, prefix: string, version: string) {
    await this.projectNameInput.fill(name);
    await this.apiPrefixInput.fill(prefix);
    await this.apiVersionInput.fill(version);
  }

  async createProject(name: string, prefix: string, version: string) {
    await this.openNewProjectModal();
    await this.fillProjectForm(name, prefix, version);
    await this.saveButton.click();
    // Wait until the modal is fully closed (detached from the DOM) so two
    // rapid creates never race on the same modal / table refresh.
    await this.modal.waitFor({ state: "detached", timeout: 20_000 }).catch(() => {});
  }

  async deleteProject(name: string) {
    await this.row(name).locator('a[title="Delete project"]').click();
    await this.confirmDialog.waitFor({ state: "visible" });
  }

  async confirmDelete() {
    await this.confirmDialog.locator(".swal2-confirm").click();
  }

  async cancelDelete() {
    // The "No" (swal2-deny) button is a hidden stub — use "Cancel".
    await this.confirmDialog.locator(".swal2-cancel").click();
  }
}