// Single source of truth for the NESA-Africa public navigation.
// 22-page canonical architecture (2026 final refactor).

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const SITE_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About NESA-Africa", href: "/about" },
      { label: "Governance & Integrity", href: "/governance" },
      { label: "SCEF", href: "/about#scef" },
      { label: "Vision 2035", href: "/about#vision-2035" },
      { label: "FAQs", href: "/about#faq" },
    ],
  },
  {
    label: "Recognition",
    href: "/recognition",
    children: [
      { label: "Recognition Framework", href: "/recognition" },
      { label: "Africa Education Icon Award", href: "/africa-education-icon" },
      { label: "Gold-Blue Garnet Recognition", href: "/gold-blue-garnet" },
      { label: "Platinum Recognition", href: "/platinum" },
      { label: "Influencer Education Impact", href: "/influencer-impact" },
    ],
  },
  {
    label: "Directory",
    href: "/directory",
    children: [
      { label: "Africa Education Impact Directory", href: "/directory" },
      { label: "Regions", href: "/regions" },
    ],
  },
  {
    label: "Impact Programmes",
    href: "/impact",
    children: [
      { label: "Impact Programmes Hub", href: "/impact" },
      { label: "EduAid-Africa", href: "/eduaid-africa" },
      { label: "Rebuild My School Africa", href: "/rebuild-my-school" },
      { label: "Special Needs Education", href: "/special-needs" },
      { label: "Afri-EduTourism", href: "/afri-edutourism" },
    ],
  },
  {
    label: "Media & Events",
    href: "/media",
    children: [
      { label: "Media & Stories", href: "/media" },
      { label: "Gala & Tickets", href: "/gala" },
    ],
  },
  {
    label: "Get Involved",
    href: "/sponsors",
    children: [
      { label: "Sponsors & Partners", href: "/sponsors" },
      { label: "Endorsements", href: "/endorsements" },
      { label: "Local Chapters & Volunteers", href: "/chapters" },
      { label: "Merchandise", href: "/shop" },
    ],
  },
];

export const NOMINATE_CTA = { label: "Nominate", href: "/nominate" };
