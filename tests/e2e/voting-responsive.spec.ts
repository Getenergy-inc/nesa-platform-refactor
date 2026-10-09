/**
 * Responsive visual regression: voting routes across mobile / tablet / desktop.
 *
 * Catches layout regressions that only show up at specific breakpoints
 * (collapsed nav, stacked cards, mobile filter drawer, tablet 2-col grid).
 *
 * Snapshots are explicitly viewport-suffixed so all three breakpoints are
 * captured regardless of which Playwright project runs the spec.
 */
import { test, expect, type Page, type Locator } from "@playwright/test";

type Breakpoint = { name: "mobile" | "tablet" | "desktop"; width: number; height: number };

const BREAKPOINTS: Breakpoint[] = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "desktop", width: 1280, height: 800 },
];

const ROUTES: Array<{ path: string; slug: string }> = [
  { path: "/vote", slug: "vote-hub" },
  { path: "/vote/gold", slug: "vote-gold" },
  { path: "/vote/blue-garnet", slug: "vote-blue-garnet" },
];

async function maskVolatile(page: Page): Promise<Locator[]> {
  const selectors = [
    "[data-testid='countdown']",
    "[data-testid='countdown-timer']",
    "[data-testid*='countdown' i]",
    "time",
    "[data-testid='live-vote-count']",
    "[data-testid*='vote-count' i]",
    "[data-testid*='vote-total' i]",
    "[data-testid*='leaderboard' i]",
    "text=/\\d+\\s+votes?/i",
    "text=/\\d+\\s+points?/i",
    "[data-testid='customer-care-chat']",
    "[data-testid*='chat' i]",
    "[aria-label*='chat' i]",
    "[class*='intercom' i]",
    "[class*='crisp' i]",
    "iframe",
    "video",
    "canvas",
    "[data-testid='floating-particles']",
    "[data-testid='sparkle-effect']",
    "[class*='animate-pulse']",
    "[class*='animate-spin']",
    "[class*='animate-bounce']",
    "[class*='animate-ping']",
    "[role='status']",
    "[role='alert']",
    "[data-sonner-toaster]",
    "[data-testid*='toast' i]",
    "[data-testid*='carousel' i]",
    "[data-testid*='marquee' i]",
    "[data-testid*='ticker' i]",
    "[class*='marquee' i]",
  ];
  return selectors.map((s) => page.locator(s));
}

async function waitForNomineeCards(page: Page) {
  const cards = page.locator('[data-testid="nominee-card-image"]');
  if ((await cards.count()) === 0) return;

  await expect
    .poll(
      async () =>
        page.locator('[data-testid="nominee-card-image"][data-state="fallback"]').count(),
      { timeout: 10_000, message: "voting cards stuck in fallback state" },
    )
    .toBeLessThanOrEqual(0);

  await page.evaluate(async () => {
    const imgs = Array.from(
      document.querySelectorAll<HTMLImageElement>('[data-testid="nominee-card-img"]'),
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
  });
}

test.describe("voting routes — responsive", () => {
  for (const route of ROUTES) {
    for (const bp of BREAKPOINTS) {
      test(`${route.path} @ ${bp.name} (${bp.width}x${bp.height})`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.goto(route.path);
        await page.waitForLoadState("networkidle");
        await waitForNomineeCards(page);

        const main = page.locator("main").first();
        await expect(main).toBeVisible();

        await expect(page).toHaveScreenshot(`${route.slug}-${bp.name}.png`, {
          fullPage: true,
          mask: await maskVolatile(page),
        });
      });
    }
  }
});
