// Special Needs School intervention slots — config-driven
// 8 approved African regions × 20 nomination/intervention slots = 160 total.
// Country distribution rotates across the region's country list so every
// country gets at least one slot whenever possible.

import { REGION_HUBS } from "./regionHubs";

export type SchoolSlotStatus =
  | "Open for Nomination"
  | "Under Verification"
  | "Verified for Regional Voting"
  | "Open for Regional Intervention Voting"
  | "Selected for Intervention"
  | "Fundraising Active"
  | "Project in Progress"
  | "Intervention Completed"
  | "Impact Report Published";

export interface SchoolInterventionSlot {
  slotNumber: number;
  schoolName: string;
  country: string;
  status: SchoolSlotStatus;
  supportFocus: string[];
  cta: string;
}

export interface RegionalInterventionConfig {
  slug: string;
  regionName: string;
  countries: string[];
  schoolSlots: SchoolInterventionSlot[];
  gfaWzipPortal: string;
  eduTourism2027Link: string;
  donationLink: string;
  votingLink: string;
  nominateLink: string;
}

// Approved 8 African regions (excludes Diaspora and Friends of Africa).
const APPROVED_REGION_SLUGS = [
  "north-africa",
  "west-africa",
  "central-africa",
  "east-africa",
  "southern-africa",
  "sahel",
  "horn-of-africa",
  "indian-ocean-islands",
] as const;

const DEFAULT_SUPPORT_FOCUS = [
  "Accessibility",
  "Learning Materials",
  "Teacher Support",
];

const SLOTS_PER_REGION = 20;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function buildSlots(regionName: string, countries: string[]): SchoolInterventionSlot[] {
  const list = countries.length > 0 ? countries : ["Africa"];
  return Array.from({ length: SLOTS_PER_REGION }, (_, i) => {
    const slotNumber = i + 1;
    return {
      slotNumber,
      schoolName: `Special Needs School Nomination Slot ${pad(slotNumber)} — ${regionName}`,
      country: list[i % list.length],
      status: "Open for Nomination" as SchoolSlotStatus,
      supportFocus: DEFAULT_SUPPORT_FOCUS,
      cta: "Nominate School",
    };
  });
}

export const REGIONAL_INTERVENTIONS: RegionalInterventionConfig[] =
  APPROVED_REGION_SLUGS.map((slug) => {
    const hub = REGION_HUBS.find((r) => r.slug === slug)!;
    return {
      slug: hub.slug,
      regionName: hub.name,
      countries: hub.countries,
      schoolSlots: buildSlots(hub.name, hub.countries),
      gfaWzipPortal: `/gfa-wzip/${hub.slug}`,
      eduTourism2027Link: `/eduaid-africa/edutourism-2027/${hub.slug}`,
      donationLink: `/donate?region=${hub.slug}`,
      votingLink: `/vote/regional-intervention/${hub.slug}`,
      nominateLink: `/nominate?type=school&region=${hub.slug}`,
    };
  });

export const STATUS_STYLES: Record<SchoolSlotStatus, string> = {
  "Open for Nomination": "bg-gold/15 text-gold border-gold/40",
  "Under Verification": "bg-white/10 text-white/80 border-white/20",
  "Verified for Regional Voting": "bg-blue-500/15 text-blue-300 border-blue-400/30",
  "Open for Regional Intervention Voting": "bg-blue-500/15 text-blue-300 border-blue-400/30",
  "Selected for Intervention": "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  "Fundraising Active": "bg-amber-500/15 text-amber-200 border-amber-400/30",
  "Project in Progress": "bg-purple-500/15 text-purple-200 border-purple-400/30",
  "Intervention Completed": "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  "Impact Report Published": "bg-emerald-500/25 text-emerald-100 border-emerald-400/50",
};

export const TOTAL_REGIONS = REGIONAL_INTERVENTIONS.length;
export const TOTAL_SLOTS = TOTAL_REGIONS * SLOTS_PER_REGION;
