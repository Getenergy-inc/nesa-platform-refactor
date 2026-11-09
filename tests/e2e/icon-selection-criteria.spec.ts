import { expect, test } from "@playwright/test";

const ICON_ROUTES = [
  "/programme-2026",
  "/awards/africa-education-icon",
  "/recognition/africa-education-icon",
  "/africa-education-icon",
] as const;

const CRITERIA = [
  ["Lifetime Education Impact", "25%"],
  ["Scale and Reach", "15%"],
  ["Sustainability and Legacy", "15%"],
  ["Innovation or Knowledge Contribution", "10%"],
  ["Inclusion and Equity", "10%"],
  ["Leadership and Integrity", "10%"],
  ["Evidence Quality", "10%"],
  ["Continental Relevance", "5%"],
] as const;

for (const route of ICON_ROUTES) {
  test(`${route} presents the complete Icon selection criteria`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(route, { waitUntil: "domcontentloaded" });
    const section = page.getByRole("region", { name: "Selection Criteria", exact: true });
    await expect(section).toBeVisible();
    await expect(section.getByText(/10-year documented activity profile/i)).toBeVisible();
    await expect(section.locator("article")).toHaveCount(8);

    for (const [criterion, weight] of CRITERIA) {
      const card = section.locator("article").filter({ hasText: criterion });
      await expect(card).toHaveCount(1);
      await expect(card.getByText(weight, { exact: true })).toBeVisible();
    }

    await expect(section.getByText(/does not guarantee selection/i)).toBeVisible();
    expect(errors, `${route} must render without browser errors`).toEqual([]);
  });
}
