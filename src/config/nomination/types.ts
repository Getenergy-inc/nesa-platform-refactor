// Central types for the NESA-Africa Google Forms MVP nomination intake.
// Used by:
//   - src/config/nomination/awardCategoryForms.ts (23 award-category forms)
//   - src/config/nomination/rmsaRegionalForms.ts (8 RMSA / EduAid-Africa regional school forms)
//   - src/pages/NominateFlow.tsx (Google Forms intake at /nominate)
//   - src/pages/impact/NominateSchool.tsx (intake at /impact/nominate-school)
//
// SECURITY: No Gmail passwords, OAuth tokens, or recovery credentials are
// stored here or anywhere in this repository. Form URLs are public.

export type FormStatus =
  | "Active"
  | "Draft"
  | "Coming Soon"
  | "Link Pending"
  | "Closed"
  | "Replaced";

export type AwardFamilyId =
  | "africa-education-icon"
  | "gold-blue-garnet"
  | "platinum"
  | "influencer";

/**
 * Long-form award family names exactly as printed in the 54-Form Audit
 * (`nesa_54_forms_audit_v1.{md,csv}`). These power the `awardFamily` filter
 * on `/nominees`, certificates, and the public award-family chip.
 */
export type AwardFamilyName =
  | "Influencer Education Impact Award 2026"
  | "Africa Education Icon Lifetime Achievement Award 2006–2026"
  | "Gold-Blue Garnet — Competitive Excellence"
  | "Platinum / Institutional Leadership"
  | "Rebuild My School Africa / EduAid-Africa";

/**
 * Recognition class — drives the eligibility chip shown on the form intro
 * and the `recognitionClass` filter on `/nominees`.
 */
export type RecognitionClass =
  | "Africa-Resident"
  | "Diaspora"
  | "Friend of Africa"
  | "Africa-Resident / Diaspora"
  | "Africa-Resident / Diaspora / Friend of Africa"
  | "Institutional"
  | "School";

export interface AwardFamilyMeta {
  id: AwardFamilyId;
  /** Short family name (legacy / nav chips). */
  name: string;
  /** Long audit-aligned name; used for filtering and certificates. */
  longName: AwardFamilyName;
  tagline: string;
  description: string;
}


export interface NominationSubcategory {
  slug: string;
  name: string;
  description?: string;
  /** Optional dedicated form URL; if omitted, parent category form is used. */
  formPublicUrl?: string;
  formEmbedUrl?: string;
  status?: FormStatus;
}

export interface AwardCategoryRegion {
  /** kebab-case region slug (e.g. "west-africa") — alias of `regionSlug`. */
  slug: string;
  /** Explicit first-class region slug, matches `slug`. Used by /nominees filter. */
  regionSlug: string;
  /** Display region name (e.g. "West Africa") */
  name: string;
  /** Countries shown in this region's country dropdown */
  countries: string[];
  /** Region-scoped subcategories (already suffixed with " — <Region>") */
  subcategories: NominationSubcategory[];
  /** Region-specific Google Form public URL */
  formPublicUrl: string;
  /** Region-specific Google Form embed URL */
  formEmbedUrl: string;
  /** Region-specific Google Sheet title */
  sheetTitle: string;
  /** Region-specific lifecycle status */
  status: FormStatus;
}


export interface AwardCategoryForm {
  /** kebab-case slug used in ?category= query */
  slug: string;
  /** Final canonical category name */
  name: string;
  /** Award family bucket */
  family: AwardFamilyId;
  /** Short label for the group/track shown above the title */
  group: string;
  /** Gmail inbox that owns the Google Form (display only — credentials kept off-platform) */
  gmail: string;
  /** Public viewform URL (https://docs.google.com/forms/d/e/…/viewform) */
  formPublicUrl: string;
  /** Embed URL (https://docs.google.com/forms/d/e/…/viewform?embedded=true) */
  formEmbedUrl: string;
  /** Display name of the linked Google Sheet */
  sheetTitle: string;
  /** Lifecycle status — drives the display logic in NominateFlow */
  status: FormStatus;
  /** ISO date of last metadata change */
  lastUpdated: string;
  /** Assigned NESA-Africa reviewer (display only) */
  assignedReviewer?: string;
  /** Assigned NESA-Africa data lead (display only) */
  assignedDataLead?: string;
  /** Short marketing description shown on the selector card */
  shortDescription?: string;
  /** Subcategory list shown after a category is selected */
  subcategories: NominationSubcategory[];
  /** Internal notes (not rendered publicly) */
  notes?: string;
  /**
   * Africa Regional categories split into one form per region.
   * When true, `regions` is the source of truth for subcategories,
   * country dropdowns, and Google Form URLs per region. The top-level
   * `subcategories` / `formPublicUrl` fields remain as fallbacks only.
   */
  isRegionalCategory?: boolean;
  /** Per-region form variants (only set when isRegionalCategory === true). */
  regions?: AwardCategoryRegion[];
  /**
   * Nigeria-zonal categories — single national form scoped by Nigeria's 6
   * geopolitical zones and 36 states + FCT. When true, the nomination flow
   * must ask the nominator to pick a zone, then a state, before the form
   * is shown. Used by "Excellence in Political Leadership for Education —
   * Nigeria".
   */
  isNigeriaZonalCategory?: boolean;
  /** Political leadership role dropdown (Nigeria zonal categories). */
  leadershipRoles?: string[];
  /**
   * Long audit-aligned award family name (see `AwardFamilyName`).
   * First-class field that powers the `awardFamily` filter on /nominees.
   */
  awardFamilyName?: AwardFamilyName;
  /**
   * Recognition class chip — first-class. Drives `recognitionClass` filter
   * on /nominees and the eligibility banner on the form intro.
   */
  recognitionClass?: RecognitionClass;
  /**
   * First-class region slug — only set when the form is scoped to a single
   * region (Nigeria-only forms leave this blank; regional categories carry
   * one regionSlug per entry in `regions[]`).
   */
  regionSlug?: string;
  /**
   * Nigeria geopolitical zone slug — populated downstream when a nomination
   * targets a specific zone (e.g. "south-west").
   */
  zoneSlug?: string;
  /**
   * Nigeria state slug — populated downstream when a nomination targets a
   * specific state (e.g. "lagos").
   */
  stateSlug?: string;
}


export interface RmsaRegionalForm {
  /** kebab-case slug used in ?region= query */
  slug: string;
  /** Display region name */
  region: string;
  gmail: string;
  formPublicUrl: string;
  formEmbedUrl: string;
  sheetTitle: string;
  status: FormStatus;
  lastUpdated: string;
  assignedReviewer?: string;
  assignedDataLead?: string;
  shortDescription?: string;
  notes?: string;
}

export const AWARD_FAMILIES: AwardFamilyMeta[] = [
  {
    id: "africa-education-icon",
    name: "Africa Education Icon",
    tagline: "Lifetime Impact Recognition",
    description:
      "Hall-of-fame lifetime recognition for two decades of measurable continental education impact (2006–2026).",
  },
  {
    id: "gold-blue-garnet",
    name: "Gold-Blue Garnet Categories",
    tagline: "Competitive Excellence Recognition",
    description:
      "Competitive, voting-enabled awards across NGO, CSR, EduTech, STEM, Media, Creative Arts and State leadership.",
  },
  {
    id: "platinum",
    name: "Platinum Recognition",
    tagline: "Institutional Impact Recognition",
    description:
      "Elite institutional recognition decided by jury review — no public vote.",
  },
  {
    id: "influencer",
    name: "Influencer Education Impact",
    tagline: "Creators Advancing Education",
    description:
      "Sports, music, and social media voices using their platforms to advance African education.",
  },
];
