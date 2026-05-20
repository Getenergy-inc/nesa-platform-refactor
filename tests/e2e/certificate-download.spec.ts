/**
 * Visual regression: certificate download flow.
 *
 * Covers the full /certificates/verify success state — including the QR code
 * panel and "Download QR" button — by stubbing the Supabase REST lookup so
 * the screenshot is deterministic without seeding the live database.
 *
 * Also asserts the "Download QR" click triggers a PNG download (proves the
 * QR -> canvas -> PNG pipeline still works end-to-end).
 */
import { test, expect, type Page, type Locator, type Route } from "@playwright/test";

const VERIFICATION_CODE = "NESA-REGRESSION-2025";

const FIXTURE = {
  id: "00000000-0000-0000-0000-000000000001",
  verification_code: VERIFICATION_CODE,
  tier: "gold",
  issued_at: "2025-10-15T10:00:00.000Z",
  expires_at: null,
  is_lifetime: true,
  nominees: {
    name: "Regression Test Honouree",
    title: "Founder & CEO",
    organization: "Education for All Foundation",
    subcategories: {
      name: "Best NGO Contribution to Education",
      categories: { name: "Africa Education NGO of the Year" },
    },
  },
  seasons: { name: "NESA-Africa 2025", year: 2025 },
};

async function maskVolatile(page: Page): Promise<Locator[]> {
  const selectors = [
    "[data-testid='countdown']",
    "[data-testid='customer-care-chat']",
    "[aria-label*='chat' i]",
    "iframe",
    // Issued date is rendered from a fixed fixture, but mask any
    // "Verified on …" / live timestamps the page may add.
    "text=/Verified on/i",
  ];
  return selectors.map((s) => page.locator(s));
}

/** Stub the Supabase REST GET against the `certificates` table. */
async function stubCertificateLookup(page: Page, body: typeof FIXTURE | null) {
  await page.route(/\/rest\/v1\/certificates\?.*/i, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      // .maybeSingle() with `Accept: application/vnd.pgrst.object+json` expects a single object or null
      body: body ? JSON.stringify(body) : "null",
      headers: { "content-range": "0-0/1" },
    });
  });
}

test.describe("certificate download flow", () => {
  test("verified certificate renders QR + Download QR CTA", async ({ page }) => {
    await stubCertificateLookup(page, FIXTURE);

    await page.goto(`/certificates/verify?code=${VERIFICATION_CODE}`);
    await page.waitForLoadState("networkidle");

    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    // QR canvas + Download QR button must be present.
    const qr = page.locator("#certificate-qr-code");
    await expect(qr).toBeVisible();

    const downloadBtn = page.getByRole("button", { name: /download qr/i });
    await expect(downloadBtn).toBeVisible();

    // Verification code must be rendered into the certificate body.
    await expect(main).toContainText(VERIFICATION_CODE);

    await expect(main).toHaveScreenshot("certificate-verified.png", {
      mask: await maskVolatile(page),
    });
  });

  test("Download QR triggers a PNG download", async ({ page }) => {
    await stubCertificateLookup(page, FIXTURE);

    await page.goto(`/certificates/verify?code=${VERIFICATION_CODE}`);
    await page.waitForLoadState("networkidle");

    // The page builds a data: URL via canvas.toDataURL and triggers an
    // anchor click. Patch HTMLAnchorElement.click so we can observe it
    // without depending on a real browser download dialog.
    await page.evaluate(() => {
      (window as unknown as { __dl?: { name: string; href: string } }).__dl = undefined;
      const orig = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
        if (this.download) {
          (window as unknown as { __dl?: { name: string; href: string } }).__dl = {
            name: this.download,
            href: this.href,
          };
          return;
        }
        return orig.call(this);
      };
    });

    await page.getByRole("button", { name: /download qr/i }).click();

    // Wait for our patched click to capture the download.
    await expect
      .poll(
        async () =>
          page.evaluate(
            () => (window as unknown as { __dl?: { name: string; href: string } }).__dl ?? null,
          ),
        { timeout: 5_000, message: "Download QR click did not trigger an anchor download" },
      )
      .not.toBeNull();

    const dl = await page.evaluate(
      () => (window as unknown as { __dl?: { name: string; href: string } }).__dl!,
    );
    expect(dl.name).toBe(`NESA-QR-${VERIFICATION_CODE}.png`);
    expect(dl.href.startsWith("data:image/png")).toBe(true);
  });

  test("invalid code renders not-found state", async ({ page }) => {
    await stubCertificateLookup(page, null);

    await page.goto("/certificates/verify?code=NOT-A-REAL-CODE");
    await page.waitForLoadState("networkidle");

    const main = page.locator("main").first();
    await expect(main).toBeVisible();

    await expect(main).toHaveScreenshot("certificate-not-found.png", {
      mask: await maskVolatile(page),
    });
  });
});
