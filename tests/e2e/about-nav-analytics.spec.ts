/**
 * About navigation analytics coverage.
 *
 * Verifies the `trackEvent` shim (src/lib/analytics.ts) pushes the expected
 * About-menu events onto `window.dataLayer`:
 *
 *   - about_menu_open        — fired when the About trigger is activated
 *                              (hover/focus on desktop, tap on mobile)
 *   - about_menu_click       — fired when an About child link is clicked,
 *                              with { link_name, link_destination, device }
 *   - about_route_navigation — fired alongside about_menu_click, with
 *                              { source, destination, method, device }
 */
import { test, expect, type Page } from "@playwright/test";
import { MAIN_NAV } from "../../src/config/navigation";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const aboutItem = MAIN_NAV.find((i) => i.label === "About")!;
const aboutChildren = aboutItem.children!;
const target =
  aboutChildren.find((c) => c.href === "/about/timeline") ?? aboutChildren[1] ?? aboutChildren[0];

type AnalyticsEvent = Record<string, unknown> & { event?: string };

async function gotoHomeWithDataLayer(page: Page) {
  // Ensure window.dataLayer exists BEFORE any analytics call, so we capture
  // every push from the moment the page boots.
  await page.addInitScript(() => {
    (window as unknown as { dataLayer: AnalyticsEvent[] }).dataLayer = [];
  });
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.locator("header").first().waitFor({ state: "visible" });
}

async function readDataLayer(page: Page): Promise<AnalyticsEvent[]> {
  return await page.evaluate(
    () => (window as unknown as { dataLayer?: AnalyticsEvent[] }).dataLayer ?? [],
  );
}

async function waitForEvent(
  page: Page,
  predicate: (e: AnalyticsEvent) => boolean,
  timeout = 5000,
): Promise<AnalyticsEvent> {
  const start = Date.now();
  // Poll dataLayer; the shim pushes synchronously so this resolves quickly.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const events = await readDataLayer(page);
    const match = events.find(predicate);
    if (match) return match;
    if (Date.now() - start > timeout) {
      throw new Error(
        `Timed out waiting for dataLayer event. Saw: ${JSON.stringify(events)}`,
      );
    }
    await page.waitForTimeout(50);
  }
}

// ---------------------------------------------------------------------------
// DESKTOP
// ---------------------------------------------------------------------------
test.describe("About analytics @ desktop (1280px)", () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page }) => {
    await gotoHomeWithDataLayer(page);
  });

  test("hovering the About trigger pushes about_menu_open", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /^About/ }).first();
    await trigger.hover();

    const evt = await waitForEvent(page, (e) => e.event === "about_menu_open");
    expect(evt).toMatchObject({
      event: "about_menu_open",
      device: "desktop",
    });
    expect(["hover", "focus"]).toContain(String(evt.method));
  });

  test("clicking an About child pushes about_menu_click + about_route_navigation", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /^About/ }).first();
    await trigger.hover();

    const link = page.locator(`a[href="${target.href}"]`).first();
    await link.waitFor({ state: "visible" });
    await link.click();

    const click = await waitForEvent(page, (e) => e.event === "about_menu_click");
    expect(click).toMatchObject({
      event: "about_menu_click",
      link_name: target.label,
      link_destination: target.href,
      device: "desktop",
    });

    const nav = await waitForEvent(page, (e) => e.event === "about_route_navigation");
    expect(nav).toMatchObject({
      event: "about_route_navigation",
      destination: target.href,
      method: "desktop_mega_menu",
      device: "desktop",
    });
  });

  test("non-About menu items do not emit About events", async ({ page }) => {
    const other = MAIN_NAV.find(
      (i) => i.label !== "About" && i.children?.length,
    );
    test.skip(!other, "needs a non-About item with children");
    const otherTrigger = page.getByRole("button", { name: other!.label, exact: true }).first();
    await otherTrigger.hover();

    // Give the trigger time to fire any analytics it would emit.
    await page.waitForTimeout(200);

    const events = await readDataLayer(page);
    const aboutEvents = events.filter((e) =>
      typeof e.event === "string" && e.event.startsWith("about_menu"),
    );
    expect(aboutEvents, JSON.stringify(events)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// MOBILE
// ---------------------------------------------------------------------------
test.describe("About analytics @ mobile (390px)", () => {
  test.use({ viewport: MOBILE });

  test.beforeEach(async ({ page }) => {
    await gotoHomeWithDataLayer(page);
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    await page.locator("#mobile-nav-drawer").waitFor({ state: "visible" });
  });

  test("tapping the About trigger pushes about_menu_open (device: mobile)", async ({ page }) => {
    const drawer = page.locator("#mobile-nav-drawer");
    const trigger = drawer.locator(`#mnav-trigger-${CSS.escape(aboutItem.href)}`);
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const evt = await waitForEvent(page, (e) => e.event === "about_menu_open");
    expect(evt).toMatchObject({
      event: "about_menu_open",
      device: "mobile",
      method: "tap",
    });
  });

  test("tapping an About child pushes about_menu_click + about_route_navigation", async ({ page }) => {
    const drawer = page.locator("#mobile-nav-drawer");
    const trigger = drawer.locator(`#mnav-trigger-${CSS.escape(aboutItem.href)}`);
    const panel = drawer.locator(`#mnav-sub-${CSS.escape(aboutItem.href)}`);
    await trigger.click();
    await expect(panel).toBeVisible();

    await panel.locator(`a[href="${target.href}"]`).first().click();
    await page.waitForURL(`**${target.href}`, { timeout: 10_000 });

    const click = await waitForEvent(page, (e) => e.event === "about_menu_click");
    expect(click).toMatchObject({
      event: "about_menu_click",
      link_name: target.label,
      link_destination: target.href,
      device: "mobile",
    });

    const nav = await waitForEvent(page, (e) => e.event === "about_route_navigation");
    expect(nav).toMatchObject({
      event: "about_route_navigation",
      destination: target.href,
      method: "mobile_accordion",
      device: "mobile",
    });
  });
});
