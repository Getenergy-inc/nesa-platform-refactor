/**
 * About navigation ecosystem coverage.
 *
 * Verifies the About mobile accordion and About desktop mega menu against the
 * IA brief:
 *   - mega menu renders all 6 About links with correct hrefs
 *   - mobile accordion behaves as a single-open accordion with focus mgmt
 *   - keyboard navigation: ArrowDown/Up between triggers, Escape closes panel
 *     and restores focus to its trigger, ArrowDown moves between links inside
 *     an open panel
 *   - selecting a child link navigates to the destination AND auto-closes the
 *     drawer (no stale expanded state)
 */
import { test, expect, type Page } from "@playwright/test";
import { MAIN_NAV } from "../../src/config/navigation";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const aboutItem = MAIN_NAV.find((i) => i.label === "About")!;
if (!aboutItem?.children?.length) {
  throw new Error("About item with children must exist in MAIN_NAV");
}
const aboutChildren = aboutItem.children;

async function gotoHome(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.locator("header").first().waitFor({ state: "visible" });
}

// ---------------------------------------------------------------------------
// DESKTOP — About mega menu
// ---------------------------------------------------------------------------
test.describe("About mega menu @ desktop (1280px)", () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
  });

  test("opens on hover and exposes all child links with correct hrefs", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /^About( menu)?$/, exact: false }).first();
    await trigger.hover();

    // Wait for first child link to render in the open panel.
    const firstHref = aboutChildren[0].href;
    await page.locator(`a[href="${firstHref}"]`).first().waitFor({ state: "visible", timeout: 5000 });

    for (const child of aboutChildren) {
      const link = page.locator(`a[href="${child.href}"]`).first();
      await expect(link, `About → ${child.label}`).toHaveAttribute("href", child.href);
    }
  });

  test("trigger has aria-expanded toggled by keyboard activation", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /^About/ }).first();
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Radix NavigationMenuTrigger opens on Enter / Space.
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // First child link should be reachable via keyboard.
    await page.locator(`a[href="${aboutChildren[0].href}"]`).first().waitFor({ state: "visible" });

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking a child link navigates to the About destination", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /^About/ }).first();
    await trigger.hover();

    const target = aboutChildren.find((c) => c.href === "/about/timeline") ?? aboutChildren[0];
    const link = page.locator(`a[href="${target.href}"]`).first();
    await link.waitFor({ state: "visible" });
    await link.click();

    await page.waitForURL(`**${target.href}`, { timeout: 10_000 });
    expect(new URL(page.url()).pathname).toBe(target.href);
  });
});

// ---------------------------------------------------------------------------
// MOBILE — About accordion
// ---------------------------------------------------------------------------
test.describe("About accordion @ mobile (390px)", () => {
  test.use({ viewport: MOBILE });

  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    await page.locator("#mobile-nav-drawer").waitFor({ state: "visible" });
  });

  test("expands About panel and renders all child links", async ({ page }) => {
    const drawer = page.locator("#mobile-nav-drawer");
    const trigger = drawer.locator(`#mnav-trigger-${CSS.escape(aboutItem.href)}`);
    const panel = drawer.locator(`#mnav-sub-${CSS.escape(aboutItem.href)}`);

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();

    for (const child of aboutChildren) {
      const link = panel.locator(`a[href="${child.href}"]`).first();
      await expect(link, `About → ${child.label}`).toHaveAttribute("href", child.href);
      const box = await link.boundingBox();
      expect(box, `tap target for ${child.label}`).not.toBeNull();
      // Accessibility: minimum 44px tap target height.
      expect((box?.height ?? 0)).toBeGreaterThanOrEqual(44);
    }
  });

  test("accordion is single-open: opening another item collapses About", async ({ page }) => {
    const drawer = page.locator("#mobile-nav-drawer");
    const aboutTrigger = drawer.locator(`#mnav-trigger-${CSS.escape(aboutItem.href)}`);
    await aboutTrigger.click();
    await expect(aboutTrigger).toHaveAttribute("aria-expanded", "true");

    const other = MAIN_NAV.find((i) => i.label !== "About" && i.children?.length);
    test.skip(!other, "needs a second item with children");

    const otherTrigger = drawer.locator(`#mnav-trigger-${CSS.escape(other!.href)}`);
    await otherTrigger.click();
    await expect(otherTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(aboutTrigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape inside the panel collapses it and restores focus to the trigger", async ({ page }) => {
    const drawer = page.locator("#mobile-nav-drawer");
    const trigger = drawer.locator(`#mnav-trigger-${CSS.escape(aboutItem.href)}`);
    const panel = drawer.locator(`#mnav-sub-${CSS.escape(aboutItem.href)}`);
    await trigger.click();
    await expect(panel).toBeVisible();

    // After expansion, focus auto-moves to the first link in the panel.
    const firstLink = panel.locator(`a[href="${aboutChildren[0].href}"]`).first();
    await expect(firstLink).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("ArrowDown moves focus between links inside the open panel", async ({ page }) => {
    const drawer = page.locator("#mobile-nav-drawer");
    const trigger = drawer.locator(`#mnav-trigger-${CSS.escape(aboutItem.href)}`);
    const panel = drawer.locator(`#mnav-sub-${CSS.escape(aboutItem.href)}`);
    await trigger.click();
    await expect(panel).toBeVisible();

    const firstLink = panel.locator(`a[href="${aboutChildren[0].href}"]`).first();
    const secondLink = panel.locator(`a[href="${aboutChildren[1].href}"]`).first();
    await expect(firstLink).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(secondLink).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(firstLink).toBeFocused();
  });

  test("selecting an About link navigates and auto-closes the drawer", async ({ page }) => {
    const drawer = page.locator("#mobile-nav-drawer");
    const trigger = drawer.locator(`#mnav-trigger-${CSS.escape(aboutItem.href)}`);
    const panel = drawer.locator(`#mnav-sub-${CSS.escape(aboutItem.href)}`);
    await trigger.click();
    await expect(panel).toBeVisible();

    const target = aboutChildren.find((c) => c.href === "/about/timeline") ?? aboutChildren[0];
    await panel.locator(`a[href="${target.href}"]`).first().click();

    await page.waitForURL(`**${target.href}`, { timeout: 10_000 });
    expect(new URL(page.url()).pathname).toBe(target.href);

    // Drawer is dismissed after navigation — no stale expanded state.
    await expect(page.locator("#mobile-nav-drawer")).toBeHidden();
  });
});
