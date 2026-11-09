// Canonical NESA-Africa 2026 public navigation.
// Home · About · Awards · Nominate · Nominees · Research & Judging ·
// 2026 Awards Gala · Media · Impact · Partners · Get Involved · Resources · Contact.
import { AWARD_CATEGORY_PAGES_2026 } from "./awards/subpages2026";
import { IMPACT_BRAND, IMPACT_NAV_ITEMS, IMPACT_NAV_FOOTER } from "./educationSocialImpact";
import { SCHOOL_SUPPORT_ACTIONS } from "./schoolSupport";

export interface NavChild { label: string; href: string; description?: string }
export interface NavSection { title: string; items: NavChild[] }
export interface NavItem {
  label: string;
  shortLabel?: string;
  href: string;
  children?: NavChild[];
  sections?: NavSection[];
  megaMenu?: "education-enablers";
  analyticsId?: string;
  panelHeading?: string;
  panelSubheading?: string;
  panelFooter?: { note: string; ctaLabel: string; ctaHref: string };
}

/** Six items stay inline before the desktop More overflow. */
export const PRIMARY_NAV_VISIBLE_XL = 6;

const TIER_ORDER = [
  { tier: "africa-education-icon", title: "Tier 1 · Africa Education Icon", overview: "/awards/africa-education-icon" },
  { tier: "influencer-education-impact", title: "Tier 2 · Influencers Education Impact", overview: "/awards/influencer-education-impact" },
  { tier: "platinum", title: "Tier 3 · Platinum Recognition", overview: "/awards/platinum" },
  { tier: "gold-blue-garnet", title: "Tier 4 · Gold-Blue Garnet", overview: "/awards/gold-blue-garnet" },
] as const;

const AWARD_SECTIONS: NavSection[] = [
  {
    title: "Start here",
    items: [
      { label: "Explore All 22 Categories", href: "/awards" },
      { label: "How Recognition Works", href: "/about/how-it-works" },
      { label: "Eligibility", href: "/awards/eligibility" },
      { label: "Download 2026 Certificates", href: "/recognition/certificates" },
    ],
  },
  ...TIER_ORDER.map((tier) => ({
    title: tier.title,
    items: [
      { label: `${tier.title.split("· ")[1]} Overview`, href: tier.overview },
      ...AWARD_CATEGORY_PAGES_2026.filter((page) => page.tier === tier.tier).map((page) => ({
        label: page.brand?.name ?? page.hero.title,
        href: `/recognition/subpage/${page.slug}`,
      })),
    ],
  })),
];

export const SITE_NAV: NavItem[] = [
  { label: "Home", href: "/", analyticsId: "nav_home" },
  {
    label: "About",
    href: "/about",
    analyticsId: "nav_about",
    children: [
      { label: "About NESA-Africa", href: "/about" },
      { label: "Governance", href: "/governance" },
      { label: "How Recognition Works", href: "/about/how-it-works" },
      { label: "2026–2027 Timeline", href: "/timeline" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  { label: "Awards", href: "/awards", analyticsId: "nav_awards", sections: AWARD_SECTIONS },
  { label: "Nominate", href: "/nominate", analyticsId: "nav_nominate" },
  {
    label: "Nominees",
    href: "/nominees",
    analyticsId: "nav_nominees",
    children: [
      { label: "Africa's Education Enablers", href: "/nominees" },
      { label: "Browse by Category", href: "/nominees/catalogue" },
      { label: "Browse by Region", href: "/nominees/region" },
      { label: "Claim or Update a Profile", href: "/education-enablers/claim-profile" },
    ],
  },
  {
    label: "Research & Judging",
    shortLabel: "Research",
    href: "/governance#judging",
    analyticsId: "nav_research_judging",
    children: [
      { label: "Research, Verification & Judging", href: "/governance#judging" },
      { label: "Nomination Review Committee", href: "/nrc" },
      { label: "Independent Judges", href: "/judges" },
      { label: "What Counts as Evidence", href: "/governance#verification" },
    ],
  },
  { label: "2026 Awards Gala", shortLabel: "Awards Gala", href: "/programme-2026", analyticsId: "nav_online_gala" },
  {
    label: "Media",
    href: "/media",
    analyticsId: "nav_media",
    children: [
      { label: "Media Hub", href: "/media" },
      { label: "NESA-Africa TV", href: "/media/tv" },
      { label: "Podcast", href: "/media/podcast" },
      { label: "EduAid-Africa Webinars", href: "/media/webinars" },
      { label: "EduAid-Africa e-Journal", href: "/journal" },
    ],
  },
  {
    label: IMPACT_BRAND.navLabel,
    href: "/impact",
    analyticsId: "nav_impact",
    panelHeading: IMPACT_BRAND.name,
    panelSubheading: IMPACT_BRAND.positioning,
    children: IMPACT_NAV_ITEMS,
    panelFooter: { note: IMPACT_NAV_FOOTER.note, ctaLabel: IMPACT_NAV_FOOTER.ctaLabel, ctaHref: IMPACT_NAV_FOOTER.ctaHref },
  },
  { label: "Partners", href: "/partners", analyticsId: "nav_partners" },
  {
    label: "Support Special Needs Education",
    href: SCHOOL_SUPPORT_ACTIONS.support.href,
    analyticsId: "nav_school_support",
    children: [
      { label: SCHOOL_SUPPORT_ACTIONS.nominate.shortLabel, href: SCHOOL_SUPPORT_ACTIONS.nominate.href },
      { label: SCHOOL_SUPPORT_ACTIONS.support.shortLabel, href: SCHOOL_SUPPORT_ACTIONS.support.href },
      { label: "View Impact Reports", href: "/impact/stories" },
    ],
  },
  {
    label: "Get Involved",
    href: "/support",
    analyticsId: "nav_get_involved",
    children: [
      { label: "Get Involved", href: "/support" },
      { label: "Support EduAid-Africa", href: "/eduaid-africa" },
      { label: "Become a Sponsor", href: "/sponsors" },
      { label: "Partner", href: "/partners" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Ambassador", href: "/ambassadors" },
    ],
  },
  { label: "Resources", href: "/resources", analyticsId: "nav_resources" },
  { label: "Contact", href: "/contact", analyticsId: "nav_contact" },
];

export interface UtilityNavItem {
  label: string;
  href: string;
  analyticsId: string;
  emphasis?: boolean;
  external?: boolean;
}

/** Secondary links only; no tickets, voting, wallet, AGC or merchandise. */
export const UTILITY_NAV: UtilityNavItem[] = [
  { label: "NRC", href: "/nrc", analyticsId: "util_nrc" },
  { label: "Judges", href: "/judges", analyticsId: "util_judges" },
  { label: "EduAid Africa", href: "/eduaid-africa", analyticsId: "util_eduaid" },
  { label: "Rebuild My School Africa", href: "/rebuild-my-school", analyticsId: "util_rebuild_school" },
  { label: "Become a Sponsor", href: "/sponsors", analyticsId: "util_sponsor" },
  { label: "Partner With Us", href: "/partners", analyticsId: "util_partner" },
  { label: "Support", href: "/support", analyticsId: "util_support" },
  { label: "Join Webinar", href: "/media/webinars", analyticsId: "util_webinar" },
  { label: "Join Podcast", href: "/media/podcast", analyticsId: "util_podcast" },
  { label: "Watch Award TV Show", href: "/media/tv", analyticsId: "util_tv_show" },
  { label: "Join Our Team", href: "/vacancies", analyticsId: "util_join_team" },
];

export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
