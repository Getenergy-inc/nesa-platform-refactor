/**
 * Mobile hamburger drawer focus-trap E2E test.
 *
 * Verifies:
 *   1. Tab cycles forward only inside the open mobile drawer (never leaks to page).
 *   2. Shift+Tab cycles backward inside the drawer.
 *   3. Closing the drawer (× button) returns focus to the hamburger trigger.
 *
 * These assertions guard the Radix Dialog focus-trap behaviour that powers
 * the shadcn Sheet component used in MainNav.tsx.
 */
import { test, expect } from "@playwright/test";

// Mobile viewport (below the `lg:hidden` toggle breakpoint)
test.use({ viewport: { width: 390, height: 844 } });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Wait for the hamburger button to appear.
  await page.getByRole("button", { name: /open navigation/i }).waitFor({ state: "visible" });
});

/**
 * Helper: collect every focusable element inside the drawer content.
 * (Buttons, links, inputs, textareas, selects, and elements with explicit tabindex ≥ 0.)
 */
async function getDrawerFocusables(page: import("@playwright/test").Page) {
  return page.locator(
    '[data-radix-sheet-content] a, ' +
    '[data-radix-sheet-content] button, ' +
    '[data-radix-sheet-content] input, ' +
    '[data-radix-sheet-content] textarea, ' +
    '[data-radix-sheet-content] select, ' +
    '[data-radix-sheet-content] [tabindex]:not([tabindex="-1"])'
  );
}

test("Tab stays inside the open mobile drawer", async ({ page }) => {
  const hamburger = page.getByRole("button", { name: /open navigation/i });

  // Open the drawer.
  await hamburger.click();
  const drawer = page.locator('[data-radix-sheet-content]');
  await expect(drawer).toBeVisible();

  // Wait a tick for the sheet to mount focus trap.
  await page.waitForTimeout(150);

  const focusables = await getDrawerFocusables(page);
  const count = await focusables.count();
  expect(count, "drawer must contain at least one focusable element").toBeGreaterThan(0);

  // Tab forward enough times to wrap at least once.
  // We tab `count + 2` times so even if the trap cycles we should never
  // leave the drawer.
  const trappedIds: (string | null)[] = [];
  for (let i = 0; i < count + 2; i++) {
    await page.keyboard.press("Tab");
    const activeId = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent?.trim() ?? null);
    trappedIds.push(activeId);

    // Ensure the focused element is still inside the drawer.
    const isInside = await page.evaluate(() => {
      const drawer = document.querySelector('[data-radix-sheet-content]');
      const active = document.activeElement;
      return !!drawer && !!active && drawer.contains(active);
    });
    expect(isInside, `Tab press ${i + 1} leaked focus outside the drawer`).toBe(true);
  }

  // Verify we cycled (the first focused element after Tab #1 should reappear).
  const first = trappedIds[0];
  const cycled = trappedIds.slice(1).includes(first);
  expect(cycled, "Tab must cycle within the drawer (focus trap wrap-around)").toBe(true);
});

test("Shift+Tab stays inside the open mobile drawer", async ({ page }) => {
  const hamburger = page.getByRole("button", { name: /open navigation/i });
  await hamburger.click();
  const drawer = page.locator('[data-radix-sheet-content]');
  await expect(drawer).toBeVisible();
  await page.waitForTimeout(150);

  const focusables = await getDrawerFocusables(page);
  const count = await focusables.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count + 2; i++) {
    await page.keyboard.press("Shift+Tab");
    const isInside = await page.evaluate(() => {
      const drawer = document.querySelector('[data-radix-sheet-content]');
      const active = document.activeElement;
      return !!drawer && !!active && drawer.contains(active);
    });
    expect(isInside, `Shift+Tab press ${i + 1} leaked focus outside the drawer`).toBe(true);
  }
});

test("closing the drawer returns focus to the hamburger button", async ({ page }) => {
  const hamburger = page.getByRole("button", { name: /open navigation/i });
  await hamburger.click();
  const drawer = page.locator('[data-radix-sheet-content]');
  await expect(drawer).toBeVisible();
  await page.waitForTimeout(150);

  // Close via the built-in × button (Radix SheetContent renders it by default).
  const closeBtn = drawer.getByRole("button", { name: /close/i });
  await closeBtn.click();
  await expect(drawer).toBeHidden();

  // Focus must land back on the hamburger trigger.
  const isHamburgerFocused = await page.evaluate(() => {
    const hamburger = document.querySelector('button[aria-label*="Open navigation"]');
    return document.activeElement === hamburger;
  });
  expect(isHamburgerFocused, "focus must return to the hamburger button after closing").toBe(true);
});
