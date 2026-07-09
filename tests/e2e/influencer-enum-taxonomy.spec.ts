import { test, expect, type Request } from "@playwright/test";
import {
  INFLUENCER_MEDIUM_SLUGS,
  INFLUENCER_MEDIUM_LABELS,
  INFLUENCER_IMPACT_AREAS,
  INFLUENCER_IMPACT_SCALES,
  INFLUENCER_RECOGNITION_REGIONS,
  isInfluencerMediumLabel,
  isInfluencerMediumSlug,
  isInfluencerImpactArea,
  areAllInfluencerImpactAreas,
  isInfluencerImpactScale,
  isInfluencerRecognitionRegion,
} from "../../src/config/nomination/influencerTaxonomy";

/**
 * End-to-end validation of the dedicated Influencer Education Impact Award
 * intake form (src/components/awards/InfluencerNominationForm.tsx).
 *
 * For the four enum-controlled fields — `medium_of_influence`,
 * `education_impact_areas`, `impact_scale`, `recognition_region` — this
 * spec:
 *   1. Loads /awards/influencer-education-impact where the form is mounted.
 *   2. Confirms the visible controls expose EXACTLY the shared taxonomy
 *      values (no extras, no legacy strings).
 *   3. Submits a valid nomination while intercepting the outbound
 *      nominations-submit edge-function POST, and asserts every enum
 *      field on the payload passes its shared predicate.
 *   4. Runs a NEGATIVE scenario that injects bogus enum values into the
 *      captured payload and verifies the shared predicates (which mirror
 *      the backend accept-list) reject them.
 */

const URL_PATH = "/awards/influencer-education-impact";
const FUNCTION_URL_MATCH = /\/functions\/v1\/nominations-submit(\?|$)/;

test.describe.configure({ mode: "serial" });

test.describe("Influencer intake form — shared enum taxonomy", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Payload/network test — one browser is enough",
  );

  test("form controls expose exactly the shared taxonomy values", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "Run once on desktop project",
    );

    await page.goto(URL_PATH, { waitUntil: "domcontentloaded" });

    // --- 1. medium_of_influence dropdown (#pathway) ------------------------
    const pathwayTrigger = page.locator("#pathway");
    await pathwayTrigger.scrollIntoViewIfNeeded();
    await pathwayTrigger.click();
    let listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    let options = listbox.getByRole("option");
    await expect(options).toHaveCount(INFLUENCER_MEDIUM_LABELS.length);
    const mediumLabels = (await options.allTextContents()).map((s) => s.trim());
    expect(new Set(mediumLabels)).toEqual(new Set(INFLUENCER_MEDIUM_LABELS));
    // Close dropdown
    await page.keyboard.press("Escape");

    // --- 2. education_impact_areas checkboxes -----------------------------
    for (const area of INFLUENCER_IMPACT_AREAS) {
      await expect(page.locator(`#area-${CSS.escape(area)}`)).toHaveCount(1);
    }

    // --- 3. impact_scale radio group --------------------------------------
    for (const scale of INFLUENCER_IMPACT_SCALES) {
      await expect(page.locator(`#scale-${CSS.escape(scale)}`)).toHaveCount(1);
    }

    // --- 4. recognition_region dropdown (#region) -------------------------
    const regionTrigger = page.locator("#region");
    await regionTrigger.scrollIntoViewIfNeeded();
    await regionTrigger.click();
    listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    options = listbox.getByRole("option");
    await expect(options).toHaveCount(INFLUENCER_RECOGNITION_REGIONS.length);
    const regionLabels = (await options.allTextContents()).map((s) => s.trim());
    expect(new Set(regionLabels)).toEqual(
      new Set(INFLUENCER_RECOGNITION_REGIONS),
    );
    await page.keyboard.press("Escape");

    // --- Positive predicate guardrails ------------------------------------
    for (const label of INFLUENCER_MEDIUM_LABELS) expect(isInfluencerMediumLabel(label)).toBe(true);
    for (const slug of INFLUENCER_MEDIUM_SLUGS) expect(isInfluencerMediumSlug(slug)).toBe(true);
    for (const a of INFLUENCER_IMPACT_AREAS) expect(isInfluencerImpactArea(a)).toBe(true);
    for (const s of INFLUENCER_IMPACT_SCALES) expect(isInfluencerImpactScale(s)).toBe(true);
    for (const r of INFLUENCER_RECOGNITION_REGIONS)
      expect(isInfluencerRecognitionRegion(r)).toBe(true);

    // --- Negative predicate guardrails (bogus values are rejected) --------
    expect(isInfluencerMediumSlug("tiktok-icons")).toBe(false);
    expect(isInfluencerMediumLabel("Celebrity Endorsers")).toBe(false);
    expect(isInfluencerImpactArea("Follower Growth")).toBe(false);
    expect(areAllInfluencerImpactAreas([])).toBe(false);
    expect(areAllInfluencerImpactAreas(["Scholarships", "Bogus"])).toBe(false);
    expect(isInfluencerImpactScale("Universal")).toBe(false);
    expect(isInfluencerRecognitionRegion("Antarctica")).toBe(false);
  });

  test("submits a valid nomination and payload passes every enum predicate", async ({
    page,
  }, testInfo) => {
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
        body: JSON.stringify({ data: { id: "inf_ok" }, error: null }),
      });
    });

    await page.goto(URL_PATH, { waitUntil: "domcontentloaded" });

    // Pathway (medium_of_influence)
    await page.locator("#pathway").scrollIntoViewIfNeeded();
    await page.locator("#pathway").click();
    await page
      .getByRole("option", { name: INFLUENCER_MEDIUM_LABELS[0], exact: true })
      .click();

    // Impact areas — pick 3 valid ones
    const chosenAreas = [
      INFLUENCER_IMPACT_AREAS[0],
      INFLUENCER_IMPACT_AREAS[3],
      INFLUENCER_IMPACT_AREAS[10],
    ];
    for (const a of chosenAreas) {
      await page.locator(`#area-${CSS.escape(a)}`).click();
    }

    // Impact scale — Regional
    await page.locator(`#scale-${CSS.escape("Regional")}`).click();

    // Recognition region — West Africa (non-diaspora branch → African country dropdown)
    await page.locator("#region").click();
    await page
      .getByRole("option", { name: "West Africa", exact: true })
      .click();

    // Country dropdown
    await page.locator("#country").click();
    await page.getByRole("option", { name: "Nigeria", exact: true }).click();

    // Nominee + impact summary + nominator
    await page.locator("#nominee_name").fill("Test Influencer Nominee");
    await page
      .locator("#impact_summary")
      .fill(
        "Measurable multi-country contribution to Education for All spanning scholarships, mentorship and school infrastructure over the last five years.",
      );
    await page.locator("#nm_full_name").fill("Nominator Test");
    await page.locator("#nm_email").fill("nominator@example.com");
    await page.locator("#nm_consent").click();

    await Promise.all([
      page.waitForRequest(FUNCTION_URL_MATCH),
      page
        .getByRole("button", { name: /Submit Influencer Nomination/i })
        .click(),
    ]);

    expect(captured.length).toBeGreaterThan(0);
    const body = captured[0].postDataJSON() as {
      nomination?: {
        award_family?: unknown;
        award_subcategory_slug?: unknown;
        metadata?: {
          medium_of_influence?: unknown;
          recognition_pathway?: unknown;
          education_impact_areas?: unknown;
          impact_scale?: unknown;
          recognition_region?: unknown;
        };
      };
    };

    expect(body?.nomination?.award_family).toBe("influencer");

    const meta = body?.nomination?.metadata ?? {};
    expect(isInfluencerMediumSlug(meta.recognition_pathway)).toBe(true);
    expect(isInfluencerMediumSlug(body?.nomination?.award_subcategory_slug)).toBe(true);
    expect(isInfluencerMediumLabel(meta.medium_of_influence)).toBe(true);
    expect(areAllInfluencerImpactAreas(meta.education_impact_areas)).toBe(true);
    expect(isInfluencerImpactScale(meta.impact_scale)).toBe(true);
    expect(isInfluencerRecognitionRegion(meta.recognition_region)).toBe(true);

    // Sanity: chosen values round-trip exactly
    expect(meta.medium_of_influence).toBe(INFLUENCER_MEDIUM_LABELS[0]);
    expect(meta.recognition_pathway).toBe(INFLUENCER_MEDIUM_SLUGS[0]);
    expect(meta.impact_scale).toBe("Regional");
    expect(meta.recognition_region).toBe("West Africa");
    expect(new Set(meta.education_impact_areas as string[])).toEqual(
      new Set(chosenAreas),
    );
  });

  test("negative: bogus enum values are rejected by the shared predicates", async () => {
    // Simulates a tampered payload — same predicates the backend uses.
    const bogusPayload = {
      award_family: "influencer",
      award_subcategory_slug: "tiktok-icons",
      metadata: {
        recognition_pathway: "tiktok-icons",
        medium_of_influence: "Celebrity Endorsers",
        education_impact_areas: ["Scholarships", "Follower Growth"],
        impact_scale: "Universal",
        recognition_region: "Antarctica",
      },
    };

    expect(isInfluencerMediumSlug(bogusPayload.award_subcategory_slug)).toBe(false);
    expect(isInfluencerMediumSlug(bogusPayload.metadata.recognition_pathway)).toBe(false);
    expect(isInfluencerMediumLabel(bogusPayload.metadata.medium_of_influence)).toBe(false);
    expect(areAllInfluencerImpactAreas(bogusPayload.metadata.education_impact_areas)).toBe(false);
    expect(isInfluencerImpactScale(bogusPayload.metadata.impact_scale)).toBe(false);
    expect(isInfluencerRecognitionRegion(bogusPayload.metadata.recognition_region)).toBe(false);
  });
});
