/**
 * Navbar visual regression — 9 widths around the 1200px breakpoint.
 *
 * Captures a screenshot of the fixed header on `/` at each width and diffs
 * against the committed baseline in
 * `tests/e2e/navbar-visual.spec.ts-snapshots/`.
 *
 * The global `maxDiffPixelRatio` from `playwright.config.ts` (0.02 = 2%)
 * is tightened here to 0.005 (0.5%) so even small layout regressions in
 * the header fail the build. Animations are disabled by the config.
 *
 * To (re)generate baselines after an intentional design change:
 *   bun run test:e2e:update -- navbar-visual
 */
import { test, expect } from "@playwright/test";

const WIDTHS = [360, 414, 768, 1024, 1199, 1200, 1280, 1440, 1920] as const;

// Tight tolerance — header is small, deterministic, and font-light.
const MAX_DIFF_RATIO = 0.005;

for (const width of WIDTHS) {
  test.describe(`navbar visual @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test(`header matches baseline @ ${width}px`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      const header = page.locator("header").first();
      await header.waitFor({ state: "visible" });

      // Ensure web fonts have settled before snapshotting.
      await page.evaluate(() => (document as any).fonts?.ready);

      // Stabilize: hide elements that are time/locale-dependent or animated.
      // - Countdown numbers, "live" badges, and any motion-driven children
      //   inside the governance bar can shift between runs.
      await page.addStyleTag({
        content: `
          [data-testid="countdown"], [data-countdown], .animate-pulse,
          .animate-spin, [data-live-indicator] { visibility: hidden !important; }
          * { caret-color: transparent !important; }
        `,
      });

      await expect(header).toHaveScreenshot(`navbar-${width}.png`, {
        maxDiffPixelRatio: MAX_DIFF_RATIO,
        animations: "disabled",
        caret: "hide",
      });
    });
  });
}
