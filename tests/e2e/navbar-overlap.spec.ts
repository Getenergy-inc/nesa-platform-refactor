/**
 * Navbar overlap / clickability regression tests.
 *
 * Guards the NESA-Africa top header (`src/components/navigation/MainNav.tsx`)
 * across mobile / tablet / desktop breakpoints:
 *
 *   1. The header never horizontally overflows the viewport.
 *   2. No two visible header items have overlapping bounding boxes
 *      (specifically: Nominate 2026, Vote, Become a Sponsor must never
 *      collide — they were the historical offenders).
 *   3. Every visible header item is hit-testable (the element actually
 *      under its center point is itself or one of its descendants —
 *      i.e. nothing is sitting on top blocking the click).
 *   4. At < xl widths (tablet / mobile), the desktop CTAs collapse into
 *      the "Get Involved" dropdown, which opens and exposes all three
 *      links.
 *   5. At xl widths (desktop), Nominate / Vote / Become a Sponsor are all
 *      directly visible in the header and the Get Involved dropdown is
 *      hidden.
 */
import { test, expect, type Page, type Locator } from "@playwright/test";

type Breakpoint = { name: "mobile" | "tablet" | "desktop"; width: number; height: number };

const BREAKPOINTS: Breakpoint[] = [
  { name: "mobile",  width: 390,  height: 844 },
  { name: "tablet",  width: 820,  height: 1180 },
  { name: "desktop", width: 1440, height: 900 },
];

// Tailwind's `xl` breakpoint = 1280px. Below this the header collapses the
// Nominate/Vote/Sponsor CTAs into the "Get Involved" dropdown.
const XL_BREAKPOINT = 1280;

type Box = { x: number; y: number; width: number; height: number };

function boxesOverlap(a: Box, b: Box, tolerance = 1): boolean {
  return (
    a.x + a.width  - tolerance > b.x &&
    b.x + b.width  - tolerance > a.x &&
    a.y + a.height - tolerance > b.y &&
    b.y + b.height - tolerance > a.y
  );
}

async function visibleBox(loc: Locator): Promise<Box | null> {
  if (!(await loc.isVisible().catch(() => false))) return null;
  const box = await loc.boundingBox();
  if (!box || box.width === 0 || box.height === 0) return null;
  return box;
}

async function assertHitTestable(page: Page, loc: Locator, label: string) {
  const box = await visibleBox(loc);
  if (!box) return; // not visible at this breakpoint — nothing to assert
  const handle = await loc.elementHandle();
  expect(handle, `${label}: missing element handle`).not.toBeNull();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const isOwn = await page.evaluate(
    ({ x, y, el }) => {
      const top = document.elementFromPoint(x, y);
      if (!top || !el) return false;
      return top === el || (el as Element).contains(top) || top.contains(el as Element);
    },
    { x: cx, y: cy, el: handle }
  );
  expect(isOwn, `${label} at (${cx},${cy}) is covered by another element`).toBe(true);
}

for (const bp of BREAKPOINTS) {
  test.describe(`navbar @ ${bp.name} (${bp.width}px)`, () => {
    test.use({ viewport: { width: bp.width, height: bp.height } });

    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      // Header is fixed/sticky; wait for it.
      await page.locator("header").first().waitFor({ state: "visible" });
    });

    test("header does not horizontally overflow the viewport", async ({ page }) => {
      const header = page.locator("header").first();
      const box = await header.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(bp.width + 1);

      // The whole document should not scroll horizontally either.
      const docOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(docOverflow).toBeLessThanOrEqual(1);
    });

    test("Nominate / Vote / Become a Sponsor never overlap", async ({ page }) => {
      const header = page.locator("header").first();

      // Collect every visible occurrence in the header. At ≥ xl, the
      // dedicated desktop CTAs are visible. Below xl, only the
      // "Get Involved" trigger is visible — open it so its menu items
      // are part of the layout too.
      if (bp.width < XL_BREAKPOINT) {
        const getInvolved = header.getByRole("button", { name: /get involved/i });
        await expect(getInvolved).toBeVisible();
        await getInvolved.click();
        // Radix dropdown is portaled — wait for it.
        await page.getByRole("menu").first().waitFor({ state: "visible" });
      }

      const targets: Array<{ label: string; loc: Locator }> = [
        {
          label: "Nominate 2026",
          loc: page.getByRole("link", { name: /nominate 2026/i }).first(),
        },
        {
          label: "Vote",
          loc: page.getByRole("link", { name: /^vote( for nesa)?/i }).first(),
        },
        {
          label: "Become a Sponsor",
          loc: page.getByRole("link", { name: /become a sponsor/i }).first(),
        },
      ];

      const boxes: Array<{ label: string; box: Box }> = [];
      for (const t of targets) {
        const box = await visibleBox(t.loc);
        if (box) boxes.push({ label: t.label, box });
      }

      // All three must surface somewhere on the page at every breakpoint.
      expect(boxes.map((b) => b.label).sort()).toEqual(
        ["Become a Sponsor", "Nominate 2026", "Vote"].sort()
      );

      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          expect(
            boxesOverlap(a.box, b.box),
            `${a.label} overlaps ${b.label} at ${bp.name}: ` +
              `${JSON.stringify(a.box)} vs ${JSON.stringify(b.box)}`
          ).toBe(false);
        }
      }

      // And each must be clickable (nothing covering its center).
      for (const t of targets) {
        await assertHitTestable(page, t.loc, `${t.label} @ ${bp.name}`);
      }
    });

    if (bp.width < XL_BREAKPOINT) {
      test('mobile/tablet: "Get Involved" exposes Nominate, Vote, Sponsor', async ({ page }) => {
        const header = page.locator("header").first();
        // Desktop CTAs should be hidden below xl.
        await expect(
          header.getByRole("link", { name: /^nominate 2026/i })
        ).toHaveCount(0);

        const trigger = header.getByRole("button", { name: /get involved/i });
        await expect(trigger).toBeVisible();
        await assertHitTestable(page, trigger, "Get Involved trigger");
        await trigger.click();

        const menu = page.getByRole("menu").first();
        await expect(menu).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: /nominate 2026/i })).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: /^vote/i })).toBeVisible();
        await expect(menu.getByRole("menuitem", { name: /become a sponsor/i })).toBeVisible();
      });
    } else {
      test("desktop: Nominate / Vote / Sponsor are inline in header, Get Involved hidden", async ({ page }) => {
        const header = page.locator("header").first();
        await expect(header.getByRole("link", { name: /nominate 2026/i }).first()).toBeVisible();
        await expect(header.getByRole("link", { name: /^vote/i }).first()).toBeVisible();
        await expect(header.getByRole("link", { name: /become a sponsor/i }).first()).toBeVisible();
        await expect(header.getByRole("button", { name: /get involved/i })).toHaveCount(0);
      });
    }
  });
}
