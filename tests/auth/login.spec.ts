import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://mockwave.io/');
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill('Tuli');
  await page.getByRole('textbox', { name: 'Enter Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign in' }).click();
   await expect(
    page.getByText('Username must be at least 5 characters')
  ).toBeVisible();
});