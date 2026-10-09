// NESA-Africa 2026 — Developer-ready copy blocks per sponsorship lane.
// Single source of truth (CMS/config-driven) for headline, purpose, benefits,
// sponsor limit and sponsor-safe language across the Sponsor Hub, Pricing
// table, Slot Matrix and Partnership Lane components.
//
// All figures, limits and language here are governance-approved. Components
// should read from this file instead of hard-coding copy in JSX.

export type SponsorLaneSlug =
  | "blue-diamond"
  | "gala-main"
  | "gala-supporting"
  | "africa-icon-main"
  | "icon-documentary"
  | "icon-tribute"
  | "gold-blue-garnet-main"
  | "blue-garnet-category"
  | "platinum-main"
  | "platinum-category"
  | "influencers-main"
  | "influencers-supporting"
  | "eduaid-webinar-main"
  | "eduaid-webinar-supporting"
  | "nesa-tv-feature"
  | "nesa-tv-supporting"
  | "subcategory-lead"
  | "subcategory-supporting"
  | "subcategory-visibility"
  | "supporter-visibility-listing"
  | "merchandise-visibility"
  | "rmsa-regional-partner";

export interface SponsorLaneCopy {
  slug: SponsorLaneSlug;
  /** Lane title — used in headings, tables and cards. */
  headline: string;
  /** Short SEO/meta-friendly subheadline (≤ 110 chars). */
  subheadline: string;
  /** Governance-approved amount string. */
  amount: string;
  /** Governance-approved sponsor limit string. */
  sponsorLimit: string;
  /** Why this lane exists — funder-facing purpose statement. */
  purpose: string;
  /** Bulleted, developer-ready sponsor benefits. */
  benefits: string[];
  /** Mandatory sponsor-safe disclosure language. */
  sponsorSafeLanguage: string;
  /** Primary CTA label. */
  ctaLabel: string;
  /** Internal CTA route. */
  href: string;
}

const FIREWALL =
  "Sponsorship does not influence nominations, voting, judging, finalists or winners. All sponsor visibility is governed by the NESA-Africa Sponsor Firewall and confirmed by term sheet or MoU.";

export const SPONSOR_LANE_COPY: Record<SponsorLaneSlug, SponsorLaneCopy> = {
  "blue-diamond": {
    slug: "blue-diamond",
    headline: "Blue Diamond Sponsorship — All-Inclusive Premier Partner",
    subheadline:
      "Exclusive continental partner across the full NESA-Africa 2026 ecosystem.",
    amount: "$800,000",
    sponsorLimit: "1 only",
    purpose:
      "The highest sponsorship level for a single continental partner aligning their brand with Africa's premier education recognition and impact platform.",
    benefits: [
      "Exclusive “Official Blue Diamond Partner of NESA-Africa 2026” designation",
      "Premier brand presence across the Gala, awards, NESA-Africa TV, webinars and digital ecosystem",
      "Top billing across press releases, broadcast features, sponsor wall and ceremony backdrop",
      "Custom CSR/ESG impact report covering all sponsored programmes",
      "Priority access to RMSA regional impact dashboard and post-award legacy storytelling",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Discuss Blue Diamond Partnership",
    href: "/contact?topic=sponsorship&lane=blue-diamond",
  },
  "gala-main": {
    slug: "gala-main",
    headline: "Award Gala Night Main Sponsor",
    subheadline: "Headline the Blue Garnet Awards Gala — premium event positioning.",
    amount: "$200,000",
    sponsorLimit: "1",
    purpose:
      "Anchor the Blue Garnet Awards Gala night — Africa's flagship education recognition ceremony — with premium naming-right visibility.",
    benefits: [
      "“Presented by” naming visibility on Gala communications and stage",
      "Premium logo placement on ceremony backdrop, programme and broadcast lower-thirds",
      "VIP guest allocation and on-stage acknowledgement by host",
      "Inclusion in Gala highlights reel and post-event press distribution",
      "Dedicated CSR storytelling segment in NESA-Africa TV recap",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor the Gala",
    href: "/sponsor/gala",
  },
  "gala-supporting": {
    slug: "gala-supporting",
    headline: "Gala Supporting Partners",
    subheadline:
      "Hospitality, red carpet, media wall, VIP reception, accessibility and cultural performance partners.",
    amount: "$25,000 – $50,000",
    sponsorLimit: "3 – 5",
    purpose:
      "Power the operational and experiential moments of the Gala — hospitality, red carpet, media wall, VIP reception, accessibility and cultural performance.",
    benefits: [
      "Branded activation zone aligned to the supporting partner role",
      "Logo on Gala programme, sponsor wall and partner credits",
      "Co-branded social media moment and media wall acknowledgement",
      "VIP invitations and access to the partner reception",
      "Coverage in Gala post-event sponsor report",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Become a Gala Supporting Partner",
    href: "/sponsor/gala",
  },
  "africa-icon-main": {
    slug: "africa-icon-main",
    headline: "Africa Education Icon Award — Main Sponsor",
    subheadline: "Premium lifetime achievement recognition for Africa's education icons.",
    amount: "$100,000",
    sponsorLimit: "1",
    purpose:
      "Honour Africa's most distinguished lifetime education contributors through a prestige category kept deliberately uncrowded to protect its weight.",
    benefits: [
      "“Africa Education Icon Award presented by [Sponsor]” naming visibility",
      "Inclusion in icon tribute publication and Gala tribute segment",
      "Branded recognition in NESA-Africa TV Icon feature",
      "VIP seating and Icon reception co-host acknowledgement",
      "Custom CSR legacy report aligned to the Icon honourees",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor the Icon Award",
    href: "/contact?topic=sponsorship&lane=africa-education-icon",
  },
  "icon-documentary": {
    slug: "icon-documentary",
    headline: "Legacy Documentary Partner",
    subheadline:
      "Power the Africa Education Icon documentary and tribute storytelling.",
    amount: "$40,000 – $60,000",
    sponsorLimit: "1",
    purpose:
      "Fund the production and distribution of the Africa Education Icon legacy documentary and tribute storytelling series.",
    benefits: [
      "“Documentary supported by [Sponsor]” opening and closing credit",
      "Logo on documentary key art, micro-site and distribution materials",
      "Co-branded launch screening and behind-the-scenes content rights",
      "Inclusion in NESA-Africa TV Icon distribution windows",
      "Custom CSR report on documentary reach and audience impact",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Partner on the Icon Documentary",
    href: "/contact?topic=sponsorship&lane=icon-documentary",
  },
  "icon-tribute": {
    slug: "icon-tribute",
    headline: "Icon Reception / Tribute Partner",
    subheadline:
      "Co-host the Icon reception, tribute publication or honouree acknowledgement.",
    amount: "$20,000 – $35,000",
    sponsorLimit: "1",
    purpose:
      "Co-host the Icon reception, tribute publication or honouree acknowledgement experience around the Gala.",
    benefits: [
      "Co-host visibility on Icon reception invitations and signage",
      "Logo placement in tribute publication and Gala Icon programme",
      "Acknowledgement in Gala tribute segment and social recap",
      "VIP allocation for Icon reception",
      "Inclusion in sponsor wall and partner credits",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Host the Icon Tribute",
    href: "/contact?topic=sponsorship&lane=icon-tribute",
  },
  "gold-blue-garnet-main": {
    slug: "gold-blue-garnet-main",
    headline: "Gold-Blue Garnet Sponsor",
    subheadline: "Anchor sponsor across the Blue Garnet recognition core.",
    amount: "$150,000",
    sponsorLimit: "1 main / 1 per category",
    purpose:
      "Anchor sponsor across the Blue Garnet recognition core — the central visibility band of NESA-Africa 2026.",
    benefits: [
      "Main Gold-Blue Garnet sponsor visibility across the recognition cycle",
      "Logo and acknowledgement across Blue Garnet category pages",
      "Branded recognition in Gala Blue Garnet announcement segments",
      "Inclusion in NESA-Africa TV Blue Garnet category features",
      "Custom CSR impact report aligned to recognised categories",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor Blue Garnet",
    href: "/sponsor/categories",
  },
  "blue-garnet-category": {
    slug: "blue-garnet-category",
    headline: "Blue Garnet Category Sponsor",
    subheadline:
      "Exclusive single-category visibility with strict non-influence firewall.",
    amount: "$20,000 / category",
    sponsorLimit: "1 per category",
    purpose:
      "Sponsor a specific Blue Garnet award category with exclusive single-category visibility while preserving the non-influence firewall.",
    benefits: [
      "Exclusive “Category sponsor” billing on the chosen category page",
      "Logo placement on category communications and recognition assets",
      "Acknowledgement in NESA-Africa TV category feature when produced",
      "Co-branded category storytelling moment on social",
      "Sponsor report on category visibility and reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor a Category",
    href: "/sponsor/categories",
  },
  "platinum-main": {
    slug: "platinum-main",
    headline: "Platinum Recognition Sponsor",
    subheadline: "Anchor Platinum verified-excellence recognition partner.",
    amount: "$70,000",
    sponsorLimit: "1",
    purpose:
      "Anchor Platinum recognition partner — supporting verified-excellence recognition across institutional and sector categories.",
    benefits: [
      "Main Platinum sponsor visibility across Platinum recognition assets",
      "Logo placement on Platinum landing and verification micro-pages",
      "Inclusion in Platinum recognition announcements and press notes",
      "Co-branded Platinum storytelling segment in NESA-Africa TV",
      "Custom CSR report on Platinum recognition reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor Platinum",
    href: "/contact?topic=sponsorship&lane=platinum",
  },
  "platinum-category": {
    slug: "platinum-category",
    headline: "Platinum Category Sponsor",
    subheadline: "Sector-specific Platinum category visibility.",
    amount: "$10,000 – $15,000 / category",
    sponsorLimit: "1 per category",
    purpose:
      "Sponsor a single sector-specific Platinum category, aligning your brand with verified excellence in that vertical.",
    benefits: [
      "Exclusive Platinum category sponsor billing on the chosen page",
      "Logo placement on category recognition assets",
      "Mention in category communications and partner credits",
      "Co-branded category storytelling moment on social",
      "Sponsor report on category visibility and reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor a Platinum Category",
    href: "/contact?topic=sponsorship&lane=platinum-category",
  },
  "influencers-main": {
    slug: "influencers-main",
    headline: "Influencers Education Impact — Main Sponsor",
    subheadline:
      "Power youth voice, creator cohorts, digital advocacy and social amplification.",
    amount: "$50,000",
    sponsorLimit: "1",
    purpose:
      "Lead sponsor for the Influencers Education Impact track — youth voice, creator cohorts, digital advocacy, teacher creators and student-voice platforms.",
    benefits: [
      "“Influencers Education Impact presented by [Sponsor]” naming visibility",
      "Logo placement across creator cohort and youth voice campaigns",
      "Acknowledgement in NESA-Africa TV Influencer features",
      "Co-branded social amplification across creator partners",
      "Custom CSR report on youth, creator and social reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor Influencers Track",
    href: "/contact?topic=sponsorship&lane=influencers",
  },
  "influencers-supporting": {
    slug: "influencers-supporting",
    headline: "Influencers Supporting Partners",
    subheadline:
      "Youth voice, creator cohort, teacher creator, storytelling and social amplification partners.",
    amount: "$10,000 – $25,000",
    sponsorLimit: "3 – 6",
    purpose:
      "Support specific lanes within the Influencers Education Impact track — youth voice, creator cohort, teacher creator, storytelling or social amplification.",
    benefits: [
      "Supporting partner visibility on the chosen Influencer lane",
      "Logo placement on lane assets and creator deliverables",
      "Acknowledgement in lane recap content",
      "Co-branded social activation aligned to the lane",
      "Sponsor report on lane visibility and reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Become an Influencers Supporting Partner",
    href: "/contact?topic=sponsorship&lane=influencers-supporting",
  },
  "eduaid-webinar-main": {
    slug: "eduaid-webinar-main",
    headline: "EduAid-Africa Webinar Sponsorship",
    subheadline:
      "Main sponsor for a parent, teacher, inclusion or community education webinar episode.",
    amount: "$500 – $1,500 / episode",
    sponsorLimit: "1 main per episode",
    purpose:
      "Power public education, parent engagement, teacher development, inclusion and community learning through the EduAid-Africa webinar series.",
    benefits: [
      "“Episode presented by [Sponsor]” opening and closing acknowledgement",
      "Logo on episode key art, registration page and replay",
      "Branded 30-second message or expert insert (where appropriate)",
      "Mention in pre- and post-episode social and email amplification",
      "Episode reach and engagement report",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor a Webinar",
    href: "/sponsor/webinars",
  },
  "eduaid-webinar-supporting": {
    slug: "eduaid-webinar-supporting",
    headline: "EduAid-Africa Webinar Supporting Visibility",
    subheadline: "Supporting acknowledgement and visibility per episode.",
    amount: "$250 – $500 / episode",
    sponsorLimit: "Up to 2 per episode",
    purpose:
      "Supporting visibility for organisations contributing to EduAid-Africa webinar episodes alongside the main sponsor.",
    benefits: [
      "Supporting sponsor logo on episode page and replay",
      "Acknowledgement in episode opening credits",
      "Mention in social amplification posts",
      "Inclusion in episode reach summary",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Become a Webinar Supporting Partner",
    href: "/sponsor/webinars",
  },
  "nesa-tv-feature": {
    slug: "nesa-tv-feature",
    headline: "NESA-Africa TV Feature Sponsorship",
    subheadline:
      "Power broadcast storytelling, category features, CSR visibility and impact documentation.",
    amount: "$3,000 – $5,000 / feature",
    sponsorLimit: "1 main per feature",
    purpose:
      "Main sponsor for a NESA-Africa TV feature, documentary or category coverage — broadcast and online distribution.",
    benefits: [
      "“Feature presented by [Sponsor]” billing on the chosen feature",
      "Logo and acknowledgement in feature opening and closing credits",
      "Branded 30-second insert (where appropriate)",
      "Inclusion in promo cutdowns and social distribution",
      "Feature reach and engagement report",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor a TV Feature",
    href: "/sponsor/nesa-tv",
  },
  "nesa-tv-supporting": {
    slug: "nesa-tv-supporting",
    headline: "NESA-Africa TV Episode Supporting Partner",
    subheadline: "Supporting media acknowledgement and feature visibility.",
    amount: "$1,000 – $2,500 / episode",
    sponsorLimit: "Up to 2 per episode",
    purpose:
      "Supporting media partners for NESA-Africa TV episodes alongside the main feature sponsor.",
    benefits: [
      "Supporting sponsor logo on episode credits and micro-page",
      "Acknowledgement in episode opening",
      "Mention in promo cutdowns and social distribution",
      "Inclusion in episode reach summary",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Support a TV Episode",
    href: "/sponsor/nesa-tv",
  },
  "subcategory-lead": {
    slug: "subcategory-lead",
    headline: "Sub-Category Page Lead Sponsor",
    subheadline: "Highest page-level visibility on a single sub-category page.",
    amount: "$5,000 / page",
    sponsorLimit: "1 per page",
    purpose:
      "Lead sponsor of a single sub-category or regional listing page — the highest page-level visibility tier.",
    benefits: [
      "Lead sponsor banner at the top of the chosen sub-category page",
      "Logo across page header and partner credits",
      "Mention in page-specific social and email amplification",
      "Sponsor report on page-level reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor a Page (Lead)",
    href: "/contact?topic=sponsorship&lane=sub-category-lead",
  },
  "subcategory-supporting": {
    slug: "subcategory-supporting",
    headline: "Sub-Category Page Supporting Sponsor",
    subheadline: "Supporting page-level visibility tier.",
    amount: "$2,500 / page",
    sponsorLimit: "1 per page",
    purpose:
      "Supporting visibility on a single sub-category or regional listing page alongside the lead sponsor.",
    benefits: [
      "Supporting sponsor placement on the chosen page",
      "Logo on partner credits and page footer band",
      "Mention in page-specific social acknowledgement",
      "Sponsor report on page-level reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor a Page (Supporting)",
    href: "/contact?topic=sponsorship&lane=sub-category-supporting",
  },
  "subcategory-visibility": {
    slug: "subcategory-visibility",
    headline: "Sub-Category Page Visibility Sponsor",
    subheadline: "Basic page-level visibility tier.",
    amount: "$1,000 / page",
    sponsorLimit: "1 per page",
    purpose:
      "Entry-level page visibility on a sub-category or regional listing page.",
    benefits: [
      "Logo placement in the page partner credits band",
      "Mention in page-specific social acknowledgement",
      "Sponsor report on page-level reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Sponsor a Page (Visibility)",
    href: "/contact?topic=sponsorship&lane=sub-category-visibility",
  },
  "supporter-visibility-listing": {
    slug: "supporter-visibility-listing",
    headline: "Supporter Visibility Listing",
    subheadline:
      "Public supporter listing — not endorsement control or award influence.",
    amount: "$500",
    sponsorLimit: "Unlimited, grouped by supporter type",
    purpose:
      "A paid public supporter listing for institutions, civil society, academia, media, diaspora, corporate and community supporters. This is NOT sponsorship and does not confer category ownership, judging authority, nomination influence, voting influence or winner-selection power.",
    benefits: [
      "Public supporter listing on the NESA-Africa supporter page",
      "Grouped placement under the appropriate supporter type",
      "Mention in periodic supporter acknowledgement posts",
      "Inclusion in the annual supporter recognition publication",
    ],
    sponsorSafeLanguage:
      "Supporter Visibility Listing is a paid public listing — separate from sponsorship — and never creates category ownership, judging authority, nomination influence, voting influence or winner-selection power.",
    ctaLabel: "Join the Supporters",
    href: "/endorse",
  },
  "merchandise-visibility": {
    slug: "merchandise-visibility",
    headline: "Merchandise / Community Visibility Add-On",
    subheadline: "Merchandise, community campaigns and supporter visibility.",
    amount: "Approved amount",
    sponsorLimit: "3 – 10 by product",
    purpose:
      "Add-on visibility through approved NESA-Africa merchandise, community campaigns and supporter-facing activations.",
    benefits: [
      "Brand placement on approved merchandise SKUs",
      "Mention in community campaign communications",
      "Logo in supporter-facing visibility activations",
      "Sponsor report on merchandise and campaign reach",
    ],
    sponsorSafeLanguage: FIREWALL,
    ctaLabel: "Discuss Merchandise Visibility",
    href: "/contact?topic=sponsorship&lane=merchandise",
  },
  "rmsa-regional-partner": {
    slug: "rmsa-regional-partner",
    headline: "Rebuild My School Africa Regional Partner",
    subheadline:
      "Regional legacy support and education infrastructure impact (Oct 2026 – Oct 2027).",
    amount: "Approved amount",
    sponsorLimit: "1 main partner per region",
    purpose:
      "Lead regional partner for Rebuild My School Africa — funding infrastructure, accessibility, libraries, WASH and learning resources across the December 2026 – December 2027 RMSA timeline.",
    benefits: [
      "“RMSA Regional Partner — [Region]” recognition across legacy assets",
      "Logo placement on RMSA regional micro-page and impact dashboard",
      "Acknowledgement in RMSA milestone reports and ceremonies",
      "Inclusion in NESA-Africa TV RMSA legacy storytelling",
      "Custom CSR/ESG impact report aligned to the region’s 5% RMSA Legacy Fund allocation",
    ],
    sponsorSafeLanguage:
      "RMSA partnership funds the 5% RMSA Legacy Fund regional pipeline and does not influence nominations, voting, judging, finalists or winners.",
    ctaLabel: "Support RMSA",
    href: "/rebuild",
  },
};

export const SPONSOR_LANE_COPY_LIST: SponsorLaneCopy[] =
  Object.values(SPONSOR_LANE_COPY);

export function getSponsorLaneCopy(slug: SponsorLaneSlug): SponsorLaneCopy {
  return SPONSOR_LANE_COPY[slug];
}
