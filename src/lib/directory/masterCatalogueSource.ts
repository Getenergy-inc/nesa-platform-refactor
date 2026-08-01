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
import { resolveMasterCategorySlug } from "@/lib/directory/masterCategoryRules";
import { normalizeRegion, type AfricanRegion } from "@/lib/regions";
import { enrichNomineeGeography, standardiseCountry } from "@/lib/directory/nomineeEnrichment";
import type { GeographicCategory } from "@/lib/nesaData";

export { resolveMasterCategorySlug } from "@/lib/directory/masterCategoryRules";

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

  // Derived governance fields — every nominee gets exactly one approved region
  // and one classification. Original imported values are preserved on the
  // master record itself and are never overwritten here.
  const geo = enrichNomineeGeography({
    region: n.region,
    country: n.country,
    state: n.state,
    category: n.category,
    subcategory: n.subcategory,
  });

  return {
    id: masterNomineeId(n),
    name: n.name,
    slug: n.slug,
    title: null,
    bio: n.achievement || null,
    organization: null,
    country: n.country || null,
    region: geo.region,
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
    geographicCategory: geographicFor(geo.region, n.country),
    achievement: n.achievement || "",
    nrcVerified: n.workflowStatus === "nomination_cleared",
    acceptanceStatus: null,
    awardFamily: mapping ? mapping.tier : null,
    recognitionClass: geo.classification,
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
 * Normalise a live database record onto the approved region + classification
 * vocabulary so directory filters only ever offer the ten approved regions.
 */
function normaliseDbRecord(n: EnrichedDatabaseNominee): EnrichedDatabaseNominee {
  const country = standardiseCountry(n.country);
  const geo = enrichNomineeGeography({
    region: n.region,
    country,
    category: n.categoryName,
    subcategory: n.subcategoryName,
  });
  return {
    ...n,
    country: country || null,
    region: geo.region,
    recognitionClass: n.recognitionClass ?? geo.classification,
  };
}

/**
 * Catalogue data source: database records first (they carry live verification
 * state and real media), then every master-list nominee not already present.
 */
export function useCatalogueNominees() {
  const query = useNominees();

  const data = useMemo(() => {
    const db = (query.data ?? []).map(normaliseDbRecord);
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
