/**
 * SiteHeader responsive layout guard.
 *
 * At 1280 / 1360 / 1440 / 1600 CSS px the header must:
 *   1. Not horizontally overflow the viewport.
 *   2. Keep the brand, primary nav (>=1360), Nominate CTA and account cluster
 *      on a single row (identical top offsets, no vertical wrapping).
 *   3. Never overlap the Nominate CTA with the nav or the brand block.
 *   4. Render the Nominate CTA on a single line (no text wrapping).
 */
import { test, expect, type Page } from "@playwright/test";

const WIDTHS = [1280, 1360, 1440, 1600] as const;

type Box = { x: number; y: number; width: number; height: number };

function overlapsX(a: Box, b: Box, tol = 1): boolean {
  return a.x + a.width - tol > b.x && b.x + b.width - tol > a.x;
}

async function box(page: Page, selector: string): Promise<Box | null> {
  const loc = page.locator(selector).first();
  if (!(await loc.isVisible().catch(() => false))) return null;
  return await loc.boundingBox();
}

for (const width of WIDTHS) {
  test.describe(`SiteHeader @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.locator("header").first().waitFor({ state: "visible" });
    });

    test("no horizontal overflow", async ({ page }) => {
      const header = page.locator("header").first();
      const b = await header.boundingBox();
      expect(b).not.toBeNull();
      expect(b!.x).toBeGreaterThanOrEqual(-1);
      expect(b!.x + b!.width).toBeLessThanOrEqual(width + 1);

      const docOverflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(docOverflow).toBeLessThanOrEqual(1);
    });

    test("Nominate CTA is visible, single-line, and does not overlap nav or brand", async ({
      page,
    }) => {
      const header = page.locator("header").first();
      const nominate = header
        .getByRole("link", { name: /nominate/i })
        .first();
      await expect(nominate).toBeVisible();

      // Single-line: rendered height should be close to the line-height of
      // the button (< 56px covers Tailwind default button + padding).
      const nomBox = await nominate.boundingBox();
      expect(nomBox).not.toBeNull();
      expect(nomBox!.height).toBeLessThan(56);

      // The text node itself should not wrap: clientHeight ~= lineHeight.
      const wraps = await nominate.evaluate((el) => {
        const cs = getComputedStyle(el);
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
        return el.getBoundingClientRect().height > lh * 1.8;
      });
      expect(wraps, "Nominate CTA text should not wrap").toBe(false);

      // Desktop primary nav appears at >= 1360.
      if (width >= 1360) {
        const nav = await box(page, 'nav[aria-label="Primary"]');
        expect(nav, "primary nav should be visible >= 1360px").not.toBeNull();
        expect(
          overlapsX(nav!, nomBox!),
          `primary nav overlaps Nominate at ${width}px`,
        ).toBe(false);
      }

      // Brand link should never horizontally overlap Nominate.
      const brand = await box(page, 'a[aria-label="NESA-Africa home"]');
      expect(brand).not.toBeNull();
      expect(
        overlapsX(brand!, nomBox!),
        `brand overlaps Nominate at ${width}px`,
      ).toBe(false);
    });

    test("header content sits on a single row", async ({ page }) => {
      const header = page.locator("header").first();
      const nominate = header.getByRole("link", { name: /nominate/i }).first();
      const brand = header.locator('a[aria-label="NESA-Africa home"]').first();

      const nb = await nominate.boundingBox();
      const bb = await brand.boundingBox();
      expect(nb && bb).toBeTruthy();

      // Centers within ~12px vertically → same row.
      const nomCenter = nb!.y + nb!.height / 2;
      const brandCenter = bb!.y + bb!.height / 2;
      expect(
        Math.abs(nomCenter - brandCenter),
        `brand and Nominate not on same row at ${width}px`,
      ).toBeLessThanOrEqual(12);
    });
  });
}
