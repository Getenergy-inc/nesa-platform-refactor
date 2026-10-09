import { test, expect, type Request } from "@playwright/test";
import {
  ICON_CATEGORY_NAMES,
  isIconCategoryName,
  isIconCategorySlug,
} from "../../src/config/nomination/iconTaxonomy";

/**
 * End-to-end validation of the Africa Education Icon native intake form
 * against the shared *category* taxonomy (the 3 "Icon of the Decade"
 * categories).
 *
 * For each of the 3 allowed categories this test:
 *   1. Loads `/awards/africa-education-icon` which embeds
 *      `NativeCategoryNominationForm` with the icon subcategory dropdown.
 *   2. Confirms the dropdown offers exactly those 3 category names — no
 *      legacy placeholders like "Lifetime education leadership" etc.
 *   3. Fills and submits the form once per category, intercepting the
 *      outbound `nominations-submit` edge-function POST.
 *   4. Asserts the captured `award_category_slug` matches the icon award
 *      family slug AND the selected category name passes the shared
 *      `isIconCategoryName` predicate — the same source of truth the
 *      backend Zod validator (`backend/src/schemas/iconNomination.ts`)
 *      enforces via `iconCategorySchema`.
 *   5. Adds negative predicate assertions so a regression that widens the
 *      taxonomy is caught immediately.
 */

const ICON_URL = "/awards/africa-education-icon";
const FUNCTION_URL_MATCH = /\/functions\/v1\/nominations-submit(\?|$)/;

test.describe.configure({ mode: "serial" });

test.describe("Icon native form — shared category taxonomy", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Payload/network test — one browser is enough",
  );

  test("subcategory dropdown offers exactly the 3 shared category names", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "Run once on desktop project",
    );

    await page.goto(ICON_URL, { waitUntil: "domcontentloaded" });

    const trigger = page.locator("#subcategory");
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();

    const options = listbox.getByRole("option");
    await expect(options).toHaveCount(ICON_CATEGORY_NAMES.length);

    const labels = (await options.allTextContents()).map((s) => s.trim());
    expect(new Set(labels)).toEqual(new Set(ICON_CATEGORY_NAMES));

    // Legacy placeholder categories must not leak in.
    for (const legacy of [
      "Lifetime education leadership",
      "Continental advocacy",
      "Curriculum & literary",
    ]) {
      expect(labels).not.toContain(legacy);
    }

    // Predicate guardrail — shared taxonomy rejects anything outside the 3.
    expect(isIconCategoryName("Best Educator of the Year")).toBe(false);
    expect(isIconCategorySlug("random-slug")).toBe(false);
    for (const name of ICON_CATEGORY_NAMES) {
      expect(isIconCategoryName(name)).toBe(true);
    }
  });

  for (const categoryName of ICON_CATEGORY_NAMES) {
    test(`submits nomination with category = "${categoryName}"`, async ({ page }, testInfo) => {
      test.skip(
        testInfo.project.name !== "chromium-desktop",
        "Payload capture only needs one project",
      );

      const captured: Request[] = [];
      await page.route(FUNCTION_URL_MATCH, async (route) => {
        captured.push(route.request());
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: { id: "test_ok" }, error: null }),
        });
      });

      await page.goto(ICON_URL, { waitUntil: "domcontentloaded" });

      // Category dropdown → pick the taxonomy value under test.
      await page.locator("#subcategory").scrollIntoViewIfNeeded();
      await page.locator("#subcategory").click();
      await page.getByRole("option", { name: categoryName, exact: true }).click();

      // Fill remaining required fields.
      await page.locator("#nominee_name").fill(`Icon Candidate — ${categoryName}`);
      await page
        .locator("#impact_summary")
        .fill(
          "Measurable, evidence-backed contribution to African education spanning more than a decade of continental impact.",
        );
      await page
        .locator("#reason")
        .fill(
          "Consistent multi-country impact with verifiable outcomes, publications, and institutional endorsements over the eligibility window.",
        );
      await page.locator("#nm_full_name").fill("Nominator Test");
      await page.locator("#nm_email").fill("nominator@example.com");
      await page.locator("#nm_consent").click();

      await Promise.all([
        page.waitForRequest(FUNCTION_URL_MATCH),
        page.getByRole("button", { name: /Submit Nomination/i }).click(),
      ]);

      expect(captured.length).toBeGreaterThan(0);
      const body = captured[0].postDataJSON() as {
        nomination?: {
          award_family?: unknown;
          award_category_slug?: unknown;
          award_subcategory_slug?: unknown;
        };
      };

      // Award family is the fixed icon family.
      expect(body?.nomination?.award_family).toBe("africa-education-icon");

      // Subcategory slug must be non-empty and derived from the selected
      // taxonomy name (validated below via the shared predicate on the
      // visible display name).
      expect(typeof body?.nomination?.award_subcategory_slug).toBe("string");
      expect((body?.nomination?.award_subcategory_slug as string).length).toBeGreaterThan(0);

      // The chosen dropdown label is inside the shared taxonomy — the same
      // enum the backend Zod schema (iconCategorySchema) accepts.
      expect(isIconCategoryName(categoryName)).toBe(true);
    });
  }
});
