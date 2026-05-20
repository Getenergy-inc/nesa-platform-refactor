import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for visual / screenshot regression of nominee surfaces.
 *
 * Run locally:
 *   bun playwright install chromium
 *   bun run test:e2e            # run tests
 *   bun run test:e2e:update     # update baseline snapshots
 *
 * Spins up `vite preview` against a production build so screenshots are
 * stable (no HMR overlays, no dev banners).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  expect: {
    toHaveScreenshot: {
      // Tolerate ~0.2% pixel diff for font/aa variation across machines.
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
      caret: "hide",
    },
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // Freeze color-scheme + reduce motion for deterministic captures.
    colorScheme: "dark",
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "bun run build && bun run preview -- --port 4173 --strictPort",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
      },
});
