// Pure helpers powering the URL-driven /nominees filter bar (Pass D).
// Extracted so they can be unit-tested without rendering the page.

import { normalizeRegion } from "@/lib/regions";

export interface NomineeFilterState {
  q: string;
  category: string;
  subcategory: string;
  country: string;
  region: string;
  awardFamily: string;
  recognitionClass: string;
  zone: string;
  state: string;
  edition: string;
  group: string;
  type: string;
}

export const DEFAULT_FILTERS: NomineeFilterState = {
  q: "",
  category: "all",
  subcategory: "all",
  country: "all",
  region: "all",
  awardFamily: "all",
  recognitionClass: "all",
  zone: "all",
  state: "all",
  edition: "2026",
  group: "all",
  type: "all",
};

/** Parse a URLSearchParams instance into a fully-defaulted filter state. */
export function parseFilterParams(params: URLSearchParams): NomineeFilterState {
  return {
    q: params.get("q") ?? "",
    category: params.get("category") ?? "all",
    subcategory: params.get("subcategory") ?? "all",
    country: params.get("country") ?? "all",
    region: params.get("region") ?? "all",
    awardFamily: params.get("awardFamily") ?? "all",
    recognitionClass: params.get("recognitionClass") ?? "all",
    zone: params.get("zone") ?? "all",
    state: params.get("state") ?? "all",
    edition: params.get("edition") ?? "2026",
    group: params.get("group") ?? "all",
    type: params.get("type") ?? "all",
  };
}

/**
 * Apply a single key/value change with the same cascade rules used by the
 * NomineesHubPage setter (default values are stripped; switching country
 * away from Nigeria clears zone/state; clearing zone clears state).
 */
export function applyFilterChange(
  current: URLSearchParams,
  key: string,
  value: string,
): URLSearchParams {
  const next = new URLSearchParams(current);
  const isDefault =
    !value ||
    value === "all" ||
    (key === "edition" && value === "2026") ||
    (key === "group" && value === "all");
  if (isDefault) {
    next.delete(key);
  } else {
    next.set(key, value);
  }
  if (key === "country" && value.toLowerCase() !== "nigeria") {
    next.delete("zone");
    next.delete("state");
  }
  if (key === "zone" && value === "all") {
    next.delete("state");
  }
  // Changing category invalidates any active subcategory choice.
  if (key === "category") {
    next.delete("subcategory");
  }
  return next;
}

/** Count of non-default filters (drives the "Clear all" affordance). */
export function activeFilterCount(state: NomineeFilterState): number {
  const tracked: (keyof NomineeFilterState)[] = [
    "category", "subcategory", "country", "region", "awardFamily",
    "recognitionClass", "zone", "state", "type", "group",
  ];
  const dropdowns = tracked.filter((k) => state[k] && state[k] !== "all").length;
  return dropdowns + (state.q.trim() ? 1 : 0);
}

export interface FilterableNominee {
  name: string;
  status?: string | null;
  categorySlug?: string | null;
  categoryName?: string | null;
  subcategorySlug?: string | null;
  country?: string | null;
  region?: string | null;
  organization?: string | null;
  awardFamily?: string | null;
  recognitionClass?: string | null;
  zoneSlug?: string | null;
  stateSlug?: string | null;
}

export type RecognitionClassSlug =
  | "africa-resident"
  | "diaspora"
  | "friend-of-africa"
  | "institutional"
  | "school";

/**
 * Derive a recognition class for any nominee using whatever signals exist
 * on the row (region, category, organization). Lets every one of the
 * 2,500+ legacy nominees fall cleanly into one of the 5 NESA-Africa
 * recognition classes without requiring a DB backfill.
 */
export function deriveRecognitionClass(n: FilterableNominee): RecognitionClassSlug {
  const cat = (n.categorySlug ?? "").toLowerCase();
  const catName = (n.categoryName ?? "").toLowerCase();
  const region = (n.region ?? "").toLowerCase();
  const org = (n.organization ?? "").toLowerCase();

  if (cat.includes("school") || catName.includes("school") || cat.includes("rebuild")) return "school";
  if (region.includes("diaspora") || cat.includes("diaspora") || catName.includes("diaspora")) return "diaspora";
  if (
    region.includes("friend") ||
    cat.includes("international") ||
    cat.includes("bilateral") ||
    catName.includes("friend of africa") ||
    catName.includes("friends of africa")
  ) {
    return "friend-of-africa";
  }
  if (
    cat.includes("ngo") ||
    cat.includes("csr") ||
    cat.includes("edutech") ||
    cat.includes("institution") ||
    cat.includes("library") ||
    cat.includes("research") ||
    cat.includes("media") ||
    /(foundation|institute|university|academy|college|school|ltd|inc|llc|trust|society|association|ngo)/.test(org)
  ) {
    return "institutional";
  }
  return "africa-resident";
}

/** Derive a Gold/Platinum/Icon/Influencer/RMSA award-family bucket. */
export function deriveAwardFamily(n: FilterableNominee): string {
  const c = (n.categorySlug ?? "").toLowerCase();
  const cn = (n.categoryName ?? "").toLowerCase();
  if (c.includes("icon") || cn.includes("icon") || cn.includes("lifetime")) return "icon";
  if (c.includes("influenc") || c.includes("social-media") || cn.includes("influencer")) return "influencer";
  if (cn.includes("platinum") || c.includes("political") || c.includes("state") || c.includes("bilateral")) return "platinum";
  if (c.includes("rebuild") || c.includes("rmsa") || cn.includes("rebuild my school")) return "rmsa";
  return "gold-bluegarnet";
}

/** Predicate for the Nominee-Group chip row on /nominees. */
export function matchesGroup(
  n: FilterableNominee,
  groupId: string,
  rc: RecognitionClassSlug,
): boolean {
  if (!groupId || groupId === "all") return true;
  const cat = (n.categorySlug ?? "").toLowerCase();
  const catName = (n.categoryName ?? "").toLowerCase();
  const region = (n.region ?? "").toLowerCase();
  switch (groupId) {
    case "africans-in-africa":
      return rc === "africa-resident" || rc === "institutional" || rc === "school";
    case "africans-in-diaspora":
      return rc === "diaspora";
    case "friends-of-africa":
      return rc === "friend-of-africa";
    case "africa-regional":
      return !!region && !region.includes("diaspora") && !region.includes("friend");
    case "lifetime-icons":
      return cat.includes("icon") || catName.includes("icon") || catName.includes("lifetime");
    case "ngos-institutions":
      return rc === "institutional";
    case "youth-innovation":
      return cat.includes("stem") || catName.includes("youth") || catName.includes("innovation") || cat.includes("edutech");
    default:
      return true;
  }
}

/** Pure filter — used by the page and unit-tested in isolation. */
export function filterNominees<T extends FilterableNominee>(
  rows: T[],
  s: NomineeFilterState,
): T[] {
  const valid = rows.filter(
    (n) => n.status === "approved" || n.status === "platinum" || n.status === "pending",
  );
  const q = s.q.trim().toLowerCase();
  return valid.filter((n) => {
    if (s.category !== "all" && n.categorySlug !== s.category) return false;
    if (s.subcategory !== "all" && n.subcategorySlug !== s.subcategory) return false;
    if (s.country !== "all" && (n.country ?? "").toLowerCase() !== s.country.toLowerCase()) return false;
    if (s.region !== "all") {
      const norm = normalizeRegion(n.region ?? "");
      const want = s.region.replace(/-africa$/, "");
      if (!norm || !norm.toLowerCase().includes(want)) return false;
    }
    const derivedFamily = n.awardFamily ?? deriveAwardFamily(n);
    const derivedClass = (n.recognitionClass as RecognitionClassSlug | null) ?? deriveRecognitionClass(n);
    if (s.awardFamily !== "all" && derivedFamily !== s.awardFamily) return false;
    if (s.recognitionClass !== "all" && derivedClass !== s.recognitionClass) return false;
    if (s.group !== "all" && !matchesGroup(n, s.group, derivedClass)) return false;
    if (s.zone !== "all" && n.zoneSlug !== s.zone) return false;
    if (s.state !== "all" && n.stateSlug !== s.state) return false;
    if (q) {
      const hay = `${n.name} ${n.categoryName ?? ""} ${n.country ?? ""} ${n.region ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
