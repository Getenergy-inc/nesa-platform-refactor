import { test, expect, type Request } from "@playwright/test";
import {
  ICON_NOMINEE_TYPES,
  ICON_NOMINEE_TYPE_VALUES,
  isIconNomineeType,
} from "../../src/config/nomination/iconTaxonomy";

/**
 * End-to-end validation of the Africa Education Icon native intake form
 * against the shared nominee-type taxonomy.
 *
 * For each of the 3 allowed nominee types (Africans in Africa, Diaspora
 * Africans, Friends of Africa) this test:
 *   1. Loads the Icon award gateway (/awards/africa-education-icon) which
 *      embeds `NativeCategoryNominationForm` for the icon family.
 *   2. Confirms the "Nominee type" dropdown offers exactly those 3 values
 *      (and no legacy `individual` / `organization` / `school` / `program`).
 *   3. Fills and submits the form, intercepting the outbound
 *      `nominations-submit` edge-function POST.
 *   4. Asserts the captured payload's `nomination.nominee_type` is the
 *      selected value AND passes the shared `isIconNomineeType` predicate —
 *      the same source of truth the backend Zod validator
 *      (`backend/src/schemas/iconNomination.ts`) enforces.
 *   5. Additionally asserts the predicate rejects a bogus value ("Martian")
 *      so a regression that widens the enum is caught immediately.
 */

const ICON_URL = "/awards/africa-education-icon";
const FUNCTION_URL_MATCH = /\/functions\/v1\/nominations-submit(\?|$)/;

// Only run on one viewport — the form logic is identical across breakpoints
// and multiplying by 3 projects × 3 nominee types blows out CI time.
test.describe.configure({ mode: "serial" });

test.describe("Icon native form — shared nominee-type taxonomy", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Payload/network test — one browser is enough",
  );

  test("dropdown offers exactly the 3 shared taxonomy values", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "Run once on desktop project",
    );

    await page.goto(ICON_URL, { waitUntil: "domcontentloaded" });

    const trigger = page.locator("#nominee_type");
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();

    const options = listbox.getByRole("option");
    await expect(options).toHaveCount(ICON_NOMINEE_TYPE_VALUES.length);

    const labels = (await options.allTextContents()).map((s) => s.trim());
    expect(new Set(labels)).toEqual(new Set(ICON_NOMINEE_TYPE_VALUES));

    // Legacy values must not leak into the icon form.
    for (const legacy of ["Individual", "Organization", "School", "Program / Project"]) {
      expect(labels).not.toContain(legacy);
    }

    // Predicate guardrail: bogus values must be rejected by the shared
    // taxonomy that both the frontend and the backend Zod schema consume.
    expect(isIconNomineeType("Martian")).toBe(false);
    expect(isIconNomineeType("individual")).toBe(false);
  });

  for (const nomineeType of ICON_NOMINEE_TYPE_VALUES) {
    test(`submits nomination with nominee_type = "${nomineeType}"`, async ({ page }, testInfo) => {
      test.skip(
        testInfo.project.name !== "chromium-desktop",
        "Payload capture only needs one project",
      );

      // Intercept and short-circuit the edge-function invocation so the test
      // does not depend on the backend running — we assert on the payload
      // the frontend sends.
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

      // Nominee type dropdown → pick the taxonomy value under test.
      await page.locator("#nominee_type").scrollIntoViewIfNeeded();
      await page.locator("#nominee_type").click();
      await page.getByRole("option", { name: nomineeType, exact: true }).click();

      // Verify the description helper text reflects the selection — proves
      // ICON_NOMINEE_TYPES is the single source rendered.
      const expectedDesc = ICON_NOMINEE_TYPES.find((t) => t.value === nomineeType)!.description;
      await expect(page.getByText(expectedDesc, { exact: false })).toBeVisible();

      // Fill required fields.
      await page.locator("#nominee_name").fill(`Test Nominee (${nomineeType})`);
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

      // Consent checkbox (Radix) — click the visible checkbox.
      await page.locator("#nm_consent").click();

      const [_req] = await Promise.all([
        page.waitForRequest(FUNCTION_URL_MATCH),
        page.getByRole("button", { name: /Submit Nomination/i }).click(),
      ]);

      expect(captured.length).toBeGreaterThan(0);
      const body = captured[0].postDataJSON() as {
        nomination?: { nominee_type?: unknown; award_family?: unknown };
      };
      expect(body?.nomination?.award_family).toBe("africa-education-icon");
      const sent = body?.nomination?.nominee_type;
      expect(sent).toBe(nomineeType);

      // The same predicate the backend Zod schema uses — proves the value
      // sits inside the shared taxonomy enum.
      expect(isIconNomineeType(sent)).toBe(true);
    });
  }
});
