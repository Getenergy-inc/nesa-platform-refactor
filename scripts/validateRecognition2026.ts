// Build-time validator for the NESA-Africa 2026 recognition architecture.
// Fails if the 4-tier / 18-category / 96-subcategory contract is broken.
// Run via `bunx tsx scripts/validateRecognition2026.ts` or from a prebuild step.

import { TIERS } from "../src/config/recognition2026/tiers";
import { CATEGORIES, getCategoriesForTier } from "../src/config/recognition2026/categories";

type Result = { pass: boolean; msg: string };
const results: Result[] = [];
const expect = (cond: boolean, msg: string) => results.push({ pass: cond, msg });

// 4 tiers
expect(TIERS.length === 4, `Tier count: expected 4, got ${TIERS.length}`);

// 18 categories
expect(CATEGORIES.length === 18, `Category count: expected 18, got ${CATEGORIES.length}`);

// Per-tier category counts (subcategories total is enforced in Phase 4 when full lists land)
const perTierExpected: Record<string, { categories: number; subcategories: number }> = {
  "africa-education-icon": { categories: 1, subcategories: 3 },
  "influencer-education-impact": { categories: 1, subcategories: 3 },
  "platinum": { categories: 7, subcategories: 27 },
  "gold-blue-garnet": { categories: 9, subcategories: 63 },
};

for (const tier of TIERS) {
  const cats = getCategoriesForTier(tier.slug);
  const expected = perTierExpected[tier.slug];
  expect(
    cats.length === expected.categories,
    `Tier ${tier.slug}: expected ${expected.categories} categories, got ${cats.length}`,
  );

  // Subcategory counts are only enforced once Phase 4 populates them.
  const totalSubs = cats.reduce((n, c) => n + c.subcategories.length, 0);
  if (totalSubs > 0) {
    expect(
      totalSubs === expected.subcategories,
      `Tier ${tier.slug}: expected ${expected.subcategories} subcategories, got ${totalSubs}`,
    );
  }
}

// Unique routes
const paths = CATEGORIES.map((c) => `/recognition/${c.tier}/${c.slug}`);
expect(new Set(paths).size === paths.length, `Duplicate category routes detected`);

// Unique category codes (used in reference numbers)
const codes = CATEGORIES.map((c) => c.code);
expect(new Set(codes).size === codes.length, `Duplicate category codes detected`);

// Report
let failed = 0;
for (const r of results) {
  const tag = r.pass ? "✔" : "✘";
  // eslint-disable-next-line no-console
  console[r.pass ? "log" : "error"](`${tag} ${r.msg}`);
  if (!r.pass) failed++;
}

if (failed > 0) {
  // eslint-disable-next-line no-console
  console.error(`\nRecognition 2026 validator: ${failed} check(s) failed.`);
  process.exit(1);
} else {
  // eslint-disable-next-line no-console
  console.log(`\nRecognition 2026 validator: all ${results.length} checks passed.`);
}
