// NESA-Africa 2026 — Master sponsorship pricing table.
// Single source of truth for the Sponsor Hub pricing matrix, the partnership
// lane cards and downstream sponsor pages. Figures here are governance-approved.

export interface SponsorPricingRow {
  lane: string;
  amount: string;
  limit: string;
  purpose: string;
  /** Optional anchor link (internal route) for the lane CTA. */
  href?: string;
}

export const SPONSOR_PRICING_ROWS: SponsorPricingRow[] = [
  {
    lane: "Blue Diamond Sponsorship — All-Inclusive Premier Partner",
    amount: "$800,000",
    limit: "1 only",
    purpose:
      "Highest sponsorship level covering the full NESA-Africa 2026 ecosystem.",
    href: "/contact?topic=sponsorship&lane=blue-diamond",
  },
  {
    lane: "Award Gala Night Main Sponsor",
    amount: "$200,000",
    limit: "1",
    purpose: "Main Gala visibility and premium event positioning.",
    href: "/sponsor/gala",
  },
  {
    lane: "Gala Supporting Partners",
    amount: "$25,000 – $50,000",
    limit: "3 – 5",
    purpose:
      "Hospitality, red carpet, media wall, VIP reception, accessibility, cultural performance.",
    href: "/sponsor/gala",
  },
  {
    lane: "Africa Education Icon Main Sponsor",
    amount: "$100,000",
    limit: "1",
    purpose: "Premium lifetime education impact recognition.",
    href: "/contact?topic=sponsorship&lane=africa-education-icon",
  },
  {
    lane: "Legacy Documentary Partner",
    amount: "$40,000 – $60,000",
    limit: "1",
    purpose: "Africa Education Icon documentary and tribute storytelling.",
  },
  {
    lane: "Icon Reception / Tribute Partner",
    amount: "$20,000 – $35,000",
    limit: "1",
    purpose: "Icon reception, tribute publication, or honouree acknowledgement.",
  },
  {
    lane: "Gold / Blue Garnet Sponsor",
    amount: "$150,000",
    limit: "1 main / 1 per category",
    purpose: "Core recognition and category visibility.",
    href: "/sponsor/categories",
  },
  {
    lane: "Blue Garnet Category Sponsor",
    amount: "$20,000 / category",
    limit: "1 per category",
    purpose: "Exclusive category visibility with non-influence firewall.",
    href: "/sponsor/categories",
  },
  {
    lane: "Platinum Recognition Sponsor",
    amount: "$70,000",
    limit: "1",
    purpose: "Verified excellence recognition partner.",
    href: "/contact?topic=sponsorship&lane=platinum",
  },
  {
    lane: "Platinum Category Sponsor",
    amount: "$10,000 – $15,000 / category",
    limit: "1 per category",
    purpose: "Sector-specific Platinum category visibility.",
  },
  {
    lane: "Influencers Education Impact Main Sponsor",
    amount: "$50,000",
    limit: "1",
    purpose:
      "Youth, media, digital advocacy, creator and student-voice platform.",
    href: "/contact?topic=sponsorship&lane=influencers",
  },
  {
    lane: "Influencers Supporting Partners",
    amount: "$10,000 – $25,000",
    limit: "3 – 6",
    purpose:
      "Youth voice, creator cohort, teacher creator, storytelling, social amplification.",
  },
  {
    lane: "EduAid-Africa Webinar Sponsorship",
    amount: "$500 – $1,500 / episode",
    limit: "1 main per episode",
    purpose:
      "Public education, parent engagement, teacher development, inclusion and community learning.",
    href: "/sponsor/webinars",
  },
  {
    lane: "EduAid-Africa Webinar Supporting Visibility",
    amount: "$250 – $500 / episode",
    limit: "Up to 2 per episode",
    purpose: "Supporting acknowledgement and visibility.",
  },
  {
    lane: "NESA-Africa TV Feature Sponsorship",
    amount: "$3,000 – $5,000 / feature",
    limit: "1 main per feature",
    purpose:
      "Broadcast storytelling, category feature, CSR visibility and impact documentation.",
    href: "/sponsor/nesa-tv",
  },
  {
    lane: "NESA-Africa TV Episode Supporting Partner",
    amount: "$1,000 – $2,500 / episode",
    limit: "Up to 2 per episode",
    purpose: "Supporting media acknowledgement and feature visibility.",
  },
  {
    lane: "Sub-Category Page Lead Sponsor",
    amount: "$5,000 / page",
    limit: "1 per page",
    purpose: "Highest page-level visibility.",
  },
  {
    lane: "Sub-Category Page Supporting Sponsor",
    amount: "$2,500 / page",
    limit: "1 per page",
    purpose: "Supporting page-level visibility.",
  },
  {
    lane: "Sub-Category Page Visibility Sponsor",
    amount: "$1,000 / page",
    limit: "1 per page",
    purpose: "Basic page-level visibility.",
  },
  {
    lane: "Supporter Visibility Listing",
    amount: "$500",
    limit: "Unlimited, grouped by type",
    purpose:
      "Public supporter listing — not endorsement control or award influence.",
    href: "/endorse",
  },
  {
    lane: "Merchandise / Community Visibility Add-On",
    amount: "Approved amount",
    limit: "3 – 10 by product",
    purpose: "Merchandise, community campaigns and supporter visibility.",
  },
  {
    lane: "Rebuild My School Africa Regional Partner",
    amount: "Approved amount",
    limit: "1 main per region",
    purpose: "Regional legacy support and education infrastructure impact.",
    href: "/rebuild",
  },
];

/** 12 partnership lane cards displayed in the "Choose your partnership lane" grid. */
export interface SponsorLaneCard {
  title: string;
  description: string;
  startingAmount: string;
  limit?: string;
  ctaLabel: string;
  href: string;
}

export const SPONSOR_LANE_CARDS: SponsorLaneCard[] = [
  {
    title: "Sponsor the Blue Garnet Awards Gala",
    description:
      "Headline the Gala night, hospitality, red carpet, broadcast and VIP reception.",
    startingAmount: "Main $200,000 · Supporting $25,000 – $50,000",
    limit: "1 main + 3–5 supporting",
    ctaLabel: "Sponsor the Gala",
    href: "/sponsor/gala",
  },
  {
    title: "Sponsor Award Categories",
    description:
      "Own a Blue Garnet, Platinum, EduTech, STEM, NGO or regional award category.",
    startingAmount: "$20,000 – $150,000 / category",
    limit: "1 per category",
    ctaLabel: "Sponsor a Category",
    href: "/sponsor/categories",
  },
  {
    title: "Sponsor Africa Education Icon",
    description:
      "Premium lifetime achievement recognition with documentary and tribute partners.",
    startingAmount: "Main $100,000 · Docu $40k – $60k",
    limit: "1 main",
    ctaLabel: "Sponsor the Icon Award",
    href: "/contact?topic=sponsorship&lane=africa-education-icon",
  },
  {
    title: "Sponsor Platinum Recognition",
    description:
      "Recognise verified excellence across institutional and sector categories.",
    startingAmount: "$70,000 main · $10k – $15k / category",
    limit: "1 main + 1 per category",
    ctaLabel: "Sponsor Platinum",
    href: "/contact?topic=sponsorship&lane=platinum",
  },
  {
    title: "Sponsor Influencers Education Impact",
    description:
      "Power youth voice, creator cohorts, digital advocacy and social amplification.",
    startingAmount: "$50,000 main · $10k – $25k supporting",
    limit: "1 main + 3–6 supporting",
    ctaLabel: "Sponsor Influencers",
    href: "/contact?topic=sponsorship&lane=influencers",
  },
  {
    title: "Sponsor EduAid-Africa Webinars",
    description:
      "Fund parent, teacher, inclusion and community education webinars.",
    startingAmount: "$500 – $1,500 / episode",
    limit: "1 main + up to 2 supporting / episode",
    ctaLabel: "Sponsor a Webinar",
    href: "/sponsor/webinars",
  },
  {
    title: "Sponsor NESA-Africa TV Features",
    description:
      "Power broadcast storytelling, documentaries and online category features.",
    startingAmount: "$3,000 – $5,000 / feature",
    limit: "1 main + up to 2 supporting / episode",
    ctaLabel: "Sponsor NESA-Africa TV",
    href: "/sponsor/nesa-tv",
  },
  {
    title: "Sponsor Rebuild My School Africa",
    description:
      "Fund infrastructure, accessibility, libraries, WASH and learning resources.",
    startingAmount: "Approved amount — regional partner tier",
    limit: "1 main partner per region",
    ctaLabel: "Support RMSA",
    href: "/rebuild",
  },
  {
    title: "Sponsor Sub-Category Pages",
    description:
      "Page-level visibility across sub-category and regional listing pages.",
    startingAmount: "$1,000 – $5,000 / page",
    limit: "Up to 3 sponsors per page",
    ctaLabel: "Sponsor a Page",
    href: "/contact?topic=sponsorship&lane=sub-category",
  },
  {
    title: "Become a Strategic Partner",
    description:
      "Multi-year programmatic partnership across awards, media, webinars and legacy impact.",
    startingAmount: "Custom — by MoU",
    ctaLabel: "Talk to Partnerships",
    href: "/contact?topic=sponsorship&lane=strategic",
  },
  {
    title: "Join as Supporter Visibility Listing",
    description:
      "Public supporter listing for institutions, civil society, academia, media and diaspora.",
    startingAmount: "$500",
    limit: "Unlimited, grouped by type",
    ctaLabel: "Join the Supporters",
    href: "/endorse",
  },
  {
    title: "Request a Custom Partnership Package",
    description:
      "Tailored sponsorship across multiple lanes with CSR and ESG reporting.",
    startingAmount: "Custom — built with our partnerships team",
    ctaLabel: "Request a Proposal",
    href: "/contact?topic=sponsorship&lane=custom",
  },
];
