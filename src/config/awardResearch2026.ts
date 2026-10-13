/** Document-backed presentation layer. Database taxonomy and nomination keys are unchanged. */
export interface ResearchPathway {
  slug: string;
  title: string;
  description: string;
  evidence: string;
  /** Only explicit matches to existing legacy subcategories; never guess a match. */
  legacyPrefixes: string[];
}
export interface AwardResearch {
  categorySlug: string;
  canonicalSlug: string;
  sourceFiles: string[];
  intro: string;
  pathways: ResearchPathway[];
  lenses?: string[];
}
export const RESEARCH_REGIONS = ["West Africa", "East Africa", "Central Africa", "Southern Africa", "North Africa", "Horn of Africa", "Sahel Africa", "Indian Ocean Islands", "African Diaspora", "Friends of Africa"];
export const RESEARCH_EVIDENCE_NOTE = "Research evidence grades describe the source documentation, not NESA verification, eligibility approval, finalist status or recognition. Named research leads remain private until reviewed through the existing NRC workflow.";
const pathway = (slug: string, title: string, description: string, legacyPrefixes: string[] = []): ResearchPathway => ({
  slug, title, description, legacyPrefixes,
  evidence: "Provide dated programme records, independently attributable delivery, partner confirmation and learner or institutional outcomes. Source claims and missing metrics require NRC review.",
});
export const AWARD_RESEARCH: AwardResearch[] = [
  {
    categorySlug: "best-stem-education-africa", canonicalSlug: "best-stem-education-programme-africa",
    sourceFiles: ["NESA_Best_STEM_Education_Programme_4_Categories.pdf", "NESA_STEM_Education_3_Categories_by_Region.pdf"],
    intro: "Four official STEM pathways distinguish school programmes, non-profit initiatives, digital delivery and girls' participation. Curriculum, technology integration and outreach are supporting research lenses, not additional award categories.",
    pathways: [
      pathway("stem-school-institution", "School / Institution Programme", "Curriculum-aligned practical STEM in schools and institutions: laboratories, teacher capacity, learner participation and progression."),
      pathway("stem-ngo-nonprofit", "NGO / Non-profit Initiative", "Named non-profit STEM initiatives delivering practical learning, mentorship and sustained community access."),
      pathway("stem-edtech-digital", "EdTech / Digital Programme", "Digital STEM curricula, coding, robotics, virtual laboratories and technology-enabled practical learning.", ["stem-digital-"]),
      pathway("stem-girls-initiative", "Girls-in-STEM Initiative", "Programmes demonstrating girls' participation, retention, mentorship and progression in STEM.", ["stem-girls-"]),
    ],
    lenses: ["STEM Curriculum Development & Practical Education", "Technology Integration in STEM Education", "STEM Outreach, Inclusion & Ecosystem Builders"],
  },
  {
    categorySlug: "best-edutech-organisation-africa", canonicalSlug: "best-edtech-innovation-africa",
    sourceFiles: ["NESA_Best_EduTech_Innovation_3_Categories.pdf"],
    intro: "The research distinguishes startup innovation, established company impact and social impact initiatives. Adoption, learning value, accessibility, affordability and learner protection remain central to evidence review.",
    pathways: [
      pathway("edutech-startup-innovation", "Startup Innovation", "Emerging education technology organisations with a live product and documented learning use.", ["edutech-startup-"]),
      pathway("edutech-established-impact", "Established Company Impact", "Operating education technology companies with sustained adoption, delivery and documented outcomes.", ["edutech-established-"]),
      pathway("edutech-social-impact", "Social Impact Initiative", "Non-profit and hybrid digital learning initiatives addressing equity, inclusion and underserved learners.", ["edutech-impact-", "edutech-social-"]),
    ],
  },
  {
    categorySlug: "islamic-education-impact-africa", canonicalSlug: "islamic-education-impact",
    sourceFiles: ["NESA_Excellence_in_Islamic_Education_Impact_3_Categories.pdf"],
    intro: "Islamic education research separates school systems, scholarship and waqf programmes, and Islamic studies, Arabic and Qur'anic institutions. Institutional legitimacy, safeguarding and documented education outcomes must be independently checked.",
    pathways: [
      pathway("islamic-school-networks", "Islamic School / Islamiyya Education Network", "Named school systems and Islamiyya networks delivering sustained formal and faith-based education."),
      pathway("islamic-scholarship-waqf", "Scholarship & Waqf Programme", "Documented scholarships and education waqf programmes with identifiable learners, partners and funding records."),
      pathway("islamic-studies-institutions", "Islamic Studies, Arabic & Qur'anic Institution", "Identifiable institutions delivering Islamic studies, Arabic or Qur'anic education with programme and institutional evidence."),
    ],
  },
  {
    categorySlug: "christian-education-impact-africa", canonicalSlug: "christian-education-impact",
    sourceFiles: ["NESA_Christian_FaithBased_and_Theological_Education_Research.pdf"],
    intro: "The source distinguishes Christian faith-based school systems from theological and Bible college education. Research scores are not NESA scores; accreditation, institutional continuity, safeguarding and learner evidence require review.",
    pathways: [
      pathway("christian-school-systems", "Christian Faith-Based School Systems", "Church-linked and Christian school systems with documented teaching, infrastructure, educator development and learner support."),
      pathway("christian-theological-colleges", "Theological & Bible College Education", "Named seminaries and Bible colleges with identifiable programmes, accreditation evidence and graduate records."),
    ],
  },
  {
    categorySlug: "international-bilateral-education", canonicalSlug: "international-partnership-education",
    sourceFiles: ["NESA_Best_International_Partnership_Refactored_by_Category_Region.pdf"],
    intro: "Partnership research follows four delivery models. African partner institutions, signed agreements, funding disclosures, delivery dates and education outcomes must be attributable to each named partnership.",
    pathways: [
      pathway("international-multilateral-un", "Multilateral / UN Agency Partnerships", "Education partnerships involving named multilateral or UN agencies and African institutions."),
      pathway("international-development-banks", "Development Bank Financing Partnerships", "Education financing with documented agreements, implementation and attributable institutional outcomes."),
      pathway("international-foundations", "Philanthropic & Foundation Partnerships", "Education grant-making and philanthropic partnerships with documented delivery and partner evidence."),
      pathway("international-emergencies", "Education in Emergencies / Crisis / Results-Based Financing", "Crisis-response and results-based education partnerships supporting learning continuity and accountable delivery."),
    ],
  },
  {
    categorySlug: "best-ngo-education-africa", canonicalSlug: "best-ngo-education-africa",
    sourceFiles: ["NESA_Best_NGO_Foundations_Icons_8_Categories_by_Region_1.pdf"],
    intro: "Five NGO research pathways focus on basic education, girls, displacement, inclusion and teacher development. Foundation research remains within the separate existing Icon pathways and is not merged into NGO or Influencer awards.",
    pathways: [
      pathway("ngo-basic-primary", "Basic & Primary Education", "Foundational learning, enrolment, retention and primary education delivery.", ["ngo-africa-basic-"]),
      pathway("ngo-girl-child", "Girl-Child Education", "Girls' access, retention, inclusion and education support.", ["ngo-africa-girlchild-"]),
      pathway("ngo-refugee-displaced", "Refugee & Displaced Children Education", "Learning continuity, safe learning spaces and education support for displaced learners.", ["ngo-africa-refugee-"]),
      pathway("ngo-special-inclusive", "Special Needs & Inclusive Education", "Accessible learning and documented support for learners with disabilities and other inclusion needs.", ["ngo-africa-special-"]),
      pathway("ngo-teacher-development", "Teacher Training & Development", "Educator development, teaching quality and sustained school support.", ["ngo-africa-teacher-"]),
    ],
  },
  {
    categorySlug: "best-csr-education-africa", canonicalSlug: "best-csr-education-africa",
    sourceFiles: ["NESA_Best_CSR_for_Education_10_Regions_Detailed_Work.pdf"],
    intro: "Corporate research documents scholarships, infrastructure, teacher development, digital access and programme delivery across eight African regions and two global communities. Funding and beneficiary figures are source claims until independently verified.",
    pathways: [],
  },
  {
    categorySlug: "africa-education-icon-award", canonicalSlug: "africa-education-icon-award",
    sourceFiles: ["NESA_Best_NGO_Foundations_Icons_8_Categories_by_Region_1.pdf"],
    intro: "Foundation research covers education advancement, philanthropic education and technical/TVET education. These are research contexts for the existing three Icon pathways, not new tiers or automatic eligibility approvals. Organisation research requires review against the existing individual Icon eligibility rules.",
    pathways: [],
  },
  ...["social-media", "music", "sports"].map((kind): AwardResearch => ({
    categorySlug: `africa-${kind}-influencer-education`, canonicalSlug: "influencer-education-impact-award",
    sourceFiles: ["NESA_Influencers_impact_Refactored_by_Region_2.pdf"],
    intro: `${kind === "social-media" ? "Social media" : kind === "sports" ? "Sports" : "Music"} research remains a separate pathway. Source entries distinguish delivered education work from announced support and lead-only claims. Fame, audience size and follower counts alone do not establish education impact. Continental / multi-region is a research grouping, not an extra African region.`,
    pathways: [],
  })),
];
export function getAwardResearch(slug?: string) {
  return AWARD_RESEARCH.find((entry) => entry.categorySlug === slug || entry.canonicalSlug === slug);
}
export function researchPath(category: AwardResearch, pathway: ResearchPathway) {
  return `/recognition/research/${category.categorySlug}/${pathway.slug}`;
}