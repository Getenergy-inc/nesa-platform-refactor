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

export const PRIMARY_NAV_VISIBLE_XL = 7;

export const SITE_NAV: NavItem[] = [
  { label: "About", href: "/about", analyticsId: "nav_about", children: [
    { label: "About NESA-Africa", href: "/about" },
    { label: "How Recognition Works", href: "/how-it-works" },
    { label: "Research and Judging", href: "/research-and-judging" },
    { label: "Governance and Integrity", href: "/about/governance" },
    { label: "2026 Online Programme", href: "/programme/2026" },
    { label: "Timeline", href: "/timeline" },
    { label: "Global Team", href: "/meet-the-team" },
  ] },
  { label: "Recognition", href: "/recognition", analyticsId: "nav_recognition", children: [
    { label: "Four Recognition Tiers", href: "/recognition" },
    { label: "Africa Education Icon", href: "/awards/africa-education-icon" },
    { label: "Influencers Education Impact", href: "/recognition/influencers" },
    { label: "Platinum Certificate", href: "/recognition/platinum" },
    { label: "Gold–Blue Garnet", href: "/recognition/gold-blue-garnet" },
    { label: "Nominee Directory", href: "/nominees" },
    { label: "Certificates of Recognition", href: "/recognition/certificates" },
  ] },
  { label: "Impact", href: "/impact", analyticsId: "nav_impact", headingLink: true, children: [
    { label: "Support a Special-Needs School", href: "/support-a-special-needs-school" },
    { label: "Afri-EduTourism", href: "/afri-edutourism" },
  ] },
  { label: "Media", href: "/media", analyticsId: "nav_media", children: [
    { label: "Media Hub", href: "/media" },
    { label: "Webinars", href: "/media/webinars" },
    { label: "Africa Education Enablers Podcast", href: "/media/podcast" },
    { label: "NESA-Africa TV", href: "/media/tv" },
    { label: "Documentaries and Interviews", href: "/media#documentaries" },
    { label: "EduAid-Africa E-Journal", href: "/journal" },
    { label: "Press and News", href: "/media#news" },
  ] },
  { label: "Get Involved", href: "/get-involved", analyticsId: "nav_get_involved", children: [
    { label: "Volunteer", href: "/volunteer" },
    { label: "Join a Local Chapter", href: "/chapters/join" },
    { label: "Join Our Team", href: "/vacancies" },
    { label: "Become a Sponsor", href: "/sponsors" },
    { label: "Partner With Us", href: "/partners" },
    { label: "Donate", href: "/donate" },
    { label: "Buy Merchandise", href: "/contact?subject=merchandise" },
  ] },
  { label: "Contact", href: "/contact", analyticsId: "nav_contact" },
];

/** Mobile adds direct Nominees access after Recognition (mobile only). */
export const MOBILE_SITE_NAV: NavItem[] = [
  ...SITE_NAV.slice(0, 2),
  { label: "Nominees", href: "/nominees", analyticsId: "nav_nominees" },
  ...SITE_NAV.slice(2),
];

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
  { label: "Home", href: "/", analyticsId: "mobile_home" },
  { label: "Recognition", href: "/recognition", analyticsId: "mobile_recognition" },
  { label: "Nominate", href: "/nominate", analyticsId: "mobile_nominate" },
  { label: "Get Involved", href: "/get-involved", analyticsId: "mobile_get_involved" },
];

export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
