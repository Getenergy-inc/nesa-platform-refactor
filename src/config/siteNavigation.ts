// Canonical NESA-Africa 2026 public navigation.
// Seven groups from the 2026–2027 Website Content Framework.

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

export const PRIMARY_NAV_VISIBLE_XL = 7;

// 2026–2027 Website Content Framework (13 Nov 2026), sections 3–4.
export const SITE_NAV: NavItem[] = [
  { label: "About", href: "/about", analyticsId: "nav_about", children: [
    { label: "About NESA-Africa", href: "/about" },
    { label: "NESA-Africa 2026", href: "/about/nesa-africa-2026" },
    { label: "How Recognition Works", href: "/about/how-it-works" },
    { label: "Governance and Integrity", href: "/about/governance" },
    { label: "2026 Timeline", href: "/timeline" },
    { label: "About SCEF", href: "/about/scef" },
    { label: "Global Team", href: "/meet-the-team" },
  ] },
  { label: "Recognition", href: "/categories", analyticsId: "nav_recognition", children: [
    { label: "Four Recognition Tiers", href: "/categories" },
    { label: "Africa Education Icon", href: "/recognition/africa-education-icon" },
  ] },
  { label: "Nominees", href: "/nominees", analyticsId: "nav_nominees", children: [
    { label: "Nominee Directory", href: "/nominees" },
  ] },
  { label: "Impact", href: "/eduaid-africa", analyticsId: "nav_impact", children: [
    { label: "EduAid-Africa", href: "/eduaid-africa" },
    { label: "Support a Special-Needs School", href: "/support-a-special-needs-school" },
  ] },
  { label: "Media", href: "/media/tv", analyticsId: "nav_media", children: [
    { label: "NESA-Africa TV", href: "/media/tv" },
    { label: "Webinars", href: "/media/webinars" },
    { label: "Africa Education Enablers Podcast", href: "/media/podcast" },
    { label: "Online Programme", href: "/media/gala" },
  ] },
  { label: "Get Involved", href: "/nominate", analyticsId: "nav_get_involved", children: [
    { label: "Submit a Nomination", href: "/nominate" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Join a Local Chapter", href: "/chapters" },
    { label: "Sponsor", href: "/sponsors" },
    { label: "Partner", href: "/partners" },
    { label: "Donate", href: "/donate" },
  ] },
  { label: "Contact", href: "/contact", analyticsId: "nav_contact" },
];

export const MOBILE_QUICK_ACTIONS: NavItem[] = [
  { label: "Home", href: "/", analyticsId: "mobile_home" },
  { label: "Recognition", href: "/categories", analyticsId: "mobile_recognition" },
  { label: "Nominate", href: "/nominate", analyticsId: "mobile_nominate" },
  { label: "Get Involved", href: "/volunteer", analyticsId: "mobile_get_involved" },
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
