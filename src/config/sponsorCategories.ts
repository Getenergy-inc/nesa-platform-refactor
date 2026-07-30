// NESA-Africa 2026 — Sponsorship Categories
// Drives the Sponsor mega-dropdown, hub page and individual category pages.

import {
  Sparkles,
  Trophy,
  GraduationCap,
  Building2,
  Tv,
  Mic,
  Megaphone,
  Handshake,
  Globe2,
  FileDown,
  type LucideIcon,
} from "lucide-react";

export interface SponsorTier {
  name: string;
  price: string;
  benefits: string[];
  highlighted?: boolean;
}

export interface SponsorCategory {
  slug: string;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: string; // tailwind gradient classes
  audience: string;
  reach: string;
  visibility: string[];
  benefits: string[];
  sdg: string[];
  tiers: SponsorTier[];
  ctaLabel: string;
}

export const SPONSOR_CATEGORIES: SponsorCategory[] = [
  {
    slug: "gala",
    label: "Sponsor the Blue Garnet Awards Gala",
    shortLabel: "Blue Garnet Gala",
    tagline: "Headline Africa's premier education awards night.",
    description:
      "Headline, table, red-carpet, broadcast and branding partnerships for the Blue Garnet Awards Gala — 14 December 2026, Lagos.",
    icon: Sparkles,
    accent: "from-gold/30 via-gold/10 to-transparent",
    audience: "C-suite executives, ministers, philanthropists, media and dignitaries from 54 African countries",
    reach: "1,200+ in-room guests · 5M+ livestream viewers · 50+ media partners",
    visibility: [
      "Headline stage backdrop & step-and-repeat branding",
      "VIP table hosting & red-carpet visibility",
      "Broadcast lower-thirds during livestream",
      "Logo on official gala collateral, invitations & program",
    ],
    benefits: [
      "Premium speaking slot on the main stage",
      "Curated dinner with honourees & ministers",
      "Sponsor reel during global livestream",
      "Year-long brand association with the Blue Garnet movement",
    ],
    sdg: ["SDG 4", "SDG 17", "AU Agenda 2063"],
    tiers: [
      { name: "Title Sponsor", price: "$150,000", benefits: ["Named partner of the Gala", "Headline branding", "10-person VIP table", "Keynote slot"], highlighted: true },
      { name: "Platinum Table", price: "$50,000", benefits: ["VIP table for 10", "Logo on collateral", "Broadcast mention"] },
      { name: "Red Carpet Partner", price: "$25,000", benefits: ["Red-carpet branding", "Photo wall logo", "Media kit feature"] },
    ],
    ctaLabel: "Sponsor the Gala",
  },
  {
    slug: "categories",
    label: "Sponsor Award Categories",
    shortLabel: "Award Categories",
    tagline: "Own a category. Own its story.",
    description:
      "Co-brand the Blue Garnet, Platinum, Africa Education Icon, Influencer, STEM, EduTech, NGO, CSR and Regional award categories.",
    icon: Trophy,
    accent: "from-gold/25 via-gold/5 to-transparent",
    audience: "Sector-specific changemakers, institutions and nominees aligned to your CSR focus",
    reach: "Per-category visibility across 10 African regions + diaspora chapters",
    visibility: [
      "Named partner of the category (e.g. 'Powered by [Your Brand]')",
      "Logo on nominee, voting and certificate pages",
      "Co-branded social campaign & press release",
      "Trophy & certificate co-branding",
    ],
    benefits: [
      "Direct association with high-impact nominees",
      "Sector thought-leadership positioning",
      "Curated finalist engagement opportunities",
      "Year-round digital co-branding",
    ],
    sdg: ["SDG 4", "SDG 5", "SDG 10"],
    tiers: [
      { name: "Category Title Partner", price: "$35,000", benefits: ["Named partner of one award category", "Trophy co-branding", "Press & social co-promotion"], highlighted: true },
      { name: "Category Co-Sponsor", price: "$15,000", benefits: ["Co-branded category", "Nominee page logo", "Certificate logo"] },
      { name: "Supporting Brand", price: "$5,000", benefits: ["Logo wall presence", "Mention on digital assets"] },
    ],
    ctaLabel: "Sponsor a Category",
  },
  {
    slug: "eduaid-africa",
    label: "Sponsor EduAid Africa",
    shortLabel: "EduAid Africa",
    tagline: "Fund scholarships, learning access & inclusion.",
    description:
      "Direct funding for scholarships, learning materials, special-needs support and student assistance across underserved African communities.",
    icon: GraduationCap,
    accent: "from-emerald-500/20 via-gold/10 to-transparent",
    audience: "Students, teachers, school administrators and inclusion advocates across Africa",
    reach: "10,000+ direct beneficiaries · 500+ partner schools · 10 regional hubs",
    visibility: [
      "Branded scholarship in your name",
      "Annual impact report with photo stories",
      "School plaque & on-ground branding",
      "EduAid microsite co-branding",
    ],
    benefits: [
      "Measurable CSR impact metrics (children, schools, regions)",
      "Tax-deductible (where applicable) donor recognition",
      "Co-created storytelling assets",
      "Sponsor visit & site activation opportunities",
    ],
    sdg: ["SDG 4", "SDG 5", "SDG 10"],
    tiers: [
      { name: "Scholarship Fund Partner", price: "$25,000+", benefits: ["100+ branded scholarships", "Annual report", "Site visit"], highlighted: true },
      { name: "Learning Access Partner", price: "$10,000", benefits: ["Materials for 10 schools", "Impact photo story"] },
      { name: "Inclusion Champion", price: "$5,000", benefits: ["Special-needs support fund", "Donor recognition"] },
    ],
    ctaLabel: "Sponsor EduAid",
  },
  {
    slug: "rebuild-my-school-africa",
    label: "Sponsor Rebuild My School Africa",
    shortLabel: "Rebuild My School",
    tagline: "Rebuild classrooms. Restore dignity.",
    description:
      "Post-award legacy infrastructure project (Oct 2026 → Oct 2027) — classrooms, learning materials, accessibility upgrades and school interventions.",
    icon: Building2,
    accent: "from-amber-500/20 via-gold/10 to-transparent",
    audience: "Communities, ministries of education, infrastructure partners and humanitarian funders",
    reach: "100+ schools targeted across 15 regions over 12 months",
    visibility: [
      "Plaque on rebuilt school buildings",
      "Project documentary feature",
      "Ministerial handover ceremony branding",
      "Co-branded social impact reports",
    ],
    benefits: [
      "Tangible, measurable infrastructure outcomes",
      "Government & community partnerships",
      "Documentary storytelling rights",
      "Year-long CSR impact narrative",
    ],
    sdg: ["SDG 4", "SDG 9", "SDG 11"],
    tiers: [
      { name: "School Rebuild Partner", price: "$50,000", benefits: ["Fully rebuild 1 school", "Naming rights", "Documentary feature"], highlighted: true },
      { name: "Classroom Partner", price: "$15,000", benefits: ["1 classroom rebuild", "Plaque branding"] },
      { name: "Materials Partner", price: "$5,000", benefits: ["Learning materials kit", "Photo story"] },
    ],
    ctaLabel: "Sponsor Rebuild",
  },
  {
    slug: "nesa-tv",
    label: "Sponsor NESA-Africa TV",
    shortLabel: "NESA-Africa TV",
    tagline: "Power the storytelling engine of African education.",
    description:
      "Underwrite interviews, documentaries, livestreams and broadcast production across the NESA-Africa media ecosystem.",
    icon: Tv,
    accent: "from-blue-500/20 via-gold/10 to-transparent",
    audience: "Pan-African and diaspora viewers, education professionals, policymakers",
    reach: "5M+ annual video views · YouTube, social & broadcast partners",
    visibility: [
      "Pre-roll & mid-roll brand spots",
      "Episode title sponsorship",
      "Co-branded documentary",
      "On-screen lower-thirds & end-card credits",
    ],
    benefits: [
      "Year-round content distribution",
      "Brand integration in flagship episodes",
      "Co-production opportunities",
      "Cross-platform amplification",
    ],
    sdg: ["SDG 4", "SDG 17"],
    tiers: [
      { name: "Network Partner", price: "$40,000", benefits: ["Season-long branding", "Co-branded documentary", "Multi-platform spots"], highlighted: true },
      { name: "Episode Sponsor", price: "$10,000", benefits: ["Named episode", "Lower-third branding"] },
      { name: "Series Supporter", price: "$5,000", benefits: ["End-card credit", "Social mention"] },
    ],
    ctaLabel: "Sponsor NESA TV",
  },
  {
    slug: "webinars",
    label: "Sponsor Webinars & Education Events",
    shortLabel: "Webinars & Events",
    tagline: "Convene Africa's education leaders.",
    description:
      "Title and supporting sponsorships for webinars, conferences, youth sessions, educator events and digital learning gatherings.",
    icon: Mic,
    accent: "from-purple-500/20 via-gold/10 to-transparent",
    audience: "Educators, students, EdTech founders, policy experts and youth leaders",
    reach: "20+ events per season · 25,000+ live + on-demand registrations",
    visibility: [
      "Title sponsorship of event series",
      "Speaker slot for sponsor representative",
      "Branded event landing page",
      "Recording & replay branding",
    ],
    benefits: [
      "Direct lead generation",
      "Audience Q&A engagement",
      "Co-curated agenda input",
      "Post-event report with attendee insights",
    ],
    sdg: ["SDG 4", "SDG 8", "SDG 17"],
    tiers: [
      { name: "Series Title Sponsor", price: "$20,000", benefits: ["Title rights for 6 events", "Speaker slot", "Lead-list access*"], highlighted: true },
      { name: "Event Sponsor", price: "$5,000", benefits: ["Single event branding", "Speaker slot"] },
      { name: "Community Supporter", price: "$2,000", benefits: ["Mention & logo", "Replay branding"] },
    ],
    ctaLabel: "Sponsor an Event",
  },
  {
    slug: "advertise",
    label: "Advertise on NESA Platforms",
    shortLabel: "Advertise with NESA",
    tagline: "Reach Africa's most engaged education audience.",
    description:
      "Advertising across the NESA-Africa website, nominee pages, newsletters, livestreams, social channels and broadcast properties.",
    icon: Megaphone,
    accent: "from-rose-500/20 via-gold/10 to-transparent",
    audience: "Pan-African professionals, educators, students, institutions and diaspora networks",
    reach: "2M+ monthly site visits · 500K+ social followers · 100K+ newsletter subscribers",
    visibility: [
      "Display ad placements (web & mobile)",
      "Newsletter sponsorship",
      "Social channel takeovers",
      "Livestream banner integration",
    ],
    benefits: [
      "Performance reporting (impressions, clicks, conversions)",
      "Audience targeting by region & interest",
      "Creative co-development",
      "Bundled multi-channel packages",
    ],
    sdg: ["SDG 4", "SDG 9"],
    tiers: [
      { name: "Continental Bundle", price: "$15,000 / qtr", benefits: ["Web + newsletter + social", "Performance reports"], highlighted: true },
      { name: "Newsletter Sponsor", price: "$3,000 / month", benefits: ["Featured ad in monthly issue", "Click-through tracking"] },
      { name: "Display Spot", price: "$1,500 / month", benefits: ["Web banner", "Impressions report"] },
    ],
    ctaLabel: "Place an Ad",
  },
  {
    slug: "csr",
    label: "CSR & Institutional Partnerships",
    shortLabel: "CSR & Institutional",
    tagline: "Anchor your CSR strategy in measurable African impact.",
    description:
      "Strategic CSR, institutional, NGO, bilateral and development partnerships aligned to SDG 4 and AU Agenda 2063.",
    icon: Handshake,
    accent: "from-teal-500/20 via-gold/10 to-transparent",
    audience: "Foundations, multinationals, development agencies, NGOs and bilateral institutions",
    reach: "Continental footprint across 54 African countries + diaspora",
    visibility: [
      "Named institutional partner status",
      "Joint policy briefs & reports",
      "Co-hosted high-level convenings",
      "Cross-branded thought leadership",
    ],
    benefits: [
      "Long-term partnership framework (MoU)",
      "Co-developed impact metrics & reporting",
      "Access to African education leadership network",
      "Aligned advocacy & policy influence",
    ],
    sdg: ["SDG 4", "SDG 10", "SDG 17", "AU Agenda 2063"],
    tiers: [
      { name: "Strategic Partner", price: "Custom", benefits: ["Multi-year MoU", "Joint reports", "Co-branded convenings"], highlighted: true },
      { name: "Programme Partner", price: "$25,000+", benefits: ["Programme co-branding", "Joint comms"] },
      { name: "Network Partner", price: "Custom", benefits: ["Ecosystem membership", "Affiliated branding"] },
    ],
    ctaLabel: "Start a Partnership",
  },
  {
    slug: "partners",
    label: "Become an Official Partner",
    shortLabel: "Official Partner",
    tagline: "Join the official NESA-Africa partnership tier.",
    description:
      "Strategic onboarding for official continental partners — long-term collaboration, governance representation and ecosystem influence.",
    icon: Globe2,
    accent: "from-indigo-500/20 via-gold/10 to-transparent",
    audience: "Long-term ecosystem partners across public, private and civil society",
    reach: "Year-round visibility across the full NESA-Africa ecosystem",
    visibility: [
      "Official Partner badge & seal",
      "Premium footer & masthead placement",
      "Annual Partner Convening invitation",
      "Co-published reports & briefs",
    ],
    benefits: [
      "Governance & advisory representation",
      "Cross-programme integration",
      "Continental advocacy alignment",
      "First-look on new initiatives",
    ],
    sdg: ["SDG 4", "SDG 17", "AU Agenda 2063"],
    tiers: [
      { name: "Official Continental Partner", price: "Custom", benefits: ["Full ecosystem integration", "Advisory seat", "Co-branded campaigns"], highlighted: true },
      { name: "Regional Partner", price: "Custom", benefits: ["Regional-level integration", "Co-branded regional activations"] },
    ],
    ctaLabel: "Apply as Partner",
  },
  {
    slug: "deck",
    label: "Download Sponsorship Deck",
    shortLabel: "Sponsorship Deck",
    tagline: "The full 2026 partnership prospectus.",
    description:
      "Download the official NESA-Africa 2026 Sponsorship & Partnership Deck — tiers, benefits, audience reach and SDG alignment.",
    icon: FileDown,
    accent: "from-gold/20 via-gold/5 to-transparent",
    audience: "Decision-makers reviewing partnership opportunities",
    reach: "Comprehensive ecosystem overview",
    visibility: [
      "Full sponsorship inventory",
      "Audience & reach metrics",
      "Pricing & tier breakdown",
      "Case studies & past partners",
    ],
    benefits: [
      "Side-by-side comparison of all sponsorship lanes",
      "Internal-ready document for procurement & CSR teams",
      "Quick-route contact paths for each opportunity",
    ],
    sdg: ["SDG 4", "SDG 17"],
    tiers: [],
    ctaLabel: "Download the Deck",
  },
];

export function getSponsorCategory(slug?: string): SponsorCategory | undefined {
  return SPONSOR_CATEGORIES.find((c) => c.slug === slug);
}
