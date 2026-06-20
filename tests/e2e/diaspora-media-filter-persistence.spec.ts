import { test, expect } from "@playwright/test";

/**
 * Diaspora Education Impact — media filter persistence across region tabs.
 *
 * Verifies that:
 *   1. Selecting a media filter (e.g. "No Media Yet") persists when switching
 *      between region tabs.
 *   2. The nominee card count updates correctly per region while the same
 *      filter remains active.
 *
 * Data reference (src/pages/categories/diasporaData.ts) — all current nominees
 * are media_type === "none", so:
 *     • West Africa: 6 nominees under "No Media Yet"
 *     • East Africa: 5 nominees under "No Media Yet"
 *     • Indian Ocean: 0 nominees (region empty state)
 *
 * The "Has Photo" filter should yield empty filter-state cards in every
 * non-empty region.
 */

const PAGE = "/categories/diaspora-education-impact";

// Cards are the only `.grid` items rendered inside an active TabsContent
// nominee grid. Scope by role+name on the parent tab panel is unreliable
// because TabsContent has no accessible name, so we use the card title
// selector unique to NomineeCard (h4 inside Card).
const CARD_TITLE = "section h4.font-semibold";

async function activeRegionCards(page: import("@playwright/test").Page) {
  // Only the active TabsContent is mounted (Radix default), so any visible
  // nominee card belongs to the currently selected region.
  return page.locator(`${CARD_TITLE}:visible`);
}

async function filterButton(
  page: import("@playwright/test").Page,
  label: RegExp,
) {
  return page.getByRole("button", { name: label });
}

test.describe("Diaspora media filter persists across region tabs", () => {
  test("‘No Media Yet’ stays selected; counts update per region", async ({
    page,
  }) => {
    await page.goto(PAGE);

    // Wait for the nominee section to render.
    await expect(
      page.getByRole("heading", { name: /2026 nominees/i }),
    ).toBeVisible();

    // Default tab is North Africa — confirm cards rendered before filtering.
    const initialCards = await activeRegionCards(page);
    await expect(initialCards.first()).toBeVisible();

    // 1. Select "No Media Yet" filter.
    const noMediaBtn = await filterButton(page, /No Media Yet/i);
    await noMediaBtn.click();

    // Active state: variant=default applies `bg-gold` utility.
    await expect(noMediaBtn).toHaveClass(/bg-gold/);

    // 2. Switch to West Africa — expect 6 cards.
    await page.getByRole("tab", { name: "West Africa" }).click();
    const westCards = await activeRegionCards(page);
    await expect(westCards).toHaveCount(6);

    // Filter must still be selected.
    await expect(noMediaBtn).toHaveClass(/bg-gold/);

    // 3. Switch to East Africa — expect 5 cards.
    await page.getByRole("tab", { name: "East Africa" }).click();
    const eastCards = await activeRegionCards(page);
    await expect(eastCards).toHaveCount(5);

    // Filter still selected after second tab switch.
    await expect(noMediaBtn).toHaveClass(/bg-gold/);

    // 4. Counts differ between the two regions for the same filter.
    expect(await westCards.count()).not.toEqual(await eastCards.count());
  });

  test("‘Has Photo’ filter persists and shows empty state per region", async ({
    page,
  }) => {
    await page.goto(PAGE);

    await expect(
      page.getByRole("heading", { name: /2026 nominees/i }),
    ).toBeVisible();

    const photoBtn = await filterButton(page, /Has Photo/i);
    await photoBtn.click();
    await expect(photoBtn).toHaveClass(/bg-gold/);

    // West Africa under photo filter → empty filter-state.
    await page.getByRole("tab", { name: "West Africa" }).click();
    await expect(
      page.getByText(/No photo submissions yet for this region/i),
    ).toBeVisible();
    await expect(await activeRegionCards(page)).toHaveCount(0);

    // Filter persists into East Africa with same empty state.
    await page.getByRole("tab", { name: "East Africa" }).click();
    await expect(photoBtn).toHaveClass(/bg-gold/);
    await expect(
      page.getByText(/No photo submissions yet for this region/i),
    ).toBeVisible();
    await expect(await activeRegionCards(page)).toHaveCount(0);
  });
});
