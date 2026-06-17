/**
 * E2E: /categories/international-bilateral-education
 *
 * Asserts the hero "Nominate Now" CTA navigates to the /nominate flow with
 * the Embassies & High Commissions subcategory UUID preserved as a query
 * param — locking the wiring between the category hero and the nomination
 * intake so future refactors can't silently drop or swap the UUID.
 */
import { test, expect } from "@playwright/test";

const EMBASSIES_UUID = "51dcefcf-e410-4372-85de-65c997c587bf";
const CATEGORY_PATH = "/categories/international-bilateral-education";
const EXPECTED_HREF = `/nominate?subcategory=${EMBASSIES_UUID}`;

test.describe("International & Bilateral Education — Nominate Now CTA", () => {
  test("hero CTA links to /nominate with the Embassies subcategory UUID", async ({ page }) => {
    await page.goto(CATEGORY_PATH);

    const hero = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) }).first();
    await expect(hero).toBeVisible();

    const cta = hero.getByRole("link", { name: /Nominate Now/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", EXPECTED_HREF);
  });

  test("clicking Nominate Now navigates to /nominate preserving the subcategory UUID", async ({ page }) => {
    await page.goto(CATEGORY_PATH);

    const cta = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { level: 1 }) })
      .first()
      .getByRole("link", { name: /Nominate Now/i })
      .first();

    await cta.click();

    await page.waitForURL(/\/nominate(\?|$)/);

    const url = new URL(page.url());
    expect(url.pathname).toBe("/nominate");
    expect(url.searchParams.get("subcategory")).toBe(EMBASSIES_UUID);
  });
});
