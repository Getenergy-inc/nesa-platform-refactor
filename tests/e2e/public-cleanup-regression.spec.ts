import { test, expect, type Page } from "@playwright/test";

// Rendered pages, not source scans: private/admin legacy data may remain.
const publicRoutes = [
  "/", "/media", "/media/gala", "/gala", "/events/gala-2026",
  "/awards", "/awards/categories", "/awards/18-categories",
  "/recognition", "/resources", "/nominate", "/about", "/partners",
  "/upcoming-events",
];
const ticketRoutes = [
  "/tickets", "/buy-your-ticket", "/gala/tickets", "/gala/attendance", "/gala/tables",
];

async function assertNoTicketSales(page: Page) {
  await expect(page.getByRole("link", { name: /(?:buy|get|book|purchase|reserve)\s+(?:your\s+|gala\s+)?tickets?/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /(?:buy|get|book|purchase|reserve)\s+(?:your\s+|gala\s+)?tickets?/i })).toHaveCount(0);
  // Includes hidden navigation links, even when their labels have changed.
  const salesLinks = await page.locator("a[href], form[action]").evaluateAll((elements, paths) =>
    elements.flatMap((element) => {
      const target = element.getAttribute("href") ?? element.getAttribute("action");
      if (!target) return [];
      const path = new URL(target, window.location.href).pathname.replace(/\/$/, "");
      return paths.includes(path) ? [target] : [];
    }), ticketRoutes);
  expect(salesLinks).toEqual([]);
}

async function assertNoVoteBeforeGala(page: Page) {
  await expect(page.getByText(/vote\s+before\s+(?:the\s+)?gala/i)).toHaveCount(0);
}

async function assertNoOutdatedCounts(page: Page) {
  // Match count claims, not years, dates, nominee counts or valid per-tier totals.
  const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  expect(text).not.toMatch(/\b(?:17|18)\s+(?:(?:main|award)\s+)*categories\b/i);
  expect(text).not.toMatch(/\b(?:96|135)\s+(?:award\s+)?sub[\s-]?categories\b/i);
  expect(text).not.toMatch(/\b(?:main\s+|award\s+)?categories\s*[:·–—-]?\s*(?:17|18)\b/i);
  expect(text).not.toMatch(/\bsub[\s-]?categories\s*[:·–—-]?\s*(?:96|135)\b/i);
}

async function assertNoArchivedVideo(page: Page) {
  await expect(page.getByText(/2026\s+gala\s+highlights/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /2026.*gala.*highlights/i })).toHaveCount(0);
  await expect(page.locator('iframe[title*="2026 Gala Highlights" i]')).toHaveCount(0);
}

test.describe("public cleanup regression", () => {
  test.use({ viewport: { width: 1280, height: 1800 } });

  for (const route of publicRoutes) {
    test(`${route} keeps retired public content absent`, async ({ page }) => {
      await page.goto(route);
      // A blank, loading-only or missing-page response must not pass absence checks.
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("body")).not.toContainText(/page not found|404 not found|something went wrong/i);
      await test.step("no gala ticket sales or entry points", () => assertNoTicketSales(page));
      await test.step("no Vote Before Gala", () => assertNoVoteBeforeGala(page));
      await test.step("no outdated category counts", () => assertNoOutdatedCounts(page));
      await test.step("no 2026 Gala Highlights archive", () => assertNoArchivedVideo(page));
    });
  }

  for (const route of ticketRoutes) {
    test(`${route} redirects to gala information, not checkout`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/media\/gala\/?$/);
      await expect(page.locator("h1").first()).toBeVisible();
      await assertNoTicketSales(page);
    });
  }

  test("mobile navigation has no ticket-sales entry points", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    await expect(page.locator("#mobile-nav-drawer")).toBeVisible();
    await assertNoTicketSales(page);
    await assertNoVoteBeforeGala(page);
  });
});

// Prove the absence guards actually fail when each retired item is reintroduced.
// Synthetic browser-only fixtures never change application or production data.
test.describe("regression guard sensitivity", () => {
  test.use({ viewport: { width: 1280, height: 1800 } });
  const probes = [
    { name: "ticket purchase", html: '<a href="/tickets">Buy Gala Ticket</a>', check: assertNoTicketSales },
    { name: "renamed ticket link", html: '<a href="/gala/tables">Attend</a>', check: assertNoTicketSales },
    { name: "Vote Before Gala", html: '<button>Vote Before Gala</button>', check: assertNoVoteBeforeGala },
    { name: "18 categories", html: '<p>18 Categories</p>', check: assertNoOutdatedCounts },
    { name: "17 categories", html: '<p>17 Award Categories</p>', check: assertNoOutdatedCounts },
    { name: "96 subcategories", html: '<p>96 Subcategories</p>', check: assertNoOutdatedCounts },
    { name: "135 subcategories", html: '<p>135 Subcategories</p>', check: assertNoOutdatedCounts },
    { name: "archive video", html: '<h3>NESA Africa 2026 Gala Highlights – Archive</h3>', check: assertNoArchivedVideo },
  ];
  for (const probe of probes) {
    test(`rejects reintroduced ${probe.name}`, async ({ page }) => {
      await page.goto("/");
      await page.setContent(probe.html);
      await expect(probe.check(page)).rejects.toThrow();
    });
  }
});