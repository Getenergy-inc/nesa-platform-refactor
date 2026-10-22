import source from "@/content/awards2026/masterGuidance.json";
import { NIGERIA_ZONES } from "@/config/nomination/nigeriaZones";
import type { TierSlug } from "@/config/recognition2026/tiers";

const MAPPINGS = [
  ["icon-phil", "africa-education-icon", "africa-education-icon-award", "africa-education-icon"],
  ["icon-lit", "africa-education-icon", "africa-education-icon-award", "africa-education-icon"],
  ["icon-tech", "africa-education-icon", "africa-education-icon-award", "africa-education-icon"],
  ["inf-soc", "influencer-education-impact", "africa-social-media-influencer-education", "influencer-education-impact"],
  ["inf-spt", "influencer-education-impact", "africa-sports-influencer-education", "influencer-education-impact"],
  ["inf-mus", "influencer-education-impact", "africa-music-influencer-education", "influencer-education-impact"],
  ["best-tertiary-institution-library", "platinum", "best-library-tertiary-nigeria", "tertiary-institution-library"],
  ["research-development-education", "platinum", "best-research-development-nigeria", "research-development"],
  ["christian-education-impact", "platinum", "christian-education-impact-africa", "christian-education-impact"],
  ["islamic-education-impact", "platinum", "islamic-education-impact-africa", "islamic-education-impact"],
  ["political-leadership-education", "platinum", "political-leaders-education-nigeria", "political-leadership"],
  ["international-partnership-education", "platinum", "international-bilateral-education", "international-partnership"],
  ["diaspora-educational-impact", "platinum", "diaspora-education-impact", "diaspora-education-impact"],
  ["best-csr-education-africa", "gold-blue-garnet", "best-csr-education-africa", "africa-regional-csr"],
  ["best-csr-education-nigeria", "gold-blue-garnet", "best-csr-education-nigeria", "nigeria-csr"],
  ["best-edtech-innovation-africa", "gold-blue-garnet", "best-edutech-organisation-africa", "africa-edutech"],
  ["best-media-education-advocacy-nigeria", "gold-blue-garnet", "best-media-educational-advocacy-nigeria", "nigeria-media"],
  ["best-ngo-education-nigeria", "gold-blue-garnet", "best-ngo-education-nigeria", "nigeria-ngo"],
  ["best-ngo-education-africa", "gold-blue-garnet", "best-ngo-education-africa", "africa-regional-ngo"],
  ["best-stem-education-programme-africa", "gold-blue-garnet", "best-stem-education-africa", "africa-stem"],
  ["best-creative-arts-education-nigeria", "gold-blue-garnet", "creative-arts-education-nigeria", "nigeria-creative-arts"],
  ["best-education-policy-state-nigeria", "gold-blue-garnet", "best-education-friendly-state-nigeria", "nigeria-education-friendly-states"],
] as const;

export const MASTER_TIERS = source.tiers.map((tier) => ({ ...tier, slug: tier.slug as TierSlug }));
export const MASTER_AWARDS = source.awards.map((award, index) => {
  const mapping = MAPPINGS[index];
  if (!mapping) throw new Error(`Missing master award mapping: ${award.number}`);
  const [slug, tier, legacySlug, formSlug] = mapping;
  return {
    ...award, slug, tier, legacySlug, formSlug,
    href: `/recognition/subpage/${slug}`,
    nomineeHref: `/nominees?category=${legacySlug}`,
    nominationHref: tier === "africa-education-icon"
      ? `/nominate/africa-education-icon?category=${slug}`
      : tier === "influencer-education-impact"
        ? `/nominate/influencer-education-impact?award=${slug}`
        : `/nominate/${tier}/${formSlug}`,
    subcategories: award.subcategories.map((sub) => ({ ...sub, slug: `master-sub-${sub.number}`, href: `/recognition/subpage/master-sub-${sub.number}` })),
  };
});
export type MasterAward = (typeof MASTER_AWARDS)[number];
export const MASTER_COUNTS = {
  tiers: MASTER_TIERS.length,
  categories: MASTER_AWARDS.length,
  subcategories: MASTER_AWARDS.reduce((sum, award) => sum + award.subcategories.length, 0),
};
export function getMasterAwards(slug?: string) {
  if (!slug) return [];
  if (slug === "africa-education-icon-award" || slug === "africa-education-icon") return MASTER_AWARDS.filter((a) => a.tier === "africa-education-icon");
  if (slug === "influencer-education-impact-award" || slug === "influencer-education-impact") return MASTER_AWARDS.filter((a) => a.tier === "influencer-education-impact");
  return MASTER_AWARDS.filter((a) => a.slug === slug || a.legacySlug === slug || a.formSlug === slug || a.subcategories.some((s) => s.slug === slug));
}
export function getStateNomination(stateName: string) {
  for (const zone of NIGERIA_ZONES) {
    const state = zone.states.find((s) => s.name === stateName && s.slug !== "federal-capital-territory-abuja");
    if (state) return { state: state.name, zone: zone.name };
  }
  return undefined;
}
export const STATE_NOMINEES = NIGERIA_ZONES.flatMap((zone) => zone.states.filter((s) => s.slug !== "federal-capital-territory-abuja").map((state) => state.name)).sort();