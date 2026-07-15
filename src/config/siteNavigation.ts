// Single source of truth for the NESA-Africa public navigation.
// 2026 refactor — 7 top-level groups matching the 22-page architecture.
// Nominate / Sign In / Language render outside SITE_NAV as fixed CTAs
// in SiteHeader. Logo = Home.
// Consumed by SiteHeader (desktop + mobile drawer) and NESAFooter.
//
// Rules enforced here:
// - Recognition dropdown shows ONLY the 4 tier roots (no category leaks).
// - Community merges membership/chapters/volunteers/ambassadors/judges/NRC.
// - Support dropdown funnels into consolidated /events, /resources, /policies, /faqs.
// - No obsolete voting links.

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
  href: string;
  children?: NavChild[];
  sections?: NavSection[];
  megaMenu?: "education-enablers";
  analyticsId?: string;
}

export const SITE_NAV: NavItem[] = [
  {
    label: "About",
    href: "/about",
    analyticsId: "nav_about",
    children: [
      { label: "About NESA-Africa", href: "/about" },
      { label: "Vision & Mission", href: "/about/vision-mission" },
      { label: "Governance", href: "/governance" },
      { label: "NRC", href: "/about/nrc" },
      { label: "SCEF", href: "/about/scef" },
      { label: "History", href: "/about#history" },
      { label: "Leadership", href: "/about#leadership" },
      { label: "Reports", href: "/impact/reports" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    label: "Recognition",
    href: "/recognition",
    analyticsId: "nav_recognition",
    children: [
      { label: "Africa Education Icon Award", href: "/awards/africa-education-icon" },
      { label: "Blue Garnet Award", href: "/awards/gold-blue-garnet" },
      { label: "Platinum Award", href: "/awards/platinum" },
      { label: "Influencer Education Impact", href: "/awards/influencer-education-impact" },
    ],
  },
  {
    label: "Impact",
    href: "/impact",
    analyticsId: "nav_impact",
    children: [
      { label: "Impact Programmes", href: "/impact" },
      { label: "EduAid-Africa", href: "/eduaid-africa" },
      { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
      { label: "Special Needs Education", href: "/special-needs" },
      { label: "Scholarships", href: "/impact/scholarships" },
      { label: "Afri-EduTourism", href: "/impact/afri-edutourism-2027" },
      { label: "Impact Reports", href: "/impact/reports" },
    ],
  },
  {
    label: "Directory",
    href: "/nominees",
    analyticsId: "nav_directory",
  },
  {
    label: "Community",
    href: "/community",
    analyticsId: "nav_community",
    children: [
      { label: "Join the Community", href: "/community" },
      { label: "Local Chapters", href: "/chapters" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Ambassadors", href: "/ambassadors" },
      { label: "Judges", href: "/judges/apply" },
      { label: "NRC", href: "/about/nrc#apply" },
      { label: "Membership", href: "/membership" },
    ],
  },
  {
    label: "Media",
    href: "/media",
    analyticsId: "nav_media",
    children: [
      { label: "NESA Africa TV", href: "/media/tv" },
      { label: "News & Stories", href: "/news" },
      { label: "Gallery", href: "/gallery" },
      { label: "Press Room", href: "/press-room" },
    ],
  },
  {
    label: "Support",
    href: "/support",
    analyticsId: "nav_support",
    children: [
      { label: "Partners & Sponsors", href: "/partners-sponsors" },
      { label: "Donate", href: "/donate" },
      { label: "Events & Gala", href: "/events" },
      { label: "Resources", href: "/resources" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

// Re-export the phase-driven CTA so consumers have one import surface.
export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
