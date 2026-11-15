import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:4321', colorScheme: 'dark', reducedMotion: 'reduce', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'npm run preview -- --port 4321', url: 'http://127.0.0.1:4321', reuseExistingServer: true, env: { ASTRO_TELEMETRY_DISABLED: '1' } },
});
