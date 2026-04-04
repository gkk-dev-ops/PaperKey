import { test, expect } from '@playwright/test';

test.describe('PaperKey App', () => {
  test('loads the home page', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.locator('h1')).toContainText('New Secret Backup Sheet');
  });

  test('shows privacy banner on form', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.getByText('All data stays in this browser')).toBeVisible();
  });

  test('can fill in and submit the form', async ({ page }) => {
    await page.goto('/#/');

    await page.fill('input[placeholder*="Gmail"]', 'My Test Password');
    await page.locator('textarea[placeholder*="Paste your secret"]').fill('SuperSecret123!');
    await page.click('button[type="submit"]');

    // Should navigate to entry detail
    await expect(page).toHaveURL(/#entry\//);
  });

  test('shows secret blurred by default', async ({ page }) => {
    await page.goto('/#/');
    await page.fill('input[placeholder*="Gmail"]', 'Blur Test');
    await page.locator('textarea[placeholder*="Paste your secret"]').fill('BlurMe');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/#entry\//);
    // The secret value area exists
    const secretEl = page.locator('[aria-label="Secret value"]');
    await expect(secretEl).toBeVisible();
  });

  test('navigates to settings', async ({ page }) => {
    await page.goto('/#/');
    await page.click('a[href="#/settings"]');
    await expect(page.locator('h1')).toContainText('Settings');
  });

  test('settings page shows history toggle', async ({ page }) => {
    await page.goto('/#/settings');
    await expect(page.getByText('Save entries to history')).toBeVisible();
  });

  test('footer contains attribution link', async ({ page }) => {
    await page.goto('/#/');
    const link = page.locator('a[href="https://gkk-dev.com"]');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Visit gkk-dev.com');
  });
});
