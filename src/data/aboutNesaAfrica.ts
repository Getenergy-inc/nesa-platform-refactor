// Canonical About NESA-Africa copy — single source of truth for /about.
// Tone: evidence-first, integrity-focused. Do not commercialise this language.

export const ABOUT_BRAND = {
  name: "New Education Standard Award Africa",
  short: "NESA-Africa",
  alias: "The African Blue-Garnet Awards for Recognising Africa’s Education Enablers",
  tagline: "Recognising Africa’s Education Enablers",
  pathway: [
    "Recognition",
    "Visibility",
    "Partnership",
    "Funding",
    "Intervention",
    "Legacy",
  ],
  ecosystemNote:
    "An education-impact service within the Santos Creations Educational Foundation ecosystem.",
} as const;

export const ABOUT_PURPOSE_LINES = [
  "They provide scholarships.",
  "They build schools and universities.",
  "They train teachers.",
  "They create libraries and curricula.",
  "They introduce children to science and technology.",
  "They support girls and vulnerable learners.",
  "They finance infrastructure.",
  "They advocate for stronger systems.",
  "They create educational media.",
  "They deliver vocational and technical skills.",
  "They mobilise communities and resources.",
];

export const ABOUT_WORK_ITEMS = [
  "Identify genuine Education Enablers",
  "Verify their contributions through evidence",
  "Recognise exceptional impact",
  "Document their education legacy",
  "Amplify their stories across Africa and globally",
  "Connect recognition to partnerships and resources",
  "Mobilise support for education interventions",
  "Preserve their contribution within Africa's education-impact history",
];

export const ABOUT_ENABLER_TYPES = [
  "Educators and technical trainers",
  "Philanthropists and scholarship providers",
  "University or school builders",
  "Curriculum developers, authors and publishers",
  "Library champions",
  "STEM, ICT and EdTech innovators",
  "Corporate CSR leaders",
  "NGOs, foundations and faith-based organisations",
  "Governments, ministries and development partners",
  "Media organisations and social-impact creators",
  "Sports or music personalities",
  "Diaspora contributors and community leaders",
  "Friends of Africa",
];

export interface AboutTier {
  id: string;
  tier: string;
  title: string;
  kicker?: string;
  body: string;
  pathways?: { name: string; detail: string }[];
  note?: string;
  href: string;
}

export const ABOUT_TIERS: AboutTier[] = [
  {
    id: "tier-1",
    tier: "Tier 1",
    title: "Africa Education Icon Award",
    kicker: "Lifetime Achievement Recognition",
    body:
      "NESA-Africa's highest individual recognition for sustained and transformative contributions to education.",
    pathways: [
      {
        name: "Africa Education Philanthropy Icon",
        detail:
          "Long-term philanthropy, scholarships, institution-building and educational funding",
      },
      {
        name: "Literary & New Curriculum Advocate Icon",
        detail: "Literacy, books, publishing, curricula and educational advocacy",
      },
      {
        name: "Africa Technical Educator Icon",
        detail:
          "STEM, engineering, ICT, digital skills, technical and vocational education",
      },
    ],
    note:
      "Tier 1 is the only pathway that proceeds from NRC verification into independent judging, Grand Jury review and Governance ratification.",
    href: "/awards/africa-education-icon",
  },
  {
    id: "tier-2",
    tier: "Tier 2",
    title: "Influencer Education Impact Recognition",
    body:
      "Public figures, creators, athletes, musicians and influential personalities whose verified programmes, campaigns or personal interventions have advanced education.",
    note: "Impact is measured by evidence — not follower count or celebrity status.",
    href: "/awards/influencer-education-impact",
  },
  {
    id: "tier-3",
    tier: "Tier 3",
    title: "Platinum Certificates of Recognition",
    body:
      "Institutions and leadership whose sustained contributions strengthen educational systems, access, quality, innovation, infrastructure, inclusion and continental collaboration.",
    href: "/awards/platinum",
  },
  {
    id: "tier-4",
    tier: "Tier 4",
    title: "Gold-Blue Garnet Recognition",
    body:
      "Organisations, companies, NGOs, governments, states, education programmes and other sector or regional Education Enablers whose verified interventions are advancing Education for All.",
    href: "/awards/gold-blue-garnet",
  },
];

export const ABOUT_PROCESS = {
  shared: [
    "Nomination",
    "Nominee Acceptance / Identity Confirmation",
    "Nominee Research Corps (NRC)",
    "Eligibility Review",
    "Duplicate & Identity Checks",
    "Evidence Collection & Validation",
    "Education Development Index (EDI) Assessment",
    "Human NRC Review",
  ],
  tier1: [
    "NRC Verified",
    "Judges Arena",
    "Moderation",
    "Grand Jury",
    "Governance Ratification",
    "Africa Education Icon Laureates",
  ],
  tiers234: ["NRC Verified", "Governance Review", "Certificate / Recognition Record"],
};

export const ABOUT_NRC_QUESTIONS = [
  "Who the nominee is",
  "What educational contribution they made",
  "When and where it occurred",
  "Who benefited",
  "Whether the contribution can be independently verified",
  "Category fit and evidence quality",
  "Whether the nominee should proceed",
];

export const ABOUT_EDI_CRITERIA = [
  "Lifetime or cumulative impact",
  "Scale and reach",
  "Educational access and inclusion",
  "Innovation and sustainability",
  "Measurable outcomes",
  "Partnerships and continental relevance",
  "Leadership, integrity and evidence quality",
];

export const ABOUT_FIREWALL_ITEMS = [
  "Nomination acceptance",
  "NRC verification",
  "EDI assessment",
  "Judge assignment or scores",
  "Finalist selection",
  "Grand Jury or Governance decisions",
  "Recognition outcomes",
];

export const ABOUT_PATHWAY_STEPS = [
  { step: "Recognition", detail: "Identify and celebrate verified Education Enablers" },
  { step: "Visibility", detail: "Document and amplify their stories" },
  { step: "Partnerships", detail: "Connect Enablers to institutions and collaborators" },
  { step: "Funding", detail: "Mobilise legitimate support for educational interventions" },
  {
    step: "Intervention",
    detail: "Direct attention and resources toward practical education needs",
  },
  { step: "Legacy", detail: "Preserve impact and help successful interventions scale" },
];

export const ABOUT_ECOSYSTEM = [
  { platform: "NESA-Africa", focus: "Recognition & Education Impact Intelligence", href: "/" },
  { platform: "EduAid-Africa", focus: "Educational Access & Mobilisation", href: "/impact/friends-of-eduaid-africa" },
  { platform: "Rebuild My School Africa", focus: "Educational Infrastructure", href: "/programs" },
  { platform: "eLibrary Nigeria", focus: "Knowledge & Digital Learning", href: "/programs" },
  { platform: "NESA-Africa TV / SCEF Media", focus: "Education Storytelling", href: "/media" },
];

export const ABOUT_REACH = [
  "African countries through the NESA-Africa regional structure",
  "Africans living on the continent",
  "Africans in the Diaspora",
  "Friends of Africa whose verified contributions support African education",
];

export const ABOUT_PROMISE = [
  "Evidence matters more than popularity",
  "Educational contribution matters more than celebrity",
  "Integrity matters more than sponsorship",
  "Recognition leads to measurable impact",
  "Africa's genuine Education Enablers are documented for generations",
];

export const ABOUT_TAKE_PART = [
  {
    title: "Nominate an Education Enabler",
    detail: "Nominate for NESA-Africa 2026",
    href: "/nominate",
  },
  {
    title: "Explore Education Enablers",
    detail: "Visit the Africa Education Impact Directory",
    href: "/nominees",
  },
  {
    title: "Support Education Impact",
    detail: "Become a Partner or Sponsor (within the Integrity Firewall)",
    href: "/sponsors",
  },
  {
    title: "Join the Movement",
    detail: "Volunteer, serve in the NRC, or contribute professional expertise",
    href: "/movement",
  },
];
