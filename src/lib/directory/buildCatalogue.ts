// ============================================================================
// Catalogue builder — organises every nominee returned by `useNominees` into
// the approved Tier → Category → Subcategory hierarchy, with live counters and
// a Migration Review Queue for records that cannot be mapped with confidence.
//
// Pure functions only. Nothing here writes to the database.
// ============================================================================

import type { EnrichedDatabaseNominee } from "@/hooks/useNominees";
import {
  CATALOGUE_TIERS,
  CATEGORY_MAP,
  MIN_MAPPING_CONFIDENCE,
  subcategoryFamilyName,
  subcategoryFamilySlug,
  type CatalogueCategoryMapping,
  type CatalogueTier,
  type CatalogueTierSlug,
} from "@/config/directory/catalogueTaxonomy";

export interface CatalogueSubcategory {
  /** Base family slug (regional permutations collapsed). */
  slug: string;
  name: string;
  count: number;
  /** Distinct database subcategory slugs folded into this family. */
  sourceSlugs: string[];
  nominees: EnrichedDatabaseNominee[];
}

export interface CatalogueCategory extends CatalogueCategoryMapping {
  name: string;
  count: number;
  subcategories: CatalogueSubcategory[];
  href: string;
}

export interface CatalogueTierNode extends CatalogueTier {
  count: number;
  categories: CatalogueCategory[];
}

export interface CatalogueReviewRow {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  subcategoryName: string;
  reason: string;
}

export interface CatalogueCounters {
  total: number;
  mapped: number;
  review: number;
  byTier: Record<string, number>;
  byCountry: Record<string, number>;
  byRegion: Record<string, number>;
  byYear: Record<string, number>;
  byVerification: Record<string, number>;
  categories: number;
  subcategories: number;
}

export interface Catalogue {
  tiers: CatalogueTierNode[];
  reviewQueue: CatalogueReviewRow[];
  counters: CatalogueCounters;
}

const bump = (map: Record<string, number>, key: string) => {
  map[key] = (map[key] ?? 0) + 1;
};

export function buildCatalogue(
  nominees: EnrichedDatabaseNominee[] | undefined,
): Catalogue {
  const list = nominees ?? [];

  const tierNodes: CatalogueTierNode[] = CATALOGUE_TIERS.map((t) => ({
    ...t,
    count: 0,
    categories: [],
  }));
  const tierIndex = new Map<CatalogueTierSlug, CatalogueTierNode>(
    tierNodes.map((t) => [t.slug, t]),
  );
  const categoryIndex = new Map<string, CatalogueCategory>();
  const reviewQueue: CatalogueReviewRow[] = [];

  const counters: CatalogueCounters = {
    total: list.length,
    mapped: 0,
    review: 0,
    byTier: {},
    byCountry: {},
    byRegion: {},
    byYear: {},
    byVerification: {},
    categories: 0,
    subcategories: 0,
  };

  const seen = new Set<string>();

  for (const n of list) {
    // Never duplicate a nominee across the catalogue.
    if (seen.has(n.id)) continue;
    seen.add(n.id);

    bump(counters.byCountry, n.country || "Unspecified");
    bump(counters.byRegion, n.region || "Unspecified");
    bump(counters.byYear, n.nominationYear ? String(n.nominationYear) : "Unspecified");
    bump(counters.byVerification, n.nrcVerified ? "Verified" : (n.status || "pending"));

    const mapping = CATEGORY_MAP[n.categorySlug];
    if (!mapping || mapping.confidence < MIN_MAPPING_CONFIDENCE) {
      counters.review += 1;
      reviewQueue.push({
        id: n.id,
        name: n.name,
        slug: n.slug,
        categorySlug: n.categorySlug,
        categoryName: n.categoryName,
        subcategoryName: n.subcategoryName,
        reason: mapping
          ? `Mapping confidence ${(mapping.confidence * 100).toFixed(0)}% is below the 90% threshold`
          : "No confirmed tier mapping for this award category",
      });
      continue;
    }

    const tier = tierIndex.get(mapping.tier)!;
    let category = categoryIndex.get(mapping.categorySlug);
    if (!category) {
      category = {
        ...mapping,
        name: mapping.displayName,
        count: 0,
        subcategories: [],
        href: `/nominees/category/${mapping.categorySlug}`,
      };
      categoryIndex.set(mapping.categorySlug, category);
      tier.categories.push(category);
    }

    const famSlug = subcategoryFamilySlug(n.subcategorySlug);
    const famName = subcategoryFamilyName(n.subcategoryName);
    let sub = category.subcategories.find((s) => s.slug === famSlug);
    if (!sub) {
      sub = { slug: famSlug, name: famName, count: 0, sourceSlugs: [], nominees: [] };
      category.subcategories.push(sub);
    }
    if (!sub.sourceSlugs.includes(n.subcategorySlug)) sub.sourceSlugs.push(n.subcategorySlug);
    sub.count += 1;
    sub.nominees.push(n);

    category.count += 1;
    tier.count += 1;
    counters.mapped += 1;
    bump(counters.byTier, tier.slug);
  }

  for (const tier of tierNodes) {
    tier.categories.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    for (const cat of tier.categories) {
      cat.subcategories.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      counters.subcategories += cat.subcategories.length;
    }
    counters.categories += tier.categories.length;
  }

  return { tiers: tierNodes, reviewQueue, counters };
}

/** Top-N entries of a counter map, sorted descending. */
export function topCounts(map: Record<string, number>, n = 12) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}
