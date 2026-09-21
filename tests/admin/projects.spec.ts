import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { ProjectsPage } from "../../pages/admin/projects.page";

// Authenticated session created once by the global set-up (global-setup.ts).
test.use({ storageState: "playwright/.auth/admin.json" });

/** Unique per parallel worker so the three browser projects don't clash. */
const PROJECT_PREFIX = () => `tc-w${test.info().workerIndex}-proj-`;
const PROJECT_LIST_API =
  "https://api.mockwave.io/api/v1/project?current_page=1&offset=200&pagesize=200&search=";

/** The account JWT is stored as a plain cookie inside the saved auth state. */
function readAuthToken() {
  const state = JSON.parse(
    fs.readFileSync("playwright/.auth/admin.json", "utf8"),
  );
  const cookie = (state.cookies || []).find((c: { name: string }) => c.name === "token");
  return cookie?.value || "";
}

/**
 * CRUD tests create real projects on the account, so they run serially and
 * every created project is removed afterwards through the API (fast and
 * deterministic), with an extra UI safety net.
 */
test.describe.configure({ mode: "serial" });

test.describe("Admin — Projects page (CRUD)", () => {
  test.afterEach(async ({ request }) => {
    const token = readAuthToken();
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    const res = await request.get(PROJECT_LIST_API, { headers });
    if (!res.ok()) return;
    const body: { data?: Array<{ id: number; name: string }> } = await res.json();
    for (const project of body.data || []) {
      if (project.name.startsWith(PROJECT_PREFIX())) {
        await request.delete(
          `https://api.mockwave.io/api/v1/project/${project.id}`,
          { headers },
        );
      }
    }
  });

  // TC01
  test("TC01 - Projects page opens at /projects", async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(projects.pageHeading).toBeVisible();
  });

  // TC02
  test("TC02 - New Project button is visible", async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await expect(projects.newProjectButton).toBeVisible();
  });

  // TC03
  test("TC03 - Export buttons CSV, TXT and PRINT are visible", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await expect(projects.csvButton).toBeVisible();
    await expect(projects.txtButton).toBeVisible();
    await expect(projects.printButton).toBeVisible();
  });

  // TC04
  test("TC04 - Search input is present and editable", async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await expect(projects.searchInput).toBeEditable();
    await expect(projects.searchInput).toHaveAttribute(
      "placeholder",
      "Search by project name ...",
    );
  });

  // TC05
  test("TC05 - Table has the expected column headers", async ({ page }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await expect(projects.tableHeaders).toHaveText([
      "Name",
      "Api prefix",
      "Api version",
      "Created at",
      "Number of configured endpoint",
      "Action",
    ]);
  });

  // TC06
  test("TC06 - Entries-per-page select and pagination info are shown", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await expect(projects.entriesSelect).toBeVisible();
    await expect(projects.paginationInfo).toBeVisible();
  });

  // TC07
  test("TC07 - Existing project row is listed with its details", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    const row = projects.row("test");
    await expect(row).toBeVisible();
    await expect(row).toContainText("test");
    await expect(row).toContainText("api");
    await expect(row).toContainText("v1");
  });

  // TC08
  test("TC08 - New Project modal opens with labels and live URL preview", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await projects.openNewProjectModal();
    await expect(projects.modalTitle).toHaveText(/Project/);
    await expect(projects.modal).toContainText("Project name *");
    await expect(projects.modal).toContainText("Api prefix");
    await expect(projects.modal).toContainText("Api version");
    await expect(projects.urlPreviewText).toContainText(
      "Your api endpoint base url will be",
    );
  });

  // TC09
  test("TC09 - New Project modal can be closed with the X button", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await projects.openNewProjectModal();
    await projects.modalCloseButton.click();
    await expect(projects.modal).toHaveCount(0);
  });

  // TC10
  test("TC10 - Live URL preview updates while typing", async ({ page }) => {
    const projects = new ProjectsPage(page);
    const name = `${PROJECT_PREFIX()}preview-${Date.now()}`;
    await projects.goto();
    await projects.openNewProjectModal();
    await projects.fillProjectForm(name, "api", "v1");
    await expect(projects.urlPreviewText).toContainText(name);
    await expect(projects.urlPreviewText).toContainText("api");
    await expect(projects.urlPreviewText).toContainText("v1");
  });

  // TC11
  test("TC11 - Validation: empty form shows required-field errors", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await projects.openNewProjectModal();
    await projects.saveButton.click();
    await expect(projects.modal).toContainText(
      "Oops! project name is a required field",
    );
    await expect(projects.modal).toContainText(
      "Oops! api prefix is a required field",
    );
    await expect(projects.modal).toContainText(
      "Oops! api version is a required field",
    );
    await expect(projects.projectNameInput).toHaveClass(/has-error/);
    await expect(projects.apiPrefixInput).toHaveClass(/has-error/);
  });

  // TC12
  test("TC12 - Validation: project name rejects uppercase, spaces and slashes", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    await projects.goto();
    await projects.openNewProjectModal();
    await projects.fillProjectForm("Bad Name/With/Slashes", "api", "v1");
    await projects.saveButton.click();
    await expect(projects.modal).toContainText(
      "Oops! Only lowercase letters, numbers and hyphen are allowed, without slashes or spaces",
    );
    await expect(projects.projectNameInput).toHaveClass(/has-error/);
  });

  // TC13
  test("TC13 - Create project: modal closes and row appears", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    const name = `${PROJECT_PREFIX()}create-${Date.now()}`;
    await projects.goto();
    await projects.createProject(name, "api", "v1");
    await expect(projects.modal).toHaveCount(0);
    await expect(projects.row(name)).toBeVisible({ timeout: 15_000 });
    await expect(projects.toastWithText("Project created successfully")).toBeVisible();
  });

  // TC14
  test("TC14 - Created row shows prefix, version and a date", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    const name = `${PROJECT_PREFIX()}row-${Date.now()}`;
    await projects.goto();
    await projects.createProject(name, "api", "v2");
    const row = projects.row(name);
    await expect(row).toContainText("api", { timeout: 15_000 });
    await expect(row).toContainText("v2", { timeout: 15_000 });
    await expect(row).toContainText(/\d{4}-\d{2}-\d{2}/, { timeout: 15_000 });
    await projects.deleteProject(name);
    await projects.confirmDelete();
  });

  // TC15
  test("TC15 - Edit modal is pre-filled with the project data", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    const name = `${PROJECT_PREFIX()}edit-${Date.now()}`;
    await projects.goto();
    await projects.createProject(name, "api", "v3");
    await projects.row(name).locator('a[title="Edit project"]').click();
    await projects.projectNameInput.waitFor({ state: "visible" });
    await expect(projects.projectNameInput).toHaveValue(name);
    await expect(projects.apiPrefixInput).toHaveValue("api");
    await expect(projects.apiVersionInput).toHaveValue("v3");
    await projects.modalCloseButton.click();
    await projects.deleteProject(name);
    await projects.confirmDelete();
  });

  // TC16
  test("TC16 - Edit project name is saved and the row updates", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    const oldName = `${PROJECT_PREFIX()}rename-${Date.now()}`;
    const newName = `${PROJECT_PREFIX()}renamed-${Date.now()}`;
    await projects.goto();
    await projects.createProject(oldName, "api", "v1");
    await projects.row(oldName).locator('a[title="Edit project"]').click();
    await projects.projectNameInput.fill(newName);
    await projects.saveButton.click();
    await expect(projects.row(newName)).toBeVisible({ timeout: 15_000 });
    await expect(projects.row(oldName)).toHaveCount(0, { timeout: 15_000 });
    await projects.deleteProject(newName);
    await projects.confirmDelete();
  });

  // TC17
  test("TC17 - Delete: confirmation dialog shows warning text", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    const name = `${PROJECT_PREFIX()}warn-${Date.now()}`;
    await projects.goto();
    await projects.createProject(name, "api", "v1");
    await projects.deleteProject(name);
    await expect(projects.confirmDialog).toContainText("Are you sure?");
    await expect(projects.confirmDialog).toContainText(
      "You won't be able to revert this!",
    );
    await expect(projects.confirmDialog.getByRole("button")).toContainText([
      "Yes, delete it!",
    ]);
    await projects.confirmDelete();
  });

  // TC18
  test("TC18 - Delete: cancelling keeps the project", async ({ page }) => {
    const projects = new ProjectsPage(page);
    const name = `${PROJECT_PREFIX()}cancel-${Date.now()}`;
    await projects.goto();
    await projects.createProject(name, "api", "v1");
    await projects.deleteProject(name);
    await projects.cancelDelete();
    await expect(projects.confirmDialog).toHaveCount(0);
    await expect(projects.row(name)).toBeVisible();
    await projects.deleteProject(name);
    await projects.confirmDelete();
  });

  // TC19
  test("TC19 - Delete: confirming removes the row", async ({ page }) => {
    const projects = new ProjectsPage(page);
    const name = `${PROJECT_PREFIX()}delete-${Date.now()}`;
    await projects.goto();
    await projects.createProject(name, "api", "v1");
    await projects.deleteProject(name);
    await projects.confirmDelete();
    await expect(projects.row(name)).toHaveCount(0, { timeout: 15_000 });
    await expect(projects.toastWithText(/delete/i)).toBeVisible({ timeout: 15_000 });
  });

  // TC20
  test("TC20 - Multiple projects are listed as separate rows", async ({
    page,
  }) => {
    const projects = new ProjectsPage(page);
    const nameA = `${PROJECT_PREFIX()}a-${Date.now()}`;
    const nameB = `${PROJECT_PREFIX()}b-${Date.now()}`;
    await projects.goto();
    await projects.createProject(nameA, "api", "v1");
    await projects.createProject(nameB, "api", "v1");
    await expect(projects.row(nameA)).toBeVisible();
    await expect(projects.row(nameB)).toBeVisible();
    // Both projects exist next to the pre-existing "test" project. The exact
    // row count is not asserted — other parallel workers may have their own
    // temporary projects visible.
    await projects.deleteProject(nameA);
    await projects.confirmDelete();
    await projects.deleteProject(nameB);
    await projects.confirmDelete();
  });
});