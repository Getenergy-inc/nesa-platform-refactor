/**
 * Visual regression: voting UI + certificate verification page.
 *
 * Catches:
 *   - Layout regressions on /vote (nominee voting cards, filters, CTA)
 *   - Fallback-image regressions on voting nominee cards
 *   - Layout regressions on /certificates/verify (search form, QR section)
 *
 * Nominee image components on /vote are waited on using the same
 * `data-testid="nominee-card-image"` + `data-state="resolved"` contract
 * used by the directory tests.
 */
import { test, expect, type Page, type Locator } from "@playwright/test";

async function maskVolatile(page: Page): Promise<Locator[]> {
  const selectors = [
    "[data-testid='countdown']",
    "[data-testid='live-vote-count']",
    "[data-testid='customer-care-chat']",
    "[aria-label*='chat' i]",
    "iframe",
    // Live vote totals on cards
    "text=/\\d+\\s+votes?/i",
  ];
  return selectors.map((s) => page.locator(s));
}

async function waitForNomineeCards(page: Page) {
  // If voting cards render, wait for at least one resolved image.
  const cards = page.locator('[data-testid="nominee-card-image"]');
  const count = await cards.count();
  if (count === 0) return; // empty/loading state — still snapshot the chrome

  await expect
    .poll(
      async () => page.locator('[data-testid="nominee-card-image"][data-state="fallback"]').count(),
      { timeout: 10_000, message: "voting cards stuck in fallback state" },
    )
    .toBeLessThanOrEqual(0);

  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('[data-testid="nominee-card-img"]'));
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

test.describe("voting UI", () => {
  test("/vote renders voting hub layout + nominee cards", async ({ page }) => {
    await page.goto("/vote");
    await page.waitForLoadState("networkidle");
    await waitForNomineeCards(page);

    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    await expect(main).toHaveScreenshot("vote-hub.png", {
      mask: await maskVolatile(page),
    });
  });

  test("/vote/gold renders gold voting layout", async ({ page }) => {
    await page.goto("/vote/gold");
    await page.waitForLoadState("networkidle");
    await waitForNomineeCards(page);

    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    await expect(main).toHaveScreenshot("vote-gold.png", {
      mask: await maskVolatile(page),
    });
  });

  test("/vote/blue-garnet renders blue garnet finalist layout", async ({ page }) => {
    await page.goto("/vote/blue-garnet");
    await page.waitForLoadState("networkidle");
    await waitForNomineeCards(page);

    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    await expect(main).toHaveScreenshot("vote-blue-garnet.png", {
      mask: await maskVolatile(page),
    });
  });
});

test.describe("certificate verification", () => {
  test("/certificates/verify renders lookup form + QR help section", async ({ page }) => {
    await page.goto("/certificates/verify");
    await page.waitForLoadState("networkidle");

    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    // The verification code input must be present (catches layout regressions).
    const input = page.locator('input[type="text"], input[placeholder*="code" i]').first();
    await expect(input).toBeVisible();

    await expect(main).toHaveScreenshot("certificates-verify-empty.png", {
      mask: await maskVolatile(page),
    });
  });

  test("/verify/:hash renders certificate not-found state for unknown hash", async ({ page }) => {
    // Use a deterministic invalid hash so we screenshot the not-found UI.
    await page.goto("/verify/regression-test-invalid-hash");
    await page.waitForLoadState("networkidle");

    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    await expect(main).toHaveScreenshot("verify-not-found.png", {
      mask: await maskVolatile(page),
    });
  });
});
