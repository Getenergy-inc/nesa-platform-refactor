/**
 * Zod validators for Africa Education Icon Lifetime Achievement Award
 * (2006–2026) nominations.
 *
 * Locked to the 3 audit-aligned "Icon of the Decade" categories and the
 * 3 nominee recognition types. Keep in sync with
 * src/config/nomination/iconTaxonomy.ts (single source of truth on the
 * frontend).
 */
import { z } from "zod";

export const ICON_CATEGORY_SLUGS = [
  "literary-new-curriculum-advocate-icon-of-the-decade",
  "africa-technical-educator-icon-of-the-decade",
  "africa-education-philanthropy-icon-of-the-decade",
] as const;

export const ICON_CATEGORY_NAMES = [
  "Literary & New Curriculum Advocate Icon of the Decade",
  "Africa Technical Educator Icon of the Decade",
  "Africa Education Philanthropy Icon of the Decade",
] as const;

export const ICON_NOMINEE_TYPES = [
  "Africans in Africa",
  "Diaspora Africans",
  "Friends of Africa",
] as const;

export type IconCategorySlug = (typeof ICON_CATEGORY_SLUGS)[number];
export type IconCategoryName = (typeof ICON_CATEGORY_NAMES)[number];
export type IconNomineeType = (typeof ICON_NOMINEE_TYPES)[number];

export const iconCategorySlugSchema = z.enum(ICON_CATEGORY_SLUGS);
export const iconCategoryNameSchema = z.enum(ICON_CATEGORY_NAMES);
/** Accept either the slug or the full display name for the category. */
export const iconCategorySchema = z.union([
  iconCategorySlugSchema,
  iconCategoryNameSchema,
]);

export const iconNomineeTypeSchema = z.enum(ICON_NOMINEE_TYPES);

/**
 * Payload contract for creating / submitting an Africa Education Icon
 * nomination. `pathway` is fixed to "icon" so this schema cannot be
 * misused for other award families.
 */
export const iconNominationPayloadSchema = z.object({
  pathway: z.literal("icon"),
  awardFamily: z
    .literal("Africa Education Icon Lifetime Achievement Award 2006–2026")
    .optional(),
  category: iconCategorySchema,
  nomineeType: iconNomineeTypeSchema,
  nomineeName: z.string().trim().min(2).max(200),
  country: z.string().trim().min(2).max(120),
  region: z.string().trim().min(2).max(120),
  organization: z.string().trim().max(200).optional(),
  impactSummary: z.string().trim().min(20).max(4000),
  reason: z.string().trim().min(20).max(4000),
  evidenceLinks: z.string().trim().max(4000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Declaration/consent is required" }),
  }),
});

export type IconNominationPayload = z.infer<typeof iconNominationPayloadSchema>;
