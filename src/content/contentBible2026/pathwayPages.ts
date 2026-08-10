/**
 * NESA-Africa 2026 — Pathway Pages Content Bible
 * Single source of truth for all 9 Blue Garnet + 7 Platinum detailed category pages.
 *
 * 2026 Policy: Blue Garnet is a non-competitive Recognition Edition (no public voting,
 * no popularity ranking). Platinum is jury-only, evidence-based. Competitive Blue Garnet
 * begins from 2027.
 */

export type AwardTier = "blue-garnet" | "platinum";

export interface CTA {
  label: string;
  href: string;
}

export interface EdiCriterion {
  area: string;
  score: number;
  measures: string;
}

export interface ThresholdBand {
  range: string;
  label: string;
}

export interface CategorySubcategory {
  id: string; // slug or UUID as it exists today; never invented
  title: string;
  description: string;
  nomineeType: string;
  scope: string;
  exploreHref: string;
  nominateHref: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface DetailedAwardCategoryPage {
  id: string;
  route: string;
  awardTier: AwardTier;
  badge: string;
  title: string;
  subtitle: string;
  scope: "nigeria" | "africa-8" | "continental" | "international" | "african-diaspora";
  heroImageKey?: string;
  heroAlt: string;
  primaryCta: CTA;
  secondaryCta: CTA;
  overview: [string, string, string];
  enablerStory: string;
  sdgPills: string[];
  eligibleNomineeTypes: string[];
  scoringEmphasis?: string[];
  subcategories: CategorySubcategory[];
  nominationCta: { heading: string; body: string; href: string };
  nomineeCatalogue: {
    categoryTitle: string; // maps to BrandedNomineeDirectory categoryName
    grouping: "subcategory" | "region" | "state" | "nominee_type";
  };
  faqs: FAQItem[];
  seo: { title: string; description: string; canonical: string };
}

// ---------- Shared constants ----------

export const EDI_MATRIX: EdiCriterion[] = [
  { area: "Evidence Quality", score: 20, measures: "Official reports, programme pages, agreements, verified data, and independent sources" },
  { area: "Education Access", score: 15, measures: "Learners reached, scholarships, enrolment, infrastructure, or access created" },
  { area: "Learning Quality", score: 15, measures: "Learning outcomes, teacher development, curriculum, STEM, TVET, or digital learning" },
  { area: "Equity and Inclusion", score: 15, measures: "Girls, disability inclusion, refugees, rural learners, and underserved communities" },
  { area: "Scale and Reach", score: 10, measures: "Schools, communities, states, countries, institutions, and beneficiaries reached" },
  { area: "Sustainability", score: 10, measures: "Continuity, partnerships, funding model, institutional capacity, and long-term design" },
  { area: "Innovation", score: 10, measures: "New methods, technology, delivery models, research, or scalable solutions" },
  { area: "Story and Documentary Value", score: 5, measures: "Human impact, testimonials, visibility, and evidence suitable for public learning" },
];

export const THRESHOLDS: Record<AwardTier, ThresholdBand[]> = {
  platinum: [
    { range: "90–100", label: "Platinum Recognition of Distinction" },
    { range: "80–89", label: "Platinum Recognition" },
    { range: "70–79", label: "Platinum Watchlist" },
    { range: "Below 70", label: "Not Yet Published" },
  ],
  "blue-garnet": [
    { range: "90–100", label: "Verified Education Enabler of Distinction" },
    { range: "80–89", label: "Verified Education Enabler" },
    { range: "70–79", label: "Education Impact Watchlist" },
    { range: "Below 70", label: "Further Evidence Required" },
  ],
};

export const BADGES: Record<AwardTier, string> = {
  "blue-garnet": "2026 Recognition Edition",
  platinum: "Jury-Only Institutional Recognition",
};

export const BENEFITS = {
  nominees: [
    "Recognition of verified education impact",
    "Dedicated public Education Impact Profile",
    "Certificate or institutional recognition document",
    "Letter of Appreciation or Recognition",
    "Visibility through NESA-Africa media",
    "Opportunity to update impact annually",
    "Discovery by potential partners, funders, researchers, and communities",
  ],
  nominators: [
    "Opportunity to bring overlooked impact into continental view",
    "Recognition as a contributor to Africa's education-impact record",
    "Ability to track the nomination",
    "Participation in a transparent recognition process",
    "Opportunity to support evidence and nominee storytelling",
  ],
  region: [
    "Greater visibility for local education solutions",
    "Stronger regional data on Education Enablers",
    "New opportunities for collaboration and investment",
    "Identification of programmes that can be scaled or replicated",
    "Better representation in the Africa Education Impact Directory",
  ],
  africa: [
    "A verified continental record of education contribution",
    "Cross-border knowledge sharing",
    "Stronger partnerships around Education for All",
    "Increased visibility for sustainable African solutions",
    "Evidence to support policy, research, funding, and advocacy",
  ],
};

export const TIMELINE_STAGES = [
  "Nominations Open",
  "Automated Screening and Duplicate Detection",
  "Nominee Invitation and Acceptance",
  "Profile Completion",
  "NRC Evidence Verification",
  "Jury or Governance Review",
  "Recognition Approval",
  "Public Profile Publication",
  "Recognition Package",
  "Optional Gala Participation",
];

export const GALA_NOTE =
  "The NESA-Africa 2026 Gala and Awards Ceremony is scheduled for 13 December 2026 in Lagos, Nigeria. Attendance is optional and does not affect recognition.";

export const RECOGNITION_PACKAGE: Record<AwardTier, string[]> = {
  "blue-garnet": [
    "Digital Certificate of Recognition",
    "Letter of Appreciation",
    "Verified Education Impact Profile",
    "Africa Education Impact Directory listing",
    "NESA TV or media-story consideration",
    "Annual profile-update access",
  ],
  platinum: [
    "Platinum Digital Certificate",
    "Official Letter of Recognition",
    "Verified Institutional Profile",
    "NESA TV feature consideration",
    "Relevant institutional directory listing",
    "Optional Gala presentation request",
  ],
};

export const TRUST_LINKS: CTA[] = [
  { label: "Independent Governance", href: "/governance" },
  { label: "NRC Verification", href: "/judgeapply/nrc" },
  { label: "Public Reporting", href: "/impact" },
  { label: "Policies", href: "/policies" },
  { label: "Full FAQ", href: "/faqs" },
];

export const EVIDENCE_CHECKLIST = [
  "Official programme page or annual report",
  "Government, school, or partner confirmation",
  "Beneficiary figures",
  "Photographs or video of delivery",
  "Signed agreement or MoU",
  "Beneficiary or institutional testimonial",
  "Independent media coverage",
  "Evidence of continuity beyond a one-time activity",
];

export const POLICY_2026_NOTE =
  "Platinum is jury-only and evidence-based. Blue Garnet 2026 is a non-competitive Recognition Edition; the competitive Blue Garnet framework begins from 2027. Community endorsements are expressions of appreciation, not votes.";

// ---------- Helpers ----------

const nominateHref = (family: "gold-blue-garnet" | "platinum-recognition", categorySlug: string) =>
  `/nominate?tier=${family}&family=${family}&category=${categorySlug}`;

const exploreHref = (categoryName: string) =>
  `/nominees?category=${encodeURIComponent(categoryName)}`;

const sub = (
  id: string,
  title: string,
  description: string,
  nomineeType: string,
  scope: string,
  parentCategorySlug: string,
  family: "gold-blue-garnet" | "platinum-recognition",
  parentCategoryName: string,
): CategorySubcategory => ({
  id,
  title,
  description,
  nomineeType,
  scope,
  exploreHref: `${exploreHref(parentCategoryName)}&subcategory=${encodeURIComponent(id)}`,
  nominateHref: `${nominateHref(family, parentCategorySlug)}&subcategory=${encodeURIComponent(id)}`,
});

// ---------- Page catalogue ----------

const pages: Record<string, DetailedAwardCategoryPage> = {
  // ================= BLUE GARNET =================
  "bg-csr-africa": {
    id: "bg-csr-africa",
    route: "/awards/csr-education",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "Corporate Social Responsibility for Education — Africa",
    subtitle: "Recognising companies and corporate foundations investing in measurable education impact across Africa's eight regions.",
    scope: "africa-8",
    heroAlt: "Corporate-supported African school with learners and teachers",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-csr-for-education-africa-regional") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best CSR for Education (Africa Regional)") },
    overview: [
      "Across Africa, corporate investment is a decisive lever for education access, quality, and inclusion — often reaching learners public systems cannot serve alone.",
      "This category recognises African and multinational companies whose CSR programmes deliver sustained, verifiable outcomes for schools, teachers, and learners.",
      "Scope is continental, organised across the eight Africa regions so that regional impact is visible and comparable.",
    ],
    enablerStory: "Behind many scholarships, classrooms, laboratories, digital-learning projects, and teacher-development programmes is a company choosing to invest beyond its commercial responsibilities. This category recognises corporate institutions whose sustained education programmes strengthen communities and create opportunity across Africa.",
    sdgPills: ["SDG 4", "SDG 8", "SDG 10", "SDG 17", "Agenda 2063 Goal 1"],
    eligibleNomineeTypes: [
      "African corporations", "Multinational companies operating in Africa", "Corporate foundations",
      "Banking and financial institutions", "Telecommunications companies", "Energy and extractive-sector companies",
      "Manufacturing and consumer-goods companies", "Technology companies with education programmes",
    ],
    subcategories: [
      sub("scholarships-learner-support", "Scholarships and Learner Support", "Sustained scholarship, bursary and learner-support programmes.", "Corporate / Foundation", "Africa (8 regions)", "best-csr-for-education-africa-regional", "gold-blue-garnet", "Best CSR for Education (Africa Regional)"),
      sub("school-infrastructure", "School Infrastructure", "Classroom construction, renovation, sanitation, and safe learning spaces.", "Corporate / Foundation", "Africa (8 regions)", "best-csr-for-education-africa-regional", "gold-blue-garnet", "Best CSR for Education (Africa Regional)"),
      sub("teacher-development", "Teacher Development", "Teacher training, welfare and continuing professional development.", "Corporate / Foundation", "Africa (8 regions)", "best-csr-for-education-africa-regional", "gold-blue-garnet", "Best CSR for Education (Africa Regional)"),
      sub("digital-learning-connectivity", "Digital Learning and Connectivity", "Devices, connectivity, digital content and platforms in schools.", "Corporate / Foundation", "Africa (8 regions)", "best-csr-for-education-africa-regional", "gold-blue-garnet", "Best CSR for Education (Africa Regional)"),
      sub("stem-innovation", "STEM and Innovation", "STEM labs, coding, robotics and innovation partnerships with schools.", "Corporate / Foundation", "Africa (8 regions)", "best-csr-for-education-africa-regional", "gold-blue-garnet", "Best CSR for Education (Africa Regional)"),
      sub("girls-education", "Girls' Education", "Programmes advancing enrolment, retention and outcomes for girls.", "Corporate / Foundation", "Africa (8 regions)", "best-csr-for-education-africa-regional", "gold-blue-garnet", "Best CSR for Education (Africa Regional)"),
      sub("disability-inclusion", "Disability Inclusion", "Assistive tech, inclusive schools and equity programmes.", "Corporate / Foundation", "Africa (8 regions)", "best-csr-for-education-africa-regional", "gold-blue-garnet", "Best CSR for Education (Africa Regional)"),
      sub("community-education", "Community Education", "Adult literacy, community learning centres, and lifelong-learning programmes.", "Corporate / Foundation", "Africa (8 regions)", "best-csr-for-education-africa-regional", "gold-blue-garnet", "Best CSR for Education (Africa Regional)"),
    ],
    nominationCta: {
      heading: "Know a company making education possible?",
      body: "Nominate an eligible corporate Education Enabler and help NESA-Africa document, verify, and recognise their contribution.",
      href: nominateHref("gold-blue-garnet", "best-csr-for-education-africa-regional"),
    },
    nomineeCatalogue: { categoryTitle: "Best CSR for Education (Africa Regional)", grouping: "region" },
    faqs: [
      { q: "Does the nominated company need African ownership?", a: "No. Both African-owned and multinational companies operating in Africa qualify, provided the programme delivers verifiable impact in Africa." },
      { q: "How is regional assignment decided?", a: "Automatically from the primary country of programme delivery, mapped to one of the eight Africa regions." },
      { q: "Can multiple regions be recognised for the same company?", a: "Yes, when a programme has substantial, verifiable delivery in more than one region." },
      { q: "Is this competitive?", a: "No. Blue Garnet 2026 is a non-competitive Recognition Edition. Competitive Blue Garnet begins from 2027." },
    ],
    seo: { title: "CSR for Education — Africa | NESA-Africa 2026", description: "Recognising companies investing in measurable education impact across Africa's eight regions.", canonical: "https://nesa.africa/awards/csr-education" },
  },

  "bg-csr-nigeria": {
    id: "bg-csr-nigeria",
    route: "/category/csr-education-nigeria",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "Corporate Social Responsibility for Education — Nigeria",
    subtitle: "Recognising Nigerian companies turning corporate investment into lasting educational opportunity.",
    scope: "nigeria",
    heroAlt: "Nigerian corporate-supported classroom with students",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-csr-for-education-nigeria") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best CSR in Education (Nigeria)") },
    overview: [
      "Nigeria's education gap is one of the world's largest — and corporate CSR is one of its most effective closers when it is sustained, transparent, and outcome-driven.",
      "This category documents Nigerian companies whose education programmes deliver measurable and lasting outcomes across states and geopolitical zones.",
      "Scope is national, with filters by Nigerian state and geopolitical zone; a single national recognition category is retained.",
    ],
    enablerStory: "From scholarships and classroom renovation to digital centres and teacher training, responsible businesses help communities build stronger futures. This category documents Nigerian companies whose education programmes deliver measurable and sustainable outcomes.",
    sdgPills: ["SDG 4", "SDG 8", "SDG 10", "SDG 17"],
    eligibleNomineeTypes: [
      "Nigerian-owned companies", "Multinational companies operating in Nigeria", "Corporate foundations",
      "Banks", "Telecommunications companies", "Energy companies", "Manufacturers", "Professional-service firms",
    ],
    subcategories: [
      sub("scholarships", "Scholarships", "Structured scholarship programmes with verifiable beneficiaries.", "Corporate / Foundation", "Nigeria", "best-csr-for-education-nigeria", "gold-blue-garnet", "Best CSR in Education (Nigeria)"),
      sub("infrastructure", "Infrastructure", "School infrastructure delivery — classrooms, labs, WASH.", "Corporate / Foundation", "Nigeria", "best-csr-for-education-nigeria", "gold-blue-garnet", "Best CSR in Education (Nigeria)"),
      sub("digital-education", "Digital Education", "Devices, digital content, connectivity and platforms in schools.", "Corporate / Foundation", "Nigeria", "best-csr-for-education-nigeria", "gold-blue-garnet", "Best CSR in Education (Nigeria)"),
      sub("teacher-development", "Teacher Development", "Teacher training, welfare and CPD programmes.", "Corporate / Foundation", "Nigeria", "best-csr-for-education-nigeria", "gold-blue-garnet", "Best CSR in Education (Nigeria)"),
      sub("stem-tvet", "STEM and TVET", "STEM labs, coding, robotics and technical/vocational training.", "Corporate / Foundation", "Nigeria", "best-csr-for-education-nigeria", "gold-blue-garnet", "Best CSR in Education (Nigeria)"),
      sub("literacy-libraries", "Literacy and Libraries", "Reading, literacy and library-support programmes.", "Corporate / Foundation", "Nigeria", "best-csr-for-education-nigeria", "gold-blue-garnet", "Best CSR in Education (Nigeria)"),
      sub("inclusion", "Inclusion", "Girls, disability, out-of-school and underserved-learner programmes.", "Corporate / Foundation", "Nigeria", "best-csr-for-education-nigeria", "gold-blue-garnet", "Best CSR in Education (Nigeria)"),
      sub("community-education", "Community Education", "Community learning centres and adult-literacy work.", "Corporate / Foundation", "Nigeria", "best-csr-for-education-nigeria", "gold-blue-garnet", "Best CSR in Education (Nigeria)"),
    ],
    nominationCta: { heading: "Know a Nigerian company making education possible?", body: "Nominate an eligible corporate Education Enabler and help NESA-Africa document, verify, and recognise their contribution.", href: nominateHref("gold-blue-garnet", "best-csr-for-education-nigeria") },
    nomineeCatalogue: { categoryTitle: "Best CSR in Education (Nigeria)", grouping: "state" },
    faqs: [
      { q: "Do only large corporates qualify?", a: "No. Any company operating in Nigeria with a verifiable, sustained education programme qualifies." },
      { q: "Can subsidiaries of multinationals be nominated?", a: "Yes, provided the programme is delivered in Nigeria with verifiable evidence." },
      { q: "How are Nigerian states used?", a: "As filters within one national recognition category, so state-level impact is visible without fragmenting recognition." },
      { q: "Is this competitive?", a: "No. Blue Garnet 2026 is a Recognition Edition. Competitive Blue Garnet begins from 2027." },
    ],
    seo: { title: "CSR for Education — Nigeria | NESA-Africa 2026", description: "Recognising Nigerian companies turning corporate investment into lasting educational opportunity.", canonical: "https://nesa.africa/category/csr-education-nigeria" },
  },

  "bg-edutech-africa": {
    id: "bg-edutech-africa",
    route: "/category/edutech-africa",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "Education Technology Innovation — Africa",
    subtitle: "Recognising technologies expanding access, improving learning, and strengthening African education systems.",
    scope: "africa-8",
    heroAlt: "African learners using digital learning tools",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-edutech-innovation-for-education-africa-regional") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best EduTech Organisation (Africa Regional)") },
    overview: [
      "A learner's location should not determine access to knowledge, yet millions of African learners still lack the tools that make quality learning possible.",
      "This category recognises EduTech organisations whose platforms, content, and services expand access and improve learning outcomes with measurable adoption.",
      "Scope is continental across the eight Africa regions, with attention to accessibility, affordability, and data protection.",
    ],
    enablerStory: "A learner's location should not determine access to knowledge. This category recognises Education Enablers using software, connectivity, artificial intelligence, digital content, assistive technology, and data to make learning more accessible and effective.",
    sdgPills: ["SDG 4", "SDG 9", "SDG 10", "SDG 17"],
    eligibleNomineeTypes: [
      "EdTech companies", "Learning-management platforms", "AI education products", "Mobile-learning services",
      "Digital-content providers", "Assistive-technology developers", "School-management systems", "Connectivity and device programmes",
    ],
    scoringEmphasis: ["Accessibility", "Learner protection", "Data privacy", "Adoption", "Measurable learning outcomes", "Affordability", "Scalability"],
    subcategories: [
      sub("digital-learning-platforms", "Digital Learning Platforms", "Web/mobile learning platforms serving African learners.", "EdTech", "Africa (8 regions)", "best-edutech-innovation-for-education-africa-regional", "gold-blue-garnet", "Best EduTech Organisation (Africa Regional)"),
      sub("ai-for-education", "AI for Education", "AI-powered tutoring, assessment and personalised learning.", "EdTech", "Africa (8 regions)", "best-edutech-innovation-for-education-africa-regional", "gold-blue-garnet", "Best EduTech Organisation (Africa Regional)"),
      sub("mobile-learning", "Mobile Learning", "Offline-first and low-bandwidth mobile-learning services.", "EdTech", "Africa (8 regions)", "best-edutech-innovation-for-education-africa-regional", "gold-blue-garnet", "Best EduTech Organisation (Africa Regional)"),
      sub("school-management-data", "School Management and Data", "School operations, MIS, and education-data tools.", "EdTech", "Africa (8 regions)", "best-edutech-innovation-for-education-africa-regional", "gold-blue-garnet", "Best EduTech Organisation (Africa Regional)"),
      sub("digital-content", "Digital Content", "Localised digital curricula and open educational resources.", "EdTech", "Africa (8 regions)", "best-edutech-innovation-for-education-africa-regional", "gold-blue-garnet", "Best EduTech Organisation (Africa Regional)"),
      sub("teacher-technology", "Teacher Technology", "Technology for teacher development, planning and classroom delivery.", "EdTech", "Africa (8 regions)", "best-edutech-innovation-for-education-africa-regional", "gold-blue-garnet", "Best EduTech Organisation (Africa Regional)"),
      sub("assistive-technology", "Assistive Technology", "Assistive tech for learners with disabilities.", "EdTech", "Africa (8 regions)", "best-edutech-innovation-for-education-africa-regional", "gold-blue-garnet", "Best EduTech Organisation (Africa Regional)"),
      sub("connectivity-devices", "Connectivity and Devices", "Device and connectivity programmes for schools and learners.", "EdTech / Telco", "Africa (8 regions)", "best-edutech-innovation-for-education-africa-regional", "gold-blue-garnet", "Best EduTech Organisation (Africa Regional)"),
    ],
    nominationCta: { heading: "Know an EdTech powering Africa's classrooms?", body: "Nominate an eligible EdTech Education Enabler with verifiable adoption and learning outcomes.", href: nominateHref("gold-blue-garnet", "best-edutech-innovation-for-education-africa-regional") },
    nomineeCatalogue: { categoryTitle: "Best EduTech Organisation (Africa Regional)", grouping: "region" },
    faqs: [
      { q: "Do free/open-source EdTech projects qualify?", a: "Yes, provided they demonstrate verifiable adoption and learning value in African contexts." },
      { q: "How is data privacy assessed?", a: "As part of Evidence Quality, with attention to learner-protection policies and consent for minors." },
      { q: "Do content-only publishers qualify?", a: "Yes, under Digital Content, when the material is used in real teaching and learning." },
      { q: "Is this competitive?", a: "No — Blue Garnet 2026 is a Recognition Edition; competitive framework begins from 2027." },
    ],
    seo: { title: "EduTech Innovation — Africa | NESA-Africa 2026", description: "Recognising African EdTech expanding access and improving learning outcomes.", canonical: "https://nesa.africa/category/edutech-africa" },
  },

  "bg-media-nigeria": {
    id: "bg-media-nigeria",
    route: "/category/media-advocacy-nigeria",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "Media Organisations Supporting Education — Nigeria",
    subtitle: "Recognising media institutions that inform, educate, advocate, and keep learning in the national conversation.",
    scope: "nigeria",
    heroAlt: "Nigerian media newsroom covering education stories",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-media-organisation-for-education-advocacy-nigeria") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best Media Organisation in Educational Advocacy (Nigeria)") },
    overview: [
      "Public understanding of education shapes what governments prioritise, what parents demand, and what learners believe is possible.",
      "This category recognises Nigerian media organisations using journalism, broadcasting, publishing, campaigns, and storytelling to promote literacy, accountability, and opportunity.",
      "Scope is national, with attention to consistency of educational programming, reach, and editorial integrity.",
    ],
    enablerStory: "Education changes when the public understands its challenges and possibilities. This category recognises Nigerian media organisations using journalism, broadcasting, publishing, campaigns, and storytelling to promote literacy, accountability, opportunity, and Education for All.",
    sdgPills: ["SDG 4", "SDG 16", "SDG 17"],
    eligibleNomineeTypes: ["Television stations", "Radio stations", "Newspapers", "Magazines", "Digital publishers", "Podcast networks", "Documentary producers", "Educational broadcasters"],
    scoringEmphasis: ["Editorial consistency", "Public reach", "Evidence of educational programming", "Quality of information", "Learner or community outcomes", "Independence and integrity"],
    subcategories: [
      sub("television", "Television", "Television programming advancing education.", "Media", "Nigeria", "best-media-organisation-for-education-advocacy-nigeria", "gold-blue-garnet", "Best Media Organisation in Educational Advocacy (Nigeria)"),
      sub("radio", "Radio", "Radio programming and campaigns for education.", "Media", "Nigeria", "best-media-organisation-for-education-advocacy-nigeria", "gold-blue-garnet", "Best Media Organisation in Educational Advocacy (Nigeria)"),
      sub("print-journalism", "Print Journalism", "Sustained education journalism in print.", "Media", "Nigeria", "best-media-organisation-for-education-advocacy-nigeria", "gold-blue-garnet", "Best Media Organisation in Educational Advocacy (Nigeria)"),
      sub("digital-media", "Digital Media", "Digital newsrooms and platforms covering education.", "Media", "Nigeria", "best-media-organisation-for-education-advocacy-nigeria", "gold-blue-garnet", "Best Media Organisation in Educational Advocacy (Nigeria)"),
      sub("educational-publishing", "Educational Publishing", "Publishers producing curriculum, learner and teacher resources.", "Media", "Nigeria", "best-media-organisation-for-education-advocacy-nigeria", "gold-blue-garnet", "Best Media Organisation in Educational Advocacy (Nigeria)"),
      sub("documentary-investigative", "Documentary and Investigative Media", "Documentary and investigative journalism on education.", "Media", "Nigeria", "best-media-organisation-for-education-advocacy-nigeria", "gold-blue-garnet", "Best Media Organisation in Educational Advocacy (Nigeria)"),
      sub("podcasting", "Podcasting", "Podcasts and audio series advancing education.", "Media", "Nigeria", "best-media-organisation-for-education-advocacy-nigeria", "gold-blue-garnet", "Best Media Organisation in Educational Advocacy (Nigeria)"),
      sub("public-education-campaigns", "Public Education Campaigns", "Public-interest media campaigns for literacy and access.", "Media", "Nigeria", "best-media-organisation-for-education-advocacy-nigeria", "gold-blue-garnet", "Best Media Organisation in Educational Advocacy (Nigeria)"),
    ],
    nominationCta: { heading: "Know a media house championing education?", body: "Nominate a media organisation with sustained education programming and verifiable public impact.", href: nominateHref("gold-blue-garnet", "best-media-organisation-for-education-advocacy-nigeria") },
    nomineeCatalogue: { categoryTitle: "Best Media Organisation in Educational Advocacy (Nigeria)", grouping: "state" },
    faqs: [
      { q: "Are individual journalists eligible?", a: "This category recognises organisations. Individual journalists may be recognised under Influencer categories." },
      { q: "How is 'sustained' programming defined?", a: "As consistent, evidenced coverage over at least 12 months." },
      { q: "Do state-owned broadcasters qualify?", a: "Yes, provided independence and editorial integrity are demonstrable." },
      { q: "Is this competitive?", a: "No — Blue Garnet 2026 is a Recognition Edition." },
    ],
    seo: { title: "Media for Education — Nigeria | NESA-Africa 2026", description: "Recognising Nigerian media championing education.", canonical: "https://nesa.africa/category/media-advocacy-nigeria" },
  },

  "bg-ngo-nigeria": {
    id: "bg-ngo-nigeria",
    route: "/category/ngo-education-nigeria",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "NGOs Supporting Education — Nigeria",
    subtitle: "Recognising civil-society organisations creating measurable education impact in Nigerian communities.",
    scope: "nigeria",
    heroAlt: "Nigerian NGO working with children in a community classroom",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-ngo-for-education-advancement-nigeria") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best NGO Contribution to Education (Nigeria)") },
    overview: [
      "Millions of Nigerian learners are reached first — and sometimes only — by civil-society organisations working close to the community.",
      "This category recognises Nigerian NGOs delivering verifiable education access, inclusion, and long-term community outcomes.",
      "Scope is national, with filters by state and geopolitical zone.",
    ],
    enablerStory: "Across Nigeria, NGOs often reach learners and communities that formal systems struggle to serve. This category recognises organisations providing access, inclusion, literacy, infrastructure, technology, mentorship, and long-term community support.",
    sdgPills: ["SDG 4", "SDG 5", "SDG 10", "SDG 17"],
    eligibleNomineeTypes: ["Registered NGOs", "Community-based organisations", "Education foundations", "Youth organisations", "Disability organisations", "Women-led organisations", "Humanitarian education organisations", "Social-impact organisations"],
    subcategories: [
      sub("access-scholarships", "Access and Scholarships", "Scholarship and access programmes with verifiable beneficiaries.", "NGO", "Nigeria", "best-ngo-for-education-advancement-nigeria", "gold-blue-garnet", "Best NGO Contribution to Education (Nigeria)"),
      sub("literacy-reading", "Literacy and Reading", "Literacy, reading and language-learning programmes.", "NGO", "Nigeria", "best-ngo-for-education-advancement-nigeria", "gold-blue-garnet", "Best NGO Contribution to Education (Nigeria)"),
      sub("school-infrastructure", "School Infrastructure", "Community-school infrastructure and safe learning environments.", "NGO", "Nigeria", "best-ngo-for-education-advancement-nigeria", "gold-blue-garnet", "Best NGO Contribution to Education (Nigeria)"),
      sub("teacher-support", "Teacher Support", "Teacher training and welfare in underserved communities.", "NGO", "Nigeria", "best-ngo-for-education-advancement-nigeria", "gold-blue-garnet", "Best NGO Contribution to Education (Nigeria)"),
      sub("digital-learning", "Digital Learning", "Digital-learning delivery in low-resource settings.", "NGO", "Nigeria", "best-ngo-for-education-advancement-nigeria", "gold-blue-garnet", "Best NGO Contribution to Education (Nigeria)"),
      sub("girls-education", "Girls' Education", "Girls' enrolment, retention and outcomes.", "NGO", "Nigeria", "best-ngo-for-education-advancement-nigeria", "gold-blue-garnet", "Best NGO Contribution to Education (Nigeria)"),
      sub("disability-inclusion", "Disability Inclusion", "Inclusion of learners with disabilities.", "NGO", "Nigeria", "best-ngo-for-education-advancement-nigeria", "gold-blue-garnet", "Best NGO Contribution to Education (Nigeria)"),
      sub("education-in-emergencies", "Education in Emergencies", "Learning continuity in crisis and displacement contexts.", "NGO", "Nigeria", "best-ngo-for-education-advancement-nigeria", "gold-blue-garnet", "Best NGO Contribution to Education (Nigeria)"),
    ],
    nominationCta: { heading: "Know an NGO transforming education in Nigeria?", body: "Nominate an eligible NGO whose work in Nigerian communities is verifiable and sustained.", href: nominateHref("gold-blue-garnet", "best-ngo-for-education-advancement-nigeria") },
    nomineeCatalogue: { categoryTitle: "Best NGO Contribution to Education (Nigeria)", grouping: "state" },
    faqs: [
      { q: "Are unregistered CBOs eligible?", a: "Community-based organisations may be nominated, but proof of activity, governance, and accountability is required." },
      { q: "Does short-term project work qualify?", a: "Sustained programmes are prioritised; one-off activities are unlikely to reach the threshold." },
      { q: "How is impact verified?", a: "By the Nominee Research Corps using programme documents, partner confirmation, and independent sources." },
      { q: "Is this competitive?", a: "No — Blue Garnet 2026 is a Recognition Edition." },
    ],
    seo: { title: "NGOs for Education — Nigeria | NESA-Africa 2026", description: "Recognising Nigerian NGOs driving measurable education impact.", canonical: "https://nesa.africa/category/ngo-education-nigeria" },
  },

  "bg-ngo-africa": {
    id: "bg-ngo-africa",
    route: "/category/ngo-education-africa",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "NGOs Supporting Education — Africa",
    subtitle: "Recognising organisations expanding educational opportunity across Africa's eight regions.",
    scope: "africa-8",
    heroAlt: "Pan-African NGO working with a classroom of children",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-ngo-contribution-to-education") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best NGO Contribution to Education (Africa Regional)") },
    overview: [
      "Africa's most effective education solutions often begin within communities and scale through networks of accountability, evidence, and trust.",
      "This category recognises NGOs whose work across borders, countries and regions delivers verifiable and sustained learning outcomes.",
      "Scope is continental — organised across the eight Africa regions (Horn, Sahel and Indian Ocean Islands are recognised distinctly).",
    ],
    enablerStory: "Many of Africa's most effective education solutions begin within communities. This category recognises NGOs that listen locally, act sustainably, and produce measurable outcomes for learners, teachers, schools, and families.",
    sdgPills: ["SDG 4", "SDG 5", "SDG 10", "SDG 17"],
    eligibleNomineeTypes: ["National NGOs", "Regional NGOs", "Pan-African NGOs", "Community-based organisations", "Humanitarian organisations", "Education foundations", "Youth-led organisations", "Disability and inclusion organisations"],
    subcategories: [
      sub("access-retention", "Access and Retention", "Enrolment, retention and completion programmes.", "NGO", "Africa (8 regions)", "best-ngo-contribution-to-education", "gold-blue-garnet", "Best NGO Contribution to Education (Africa Regional)"),
      sub("literacy", "Literacy", "Literacy and reading interventions.", "NGO", "Africa (8 regions)", "best-ngo-contribution-to-education", "gold-blue-garnet", "Best NGO Contribution to Education (Africa Regional)"),
      sub("infrastructure", "Infrastructure", "School infrastructure and safe learning spaces.", "NGO", "Africa (8 regions)", "best-ngo-contribution-to-education", "gold-blue-garnet", "Best NGO Contribution to Education (Africa Regional)"),
      sub("teacher-development", "Teacher Development", "Teacher training and CPD across the region.", "NGO", "Africa (8 regions)", "best-ngo-contribution-to-education", "gold-blue-garnet", "Best NGO Contribution to Education (Africa Regional)"),
      sub("digital-education", "Digital Education", "Digital-learning delivery in low-resource contexts.", "NGO", "Africa (8 regions)", "best-ngo-contribution-to-education", "gold-blue-garnet", "Best NGO Contribution to Education (Africa Regional)"),
      sub("gender-inclusion", "Gender Inclusion", "Girls' education and gender-equity programmes.", "NGO", "Africa (8 regions)", "best-ngo-contribution-to-education", "gold-blue-garnet", "Best NGO Contribution to Education (Africa Regional)"),
      sub("disability-inclusion", "Disability Inclusion", "Programmes for learners with disabilities.", "NGO", "Africa (8 regions)", "best-ngo-contribution-to-education", "gold-blue-garnet", "Best NGO Contribution to Education (Africa Regional)"),
      sub("refugee-emergency", "Refugee and Emergency Education", "Learning for displaced and crisis-affected learners.", "NGO", "Africa (8 regions)", "best-ngo-contribution-to-education", "gold-blue-garnet", "Best NGO Contribution to Education (Africa Regional)"),
    ],
    nominationCta: { heading: "Know an NGO changing African education?", body: "Nominate an eligible NGO whose work is verifiable, sustained, and community-anchored.", href: nominateHref("gold-blue-garnet", "best-ngo-contribution-to-education") },
    nomineeCatalogue: { categoryTitle: "Best NGO Contribution to Education (Africa Regional)", grouping: "region" },
    faqs: [
      { q: "Are pan-African INGOs eligible?", a: "Yes — under National, Regional or Pan-African NGO types, with region assigned by primary delivery." },
      { q: "How are Horn, Sahel and Indian Ocean Islands handled?", a: "They are recognised as distinct regions, not merged into older five-region groupings." },
      { q: "Are single-country NGOs eligible under Africa?", a: "Yes — assigned to their primary region." },
      { q: "Is this competitive?", a: "No — Blue Garnet 2026 is a Recognition Edition." },
    ],
    seo: { title: "NGOs for Education — Africa | NESA-Africa 2026", description: "Recognising NGOs expanding educational opportunity across Africa's eight regions.", canonical: "https://nesa.africa/category/ngo-education-africa" },
  },

  "bg-stem-africa": {
    id: "bg-stem-africa",
    route: "/category/stem-education-africa",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "STEM Education Programmes — Africa",
    subtitle: "Recognising programmes preparing African learners for science, technology, engineering, mathematics, and innovation.",
    scope: "africa-8",
    heroAlt: "African students in a STEM lab",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-stem-education-programme-africa-regional") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best STEM Education Programme (Africa Regional)") },
    overview: [
      "Africa's future economies will be shaped by learners fluent in science, mathematics, engineering, and technology — and by programmes that make these fields inclusive and practical.",
      "This category recognises programmes and institutions delivering measurable STEM outcomes across Africa's eight regions.",
      "Scope is continental, with attention to inclusion, mentorship, and progression into further study or work.",
    ],
    enablerStory: "Africa's future will be built by learners who can investigate, design, calculate, create, and solve. This category recognises institutions and programmes making STEM practical, inclusive, relevant, and accessible.",
    sdgPills: ["SDG 4", "SDG 5", "SDG 8", "SDG 9"],
    eligibleNomineeTypes: ["Schools", "Universities", "STEM academies", "Innovation hubs", "Robotics programmes", "Coding initiatives", "Science centres", "Engineering outreach programmes"],
    scoringEmphasis: ["Practical learning", "Learner participation", "Progression", "Inclusion", "Equipment access", "Mentorship", "Innovation outputs"],
    subcategories: [
      sub("science-education", "Science Education", "School and community science-education programmes.", "Programme / Institution", "Africa (8 regions)", "best-stem-education-programme-africa-regional", "gold-blue-garnet", "Best STEM Education Programme (Africa Regional)"),
      sub("technology-coding", "Technology and Coding", "Coding and software-education programmes.", "Programme / Institution", "Africa (8 regions)", "best-stem-education-programme-africa-regional", "gold-blue-garnet", "Best STEM Education Programme (Africa Regional)"),
      sub("engineering-education", "Engineering Education", "Engineering outreach and university-linked programmes.", "Programme / Institution", "Africa (8 regions)", "best-stem-education-programme-africa-regional", "gold-blue-garnet", "Best STEM Education Programme (Africa Regional)"),
      sub("mathematics", "Mathematics", "Mathematics-education programmes and Olympiads.", "Programme / Institution", "Africa (8 regions)", "best-stem-education-programme-africa-regional", "gold-blue-garnet", "Best STEM Education Programme (Africa Regional)"),
      sub("robotics", "Robotics", "Robotics education, competitions and clubs.", "Programme / Institution", "Africa (8 regions)", "best-stem-education-programme-africa-regional", "gold-blue-garnet", "Best STEM Education Programme (Africa Regional)"),
      sub("girls-in-stem", "Girls in STEM", "Programmes advancing girls' participation in STEM.", "Programme / Institution", "Africa (8 regions)", "best-stem-education-programme-africa-regional", "gold-blue-garnet", "Best STEM Education Programme (Africa Regional)"),
      sub("rural-stem-access", "Rural STEM Access", "STEM programmes reaching rural and remote learners.", "Programme / Institution", "Africa (8 regions)", "best-stem-education-programme-africa-regional", "gold-blue-garnet", "Best STEM Education Programme (Africa Regional)"),
      sub("teacher-stem-development", "Teacher STEM Development", "STEM teacher training and professional development.", "Programme / Institution", "Africa (8 regions)", "best-stem-education-programme-africa-regional", "gold-blue-garnet", "Best STEM Education Programme (Africa Regional)"),
    ],
    nominationCta: { heading: "Know a STEM programme changing lives?", body: "Nominate a STEM programme with verifiable participation, outcomes, and inclusion.", href: nominateHref("gold-blue-garnet", "best-stem-education-programme-africa-regional") },
    nomineeCatalogue: { categoryTitle: "Best STEM Education Programme (Africa Regional)", grouping: "region" },
    faqs: [
      { q: "Are university programmes eligible?", a: "Yes — under Engineering, Science or Teacher STEM Development." },
      { q: "Do coding bootcamps qualify?", a: "Yes — under Technology and Coding when verifiable outcomes are demonstrated." },
      { q: "Are STEM competitions eligible?", a: "Yes — as programmes with sustained learner participation and progression tracking." },
      { q: "Is this competitive?", a: "No — Blue Garnet 2026 is a Recognition Edition." },
    ],
    seo: { title: "STEM Education — Africa | NESA-Africa 2026", description: "Recognising STEM programmes preparing African learners for the future.", canonical: "https://nesa.africa/category/stem-education-africa" },
  },

  "bg-creative-nigeria": {
    id: "bg-creative-nigeria",
    route: "/category/creative-arts-nigeria",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "Creative Industries Supporting Education — Nigeria",
    subtitle: "Recognising creative organisations using culture, media, and storytelling to make learning visible and engaging.",
    scope: "nigeria",
    heroAlt: "Nigerian creatives producing educational content",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-creative-arts-contribution-to-education-nigeria") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Creative Arts Industry Contribution to Education (Nigeria)") },
    overview: [
      "Culture is one of Nigeria's most powerful teachers — its films, books, music, and design shape how young people see themselves and what they aspire to.",
      "This category recognises Nigerian creative organisations applying their craft to education, literacy, and youth development.",
      "Scope is national, with attention to educational value, access, and sustained programming.",
    ],
    enablerStory: "Film, literature, music, theatre, visual art, animation, and design can make complex ideas understandable and inspire learners to imagine new futures. This category recognises creative institutions applying their craft to education and youth development.",
    sdgPills: ["SDG 4", "SDG 8", "SDG 10", "SDG 17"],
    eligibleNomineeTypes: ["Film companies", "Publishers", "Theatre organisations", "Animation studios", "Art institutions", "Design agencies", "Cultural organisations", "Creative foundations"],
    scoringEmphasis: ["Learning value", "Access", "Cultural relevance", "Learner participation", "Educational partnerships", "Sustained programming"],
    subcategories: [
      sub("film-documentary", "Film and Documentary", "Educational and impact film/documentary work.", "Creative", "Nigeria", "best-creative-arts-contribution-to-education-nigeria", "gold-blue-garnet", "Creative Arts Industry Contribution to Education (Nigeria)"),
      sub("publishing-literature", "Publishing and Literature", "Book publishing and literature initiatives for learners.", "Creative", "Nigeria", "best-creative-arts-contribution-to-education-nigeria", "gold-blue-garnet", "Creative Arts Industry Contribution to Education (Nigeria)"),
      sub("theatre-performance", "Theatre and Performance", "Theatre and performance work with educational programming.", "Creative", "Nigeria", "best-creative-arts-contribution-to-education-nigeria", "gold-blue-garnet", "Creative Arts Industry Contribution to Education (Nigeria)"),
      sub("visual-arts", "Visual Arts", "Visual-arts institutions and education programmes.", "Creative", "Nigeria", "best-creative-arts-contribution-to-education-nigeria", "gold-blue-garnet", "Creative Arts Industry Contribution to Education (Nigeria)"),
      sub("animation", "Animation", "Animation studios producing educational content.", "Creative", "Nigeria", "best-creative-arts-contribution-to-education-nigeria", "gold-blue-garnet", "Creative Arts Industry Contribution to Education (Nigeria)"),
      sub("design", "Design", "Design practices supporting education and learning environments.", "Creative", "Nigeria", "best-creative-arts-contribution-to-education-nigeria", "gold-blue-garnet", "Creative Arts Industry Contribution to Education (Nigeria)"),
      sub("cultural-heritage-education", "Cultural Heritage Education", "Cultural-heritage institutions with learning programmes.", "Creative", "Nigeria", "best-creative-arts-contribution-to-education-nigeria", "gold-blue-garnet", "Creative Arts Industry Contribution to Education (Nigeria)"),
      sub("creative-youth-development", "Creative Youth Development", "Creative programmes for youth skills and identity.", "Creative", "Nigeria", "best-creative-arts-contribution-to-education-nigeria", "gold-blue-garnet", "Creative Arts Industry Contribution to Education (Nigeria)"),
    ],
    nominationCta: { heading: "Know a creative organisation teaching Nigeria?", body: "Nominate a creative organisation whose work delivers verifiable educational value.", href: nominateHref("gold-blue-garnet", "best-creative-arts-contribution-to-education-nigeria") },
    nomineeCatalogue: { categoryTitle: "Creative Arts Industry Contribution to Education (Nigeria)", grouping: "state" },
    faqs: [
      { q: "Are individual artists eligible?", a: "This category recognises organisations. Individual creatives may be recognised under Influencer categories." },
      { q: "Does entertainment content qualify?", a: "Yes, when it delivers verifiable educational programming or partnerships." },
      { q: "Are cultural festivals eligible?", a: "Yes — under Cultural Heritage Education if a sustained learning programme is documented." },
      { q: "Is this competitive?", a: "No — Blue Garnet 2026 is a Recognition Edition." },
    ],
    seo: { title: "Creative Industries for Education — Nigeria | NESA-Africa 2026", description: "Recognising Nigerian creatives using art to advance education.", canonical: "https://nesa.africa/category/creative-arts-nigeria" },
  },

  "bg-education-state-nigeria": {
    id: "bg-education-state-nigeria",
    route: "/category/education-friendly-state-nigeria",
    awardTier: "blue-garnet",
    badge: BADGES["blue-garnet"],
    title: "Education Policy and Implementation — Nigeria",
    subtitle: "Recognising Nigerian states translating education commitments into measurable results.",
    scope: "nigeria",
    heroAlt: "Nigerian state education officials at a school",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("gold-blue-garnet", "best-education-policy-implementation-state-nigeria") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best Education-Friendly State (Nigeria)") },
    overview: [
      "Policy only matters when it reaches learners — through classrooms built, teachers paid, and outcomes measured.",
      "This category recognises Nigerian states whose leadership connects budget, delivery, inclusion, and transparent measurement.",
      "Scope is national, evaluated at state level with attention to verified public-sector data.",
    ],
    enablerStory: "Policies matter only when they improve real schools, teachers, and learner outcomes. This category recognises state-level leadership that connects policy, budgets, implementation, transparency, infrastructure, inclusion, and measurable progress.",
    sdgPills: ["SDG 4", "SDG 10", "SDG 16", "SDG 17"],
    eligibleNomineeTypes: ["State governments", "Ministries of Education", "Education boards", "State agencies", "Public implementation teams", "Reform programmes led by state institutions"],
    scoringEmphasis: ["Access and enrolment", "Infrastructure", "Teacher recruitment and development", "Digital transformation", "Girls' education", "Disability inclusion", "Learning outcomes", "Budget transparency and implementation"],
    subcategories: [
      sub("access-enrolment", "Access and Enrolment", "Verified state-level access and enrolment gains.", "State", "Nigeria", "best-education-policy-implementation-state-nigeria", "gold-blue-garnet", "Best Education-Friendly State (Nigeria)"),
      sub("infrastructure", "Infrastructure", "School infrastructure delivery at scale.", "State", "Nigeria", "best-education-policy-implementation-state-nigeria", "gold-blue-garnet", "Best Education-Friendly State (Nigeria)"),
      sub("teacher-development", "Teacher Development", "Teacher recruitment, welfare and CPD systems.", "State", "Nigeria", "best-education-policy-implementation-state-nigeria", "gold-blue-garnet", "Best Education-Friendly State (Nigeria)"),
      sub("digital-transformation", "Digital Transformation", "State-level digital-transformation of education.", "State", "Nigeria", "best-education-policy-implementation-state-nigeria", "gold-blue-garnet", "Best Education-Friendly State (Nigeria)"),
      sub("girls-education", "Girls' Education", "State programmes for girls' enrolment and retention.", "State", "Nigeria", "best-education-policy-implementation-state-nigeria", "gold-blue-garnet", "Best Education-Friendly State (Nigeria)"),
      sub("disability-inclusion", "Disability Inclusion", "State frameworks for inclusive education.", "State", "Nigeria", "best-education-policy-implementation-state-nigeria", "gold-blue-garnet", "Best Education-Friendly State (Nigeria)"),
      sub("learning-outcomes", "Learning Outcomes", "Verifiable improvements in learning outcomes.", "State", "Nigeria", "best-education-policy-implementation-state-nigeria", "gold-blue-garnet", "Best Education-Friendly State (Nigeria)"),
      sub("budget-transparency", "Budget and Transparency", "Budget allocation, implementation and reporting.", "State", "Nigeria", "best-education-policy-implementation-state-nigeria", "gold-blue-garnet", "Best Education-Friendly State (Nigeria)"),
    ],
    nominationCta: { heading: "Know a state delivering for education?", body: "Recognition is based on verified education outcomes, not political affiliation, campaign messaging, or public popularity.", href: nominateHref("gold-blue-garnet", "best-education-policy-implementation-state-nigeria") },
    nomineeCatalogue: { categoryTitle: "Best Education-Friendly State (Nigeria)", grouping: "state" },
    faqs: [
      { q: "Is party affiliation considered?", a: "No. Recognition is based on verified outcomes and public records only." },
      { q: "What evidence is required?", a: "Public budgets, ministry reports, independent data, and partner confirmation." },
      { q: "Can commissioners or officials be nominated individually?", a: "Individuals may be nominated under Political Leadership (Platinum) — this category recognises states." },
      { q: "Is this competitive?", a: "No — Blue Garnet 2026 is a Recognition Edition." },
    ],
    seo: { title: "Education Policy & Implementation — Nigeria | NESA-Africa 2026", description: "Recognising Nigerian states delivering measurable education outcomes.", canonical: "https://nesa.africa/category/education-friendly-state-nigeria" },
  },

  // ================= PLATINUM =================
  "pt-library-nigeria": {
    id: "pt-library-nigeria",
    route: "/category/library-nigeria",
    awardTier: "platinum",
    badge: BADGES.platinum,
    title: "Excellence in Tertiary Institution Library Services",
    subtitle: "Recognising libraries that expand knowledge, research, digital access, and academic success.",
    scope: "nigeria",
    heroAlt: "Nigerian university library reading room",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("platinum-recognition", "best-tertiary-institution-library-nigeria") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Best Library in Nigerian Tertiary Institutions") },
    overview: [
      "A strong library is intellectual infrastructure — the quiet engine of scholarship, research quality, and academic excellence.",
      "This pathway recognises Nigerian tertiary libraries whose collections, digital access, and user services measurably strengthen learning and research.",
      "Scope is national, evaluated by institution type and library service quality.",
    ],
    enablerStory: "A strong library is more than a building. It is the intellectual infrastructure that helps students discover ideas, researchers produce knowledge, and institutions strengthen academic quality.",
    sdgPills: ["SDG 4", "SDG 9", "SDG 17"],
    eligibleNomineeTypes: ["University libraries", "Polytechnic libraries", "Colleges of education libraries", "Research libraries", "Digital academic libraries", "Specialist institutional libraries"],
    scoringEmphasis: ["Collections", "Digital access", "Research support", "Accessibility", "Information literacy", "User services", "Innovation", "Preservation"],
    subcategories: [
      sub("federal-universities", "Federal Universities", "Federal university libraries.", "Library", "Nigeria", "best-tertiary-institution-library-nigeria", "platinum-recognition", "Best Library in Nigerian Tertiary Institutions"),
      sub("state-universities", "State Universities", "State university libraries.", "Library", "Nigeria", "best-tertiary-institution-library-nigeria", "platinum-recognition", "Best Library in Nigerian Tertiary Institutions"),
      sub("private-universities", "Private Universities", "Private university libraries.", "Library", "Nigeria", "best-tertiary-institution-library-nigeria", "platinum-recognition", "Best Library in Nigerian Tertiary Institutions"),
      sub("polytechnics", "Polytechnics", "Polytechnic libraries.", "Library", "Nigeria", "best-tertiary-institution-library-nigeria", "platinum-recognition", "Best Library in Nigerian Tertiary Institutions"),
      sub("colleges-of-education", "Colleges of Education", "College of Education libraries.", "Library", "Nigeria", "best-tertiary-institution-library-nigeria", "platinum-recognition", "Best Library in Nigerian Tertiary Institutions"),
      sub("research-specialist", "Research and Specialist Institutions", "Research and specialist libraries.", "Library", "Nigeria", "best-tertiary-institution-library-nigeria", "platinum-recognition", "Best Library in Nigerian Tertiary Institutions"),
      sub("digital-library-innovation", "Digital Library Innovation", "Digital library platforms and services.", "Library", "Nigeria", "best-tertiary-institution-library-nigeria", "platinum-recognition", "Best Library in Nigerian Tertiary Institutions"),
      sub("inclusive-library-services", "Inclusive Library Services", "Library services for learners with disabilities.", "Library", "Nigeria", "best-tertiary-institution-library-nigeria", "platinum-recognition", "Best Library in Nigerian Tertiary Institutions"),
    ],
    nominationCta: { heading: "Know an outstanding tertiary library?", body: "Nominate a Nigerian tertiary-institution library with verifiable service quality, digital access and research support.", href: nominateHref("platinum-recognition", "best-tertiary-institution-library-nigeria") },
    nomineeCatalogue: { categoryTitle: "Best Library in Nigerian Tertiary Institutions", grouping: "state" },
    faqs: [
      { q: "Do departmental libraries qualify?", a: "Only when they operate as a distinct institutional library with formal governance." },
      { q: "How are digital-only libraries assessed?", a: "Under Digital Library Innovation, with attention to access, licensing and use." },
      { q: "Is user data required?", a: "Aggregate usage data strengthens evidence but must respect user privacy." },
      { q: "Is this jury-only?", a: "Yes. Platinum is jury-only and evidence-based." },
    ],
    seo: { title: "Tertiary Institution Libraries — Nigeria | NESA-Africa 2026", description: "Platinum recognition for outstanding Nigerian tertiary libraries.", canonical: "https://nesa.africa/category/library-nigeria" },
  },

  "pt-rnd": {
    id: "pt-rnd",
    route: "/category/research-development-nigeria",
    awardTier: "platinum",
    badge: BADGES.platinum,
    title: "Excellence in Research and Development for Education",
    subtitle: "Recognising institutions producing evidence, innovation, and solutions for stronger education systems.",
    scope: "nigeria",
    heroAlt: "Education research team reviewing data",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("platinum-recognition", "excellence-in-research-and-development-for-education") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Excellence in Research and Development for Education") },
    overview: [
      "Education improves when decisions are guided by credible evidence — assessments, data, and applied research.",
      "This pathway recognises institutions producing research that policy-makers, schools, and partners actually use.",
      "Scope covers universities, research institutes, think tanks, and data organisations advancing African education.",
    ],
    enablerStory: "Education improves when decisions are guided by credible evidence. This pathway recognises institutions whose research helps governments, schools, teachers, and partners understand problems and implement better solutions.",
    sdgPills: ["SDG 4", "SDG 9", "SDG 17"],
    eligibleNomineeTypes: ["Universities", "Research institutes", "Think tanks", "Policy centres", "Innovation laboratories", "Assessment organisations", "Education-data institutions"],
    scoringEmphasis: ["Research quality", "Application", "Policy influence", "Open access", "Collaboration", "Measurable adoption"],
    subcategories: [
      sub("education-policy-research", "Education Policy Research", "Applied education-policy research.", "Institution", "Nigeria/Africa", "excellence-in-research-and-development-for-education", "platinum-recognition", "Excellence in Research and Development for Education"),
      sub("learning-assessment", "Learning Assessment", "Learning-assessment and measurement institutions.", "Institution", "Nigeria/Africa", "excellence-in-research-and-development-for-education", "platinum-recognition", "Excellence in Research and Development for Education"),
      sub("curriculum-research", "Curriculum Research", "Curriculum research and development.", "Institution", "Nigeria/Africa", "excellence-in-research-and-development-for-education", "platinum-recognition", "Excellence in Research and Development for Education"),
      sub("teacher-dev-research", "Teacher Development Research", "Research on teacher effectiveness and CPD.", "Institution", "Nigeria/Africa", "excellence-in-research-and-development-for-education", "platinum-recognition", "Excellence in Research and Development for Education"),
      sub("edtech-research", "EdTech Research", "Applied EdTech research and evaluation.", "Institution", "Nigeria/Africa", "excellence-in-research-and-development-for-education", "platinum-recognition", "Excellence in Research and Development for Education"),
      sub("stem-tvet-research", "STEM and TVET Research", "Research advancing STEM and TVET education.", "Institution", "Nigeria/Africa", "excellence-in-research-and-development-for-education", "platinum-recognition", "Excellence in Research and Development for Education"),
      sub("inclusion-research", "Inclusion Research", "Research on inclusion, equity and disability.", "Institution", "Nigeria/Africa", "excellence-in-research-and-development-for-education", "platinum-recognition", "Excellence in Research and Development for Education"),
      sub("education-data-analytics", "Education Data and Analytics", "Education-data platforms and analytics organisations.", "Institution", "Nigeria/Africa", "excellence-in-research-and-development-for-education", "platinum-recognition", "Excellence in Research and Development for Education"),
    ],
    nominationCta: { heading: "Know an institution turning research into results?", body: "Nominate an institution whose research has verifiable policy or practice adoption.", href: nominateHref("platinum-recognition", "excellence-in-research-and-development-for-education") },
    nomineeCatalogue: { categoryTitle: "Excellence in Research and Development for Education", grouping: "subcategory" },
    faqs: [
      { q: "Is peer-reviewed publication required?", a: "Not required, but preferred alongside evidence of application." },
      { q: "Do policy think tanks qualify?", a: "Yes — under Education Policy Research." },
      { q: "How is 'adoption' measured?", a: "By evidence that research informed a policy, programme, curriculum, or system change." },
      { q: "Is this jury-only?", a: "Yes. Platinum is jury-only." },
    ],
    seo: { title: "Research & Development for Education | NESA-Africa 2026", description: "Platinum recognition for institutions producing evidence and solutions for African education.", canonical: "https://nesa.africa/category/research-development-nigeria" },
  },

  "pt-christian": {
    id: "pt-christian",
    route: "/category/christian-education-africa",
    awardTier: "platinum",
    badge: BADGES.platinum,
    title: "Excellence in Christian Education Impact",
    subtitle: "Recognising Christian institutions and leaders whose sustained service expands learning and opportunity.",
    scope: "continental",
    heroAlt: "Christian mission school in Africa",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("platinum-recognition", "christian-organizations-enabling-education") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Christian Organisations Enabling Education") },
    overview: [
      "Christian missions, churches, and foundations have shaped African education for over a century — through schools, universities, scholarships, and community service.",
      "This pathway recognises verified and inclusive educational impact, based on evidence and service to communities beyond denominational lines.",
      "Scope is continental; recognition is based on educational contribution, not denomination or size.",
    ],
    enablerStory: "Christian missions, churches, foundations, and institutions have contributed to African education through schools, universities, scholarships, teacher training, literacy, health education, and community service. This pathway recognises verified and inclusive educational impact.",
    sdgPills: ["SDG 4", "SDG 10", "SDG 17"],
    eligibleNomineeTypes: ["Churches", "Missions", "Christian universities", "School networks", "Foundations", "Scholarship bodies", "Faith-based NGOs", "Christian education leaders"],
    subcategories: [
      sub("school-university-development", "School and University Development", "Christian school and university development.", "Faith-based", "Africa", "christian-organizations-enabling-education", "platinum-recognition", "Christian Organisations Enabling Education"),
      sub("scholarships", "Scholarships", "Christian scholarship and bursary programmes.", "Faith-based", "Africa", "christian-organizations-enabling-education", "platinum-recognition", "Christian Organisations Enabling Education"),
      sub("literacy", "Literacy", "Literacy and community-learning programmes.", "Faith-based", "Africa", "christian-organizations-enabling-education", "platinum-recognition", "Christian Organisations Enabling Education"),
      sub("teacher-training", "Teacher Training", "Teacher-training work.", "Faith-based", "Africa", "christian-organizations-enabling-education", "platinum-recognition", "Christian Organisations Enabling Education"),
      sub("tvet", "Technical and Vocational Education", "TVET and skills training.", "Faith-based", "Africa", "christian-organizations-enabling-education", "platinum-recognition", "Christian Organisations Enabling Education"),
      sub("community-learning", "Community Learning", "Community learning and adult education.", "Faith-based", "Africa", "christian-organizations-enabling-education", "platinum-recognition", "Christian Organisations Enabling Education"),
      sub("special-needs", "Special Needs Education", "Programmes for learners with special needs.", "Faith-based", "Africa", "christian-organizations-enabling-education", "platinum-recognition", "Christian Organisations Enabling Education"),
      sub("youth-development", "Youth Development", "Youth-development and mentorship programmes.", "Faith-based", "Africa", "christian-organizations-enabling-education", "platinum-recognition", "Christian Organisations Enabling Education"),
    ],
    nominationCta: { heading: "Know a Christian institution enabling education?", body: "Nominate an organisation with verifiable and inclusive educational impact.", href: nominateHref("platinum-recognition", "christian-organizations-enabling-education") },
    nomineeCatalogue: { categoryTitle: "Christian Organisations Enabling Education", grouping: "subcategory" },
    faqs: [
      { q: "Does denomination affect recognition?", a: "No. Recognition is based on educational contribution and inclusion." },
      { q: "Are inter-faith partnerships accepted?", a: "Yes — inclusive service strengthens the evidence base." },
      { q: "Are individuals eligible?", a: "Yes — under Christian education leaders." },
      { q: "Is this jury-only?", a: "Yes. Platinum is jury-only." },
    ],
    seo: { title: "Christian Education Impact | NESA-Africa 2026", description: "Platinum recognition for Christian institutions advancing African education.", canonical: "https://nesa.africa/category/christian-education-africa" },
  },

  "pt-islamic": {
    id: "pt-islamic",
    route: "/category/islamic-education-africa",
    awardTier: "platinum",
    badge: BADGES.platinum,
    title: "Excellence in Islamic Education Impact",
    subtitle: "Recognising Islamic institutions and leaders strengthening education, knowledge, skills, and community development.",
    scope: "continental",
    heroAlt: "Islamic school students studying",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("platinum-recognition", "islamic-organizations-enabling-education") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Islamic Organisations Enabling Education") },
    overview: [
      "Islamic institutions have advanced African learning through universities, schools, scholarships, and community service across generations.",
      "This pathway recognises measurable, inclusive, and sustained contributions to Education for All.",
      "Scope is continental; recognition is based on educational contribution, not sectarian affiliation or institutional size.",
    ],
    enablerStory: "Islamic institutions have supported learning through schools, universities, scholarships, literacy, research, vocational training, and community service. This pathway recognises measurable, inclusive, and sustained contributions to Education for All.",
    sdgPills: ["SDG 4", "SDG 5", "SDG 10", "SDG 17"],
    eligibleNomineeTypes: ["Islamic universities", "Schools", "Foundations", "Mosques with education programmes", "Scholarship bodies", "Faith-based NGOs", "Research institutions", "Education leaders"],
    subcategories: [
      sub("school-university-development", "School and University Development", "Islamic school and university development.", "Faith-based", "Africa", "islamic-organizations-enabling-education", "platinum-recognition", "Islamic Organisations Enabling Education"),
      sub("scholarships", "Scholarships", "Islamic scholarship and bursary programmes.", "Faith-based", "Africa", "islamic-organizations-enabling-education", "platinum-recognition", "Islamic Organisations Enabling Education"),
      sub("literacy-learning", "Literacy and Learning", "Literacy and community-learning programmes.", "Faith-based", "Africa", "islamic-organizations-enabling-education", "platinum-recognition", "Islamic Organisations Enabling Education"),
      sub("teacher-development", "Teacher Development", "Teacher training and CPD.", "Faith-based", "Africa", "islamic-organizations-enabling-education", "platinum-recognition", "Islamic Organisations Enabling Education"),
      sub("tvet-skills", "TVET and Skills", "TVET and skills-training programmes.", "Faith-based", "Africa", "islamic-organizations-enabling-education", "platinum-recognition", "Islamic Organisations Enabling Education"),
      sub("girls-education", "Girls' Education", "Girls' education programmes.", "Faith-based", "Africa", "islamic-organizations-enabling-education", "platinum-recognition", "Islamic Organisations Enabling Education"),
      sub("community-learning", "Community Learning", "Community learning centres and outreach.", "Faith-based", "Africa", "islamic-organizations-enabling-education", "platinum-recognition", "Islamic Organisations Enabling Education"),
      sub("research-knowledge", "Research and Knowledge", "Islamic research institutions.", "Faith-based", "Africa", "islamic-organizations-enabling-education", "platinum-recognition", "Islamic Organisations Enabling Education"),
    ],
    nominationCta: { heading: "Know an Islamic institution enabling education?", body: "Nominate an organisation with verifiable and inclusive educational impact.", href: nominateHref("platinum-recognition", "islamic-organizations-enabling-education") },
    nomineeCatalogue: { categoryTitle: "Islamic Organisations Enabling Education", grouping: "subcategory" },
    faqs: [
      { q: "Does sect or denomination affect recognition?", a: "No. Recognition is based on educational contribution and inclusion." },
      { q: "Are Qur'anic schools eligible?", a: "Yes — when they demonstrate broader educational programming beyond religious instruction." },
      { q: "Are individuals eligible?", a: "Yes — under Education leaders." },
      { q: "Is this jury-only?", a: "Yes. Platinum is jury-only." },
    ],
    seo: { title: "Islamic Education Impact | NESA-Africa 2026", description: "Platinum recognition for Islamic institutions advancing African education.", canonical: "https://nesa.africa/category/islamic-education-africa" },
  },

  "pt-political": {
    id: "pt-political",
    route: "/category/political-leaders-nigeria",
    awardTier: "platinum",
    badge: BADGES.platinum,
    title: "Excellence in Political Leadership for Education",
    subtitle: "Recognising public leaders whose decisions and implementation have improved education outcomes.",
    scope: "nigeria",
    heroAlt: "Public officials commissioning a school",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("platinum-recognition", "political-leaders-championing-education") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("Political Leaders Championing Education") },
    overview: [
      "Leadership becomes meaningful when policies reach classrooms — through budgets executed, teachers hired, and outcomes measured.",
      "This pathway recognises public officials who have translated authority into measurable improvements for learners and teachers.",
      "Scope covers national, state, legislative, and local leadership evaluated on verified public records.",
    ],
    enablerStory: "Leadership becomes meaningful when policies reach classrooms. This pathway recognises public officials who have translated authority, budgets, legislation, and administration into measurable improvements for learners and teachers.",
    sdgPills: ["SDG 4", "SDG 16", "SDG 17"],
    eligibleNomineeTypes: ["Presidents or heads of government", "Governors", "Ministers", "Commissioners", "Legislators", "Local-government leaders", "Senior public officials with education mandates"],
    subcategories: [
      sub("national-leadership", "National Leadership", "Heads of government and national leaders.", "Public leader", "Nigeria", "political-leaders-championing-education", "platinum-recognition", "Political Leaders Championing Education"),
      sub("state-provincial-leadership", "State or Provincial Leadership", "Governors and state leaders.", "Public leader", "Nigeria", "political-leaders-championing-education", "platinum-recognition", "Political Leaders Championing Education"),
      sub("legislative-leadership", "Legislative Leadership", "Legislators driving education reform.", "Public leader", "Nigeria", "political-leaders-championing-education", "platinum-recognition", "Political Leaders Championing Education"),
      sub("local-government-leadership", "Local Government Leadership", "Local-government leaders.", "Public leader", "Nigeria", "political-leaders-championing-education", "platinum-recognition", "Political Leaders Championing Education"),
      sub("education-ministry-leadership", "Education Ministry Leadership", "Ministers and commissioners of education.", "Public leader", "Nigeria", "political-leaders-championing-education", "platinum-recognition", "Political Leaders Championing Education"),
      sub("policy-reform", "Policy Reform", "Verified policy-reform delivery.", "Public leader", "Nigeria", "political-leaders-championing-education", "platinum-recognition", "Political Leaders Championing Education"),
      sub("infrastructure-delivery", "Infrastructure Delivery", "School infrastructure programmes.", "Public leader", "Nigeria", "political-leaders-championing-education", "platinum-recognition", "Political Leaders Championing Education"),
      sub("inclusion-access", "Inclusion and Access", "Inclusion and access frameworks.", "Public leader", "Nigeria", "political-leaders-championing-education", "platinum-recognition", "Political Leaders Championing Education"),
    ],
    nominationCta: { heading: "Know a leader delivering for education?", body: "Recognition is based on verified results and public records — not political party, campaign claims, personal popularity, or sponsorship.", href: nominateHref("platinum-recognition", "political-leaders-championing-education") },
    nomineeCatalogue: { categoryTitle: "Political Leaders Championing Education", grouping: "state" },
    faqs: [
      { q: "Is party affiliation considered?", a: "No. Recognition is based on verified outcomes and public records only." },
      { q: "Are serving officials eligible?", a: "Yes — with verified public evidence of delivery." },
      { q: "What evidence is required?", a: "Public budgets, ministry reports, independent data, and partner confirmation." },
      { q: "Is this jury-only?", a: "Yes. Platinum is jury-only and evidence-based." },
    ],
    seo: { title: "Political Leadership for Education | NESA-Africa 2026", description: "Platinum recognition for public leaders delivering measurable education outcomes.", canonical: "https://nesa.africa/category/political-leaders-nigeria" },
  },

  "pt-international": {
    id: "pt-international",
    route: "/categories/international-bilateral-education",
    awardTier: "platinum",
    badge: BADGES.platinum,
    title: "Excellence in International Partnership for Education — Africa",
    subtitle: "Celebrating international partners advancing education across Africa.",
    scope: "continental",
    heroAlt: "International education partners meeting with African stakeholders",
    primaryCta: { label: "Nominate in This Category", href: "/nominate?subcategory=51dcefcf-e410-4372-85de-65c997c587bf" },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("International Partners Supporting Education") },
    overview: [
      "International partners — embassies, agencies, foundations, and UN bodies — extend the reach of African education systems through funding, expertise, and collaboration.",
      "This pathway recognises international institutions whose sustained partnerships deliver verifiable outcomes for African learners.",
      "Scope is continental and organised by partner type, not by African region.",
    ],
    enablerStory: "International partners bring finance, expertise, and cross-border experience that complement African leadership in education. This pathway recognises institutions whose partnerships deliver verifiable outcomes and respect African priorities.",
    sdgPills: ["SDG 4", "SDG 17"],
    eligibleNomineeTypes: ["Embassies and High Commissions", "Bilateral Aid Agencies", "Multilateral and International NGOs", "Global Education Grant Foundations", "Multinational Corporations", "UN Agencies", "International NGOs"],
    subcategories: [
      sub("51dcefcf-e410-4372-85de-65c997c587bf", "Embassies and High Commissions", "Diplomatic missions supporting education.", "Diplomatic", "Continental", "international-partners-supporting-education", "platinum-recognition", "International Partners Supporting Education"),
      sub("f8b06b24-3b59-41d8-a6bb-21d0350c4d95", "Bilateral Aid Agencies", "Bilateral development agencies.", "Government agency", "Continental", "international-partners-supporting-education", "platinum-recognition", "International Partners Supporting Education"),
      sub("ccc8a182-5444-42c9-9588-d153489045c3", "Multilateral and International NGOs", "Multilateral bodies and international NGOs.", "Multilateral", "Continental", "international-partners-supporting-education", "platinum-recognition", "International Partners Supporting Education"),
      sub("90f1d466-d309-4599-82ca-7729ad50784d", "Global Education Grant Foundations", "Global education-grant foundations.", "Foundation", "Continental", "international-partners-supporting-education", "platinum-recognition", "International Partners Supporting Education"),
      sub("9fa17b0b-cf85-4860-b9b0-a4ae9bafb778", "Multinational Corporations", "MNCs with sustained African education programmes.", "Corporate", "Continental", "international-partners-supporting-education", "platinum-recognition", "International Partners Supporting Education"),
      sub("c42182bd-0c0c-472a-b647-ff5fd73ffcc2", "UN Agencies", "United Nations agencies working on education.", "UN", "Continental", "international-partners-supporting-education", "platinum-recognition", "International Partners Supporting Education"),
      sub("8da86667-869f-4852-a596-7ef1fbb52780", "International NGOs", "International NGOs working across Africa.", "INGO", "Continental", "international-partners-supporting-education", "platinum-recognition", "International Partners Supporting Education"),
    ],
    nominationCta: { heading: "Know an international partner delivering with Africa?", body: "Nominate a partner institution with verifiable, sustained programmes across the continent.", href: nominateHref("platinum-recognition", "international-partners-supporting-education") },
    nomineeCatalogue: { categoryTitle: "International Partners Supporting Education", grouping: "nominee_type" },
    faqs: [
      { q: "Are regional tabs used?", a: "No — this category is continental and organised by partner type, not African region." },
      { q: "Are country embassies grouped by country?", a: "Yes — under Embassies and High Commissions, filtered by country of representation." },
      { q: "Is this competitive Blue Garnet?", a: "No. Platinum is jury-only and evidence-based. Blue Garnet 2026 is a non-competitive Recognition Edition; competitive Blue Garnet begins from 2027." },
      { q: "Are impact figures required?", a: "Yes — with sources verifiable via the EDI evidence register." },
    ],
    seo: { title: "International Partnership for Education — Africa | NESA-Africa 2026", description: "Platinum recognition for international partners advancing African education.", canonical: "https://nesa.africa/categories/international-bilateral-education" },
  },

  "pt-diaspora": {
    id: "pt-diaspora",
    route: "/categories/diaspora-education-impact",
    awardTier: "platinum",
    badge: BADGES.platinum,
    title: "Excellence in African Diaspora Educational Impact",
    subtitle: "Recognising diaspora organisations investing knowledge, resources, mentorship, and partnerships back into African education.",
    scope: "african-diaspora",
    heroAlt: "African diaspora professionals mentoring students",
    primaryCta: { label: "Nominate in This Category", href: nominateHref("platinum-recognition", "african-diaspora-organisations-supporting-education") },
    secondaryCta: { label: "Explore Existing Nominees", href: exploreHref("African Diaspora Organisations Supporting Education") },
    overview: [
      "African diaspora communities remain deeply connected to the continent through scholarships, schools, mentorship, and institutional partnerships.",
      "This pathway recognises diaspora organisations whose sustained investment strengthens African education.",
      "Scope is African Diaspora, organised by diaspora region and the African region supported — separate from the eight Africa regions.",
    ],
    enablerStory: "Across the world, African diaspora communities remain connected to the continent through scholarships, schools, professional networks, mentoring, research, technology, and institutional partnerships. This pathway documents how global African expertise strengthens education back home.",
    sdgPills: ["SDG 4", "SDG 10", "SDG 17"],
    eligibleNomineeTypes: ["Diaspora associations", "Alumni organisations", "Professional networks", "Diaspora foundations", "Hometown associations", "University networks", "Faith and community organisations", "Diaspora-led education initiatives"],
    subcategories: [
      sub("education-infrastructure", "Education Infrastructure", "Diaspora-funded school and campus infrastructure.", "Diaspora", "African Diaspora", "african-diaspora-organisations-supporting-education", "platinum-recognition", "African Diaspora Organisations Supporting Education"),
      sub("scholarships", "Scholarships", "Diaspora scholarship programmes.", "Diaspora", "African Diaspora", "african-diaspora-organisations-supporting-education", "platinum-recognition", "African Diaspora Organisations Supporting Education"),
      sub("teacher-development", "Teacher Development", "Teacher-development partnerships.", "Diaspora", "African Diaspora", "african-diaspora-organisations-supporting-education", "platinum-recognition", "African Diaspora Organisations Supporting Education"),
      sub("digital-learning", "Digital Learning", "Diaspora-led digital-learning initiatives.", "Diaspora", "African Diaspora", "african-diaspora-organisations-supporting-education", "platinum-recognition", "African Diaspora Organisations Supporting Education"),
      sub("research-partnerships", "Research Partnerships", "Diaspora research partnerships with African institutions.", "Diaspora", "African Diaspora", "african-diaspora-organisations-supporting-education", "platinum-recognition", "African Diaspora Organisations Supporting Education"),
      sub("mentorship", "Mentorship", "Diaspora mentorship networks for African learners.", "Diaspora", "African Diaspora", "african-diaspora-organisations-supporting-education", "platinum-recognition", "African Diaspora Organisations Supporting Education"),
      sub("institutional-collaboration", "Institutional Collaboration", "University and institutional partnerships.", "Diaspora", "African Diaspora", "african-diaspora-organisations-supporting-education", "platinum-recognition", "African Diaspora Organisations Supporting Education"),
      sub("skills-professional-exchange", "Skills and Professional Exchange", "Skills and professional-exchange programmes.", "Diaspora", "African Diaspora", "african-diaspora-organisations-supporting-education", "platinum-recognition", "African Diaspora Organisations Supporting Education"),
    ],
    nominationCta: { heading: "Know a diaspora organisation giving back?", body: "Nominate a diaspora organisation whose work in African education is verifiable and sustained.", href: nominateHref("platinum-recognition", "african-diaspora-organisations-supporting-education") },
    nomineeCatalogue: { categoryTitle: "African Diaspora Organisations Supporting Education", grouping: "nominee_type" },
    faqs: [
      { q: "Which diaspora regions are recognised?", a: "North America, South America, Europe, Caribbean, Middle East, Asia, and Oceania." },
      { q: "Is the African Diaspora one of the eight Africa regions?", a: "No — African Diaspora is a distinct scope, separate from the eight Africa regions." },
      { q: "Are individuals eligible?", a: "Recognition here is for organisations; individuals may be recognised under Icon or Influencer categories." },
      { q: "Are private individual details published?", a: "No — private individuals' personal details are never published without consent." },
    ],
    seo: { title: "African Diaspora Educational Impact | NESA-Africa 2026", description: "Platinum recognition for African diaspora organisations supporting African education.", canonical: "https://nesa.africa/categories/diaspora-education-impact" },
  },
};

export const pathwayPages = pages;
export type PathwayPageId = keyof typeof pages;

export function getPathwayPage(id: PathwayPageId): DetailedAwardCategoryPage {
  return pages[id];
}
