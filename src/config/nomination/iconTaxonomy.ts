// Shared taxonomy for the Africa Education Icon Lifetime Achievement Award
// (2006–2026). This is the single source of truth used by:
//   - src/components/nominate/NomineeEntryForm.tsx (frontend form)
//   - backend/src/schemas/iconNomination.ts (Zod validator)
//   - any admin/reporting surface that classifies icon nominations.
//
// Keep these three categories and three nominee types in lock-step across
// frontend + backend. Changes must be reflected in both places.

export const ICON_CATEGORY_SLUGS = [
  "literary-new-curriculum-advocate-icon-of-the-decade",
  "africa-technical-educator-icon-of-the-decade",
  "africa-education-philanthropy-icon-of-the-decade",
] as const;

export type IconCategorySlug = (typeof ICON_CATEGORY_SLUGS)[number];

export const ICON_CATEGORY_NAMES = [
  "Literary & New Curriculum Advocate Icon of the Decade",
  "Africa Technical Educator Icon of the Decade",
  "Africa Education Philanthropy Icon of the Decade",
] as const;

export type IconCategoryName = (typeof ICON_CATEGORY_NAMES)[number];

export interface IconCategoryDef {
  slug: IconCategorySlug;
  name: IconCategoryName;
}

export const ICON_CATEGORIES: readonly IconCategoryDef[] = [
  {
    slug: "literary-new-curriculum-advocate-icon-of-the-decade",
    name: "Literary & New Curriculum Advocate Icon of the Decade",
  },
  {
    slug: "africa-technical-educator-icon-of-the-decade",
    name: "Africa Technical Educator Icon of the Decade",
  },
  {
    slug: "africa-education-philanthropy-icon-of-the-decade",
    name: "Africa Education Philanthropy Icon of the Decade",
  },
] as const;

export const ICON_NOMINEE_TYPE_VALUES = [
  "Africans in Africa",
  "Diaspora Africans",
  "Friends of Africa",
] as const;

export type IconNomineeType = (typeof ICON_NOMINEE_TYPE_VALUES)[number];

export interface IconNomineeTypeDef {
  value: IconNomineeType;
  label: string;
  description: string;
}

export const ICON_NOMINEE_TYPES: readonly IconNomineeTypeDef[] = [
  {
    value: "Africans in Africa",
    label: "Africans in Africa",
    description:
      "African nominees who live and work primarily within Africa, with direct education impact on the continent.",
  },
  {
    value: "Diaspora Africans",
    label: "Diaspora Africans",
    description:
      "Nominees of African origin, heritage, or identity who live and work primarily outside Africa but contribute significantly to African education.",
  },
  {
    value: "Friends of Africa",
    label: "Friends of Africa",
    description:
      "Non-African individuals, organisations, institutions, or global partners with long-term contributions to African education.",
  },
] as const;

export function isIconCategoryName(v: unknown): v is IconCategoryName {
  return typeof v === "string" && (ICON_CATEGORY_NAMES as readonly string[]).includes(v);
}

export function isIconCategorySlug(v: unknown): v is IconCategorySlug {
  return typeof v === "string" && (ICON_CATEGORY_SLUGS as readonly string[]).includes(v);
}

export function isIconNomineeType(v: unknown): v is IconNomineeType {
  return typeof v === "string" && (ICON_NOMINEE_TYPE_VALUES as readonly string[]).includes(v);
}
