/**
 * Navbar visual *capture* — companion to navbar-visual.spec.ts.
 *
 * Always writes a fresh header screenshot for every tracked viewport width
 * into `test-results/navbar-captures/navbar-<width>.png`, regardless of
 * pass/fail. Skipped by default so it never gates CI; the GitHub Actions
 * workflow runs it explicitly with `PLAYWRIGHT_CAPTURE_NAVBAR=1` after a
 * `navbar-visual` failure so reviewers get a screenshot at every width
 * (not just the failing one).
 *
 * Run locally:
 *   PLAYWRIGHT_CAPTURE_NAVBAR=1 bun playwright test navbar-visual-capture
 */
import { test } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const WIDTHS = [360, 414, 768, 1024, 1199, 1200, 1280, 1440, 1920] as const;
const ENABLED = process.env.PLAYWRIGHT_CAPTURE_NAVBAR === "1";

const OUT_DIR = path.resolve("test-results/navbar-captures");

for (const width of WIDTHS) {
  test.describe(`navbar capture @ ${width}px`, () => {
    test.skip(!ENABLED, "Set PLAYWRIGHT_CAPTURE_NAVBAR=1 to enable.");
    test.use({ viewport: { width, height: 900 } });

    test(`capture header @ ${width}px`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      const header = page.locator("header").first();
      await header.waitFor({ state: "visible" });
      await page.evaluate(() => (document as any).fonts?.ready);
      await page.addStyleTag({
        content: `
          [data-testid="countdown"], [data-countdown], .animate-pulse,
          .animate-spin, [data-live-indicator] { visibility: hidden !important; }
          * { caret-color: transparent !important; }
        `,
      });

      fs.mkdirSync(OUT_DIR, { recursive: true });
      await header.screenshot({
        path: path.join(OUT_DIR, `navbar-${width}.png`),
        animations: "disabled",
        caret: "hide",
      });
    });
  });
}
