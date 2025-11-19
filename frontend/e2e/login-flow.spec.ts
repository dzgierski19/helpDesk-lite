import { test, expect } from '@playwright/test';

test('should allow a user to log in, view the ticket list, and see ticket details', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 900 });

  await page.goto('/login');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL(/\/tickets$/);

  const mobileCards = page.locator('.mobile-view app-ticket-card');
  const desktopRows = page.locator('.ticket-table tr[role="row"]');

  if ((await mobileCards.count()) > 0) {
    await expect(mobileCards.first()).toBeVisible();
    await page.getByRole('button', { name: 'View Details' }).first().click();
  } else {
    await expect(desktopRows.nth(1)).toBeVisible();
    await page.locator('button[aria-label="View ticket"]').first().click();
  }

  await expect(page).toHaveURL(/\/tickets\/\d+$/);
  await expect(page.locator('app-ticket-card mat-card-title')).toBeVisible();
});
