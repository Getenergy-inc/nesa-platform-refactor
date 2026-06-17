import { test, expect, type Page } from "@playwright/test";

/**
 * Diaspora Education Impact — landscape-orientation usability of region tabs
 * and media filter bar.
 *
 * Mirrors the portrait/mobile usability test but flips the viewport so width
 * exceeds height. Verifies that on common landscape sizes (phone landscape,
 * small tablet landscape):
 *   1. The region tablist and media filter buttons render visibly and do not
 *      horizontally overflow the viewport.
 *   2. The two control rows do not vertically overlap each other.
 *   3. Controls remain tappable (region tab activates, media filter pill
 *      applies the active `bg-gold` utility).
 *   4. The document does not introduce horizontal page scrolling.
 *
 * No production code changes; this only asserts existing layout behaviour
 * under landscape orientation.
 */

const PAGE = "/categories/diaspora-education-impact";

// width x height pairs — width > height to enforce landscape.
const LANDSCAPE_VIEWPORTS = [
  { width: 568, height: 320 }, // small phone landscape
  { width: 667, height: 375 }, // iPhone SE landscape
  { width: 812, height: 375 }, // iPhone X landscape
  { width: 844, height: 390 }, // iPhone 12/13 landscape
  { width: 896, height: 414 }, // iPhone XR/11 landscape
  { width: 1024, height: 600 }, // small tablet landscape
] as const;

type Box = { x: number; y: number; width: number; height: number };

async function boxOf(
  page: Page,
  locator: ReturnType<Page["locator"]>,
): Promise<Box> {
  const handle = await locator.elementHandle();
  if (!handle) throw new Error("element not found for bounding box");
  const box = await handle.boundingBox();
  if (!box) throw new Error("no bounding box for element");
  return box;
}

for (const vp of LANDSCAPE_VIEWPORTS) {
  test.describe(`Diaspora landscape controls @ ${vp.width}x${vp.height}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("region tabs + media filter bar stay usable in landscape", async ({
      page,
    }) => {
      await page.goto(PAGE);

      await expect(
        page.getByRole("heading", { name: /2026 nominees/i }),
      ).toBeVisible();

      const tablist = page.getByRole("tablist").first();
      const noMediaBtn = page.getByRole("button", { name: /No Media Yet/i });
      const photoBtn = page.getByRole("button", { name: /Has Photo/i });

      // Scroll the controls into view — in landscape the viewport is short
      // and the section may sit below the fold.
      await tablist.scrollIntoViewIfNeeded();
      await expect(tablist).toBeVisible();
      await expect(noMediaBtn).toBeVisible();
      await expect(photoBtn).toBeVisible();

      // 1. No horizontal overflow of the control rows themselves.
      const tablistBox = await boxOf(page, tablist);
      const noMediaBox = await boxOf(page, noMediaBtn);
      const photoBox = await boxOf(page, photoBtn);

      for (const box of [tablistBox, noMediaBox, photoBox]) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);
      }

      // 2. Tabs row sits above (or strictly outside of) the filter bar.
      expect(noMediaBox.y).toBeGreaterThanOrEqual(
        tablistBox.y + tablistBox.height - 1,
      );

      // 3. Controls remain interactive in landscape.
      const westTab = page.getByRole("tab", { name: "West Africa" });
      await westTab.scrollIntoViewIfNeeded();
      await westTab.click();
      await expect(westTab).toHaveAttribute("data-state", "active");

      await noMediaBtn.scrollIntoViewIfNeeded();
      await noMediaBtn.click();
      await expect(noMediaBtn).toHaveClass(/bg-gold/);

      // After interaction the rows still must not overlap.
      const tablistBoxAfter = await boxOf(page, tablist);
      const noMediaBoxAfter = await boxOf(page, noMediaBtn);
      expect(noMediaBoxAfter.y).toBeGreaterThanOrEqual(
        tablistBoxAfter.y + tablistBoxAfter.height - 1,
      );

      // 4. The page itself does not introduce horizontal scrolling.
      const docOverflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(docOverflow.scrollWidth).toBeLessThanOrEqual(
        docOverflow.clientWidth + 1,
      );
    });
  });
}
