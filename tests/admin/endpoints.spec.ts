import { test, expect } from "@playwright/test";
import { EndpointsPage } from "../../pages/admin/endpoints.page";
import {
  deleteEndpointsByPrefix,
  listEndpoints,
} from "../../utils/api";

// Authenticated session created once by the global set-up (global-setup.ts).
test.use({ storageState: "playwright/.auth/admin.json" });

/** Unique per parallel worker so the three browser projects don't clash. */
const NAME_PREFIX = () => `tc-w${test.info().workerIndex}-ep-`;

/**
 * Endpoint CRUD tests create real data on the shared account, so they run
 * serially and every created endpoint is removed afterwards through the API.
 */
test.describe.configure({ mode: "serial" });

test.describe("Admin — Endpoints page (CRUD)", () => {
  test.afterEach(async ({ request }) => {
    await deleteEndpointsByPrefix(request, NAME_PREFIX());
  });

  // TC01
  test("TC01 - Endpoints page opens at /endpoints", async ({ page }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await expect(page).toHaveURL(/\/endpoints$/);
    await expect(endpoints.pageHeading).toBeVisible();
  });

  // TC02
  test("TC02 - New Endpoint button is visible", async ({ page }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await expect(endpoints.newEndpointButton).toBeVisible();
  });

  // TC03
  test("TC03 - CSV, TXT and PRINT export buttons are visible", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await expect(endpoints.csvButton).toBeVisible();
    await expect(endpoints.txtButton).toBeVisible();
    await expect(endpoints.printButton).toBeVisible();
  });

  // TC04
  test("TC04 - Endpoint search input is present and editable", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await expect(endpoints.searchInput).toBeEditable();
    await expect(endpoints.searchInput).toHaveAttribute(
      "placeholder",
      "Search by endpoint",
    );
  });

  // TC05
  test("TC05 - Table has the expected column headers", async ({ page }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await expect(endpoints.tableHeaders).toHaveText([
      "Project/Collection Name",
      "Endpoints",
      "Method",
      "Number of configured response",
      "Action",
    ]);
  });

  // TC06
  test("TC06 - Existing api endpoint row shows project, method and count", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    const row = endpoints.row("api");
    await expect(row).toBeVisible({ timeout: 15_000 });
    await expect(row).toContainText("test");
    await expect(row).toContainText("API Prefix: api");
    await expect(row).toContainText("API Version: v1");
    await expect(row).toContainText("POST");
    await expect(row).toContainText("1"); // one configured response
  });

  // TC07
  test("TC07 - Entries-per-page select and pagination info are shown", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await expect(endpoints.entriesSelect).toBeVisible();
    await expect(endpoints.paginationInfo).toBeVisible();
  });

  // TC08
  test("TC08 - New Endpoint modal shows labels, project and method options", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await endpoints.openNewEndpointModal();
    await expect(endpoints.modal).toContainText("Project / Collection name *");
    await expect(endpoints.modal).toContainText("Endpoint");
    await expect(endpoints.projectSelect).toContainText("test/api/v1");
    await expect(endpoints.methodSelect).toContainText("GET");
    await expect(endpoints.methodSelect).toContainText("POST");
    await expect(endpoints.methodSelect).toContainText("PUT");
    await expect(endpoints.methodSelect).toContainText("PATCH");
    await expect(endpoints.methodSelect).toContainText("DELETE");
  });

  // TC09
  test("TC09 - New Endpoint modal closes with the X button", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await endpoints.openNewEndpointModal();
    await endpoints.modalCloseButton.click();
    await expect(endpoints.modal).toHaveCount(0);
  });

  // TC10
  test("TC10 - Validation: empty form shows required-field errors", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await endpoints.openNewEndpointModal();
    await endpoints.saveButton.click();
    await expect(endpoints.modal).toContainText(
      "Oops! Project ID is a required field",
    );
    await expect(endpoints.modal).toContainText(
      "Oops! Endpoint is a required field",
    );
    await expect(endpoints.modal).toContainText(
      "Oops! Method is a required field",
    );
  });

  // TC11
  test("TC11 - Validation: invalid endpoint name is rejected", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await endpoints.openNewEndpointModal();
    await endpoints.selectProject();
    await endpoints.endpointNameInput.fill("Bad Endpoint Name");
    await endpoints.methodSelect.selectOption({ label: "GET" });
    await endpoints.saveButton.click();
    await expect(endpoints.modal).toContainText(
      "Oops! Invalid endpoint, only letters, numbers, hyphens, and colons for parameters are allowed, no special characters, no slashes at the beginning or end",
    );
  });

  // TC12
  test("TC12 - Create endpoint: modal closes, toast and row appear", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    const name = `${NAME_PREFIX()}create-${Date.now()}`;
    await endpoints.goto();
    await endpoints.createEndpoint(name, "GET");
    await expect(endpoints.modal).toHaveCount(0);
    await expect(endpoints.row(name)).toBeVisible({ timeout: 15_000 });
    await expect(endpoints.toastWithText("Endpoints created successfully")).toBeVisible();
  });

  // TC13
  test("TC13 - Created row shows the endpoint name, method and zero responses", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    const name = `${NAME_PREFIX()}row-${Date.now()}`;
    await endpoints.goto();
    await endpoints.createEndpoint(name, "PUT");
    const row = endpoints.row(name);
    await expect(row).toContainText(name, { timeout: 15_000 });
    await expect(row).toContainText("PUT", { timeout: 15_000 });
    await expect(row).toContainText("0", { timeout: 15_000 }); // configured responses
    await expect(endpoints.configureResponseLink(row)).toBeVisible();
  });

  // TC14
  test("TC14 - Duplicate endpoint name is rejected and modal stays open", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    await endpoints.openNewEndpointModal();
    await endpoints.selectProject();
    await endpoints.endpointNameInput.fill("api"); // already exists
    await endpoints.methodSelect.selectOption({ label: "GET" });
    await endpoints.saveButton.click();
    await expect(endpoints.modal).toContainText("Oops! endpoint must be unique");
    await expect(endpoints.endpointNameInput).toBeVisible();
    await endpoints.modalCloseButton.click();
    await expect(endpoints.modal).toHaveCount(0);
  });

  // TC15
  test("TC15 - Edit modal is pre-filled with the endpoint data", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    const name = `${NAME_PREFIX()}edit-${Date.now()}`;
    await endpoints.goto();
    await endpoints.createEndpoint(name, "PATCH");
    await endpoints.editLink(endpoints.row(name)).click();
    await endpoints.endpointNameInput.waitFor({ state: "visible" });
    await expect(endpoints.projectSelect).toHaveValue("117"); // test project
    await expect(endpoints.endpointNameInput).toHaveValue(name);
    await expect(endpoints.methodSelect).toHaveValue("PATCH");
    await endpoints.modalCloseButton.click();
    await endpoints.deleteEndpoint(name);
    await endpoints.confirmSwal();
  });

  // TC16
  test("TC16 - Editing the method is saved and the row updates", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    const name = `${NAME_PREFIX()}method-${Date.now()}`;
    await endpoints.goto();
    await endpoints.createEndpoint(name, "GET");
    await endpoints.editLink(endpoints.row(name)).click();
    await endpoints.methodSelect.selectOption({ label: "DELETE" });
    await endpoints.saveButton.click();
    const row = endpoints.row(name);
    await expect(row).toContainText("DELETE", { timeout: 15_000 });
    await expect(row).not.toContainText("GET");
    await endpoints.deleteEndpoint(name);
    await endpoints.confirmSwal();
  });

  // TC17
  test("TC17 - Delete: confirmation dialog shows warning text", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    const name = `${NAME_PREFIX()}warn-${Date.now()}`;
    await endpoints.goto();
    await endpoints.createEndpoint(name, "GET");
    await endpoints.deleteEndpoint(name);
    await expect(endpoints.confirmDialog).toContainText("Are you sure?");
    await expect(endpoints.confirmDialog).toContainText(
      "You won't be able to revert this!",
    );
    await expect(endpoints.confirmDialog.getByRole("button")).toContainText([
      "Yes, delete it!",
    ]);
    await endpoints.confirmSwal();
  });

  // TC18
  test("TC18 - Delete: cancelling keeps the endpoint", async ({ page }) => {
    const endpoints = new EndpointsPage(page);
    const name = `${NAME_PREFIX()}cancel-${Date.now()}`;
    await endpoints.goto();
    await endpoints.createEndpoint(name, "POST");
    await endpoints.deleteEndpoint(name);
    await endpoints.cancelSwal();
    await expect(endpoints.confirmDialog).toHaveCount(0);
    await expect(endpoints.row(name)).toBeVisible();
    await endpoints.deleteEndpoint(name);
    await endpoints.confirmSwal();
  });

  // TC19
  test("TC19 - Delete: confirming removes the endpoint", async ({ page }) => {
    const endpoints = new EndpointsPage(page);
    const name = `${NAME_PREFIX()}delete-${Date.now()}`;
    await endpoints.goto();
    await endpoints.createEndpoint(name, "GET");
    await endpoints.deleteEndpoint(name);
    await endpoints.confirmSwal();
    await expect(endpoints.row(name)).toHaveCount(0, { timeout: 15_000 });
    await expect(endpoints.toastWithText(/delete/i)).toBeVisible({
      timeout: 15_000,
    });
  });

  // TC20
  test("TC20 - Configure response link points to the endpoint response page", async ({
    page,
  }) => {
    const endpoints = new EndpointsPage(page);
    await endpoints.goto();
    // The real "api" endpoint is used here: it must never be deleted.
    const row = endpoints.row("api");
    await expect(row).toBeVisible({ timeout: 15_000 });
    const href = await endpoints
      .configureResponseLink(row)
      .getAttribute("href");
    expect(href).toMatch(/^\/configure-response\/\d+$/);
    await Promise.all([
      page.waitForURL(/\/configure-response\/\d+/),
      endpoints.configureResponseLink(row).click(),
    ]);
  });
});