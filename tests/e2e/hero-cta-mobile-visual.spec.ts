/**
 * Hero CTA mobile visual regression.
 *
 * Snapshots the landing hero CTA stack (HeroCTAStack) at the same mobile
 * widths covered by `hero-cta-mobile-stack.spec.ts` so styling regressions
 * (color, spacing, icon alignment, font weight, button heights) are caught
 * alongside the layout-stacking guard.
 *
 * Baselines live in `tests/e2e/hero-cta-mobile-visual.spec.ts-snapshots/`.
 * Regenerate after an intentional design change with:
 *   bun run test:e2e:update -- hero-cta-mobile-visual
 */
import { test, expect } from "@playwright/test";

const MOBILE_WIDTHS = [320, 360, 375, 390, 414] as const;

// Same href set used by the stacking spec — keeps the two in lockstep.
const CTA_HREFS = ["/nominate", "/nominees", "/vote", "/earn-agc", "/volunteer"];

// Tight tolerance — CTA stack is small and deterministic.
const MAX_DIFF_RATIO = 0.005;

for (const width of MOBILE_WIDTHS) {
  test.describe(`hero CTA visual @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test(`CTA stack matches baseline @ ${width}px`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.evaluate(() => (document as any).fonts?.ready);

      const hero = page.locator("section").first();
      await hero.waitFor({ state: "visible" });

      const ctaSelector = CTA_HREFS.map((h) => `a[href="${h}"]`).join(", ");
      const firstCta = hero.locator(ctaSelector).first();
      await firstCta.waitFor({ state: "visible" });

      // Hide time/locale-dependent or animated elements that can flicker.
      await page.addStyleTag({
        content: `
          [data-testid="countdown"], [data-countdown], .animate-pulse,
          .animate-spin, [data-live-indicator] { visibility: hidden !important; }
          * { caret-color: transparent !important; }
        `,
      });

      // Compute the union bounding box of all CTAs and snapshot that clip.
      const clip = await hero.evaluate((root, hrefs) => {
        const nodes = hrefs
          .map((h) => root.querySelector(`a[href="${h}"]`))
          .filter((n): n is HTMLAnchorElement => !!n);
        if (!nodes.length) return null;
        const rects = nodes.map((n) => n.getBoundingClientRect());
        const x = Math.max(0, Math.floor(Math.min(...rects.map((r) => r.left)) - 8));
        const y = Math.max(0, Math.floor(Math.min(...rects.map((r) => r.top)) - 8));
        const right = Math.ceil(Math.max(...rects.map((r) => r.right)) + 8);
        const bottom = Math.ceil(Math.max(...rects.map((r) => r.bottom)) + 8);
        return { x, y, width: right - x, height: bottom - y };
      }, CTA_HREFS);

      expect(clip, "expected hero CTAs to render").not.toBeNull();

      await expect(page).toHaveScreenshot(`hero-cta-${width}.png`, {
        clip: clip!,
        maxDiffPixelRatio: MAX_DIFF_RATIO,
        animations: "disabled",
        caret: "hide",
      });
    });
  });
}
