import { BLUE_GARNET_CATEGORIES } from "./blueGarnet";
import { PLATINUM_CATEGORIES } from "./platinum";
import { ICON_CATEGORY } from "./icon";
import { INFLUENCERS_CATEGORIES } from "./influencers";
import type { AwardCategoryConfig, CategoryGroup } from "./types";

export { INTEGRITY_DISCLAIMER, SPONSOR_DISCLAIMER } from "./disclaimers";
export { GROUP_META } from "./types";
export type { AwardCategoryConfig, CategoryGroup, CategoryFaq } from "./types";

export const ALL_CATEGORIES: AwardCategoryConfig[] = [
  ...BLUE_GARNET_CATEGORIES,
  ...PLATINUM_CATEGORIES,
  ICON_CATEGORY,
  ...INFLUENCERS_CATEGORIES,
];

export {
  BLUE_GARNET_CATEGORIES,
  PLATINUM_CATEGORIES,
  ICON_CATEGORY,
  INFLUENCERS_CATEGORIES,
};

export function getCategoriesByGroup(group: CategoryGroup): AwardCategoryConfig[] {
  return ALL_CATEGORIES.filter((c) => c.group === group);
}

export function getCategoryBySlug(slug: string): AwardCategoryConfig | undefined {
  return ALL_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Common legacy URL prefixes that historically pointed to a category by slug.
 * Each is auto-mapped to the category's canonical URL so old links never 404.
 */
const LEGACY_SLUG_PREFIXES = [
  "/categories",
  "/category",
  "/awards/category",
  "/awards/categories",
  "/nominees/category",
] as const;

/**
 * Build redirect map: legacy URL → canonical URL.
 * Consumed by App.tsx to register <Navigate /> entries.
 *
 * Sources:
 *  1. Explicit `mergedFrom` entries on each category config.
 *  2. Auto-generated `<prefix>/<slug>` permutations for every legacy prefix.
 *
 * Self-redirects (legacy === canonical) and duplicates are filtered out.
 */
export function buildRedirectMap(): Array<{ from: string; to: string }> {
  const seen = new Map<string, string>();
  const canonical = new Set(ALL_CATEGORIES.map((c) => c.url));

  const add = (from: string, to: string) => {
    if (!from || !to || from === to) return;
    // Never redirect away from a canonical URL
    if (canonical.has(from)) return;
    if (seen.has(from)) return;
    seen.set(from, to);
  };

  for (const c of ALL_CATEGORIES) {
    for (const from of c.mergedFrom ?? []) add(from, c.url);
    for (const prefix of LEGACY_SLUG_PREFIXES) {
      add(`${prefix}/${c.slug}`, c.url);
    }
  }

  return Array.from(seen, ([from, to]) => ({ from, to }));
}
