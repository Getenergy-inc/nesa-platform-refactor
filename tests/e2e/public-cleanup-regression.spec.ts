import { expect, test } from "@playwright/test";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/awards",
  "/nominees",
  "/programme-2026",
  "/media",
  "/media/tv",
  "/events",
  "/upcoming-events",
  "/partners",
  "/support",
  "/contact",
  "/eduaid-africa",
  "/rebuild-my-school",
] as const;

const RETIRED_PATTERNS = [
  /buy (?:a )?(?:gala )?tickets?/i,
  /gala tickets?/i,
  /reserve seats/i,
  /vote before gala/i,
  /2026 gala highlights\s*[–-]\s*archive/i,
  /\b(?:17|18|64)\s+(?:award\s+)?categories\b/i,
  /\b(?:54|64|143)\s+subcategories\b/i,
] as const;

for (const route of PUBLIC_ROUTES) {
  test(`${route} keeps retired sales, voting, counts and archive content absent`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    const body = await page.locator("body").innerText();
    for (const pattern of RETIRED_PATTERNS) {
      expect(body, `${route} must not contain ${pattern}`).not.toMatch(pattern);
    }
    expect(errors, `${route} must render without browser errors`).toEqual([]);
  });
}

for (const route of ["/tickets", "/buy-your-ticket", "/gala/tickets", "/events/tickets", "/media/gala"]) {
  test(`${route} resolves to the online programme`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/programme-2026$/);
    await expect(page.getByRole("heading", { name: /online awards gala/i }).first()).toBeVisible();
  });
}

test("mobile quick actions contain only Nominate and Explore Awards", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const actions = page.getByRole("navigation", { name: "Mobile quick actions" });
  await expect(actions.getByRole("link")).toHaveCount(2);
  await expect(actions.getByRole("link", { name: "Nominate", exact: true })).toHaveAttribute("href", /^https:\/\/docs\.google\.com\/forms\//);
  await expect(actions.getByRole("link", { name: "Explore Awards", exact: true })).toHaveAttribute("href", "/awards");
});

test("home exposes the five canonical Follow destinations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const expected = [
    "https://facebook.com/nesaafrica",
    "https://instagram.com/nesaafrica",
    "https://linkedin.com/company/nesa-africa",
    "https://twitter.com/nesaafrica",
    "https://www.youtube.com/@Nesa.africaTV",
  ];
  const links = page.locator('a[aria-label^="Follow NESA-Africa on"]');
  await expect(links).toHaveCount(expected.length);
  expect(await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))).toEqual(expected);
});
