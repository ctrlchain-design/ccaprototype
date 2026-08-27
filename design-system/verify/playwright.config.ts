/**
 * Playwright config for the design-system export verification suite.
 *
 * The specs measure the emitted bundle over `file://`, so there is no web
 * server, no platform build and no authentication involved — the whole suite
 * runs against `tools/design-system-export/dist`.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: 0,
  reporter: process.env['CI'] ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    // file:// URLs are loaded through setContent, so no baseURL is needed.
    trace: 'retain-on-failure',
  },
});
