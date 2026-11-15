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
      await merchandise.scrollIntoViewIfNeeded();
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

test.describe("lean header", () => {
  test.use({ viewport: { width: 1280, height: 1800 } });
  test("has no utility bar and keeps Nominees out of the desktop menu", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Utility" })).toHaveCount(0);
    const primary = page.getByRole("navigation", { name: "Primary", exact: true });
    await expect(primary.getByText("Nominees", { exact: true })).toHaveCount(0);
  });
});

const IMPACT_LINKS = [
  { name: "Support a Special-Needs School", href: "/support-a-special-needs-school" },
  { name: "Afri-EduTourism", href: "/afri-edutourism" },
];

for (const width of [360, 1280]) {
  test.describe(`Impact menu at ${width}px`, () => {
    test.use({ viewport: { width, height: 1800 } });

    test("shows exactly two links and the Impact heading opens /impact", async ({ page }) => {
      await page.goto("/");
      const header = page.locator("header").first();
      let panel, heading;
      if (width < 1200) {
        await header.getByRole("button", { name: "Open navigation", exact: true }).click();
        const nav = page.getByRole("navigation", { name: "Mobile primary", exact: true });
        await nav.getByRole("button", { name: "Impact", exact: true }).click();
        panel = nav.getByRole("region", { name: "Impact", exact: true });
        heading = panel.getByRole("link", { name: "Impact", exact: true });
      } else {
        await header.getByRole("menuitem", { name: "Impact", exact: true }).click();
        panel = page.getByRole("menu").filter({ visible: true });
        heading = panel.getByRole("menuitem", { name: "Impact", exact: true });
      }
      const links = panel.getByRole(width < 1200 ? "link" : "menuitem").filter({ hasNotText: /^Impact$/ });
      await expect(links).toHaveCount(2);
      for (const [i, l] of IMPACT_LINKS.entries()) {
        await expect(links.nth(i)).toHaveText(l.name);
        await expect(links.nth(i)).toHaveAttribute("href", l.href);
      }
      await expect(panel.getByText(/overview|EduAid-Africa|Rebuild My School|Impact Stories/)).toHaveCount(0);
      await expect(heading).toHaveAttribute("href", "/impact");
      await heading.click();
      await expect(page).toHaveURL(/\/impact$/);
    });
  });
}
