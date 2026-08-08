// Single source of truth for the NESA-Africa public navigation.
// 2026 IA architecture — 7 primary items:
//   Home · Recognition Hub 2026 ▼ · Explore Enablers ▼ · EduAid-Africa Impact ▼
//   · Media & Events ▼ · Gala & Tickets ▼ · Support & Get Involved ▼
//
// Rule: new content goes INSIDE an existing dropdown (or its overview page),
// never as a new top-level item. The Recognition dropdown is generated from
// the canonical 18 award category pages, so nav can never drift from the
// registry or leave a category page orphaned.
//
// Nominate / Sign In / Language render outside SITE_NAV as fixed CTAs
// in SiteHeader. Logo = Home. Consumed by SiteHeader (desktop + mobile
// drawer) and NESAFooter.

import { AWARD_CATEGORY_PAGES_2026 } from "./awards/subpages2026";

export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavChild[];
}

export interface NavItem {
  label: string;
  /** Compact label used by the desktop nav bar to prevent overlap. */
  shortLabel?: string;
  href: string;
  children?: NavChild[];
  sections?: NavSection[];
  megaMenu?: "education-enablers";
  analyticsId?: string;
}

const TIER_ORDER = [
  { tier: "africa-education-icon", title: "Tier 1 · Africa Education Icon", overview: "/awards/africa-education-icon" },
  { tier: "influencer-education-impact", title: "Tier 2 · Influencer Education Impact", overview: "/awards/influencer-education-impact" },
  { tier: "platinum", title: "Tier 3 · Platinum Recognition", overview: "/awards/platinum" },
  { tier: "gold-blue-garnet", title: "Tier 4 · Gold-Blue Garnet Recognition", overview: "/awards/gold-blue-garnet" },
] as const;

/** Recognition dropdown, generated from the canonical 18 category pages. */
const RECOGNITION_SECTIONS: NavSection[] = [
  {
    title: "Start here",
    items: [
      { label: "Recognition Hub 2026", href: "/recognition" },
      { label: "All 18 Award Category Pages", href: "/recognition/pages" },
      { label: "All 18 Nomination Forms", href: "/nominate/pages" },
      { label: "How Recognition Works", href: "/about/how-it-works" },
      { label: "Full 2026–2027 Timeline", href: "/timeline" },
    ],
  },
  ...TIER_ORDER.map((t) => ({
    title: t.title,
    items: [
      { label: `${t.title.split("· ")[1]} Overview`, href: t.overview },
      ...AWARD_CATEGORY_PAGES_2026.filter((p) => p.tier === t.tier).map((p) => ({
        label: p.brand?.name ?? p.hero.title,
        href: `/recognition/subpage/${p.slug}`,
      })),
    ],
  })),
];

export const SITE_NAV: NavItem[] = [
  {
    label: "Home",
    href: "/",
    analyticsId: "nav_home",
  },
  {
    label: "Recognition Hub 2026",
    shortLabel: "Recognition",
    href: "/recognition",
    analyticsId: "nav_recognition",
    sections: RECOGNITION_SECTIONS,
  },
  {
    label: "Explore Enablers",
    shortLabel: "Enablers",
    href: "/nominees",
    analyticsId: "nav_explore_enablers",
    children: [
      { label: "Africa's Education Impact Directory", href: "/nominees" },
      { label: "Browse by Category", href: "/nominees/catalogue" },
      { label: "Browse by Region (8 Africa + 7 Global)", href: "/nominees/region" },
      { label: "Verified Enablers", href: "/education-enablers/verification" },
      { label: "Claim or Update a Profile", href: "/education-enablers/claim-profile" },
      { label: "Nominate an Enabler", href: "/nominate" },
    ],
  },
  {
    label: "EduAid-Africa Impact",
    shortLabel: "EduAid-Africa",
    href: "/eduaid-africa",
    analyticsId: "nav_eduaid",
    children: [
      { label: "EduAid-Africa Overview", href: "/eduaid-africa" },
      { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
      { label: "Nominate a Special-Needs School", href: "/impact/nominate-school" },
      { label: "Regional School Interventions", href: "/impact/regional-school-intervention" },
      { label: "Afri-EduTourism 2027", href: "/impact/afri-edutourism-2027" },
      { label: "Impact Reports", href: "/impact/reports" },
    ],
  },
  {
    label: "Media & Events",
    shortLabel: "Media",
    href: "/media",
    analyticsId: "nav_media",
    children: [
      { label: "Media Hub", href: "/media" },
      { label: "Pre-Award Webinars & FGDs", href: "/media/webinars" },
      { label: "NESA TV & Award Show", href: "/media/tv" },
      { label: "Radio & Podcast", href: "/radio-podcast" },
      { label: "Photo Gallery", href: "/gallery" },
      { label: "Events Calendar", href: "/events/calendar" },
      { label: "Press Room", href: "/press" },
    ],
  },
  {
    label: "Gala & Tickets",
    shortLabel: "Gala",
    href: "/gala",
    analyticsId: "nav_gala",
    children: [
      { label: "Gala Overview · 13 December 2026", href: "/gala" },
      { label: "Buy Award Gala Tickets", href: "/tickets" },
      { label: "Tables & Delegations", href: "/gala/tables" },
      { label: "Attendance & Protocol", href: "/gala/attendance" },
      { label: "Gala Sponsorship", href: "/get-involved/gala-sponsorship" },
    ],
  },
  {
    label: "Support & Get Involved",
    shortLabel: "Support",
    href: "/support",
    analyticsId: "nav_support",
    children: [
      { label: "Support Centre", href: "/support" },
      { label: "Meet Our Global Team", href: "/about/team" },
      { label: "Donate", href: "/donate" },
      { label: "Sponsors & Partners", href: "/partners-sponsors" },
      { label: "Merchandise", href: "/merch" },
      { label: "Join a Local Chapter / Volunteer", href: "/chapters" },
      { label: "Recommend an Independent Judge", href: "/judges/apply" },
      { label: "Apply to the Nominee Research Corps", href: "/about/nrc#apply" },
      { label: "Vacancies (13 standing roles)", href: "/vacancies" },
      { label: "Endorsements", href: "/endorsements" },
      { label: "About NESA-Africa", href: "/about" },
      { label: "Governance & Integrity", href: "/governance" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
    ],
  },
];


// ---------------------------------------------------------------------------
// Secondary utility bar — renders site-wide, above the main nav.
// Deliberately contains NO wallet / points / voting-adjacent destinations.
// "Buy Award Gala Ticket" is the single transactional item (gold-highlighted).
export interface UtilityNavItem {
  label: string;
  href: string;
  analyticsId: string;
  /** Visually distinct transactional item */
  emphasis?: boolean;
  /** Cross-referenced destination outside the awards platform */
  external?: boolean;
}

export const UTILITY_NAV: UtilityNavItem[] = [
  { label: "NRC", href: "/nrc", analyticsId: "util_nrc" },
  { label: "Judges", href: "/judges", analyticsId: "util_judges" },
  { label: "Buy Award Gala Ticket", href: "/tickets", analyticsId: "util_gala_ticket", emphasis: true },
  { label: "Merchandise", href: "/merch", analyticsId: "util_merch" },
  { label: "Join Webinar", href: "/media/webinars", analyticsId: "util_webinar" },
  { label: "Watch Award TV Show", href: "/media/tv", analyticsId: "util_tv_show" },
  { label: "Join Our Team", href: "/vacancies", analyticsId: "util_join_team" },
];

// Re-export the phase-driven CTA so consumers have one import surface.
export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
