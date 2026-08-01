// ============================================================================
// Master nominee → catalogue adapter
//
// The 2025 master list (`src/data/nominees-2025.ts`, 1,674 unique nominees)
// stores award categories as long human labels. The catalogue hierarchy keys
// off canonical category slugs from `catalogueTaxonomy.ts`. This module maps
// one onto the other and projects each master record into the same shape the
// catalogue builder consumes, with stable, collision-free IDs.
//
// Pure presentation layer: nothing here writes to the database.
// ============================================================================

import { useMemo } from "react";
import { getAllMasterNominees, type MasterNominee } from "@/lib/nomineeMasterData";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { CATEGORY_MAP } from "@/config/directory/catalogueTaxonomy";
import { normalizeRegion, type AfricanRegion } from "@/lib/regions";
import type { GeographicCategory } from "@/lib/nesaData";

/**
 * Master list category label (lower-cased) → canonical catalogue category slug.
 * Matching is done on a normalised prefix so truncated / year-suffixed labels
 * from the source workbook still resolve.
 */
const MASTER_CATEGORY_RULES: Array<{ test: RegExp; categorySlug: string }> = [
  { test: /africa regional companies csr/i, categorySlug: "best-csr-education-africa" },
  { test: /best csr for education in nigeria/i, categorySlug: "best-csr-education-nigeria" },
  { test: /stem education/i, categorySlug: "best-stem-education-africa" },
  { test: /edutech/i, categorySlug: "best-edutech-organisation-africa" },
  { test: /library/i, categorySlug: "best-library-tertiary-nigeria" },
  { test: /creative arts/i, categorySlug: "creative-arts-education-nigeria" },
  { test: /political leaders/i, categorySlug: "political-leaders-education-nigeria" },
  { test: /educational friendly state/i, categorySlug: "best-education-friendly-state-nigeria" },
  { test: /global education excellence/i, categorySlug: "international-bilateral-education" },
  { test: /\bngo\b/i, categorySlug: "best-ngo-education-africa" },
  { test: /christian/i, categorySlug: "christian-education-impact-africa" },
  { test: /islamic/i, categorySlug: "islamic-education-impact-africa" },
  { test: /media organization|media organisation/i, categorySlug: "best-media-educational-advocacy-nigeria" },
  { test: /diaspora/i, categorySlug: "diaspora-education-impact" },
  { test: /research and development/i, categorySlug: "best-research-development-nigeria" },
  { test: /social media influencer/i, categorySlug: "africa-social-media-influencer-education" },
  { test: /sports? influencer|sports icon/i, categorySlug: "africa-sports-influencer-education" },
  { test: /music influencer|music icon/i, categorySlug: "africa-music-influencer-education" },
  { test: /education icon/i, categorySlug: "africa-education-icon-award" },
];

/** Resolve a raw master-list category label to a canonical catalogue slug. */
export function resolveMasterCategorySlug(rawCategory: string): string | null {
  for (const rule of MASTER_CATEGORY_RULES) {
    if (rule.test.test(rawCategory)) return rule.categorySlug;
  }
  return null;
}

const REGION_TO_GEOGRAPHIC: Record<AfricanRegion, GeographicCategory> = {
  "North Africa": "north-africa",
  "West Africa": "west-africa",
  "Central Africa": "central-africa",
  "East Africa": "east-africa",
  "Southern Africa": "south-africa",
  "Sahel Region": "sahel-region" as GeographicCategory,
  "Horn of Africa": "horn-of-africa" as GeographicCategory,
  "Indian Ocean Islands": "indian-ocean-islands" as GeographicCategory,
  "African Diaspora": "diaspora",
  "Diaspora / Global Africa": "diaspora",
  "Friends of Africa": "friends-of-africa",
};

function geographicFor(region: string, country: string): GeographicCategory {
  const source = region && region !== "N/A" ? region : country;
  return REGION_TO_GEOGRAPHIC[normalizeRegion(source)] ?? "west-africa";
}

/** Stable, namespaced identity for a master record — never collides with UUIDs. */
export function masterNomineeId(n: MasterNominee): string {
  return `nesa-2025-${n.id}`;
}

/** Identity key used to dedupe master records against database records. */
export function nomineeIdentityKey(name: string, subcategory: string): string {
  const norm = (v: string) =>
    (v ?? "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
  return `${norm(name)}::${norm(subcategory)}`;
}

/** Project a master-list nominee into the catalogue's nominee shape. */
export function toCatalogueNominee(n: MasterNominee): EnrichedDatabaseNominee | null {
  const categorySlug = resolveMasterCategorySlug(n.category);
  const mapping = categorySlug ? CATEGORY_MAP[categorySlug] : undefined;

  return {
    id: masterNomineeId(n),
    name: n.name,
    slug: n.slug,
    title: null,
    bio: n.achievement || null,
    organization: null,
    country: n.country || null,
    region: n.region && n.region !== "N/A" ? n.region : null,
    photoUrl: "/images/placeholder.svg",
    imageType: "photo",
    status: n.workflowStatus === "nomination_cleared" ? "approved" : "pending",
    isPlatinum: mapping?.tier === "platinum",
    publicVotes: 0,
    subcategoryName: n.subcategory || "Uncategorized",
    subcategorySlug: n.subcategorySlug || "uncategorized",
    categoryName: mapping?.displayName ?? n.category,
    // Unmapped records intentionally keep their raw slug so they surface in the
    // Migration Review Queue rather than being silently mis-filed.
    categorySlug: categorySlug ?? n.categorySlug,
    geographicCategory: geographicFor(n.region, n.country),
    achievement: n.achievement || "",
    nrcVerified: n.workflowStatus === "nomination_cleared",
    acceptanceStatus: null,
    awardFamily: mapping ? mapping.tier : null,
    recognitionClass: n.pathway,
    nominationYear: n.nominationYear,
  };
}

/** Every master-list nominee, projected and mapped onto the catalogue taxonomy. */
export function getMasterCatalogueNominees(): EnrichedDatabaseNominee[] {
  return getAllMasterNominees()
    .map(toCatalogueNominee)
    .filter((n): n is EnrichedDatabaseNominee => n !== null);
}

/**
 * Catalogue data source: database records first (they carry live verification
 * state and real media), then every master-list nominee not already present.
 */
export function useCatalogueNominees() {
  const query = useNominees();

  const data = useMemo(() => {
    const db = query.data ?? [];
    const seen = new Set(db.map((n) => nomineeIdentityKey(n.name, n.subcategoryName)));
    const merged = [...db];
    for (const n of getMasterCatalogueNominees()) {
      const key = nomineeIdentityKey(n.name, n.subcategoryName);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(n);
    }
    return merged.sort((a, b) => a.name.localeCompare(b.name));
  }, [query.data]);

  return { ...query, data };
}
