/**
 * Hero CTA mobile stacking — responsive layout guard.
 *
 * Verifies that on narrow viewports the landing hero CTA buttons
 * (rendered by HeroCTAStack) stack vertically without:
 *   - horizontal overflow (no button wider than the viewport)
 *   - horizontal overlap (siblings must not share an x-range on the same row)
 *   - text truncation (scrollWidth must not exceed clientWidth)
 *
 * Runs at the common mobile widths we ship for. The hero lives at `/`.
 */
import { test, expect } from "@playwright/test";

const MOBILE_WIDTHS = [320, 360, 375, 390, 414] as const;

// Stable selector: every CTA in HeroCTAStack has aria-label and lives in
// the first <section> of the landing page. We scope to anchors that point
// to the known CTA routes to avoid pulling in nav/footer links.
const CTA_HREFS = [
  "/nominate",
  "/nominees",
  "/vote",
  "/earn-agc",
  "/volunteer",
];

for (const width of MOBILE_WIDTHS) {
  test.describe(`hero CTA stack @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test(`CTAs stack vertically without overflow/overlap/truncation`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.evaluate(() => (document as any).fonts?.ready);

      // Grab CTAs by href within the hero section.
      const hero = page.locator("section").first();
      await hero.waitFor({ state: "visible" });

      const ctaSelector = CTA_HREFS.map((h) => `a[href="${h}"]`).join(", ");
      const ctas = hero.locator(ctaSelector);
      const count = await ctas.count();
      expect(count, "expected hero CTAs to render").toBeGreaterThanOrEqual(5);

      type Box = { href: string; x: number; y: number; w: number; h: number; sw: number; cw: number };
      const boxes: Box[] = [];
      for (let i = 0; i < count; i++) {
        const el = ctas.nth(i);
        const data = await el.evaluate((node: HTMLAnchorElement) => {
          const r = node.getBoundingClientRect();
          // Measure the innermost text span for truncation, falling back to the anchor.
          const span = node.querySelector("span") as HTMLElement | null;
          const target = span ?? node;
          return {
            href: node.getAttribute("href") || "",
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height,
            sw: target.scrollWidth,
            cw: target.clientWidth,
          };
        });
        boxes.push(data);
      }

      // 1) No horizontal overflow: each CTA fits within the viewport.
      for (const b of boxes) {
        expect.soft(b.w, `${b.href} width must be <= viewport`).toBeLessThanOrEqual(width);
        expect.soft(b.x, `${b.href} must not start off-screen`).toBeGreaterThanOrEqual(0);
        expect.soft(b.x + b.w, `${b.href} must not extend past viewport`).toBeLessThanOrEqual(width + 0.5);
      }

      // 2) No truncation: visible text label is not clipped.
      for (const b of boxes) {
        expect.soft(
          b.sw,
          `${b.href} label is truncated (scrollWidth ${b.sw} > clientWidth ${b.cw})`
        ).toBeLessThanOrEqual(b.cw + 1);
      }

      // 3) Vertical stacking: sort by y, then assert each subsequent CTA
      //    starts strictly below the previous one (no side-by-side on mobile).
      const sorted = [...boxes].sort((a, b) => a.y - b.y);
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const cur = sorted[i];
        // Two buttons share a row if their vertical ranges overlap by >50% of the smaller height.
        const overlap = Math.min(prev.y + prev.h, cur.y + cur.h) - Math.max(prev.y, cur.y);
        const minH = Math.min(prev.h, cur.h);
        const sharesRow = overlap > minH * 0.5;
        expect.soft(
          sharesRow,
          `${prev.href} and ${cur.href} render on the same row at ${width}px — expected vertical stack`
        ).toBe(false);
      }
    });
  });
}
