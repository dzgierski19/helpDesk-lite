import { test, expect } from '@playwright/test';

test('should allow a user to log in, view the ticket list, and see ticket details', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 900 });

  await page.goto('/login');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL(/\/tickets$/);

  const mobileViewButton = page.getByRole('button', { name: 'View Details' }).first();
  const desktopViewButton = page.locator('button[aria-label="View ticket"]').first();

  const layout = await Promise.race([
    desktopViewButton.waitFor({ state: 'visible' }).then(() => 'desktop'),
    mobileViewButton.waitFor({ state: 'visible' }).then(() => 'mobile'),
  ]);

  if (layout === 'desktop') {
    await desktopViewButton.click();
  } else {
    await mobileViewButton.click();
  }

  await expect(page).toHaveURL(/\/tickets\/\d+$/);
  await expect(page.locator('app-ticket-card mat-card-title')).toBeVisible();
});
