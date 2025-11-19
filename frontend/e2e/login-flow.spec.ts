import { test, expect } from '@playwright/test';

test('should allow a user to log in, view the ticket list, and see ticket details', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('useMockData', 'true');
  });

  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole('button', { name: 'Agent' }).click();
  await expect(page).toHaveURL(/\/tickets$/);

  const ticketList = page.locator('.ticket-table, .mobile-view app-ticket-card');
  await expect(ticketList.first()).toBeVisible();

  const viewDetailsButton = page.locator('button:has-text("View Details")').first();
  if (await viewDetailsButton.count()) {
    await viewDetailsButton.click();
  } else {
    await page.getByRole('button', { name: /View ticket/i }).first().click();
  }

  await expect(page).toHaveURL(/\/tickets\/\d+$/);
  await expect(page.locator('mat-card-title.ticket-title')).toBeVisible();
});
