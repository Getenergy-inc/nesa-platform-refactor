import type { AwardCategoryConfig } from "./types";
import { buildStandardFaqs } from "./faqBuilder";

const G = "platinum" as const;
const PARENT = "/awards/platinum-certificate-categories";
const url = (slug: string) => `${PARENT}/${slug}`;

const juryReview =
  "NRC eligibility → independent jury review → final Platinum certificate decision. No public vote.";
const juryEvidence: string[] = [];

export const PLATINUM_CATEGORIES: AwardCategoryConfig[] = [
  {
    slug: "library-nigeria",
    finalName: "Best Library in Nigerian Tertiary Institutions",
    group: G,
    url: url("library-nigeria"),
    parentPage: PARENT,
    shortDescription:
      "Celebrating the best academic libraries across Nigerian tertiary institutions — knowledge sanctuaries shaping scholarship.",
    eligibilitySummary: "Accredited Nigerian tertiary institutions with documented library service excellence.",
    whoCanBeNominated: "University, polytechnic and college libraries within Nigeria.",
    whoCanNominate: "Faculty, students, partners, or institution self-nomination.",
    requiredEvidence: [
      "Library service overview",
      "Collection and digital catalogue evidence",
      "Usage statistics",
      "Innovation or research-support evidence",
    ],
    reviewMethod: juryReview,
    votingRole: "No public voting.",
    judgingRole: "Independent jury review and final decision.",
    relatedCategories: ["rd-nigeria", "education-state-nigeria"],
    seoTitle: "Best Library in Nigerian Tertiary Institutions | NESA-Africa 2026",
    metaDescription:
      "Nominate the best academic libraries across Nigerian tertiary institutions for Platinum recognition.",
    faqs: buildStandardFaqs({
      eligibility: "Accredited Nigerian tertiary institution libraries.",
      whoCanNominate: "Faculty, students, partners or institution self-nomination.",
      evidence: "Service overview, collection/catalogue evidence, usage stats, research-support evidence.",
      publicVoting: "No. Platinum categories are decided by independent jury review only.",
      review: "NRC eligibility check followed by independent jury review and final decision.",
    }),
    legacyComponentKey: "LibraryNigeria",
    mergedFrom: ["/categories/library-nigeria", "/category/library-nigeria"],
  },
  {
    slug: "rd-nigeria",
    finalName: "Best R&D Contribution to Education (Nigeria)",
    group: G,
    url: url("rd-nigeria"),
    parentPage: PARENT,
    shortDescription:
      "Recognising Nigerian R&D institutions producing the research that shapes tomorrow's classrooms and curricula.",
    eligibilitySummary: "Nigerian R&D institutions, university research centres or independent research bodies.",
    whoCanBeNominated: "Institutional research units with published education-relevant outputs.",
    whoCanNominate: "Peers, partners, academics, or self-nomination.",
    requiredEvidence: [
      "Published research outputs",
      "Adoption or policy-impact evidence",
      "Funding and partnership disclosure",
      "Peer endorsements",
    ],
    reviewMethod: juryReview,
    votingRole: "No public voting.",
    judgingRole: "Independent jury review.",
    relatedCategories: ["library-nigeria", "stem-education-africa"],
    seoTitle: "Best R&D Contribution to Education (Nigeria) | NESA-Africa 2026",
    metaDescription:
      "Nominate the Nigerian R&D institutions reshaping classrooms, curricula and learner outcomes through research.",
    faqs: buildStandardFaqs({
      eligibility: "Nigerian R&D institutions, university research centres or independent research bodies.",
      whoCanNominate: "Peers, partners, academics or self-nomination.",
      evidence: "Published outputs, adoption/policy-impact evidence, funding disclosure, peer endorsements.",
      publicVoting: "No. Platinum categories are decided by independent jury review only.",
      review: "NRC eligibility followed by independent jury review.",
    }),
    legacyComponentKey: "ResearchDevelopmentNigeria",
    mergedFrom: ["/categories/rd-nigeria", "/category/research-development-nigeria"],
  },
  {
    slug: "christian-education-africa",
    finalName: "Christian Education Impact (Africa)",
    group: G,
    url: url("christian-education-africa"),
    parentPage: PARENT,
    shortDescription:
      "Recognising Christian institutions and missions delivering measurable educational impact across Africa.",
    eligibilitySummary: "Faith-based institutions, missions or networks delivering documented education programmes.",
    whoCanBeNominated: "Schools, seminaries, denominational education bodies, mission education projects.",
    whoCanNominate: "Anyone — public, beneficiaries, partners or self-nomination.",
    requiredEvidence: [
      "Programme and beneficiary data",
      "Partner attestations",
      "Outcome evidence",
      "Governance disclosure",
    ],
    reviewMethod: juryReview,
    votingRole: "No public voting.",
    judgingRole: "Independent jury review.",
    relatedCategories: ["islamic-education-africa", "ngo-education-africa"],
    seoTitle: "Christian Education Impact (Africa) | NESA-Africa 2026",
    metaDescription:
      "Nominate Christian institutions and missions delivering measurable educational impact across Africa.",
    faqs: buildStandardFaqs({
      eligibility: "Faith-based institutions, missions or networks with documented education programmes.",
      whoCanNominate: "Anyone, subject to NRC verification.",
      evidence: "Programme/beneficiary data, partner attestations, outcome evidence, governance disclosure.",
      publicVoting: "No. Platinum categories are decided by independent jury review only.",
      review: "NRC eligibility followed by independent jury review.",
    }),
    legacyComponentKey: "ChristianEducationAfrica",
    mergedFrom: ["/categories/christian-africa", "/category/christian-education-africa"],
  },
  {
    slug: "islamic-education-africa",
    finalName: "Islamic Education Impact (Africa)",
    group: G,
    url: url("islamic-education-africa"),
    parentPage: PARENT,
    shortDescription:
      "Recognising Islamic institutions and networks delivering measurable educational impact across Africa.",
    eligibilitySummary: "Faith-based Islamic institutions or networks delivering documented education programmes.",
    whoCanBeNominated: "Madrasas, Islamic schools, university faculties and education networks.",
    whoCanNominate: "Anyone — public, beneficiaries, partners or self-nomination.",
    requiredEvidence: [
      "Programme and beneficiary data",
      "Partner attestations",
      "Outcome evidence",
      "Governance disclosure",
    ],
    reviewMethod: juryReview,
    votingRole: "No public voting.",
    judgingRole: "Independent jury review.",
    relatedCategories: ["christian-education-africa", "ngo-education-africa"],
    seoTitle: "Islamic Education Impact (Africa) | NESA-Africa 2026",
    metaDescription:
      "Nominate Islamic institutions and networks delivering measurable educational impact across Africa.",
    faqs: buildStandardFaqs({
      eligibility: "Islamic institutions or networks with documented education programmes.",
      whoCanNominate: "Anyone, subject to NRC verification.",
      evidence: "Programme/beneficiary data, partner attestations, outcome evidence, governance disclosure.",
      publicVoting: "No. Platinum categories are decided by independent jury review only.",
      review: "NRC eligibility followed by independent jury review.",
    }),
    legacyComponentKey: "IslamicEducationAfrica",
    mergedFrom: ["/categories/islamic-africa", "/category/islamic-education-africa"],
  },
  {
    slug: "political-leaders-nigeria",
    finalName: "Political Leaders' Contribution to Education (Nigeria)",
    group: G,
    url: url("political-leaders-nigeria"),
    parentPage: PARENT,
    shortDescription:
      "Recognising Nigerian political leaders whose policy and budget action delivered measurable education outcomes.",
    eligibilitySummary:
      "Serving or former Nigerian political leaders with documented, attributable education-policy outcomes.",
    whoCanBeNominated: "Governors, ministers, commissioners, legislators or executive office-holders.",
    whoCanNominate: "Civic groups, education stakeholders, the public, or self-nomination with disclosure.",
    requiredEvidence: [
      "Policy or legislation citations",
      "Budget allocation evidence",
      "Outcome data with independent verification",
      "Independent media/civic society attestation",
    ],
    reviewMethod: juryReview,
    votingRole: "No public voting.",
    judgingRole: "Independent jury review with policy-expert panel and integrity check.",
    relatedCategories: ["education-state-nigeria", "csr-education-nigeria"],
    seoTitle: "Political Leaders' Contribution to Education (Nigeria) | NESA-Africa 2026",
    metaDescription:
      "Nominate Nigerian political leaders whose policy and budget action delivered measurable education outcomes.",
    faqs: buildStandardFaqs({
      eligibility: "Serving or former Nigerian political leaders with documented, attributable education-policy outcomes.",
      whoCanNominate: "Civic groups, stakeholders, the public, or self-nomination with disclosure.",
      evidence: "Policy/legislation citations, budget evidence, outcome data with independent verification.",
      publicVoting: "No. Platinum categories are decided by independent jury review only.",
      review: "NRC eligibility followed by independent jury review (policy-expert panel + integrity check).",
    }),
    legacyComponentKey: "PoliticalLeadersNigeria",
    mergedFrom: ["/categories/political-nigeria", "/category/political-leaders-nigeria"],
  },
  {
    slug: "international-education",
    finalName: "International / Bilateral Education Partnerships",
    group: G,
    url: url("international-education"),
    parentPage: PARENT,
    shortDescription:
      "Recognising bilateral agencies, foreign governments and global partners delivering measurable education impact in Africa.",
    eligibilitySummary:
      "Bilateral or multilateral agencies, foreign governments, foundations or partnerships with documented programmes in Africa.",
    whoCanBeNominated: "Embassies, bilateral agencies, multilaterals, international foundations.",
    whoCanNominate: "Anyone, subject to NRC verification.",
    requiredEvidence: [
      "Programme overview and country coverage",
      "Beneficiary data with citations",
      "Local-partner attestation",
      "Outcome evidence",
    ],
    reviewMethod: juryReview,
    votingRole: "No public voting.",
    judgingRole: "Independent jury review.",
    relatedCategories: ["diaspora-impact", "ngo-education-africa"],
    seoTitle: "International / Bilateral Education Partnerships | NESA-Africa 2026",
    metaDescription:
      "Nominate bilateral, multilateral and international partners delivering measurable education impact in Africa.",
    faqs: buildStandardFaqs({
      eligibility: "Bilateral/multilateral agencies, foreign governments, foundations or partnerships with African programmes.",
      whoCanNominate: "Anyone, subject to NRC verification.",
      evidence: "Programme overview, beneficiary data with citations, local-partner attestation, outcome evidence.",
      publicVoting: "No. Platinum categories are decided by independent jury review only.",
      review: "NRC eligibility followed by independent jury review.",
    }),
    legacyComponentKey: "InternationalEducation",
    mergedFrom: [
      "/categories/international",
      "/awards/grants-global-support",
      "/awards/global-partnerships",
      "/category/international-education",
    ],
  },
  {
    slug: "diaspora-impact",
    finalName: "Diaspora Association Educational Impact",
    group: G,
    url: url("diaspora-impact"),
    parentPage: PARENT,
    shortDescription:
      "Honouring African diaspora associations funding scholarships, building schools and powering education back home.",
    eligibilitySummary:
      "Registered diaspora associations channelling resources into education programmes in their countries of origin.",
    whoCanBeNominated: "Hometown associations, professional diaspora networks, country-of-origin foundations.",
    whoCanNominate: "Anyone — diaspora members, beneficiaries, partners or self-nomination.",
    requiredEvidence: [
      "Association registration",
      "Programme and beneficiary data",
      "Local-partner attestation",
      "Financial disclosure",
    ],
    reviewMethod: juryReview,
    votingRole: "No public voting.",
    judgingRole: "Independent jury review.",
    relatedCategories: ["international-education", "ngo-education-africa"],
    seoTitle: "Diaspora Association Educational Impact | NESA-Africa 2026",
    metaDescription:
      "Nominate African diaspora associations funding scholarships, schools and education impact back home.",
    faqs: buildStandardFaqs({
      eligibility: "Registered diaspora associations with education programmes in their countries of origin.",
      whoCanNominate: "Anyone, including diaspora members, beneficiaries, partners or self-nomination.",
      evidence: "Association registration, programme/beneficiary data, local-partner attestation, financial disclosure.",
      publicVoting: "No. Platinum categories are decided by independent jury review only.",
      review: "NRC eligibility followed by independent jury review.",
    }),
    legacyComponentKey: "DiasporaEducation",
    mergedFrom: ["/categories/diaspora-impact", "/category/diaspora-education"],
  },
];
