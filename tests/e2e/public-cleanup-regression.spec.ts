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
  /\bPage\s+\d+\s+of\s+\d+\b/i,
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

test("mobile quick actions expose the four canonical destinations and official-form CTA", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const actions = page.getByRole("navigation", { name: "Mobile quick actions" });
  await expect(actions.getByRole("link")).toHaveCount(4);
  await expect(actions.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/");
  await expect(actions.getByRole("link", { name: "Awards", exact: true })).toHaveAttribute("href", "/categories");
  await expect(actions.getByRole("link", { name: "Nominate", exact: true })).toHaveAttribute("href", "/nominate");
  await expect(actions.getByRole("link", { name: "Support a School", exact: true })).toHaveAttribute("href", "/support-a-special-needs-school");

  await page.getByRole("button", { name: "Open navigation" }).click();
  const submit = page.getByRole("link", { name: "Submit a Nomination", exact: true });
  await expect(submit).toBeVisible();
  await expect(submit).toHaveAttribute("href", /^https:\/\/docs\.google\.com\/forms\//);
  await expect(submit).toHaveAttribute("target", "_blank");
});

test("desktop main navigation contains the seven direct public destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const primary = page.getByRole("navigation", { name: "Primary", exact: true });
  const expected = [
    ["Home", "/"],
    ["Awards", "/categories"],
    ["Nominate", "/nominate"],
    ["Recognition", "/nominees"],
    ["Online Programme", "/media/gala"],
    ["Support a School", "/support-a-special-needs-school"],
    ["About", "/about"],
  ] as const;

  await expect(primary.getByRole("link")).toHaveCount(expected.length);
  await expect(primary.getByRole("button")).toHaveCount(0);
  for (const [label, href] of expected) {
    await expect(primary.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }
  await expect(page.getByText("180+ subcategories", { exact: true })).toHaveCount(0);
});

test("footer includes NRC, programme-update and volunteer destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Join the NRC", exact: true })).toHaveAttribute("href", "/nrc/apply");
  await expect(footer.getByRole("link", { name: "Volunteer", exact: true })).toHaveAttribute("href", "/volunteer");
  await expect(footer.getByText("Receive Programme Updates — CONTENT REQUIRED", { exact: true })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveAttribute("href", "/policies#privacy");
  await expect(footer.getByRole("link", { name: "Terms", exact: true })).toHaveAttribute("href", "/policies#terms");
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
