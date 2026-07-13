// NESA-Africa 2026 — Recognition Tiers (source of truth).
// Public tier order + review routes + integrity notice.

export type TierSlug =
  | "africa-education-icon"
  | "influencer-education-impact"
  | "platinum"
  | "gold-blue-garnet";

export interface TierDefinition {
  slug: TierSlug;
  order: number;
  name: string;
  shortName: string;
  summary: string;
  decisionMethod2026: string;
  reviewRoute: string[];
  eligibleNomineeTypes: string[];
  totalCategories: number;
  totalSubcategories: number;
  href: string;
}

export const TIERS: TierDefinition[] = [
  {
    slug: "africa-education-icon",
    order: 1,
    name: "Africa Education Icon Award",
    shortName: "Africa Education Icon",
    summary:
      "Continental lifetime recognition (2006–2026) for Education Enablers whose legacy has transformed learning across Africa and the Diaspora.",
    decisionMethod2026: "NRC Verification → Icon Jury Assessment → Governance Ratification",
    reviewRoute: [
      "NRC Verification",
      "Icon Judge Assignment",
      "Independent Assessment",
      "Moderation",
      "Governance Ratification",
    ],
    eligibleNomineeTypes: ["Individual (African in Africa)", "Individual (Diaspora African)", "Individual (Friend of Africa)"],
    totalCategories: 1,
    totalSubcategories: 3,
    href: "/recognition/africa-education-icon",
  },
  {
    slug: "influencer-education-impact",
    order: 2,
    name: "Influencer Education Impact",
    shortName: "Influencer Impact",
    summary:
      "Recognition for public figures whose platforms have measurably advanced education outcomes across Africa and the Diaspora.",
    decisionMethod2026: "NRC Impact Verification → Governance Approval",
    reviewRoute: ["NRC Impact Verification", "Governance Approval"],
    eligibleNomineeTypes: ["Individual (Public Figure)"],
    totalCategories: 1,
    totalSubcategories: 3,
    href: "/recognition/influencer-education-impact",
  },
  {
    slug: "platinum",
    order: 3,
    name: "Platinum Recognition",
    shortName: "Platinum",
    summary:
      "Institutional leadership recognition for organisations, governments and international partners advancing Education for All Across Africa.",
    decisionMethod2026: "Institutional Due Diligence → NRC Verification → Governance Approval",
    reviewRoute: ["Institutional Due Diligence", "NRC Verification", "Governance Approval"],
    eligibleNomineeTypes: [
      "Tertiary Institution Library",
      "Research Institution",
      "Faith-Based Organisation",
      "Public Office / Political Leadership",
      "International Partner",
      "Diaspora Association",
    ],
    totalCategories: 7,
    totalSubcategories: 27,
    href: "/recognition/platinum",
  },
  {
    slug: "gold-blue-garnet",
    order: 4,
    name: "Gold-Blue Garnet Recognition",
    shortName: "Gold-Blue Garnet",
    summary:
      "2026 Recognition and Qualification Edition for CSR, EdTech, NGOs, media, STEM, creative arts and state policy leadership in education. No public voting.",
    decisionMethod2026: "NRC Verification → Governance Approval",
    reviewRoute: ["NRC Verification", "Governance Approval"],
    eligibleNomineeTypes: [
      "Corporate Organisation",
      "Corporate Foundation",
      "NGO",
      "Media Organisation",
      "EdTech Organisation",
      "STEM Programme",
      "Creative Arts Programme",
      "Nigerian State Government",
    ],
    totalCategories: 9,
    totalSubcategories: 63,
    href: "/recognition/gold-blue-garnet",
  },
];

export const INTEGRITY_NOTICE_2026 =
  "NESA-Africa 2026 does not use public voting for award recognition. Sponsorship, donations, Gala tickets, merchandise, endorsements, GFAwzip Wallet transactions, AGC Participation Credits, follower numbers and public popularity do not influence verification or recognition.";

export function getTier(slug: TierSlug): TierDefinition | undefined {
  return TIERS.find((t) => t.slug === slug);
}
