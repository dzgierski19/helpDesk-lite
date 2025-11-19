import { test, expect } from '@playwright/test';

test('should allow a user to log in, view the ticket list, and see ticket details', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('useMockData', 'true');
  });
  await page.setViewportSize({ width: 600, height: 900 });

  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole('button', { name: 'Agent' }).click();
  await expect(page).toHaveURL(/\/tickets$/);

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
  await expect(page.locator('mat-card-title.ticket-title')).toBeVisible();
});
