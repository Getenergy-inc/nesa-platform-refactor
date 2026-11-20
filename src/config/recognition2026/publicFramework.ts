/** Owner-approved public presentation only; nomination keys and legacy taxonomy remain unchanged. */
export const PUBLIC_RECOGNITION_TIERS = [
  {
    order: 1,
    name: "Africa Education Icon",
    slug: "africa-education-icon",
    href: "/recognition/africa-education-icon",
    awardsLabel: "3 pathways",
    subcategories: 0,
    selection: "NRRC research and review, then independent judging.",
    description: "Principal 2026 focus: up to nine Africa Education Icons across Africans in Africa, Africans in the Diaspora and Friends of Africa.",
    awards: ["Education Philanthropy Icon", "Literary and New Curriculum Advocate Icon", "Technical Educator Icon"],
  },
  {
    order: 2,
    name: "Influencers Education Impact",
    slug: "influencer-education-impact",
    href: "/recognition/influencers",
    awardsLabel: "3 pathways",
    subcategories: 0,
    selection: "NRRC research and review, then the approved governance process.",
    description: "Verified education contribution by public figures, not popularity or follower count.",
    awards: ["Social Media Influencers Supporting Education", "Sports Icons Supporting Education", "Music Icons Supporting Education"],
  },
  {
    order: 3,
    name: "Platinum Certificate",
    slug: "platinum",
    href: "/recognition/platinum",
    awardsLabel: "7 awards",
    subcategories: 27,
    selection: "Evidence-led research, review and governance approval.",
    description: "Institutional, research, leadership and partnership contributions to education.",
    awards: ["Tertiary Institution Library — Nigeria", "Research and Development for Education — Nigeria", "Christian Education — Africa Regional", "Islamic Education — Africa Regional", "Political Leadership for Education — Nigeria", "International Partnerships for Education — Africa", "African Diaspora Educational Impact — International"],
  },
  {
    order: 4,
    name: "Gold–Blue Garnet",
    slug: "gold-blue-garnet",
    href: "/recognition/gold-blue-garnet",
    awardsLabel: "9 awards",
    subcategories: 63,
    selection: "Evidence-led research, review and governance approval.",
    description: "Regional and national education contributions by organisations, programmes and public authorities.",
    awards: ["CSR for Education — Africa Regional", "CSR for Education — Nigeria", "EduTech Innovation — Africa Regional", "Media for Education Advocacy — Nigeria", "NGO for Education Advancement — Nigeria", "NGO for Education Advancement — Africa Regional", "STEM Education Programmes — Africa Regional", "Creative Arts Contribution to Education — Nigeria", "Education Policy and Implementation — Nigerian States"],
  },
] as const;

export const RECOGNITION_NON_FACTORS = ["popularity", "sponsorship", "donations", "personal access", "paid publicity", "webinar or podcast appearances", "social-media following", "merchandise purchases", "public voting", "AGC or wallet activity"] as const;
