// Single source of truth for the NESA-Africa public navigation.
// 2026 ecosystem refactor — 6 top-level groups. Logo = Home.
// Consumed by SiteHeader (desktop + mobile drawer) and future footer/sitemap.

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
  /** Grouped sections (used for grouped dropdowns like Media & Events). */
  sections?: NavSection[];
  /** Marks the Education Enablers slot so the header renders the mega menu. */
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
      { label: "Vision, Mission & History", href: "/about/vision-mission" },
      { label: "How NESA-Africa Works", href: "/about/how-it-works" },
      { label: "Governance", href: "/governance" },
      { label: "Judges & Jury", href: "/about/judges" },
      { label: "Integrity & Non-Influence Policy", href: "/about/integrity" },
      { label: "Nominee Verification Process", href: "/about/verification" },
      { label: "Eligibility Rules", href: "/about/eligibility" },
      { label: "Partners", href: "/about/partners" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Awards",
    href: "/awards",
    analyticsId: "nav_awards",
    sections: [
      {
        title: "Award Programmes",
        items: [
          { label: "All Award Categories", href: "/awards/categories" },
          { label: "Africa Education Icon Award 2006–2026", href: "/awards/africa-education-icon" },
          { label: "Gold-Blue Garnet Awards", href: "/awards/gold-blue-garnet" },
          { label: "Platinum Recognition", href: "/awards/platinum-recognition" },
          { label: "Influencer Education Impact Award", href: "/awards/influencer-education-impact" },
          { label: "Gold Special Recognition", href: "/awards/gold-special-recognition" },
        ],
      },
      {
        title: "Explore",
        items: [
          { label: "Explore Existing Nominees", href: "/nominees" },
          { label: "Featured Nominees", href: "/nominees?filter=featured" },
          { label: "Nominee Profiles", href: "/nominees?view=profiles" },
          { label: "Categories & Subcategories", href: "/awards/categories" },
        ],
      },
      {
        title: "Process",
        items: [
          { label: "Eligibility & Nomination Rules", href: "/awards/eligibility" },
          { label: "Nomination Guidelines", href: "/guidelines/nominees" },
          { label: "Nominator Guidelines", href: "/guidelines/nominators" },
          { label: "Judging & Public Voting", href: "/awards/judging" },
          { label: "Awards Timeline", href: "/timeline" },
        ],
      },
    ],
  },
  {
    label: "Education Enablers",
    href: "/education-enablers",
    analyticsId: "nav_enablers",
    megaMenu: "education-enablers",
  },
  {
    label: "Impact Programmes",
    href: "/impact",
    analyticsId: "nav_impact",
    children: [
      { label: "Impact Overview", href: "/impact" },
      { label: "EduAid-Africa", href: "/eduaid-africa" },
      { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
      { label: "Special Needs School Intervention", href: "/special-needs" },
      { label: "Nominate a School", href: "/impact/nominate-school" },
      { label: "Regional School Voting", href: "/impact/regional-voting" },
      { label: "Regional Winners", href: "/impact/regional-winners" },
      { label: "Donate to an Impact Programme", href: "/donate" },
      { label: "Afri-EduTourism 2027", href: "/impact/afri-edutourism-2027" },
      { label: "Impact Reports", href: "/impact/reports" },
      { label: "Education Intervention Map", href: "/impact/map" },
    ],
  },
  {
    label: "Media & Events",
    href: "/media",
    analyticsId: "nav_media_events",
    sections: [
      {
        title: "Media",
        items: [
          { label: "NESA Africa TV", href: "/media/tv" },
          { label: "Radio & Podcast", href: "/radio-podcast" },
          { label: "News & Stories", href: "/news" },
          { label: "Education Enabler Features", href: "/education-enabler-features" },
          { label: "Interviews", href: "/interviews" },
          { label: "Videos", href: "/videos" },
          { label: "Photo Gallery", href: "/gallery" },
          { label: "Press Room", href: "/press-room" },
        ],
      },
      {
        title: "Events",
        items: [
          { label: "NESA-Africa 2026 Gala", href: "/gala" },
          { label: "Gala Tickets", href: "/tickets" },
          { label: "Gala Tables", href: "/gala/tables" },
          { label: "Online Award Shows", href: "/media/shows" },
          { label: "EduAid-Africa Webinars", href: "/media/webinars" },
          { label: "Event Calendar", href: "/events/calendar" },
          { label: "Afri-EduTourism Events", href: "/events/afri-edutourism" },
        ],
      },
    ],
  },
  {
    label: "Get Involved",
    href: "/support",
    analyticsId: "nav_get_involved",
    sections: [
      {
        title: "Organisations",
        items: [
          { label: "Become a Sponsor", href: "/sponsors" },
          { label: "Sponsorship Packages", href: "/sponsorship-packages" },
          { label: "Become a Strategic Partner", href: "/get-involved/partner" },
          { label: "Sponsor an Award Category", href: "/get-involved/category-sponsorship" },
          { label: "Sponsor an Education Enabler Page", href: "/get-involved/enabler-page-sponsorship" },
          { label: "Sponsor the Gala", href: "/get-involved/gala-sponsorship" },
          { label: "Media Partnership", href: "/get-involved/media-partnership" },
          { label: "Endorse NESA-Africa", href: "/endorsements" },
        ],
      },
      {
        title: "Individuals & Communities",
        items: [
          { label: "Volunteer", href: "/volunteer" },
          { label: "Become an Ambassador", href: "/ambassadors" },
          { label: "Join a Local Chapter", href: "/chapters" },
          { label: "Become a Nominator", href: "/guidelines/nominators" },
          { label: "Become a Fundraising Partner", href: "/get-involved/fundraising-partner" },
        ],
      },
      {
        title: "Support",
        items: [
          { label: "Donate", href: "/donate" },
          { label: "Support Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
          { label: "Support EduAid-Africa", href: "/eduaid-africa" },
          { label: "Merchandise", href: "/merchandise" },
          { label: "Contact the Partnership Team", href: "/contact/partnerships" },
        ],
      },
    ],
  },
];

// Re-export the phase-driven CTA so consumers have one import surface.
export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
