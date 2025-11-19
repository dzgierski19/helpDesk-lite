import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'php artisan serve --host 127.0.0.1 --port 8000',
      url: 'http://127.0.0.1:8000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      cwd: '../backend',
    },
    {
      command: 'npm run start',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
