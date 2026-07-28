// Single source of truth for the NESA-Africa public navigation.
// Locked 5-item architecture:
//   About ▼   Recognition ▼   Get Involved ▼   Directory   Support ▼
//
// Rule: new content goes INSIDE an existing dropdown (or its overview page),
// never as a new top-level item — unless it represents a genuinely new
// visitor intent none of the five current items cover. Recognition is the
// deliberate exception to "keep it lean"; a visitor opening that dropdown
// has already decided to nominate and benefits from full depth.
//
// Nominate / Sign In / Language render outside SITE_NAV as fixed CTAs
// in SiteHeader. Logo = Home. Consumed by SiteHeader (desktop + mobile
// drawer) and NESAFooter.

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
      { label: "About NESA-Africa 2026", href: "/about/nesa-africa-2026" },
      { label: "About NESA-Africa 2027", href: "/about/nesa-africa-2027" },
      { label: "About NESA-Africa 2028–2030", href: "/about/nesa-africa-2028-2030" },
      { label: "Governance & Integrity", href: "/governance" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    label: "Recognition",
    href: "/recognition",
    analyticsId: "nav_recognition",
    sections: [
      {
        title: "Africa Education Icon",
        items: [
          { label: "Africa Education Icon Overview", href: "/awards/africa-education-icon" },
          {
            label: "Africa Education Philanthropy Icon",
            href: "/recognition/subpage/africa-education-philanthropy-icon",
          },
          {
            label: "Literary and New Curriculum Advocate Icon",
            href: "/recognition/subpage/literary-and-new-curriculum-advocate-icon",
          },
          {
            label: "Africa Technical Education Icon",
            href: "/recognition/subpage/africa-technical-education-icon",
          },
        ],
      },
      {
        title: "Influencer Education Impact",
        items: [
          { label: "Influencer Recognition Overview", href: "/awards/influencer-education-impact" },
          {
            label: "African Social Media Influencers Education Impact",
            href: "/recognition/subpage/african-social-media-influencers-education-impact",
          },
          {
            label: "African Sports Icons Supporting Education",
            href: "/recognition/subpage/african-sports-icons-supporting-education",
          },
          {
            label: "African Music Icons Supporting Education",
            href: "/recognition/subpage/african-music-icons-supporting-education",
          },
        ],
      },
      {
        title: "Platinum Certificate of Recognition",
        items: [
          { label: "CSR & EduTech Overview", href: "/awards/platinum" },
          { label: "Tertiary Institution Library", href: "/recognition/subpage/tertiary-institution-library" },
          { label: "Research & Development for Education", href: "/recognition/subpage/research-and-development-for-education" },
          { label: "Christian Education Impact", href: "/recognition/subpage/christian-education-impact" },
          { label: "Islamic Education Impact", href: "/recognition/subpage/islamic-education-impact" },
          { label: "Political Leadership for Education", href: "/recognition/subpage/political-leadership-for-education" },
          { label: "All CSR & EduTech categories →", href: "/awards/platinum" },
        ],
      },
      {
        title: "Gold-Blue Garnet Regional Recognition",
        items: [
          { label: "Bilateral & International Overview", href: "/awards/gold-blue-garnet" },
          { label: "CSR for Education (Africa Regional)", href: "/recognition/subpage/csr-for-education-africa-regional" },
          { label: "CSR for Education (Nigeria)", href: "/recognition/subpage/csr-for-education-nigeria" },
          { label: "EduTech Innovation (Africa)", href: "/recognition/subpage/edutech-innovation-africa" },
          { label: "Media Education Advocacy (Nigeria)", href: "/recognition/subpage/media-education-advocacy-nigeria" },
          { label: "NGO for Education (Nigeria)", href: "/recognition/subpage/ngo-for-education-nigeria" },
          { label: "STEM Education Programme (Africa)", href: "/recognition/subpage/stem-education-programme-africa" },
          { label: "All Bilateral & International categories →", href: "/awards/gold-blue-garnet" },
        ],
      },
    ],
  },
  {
    label: "Get Involved",
    href: "/community",
    analyticsId: "nav_get_involved",
    children: [
      { label: "Nominate an Enabler", href: "/nominate" },
      { label: "Join a Local Chapter / Volunteer", href: "/chapters" },
      { label: "Recommend an Independent Judge", href: "/judges/apply" },
      { label: "Apply to the Nominee Research Corps", href: "/about/nrc#apply" },
      { label: "Vacancies (13 standing roles)", href: "/vacancies" },
      { label: "Pre-Award Webinars, FGDs & Podcasts", href: "/media/webinars" },
      { label: "Full 2026–2027 Timeline", href: "/timeline" },
    ],
  },
  {
    label: "Directory",
    href: "/nominees",
    analyticsId: "nav_directory",
  },
  {
    label: "Support",
    href: "/support",
    analyticsId: "nav_support",
    children: [
      { label: "Donate", href: "/donate" },
      { label: "Merchandise", href: "/merch" },
      { label: "Sponsors & Partners", href: "/partners-sponsors" },
      { label: "Endorsements", href: "/endorsements" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

// Re-export the phase-driven CTA so consumers have one import surface.
export { NOMINATE_CTA, CURRENT_PHASE } from "./campaignPhase";
