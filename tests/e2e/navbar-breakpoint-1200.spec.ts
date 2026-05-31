/**
 * Navbar 1200px breakpoint + brand-area overlap regression.
 *
 * Verifies that `src/components/navigation/MainNav.tsx`:
 *
 *  1. Switches layouts cleanly at the 1200px threshold:
 *       - <1200px: desktop nav links are hidden, mobile hamburger is visible,
 *         and the brand motto ("The African Blue-Garnet Awards for Education")
 *         is hidden.
 *       - ≥1200px: desktop nav links + Nominate/Vote/Become a Sponsor CTAs
 *         are visible, hamburger is hidden, motto is visible.
 *  2. The brand link (logo + wordmark) never overlaps any other visible
 *     header element at any tested width.
 *  3. The header never horizontally overflows the viewport.
 */
import { test, expect, type Locator } from "@playwright/test";

type Box = { x: number; y: number; width: number; height: number };

const WIDTHS = [360, 414, 768, 1024, 1199, 1200, 1280, 1440, 1920] as const;

function overlaps(a: Box, b: Box, tol = 1): boolean {
  return (
    a.x + a.width  - tol > b.x &&
    b.x + b.width  - tol > a.x &&
    a.y + a.height - tol > b.y &&
    b.y + b.height - tol > a.y
  );
}

async function boxOf(loc: Locator): Promise<Box | null> {
  if (!(await loc.isVisible().catch(() => false))) return null;
  const b = await loc.boundingBox();
  return b && b.width > 0 && b.height > 0 ? b : null;
}

for (const width of WIDTHS) {
  test.describe(`navbar @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.locator("header").first().waitFor({ state: "visible" });
    });

    test("layout switches correctly at the 1200px threshold", async ({ page }) => {
      const header = page.locator("header").first();
      const isDesktop = width >= 1200;

      const desktopNav = header.getByRole("navigation", { name: /^primary$/i });
      const hamburger = header.getByRole("button", { name: /open navigation menu/i });
      const motto = header.getByText(/the african blue-garnet awards for education/i);

      if (isDesktop) {
        await expect(desktopNav).toBeVisible();
        await expect(hamburger).toHaveCount(0);
        await expect(motto).toBeVisible();

        // The three primary CTAs are inline.
        await expect(header.getByRole("link", { name: /nominate for nesa-africa 2026/i })).toBeVisible();
        await expect(header.getByRole("link", { name: /vote in nesa-africa 2026/i })).toBeVisible();
        await expect(header.getByRole("link", { name: /become a sponsor of nesa-africa 2026/i })).toBeVisible();
      } else {
        await expect(hamburger).toBeVisible();
        // Desktop primary nav landmark must not be visible/laid-out below 1200px.
        expect(await boxOf(desktopNav)).toBeNull();
        // Motto must be hidden to protect the brand area.
        expect(await boxOf(motto)).toBeNull();
        // "Become a Sponsor" inline CTA collapses into the mobile drawer.
        expect(
          await boxOf(header.getByRole("link", { name: /become a sponsor of nesa-africa 2026/i }))
        ).toBeNull();
      }
    });

    test("brand area never overlaps another visible header element", async ({ page }) => {
      const header = page.locator("header").first();
      const brand = header.getByRole("link", {
        name: /new education standard award africa.*nesa-africa 2026/i,
      });
      const brandBox = await boxOf(brand);
      expect(brandBox, "brand link must be visible").not.toBeNull();

      // Collect every other interactive/visible header element and ensure
      // none of them overlap the brand area.
      const others = header.locator("a, button");
      const count = await others.count();
      const collisions: string[] = [];
      for (let i = 0; i < count; i++) {
        const el = others.nth(i);
        // Skip the brand link itself and any nested descendants.
        const isBrandOrChild = await el.evaluate((node, brandEl) => {
          return !!brandEl && (node === brandEl || (brandEl as Element).contains(node));
        }, await brand.elementHandle());
        if (isBrandOrChild) continue;

        const b = await boxOf(el);
        if (!b) continue;
        if (overlaps(brandBox!, b)) {
          const label =
            (await el.getAttribute("aria-label")) ||
            (await el.textContent())?.trim().slice(0, 40) ||
            "(unlabeled)";
          collisions.push(`${label} @ ${JSON.stringify(b)}`);
        }
      }
      expect(
        collisions,
        `Brand area ${JSON.stringify(brandBox)} overlaps:\n  - ${collisions.join("\n  - ")}`
      ).toEqual([]);
    });

    test("header does not horizontally overflow", async ({ page }) => {
      const header = page.locator("header").first();
      const b = await header.boundingBox();
      expect(b).not.toBeNull();
      expect(b!.x).toBeGreaterThanOrEqual(-1);
      expect(b!.x + b!.width).toBeLessThanOrEqual(width + 1);

      const docOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(docOverflow).toBeLessThanOrEqual(1);
    });
  });
}
