// Single source of truth for the NESA-Africa public navigation.
// Final 7-item architecture (2026 nav refactor).
//
// Controlling principle: One navbar. Seven clear destinations.
// One Nominate button. One language selector. One account action.

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
    label: "Recognition 2026",
    href: "/recognition",
    children: [
      { label: "2026 Recognition Season", href: "/recognition" },
      { label: "Africa Education Icon", href: "/recognition/africa-education-icon" },
      { label: "Influencer Education Impact", href: "/recognition/influencer-education-impact" },
      { label: "Platinum Recognition", href: "/recognition/platinum" },
      { label: "Gold-Blue Garnet Recognition", href: "/recognition/gold-blue-garnet" },
      { label: "Recognition Timeline", href: "/timeline" },
    ],
  },
  { label: "Education Enablers", href: "/education-enablers" },
  {
    label: "EduAid-Africa",
    href: "/eduaid-africa",
    children: [
      { label: "EduAid-Africa Overview", href: "/eduaid-africa" },
      { label: "EduAid-Africa Webinar Series", href: "/eduaid-africa#webinars" },
      { label: "Rebuild My School Africa 2027", href: "/eduaid-africa#rebuild-my-school" },
      { label: "Nominate a Special-Needs School", href: "/eduaid-africa#nominate-special-needs-school" },
      { label: "Afri-EduTourism", href: "/eduaid-africa#afri-edutourism" },
    ],
  },
  {
    label: "Media",
    href: "/media",
    children: [
      { label: "NESA-Africa TV", href: "/media#nesa-tv" },
      { label: "News and Interviews", href: "/media#news" },
      { label: "Webinars", href: "/media#webinars" },
      { label: "Galleries", href: "/media#galleries" },
      { label: "Media Accreditation", href: "/media#accreditation" },
    ],
  },
  {
    label: "Gala",
    href: "/gala",
    children: [
      { label: "Gala Overview", href: "/gala" },
      { label: "Tickets and Tables", href: "/gala#tickets" },
      { label: "Delegates", href: "/gala#delegates" },
      { label: "Media Accreditation", href: "/gala#media" },
    ],
  },
  {
    label: "Get Involved",
    href: "/support",
    children: [
      { label: "Sponsor", href: "/support#sponsor" },
      { label: "Partner", href: "/support#partner" },
      { label: "Donate", href: "/support#donate" },
      { label: "Volunteer", href: "/support#volunteer" },
      { label: "Local Chapters", href: "/support#chapters" },
      { label: "Contact", href: "/support#contact" },
    ],
  },
];

export const NOMINATE_CTA = { label: "Nominate", href: "/nominate" };
