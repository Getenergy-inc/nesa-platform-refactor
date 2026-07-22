// Server-side mirror of src/config/nominate2026/ediMatrix.ts.
//
// Purpose: gives edge functions a small, dependency-free source of truth for
// which EDI slot IDs are valid for each (tier, category, pathway) combo so we
// can strictly reject submissions whose EDI ratings do not match the resolved
// category-specific matrix.
//
// All 22 matrices currently share the same 8 canonical slot keys — keep this
// per-matrix anyway so future divergence stays enforceable.

export const EDI_MATRIX_VERSION = "v2.0-category-specific-2026";

/** Canonical, ordered set of allowed EDI slot IDs. */
export const EDI_SLOT_IDS = [
  "edi_lifetime_impact",
  "edi_scale_reach",
  "edi_inclusion_equity",
  "edi_innovation",
  "edi_sustainability",
  "edi_leadership",
  "edi_continental_relevance",
  "edi_evidence_quality",
] as const;
export type EDISlotId = typeof EDI_SLOT_IDS[number];

/** Ratings accepted by the wizard (lowercased on the server for tolerance). */
export const EDI_ALLOWED_RATINGS = new Set([
  "exceptional",
  "strong",
  "moderate",
  "emerging",
  "limited",
]);

/**
 * Every mapped (tier/category[#pathway]) key -> ordered slot IDs.
 * Mirrors the EDI_MATRICES registry.
 */
const EIGHT: readonly EDISlotId[] = EDI_SLOT_IDS;
export const EDI_MATRIX_KEYS: Record<string, readonly EDISlotId[]> = {
  // Tier 1 — Africa Education Icon
  "africa-education-icon/africa-education-icon#education-philanthropy-icon": EIGHT,
  "africa-education-icon/africa-education-icon#literary-new-curriculum-advocate": EIGHT,
  "africa-education-icon/africa-education-icon#technical-educator-icon": EIGHT,
  // Tier 2 — Influencer Education Impact
  "influencer-education-impact/influencer-education-impact#social-media": EIGHT,
  "influencer-education-impact/influencer-education-impact#sports": EIGHT,
  "influencer-education-impact/influencer-education-impact#music": EIGHT,
  // Tier 3 — Platinum
  "platinum/tertiary-institution-library": EIGHT,
  "platinum/research-development": EIGHT,
  "platinum/christian-education-impact": EIGHT,
  "platinum/islamic-education-impact": EIGHT,
  "platinum/political-leadership": EIGHT,
  "platinum/international-partnership": EIGHT,
  "platinum/diaspora-education-impact": EIGHT,
  // Tier 4 — Gold-Blue Garnet
  "gold-blue-garnet/africa-regional-csr": EIGHT,
  "gold-blue-garnet/nigeria-csr": EIGHT,
  "gold-blue-garnet/africa-edutech": EIGHT,
  "gold-blue-garnet/nigeria-media": EIGHT,
  "gold-blue-garnet/nigeria-ngo": EIGHT,
  "gold-blue-garnet/africa-regional-ngo": EIGHT,
  "gold-blue-garnet/africa-stem": EIGHT,
  "gold-blue-garnet/nigeria-creative-arts": EIGHT,
  "gold-blue-garnet/nigeria-education-friendly-states": EIGHT,
};

/** Resolve the matrix key + expected slot IDs for a submission. */
export function resolveMatrix(
  tier: string | undefined | null,
  category: string | undefined | null,
  pathway?: string | null,
): { key: string; indicators: readonly EDISlotId[] } | null {
  if (!tier || !category) return null;
  if (pathway) {
    const k = `${tier}/${category}#${pathway}`;
    const ind = EDI_MATRIX_KEYS[k];
    if (ind) return { key: k, indicators: ind };
  }
  const k = `${tier}/${category}`;
  const ind = EDI_MATRIX_KEYS[k];
  if (ind) return { key: k, indicators: ind };
  return null;
}

export type EDIRatingsInput = Record<string, unknown>;

export interface EDIValidationOk {
  ok: true;
  matrixKey: string;
  matrixVersion: string;
  ratings: Record<EDISlotId, string>;
}
export interface EDIValidationErr {
  ok: false;
  error: string;
}

/**
 * Strictly validate that submitted EDI ratings match the resolved matrix:
 *   - (tier, category, pathway?) must resolve to a known matrix
 *   - every expected slot ID must be present with a non-empty string value
 *   - no extra keys allowed (rejects renamed / off-matrix slots)
 *   - values must be one of EDI_ALLOWED_RATINGS (case-insensitive, trimmed)
 *   - if a client version is provided, it must equal EDI_MATRIX_VERSION
 */
export function validateEDIRatings(input: {
  tier?: string | null;
  category?: string | null;
  pathway?: string | null;
  version?: string | null;
  ratings: EDIRatingsInput | null | undefined;
}): EDIValidationOk | EDIValidationErr {
  const resolved = resolveMatrix(input.tier, input.category, input.pathway);
  if (!resolved) {
    return {
      ok: false,
      error: `Unknown EDI matrix for tier="${input.tier}" category="${input.category}" pathway="${input.pathway ?? ""}".`,
    };
  }
  if (input.version && input.version !== EDI_MATRIX_VERSION) {
    return {
      ok: false,
      error: `EDI matrix version mismatch: client sent "${input.version}", server expects "${EDI_MATRIX_VERSION}". Refresh the form and resubmit.`,
    };
  }
  if (!input.ratings || typeof input.ratings !== "object" || Array.isArray(input.ratings)) {
    return { ok: false, error: "EDI ratings payload is missing or malformed." };
  }

  const expected = new Set(resolved.indicators);
  const submittedKeys = Object.keys(input.ratings);

  // Reject extra / unknown keys — this is what makes the check truly
  // "category-specific": you cannot ship ratings for slots that do not
  // belong to the resolved matrix.
  const extras = submittedKeys.filter((k) => !expected.has(k as EDISlotId));
  if (extras.length > 0) {
    return {
      ok: false,
      error: `EDI ratings contain slots that are not part of the "${resolved.key}" matrix: ${extras.join(", ")}.`,
    };
  }

  const cleaned = {} as Record<EDISlotId, string>;
  for (const slot of resolved.indicators) {
    const raw = (input.ratings as Record<string, unknown>)[slot];
    if (typeof raw !== "string") {
      return { ok: false, error: `EDI rating for "${slot}" is required.` };
    }
    const norm = raw.trim().toLowerCase();
    if (!norm) return { ok: false, error: `EDI rating for "${slot}" is required.` };
    if (!EDI_ALLOWED_RATINGS.has(norm)) {
      return {
        ok: false,
        error: `EDI rating for "${slot}" must be one of: ${[...EDI_ALLOWED_RATINGS].join(", ")}.`,
      };
    }
    cleaned[slot] = norm;
  }

  return { ok: true, matrixKey: resolved.key, matrixVersion: EDI_MATRIX_VERSION, ratings: cleaned };
}
