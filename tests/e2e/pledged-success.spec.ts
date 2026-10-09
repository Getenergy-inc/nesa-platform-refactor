/**
 * E2E — Rebuild My School Africa pledged-success round trip.
 *
 * Hard guards (CI-gated):
 *   1. "Pledge Support" on /eduaid-africa/rebuild-my-school links to /donate
 *      with a return_to that points back to the hub's #donate section.
 *   2. Submitting the pledge on /donate returns to the hub with
 *      ?pledged=success appended and the #donate hash preserved.
 *   3. The emerald "Pledge recorded — thank you" banner renders.
 *   4. The page scrolls to the #donate section.
 *   5. ?pledged=success is stripped from the URL after consumption
 *      (exactly once) while #donate is preserved.
 *   6. Unrelated query params (utm_source, utm_campaign, ref) survive
 *      the return-flow cleanup.
 */
import { test, expect, type Page } from "@playwright/test";

const HUB = "/eduaid-africa/rebuild-my-school";

async function isInViewport(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }, selector);
}

test.describe("Pledged-success round trip", () => {
  test("Pledge Support → /donate → return with ?pledged=success, banner, scroll, cleanup", async ({
    page,
  }) => {
    await page.goto(HUB);
    await page.waitForLoadState("networkidle");

    // 1. Find the inline pledge "Pledge Support" CTA and verify the link target.
    const pledgeCta = page.locator("#donate a", { hasText: /Pledge Support/i }).first();
    await pledgeCta.scrollIntoViewIfNeeded();
    await expect(pledgeCta).toBeVisible();

    const href = await pledgeCta.getAttribute("href");
    expect(href, "Pledge Support must link to /donate with a return_to").toBeTruthy();
    expect(href!).toContain("/donate");
    expect(href!).toContain("return_to=");
    expect(decodeURIComponent(href!)).toContain(`${HUB}#donate`);

    // 2. Click through to /donate (pledge mode).
    await pledgeCta.click();
    await page.waitForURL(/\/donate\?.*return_to=/);
    await expect(page.locator("text=/Pledge mode/i")).toBeVisible();

    // 3. Submit the pledge.
    const submit = page.getByRole("button", { name: /Submit Pledge/i });
    await expect(submit).toBeVisible();
    await submit.click();

    // 4. We must land back on the hub with ?pledged=success and #donate hash
    //    intact (window.location is the source of truth before cleanup runs).
    await page.waitForURL(new RegExp(`${HUB}.*pledged=success`));

    // 5. The emerald success banner renders.
    const banner = page.getByRole("status").filter({ hasText: /Pledge recorded/i });
    await expect(banner).toBeVisible({ timeout: 5_000 });
    await expect(banner).toHaveCount(1);

    // 6. URL cleanup: pledged=success removed, #donate preserved (exactly once).
    await expect
      .poll(async () => new URL(page.url()).searchParams.get("pledged"))
      .toBeNull();
    expect(new URL(page.url()).hash).toBe("#donate");
    expect(new URL(page.url()).pathname).toBe(HUB);

    // 7. The #donate section is scrolled into view.
    await expect.poll(async () => isInViewport(page, "#donate")).toBe(true);
  });

  test("return_to navigation respects unrelated query params (utm_source, ref)", async ({
    page,
  }) => {
    // Land on /donate directly with extra params on the return_to target.
    const returnTo = `${HUB}?utm_source=newsletter&utm_campaign=rmsa_q3&ref=email#donate`;
    await page.goto(`/donate?return_to=${encodeURIComponent(returnTo)}`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("text=/Pledge mode/i")).toBeVisible();
    await page.getByRole("button", { name: /Submit Pledge/i }).click();

    // After return, pledged=success is appended, then stripped by the hub.
    await page.waitForURL(/pledged=success/);

    const banner = page.getByRole("status").filter({ hasText: /Pledge recorded/i });
    await expect(banner).toBeVisible();

    // After cleanup: pledged gone, unrelated params kept, hash preserved.
    await expect
      .poll(async () => new URL(page.url()).searchParams.get("pledged"))
      .toBeNull();

    const u = new URL(page.url());
    expect(u.pathname).toBe(HUB);
    expect(u.hash).toBe("#donate");
    expect(u.searchParams.get("utm_source")).toBe("newsletter");
    expect(u.searchParams.get("utm_campaign")).toBe("rmsa_q3");
    expect(u.searchParams.get("ref")).toBe("email");
  });

  test("banner does not render without ?pledged=success", async ({ page }) => {
    await page.goto(HUB);
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("status").filter({ hasText: /Pledge recorded/i }),
    ).toHaveCount(0);
  });
});
