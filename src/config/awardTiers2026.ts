// NESA-Africa 2026 — canonical public award framework.
// 4 tiers · 22 main categories · 90 subcategories.
// Icon pathways and Influencer categories are not counted as subcategories.

import { NOMINATION_WINDOW_LABEL } from "@/config/nominationWindows2026";

export type VoteMechanic = "verified-assessment";

export interface AwardCategoryEntry {
  id: number;
  name: string;
  subcategoryCount: number;
  subcategoryNames?: string[];
  pendingNames?: boolean;
  status: "confirmed" | "verify-2024" | "needs-platform-pull";
}

export interface AwardTier2026 {
  id: "blue-garnet" | "platinum" | "icon" | "influencers";
  tierNumber: 1 | 2 | 3 | 4;
  name: string;
  subtitle: string;
  voteMechanic: VoteMechanic;
  voteMechanicLabel: string;
  cta: string;
  ctaHref: string;
  keyDates: string;
  categories: AwardCategoryEntry[];
}

const VERIFIED = "Independent verification and assessment · No public voting";
const NOMINATIONS = `Nominations ${NOMINATION_WINDOW_LABEL}`;

export const AWARD_TIERS_2026: AwardTier2026[] = [
  {
    id: "icon",
    tierNumber: 1,
    name: "Africa Education Icon Award",
    subtitle: "Lifetime Achievement 2006–2026",
    voteMechanic: "verified-assessment",
    voteMechanicLabel: VERIFIED,
    cta: "Explore Icon Award",
    ctaHref: "/awards/africa-education-icon",
    keyDates: NOMINATIONS,
    categories: [
      { id: 17, name: "Literary & New Curriculum Advocate Icon of the Decade", subcategoryCount: 0, status: "confirmed" },
      { id: 18, name: "Africa Technical Educator Icon of the Decade", subcategoryCount: 0, status: "confirmed" },
      { id: 19, name: "Africa Education Philanthropy Icon of the Decade", subcategoryCount: 0, status: "confirmed" },
    ],
  },
  {
    id: "influencers",
    tierNumber: 2,
    name: "Influencers Education Impact Award",
    subtitle: "Verified Education Impact",
    voteMechanic: "verified-assessment",
    voteMechanicLabel: VERIFIED,
    cta: "Explore Influencer Awards",
    ctaHref: "/awards/influencer-education-impact",
    keyDates: NOMINATIONS,
    categories: [
      { id: 20, name: "African Social Media Influencers Education Impact Award", subcategoryCount: 0, status: "confirmed" },
      { id: 21, name: "African Sports Icons Supporting Education", subcategoryCount: 0, status: "confirmed" },
      { id: 22, name: "African Music Icons Supporting Education", subcategoryCount: 0, status: "confirmed" },
    ],
  },
  {
    id: "platinum",
    tierNumber: 3,
    name: "Platinum Recognition",
    subtitle: "Institutional Leadership",
    voteMechanic: "verified-assessment",
    voteMechanicLabel: VERIFIED,
    cta: "Explore Platinum Recognition",
    ctaHref: "/awards/platinum",
    keyDates: NOMINATIONS,
    categories: [
      { id: 10, name: "Best Tertiary Institution Library (Nigeria)", subcategoryCount: 8, pendingNames: true, status: "needs-platform-pull" },
      { id: 11, name: "Excellence in Research & Development for Education (Nigeria)", subcategoryCount: 3, pendingNames: true, status: "needs-platform-pull" },
      { id: 12, name: "Excellence in Christian Education Impact (Africa Regional)", subcategoryCount: 3, pendingNames: true, status: "needs-platform-pull" },
      { id: 13, name: "Excellence in Islamic Education Impact (Africa Regional)", subcategoryCount: 3, pendingNames: true, status: "needs-platform-pull" },
      { id: 14, name: "Excellence in Political Leadership for Education (Nigeria)", subcategoryCount: 3, pendingNames: true, status: "needs-platform-pull" },
      { id: 15, name: "Excellence in International Partnership for Education (Africa)", subcategoryCount: 4, pendingNames: true, status: "needs-platform-pull" },
      { id: 16, name: "Excellence in Diaspora Educational Impact (International)", subcategoryCount: 3, pendingNames: true, status: "needs-platform-pull" },
    ],
  },
  {
    id: "blue-garnet",
    tierNumber: 4,
    name: "Gold-Blue Garnet Award",
    subtitle: "Competitive Excellence",
    voteMechanic: "verified-assessment",
    voteMechanicLabel: VERIFIED,
    cta: "Explore Gold-Blue Garnet",
    ctaHref: "/awards/gold-blue-garnet",
    keyDates: NOMINATIONS,
    categories: [
      { id: 1, name: "Best CSR for Education (Africa Regional)", subcategoryCount: 6, pendingNames: true, status: "needs-platform-pull" },
      { id: 2, name: "Best CSR for Education (Nigeria)", subcategoryCount: 23, pendingNames: true, status: "needs-platform-pull" },
      { id: 3, name: "Best EduTech Innovation for Education (Africa Regional)", subcategoryCount: 3, pendingNames: true, status: "needs-platform-pull" },
      { id: 4, name: "Best Media Organisation for Education Advocacy (Nigeria)", subcategoryCount: 4, pendingNames: true, status: "needs-platform-pull" },
      {
        id: 5,
        name: "Best NGO for Education Advancement (Nigeria)",
        subcategoryCount: 5,
        status: "verify-2024",
        subcategoryNames: [
          "Best Educational Infrastructure Initiative By An NGO",
          "Exceptional Donation of Educational Materials By An NGO",
          "Outstanding Donation of Education Aid By An NGO",
          "Youth Empowerment Through Educational Services by an NGO",
          "Women and Girls' Empowerment in Education by an NGO",
        ],
      },
      { id: 6, name: "Best NGO for Education Advancement (Africa Regional)", subcategoryCount: 5, pendingNames: true, status: "needs-platform-pull" },
      { id: 7, name: "Best STEM Education Programme (Africa Regional)", subcategoryCount: 4, pendingNames: true, status: "needs-platform-pull" },
      { id: 8, name: "Best Creative Arts Contribution to Education (Nigeria)", subcategoryCount: 7, pendingNames: true, status: "needs-platform-pull" },
      { id: 9, name: "Best Education Policy & Implementation State (Nigeria)", subcategoryCount: 6, pendingNames: true, status: "needs-platform-pull" },
    ],
  },
];

export const AWARD_TIERS_TOTALS = {
  tiers: 4,
  categories: AWARD_TIERS_2026.reduce((sum, tier) => sum + tier.categories.length, 0),
  subcategories: AWARD_TIERS_2026.reduce(
    (sum, tier) => sum + tier.categories.reduce((subtotal, category) => subtotal + category.subcategoryCount, 0),
    0,
  ),
};
