// Single source of truth for the NESA-Africa public navigation.
// 2026 conversion-focused refactor — 7 top-level groups.
// Nominate / Sign In / Language render outside SITE_NAV as fixed CTAs
// in SiteHeader. Logo = Home.
// Consumed by SiteHeader (desktop + mobile drawer) and NESAFooter.

export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavSection {
  /** Section heading inside a dropdown/mega-menu column. */
  title: string;
  items: NavChild[];
}

export interface NavItem {
  label: string;
  href: string;
  /** Simple dropdown children. */
  children?: NavChild[];
  /** Grouped sections (used for grouped dropdowns like Get Involved). */
  sections?: NavSection[];
  /** Legacy mega-menu slot. No longer used in 2026 nav. */
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
      { label: "Vision, Mission & Strategic Objectives", href: "/about/vision-mission" },
      { label: "Recognition Philosophy", href: "/about#philosophy" },
      { label: "Education Enablers", href: "/about#enablers" },
      { label: "Regional Framework", href: "/regions" },
      { label: "Governance", href: "/governance" },
      { label: "Nominee Research Corps (NRC)", href: "/about/nrc" },
      { label: "SCEF", href: "/about/scef" },
      { label: "History", href: "/about#history" },
      { label: "Leadership", href: "/about#leadership" },
      { label: "Annual Reports", href: "/impact/reports" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    label: "Recognition",
    href: "/awards",
    analyticsId: "nav_recognition",
    children: [
      { label: "Africa Education Icon Award", href: "/awards/africa-education-icon" },
      { label: "Blue Garnet Award", href: "/awards/gold-blue-garnet" },
      { label: "Platinum Award", href: "/awards/platinum-recognition" },
      { label: "Influencer Education Impact", href: "/awards/influencer-education-impact" },
      { label: "All Recognition Categories", href: "/awards/categories" },
      { label: "Recognition Timeline", href: "/timeline" },
      { label: "Recognition Guidelines", href: "/guidelines/nominators" },
    ],
  },
  {
    label: "Impact Programmes",
    href: "/impact",
    analyticsId: "nav_impact",
    children: [
      { label: "EduAid-Africa", href: "/eduaid-africa" },
      { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
      { label: "Special Needs School Intervention", href: "/special-needs" },
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
    label: "Media",
    href: "/media",
    analyticsId: "nav_media",
    children: [
      { label: "NESA Africa TV", href: "/media/tv" },
      { label: "News & Stories", href: "/news" },
      { label: "Videos", href: "/videos" },
      { label: "Photo Gallery", href: "/gallery" },
      { label: "Press Room", href: "/press-room" },
      { label: "NESA-Africa 2026 Gala", href: "/gala" },
      { label: "Event Calendar", href: "/events/calendar" },
    ],
  },
  {
    label: "Get Involved",
    href: "/get-involved",
    analyticsId: "nav_get_involved",
    sections: [
      {
        title: "Join the Community",
        items: [
          { label: "Join the Community", href: "/get-involved" },
          { label: "Local Chapters", href: "/chapters" },
          { label: "Volunteer", href: "/volunteer" },
          { label: "Become an Ambassador", href: "/ambassadors" },
        ],
      },
      {
        title: "Contribute Expertise",
        items: [
          { label: "Become a Judge", href: "/judges/apply" },
          { label: "Become an NRC Researcher", href: "/about/nrc#apply" },
          { label: "Become a Nominator", href: "/guidelines/nominators" },
        ],
      },
      {
        title: "Partner & Sponsor",
        items: [
          { label: "Partner with NESA-Africa", href: "/get-involved/partner" },
          { label: "Sponsor NESA-Africa", href: "/sponsors" },
          { label: "Endorse NESA-Africa", href: "/endorsements" },
        ],
      },
    ],
  },
  {
    label: "Support",
    href: "/support",
    analyticsId: "nav_support",
    children: [
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
      { label: "Chat with Sophia AI", href: "/help" },
      { label: "Donate", href: "/donate" },
      { label: "Merchandise", href: "/merchandise" },
    ],
  },
];

// Re-export the phase-driven CTA so consumers have one import surface.
export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
