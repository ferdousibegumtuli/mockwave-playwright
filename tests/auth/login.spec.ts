/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";

const validUsername = process.env.MOCKWAVE_USERNAME;
const validPassword = process.env.MOCKWAVE_PASSWORD;
const expectedSuccessUrl = process.env.MOCKWAVE_SUCCESS_URL;

// TC01
test("TC01 - Login page opens successfully", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await expect(loginPage.username).toBeVisible();
  await expect(loginPage.password).toBeVisible();
  await expect(loginPage.signInButton).toBeVisible();
});

// TC02
test("TC02 - Username should accept valid username", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("tuli123");

  await expect(loginPage.username).toHaveValue("tuli123");
});

// TC03
test("TC03 - Username with 1 character", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("t");

  await expect(loginPage.usernameValidation).toBeVisible();
});

// TC04
test("TC04 - Username with 4 characters", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("tuli");

  await expect(loginPage.usernameValidation).toBeVisible();
});

// TC05
test("TC05 - Username with exactly 5 characters", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("tulis");

  await expect(loginPage.username).toHaveValue("tulis");
});

// TC06
test("TC06 - Username greater than 5 characters", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("tulibegum");

  await expect(loginPage.username).toHaveValue("tulibegum");
});

// TC07
test("TC07 - Empty username validation", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("");
  await loginPage.username.blur();

  await expect(loginPage.username).toBeEmpty();
});

// TC08
test("TC08 - Username with spaces", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("tuli test");

  await expect(loginPage.username).toHaveValue("tuli test");
});

// TC09
test("TC09 - Username with leading spaces", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername(" tuli");

  await expect(loginPage.username).toHaveValue(" tuli");
});

// TC10
test("TC10 - Username with trailing spaces", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("tuli ");

  await expect(loginPage.username).toHaveValue("tuli ");
});

// TC11
test("TC11 - Username with special characters", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("tuli@");

  await expect(loginPage.username).toHaveValue("tuli@");
});

// TC12
test("TC12 - Very long username", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  const longUsername = "t".repeat(100);

  await loginPage.fillUsername(longUsername);

  await expect(loginPage.username).toHaveValue(longUsername);
});

// TC13
test("TC13 - Password field should be visible", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await expect(loginPage.password).toBeVisible();
});

// TC14
test("TC14 - Password should accept a value", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillPassword("password123");

  await expect(loginPage.password).toHaveValue("password123");
});

// TC15
test("TC15 - Password field should be masked", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillPassword("password123");

  await expect(loginPage.password).toHaveAttribute("type", "password");
});

// TC16
test("TC16 - Empty password should show validation", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillPassword("");
  await loginPage.signIn();

  await expect(loginPage.passwordValidation).toBeVisible();
});

// TC17
test("TC17 - Password should accept one character", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillPassword("A");

  await expect(loginPage.password).toHaveValue("A");
});

// TC18
test("TC18 - Password should accept minimum valid length", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillPassword("12345");

  await expect(loginPage.password).toHaveValue("12345");
});

// TC19
test("TC19 - Invalid password should show error", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("validusername");
  await loginPage.fillPassword("WrongPassword123");

  await loginPage.signIn();

  await expect(loginPage.invalidCredentialsError).toBeVisible();
});

// TC20
test("TC20 - Valid username and invalid password should show error", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("Tuli123");
  await loginPage.fillPassword("WrongPassword123");

  await loginPage.signIn();

  await expect(loginPage.invalidCredentialsError).toBeVisible();
});

// TC21
test("TC21 - Empty credentials should show required validation", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.signIn();

  await expect(loginPage.usernameRequiredValidation).toBeVisible();
  await expect(loginPage.passwordValidation).toBeVisible();
  await expect(loginPage.invalidCredentialsError).toBeHidden();
});

// TC22
test("TC22 - Invalid username and password should show error", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername("unknownuser");
  await loginPage.fillPassword("WrongPassword123");
  await loginPage.signIn();

  await expect(loginPage.invalidCredentialsError).toBeVisible();
});

// TC23
test("TC23 - Forgot password link points to password recovery", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await expect(loginPage.forgotPasswordLink).toBeVisible();
  await expect(loginPage.forgotPasswordLink).toHaveAttribute(
    "href",
    "/forget-password",
  );
});

// TC24
test("TC24 - Valid login redirects to the expected page", async ({ page }) => {
  test.skip(
    !validUsername || !validPassword || !expectedSuccessUrl,
    "Set MOCKWAVE_USERNAME, MOCKWAVE_PASSWORD, and MOCKWAVE_SUCCESS_URL to run the successful-login test",
  );

  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.fillUsername(validUsername!);
  await loginPage.fillPassword(validPassword!);
  await loginPage.signIn();

  await expect(page).toHaveURL(expectedSuccessUrl!);
});
