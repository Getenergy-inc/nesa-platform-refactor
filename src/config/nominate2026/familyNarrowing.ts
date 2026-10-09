// familyNarrowing.ts — bridges the public "recognition family" vocabulary
// (src/config/brandHierarchy.ts, used by /nominate/help-me-choose) onto the
// 18 canonical nomination forms (src/config/nominate2026/forms.ts).
//
// Purely additive: when /nominate is loaded WITHOUT a `family` query param,
// nothing here is used and the hub renders the full 18-form list unchanged.

import {
  getRecognitionFamily,
  getFamilyCategories,
  type RecognitionFamily,
} from "@/config/brandHierarchy";
import {
  NOMINATION_FORMS,
  type NominationFormMeta,
  type NomineeAudience,
} from "@/config/nominate2026/forms";

/** Sentinel used by the "still not sure" path in Help Me Choose. */
export const UNASSIGNED_FAMILY = "unassigned";

/**
 * Authoritative category slug (recognition2026) → nomination form category id.
 * The two registries use different slug conventions for the same categories.
 */
export const CATEGORY_SLUG_TO_FORM_CATEGORY: Record<string, string> = {
  "africa-education-icon-award": "africa-education-icon",
  "influencer-education-impact-award": "influencer-education-impact",
  "best-tertiary-institution-library": "tertiary-institution-library",
  "research-development-education": "research-development",
  "christian-education-impact": "christian-education-impact",
  "islamic-education-impact": "islamic-education-impact",
  "political-leadership-education": "political-leadership",
  "international-partnership-education": "international-partnership",
  "diaspora-educational-impact": "diaspora-education-impact",
  "best-csr-education-africa": "africa-regional-csr",
  "best-csr-education-nigeria": "nigeria-csr",
  "best-edtech-innovation-africa": "africa-edutech",
  "best-media-education-advocacy-nigeria": "nigeria-media",
  "best-ngo-education-nigeria": "nigeria-ngo",
  "best-ngo-education-africa": "africa-regional-ngo",
  "best-stem-education-programme-africa": "africa-stem",
  "best-creative-arts-education-nigeria": "nigeria-creative-arts",
  "best-education-policy-state-nigeria": "nigeria-education-friendly-states",
};

export interface FamilyNarrowing {
  /** Resolved public family (undefined for `unassigned` / unknown values). */
  family?: RecognitionFamily;
  /** True when the visitor explicitly asked NESA-Africa to classify. */
  unassigned: boolean;
  /** Forms belonging to this family — empty when no narrowing applies. */
  forms: NominationFormMeta[];
  /** Public category names in the family, for the confirmation banner. */
  categoryNames: string[];
}

/**
 * Resolve the `family` query param into a narrowed set of nomination forms.
 * Returns `null` when there is nothing to narrow (no param, unknown family
 * with no matching forms) so callers can fall back to the default behaviour.
 */
export function resolveFamilyNarrowing(
  familyParam: string | null | undefined,
): FamilyNarrowing | null {
  if (!familyParam) return null;
  const slug = familyParam.trim().toLowerCase();
  if (!slug) return null;

  if (slug === UNASSIGNED_FAMILY) {
    return { unassigned: true, forms: [], categoryNames: [] };
  }

  const family = getRecognitionFamily(slug);
  if (!family) return null;

  const categories = getFamilyCategories(family);
  const formCategoryIds = new Set(
    categories
      .map((c) => CATEGORY_SLUG_TO_FORM_CATEGORY[c.slug])
      .filter((v): v is string => Boolean(v)),
  );
  const forms = NOMINATION_FORMS.filter((f) => formCategoryIds.has(f.category));
  if (forms.length === 0) return null;

  return {
    family,
    unassigned: false,
    forms,
    categoryNames: categories.map((c) => c.shortName ?? c.name),
  };
}

/** Public nominee-type answers → the audience taxonomy used by the forms. */
const NOMINEE_TYPE_TO_AUDIENCE: Record<string, NomineeAudience> = {
  "an individual": "individual",
  "an organisation": "organisation",
  "a school or institution": "institution",
  "a company or foundation": "organisation",
  "an ngo": "organisation",
  "a media organisation": "organisation",
  "an innovator": "organisation",
  "an influencer": "public-figure",
  "a government or public institution": "government",
  "a diaspora contributor": "individual",
  // Also accept already-normalised values (deep links, internal navigation).
  individual: "individual",
  organisation: "organisation",
  institution: "institution",
  programme: "programme",
  government: "government",
  "public-figure": "public-figure",
};

/**
 * Map a `nomineeType` query param onto a form audience. Returns null for
 * "I'm Not Sure" or anything that does not map cleanly — never blocking.
 */
export function mapNomineeTypeParam(
  value: string | null | undefined,
): NomineeAudience | null {
  if (!value) return null;
  return NOMINEE_TYPE_TO_AUDIENCE[value.trim().toLowerCase()] ?? null;
}
