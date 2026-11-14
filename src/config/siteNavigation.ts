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
  panelSubheading?: string;
  panelFooter?: { note: string; ctaLabel: string; ctaHref: string };
}

export const PRIMARY_NAV_VISIBLE_XL = 7;

export const SITE_NAV: NavItem[] = [
  { label: "About", href: "/about", analyticsId: "nav_about", children: [
    { label: "About NESA-Africa", href: "/about" },
    { label: "How Recognition Works", href: "/about/how-recognition-works" },
    { label: "Governance and Integrity", href: "/about/governance" },
    { label: "2026 Programme", href: "/about/nesa-africa-2026" },
    { label: "Timeline", href: "/about/timeline" },
    { label: "Global Team", href: "/meet-the-team" },
  ] },
  { label: "Recognition", href: "/recognition", analyticsId: "nav_recognition", children: [
    { label: "Four Recognition Tiers", href: "/recognition" },
    { label: "Africa Education Icon", href: "/recognition/africa-education-icon" },
    { label: "Influencers Education Impact", href: "/recognition/influencers" },
    { label: "Platinum Certificate", href: "/recognition/platinum" },
    { label: "Gold–Blue Garnet", href: "/recognition/gold-blue-garnet" },
    { label: "Nominee Directory", href: "/nominees" },
    { label: "Certificates of Recognition", href: "/recognition/certificates" },
  ] },
  { label: "Nominees", href: "/nominees", analyticsId: "nav_nominees" },
  { label: "Impact", href: "/impact", analyticsId: "nav_impact", children: [
    { label: "EduAid-Africa", href: "/eduaid-africa" },
    { label: "Rebuild My School Africa", href: "/rebuild-my-school" },
    { label: "Support a Special-Needs School", href: "/support-a-special-needs-school" },
    { label: "Regional Interventions", href: "/impact/regional" },
    { label: "Afri-EduTourism", href: "/afri-edutourism" },
    { label: "Impact Stories", href: "/impact/stories" },
    { label: "Support Education", href: "/support" },
  ] },
  { label: "Media", href: "/media", analyticsId: "nav_media", children: [
    { label: "Media Hub", href: "/media" },
    { label: "Join a Webinar", href: "/media/webinars" },
    { label: "Listen to the Podcast", href: "/media/podcast" },
    { label: "Watch NESA-Africa TV", href: "/media/tv" },
    { label: "Documentaries and Interviews", href: "/media#interviews" },
    { label: "EduAid-Africa E-Journal", href: "/journal" },
    { label: "Press and News", href: "/media#news" },
  ] },
  { label: "Get Involved", href: "/volunteer", analyticsId: "nav_get_involved", children: [
    { label: "Volunteer", href: "/volunteer" },
    { label: "Join a Local Chapter", href: "/chapters/join" },
    { label: "Join Our Team", href: "/vacancies" },
    { label: "Become a Sponsor", href: "/sponsors" },
    { label: "Partner With Us", href: "/partners" },
    { label: "Donate", href: "/donate" },
    { label: "Contact Us", href: "/contact" },
  ] },
  { label: "Contact", href: "/contact", analyticsId: "nav_contact" },
];

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
  { label: "Home", href: "/", analyticsId: "mobile_home" },
  { label: "Recognition", href: "/recognition", analyticsId: "mobile_recognition" },
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

/** Owner-approved upper-bar information links. */
export const UTILITY_NAV: UtilityNavItem[] = [
  { label: "How Recognition Works", href: "/about/how-recognition-works", analyticsId: "util_recognition_process" },
  { label: "EduAid-Africa", href: "/eduaid-africa", analyticsId: "util_eduaid" },
  { label: "Support a Special-Needs School", href: "/support-a-special-needs-school", analyticsId: "util_school_support" },
  { label: "Become a Sponsor", href: "/sponsors", analyticsId: "util_sponsor" },
  { label: "Partner With Us", href: "/partners", analyticsId: "util_partner" },
  { label: "Join a Webinar", href: "/media/webinars", analyticsId: "util_webinar" },
  { label: "Listen to the Podcast", href: "/media/podcast", analyticsId: "util_podcast" },
  { label: "Watch NESA-Africa TV", href: "/media/tv", analyticsId: "util_tv" },
  { label: "Volunteer", href: "/volunteer", analyticsId: "util_volunteer" },
];

export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
