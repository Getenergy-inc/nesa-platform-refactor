import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 1800 } });

test("desktop groups open, move and close using only the keyboard", async ({ page }) => {
  await page.goto("/contact");
  const primary = page.getByRole("navigation", { name: "Primary", exact: true });
  for (const name of ["About", "Recognition", "Impact", "Media", "Get Involved"]) {
    const trigger = primary.getByRole("menuitem", { name, exact: true });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    const menu = page.getByRole("menu", { name, exact: true });
    await expect(menu).toBeVisible();
    const items = menu.getByRole("menuitem");
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(items.last()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(items.first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  await primary.getByRole("menuitem", { name: "About", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menu", { name: "Recognition", exact: true })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menu", { name: "Recognition", exact: true }).getByRole("menuitem").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(primary.getByRole("menuitem", { name: "Recognition", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(primary.getByRole("link", { name: "Contact", exact: true })).toBeFocused();
});

test("both sign-in controls support arrow movement and Escape focus return", async ({ page }) => {
  await page.goto("/contact");
  for (const name of ["Utility sign in menu", "Sign in menu"]) {
    const trigger = page.getByRole("button", { name, exact: true });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    const menu = page.getByRole("menu");
    await expect(menu.getByRole("menuitem").first()).toBeFocused();
    await page.keyboard.press("End");
    await expect(menu.getByRole("menuitem").last()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(menu.getByRole("menuitem").first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(menu.getByRole("menuitem").nth(1)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  }
});

for (const viewport of [{ width: 915, height: 487 }, { width: 390, height: 844 }]) {
  test(`mobile keyboard focus and Escape at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/contact");
    const trigger = page.getByRole("button", { name: "Open navigation", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const primary = dialog.getByRole("navigation", { name: "Mobile primary", exact: true });
    await primary.getByRole("button", { name: "About", exact: true }).focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await expect(primary.getByRole("link", { name: "About overview", exact: true })).toBeFocused();
    await dialog.getByRole("button", { name: "Sign In", exact: true }).first().focus();
    await page.keyboard.press("Enter");
    await expect(dialog.locator("#mobile-sign-in button")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("link", { name: "Nominee Portal", exact: true })).toBeFocused();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}