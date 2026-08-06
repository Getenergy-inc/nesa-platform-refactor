// NESA-Africa 2026 — Canonical Award Tiers
// 4 tiers · 18 categories · 96 subcategories
// Source of truth for the public landing Award Tiers Summary section.

export type VoteMechanic =
  | "60-40-hybrid"
  | "jury-only"
  | "public-agc-only";

export interface AwardCategoryEntry {
  id: number; // 1..18
  name: string;
  subcategoryCount: number;
  /** Optional inline subcategory names — only populated when confirmed. */
  subcategoryNames?: string[];
  /** When true, names are still being pulled from CategoryMasterIndex / admin CMS. */
  pendingNames?: boolean;
  /** Internal status flag for the brief's completion tracker. */
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

export const AWARD_TIERS_2026: AwardTier2026[] = [
  {
    id: "blue-garnet",
    tierNumber: 1,
    name: "Blue Garnet Award",
    subtitle: "Competitive Excellence",
    voteMechanic: "60-40-hybrid",
    voteMechanicLabel: "60% Jury + 40% Public AGC Voting Coin",
    cta: "Nominate / Vote",
    ctaHref: "/awards/blue-garnet",
    keyDates: "Voting 16 Sep – 13 Dec 2026 · Gala 13 Dec 2026, Lagos",
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
  {
    id: "platinum",
    tierNumber: 2,
    name: "Platinum Award",
    subtitle: "Institutional Leadership",
    voteMechanic: "jury-only",
    voteMechanicLabel: "Jury recognition only · No public vote",
    cta: "Recommend Again",
    ctaHref: "/awards/platinum",
    keyDates: "NESA-Africa Recognition Gala · 13 December 2026",
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
    id: "icon",
    tierNumber: 3,
    name: "Africa Education Icon Award",
    subtitle: "Lifetime Achievement 2006–2026",
    voteMechanic: "jury-only",
    voteMechanicLabel: "Jury selected only · No public vote",
    cta: "Nominate",
    ctaHref: "/awards/icon",
    keyDates: "Icon Show 12 Jul 2026 · Nominations 12 Jul – 12 Sep 2026",
    categories: [
      {
        id: 17,
        name: "Africa Education Icon Award",
        subcategoryCount: 3,
        status: "confirmed",
        subcategoryNames: [
          "Literary & New Curriculum Advocate Icon of the Decade",
          "Africa Technical Educator Icon of the Decade",
          "Africa Education Philanthropy Icon of the Decade",
        ],
      },
    ],
  },
  {
    id: "influencers",
    tierNumber: 4,
    name: "Influencers Education Impact Award",
    subtitle: "Gold Certificate Subcategory",
    voteMechanic: "public-agc-only",
    voteMechanicLabel: "100% Public AGC Voting Coin · No jury vote",
    cta: "Nominate / Vote",
    ctaHref: "/awards/influencer-impact-2026",
    keyDates: "Noms close 10 Jul · Voting 15 Aug – 15 Sep · Winners 16 Sep 2026",
    categories: [
      {
        id: 18,
        name: "Influencers Education Impact Award",
        subcategoryCount: 3,
        status: "confirmed",
        subcategoryNames: [
          "African Social Media Influencers Education Impact Award",
          "African Sports Icons Supporting Education",
          "African Music Icons Supporting Education",
        ],
      },
    ],
  },
];

export const AWARD_TIERS_TOTALS = {
  tiers: 4,
  categories: AWARD_TIERS_2026.reduce((sum, t) => sum + t.categories.length, 0),
  subcategories: AWARD_TIERS_2026.reduce(
    (sum, t) => sum + t.categories.reduce((s, c) => s + c.subcategoryCount, 0),
    0,
  ),
};
