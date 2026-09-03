// Single source of truth for the NESA-Africa public navigation.
// 2026 IA architecture — 7 primary items:
//   Home · Recognition Hub 2026 ▼ · Explore Enablers ▼ · Education Impact ▼
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
import {
  IMPACT_BRAND,
  IMPACT_NAV_ITEMS,
  IMPACT_NAV_FOOTER,
} from "./educationSocialImpact";

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
  /** Optional institutional heading rendered at the top of the dropdown panel. */
  panelHeading?: string;
  /** Optional one-line positioning statement under the panel heading. */
  panelSubheading?: string;
  /** Optional note + CTA rendered at the bottom of the dropdown panel. */
  panelFooter?: { note: string; ctaLabel: string; ctaHref: string };
}

/**
 * Desktop overflow: with 10 top-level groups the bar cannot hold every item
 * on xl without wrapping, so SiteHeader renders the first
 * PRIMARY_NAV_VISIBLE_XL items inline and folds the rest into a "More"
 * dropdown below 2xl. All 10 render inline at 2xl and above.
 */
export const PRIMARY_NAV_VISIBLE_XL = 6;


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
    label: "About",
    href: "/about",
    analyticsId: "nav_about",
    children: [
      { label: "About NESA-Africa", href: "/about" },
      { label: "Trust & Integrity", href: "/trust" },
      { label: "Governance", href: "/governance" },
      { label: "Meet Our Global Team", href: "/about/team" },
      { label: "How Recognition Works", href: "/about/how-it-works" },
      { label: "Full 2026–2027 Timeline", href: "/timeline" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Africa Education Icon",
    shortLabel: "Icon",
    href: "/recognition/africa-education-icon",
    analyticsId: "nav_icon",
    children: [
      { label: "Africa Education Icon Award", href: "/recognition/africa-education-icon" },
      { label: "Africa Education Philanthropy Icon", href: "/nominees/africa-education-icon-award/education-philanthropy-icon" },
      { label: "Africa Technical Educator Icon", href: "/nominees/africa-education-icon-award/technical-educator-icon" },
      { label: "Literary & New Curriculum Advocate Icon", href: "/nominees/africa-education-icon-award/literary-new-curriculum-advocate" },
      { label: "Nominate an Icon", href: "/nominate/africa-education-icon" },
    ],
  },
  // --- Award-lane groups (real existing categories only, no new taxonomy) ---
  {
    label: "CSR",
    href: "/get-involved/csr",
    analyticsId: "nav_csr",
    children: [
      { label: "CSR for Education — Overview", href: "/get-involved/csr" },
      { label: "CSR for Education (Africa Regional)", href: "/nominees/lane/csr-africa" },
      { label: "CSR for Education (Nigeria)", href: "/nominees/lane/csr-nigeria" },
      { label: "Nominate a Company", href: "/nominate?category=best-csr-for-education-africa-regional" },
    ],
  },
  {
    label: "NGO & Foundations",
    shortLabel: "NGO & Foundations",
    href: "/get-involved/ngo",
    analyticsId: "nav_ngo_foundations",
    sections: [
      {
        title: "Nigeria NGOs",
        items: [
          { label: "NGO Lane — Overview", href: "/get-involved/ngo" },
          { label: "NGO Contribution to Education (Nigeria)", href: "/nominees/lane/ngo-nigeria" },
          { label: "Nominate an NGO (Nigeria)", href: "/nominate?category=best-ngo-for-education-nigeria" },
        ],
      },
      {
        title: "Africa Regional NGOs",
        items: [
          { label: "Best NGO for Education (Africa Regional)", href: "/nominees/lane/ngo-africa" },
          { label: "Nominate an NGO (Africa Regional)", href: "/nominate?category=best-ngo-education-africa" },
        ],
      },
      {
        title: "Foundations",
        items: [
          { label: "Foundations Lane — Overview", href: "/get-involved/foundations" },
          { label: "Africa Education Philanthropy Icon", href: "/nominees/lane/foundations" },
          { label: "Nominate a Foundation", href: "/nominate?category=africa-education-philanthropy-icon" },
        ],
      },
    ],
  },
  {
    label: "EduTech",
    href: "/get-involved/edutech",
    analyticsId: "nav_edutech",
    children: [
      { label: "EduTech Lane — Overview", href: "/get-involved/edutech" },
      { label: "EduTech Organisation (Africa) Nominees", href: "/nominees/lane/edutech-africa" },
      { label: "Nominate an EduTech Organisation", href: "/nominate?category=best-edutech-organisation-africa" },
    ],
  },
  {
    label: "Influencers",
    href: "/get-involved/influencers",
    analyticsId: "nav_influencers",
    children: [
      { label: "Influencers Lane — Overview", href: "/get-involved/influencers" },
      { label: "Social Media Education Impact", href: "/nominees/lane/influencer-social-media" },
      { label: "Sports Education Impact", href: "/nominees/lane/influencer-sports" },
      { label: "Music Education Impact", href: "/nominees/lane/influencer-music" },
      { label: "Influencer Education Impact — Overview", href: "/awards/influencers-education-impact" },
    ],
  },
  {
    label: "Recognition",
    href: "/recognition/certificates",
    analyticsId: "nav_recognition",
    children: [
      { label: "Africa Education Icon", href: "/recognition/africa-education-icon" },
      { label: "Education Impact Certificates", href: "/recognition/certificates" },
      { label: "Explore All Categories", href: "/recognition/categories" },
    ],
  },
  {
    label: "Explore Nominees",
    shortLabel: "Nominees",
    href: "/nominees",
    analyticsId: "nav_explore_enablers",
    children: [
      { label: "Africa's Education Impact Directory", href: "/nominees" },
      { label: "Browse by Category", href: "/nominees/catalogue" },
      { label: "Browse by Region (8 Africa + 7 Global)", href: "/nominees/region" },
      { label: "Verified Enablers", href: "/education-enablers/verification" },
      { label: "Claim or Update a Profile", href: "/education-enablers/claim-profile" },
    ],
  },
  {
    // NESA-Africa → Education Social Impact. EduAid-Africa is the funding /
    // programme-infrastructure partner, never the parent brand — do not
    // re-parent this item under "EduAid-Africa".
    label: IMPACT_BRAND.navLabel,
    href: "/impact",
    analyticsId: "nav_impact",
    panelHeading: IMPACT_BRAND.name,
    panelSubheading: IMPACT_BRAND.positioning,
    children: IMPACT_NAV_ITEMS,
    panelFooter: {
      note: IMPACT_NAV_FOOTER.note,
      ctaLabel: IMPACT_NAV_FOOTER.ctaLabel,
      ctaHref: IMPACT_NAV_FOOTER.ctaHref,
    },
  },
  {
    label: "Participate",
    href: "/participate",
    analyticsId: "nav_participate",
    children: [
      { label: "Nominate an Education Enabler", href: "/nominate" },
      { label: "Help me choose a recognition", href: "/nominate/help-me-choose" },
      { label: "Sponsor", href: "/get-involved/gala-sponsorship" },
      { label: "Partner", href: "/partners" },
      { label: "Endorse", href: "/endorsements" },
      { label: "Meet Our Global Volunteer Team", href: "/meet-the-team" },
      { label: "Volunteer", href: "/vacancies" },
      { label: "Ambassador", href: "/ambassadors" },
      { label: "Chapters", href: "/chapters" },
      { label: "Merchandise", href: "/merch" },
      { label: "Donate", href: "/donate" },
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
  // The CSR / NGO / Foundations / EduTech / Influencers award lanes now live
  // in the PRIMARY nav (SITE_NAV) as their own dropdown groups, so they are
  // deliberately NOT duplicated here. Only "Buy Award Gala Ticket" is
  // emphasized — it is the single transactional item on this bar.
  { label: "Buy Award Gala Ticket", href: "/tickets", analyticsId: "util_gala_ticket", emphasis: true },
  { label: "NRC", href: "/nrc", analyticsId: "util_nrc" },
  { label: "Judges", href: "/judges", analyticsId: "util_judges" },
  { label: "EduAid Africa", href: "/eduaid-africa", analyticsId: "util_eduaid" },
  { label: "Rebuild My School Africa", href: "/rebuild-my-school", analyticsId: "util_rebuild_school" },
  { label: "Become a Sponsor", href: "/sponsorship-packages", analyticsId: "util_sponsor" },
  { label: "Partner With Us", href: "/partners", analyticsId: "util_partner" },
  { label: "Support", href: "/support", analyticsId: "util_support" },
  { label: "Merchandise", href: "/merch", analyticsId: "util_merch" },
  { label: "Join Webinar", href: "/media/webinars", analyticsId: "util_webinar" },
  { label: "Join Podcast", href: "/media/podcast", analyticsId: "util_podcast" },
  { label: "Watch Award TV Show", href: "/media/tv", analyticsId: "util_tv_show" },
  { label: "Join Our Team", href: "/vacancies", analyticsId: "util_join_team" },
  { label: "Meet Our Global Volunteer Team", href: "/meet-the-team", analyticsId: "util_meet_team" },
];


// Re-export the phase-driven CTA so consumers have one import surface.
export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
