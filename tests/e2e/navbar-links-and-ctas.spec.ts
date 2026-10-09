/**
 * Navbar dropdown link + CTA coverage.
 *
 * For every item in `src/config/navigation.ts` MAIN_NAV (and each child link
 * under its dropdown), this spec asserts that the rendered link points at the
 * expected href on BOTH desktop (≥1200px) and mobile (<1200px) breakpoints.
 *
 * Additionally, the three primary CTAs (Nominate, Vote, Become a Sponsor)
 * are click-tested end-to-end on both breakpoints to verify routing.
 *
 * We assert href values instead of navigating to every page to keep the suite
 * fast and to isolate "did the navbar wire the link correctly?" from any
 * downstream route behaviour.
 */
import { test, expect, type Page } from "@playwright/test";
import { MAIN_NAV, MAIN_NAV_CTAS } from "../../src/config/navigation";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

// Strip in-page hash so we can match the href via Playwright's getByRole.
// (href="/about#mission" still resolves to /about, and Playwright matches the
// exact attribute value, so we keep it as-is here.)
const allChildren = MAIN_NAV.flatMap((item) =>
  (item.children ?? []).map((c) => ({
    parent: item.label,
    label: c.label,
    href: c.href,
  })),
);

async function gotoHome(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.locator("header").first().waitFor({ state: "visible" });
}

// ---------------------------------------------------------------------------
// DESKTOP (≥1200px)
// ---------------------------------------------------------------------------
test.describe("navbar @ desktop (1280px)", () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
  });

  for (const parent of MAIN_NAV) {
    if (!parent.children?.length) continue;

    test(`dropdown "${parent.label}" exposes all child links with correct hrefs`, async ({ page }) => {
      // Open the dropdown by hovering its trigger.
      const trigger = page.getByRole("button", { name: parent.label, exact: true }).first();
      await trigger.hover();
      // Wait for at least one child link to be attached.
      const firstChildHref = parent.children![0].href;
      await page
        .locator(`a[href="${firstChildHref}"]`)
        .first()
        .waitFor({ state: "visible", timeout: 5000 });

      for (const child of parent.children!) {
        const link = page.locator(`a[href="${child.href}"]`).first();
        await expect(link, `${parent.label} → ${child.label} (${child.href})`).toHaveAttribute(
          "href",
          child.href,
        );
      }
    });
  }

  for (const cta of MAIN_NAV_CTAS) {
    test(`CTA "${cta.label}" navigates to ${cta.href}`, async ({ page }) => {
      const link = page.getByRole("link", { name: new RegExp(cta.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }).first();
      await expect(link).toHaveAttribute("href", cta.href);
      await link.click();
      await page.waitForURL(`**${cta.href}`, { timeout: 10_000 });
      expect(new URL(page.url()).pathname).toBe(cta.href);
    });
  }
});

// ---------------------------------------------------------------------------
// MOBILE (<1200px) — hamburger + accordion dropdowns
// ---------------------------------------------------------------------------
test.describe("navbar @ mobile (390px)", () => {
  test.use({ viewport: MOBILE });

  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    // Open hamburger drawer.
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    await page.locator("#mobile-nav-drawer").waitFor({ state: "visible" });
  });

  for (const parent of MAIN_NAV) {
    if (!parent.children?.length) continue;

    test(`mobile accordion "${parent.label}" exposes all child links with correct hrefs`, async ({ page }) => {
      const drawer = page.locator("#mobile-nav-drawer");
      const trigger = drawer.locator(`#mnav-trigger-${CSS.escape(parent.href)}`);
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      const panel = drawer.locator(`#mnav-sub-${CSS.escape(parent.href)}`);
      await expect(panel).toBeVisible();

      for (const child of parent.children!) {
        const link = panel.locator(`a[href="${child.href}"]`).first();
        await expect(link, `${parent.label} → ${child.label} (${child.href})`).toHaveAttribute(
          "href",
          child.href,
        );
      }
    });
  }

  for (const cta of MAIN_NAV_CTAS) {
    test(`mobile CTA "${cta.label}" navigates to ${cta.href}`, async ({ page }) => {
      // CTAs render in the header (outside drawer) on mobile. Close drawer first.
      await page.keyboard.press("Escape");
      await page.locator("#mobile-nav-drawer").waitFor({ state: "hidden" }).catch(() => {});

      const link = page
        .getByRole("link", { name: new RegExp(cta.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") })
        .first();
      await expect(link).toHaveAttribute("href", cta.href);
      await link.click();
      await page.waitForURL(`**${cta.href}`, { timeout: 10_000 });
      expect(new URL(page.url()).pathname).toBe(cta.href);
    });
  }
});
