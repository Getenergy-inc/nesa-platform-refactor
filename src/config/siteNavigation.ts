// Canonical NESA-Africa 2026 public navigation.
// Owner-approved labels and destinations; route guards remain authoritative.
import { NOMINATE_CTA } from "./campaignPhase";

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
  /** Render the panel heading as the tappable link to `href` instead of an "… overview" list item. */
  headingLink?: boolean;
  panelSubheading?: string;
  panelFooter?: { note: string; ctaLabel: string; ctaHref: string };
}

export const PRIMARY_NAV_VISIBLE_XL = 6;

export const SITE_NAV: NavItem[] = [
  { label: "Awards", href: "/awards", analyticsId: "nav_awards", children: [
    { label: "How recognition works", href: "/awards#how" },
    { label: "Tier 1 Africa Education Icon", href: "/awards/africa-education-icon" },
    { label: "Tier 2 Influencers Education Impact", href: "/awards/influencer-education-impact" },
    { label: "Tier 3 Platinum Recognition", href: "/awards/platinum-recognition" },
    { label: "Tier 4 Gold–Blue Garnet", href: "/awards/gold-blue-garnet" },
    { label: "Timeline", href: "/awards#timeline" },
  ] },
  { label: "Nominees", href: "/nominees", analyticsId: "nav_nominees" },
  { label: "Support a School", href: "/impact/special-needs-schools", analyticsId: "nav_support_school" },
  { label: "Online Programme", href: "/programme/2026", analyticsId: "nav_online_programme" },
  { label: "About", href: "/about", analyticsId: "nav_about", children: [
    { label: "SCEF and the five arms", href: "/about#scef" },
    { label: "Governance", href: "/about#governance" },
    { label: "Board of Advisors", href: "/about#advisors" },
    { label: "Partners", href: "/about#partners" },
  ] },
  { label: "Get Involved", href: "/get-involved", analyticsId: "nav_get_involved" },
];

/** Phone navigation intentionally uses the same order as desktop. */
export const MOBILE_SITE_NAV: NavItem[] = SITE_NAV;

/** Destination choices only: selecting one never assigns or changes a role. */
export const SIGN_IN_WORKSPACES: NavChild[] = [
  { label: "Nominee Portal", href: "/nominee-portal" },
  { label: "NRRC Portal", href: "/nrrc", description: "Nominee Research and Review Corps (NRRC)" },
  { label: "Judges Arena", href: "/judges" },
  { label: "Volunteer Workspace", href: "/login?next=%2Fdashboard%2Fvolunteer" },
  { label: "Chapter Workspace", href: "/login?next=%2Folc%2Fdashboard" },
  { label: "Administrator Sign-In", href: "/login?next=%2Fadmin" },
];

export const MOBILE_QUICK_ACTIONS: NavItem[] = [
  { label: "Nominate", href: NOMINATE_CTA.href, analyticsId: "mobile_nominate" },
  { label: "Support a School", href: "/impact/special-needs-schools", analyticsId: "mobile_support_school" },
];

export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
