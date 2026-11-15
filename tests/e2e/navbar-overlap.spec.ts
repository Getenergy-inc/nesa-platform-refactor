/** Current Get Involved menus: merchandise is an enquiry, never a shop. */
import { test, expect } from "@playwright/test";

for (const width of [360, 820, 1280]) {
  test.describe(`Get Involved at ${width}px`, () => {
    test.use({ viewport: { width, height: 1800 } });

    test("menu fits and opens the merchandise enquiry", async ({ page }) => {
      await page.goto("/");
      const header = page.locator("header").first();
      await expect(header).toBeVisible();
      let merchandise;
      if (width < 1200) {
        await header.getByRole("button", { name: "Open navigation", exact: true }).click();
        const navigation = page.getByRole("navigation", { name: "Mobile primary", exact: true });
        await navigation.getByRole("button", { name: "Get Involved", exact: true }).click();
        merchandise = navigation.getByRole("link", { name: "Buy Merchandise", exact: true });
      } else {
        await header.getByRole("menuitem", { name: "Get Involved", exact: true }).click();
        merchandise = page.getByRole("menuitem", { name: "Buy Merchandise", exact: true });
      }
      await expect(merchandise).toBeVisible();
      await expect(merchandise).toHaveAttribute("href", "/contact?subject=merchandise");
      const box = await merchandise.boundingBox();
      if (!box) throw new Error("Merchandise link has no visible bounds");
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(1800);
      await merchandise.click();
      await expect(page).toHaveURL(/\/contact\?subject=merchandise$/);
      await expect(page.getByRole("textbox", { name: "Subject", exact: true })).toHaveValue("Merchandise");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    });

    test("footer merchandise link uses the same enquiry destination", async ({ page }) => {
      await page.goto("/contact?subject=merchandise");
      const footer = page.getByRole("contentinfo");
      if (width < 768) await footer.locator("summary").filter({ hasText: "Get Involved" }).click();
      await expect(footer.getByRole("link", { name: "Buy Merchandise", exact: true }).filter({ visible: true })).toHaveAttribute("href", "/contact?subject=merchandise");
    });
  });
}
