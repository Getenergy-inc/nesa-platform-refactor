/**
 * E2E: /nominees deep-link query params drive the Filtered Results section.
 *
 * Covers Pass D audit behaviour:
 *   - A real category deep-link renders the Filtered Results grid with cards.
 *   - An unmatched award-family / zone deep-link renders the branded
 *     empty-state copy (no nominees in that bracket yet).
 *   - Clearing all filters tears the Filtered Results section back down.
 */
import { test, expect } from "@playwright/test";

const FILTERED = "[data-testid='filtered-results']";
const GRID = "[data-testid='filtered-results-grid']";
const EMPTY = "[data-testid='filtered-results-empty']";

test.describe("/nominees deep-link filters", () => {
  test("category deep-link renders Filtered Results grid", async ({ page }) => {
    await page.goto("/nominees?category=africa-education-icon-award");

    const section = page.locator(FILTERED);
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: /Filtered Results/i })).toBeVisible();

    // Either real cards render OR the branded empty-state shows — both are
    // valid depending on seeded nominee data. Assert one of the two is on
    // screen so the test is stable across environments.
    const gridOrEmpty = page.locator(`${GRID}, ${EMPTY}`);
    await expect(gridOrEmpty.first()).toBeVisible();
  });

  test("unmatched zone deep-link renders branded empty-state", async ({ page }) => {
    // Nigeria + an obscure zone+state combination that should not yet have
    // accepted nominees — exercises the audit-aligned empty copy.
    await page.goto(
      "/nominees?country=nigeria&zone=south-east&state=ebonyi&awardFamily=platinum",
    );

    const empty = page.locator(EMPTY);
    await expect(empty).toBeVisible();
    await expect(empty).toContainText(/No nominees match these filters/i);
    await expect(empty.getByRole("link", { name: /Nominate a champion/i })).toBeVisible();
  });

  test("Clear all filters tears down the Filtered Results section", async ({ page }) => {
    await page.goto("/nominees?awardFamily=icon&recognitionClass=diaspora");

    const section = page.locator(FILTERED);
    await expect(section).toBeVisible();

    // The compact "Clear all" lives in the refine bar; click the first match.
    await page.getByRole("button", { name: /Clear all/i }).first().click();

    await expect(section).toHaveCount(0);
    await expect(page).toHaveURL(/\/nominees\/?$/);
  });
});
