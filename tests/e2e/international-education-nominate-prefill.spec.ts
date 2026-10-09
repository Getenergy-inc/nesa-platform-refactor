/**
 * E2E: opens the /nominate flow from the Category hero "Nominate Now" CTA
 * and asserts the Embassies & High Commissions subcategory UUID is
 * preserved as the source of truth for the form step.
 *
 * The /nominate route (NominateMvp) treats `?subcategory=` as the prefilled
 * selection for downstream steps — this test guards that:
 *   1. The UUID arrives intact on /nominate (even after the page rewrites
 *      the query string to mirror the active language).
 *   2. The Public Nomination form step actually renders (h1 visible).
 *   3. The subcategory query param continues to reflect the exact UUID in
 *      the live URL the form step reads from.
 */
import { test, expect } from "@playwright/test";

const EMBASSIES_UUID = "51dcefcf-e410-4372-85de-65c997c587bf";
const CATEGORY_PATH = "/categories/international-bilateral-education";

test.describe("Nominate flow — subcategory UUID prefill from International & Bilateral Education", () => {
  test("Nominate Now opens /nominate with the subcategory UUID prefilled in the form step URL", async ({
    page,
  }) => {
    await page.goto(CATEGORY_PATH);

    const cta = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { level: 1 }) })
      .first()
      .getByRole("link", { name: /Nominate Now/i })
      .first();

    await expect(cta).toHaveAttribute(
      "href",
      `/nominate?subcategory=${EMBASSIES_UUID}`,
    );

    await cta.click();
    await page.waitForURL(/\/nominate(\?|$)/);

    // Form step UI: NominateMvp renders the Public Nomination heading.
    await expect(
      page.getByRole("heading", { level: 1, name: /Public Nomination/i }),
    ).toBeVisible();

    // The form step reads ?subcategory= from the live URL — assert the
    // UUID round-tripped intact even though NominateMvp rewrites the
    // query string (e.g. appending ?lang=) on mount.
    await expect
      .poll(() => new URL(page.url()).searchParams.get("subcategory"))
      .toBe(EMBASSIES_UUID);

    const url = new URL(page.url());
    expect(url.pathname).toBe("/nominate");
    expect(url.searchParams.get("subcategory")).toBe(EMBASSIES_UUID);
  });
});
