/**
 * Visual regression: nominee surfaces.
 *
 * Covers:
 *   - /nominees/:slug profile (verified-photo honouree)
 *   - Nominee cards grid on /nominees
 *   - Honourees carousel on the landing page
 *   - Search results on /nominees?search=...
 *
 * Each test masks volatile zones (countdown, live counters, chat widget)
 * so the snapshot diff only fires on real layout / fallback-image breakage.
 */
import { test, expect, type Page, type Locator } from "@playwright/test";

const VERIFIED = [
  { slug: "siya-kolisi-south-africa-321", search: "Kolisi" },
  { slug: "tegla-loroupe-kenya-322",      search: "Loroupe" },
  { slug: "angelique-kidjo-benin-323",    search: "Kidjo" },
] as const;

/** Hide elements that change between runs (live counters, chat bubble, countdown). */
async function maskVolatile(page: Page): Promise<Locator[]> {
  const selectors = [
    "[data-testid='countdown']",
    "[data-testid='live-vote-count']",
    "[data-testid='customer-care-chat']",
    "[aria-label*='chat' i]",
    "iframe", // youtube embeds etc.
  ];
  return selectors.map((s) => page.locator(s));
}

async function waitForImages(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
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
  });
}

test.describe("nominee profile page", () => {
  for (const v of VERIFIED) {
    test(`/nominees/${v.slug} renders verified photo`, async ({ page }) => {
      await page.goto(`/nominees/${v.slug}`);
      await waitForImages(page);

      // Hard assertion: the hero must render a real <img>, not a fallback tile.
      const heroImg = page.locator("main img").first();
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
    await waitForImages(page);

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
    await waitForImages(page);

    // Scroll the carousel into view before snapshotting.
    const carousel = page
      .locator("section, div")
      .filter({ hasText: /Honourees Shaping Africa/i })
      .first();
    await carousel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400); // let lazy images settle

    await expect(carousel).toHaveScreenshot("honourees-carousel.png", {
      mask: await maskVolatile(page),
    });
  });
});

test.describe("search results", () => {
  for (const v of VERIFIED) {
    test(`search "${v.search}" shows the verified nominee card`, async ({ page }) => {
      await page.goto(`/nominees?search=${encodeURIComponent(v.search)}`);
      await waitForImages(page);

      const grid = page.locator("main").first();
      await expect(grid).toBeVisible();

      // The matching nominee photo must render as a real <img>.
      const photo = page.locator(`img[src*="/nominees/"]`).first();
      await expect(photo).toBeVisible();

      await expect(grid).toHaveScreenshot(`search-${v.search.toLowerCase()}.png`, {
        mask: await maskVolatile(page),
      });
    });
  }
});
