/// <reference types="node" />

import { test, expect } from "@playwright/test";
import { SignupPage } from "../../pages/signup.page";

/**
 * Sign-up page test suite.
 *
 * Notes on stability:
 * - Validation on this form is visual: an invalid field gets a red border, a
 *   valid field keeps the default border. See `pages/signup.page.ts`.
 * - No test ever submits a fully valid form, so no real account is created.
 */

test.describe("Sign-up — Page structure", () => {
  // TC01
  test("TC01 - Sign-up page opens at the correct URL", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(page).toHaveURL(/\/sign-up$/);
  });

  // TC02
  test("TC02 - Page title mentions Sign Up", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(page).toHaveTitle(/Sign Up/i);
  });

  // TC03
  test("TC03 - SIGN UP heading is visible", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.heading).toBeVisible();
  });

  // TC04
  test("TC04 - Registration subtitle is visible", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.subtitle).toBeVisible();
  });

  // TC05
  test("TC05 - All five input fields are visible", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.name).toBeVisible();
    await expect(signupPage.username).toBeVisible();
    await expect(signupPage.email).toBeVisible();
    await expect(signupPage.password).toBeVisible();
    await expect(signupPage.confirmPassword).toBeVisible();
  });

  // TC06
  test("TC06 - SIGN UP button is visible and enabled", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.signUpButton).toBeVisible();
    await expect(signupPage.signUpButton).toBeEnabled();
  });

  // TC07
  test("TC07 - Continue with Google button is visible", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.continueWithGoogleButton).toBeVisible();
  });

  // TC08
  test("TC08 - Continue with Github button is visible", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.continueWithGithubButton).toBeVisible();
  });

  // TC09
  test("TC09 - OR divider is visible", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(page.getByText(/^or$/i)).toBeVisible();
  });
});

test.describe("Sign-up — Name field", () => {
  // TC10
  test("TC10 - Name field has the correct placeholder", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.name).toHaveAttribute("placeholder", "Enter Full Name");
  });

  // TC11
  test("TC11 - Name field accepts a value", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillName("Test User");
    await expect(signupPage.name).toHaveValue("Test User");
  });

  // TC12
  test("TC12 - Empty Name shows the error border on submit", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillName("");
    await signupPage.signUp();
    await expect(signupPage.name).toHaveCSS(
      "border-color",
      "rgb(231, 81, 90)",
    );
  });

  // TC13
  test("TC13 - Filled Name passes validation", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillName("Test User");
    await signupPage.expectFieldValid(signupPage.name);
  });
});

test.describe("Sign-up — Username field", () => {
  // TC14
  test("TC14 - Username field has the correct placeholder", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.username).toHaveAttribute("placeholder", "Enter User Name");
  });

  // TC15
  test("TC15 - Username field accepts a value", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillUsername("tulitest");
    await expect(signupPage.username).toHaveValue("tulitest");
  });

  // TC16
  test("TC16 - Username shorter than 5 characters shows the error border", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillUsername("abcd");
    await signupPage.expectFieldError(signupPage.username);
  });

  // TC17
  test("TC17 - Username with exactly 5 characters passes validation", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillUsername("abcde");
    await signupPage.expectFieldValid(signupPage.username);
  });

  // TC18
  test("TC18 - Username longer than 5 characters is accepted", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillUsername("tulibegum");
    await signupPage.expectFieldValid(signupPage.username);
  });

  // TC19
  test("TC19 - Empty username shows the error border on submit", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillName("Test User");
    await signupPage.fillUsername("");
    await signupPage.signUp();
    await expect(signupPage.username).toHaveCSS(
      "border-color",
      "rgb(231, 81, 90)",
    );
  });

  // TC20
  test("TC20 - Username error clears after a valid value is entered", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillUsername("abcd");
    await signupPage.expectFieldError(signupPage.username);
    await signupPage.fillUsername("abcdef");
    await signupPage.expectFieldValid(signupPage.username);
  });
});

test.describe("Sign-up — Email field", () => {
  // TC21
  test("TC21 - Email field is an email input with the correct placeholder", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.email).toHaveAttribute("type", "email");
    await expect(signupPage.email).toHaveAttribute("placeholder", "Enter Email");
  });

  // TC22
  test("TC22 - Email field accepts a valid email", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillEmail("test@example.com");
    await expect(signupPage.email).toHaveValue("test@example.com");
  });

  // TC23
  test("TC23 - Email without a domain shows the error border", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillEmail("test.com");
    await signupPage.expectFieldError(signupPage.email);
  });

  // TC24
  test("TC24 - Email without an @ symbol shows the error border", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillEmail("not-an-email");
    await signupPage.expectFieldError(signupPage.email);
  });

  // TC25
  test("TC25 - A complex but valid email passes validation", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillEmail("user.name+tag@sub.example.co");
    await signupPage.expectFieldValid(signupPage.email);
  });

  // TC26
  test("TC26 - Empty email shows the error border on submit", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillName("Test User");
    await signupPage.fillUsername("tulitest");
    await signupPage.fillEmail("");
    await signupPage.signUp();
    await expect(signupPage.email).toHaveCSS(
      "border-color",
      "rgb(231, 81, 90)",
    );
  });
});

test.describe("Sign-up — Password field", () => {
  // TC27
  test("TC27 - Password field is masked and has the correct placeholder", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.password).toHaveAttribute("type", "password");
    await expect(signupPage.password).toHaveAttribute("placeholder", "Enter Password");
  });

  // TC28
  test("TC28 - Password field accepts a value", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillPassword("secret123");
    await expect(signupPage.password).toHaveValue("secret123");
  });

  // TC29
  test("TC29 - Password shorter than 6 characters shows the error border", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillPassword("12345");
    await signupPage.expectFieldError(signupPage.password);
  });

  // TC30
  test("TC30 - Password with exactly 6 characters passes validation", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillPassword("123456");
    await signupPage.expectFieldValid(signupPage.password);
  });

  // TC31
  test("TC31 - Password with letters, numbers and symbols is accepted", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillPassword("Str0ng@Pass");
    await signupPage.expectFieldValid(signupPage.password);
  });

  // TC32
  test("TC32 - Empty password shows the error border on submit", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillName("Test User");
    await signupPage.fillUsername("tulitest");
    await signupPage.fillEmail("test@example.com");
    await signupPage.fillPassword("");
    await signupPage.signUp();
    await expect(signupPage.password).toHaveCSS(
      "border-color",
      "rgb(231, 81, 90)",
    );
  });
});

test.describe("Sign-up — Confirm Password field", () => {
  // TC33
  test("TC33 - Confirm Password field is masked with the correct placeholder", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.confirmPassword).toHaveAttribute("type", "password");
    await expect(signupPage.confirmPassword).toHaveAttribute(
      "placeholder",
      "Enter Confirm Password",
    );
  });

  // TC34
  test("TC34 - Confirm Password field accepts a value", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillConfirmPassword("secret123");
    await expect(signupPage.confirmPassword).toHaveValue("secret123");
  });

  // TC35
  test("TC35 - Mismatched Confirm Password shows the error border", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillPassword("123456");
    await signupPage.fillConfirmPassword("654321");
    await signupPage.expectFieldError(signupPage.confirmPassword);
  });

  // TC36
  test("TC36 - Matching Confirm Password passes validation", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillPassword("123456");
    await signupPage.fillConfirmPassword("123456");
    await signupPage.expectFieldValid(signupPage.confirmPassword);
  });

  // TC37
  test("TC37 - Empty Confirm Password with a filled password shows the error border on submit", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillPassword("123456");
    await signupPage.fillConfirmPassword("");
    await signupPage.signUp();
    await expect(signupPage.confirmPassword).toHaveCSS(
      "border-color",
      "rgb(231, 81, 90)",
    );
  });

  // TC38
  test("TC38 - Confirm Password error clears after it is corrected", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillPassword("123456");
    await signupPage.fillConfirmPassword("654321");
    await signupPage.expectFieldError(signupPage.confirmPassword);
    await signupPage.fillConfirmPassword("123456");
    await signupPage.expectFieldValid(signupPage.confirmPassword);
  });
});

test.describe("Sign-up — Form & navigation", () => {
  // TC39
  test("TC39 - Submitting an invalid form does not navigate away", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.fillName("Test User");
    await signupPage.fillUsername("abcd");
    await signupPage.fillEmail("bad-email");
    await signupPage.fillPassword("12345");
    await signupPage.fillConfirmPassword("11111");
    await signupPage.signUp();
    await expect(page).toHaveURL(/\/sign-up$/);
    await expect(signupPage.heading).toBeVisible();
  });

  // TC40
  test("TC40 - SIGN IN link points to the sign-in page", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.signInLink).toBeVisible();
    await expect(signupPage.signInLink).toHaveAttribute("href", "/sign-in");
  });

  // TC41
  test("TC41 - CLICK HERE link points to resend verification email", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(signupPage.resendVerificationLink).toBeVisible();
    await expect(signupPage.resendVerificationLink).toHaveAttribute(
      "href",
      "/resend-verification-email",
    );
  });

  // TC42
  test("TC42 - Clicking SIGN IN navigates to the sign-in page", async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.signInLink.click();
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});