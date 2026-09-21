import { test, expect } from "@playwright/test";
import { EndpointsPage } from "../../pages/admin/endpoints.page";
import { ConfigureResponsePage } from "../../pages/admin/configure-response.page";
import {
  deleteEndpointsByPrefix,
  deleteResponsesForEndpoint,
} from "../../utils/api";

// Authenticated session created once by the global set-up (global-setup.ts).
test.use({ storageState: "playwright/.auth/admin.json" });

/** Unique per worker so the three browser projects don't clash. */
const NAME_PREFIX = () => `tc-w${test.info().workerIndex}-cfg-`;

/**
 * All response tests run against one throwaway endpoint created in
 * beforeAll. Responses are removed after each test; the endpoint itself is
 * removed in afterAll. The real "api" endpoint (and its 201 response) are
 * never touched.
 */
test.describe.configure({ mode: "serial" });

let endpointId = 0;
let endpointName = "";

test.describe("Admin — Configure Response page", () => {
  test.beforeAll(async ({ browser, request }) => {
    endpointName = `${NAME_PREFIX()}ep${Date.now()}`;
    // Remove any leftover endpoint from a crashed earlier run first, so a
    // fresh one can be created through the UI (just like a real user).
    await deleteEndpointsByPrefix(request, NAME_PREFIX());
    const context = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    try {
      const page = await context.newPage();
      const endpoints = new EndpointsPage(page);
      await endpoints.goto();
      await endpoints.createEndpoint(endpointName, "POST");
      const href = await endpoints
        .configureResponseLink(endpoints.row(endpointName))
        .getAttribute("href");
      expect(href).toMatch(/^\/configure-response\/\d+$/);
      endpointId = Number(href!.split("/").pop());
    } finally {
      await context.close();
    }
  });

  test.afterEach(async ({ request }) => {
    if (endpointId) await deleteResponsesForEndpoint(request, endpointId);
  });

  test.afterAll(async ({ request }) => {
    if (endpointId) await deleteEndpointsByPrefix(request, NAME_PREFIX());
  });

  // TC01
  test("TC01 - Configure Response page shows the endpoint info card", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await expect(cfg.newResponseButton).toBeVisible();
    await expect(cfg.infoLabels).toContainText("Project name");
    await expect(cfg.infoLabels).toContainText("Api");
    await expect(cfg.infoLabels).toContainText("Base url");
    await expect(cfg.infoLabels).toContainText("Endpoint");
    await expect(cfg.paginationInfo).toBeVisible(); // Total N entries
  });

  // TC02
  test("TC02 - Response table has the expected headers", async ({ page }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await expect(cfg.tableHeaders).toHaveText([
      "Response code",
      "Have any rule ?",
      "Action",
    ]);
    await expect(cfg.paginationInfo).toContainText("Total 0 entries");
  });

  // TC03
  test("TC03 - New Response modal shows code options, textarea and buttons", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.openNewResponseModal();
    await expect(cfg.codeSelect).toContainText("200 - HTTP OK");
    await expect(cfg.codeSelect).toContainText("500 - HTTP INTERNAL SERVER ERROR");
    await expect(cfg.responseTextarea).toHaveAttribute(
      "placeholder",
      '{"status": true}',
    );
    await expect(cfg.addRuleButton).toBeVisible();
    await expect(cfg.saveButton).toBeVisible();
    await expect(cfg.customValueInput).toBeDisabled();
  });

  // TC04
  test("TC04 - New Response modal closes with the X button", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.openNewResponseModal();
    await cfg.modalCloseButton.click();
    await expect(cfg.modal).toHaveCount(0);
  });

  // TC05
  test("TC05 - Create response without rules: row appears with no-rule icon", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.createResponse("200 - HTTP OK", '{"status": true}');
    const row = cfg.responseRow("200");
    await expect(row).toContainText("200", { timeout: 15_000 });
    await expect(cfg.toastWithText("Response operation successfully done")).toBeVisible();
    // No rule -> text-danger X icon in the "Have any rule ?" column.
    await expect(cfg.ruleIcon(row)).toHaveClass(/text-danger/);
  });

  // TC06
  test("TC06 - Create response with a rule: has-rule icon is shown", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.createResponse("201 - HTTP CREATED", '{"created": true}', {
      fieldType: "Query",
      fieldName: "id",
      operator: "=",
      valueType: "String",
    });
    const row = cfg.responseRow("201");
    await expect(row).toContainText("201", { timeout: 15_000 });
    await expect(cfg.ruleIcon(row)).toHaveClass(/text-success/);
  });

  // TC07
  test("TC07 - Custom value input is only enabled for the Custom type", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.openNewResponseModal();
    await expect(cfg.customValueInput).toBeDisabled();
    await cfg.ruleValueTypeSelect.selectOption({ label: "Custom" });
    await expect(cfg.customValueInput).toBeEnabled();
    await cfg.customValueInput.fill("hello");
    await cfg.ruleValueTypeSelect.selectOption({ label: "String" });
    await expect(cfg.customValueInput).toBeDisabled();
  });

  // TC08
  test("TC08 - Add new rule appends another rule row", async ({ page }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.openNewResponseModal();
    await expect(cfg.ruleNameInput.first()).toBeVisible();
    // Complete the first rule row, then add a second one.
    await cfg.ruleFieldTypeSelect.selectOption({ label: "Query" });
    await cfg.ruleNameInput.first().fill("id");
    await cfg.ruleOperatorSelect.selectOption({ label: "=" });
    await cfg.ruleValueTypeSelect.selectOption({ label: "String" });
    const ruleNames = page.locator('input[placeholder="Query param name"]');
    const before = await ruleNames.count();
    await cfg.addRuleButton.click();
    // "Add new rule" appends one more rule row (one more name input).
    await expect
      .poll(async () => ruleNames.count(), { timeout: 5_000 })
      .toBe(before + 1);
    // Fill the second rule row too so the form validates.
    await ruleNames.nth(1).fill("uid");
    await cfg.codeSelect.selectOption({ label: "200 - HTTP OK" });
    await cfg.responseTextarea.fill('{"ok": true}');
    await cfg.save();
    const row = cfg.responseRow("200");
    await expect(row).toContainText("200", { timeout: 15_000 });
  });

  // TC09
  test("TC09 - Clicking a response row shows the JSON preview", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.createResponse("202 - HTTP ACCEPTED", '{"status": true}');
    const row = cfg.responseRow("202");
    await expect(row).toContainText("202", { timeout: 15_000 });
    await row.click();
    // The response body is rendered as a highlighted JSON token block.
    await expect(page.locator("span.token.string").first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator("span.token.string").first()).toContainText(
      "status",
    );
  });

  // TC10
  test("TC10 - Edit modal is pre-filled with response code, body and rule", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.createResponse("200 - HTTP OK", '{"status": true}', {
      fieldType: "Query",
      fieldName: "id",
      operator: "=",
      valueType: "String",
    });
    await cfg.editLink(cfg.responseRow("200")).click();
    await cfg.codeSelect.waitFor({ state: "visible" });
    await expect(cfg.codeSelect).toHaveValue("200");
    await expect(cfg.responseTextarea).toHaveValue(/status/);
    await expect(cfg.ruleNameInput).toHaveValue("id");
    await expect(cfg.ruleOperatorSelect).toHaveValue("=");
    await expect(cfg.ruleValueTypeSelect).toHaveValue("string");
  });

  // TC11
  test("TC11 - Editing the response code updates the row", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.createResponse("201 - HTTP CREATED", '{"created": true}');
    const row = cfg.responseRow("201");
    await expect(row).toContainText("201", { timeout: 15_000 });
    await cfg.editLink(row).click();
    await cfg.codeSelect.selectOption({ label: "200 - HTTP OK" });
    await cfg.save();
    await expect(cfg.responseRow("200")).toBeVisible({ timeout: 15_000 });
    await expect(cfg.responseRow("201")).toHaveCount(0, { timeout: 15_000 });
  });

  // TC12
  test("TC12 - Deleting a response removes it immediately without a confirm dialog", async ({
    page,
  }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.createResponse("204 - HTTP NO CONTENT", '{"ok": true}');
    const row = cfg.responseRow("204");
    await expect(row).toContainText("204", { timeout: 15_000 });
    await cfg.deleteLink(row).click();
    await expect(cfg.responseRow("204")).toHaveCount(0, { timeout: 15_000 });
    // Response deletion is immediate on this site: no SweetAlert appears.
    await expect(cfg.confirmDialog).toHaveCount(0);
  });

  // TC13
  test("TC13 - Multiple responses are listed together", async ({ page }) => {
    const cfg = new ConfigureResponsePage(page);
    await cfg.goto(endpointId);
    await cfg.createResponse("200 - HTTP OK", '{"a": 1}');
    await cfg.createResponse("401 - HTTP UNAUTHORIZED", '{"b": 2}');
    await expect(cfg.responseRow("200")).toContainText("200", {
      timeout: 15_000,
    });
    await expect(cfg.responseRow("401")).toContainText("401", {
      timeout: 15_000,
    });
    await expect(cfg.rows).toHaveCount(2);
    await expect(cfg.paginationInfo).toContainText("Total 2 entries");
  });
});