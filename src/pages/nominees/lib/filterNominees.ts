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
  return next;
}

/** Count of non-default filters (drives the "Clear all" affordance). */
export function activeFilterCount(state: NomineeFilterState): number {
  const tracked: (keyof NomineeFilterState)[] = [
    "category", "country", "region", "awardFamily",
    "recognitionClass", "zone", "state", "type",
  ];
  const dropdowns = tracked.filter((k) => state[k] && state[k] !== "all").length;
  return dropdowns + (state.q.trim() ? 1 : 0);
}

export interface FilterableNominee {
  name: string;
  status?: string | null;
  categorySlug?: string | null;
  categoryName?: string | null;
  country?: string | null;
  region?: string | null;
  awardFamily?: string | null;
  recognitionClass?: string | null;
  zoneSlug?: string | null;
  stateSlug?: string | null;
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
    if (s.country !== "all" && (n.country ?? "").toLowerCase() !== s.country.toLowerCase()) return false;
    if (s.region !== "all") {
      const norm = normalizeRegion(n.region ?? "");
      const want = s.region.replace(/-africa$/, "");
      if (!norm || !norm.toLowerCase().includes(want)) return false;
    }
    if (s.awardFamily !== "all" && n.awardFamily !== s.awardFamily) return false;
    if (s.recognitionClass !== "all" && n.recognitionClass !== s.recognitionClass) return false;
    if (s.zone !== "all" && n.zoneSlug !== s.zone) return false;
    if (s.state !== "all" && n.stateSlug !== s.state) return false;
    if (q) {
      const hay = `${n.name} ${n.categoryName ?? ""} ${n.country ?? ""} ${n.region ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
