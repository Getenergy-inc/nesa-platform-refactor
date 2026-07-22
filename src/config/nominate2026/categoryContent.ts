// NESA-Africa 2026 — Unified content spec for all 17 dedicated category pages.
// Single source of truth for the shared shell that powers:
//   /nominate/influencer-education-impact
//   /nominate/platinum/:category            (7 categories)
//   /nominate/gold-blue-garnet/:category    (9 categories)
//
// Note: the Africa Education Icon page is NOT part of this refactor — it lives
// on its own dedicated route and template.

import type { TierSlug } from "./forms";

export type GovernanceKey = "influencer" | "platinum" | "gold-blue-garnet";
export type ClassificationKey = "africa" | "nigeria" | "state-capacity";

export type PathwaySelector =
  | {
      kind: "single";
      label: string;
      options: string[];
    }
  | {
      kind: "dependent";
      primaryLabel: string;
      primaryOptions: string[];
      secondaryLabel: string;
      /** Keyed by primary option value */
      secondaryOptions: Record<string, string[]>;
    }
  | {
      kind: "dual";
      primaryLabel: string;
      primaryOptions: string[];
      secondaryLabel: string;
      secondaryOptions: string[];
    }
  | {
      kind: "dropdown-plus-tags";
      label: string;
      options: string[];
      tagsLabel: string;
      tags: string[];
    };

export interface CategoryContent {
  slug: string;
  tier: TierSlug;
  tierLabel: string;
  hero: {
    h1: string;
    tagline: string;
    description: string;
  };
  about: {
    paragraphs: string[];
  };
  governance: GovernanceKey;
  classification: ClassificationKey;
  pathwaySelector: PathwaySelector;
  /** Cards shown in the "Certificate Categories / Recognition Pathways" section. */
  subcategoryCards: { title: string; description?: string }[];
  /** Category-specific weighting note under the EDI matrix. */
  ediWeightingNote: string;
  /** Optional field-label overrides for the nominee-info step. */
  nomineeFieldOverrides?: {
    leadershipLabel?: string; // e.g. "Head Librarian", "Jurisdiction"
    orgNameLabel?: string; // e.g. "State", "Institution"
  };
  footerIntegrity: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared option sets
// ─────────────────────────────────────────────────────────────────────────────

const AFRICA_REGIONS = [
  "North Africa",
  "West Africa",
  "Central Africa",
  "East Africa",
  "Southern Africa",
  "Horn of Africa",
  "Sahel",
  "Indian Ocean Africa",
  "African Diaspora",
];

const NIGERIA_ZONES = [
  "North Central",
  "North East",
  "North West",
  "South East",
  "South South",
  "South West",
];

// ─────────────────────────────────────────────────────────────────────────────
// Governance blurbs
// ─────────────────────────────────────────────────────────────────────────────

export const GOVERNANCE_COPY: Record<GovernanceKey, string> = {
  influencer:
    "Not a competition. No judges, no public voting. Recognition is based entirely on Nominee Research Corps verification and category EDI Matrix assessment — never on follower count or fame.",
  platinum:
    "Institutional recognition. No judges, no voting, no competition. Multiple organisations may be recognised in the same category after Nominee Research Corps verification and Governance approval.",
  "gold-blue-garnet":
    "Entirely evidence-based. No judges, no voting, no ranking. Multiple organisations may be recognised per category, region, or sector.",
};

export const CLASSIFICATION_SETS: Record<
  ClassificationKey,
  { label: string; options: { id: string; label: string; description: string }[] }
> = {
  africa: {
    label: "How is the nominee classified?",
    options: [
      {
        id: "african-in-africa",
        label: "African in Africa",
        description:
          "African individual or African-led organisation based and operating primarily within Africa.",
      },
      {
        id: "diaspora-african",
        label: "Diaspora African",
        description:
          "African individual or African-led organisation based outside Africa whose work supports education across the continent.",
      },
      {
        id: "friend-of-africa",
        label: "Friend of Africa",
        description:
          "Non-African individual, organisation or institution making a verified contribution to education in Africa.",
      },
    ],
  },
  nigeria: {
    label: "How is the nominee classified?",
    options: [
      {
        id: "nigerian-in-nigeria",
        label: "Nigerian in Nigeria",
        description:
          "Nigerian individual or Nigerian-led organisation based and operating primarily within Nigeria.",
      },
      {
        id: "nigerian-in-diaspora",
        label: "Nigerian in Diaspora",
        description:
          "Nigerian individual or Nigerian-led organisation based outside Nigeria whose work supports education in Nigeria.",
      },
      {
        id: "friend-of-nigeria",
        label: "Friend of Nigeria",
        description:
          "Non-Nigerian individual, organisation or institution making a verified contribution to education in Nigeria.",
      },
    ],
  },
  "state-capacity": {
    label: "Nominating capacity",
    options: [
      {
        id: "state-ministry",
        label: "State Ministry of Education submission",
        description: "Official submission by a State Ministry of Education.",
      },
      {
        id: "citizen-resident",
        label: "Citizen or resident nomination",
        description: "Submitted by a citizen or resident of the nominated state.",
      },
      {
        id: "institutional-ngo",
        label: "Institutional or NGO nomination",
        description: "Submitted by an institution, NGO or civil-society organisation.",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Content — Influencer (Tier 2)
// ─────────────────────────────────────────────────────────────────────────────

const INFLUENCER_PATHWAYS = ["Social Media", "Sports", "Music"] as const;

const INFLUENCER_AREAS: Record<string, string[]> = {
  "Social Media": [
    "Digital Literacy Advocacy",
    "STEM Awareness Campaigns",
    "Girls' Education Advocacy",
    "Scholarships & Mentorship Platforms",
    "Reading & Book Culture Promotion",
    "Language & Cultural Education",
    "Skills & Vocational Awareness",
    "Peace, Values & Character Education",
    "Special Needs Education Awareness",
    "Diaspora Education Linkages",
  ],
  Sports: [
    "Sport-for-Education Scholarships",
    "Girls in Sport & Education",
    "Youth Skills through Sport",
    "School Sport Infrastructure Support",
    "Peace-through-Sport Education",
    "Refugee & IDP Sport Education",
    "Anti-Drug & Values Education via Sport",
    "Disability & Adaptive Sport Education",
    "Sport-Media Education Advocacy",
    "Community Coaching & Mentorship",
  ],
  Music: [
    "Music-for-Literacy Programmes",
    "Song-based Curriculum Support",
    "Music Scholarships & Talent Academies",
    "Girls in Music & Education Advocacy",
    "Cultural Heritage & Language Preservation",
    "Peace & Values Education through Music",
    "Music Therapy in Special Needs Education",
    "Youth Music Skills & Livelihoods",
    "Diaspora Music-Education Bridges",
    "Music Media Advocacy for Education",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Content — Platinum (7)
// ─────────────────────────────────────────────────────────────────────────────

const LIBRARY_OPTIONS = [
  "University Library Excellence",
  "Polytechnic Library Excellence",
  "College of Education Library Excellence",
  "Digital & Virtual Library Innovation",
  "Research & Special Collections",
  "Open-Access & Repository Leadership",
  "Community & Extension Library Services",
  "Inclusive Access & Assistive Services",
  "Library Staff Development & Leadership",
  "Library Infrastructure & Modernisation",
];

const RND_OPTIONS = [
  "University Research Institute Excellence",
  "Independent Research Think Tank",
  "Policy Research & Advisory Contribution",
  "STEM Research & Innovation",
  "Humanities & Social Science Research",
  "Health & Education Research",
  "Curriculum Reform Research",
  "Applied & Industrial Research",
  "Postgraduate Training & Supervision",
  "Cross-Border Research Collaboration",
];

const CHRISTIAN_OPTIONS = [
  "Mission-Founded University Excellence",
  "Faith-Based Secondary Education",
  "Faith-Based Primary & Early Years",
  "Seminary & Theological Education",
  "Christian Vocational & Skills Training",
  "Church-Led Scholarship Programmes",
  "Faith-Based Special Needs Education",
  "Christian Education Publishing & Media",
  "Community Literacy & Values Education",
  "Diaspora Christian Education Support",
];

const ISLAMIC_OPTIONS = [
  "Islamic University Excellence",
  "Madrasa & Islamiyya Modernisation",
  "Almajiri Integration & Reform",
  "Islamic Girls' Education Advocacy",
  "Qur'anic & Arabic Studies Excellence",
  "Islamic Vocational & Skills Training",
  "Islamic Scholarship & Endowment (Waqf)",
  "Islamic Special Needs Education",
  "Muslim Community Literacy Programmes",
  "Diaspora Islamic Education Support",
];

const POLITICAL_OPTIONS = [
  "Presidential Education Leadership",
  "Governor-Level Education Reform",
  "Federal Ministerial Education Leadership",
  "State Commissioner Education Leadership",
  "Legislative Education Reform Champion",
  "Local Government Education Innovation",
  "Traditional Ruler Education Advocacy",
  "Public-Sector Girls' Education Champion",
  "Education Emergency Response Leadership",
  "Cross-Party Education Coalition Leadership",
];

const INTL_PARTNERSHIP_OPTIONS = [
  "Bilateral Government Partnership",
  "Multilateral Institution Partnership",
  "Foreign University Partnership",
  "International NGO Education Partnership",
  "Development Finance Partnership",
  "Philanthropic Foundation Partnership",
  "International Faith-Based Partnership",
  "Diaspora Government Partnership",
  "Cross-Continental Research Partnership",
  "Emergency Education Response Partnership",
];

const DIASPORA_OPTIONS = [
  "Diaspora-Founded University Support",
  "Diaspora Scholarship Programmes",
  "Diaspora Mentorship & Skills Transfer",
  "Diaspora Research & Innovation Fund",
  "Diaspora School Infrastructure Support",
  "Diaspora Girls' Education Advocacy",
  "Diaspora Health-Education Programmes",
  "Diaspora Cultural & Language Education",
  "Diaspora Vocational & Enterprise Skills",
  "Diaspora Emergency Education Response",
];

// ─────────────────────────────────────────────────────────────────────────────
// Content — Gold-Blue Garnet (9)
// ─────────────────────────────────────────────────────────────────────────────

const CSR_AFRICA_SECTORS = [
  "Banking & Financial Services",
  "Telecommunications",
  "Oil, Gas & Energy",
  "Mining & Extractives",
  "Manufacturing & FMCG",
  "Agriculture & Agribusiness",
  "Technology & Digital Economy",
  "Transport & Logistics",
  "Health & Pharmaceuticals",
  "Media & Entertainment",
  "Construction & Infrastructure",
  "Insurance",
  "Retail & E-commerce",
  "Hospitality & Tourism",
  "Aviation",
  "Utilities & Water",
  "Professional Services",
  "Automotive",
  "Real Estate",
  "Conglomerates",
];

const CSR_NIGERIA_SECTORS = [
  ...CSR_AFRICA_SECTORS,
  "Fintech Startups",
  "State Government Enterprises",
  "SME Coalitions",
];

const EDUTECH_OPTIONS = [
  "K-12 Learning Platforms",
  "Higher-Education EdTech",
  "TVET & Vocational EdTech",
  "Adult Literacy EdTech",
  "STEM & Coding Platforms",
  "Language Learning Platforms",
  "Assessment & Examination Tech",
  "Teacher Development Platforms",
  "Special Needs & Accessibility EdTech",
  "Offline / Low-Bandwidth Learning",
  "AI & Adaptive Learning",
  "AR/VR & Immersive Learning",
  "Learning Management Systems",
  "EdTech Infrastructure & Devices",
  "Cross-Border EdTech Scaling",
];

const MEDIA_NIGERIA_OPTIONS = [
  "Broadcast Television Education Programming",
  "Radio Education Programming",
  "Print Journalism Education Coverage",
  "Digital & Online Education Journalism",
  "Documentary & Long-form Storytelling",
  "Investigative Education Reporting",
  "Children & Youth Media Content",
  "Public-Service Media Campaigns",
  "Faith & Values Education Media",
  "Media Literacy & Education Advocacy",
];

const NGO_NIGERIA_OPTIONS = [
  "Girls' Education & Empowerment NGO",
  "Boys' & Young Men Education NGO",
  "Out-of-School Children Recovery",
  "STEM & Digital Skills NGO",
  "Literacy & Reading Culture NGO",
  "Special Needs Education NGO",
  "TVET & Vocational Skills NGO",
  "Peace & Values Education NGO",
  "Emergency & Conflict-Zone Education NGO",
  "Community-Based Learning NGO",
];

const NGO_AFRICA_PROGRAMMES = [
  "Girls' Education Programmes",
  "Out-of-School Children Recovery",
  "STEM & Digital Skills",
  "Literacy & Reading",
  "Special Needs Inclusion",
  "TVET & Vocational Skills",
  "Peace & Values Education",
  "Refugee & IDP Education",
  "Community-Based Learning",
  "Cross-Border NGO Collaboration",
];

const STEM_OPTIONS = [
  "Girls in STEM Programmes",
  "STEM Teacher Training",
  "School STEM Laboratory Initiatives",
  "University STEM Research Programmes",
  "STEM Olympiads & Competitions",
  "Coding & Software Development Bootcamps",
  "Robotics & Engineering Programmes",
  "Applied Science & Innovation Hubs",
  "STEM for Special Needs Learners",
  "STEM Media & Public Awareness",
];

const CREATIVE_ARTS_OPTIONS = [
  "Music Education Programme",
  "Film & Screen Arts Education",
  "Dance & Choreography Education",
  "Visual Arts & Design Education",
  "Theatre & Performance Education",
  "Creative Writing & Poetry Education",
  "Fashion & Textile Education",
  "Culinary Arts Education",
  "Cultural Heritage Education",
  "Creative-Tech Crossover Education",
];

const EDU_FRIENDLY_STATE_CERTIFICATES = [
  "North Central Education-Friendly State",
  "North East Education-Friendly State",
  "North West Education-Friendly State",
  "South East Education-Friendly State",
  "South South Education-Friendly State",
  "South West Education-Friendly State",
];

const EDU_FRIENDLY_STATE_IMPACT_TAGS = [
  "Basic Education Access",
  "Girls' Education Advancement",
  "Almajiri & Out-of-School Recovery",
  "Teacher Recruitment & Training",
  "School Infrastructure Investment",
  "Digital Learning Rollout",
  "STEM Investment",
  "TVET & Skills Investment",
  "Special Needs Inclusion",
  "School Feeding & Retention",
  "Free Basic & Secondary Education",
  "Education Budget Commitment",
];

// ─────────────────────────────────────────────────────────────────────────────
// Category map
// ─────────────────────────────────────────────────────────────────────────────

const p = (paragraphs: string[]) => ({ paragraphs });

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  // ═════════════════════════════════════════════════════════════════════════
  // Influencer (Tier 2)
  // ═════════════════════════════════════════════════════════════════════════
  "influencer-education-impact": {
    slug: "influencer-education-impact",
    tier: "influencer-education-impact",
    tierLabel: "Influencer Education Impact",
    hero: {
      h1: "Influencer Education Impact Recognition 2026",
      tagline: "Public-influence Enablers of Education for All Across Africa.",
      description:
        "Recognising African public figures — in social media, sport and music — whose verified use of influence has advanced Education for All Across Africa and the African Diaspora.",
    },
    about: p([
      "The Influencer Education Impact Recognition honours the individuals whose platforms, talents and public visibility have measurably enabled learning outcomes — not the ones with the largest audience.",
      "Every nomination is independently reviewed by the Nominee Research Corps against the category Education Development Index. Recognition depends on verified education contribution — never on follower count, fame or media presence.",
    ]),
    governance: "influencer",
    classification: "africa",
    pathwaySelector: {
      kind: "dependent",
      primaryLabel: "Primary medium of influence",
      primaryOptions: [...INFLUENCER_PATHWAYS],
      secondaryLabel: "Recognition area",
      secondaryOptions: INFLUENCER_AREAS,
    },
    subcategoryCards: [
      {
        title: "Social Media",
        description:
          "Digital creators, advocates and content-led educators driving learning outcomes online.",
      },
      {
        title: "Sports",
        description:
          "Athletes, coaches and sport-for-education movements advancing access, values and skills.",
      },
      {
        title: "Music",
        description:
          "Artists, producers and music-education programmes advancing literacy, values and heritage.",
      },
    ],
    ediWeightingNote:
      "Influencer nominations are weighted toward verified reach, inclusion and evidence quality — public metrics alone are never sufficient.",
    footerIntegrity:
      "Recognition in this category is based on verified education contribution, not popularity or public vote — verified by the Nominee Research Corps and approved by Governance.",
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Platinum (7)
  // ═════════════════════════════════════════════════════════════════════════
  "tertiary-institution-library": {
    slug: "tertiary-institution-library",
    tier: "platinum",
    tierLabel: "Platinum · Institutional Recognition",
    hero: {
      h1: "Tertiary Institution Library Enablers",
      tagline: "Libraries advancing scholarship, access and knowledge across Africa.",
      description:
        "Recognises university, polytechnic and college-of-education libraries whose services have measurably enabled learning, research and scholarship across African tertiary institutions.",
    },
    about: p([
      "Libraries remain the quiet backbone of African tertiary education. This Platinum category recognises those whose collections, digital services, staff development and inclusive access have transformed how students learn and researchers work.",
      "Every nomination is verified by the Nominee Research Corps against the Library Excellence EDI Matrix. Multiple institutions may be recognised in the same category — this is not a competition.",
    ]),
    governance: "platinum",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "Certificate category",
      options: LIBRARY_OPTIONS,
    },
    subcategoryCards: LIBRARY_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward collection depth, digital transformation, inclusive access and staff-development pipelines.",
    nomineeFieldOverrides: { leadershipLabel: "Head Librarian / Head of Library Services" },
    footerIntegrity:
      "Recognition of libraries is based on verified service to scholarship — verified by the Nominee Research Corps and approved by Governance.",
  },

  "research-development": {
    slug: "research-development",
    tier: "platinum",
    tierLabel: "Platinum · Institutional Recognition",
    hero: {
      h1: "Research and Development Enablers",
      tagline: "Institutions advancing evidence, innovation and curriculum reform.",
      description:
        "Recognises research institutes, think tanks and university R&D centres whose work has measurably advanced African education policy, curriculum and innovation.",
    },
    about: p([
      "Great education systems are built on great evidence. This Platinum category honours the research bodies whose rigour has shaped policy, curriculum and practice across the continent.",
      "The Nominee Research Corps independently verifies every submission against the Research & Development EDI Matrix. Multiple institutions may be recognised.",
    ]),
    governance: "platinum",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "Certificate category",
      options: RND_OPTIONS,
    },
    subcategoryCards: RND_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward evidence quality, policy uptake and cross-border collaboration.",
    nomineeFieldOverrides: { leadershipLabel: "Director of Research / Principal Investigator" },
    footerIntegrity:
      "Recognition of research bodies is based on verified evidence contribution — verified by the Nominee Research Corps and approved by Governance.",
  },

  "christian-education-impact": {
    slug: "christian-education-impact",
    tier: "platinum",
    tierLabel: "Platinum · Institutional Recognition",
    hero: {
      h1: "Christian Enablers of Education",
      tagline: "Faith-founded institutions advancing education across Africa.",
      description:
        "Recognises churches, missions and Christian institutions whose educational work has measurably enabled Education for All Across Africa.",
    },
    about: p([
      "From the earliest missionary schools to the modern faith-founded university, Christian institutions have shaped the African education landscape. This category honours those whose contribution is verified and continues today.",
      "Every nomination is independently reviewed by the Nominee Research Corps against the Christian Education Impact EDI Matrix.",
    ]),
    governance: "platinum",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "Certificate category",
      options: CHRISTIAN_OPTIONS,
    },
    subcategoryCards: CHRISTIAN_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward verified access, inclusion and sustained community reach.",
    footerIntegrity:
      "Recognition of Christian education enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  "islamic-education-impact": {
    slug: "islamic-education-impact",
    tier: "platinum",
    tierLabel: "Platinum · Institutional Recognition",
    hero: {
      h1: "Islamic Enablers of Education",
      tagline: "Islamic institutions advancing education across Africa.",
      description:
        "Recognises Islamic universities, madrasa reform, Almajiri integration and Muslim community education programmes whose contribution has measurably enabled Education for All Across Africa.",
    },
    about: p([
      "This category honours the full breadth of Islamic education enablers — from established Islamic universities to grassroots Almajiri integration programmes — whose verified work supports learning access and quality.",
      "Every nomination is independently reviewed by the Nominee Research Corps against the Islamic Education Impact EDI Matrix.",
    ]),
    governance: "platinum",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "Certificate category",
      options: ISLAMIC_OPTIONS,
    },
    subcategoryCards: ISLAMIC_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward inclusion, gender equity, out-of-school recovery and community reach.",
    footerIntegrity:
      "Recognition of Islamic education enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  "political-leadership": {
    slug: "political-leadership",
    tier: "platinum",
    tierLabel: "Platinum · Institutional Recognition",
    hero: {
      h1: "Political Leadership Enablers of Education",
      tagline: "Public officials driving systemic education reform.",
      description:
        "Recognises heads of state, governors, ministers and legislators whose leadership has produced measurable, verifiable education outcomes.",
    },
    about: p([
      "Systemic education change is impossible without political will. This category honours public officials whose in-office decisions and delivery have verifiably expanded access, equity and quality.",
      "Every nomination is reviewed by the Nominee Research Corps against the Political Leadership EDI Matrix. Recognition is based on verified reform outcomes — not political affiliation.",
    ]),
    governance: "platinum",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "Certificate category",
      options: POLITICAL_OPTIONS,
    },
    subcategoryCards: POLITICAL_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward verified reform outcomes, budget delivery and system-level impact — never political affiliation.",
    nomineeFieldOverrides: { leadershipLabel: "Office / Title", orgNameLabel: "Jurisdiction" },
    footerIntegrity:
      "Recognition of political leaders is based on verified education reform outcomes — verified by the Nominee Research Corps and approved by Governance.",
  },

  "international-partnership": {
    slug: "international-partnership",
    tier: "platinum",
    tierLabel: "Platinum · Institutional Recognition",
    hero: {
      h1: "International Partnership Enablers",
      tagline: "Bilateral and multilateral partners funding African education.",
      description:
        "Recognises international governments, multilateral bodies, foreign universities and philanthropic foundations whose partnerships have measurably advanced African education.",
    },
    about: p([
      "Cross-border partnership is a decisive engine of African education. This category recognises the international partners whose sustained investment is verifiable in African classrooms and campuses.",
      "Every nomination is reviewed by the Nominee Research Corps against the International Partnership EDI Matrix.",
    ]),
    governance: "platinum",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "Certificate category",
      options: INTL_PARTNERSHIP_OPTIONS,
    },
    subcategoryCards: INTL_PARTNERSHIP_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward sustained multi-year commitment, African-led design and verified outcomes on the ground.",
    footerIntegrity:
      "Recognition of international partners is based on verified impact on African education — verified by the Nominee Research Corps and approved by Governance.",
  },

  "diaspora-education-impact": {
    slug: "diaspora-education-impact",
    tier: "platinum",
    tierLabel: "Platinum · Institutional Recognition",
    hero: {
      h1: "Diaspora Educational Impact Enablers",
      tagline: "Diaspora institutions supporting education across the continent.",
      description:
        "Recognises African diaspora institutions, scholarship funds and mentorship networks whose contribution has measurably advanced Education for All Across Africa.",
    },
    about: p([
      "The African diaspora is a living education infrastructure — sending remittances, scholarships, skills and networks back into the continent's classrooms. This category honours the diaspora institutions doing that work at scale.",
      "Every nomination is reviewed by the Nominee Research Corps against the Diaspora Education Impact EDI Matrix.",
    ]),
    governance: "platinum",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "Certificate category",
      options: DIASPORA_OPTIONS,
    },
    subcategoryCards: DIASPORA_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward sustained cross-border contribution, verified beneficiaries and African-led co-design.",
    footerIntegrity:
      "Recognition of diaspora education enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Gold-Blue Garnet (9)
  // ═════════════════════════════════════════════════════════════════════════
  "africa-regional-csr": {
    slug: "africa-regional-csr",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Africa Regional CSR Enablers of Education",
      tagline: "Corporate citizenship advancing education across African regions.",
      description:
        "Regional Certificate of Recognition for companies whose CSR programmes have measurably advanced Education for All Across Africa.",
    },
    about: p([
      "This category honours companies whose corporate social responsibility for education is verifiable, sustained and regionally grounded — not one-off campaigns.",
      "Every nomination is reviewed by the Nominee Research Corps against the CSR-Africa EDI Matrix. Multiple organisations may be recognised per region and per sector.",
    ]),
    governance: "gold-blue-garnet",
    classification: "africa",
    pathwaySelector: {
      kind: "dual",
      primaryLabel: "African region",
      primaryOptions: AFRICA_REGIONS,
      secondaryLabel: "Industry sector",
      secondaryOptions: CSR_AFRICA_SECTORS,
    },
    subcategoryCards: AFRICA_REGIONS.map((title) => ({
      title,
      description: "Regional CSR Enabler Certificate of Recognition.",
    })),
    ediWeightingNote:
      "Weighted toward multi-year CSR commitment, verified beneficiaries and regional depth.",
    footerIntegrity:
      "Recognition of CSR Enablers is based on verified educational impact — not brand marketing — verified by the Nominee Research Corps and approved by Governance.",
  },

  "nigeria-csr": {
    slug: "nigeria-csr",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Nigeria CSR Enablers of Education",
      tagline: "Corporate citizenship advancing education across Nigeria's zones.",
      description:
        "Regional Certificate of Recognition for Nigerian and Nigeria-operating companies whose CSR has measurably advanced education in the country.",
    },
    about: p([
      "This category honours Nigerian and Nigeria-operating companies whose CSR for education is verifiable, sustained and zonally grounded.",
      "Every nomination is reviewed by the Nominee Research Corps against the CSR-Nigeria EDI Matrix.",
    ]),
    governance: "gold-blue-garnet",
    classification: "nigeria",
    pathwaySelector: {
      kind: "dual",
      primaryLabel: "Nigerian geopolitical zone",
      primaryOptions: NIGERIA_ZONES,
      secondaryLabel: "Industry sector",
      secondaryOptions: CSR_NIGERIA_SECTORS,
    },
    subcategoryCards: NIGERIA_ZONES.map((title) => ({
      title,
      description: "Zonal CSR Enabler Certificate of Recognition.",
    })),
    ediWeightingNote:
      "Weighted toward multi-year CSR commitment, verified beneficiaries and zonal depth.",
    footerIntegrity:
      "Recognition of Nigeria CSR Enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  "africa-edutech": {
    slug: "africa-edutech",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Africa EduTech Enablers",
      tagline: "EdTech advancing digital learning across Africa.",
      description:
        "Regional Certificate of Recognition for EdTech organisations whose products and platforms have measurably advanced learning access and outcomes across Africa.",
    },
    about: p([
      "This category honours EdTech organisations whose deployed products — not pitch decks — have verifiably reached African learners at scale.",
      "Every nomination is reviewed by the Nominee Research Corps against the EduTech EDI Matrix.",
    ]),
    governance: "gold-blue-garnet",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "EduTech recognition area",
      options: EDUTECH_OPTIONS,
    },
    subcategoryCards: EDUTECH_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward verified active learners, offline resilience and inclusion.",
    footerIntegrity:
      "Recognition of EduTech Enablers is based on verified reach and outcomes — verified by the Nominee Research Corps and approved by Governance.",
  },

  "nigeria-media": {
    slug: "nigeria-media",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Nigeria Media Enablers of Education",
      tagline: "Media organisations amplifying education across Nigeria.",
      description:
        "Regional Certificate of Recognition for broadcast, print and digital media whose editorial commitment to education is verifiable and sustained.",
    },
    about: p([
      "This category honours the media houses whose reporting, programming and campaigns have measurably advanced public understanding of and investment in Nigerian education.",
      "Every nomination is reviewed by the Nominee Research Corps against the Media EDI Matrix.",
    ]),
    governance: "gold-blue-garnet",
    classification: "nigeria",
    pathwaySelector: {
      kind: "single",
      label: "Media recognition area",
      options: MEDIA_NIGERIA_OPTIONS,
    },
    subcategoryCards: MEDIA_NIGERIA_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward sustained editorial commitment, reach and demonstrated public-education outcomes.",
    footerIntegrity:
      "Recognition of media enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  "nigeria-ngo": {
    slug: "nigeria-ngo",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Nigeria NGO Enablers of Education",
      tagline: "NGOs advancing education across Nigeria.",
      description:
        "Regional Certificate of Recognition for Nigerian NGOs whose programmes have measurably advanced learning access, equity and outcomes.",
    },
    about: p([
      "This category honours the Nigerian NGOs whose programmes are verifiable at the classroom and community level — not just at donor-report level.",
      "Every nomination is reviewed by the Nominee Research Corps against the NGO-Nigeria EDI Matrix.",
    ]),
    governance: "gold-blue-garnet",
    classification: "nigeria",
    pathwaySelector: {
      kind: "single",
      label: "NGO recognition area",
      options: NGO_NIGERIA_OPTIONS,
    },
    subcategoryCards: NGO_NIGERIA_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward verified beneficiaries, inclusion and multi-year continuity.",
    footerIntegrity:
      "Recognition of NGO Enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  "africa-regional-ngo": {
    slug: "africa-regional-ngo",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Africa Regional NGO Enablers of Education",
      tagline: "NGOs advancing education across African regions.",
      description:
        "Regional Certificate of Recognition for African and Africa-operating NGOs whose programmes have measurably advanced Education for All.",
    },
    about: p([
      "This category honours NGOs whose regional education programmes are verifiable, sustained and beneficiary-focused.",
      "Every nomination is reviewed by the Nominee Research Corps against the NGO-Africa EDI Matrix.",
    ]),
    governance: "gold-blue-garnet",
    classification: "africa",
    pathwaySelector: {
      kind: "dual",
      primaryLabel: "African region",
      primaryOptions: AFRICA_REGIONS,
      secondaryLabel: "Programme area",
      secondaryOptions: NGO_AFRICA_PROGRAMMES,
    },
    subcategoryCards: AFRICA_REGIONS.map((title) => ({
      title,
      description: "Regional NGO Enabler Certificate of Recognition.",
    })),
    ediWeightingNote:
      "Weighted toward verified beneficiaries, inclusion and cross-border continuity.",
    footerIntegrity:
      "Recognition of regional NGO Enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  "africa-stem": {
    slug: "africa-stem",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Africa STEM Programme Enablers",
      tagline: "Programmes advancing science, technology and mathematics education.",
      description:
        "Regional Certificate of Recognition for STEM programmes whose verified reach has advanced African learners' access to science, technology, engineering and mathematics.",
    },
    about: p([
      "This category honours the STEM programmes whose classroom, laboratory and community delivery is verifiable — especially those closing gender and inclusion gaps.",
      "Every nomination is reviewed by the Nominee Research Corps against the STEM EDI Matrix.",
    ]),
    governance: "gold-blue-garnet",
    classification: "africa",
    pathwaySelector: {
      kind: "single",
      label: "STEM recognition area",
      options: STEM_OPTIONS,
    },
    subcategoryCards: STEM_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward verified learners reached, gender equity and inclusion.",
    footerIntegrity:
      "Recognition of STEM Enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  "nigeria-creative-arts": {
    slug: "nigeria-creative-arts",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Nigeria Creative Arts Enablers of Education",
      tagline: "Creative-arts programmes advancing education across Nigeria.",
      description:
        "Regional Certificate of Recognition for creative-arts programmes whose verified delivery has advanced skills, employability and cultural learning across Nigeria.",
    },
    about: p([
      "This category honours the creative-arts programmes whose training pipelines are verifiable at the learner and community level — from grassroots music schools to national creative academies.",
      "Every nomination is reviewed by the Nominee Research Corps against the Creative Arts EDI Matrix.",
    ]),
    governance: "gold-blue-garnet",
    classification: "nigeria",
    pathwaySelector: {
      kind: "single",
      label: "Creative Arts recognition area",
      options: CREATIVE_ARTS_OPTIONS,
    },
    subcategoryCards: CREATIVE_ARTS_OPTIONS.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward verified learner outcomes, inclusion and sustained delivery.",
    footerIntegrity:
      "Recognition of Creative Arts Enablers is based on verified educational impact — verified by the Nominee Research Corps and approved by Governance.",
  },

  "nigeria-education-friendly-states": {
    slug: "nigeria-education-friendly-states",
    tier: "gold-blue-garnet",
    tierLabel: "Gold-Blue Garnet · Regional Recognition",
    hero: {
      h1: "Nigeria Education-Friendly States Recognition",
      tagline: "Certificate of Recognition for state-level education commitment.",
      description:
        "Non-competitive Regional Certificate of Recognition for Nigerian states whose verified investment in education has measurably advanced learning access and outcomes.",
    },
    about: p([
      "This category recognises Nigerian states whose education budgeting, delivery and reform decisions are verifiable at the school and learner level.",
      "Every nomination is reviewed by the Nominee Research Corps against the Education-Friendly States EDI Matrix. This is not a ranking — multiple states may be recognised per zone.",
    ]),
    governance: "gold-blue-garnet",
    classification: "state-capacity",
    pathwaySelector: {
      kind: "dropdown-plus-tags",
      label: "Certificate category",
      options: EDU_FRIENDLY_STATE_CERTIFICATES,
      tagsLabel: "Verified impact areas (multi-select)",
      tags: EDU_FRIENDLY_STATE_IMPACT_TAGS,
    },
    subcategoryCards: EDU_FRIENDLY_STATE_CERTIFICATES.map((title) => ({ title })),
    ediWeightingNote:
      "Weighted toward verified budget delivery, access outcomes and inclusion — never political affiliation.",
    nomineeFieldOverrides: { orgNameLabel: "State" },
    footerIntegrity:
      "Recognition of Education-Friendly States is based on verified education-sector outcomes — verified by the Nominee Research Corps and approved by Governance.",
  },
};

export function getCategoryContent(slug: string): CategoryContent | undefined {
  return CATEGORY_CONTENT[slug];
}

export function listCategoryContent(): CategoryContent[] {
  return Object.values(CATEGORY_CONTENT);
}
