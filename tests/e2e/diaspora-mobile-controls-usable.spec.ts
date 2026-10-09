import { test, expect, type Page } from "@playwright/test";

/**
 * Diaspora Education Impact — mobile usability of region tabs + media filter bar.
 *
 * Verifies on common mobile widths that:
 *   1. The region tabs row and the media filter bar are both visible and
 *      do not horizontally overflow the viewport.
 *   2. The two control rows do not vertically overlap each other.
 *   3. Tapping a region tab and a media filter both produce a UI response
 *      (active styling) on mobile — i.e. the controls remain tappable.
 *
 * No production code is changed by this test; it only asserts layout
 * behaviour of existing components on small screens.
 */

const PAGE = "/categories/diaspora-education-impact";
const MOBILE_WIDTHS = [320, 360, 375, 390, 414] as const;

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

for (const width of MOBILE_WIDTHS) {
  test.describe(`Diaspora mobile controls @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test("region tabs + media filter bar are usable without overlap", async ({
      page,
    }) => {
      await page.goto(PAGE);

      // Anchor on the nominee section heading.
      await expect(
        page.getByRole("heading", { name: /2026 nominees/i }),
      ).toBeVisible();

      const tablist = page.getByRole("tablist").first();
      const noMediaBtn = page.getByRole("button", { name: /No Media Yet/i });
      const photoBtn = page.getByRole("button", { name: /Has Photo/i });

      await expect(tablist).toBeVisible();
      await expect(noMediaBtn).toBeVisible();
      await expect(photoBtn).toBeVisible();

      // 1. Neither control row should overflow the viewport horizontally.
      //    A tablist may internally scroll horizontally, but its rendered
      //    box must stay within the viewport.
      const tablistBox = await boxOf(page, tablist);
      const noMediaBox = await boxOf(page, noMediaBtn);

      expect(tablistBox.x).toBeGreaterThanOrEqual(0);
      expect(tablistBox.x + tablistBox.width).toBeLessThanOrEqual(width + 1);

      expect(noMediaBox.x).toBeGreaterThanOrEqual(0);
      expect(noMediaBox.x + noMediaBox.width).toBeLessThanOrEqual(width + 1);

      // 2. Tabs row and filter bar must not vertically overlap. The filter
      //    bar sits below the tabs in the DOM; assert strict vertical order
      //    with no overlapping pixels.
      expect(noMediaBox.y).toBeGreaterThanOrEqual(
        tablistBox.y + tablistBox.height - 1,
      );

      // 3. Controls remain tappable on mobile.
      //    Tap a region tab — Radix sets data-state="active".
      const westTab = page.getByRole("tab", { name: "West Africa" });
      await westTab.click();
      await expect(westTab).toHaveAttribute("data-state", "active");

      // Tap a media filter — active variant applies `bg-gold` utility.
      await noMediaBtn.click();
      await expect(noMediaBtn).toHaveClass(/bg-gold/);

      // After interaction the rows still must not overlap.
      const tablistBoxAfter = await boxOf(page, tablist);
      const noMediaBoxAfter = await boxOf(page, noMediaBtn);
      expect(noMediaBoxAfter.y).toBeGreaterThanOrEqual(
        tablistBoxAfter.y + tablistBoxAfter.height - 1,
      );

      // 4. Page itself should not introduce horizontal scrolling because of
      //    these controls.
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
