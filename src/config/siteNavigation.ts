// Single source of truth for the NESA-Africa public navigation.
// Consumed by both desktop and mobile renderers in SiteHeader.

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
    label: "Recognition",
    href: "/recognition",
    children: [
      { label: "Recognition Overview", href: "/recognition" },
      { label: "Gold-Blue Garnet Recognition", href: "/recognition/gold-blue-garnet" },
      { label: "Platinum Recognition", href: "/recognition/platinum" },
      { label: "Africa Education Icon Award", href: "/recognition/africa-education-icon" },
      { label: "Influencer Education Impact", href: "/recognition/influencer-education-impact" },
      { label: "All 18 Award Categories", href: "/recognition#award-categories" },
      { label: "NESA-Africa 2026 Timeline", href: "/timeline" },
      { label: "Governance and Integrity", href: "/governance" },
    ],
  },
  {
    label: "Impact Directory",
    href: "/directory",
    children: [
      { label: "Explore the Directory", href: "/directory" },
      { label: "Recognised Education Enablers", href: "/directory?status=recognised" },
      { label: "Africa Education Icon Laureates", href: "/directory?tier=africa-education-icon" },
      { label: "Institutions and Organisations", href: "/directory?type=organisation" },
      { label: "Browse by Region", href: "/regions" },
      { label: "Browse by Category", href: "/directory?view=categories" },
    ],
  },
  {
    label: "Impact Programmes",
    href: "/impact",
    children: [
      { label: "Impact Programmes Overview", href: "/impact" },
      { label: "EduAid-Africa", href: "/eduaid-africa" },
      { label: "Rebuild My School Africa", href: "/rebuild-my-school" },
      { label: "Special-Needs Education", href: "/special-needs" },
      { label: "Afri-EduTourism", href: "/afri-edutourism" },
      { label: "Scholarships", href: "/eduaid-africa#scholarships" },
      { label: "Training and Capacity Development", href: "/eduaid-africa#training" },
      { label: "School Interventions", href: "/eduaid-africa#school-interventions" },
      { label: "Continental Impact Reporting", href: "/eduaid-africa#impact-reporting" },
    ],
  },
  {
    label: "Media & Events",
    href: "/media",
    children: [
      { label: "Media and Events Hub", href: "/media" },
      { label: "NESA-Africa TV", href: "/media#nesa-tv" },
      { label: "EduAid-Africa Webinars", href: "/media#webinars" },
      { label: "Recognition Shows", href: "/media#recognition-shows" },
      { label: "News and Press Releases", href: "/media#news" },
      { label: "Interviews and Documentaries", href: "/media#interviews" },
      { label: "Podcasts and Radio", href: "/media#podcasts" },
      { label: "Photo and Video Galleries", href: "/media#galleries" },
      { label: "Media Accreditation", href: "/media#accreditation" },
    ],
  },
  {
    label: "Gala & Tickets",
    href: "/gala",
    children: [
      { label: "Gala Overview", href: "/gala" },
      { label: "Buy Individual Tickets", href: "/gala#tickets" },
      { label: "Book a Table", href: "/gala#tables" },
      { label: "Institutional Delegates", href: "/gala#delegates" },
      { label: "Sponsor Hospitality", href: "/gala#hospitality" },
      { label: "Media Accreditation", href: "/gala#media" },
      { label: "Gala FAQs", href: "/gala#faq" },
    ],
  },
  {
    label: "Support & Get Involved",
    href: "/support",
    children: [
      { label: "Support Overview", href: "/support" },
      { label: "Become a Sponsor", href: "/support#sponsors" },
      { label: "Become a Partner", href: "/support#partners" },
      { label: "Donate", href: "/support#donate" },
      { label: "Volunteer", href: "/support#volunteers" },
      { label: "Become an Ambassador", href: "/support#ambassadors" },
      { label: "Join a Local Chapter", href: "/support#chapters" },
      { label: "Buy Merchandise", href: "/support#merchandise" },
      { label: "Contact and Help", href: "/support#contact" },
    ],
  },
];

export const NOMINATE_CTA = { label: "Nominate", href: "/nominate" };
