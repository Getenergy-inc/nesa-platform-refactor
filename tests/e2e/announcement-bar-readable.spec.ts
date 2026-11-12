/**
 * Announcement bar readability guard.
 *
 * The top announcement bar carries the nomination window and gala date.
 * On narrow viewports it must show the FULL text: no clipping
 * (scrollWidth === clientWidth) and no ellipsis (text-overflow). The bar
 * is allowed to grow taller and wrap onto several lines.
 *
 * Runs at the common mobile widths we ship for, plus desktop.
 */
import { test, expect } from "@playwright/test";

const WIDTHS = [320, 360, 375, 390, 414, 1440] as const;

const EXPECTED =
  "Public Nominations Open 9 November 2026 – 31 March 2027 · Online Awards Gala: 28 December 2026. Learn More";

for (const width of WIDTHS) {
  test.describe(`announcement bar @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test("shows the full text without clipping or an ellipsis", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.evaluate(() => (document as any).fonts?.ready);

      const bar = page.locator('[aria-label="Site announcement"]');
      await expect(bar).toBeVisible();

      const state = await bar.locator("span").first().evaluate((span) => {
        const s = getComputedStyle(span);
        return {
          text: (span.textContent || "").replace(/\s+/g, " ").trim(),
          ellipsis: s.textOverflow === "ellipsis",
          clipped: span.scrollWidth - span.clientWidth,
        };
      });

      expect(state.text, "banner must carry the full approved copy").toBe(EXPECTED);
      expect(state.ellipsis, "banner must not use an ellipsis").toBe(false);
      expect(state.clipped, "banner text must not be clipped").toBeLessThanOrEqual(0);
    });
  });
}
