/**
 * E2E: StageGate blocks nomination actions when the `nominations` stage
 * is locked in the backend and renders the StageLocked CTA.
 *
 * Strategy:
 *   - Intercept the Supabase REST request to `stage_config` and return a
 *     deterministic payload where the `nominations` stage has
 *     `is_open=false` with a future `opens_at` date.
 *   - Visit `/nominate` and assert that:
 *       1. The locked Card renders the "Nominations Currently Closed"
 *          heading from StageLocked.
 *       2. The closed-stage explanatory copy is present.
 *       3. The "Opens: <future date>" chip is rendered.
 *       4. The interactive nomination form is NOT mounted (gate blocked
 *          its children) — checked by the absence of the Submit button.
 */
import { test, expect } from "@playwright/test";

const FUTURE_OPENS_AT = "2099-09-01T00:00:00.000Z";

const STAGE_CONFIG_LOCKED = [
  {
    action: "nominations",
    is_open: false,
    opens_at: FUTURE_OPENS_AT,
    closes_at: null,
    seasons: { is_active: true },
  },
  {
    action: "public_voting",
    is_open: false,
    opens_at: null,
    closes_at: null,
    seasons: { is_active: true },
  },
  {
    action: "jury_scoring",
    is_open: false,
    opens_at: null,
    closes_at: null,
    seasons: { is_active: true },
  },
  {
    action: "results",
    is_open: false,
    opens_at: null,
    closes_at: null,
    seasons: { is_active: true },
  },
  {
    action: "certificates",
    is_open: false,
    opens_at: null,
    closes_at: null,
    seasons: { is_active: true },
  },
];

test.describe("StageGate — nominations locked", () => {
  test("/nominate renders StageLocked CTA and blocks the form when stage is closed", async ({
    page,
  }) => {
    // Stub the stage_config REST call to force a locked nominations stage.
    await page.route("**/rest/v1/stage_config*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": "0-4/5" },
        body: JSON.stringify(STAGE_CONFIG_LOCKED),
      });
    });

    await page.goto("/nominate");

    // StageLocked Card surfaces the closed-stage messaging.
    const lockedHeading = page.getByRole("heading", {
      name: /Nominations Currently Closed/i,
    });
    await expect(lockedHeading).toBeVisible();

    await expect(
      page.getByText(/is not currently open/i).first(),
    ).toBeVisible();

    // Opens-at chip renders the future date we stubbed (year 2099).
    await expect(page.getByText(/Opens:\s*.*2099/i)).toBeVisible();

    // The gated nomination form must NOT have mounted — its primary
    // Submit action is absent because StageGate replaced its children
    // with the StageLocked fallback.
    await expect(
      page.getByRole("button", { name: /Submit Nomination/i }),
    ).toHaveCount(0);
  });
});
