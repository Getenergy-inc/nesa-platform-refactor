// Canonical NESA-Africa 2026 public navigation.
// Seven direct destinations; no public dropdown menus.

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

export const SITE_NAV: NavItem[] = [
  { label: "Home", href: "/", analyticsId: "nav_home" },
  { label: "Awards", href: "/categories", analyticsId: "nav_awards" },
  { label: "Nominate", href: "/nominate", analyticsId: "nav_nominate" },
  { label: "Recognition", href: "/nominees", analyticsId: "nav_recognition" },
  { label: "Online Programme", href: "/media/gala", analyticsId: "nav_online_programme" },
  { label: "Support a School", href: "/support-a-special-needs-school", analyticsId: "nav_school_support" },
  { label: "About", href: "/about", analyticsId: "nav_about" },
];

export const MOBILE_QUICK_ACTIONS: NavItem[] = [
  { label: "Home", href: "/", analyticsId: "mobile_home" },
  { label: "Awards", href: "/categories", analyticsId: "mobile_awards" },
  { label: "Nominate", href: "/nominate", analyticsId: "mobile_nominate" },
  { label: "Support a School", href: "/support-a-special-needs-school", analyticsId: "mobile_school_support" },
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
