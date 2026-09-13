import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly signInButton: Locator;
  readonly usernameValidation: Locator;
  readonly usernameRequiredValidation: Locator;
  readonly passwordValidation: Locator;
  readonly invalidCredentialsError: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.username = page.getByRole("textbox", { name: "User Name" });
    this.password = page.getByRole("textbox", { name: "Password" });
    this.signInButton = page.getByRole("button", { name: "SIGN IN" });
    this.usernameValidation = page.getByText(
      "Username must be at least 5 characters",
      { exact: true },
    );
    this.usernameRequiredValidation = page.getByText("Username is required", {
      exact: true,
    });
    this.passwordValidation = page.getByText("Password is required", {
      exact: true,
    });
    this.invalidCredentialsError = page.getByText(
      "Invalid username or password. Please try again.",
    );
    this.forgotPasswordLink = page.getByRole("link", { name: "Click here" });
  }

  async goto() {
    await this.page.goto("https://admin.mockwave.io/sign-in");
  }

  async fillUsername(username: string) {
    await this.username.fill(username);
  }

  async fillPassword(password: string) {
    await this.password.fill(password);
  }

  async signIn() {
    await this.signInButton.click();
  }
}
