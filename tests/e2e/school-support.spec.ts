import { test, expect } from "@playwright/test";

test("school nomination and support remain independent of award nomination", async ({ page }) => {
  await page.goto("/");
  const fund = page.getByRole("region", { name: "Support Special Needs Education Across Africa" });
  await expect(fund.getByRole("link", { name: "Nominate a Special-Needs School in Africa", exact: true })).toHaveAttribute("href", "/impact/nominate-school");
  await fund.getByRole("link", { name: "Support a Special-Needs School in Africa", exact: true }).click();
  await expect(page).toHaveURL(/\/impact\/special-needs-schools$/);
  await expect(page.locator("article")).toHaveCount(0);
  await expect(page.getByText("School profiles will appear only after verification and explicit publication approval are confirmed.")).toBeVisible();
});

test("school choice opens the existing official school nomination pathway", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Support a School", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link", { name: "Support a Verified School", exact: true })).toHaveAttribute("href", "/impact/special-needs-schools");
  await dialog.getByRole("link", { name: "Nominate a School", exact: true }).click();
  await expect(page).toHaveURL(/\/impact\/nominate-school$/);
  await expect(page.getByRole("heading", { name: "Nominate a Special Needs School", exact: true })).toBeVisible();
});