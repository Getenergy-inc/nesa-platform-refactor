import { test, expect } from "@playwright/test";

/**
 * Verifies the /awards/africa-education-icon gateway renders the
 * full Hero → Pathways → Classifications → Selection → Hall preview
 * layout, and exposes the expected SEO metadata.
 */
test.describe("Africa Education Icon gateway", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/awards/africa-education-icon", { waitUntil: "domcontentloaded" });
  });

  test("SEO tags", async ({ page }) => {
    await expect(page).toHaveTitle(/Africa Education Icon Award 2006[–-]2026/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      "https://nesaafrica.lovable.app/awards/africa-education-icon",
    );

    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://nesaafrica.lovable.app/awards/africa-education-icon",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Africa Education Icon Award/,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /pathways|classifications|selection/i,
    );

    // BreadcrumbList JSON-LD
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.some((s) => s.includes("BreadcrumbList") && s.includes("Africa Education Icon")))
      .toBe(true);
  });

  test("Hero section", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/icon/i);
  });

  test("Pathways section renders 3 cards with correct URLs", async ({ page }) => {
    const pathways = page.locator("section#pathways");
    await expect(pathways.getByRole("heading", { name: /Three Pathways/i })).toBeVisible();

    const expected = [
      "/awards/africa-education-icon/literary-new-curriculum-advocate",
      "/awards/africa-education-icon/technical-educator-icon",
      "/awards/africa-education-icon/education-philanthropy-icon",
    ];
    for (const href of expected) {
      await expect(pathways.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test("Classifications section renders 3 classifications", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /One Continent\. Three Classifications/i });
    await expect(heading).toBeVisible();
    const section = page.locator("section", { has: heading });
    // 3 classifications × 3 pathway sub-links = 9 classification URLs
    const links = section.locator('a[href*="/awards/africa-education-icon/"][href*="/"]');
    expect(await links.count()).toBeGreaterThanOrEqual(9);
  });

  test("Selection process lists six steps", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /How Icons Are Chosen/i });
    await expect(heading).toBeVisible();
    const section = page.locator("section", { has: heading });
    for (const title of [
      "Nomination",
      "Verification",
      "Classification",
      "Jury Review",
      "Shortlist",
      "Laureate Reveal",
    ]) {
      await expect(section.getByRole("heading", { name: title })).toBeVisible();
    }
  });

  test("Hall of Fame preview renders cards and links to full Hall", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /Verified Icons in the Hall/i });
    await expect(heading).toBeVisible();
    const section = page.locator("section", { has: heading });
    await expect(
      section.locator('a[href="/nominees/africa-education-icon-award"]').first(),
    ).toBeVisible();
    // At least one nominee card in the preview grid.
    const cards = section.locator('a[href^="/nominees/africa-education-icon-award/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });
});
