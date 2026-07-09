// Shared taxonomy for the Influencer Education Impact Award 2026.
// Single source of truth for the four enum-controlled fields on the
// dedicated Influencer intake form (src/components/awards/InfluencerNominationForm.tsx):
//
//   1. medium_of_influence      — Primary Medium of Influence (pathway)
//   2. education_impact_areas   — Multi-select impact areas
//   3. impact_scale             — Geographic reach
//   4. recognition_region       — Primary recognition region
//
// The frontend form values, backend validators, and E2E tests must import
// these arrays instead of duplicating string literals.

export const INFLUENCER_MEDIUM_SLUGS = [
  "social-media",
  "sports-icons",
  "music-icons",
] as const;

export type InfluencerMediumSlug = (typeof INFLUENCER_MEDIUM_SLUGS)[number];

export const INFLUENCER_MEDIUM_LABELS = [
  "Social Media Education Champions",
  "Sports Icons Supporting Education",
  "Music Icons Supporting Education",
] as const;

export type InfluencerMediumLabel = (typeof INFLUENCER_MEDIUM_LABELS)[number];

export const INFLUENCER_IMPACT_AREAS = [
  "Scholarships",
  "School Construction",
  "Classroom Renovation",
  "Teacher Development",
  "STEM Promotion",
  "TVET Support",
  "Books & Libraries",
  "Reading Culture",
  "Digital Literacy",
  "Coding Education",
  "Educational Technology",
  "Mentorship",
  "Youth Development",
  "Career Guidance",
  "Educational Media",
  "Girls' Education",
  "Disability Inclusion",
  "Community Learning",
  "Education Campaigns",
  "Policy Advocacy",
  "Research Support",
  "Higher Education",
  "Early Childhood Education",
  "Adult Education",
  "Refugee Education",
  "Financial Support",
  "Other",
] as const;

export type InfluencerImpactArea = (typeof INFLUENCER_IMPACT_AREAS)[number];

export const INFLUENCER_IMPACT_SCALES = [
  "Community",
  "City",
  "State / Province",
  "National",
  "Multi-country",
  "Regional",
  "Continental",
  "Global",
] as const;

export type InfluencerImpactScale = (typeof INFLUENCER_IMPACT_SCALES)[number];

export const INFLUENCER_RECOGNITION_REGIONS = [
  "North Africa",
  "West Africa",
  "Central Africa",
  "East Africa",
  "Horn of Africa",
  "Southern Africa",
  "Sahel Region",
  "Indian Ocean Islands",
  "Global",
  "African Diaspora",
] as const;

export type InfluencerRecognitionRegion =
  (typeof INFLUENCER_RECOGNITION_REGIONS)[number];

export function isInfluencerMediumSlug(v: unknown): v is InfluencerMediumSlug {
  return typeof v === "string" && (INFLUENCER_MEDIUM_SLUGS as readonly string[]).includes(v);
}

export function isInfluencerMediumLabel(v: unknown): v is InfluencerMediumLabel {
  return typeof v === "string" && (INFLUENCER_MEDIUM_LABELS as readonly string[]).includes(v);
}

export function isInfluencerImpactArea(v: unknown): v is InfluencerImpactArea {
  return typeof v === "string" && (INFLUENCER_IMPACT_AREAS as readonly string[]).includes(v);
}

export function areAllInfluencerImpactAreas(v: unknown): v is InfluencerImpactArea[] {
  return Array.isArray(v) && v.length > 0 && v.every(isInfluencerImpactArea);
}

export function isInfluencerImpactScale(v: unknown): v is InfluencerImpactScale {
  return typeof v === "string" && (INFLUENCER_IMPACT_SCALES as readonly string[]).includes(v);
}

export function isInfluencerRecognitionRegion(
  v: unknown,
): v is InfluencerRecognitionRegion {
  return (
    typeof v === "string" &&
    (INFLUENCER_RECOGNITION_REGIONS as readonly string[]).includes(v)
  );
}
