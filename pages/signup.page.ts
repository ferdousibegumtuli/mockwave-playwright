import { Page, Locator, expect } from "@playwright/test";

/**
 * Validation on the sign-up form is visual only: an invalid field gets a red
 * border, a valid field keeps the default border. These colours are the app's
 * stable signals and are kept here so a single change only affects one place.
 */
export const BORDER_INVALID = "rgb(231, 81, 90)";
export const BORDER_NORMAL = "rgb(224, 230, 237)";

export class SignupPage {
  readonly page: Page;

  readonly name: Locator;
  readonly username: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;

  readonly signUpButton: Locator;
  readonly continueWithGoogleButton: Locator;
  readonly continueWithGithubButton: Locator;
  readonly signInLink: Locator;
  readonly resendVerificationLink: Locator;

  readonly heading: Locator;
  readonly subtitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.name = page.locator("#fullName");
    this.username = page.locator("#username");
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.confirmPassword = page.locator("#confirmPassword");

    this.signUpButton = page.getByRole("button", { name: "SIGN UP" });
    this.continueWithGoogleButton = page.getByRole("button", {
      name: /continue with google/i,
    });
    this.continueWithGithubButton = page.getByRole("button", {
      name: /continue with github/i,
    });
    this.signInLink = page.getByRole("link", { name: "SIGN IN" });
    this.resendVerificationLink = page.getByRole("link", {
      name: "CLICK HERE",
    });

    this.heading = page.getByRole("heading", { name: "SIGN UP" });
    this.subtitle = page.getByText(
      "Enter your email and password to register",
    );
  }

  async goto() {
    await this.page.goto("https://admin.mockwave.io/sign-up");
  }

  async fillName(name: string) {
    await this.name.fill(name);
  }

  async fillUsername(username: string) {
    await this.username.fill(username);
  }

  async fillEmail(email: string) {
    await this.email.fill(email);
  }

  async fillPassword(password: string) {
    await this.password.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPassword.fill(password);
  }

  async signUp() {
    await this.signUpButton.click();
  }

  async fillValidForm() {
    await this.fillName("Test User");
    await this.fillUsername("tulitestuser");
    await this.fillEmail("test.user@example.com");
    await this.fillPassword("Str0ng@Pass123");
    await this.fillConfirmPassword("Str0ng@Pass123");
  }

  /** Assert a field is showing the invalid (red) border. */
  async expectFieldError(field: Locator) {
    await field.blur();
    await this.page.waitForTimeout(150);
    await expect(field).toHaveCSS("border-color", BORDER_INVALID);
  }

  /** Assert a field is showing the normal (valid) border. */
  async expectFieldValid(field: Locator) {
    await field.blur();
    await this.page.waitForTimeout(150);
    await expect(field).toHaveCSS("border-color", BORDER_NORMAL);
  }
}