/**
 * Visual regression: nominee surfaces.
 *
 * Each test waits for nominee image components to reach `data-state="resolved"`
 * (a real <img>, not the branded initials fallback) before snapshotting, so
 * diffs only fire on real layout / image regressions — never on race conditions
 * with lazy media resolution.
 */
import { test, expect, type Page, type Locator } from "@playwright/test";

const VERIFIED = [
  { slug: "siya-kolisi-south-africa-321", search: "Kolisi" },
  { slug: "tegla-loroupe-kenya-322",      search: "Loroupe" },
  { slug: "angelique-kidjo-benin-323",    search: "Kidjo" },
] as const;

async function maskVolatile(page: Page): Promise<Locator[]> {
  const selectors = [
    "[data-testid='countdown']",
    "[data-testid='live-vote-count']",
    "[data-testid='customer-care-chat']",
    "[aria-label*='chat' i]",
    "iframe",
  ];
  return selectors.map((s) => page.locator(s));
}

/** Wait until every nominee image component on the page has resolved (no fallback tiles). */
async function waitForResolvedNomineeImages(page: Page, opts: { slug?: string } = {}) {
  const selector = opts.slug
    ? `[data-testid="honouree-image"][data-slug="${opts.slug}"], [data-testid="nominee-card-image"][data-slug="${opts.slug}"]`
    : `[data-testid="honouree-image"], [data-testid="nominee-card-image"]`;

  // At least one must exist
  await page.locator(selector).first().waitFor({ state: "attached", timeout: 10_000 });

  // None should still be in `fallback` state for verified rows
  await expect
    .poll(
      async () => page.locator(`${selector}[data-state="fallback"]`).count(),
      { timeout: 10_000, message: `nominee images still in fallback state for ${opts.slug ?? "page"}` },
    )
    .toBe(0);

  // All <img> children must have loaded
  await page.evaluate(async (sel) => {
    const containers = Array.from(document.querySelectorAll(sel));
    const imgs = containers.flatMap((c) =>
      c.tagName === "IMG" ? [c as HTMLImageElement] : Array.from(c.querySelectorAll("img")),
    );
    await Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener("load", res, { once: true });
              img.addEventListener("error", res, { once: true });
            }),
      ),
    );
  }, selector);
}

test.describe("nominee profile page", () => {
  for (const v of VERIFIED) {
    test(`/nominees/${v.slug} renders verified photo`, async ({ page }) => {
      await page.goto(`/nominees/${v.slug}`);
      await waitForResolvedNomineeImages(page, { slug: v.slug });

      const heroImg = page
        .locator(`[data-testid="honouree-image"][data-slug="${v.slug}"][data-state="resolved"]`)
        .first();
      await expect(heroImg).toBeVisible();
      const src = await heroImg.getAttribute("src");
      expect(src, `${v.slug} hero must not be placeholder`).not.toMatch(/placeholder\.svg/);

      await expect(page).toHaveScreenshot(`profile-${v.slug}.png`, {
        fullPage: true,
        mask: await maskVolatile(page),
      });
    });
  }
});

test.describe("nominee cards (directory grid)", () => {
  test("first page renders without placeholder fallbacks for verified rows", async ({ page }) => {
    await page.goto("/nominees");
    for (const v of VERIFIED) {
      await waitForResolvedNomineeImages(page, { slug: v.slug });
    }

    const grid = page.locator("main").first();
    await expect(grid).toBeVisible();

    await expect(grid).toHaveScreenshot("directory-grid.png", {
      mask: await maskVolatile(page),
    });
  });
});

test.describe("honourees carousel (landing)", () => {
  test("ecosystem carousel renders portraits", async ({ page }) => {
    await page.goto("/");

    const carousel = page
      .locator("section, div")
      .filter({ hasText: /Honourees Shaping Africa/i })
      .first();
    await carousel.scrollIntoViewIfNeeded();
    await waitForResolvedNomineeImages(page);

    await expect(carousel).toHaveScreenshot("honourees-carousel.png", {
      mask: await maskVolatile(page),
    });
  });
});

test.describe("search results", () => {
  for (const v of VERIFIED) {
    test(`search "${v.search}" shows the verified nominee card`, async ({ page }) => {
      await page.goto(`/nominees?search=${encodeURIComponent(v.search)}`);
      await waitForResolvedNomineeImages(page, { slug: v.slug });

      const grid = page.locator("main").first();
      await expect(grid).toBeVisible();

      const card = page
        .locator(`[data-testid="nominee-card-image"][data-slug="${v.slug}"][data-state="resolved"]`)
        .first();
      await expect(card).toBeVisible();

      await expect(grid).toHaveScreenshot(`search-${v.search.toLowerCase()}.png`, {
        mask: await maskVolatile(page),
      });
    });
  }
});
