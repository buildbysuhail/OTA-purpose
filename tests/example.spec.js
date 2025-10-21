// tests/example.spec.js
import { test, expect } from '@playwright/test';

test('homepage has title and links to intro page', async ({ page }) => {
  // Go to any URL (you can replace with your app URL)
  await page.goto('https://playwright.dev/');

  // Check page title
  await expect(page).toHaveTitle(/Playwright/);

  // Click "Get started" link
  await page.getByRole('link', { name: 'Get started' }).click();

  // Check new URL
  await expect(page).toHaveURL(/.*intro/);
});
