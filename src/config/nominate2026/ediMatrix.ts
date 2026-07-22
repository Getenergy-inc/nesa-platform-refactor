// NESA-Africa 2026 — Category-Specific Education Development Index (EDI) Matrices.
//
// Architecture note
// ─────────────────
// Every matrix ships EXACTLY 8 indicators using the SAME slot keys
// (edi_lifetime_impact … edi_evidence_quality). Only the label + description
// change per tier/category/pathway. This keeps the nomination wizard's state
// shape stable across all 18 forms — the wizard renders labels/descriptions
// from the resolved matrix at runtime, but never has to remap state keys.
//
// Coverage: 22 matrices
//   Tier 1 — Africa Education Icon (3 pathways)
//   Tier 2 — Influencer Education Impact (3 pathways)
//   Tier 3 — Platinum (7 categories)
//   Tier 4 — Gold-Blue Garnet (9 categories)
//
// A single generic fallback (EDI_MATRIX_GENERIC) is preserved for any
// tier/category not yet mapped, so downstream consumers never render empty.

import type { TierSlug } from "./forms";

export interface EDIIndicator {
  /** Stable slot key shared by every matrix (drives wizard state). */
  id:
    | "edi_lifetime_impact"
    | "edi_scale_reach"
    | "edi_inclusion_equity"
    | "edi_innovation"
    | "edi_sustainability"
    | "edi_leadership"
    | "edi_continental_relevance"
    | "edi_evidence_quality";
  label: string;
  description: string;
}

export interface EDIMatrix {
  version: string;
  tier: TierSlug | "generic";
  category: string;
  /** Pathway slug (Tier 1 & 2 only). */
  pathway?: string;
  title: string;
  indicators: EDIIndicator[];
}

export const EDI_MATRIX_VERSION = "v2.0-category-specific-2026";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build a matrix by overriding label/description per slot.
// ─────────────────────────────────────────────────────────────────────────────
type SlotOverride = Partial<Pick<EDIIndicator, "label" | "description">>;

const SLOT_DEFAULTS: Record<EDIIndicator["id"], EDIIndicator> = {
  edi_lifetime_impact: {
    id: "edi_lifetime_impact",
    label: "Lifetime / Cumulative Impact",
    description: "Depth of contribution to education over the recognition period.",
  },
  edi_scale_reach: {
    id: "edi_scale_reach",
    label: "Scale & Reach",
    description: "Learners, institutions, or communities directly served or influenced.",
  },
  edi_inclusion_equity: {
    id: "edi_inclusion_equity",
    label: "Inclusion & Equity",
    description: "Gender balance, disability inclusion, and support for underserved populations.",
  },
  edi_innovation: {
    id: "edi_innovation",
    label: "Innovation & Relevance",
    description: "Novel methods, technologies, or approaches aligned with 21st-century needs.",
  },
  edi_sustainability: {
    id: "edi_sustainability",
    label: "Sustainability & Continuity",
    description: "Long-term viability, funding resilience, and institutional continuity.",
  },
  edi_leadership: {
    id: "edi_leadership",
    label: "Leadership & Integrity",
    description: "Governance record, transparency, and ethical stewardship.",
  },
  edi_continental_relevance: {
    id: "edi_continental_relevance",
    label: "Continental Relevance",
    description: "Alignment with African priorities, SDG 4, AU Agenda 2063, and cross-region reach.",
  },
  edi_evidence_quality: {
    id: "edi_evidence_quality",
    label: "Evidence Quality",
    description: "Strength of documentation: reports, audits, publications, independent verification.",
  },
};

function build(
  meta: Omit<EDIMatrix, "version" | "indicators">,
  overrides: Partial<Record<EDIIndicator["id"], SlotOverride>>,
): EDIMatrix {
  const indicators = (Object.keys(SLOT_DEFAULTS) as EDIIndicator["id"][]).map((id) => ({
    ...SLOT_DEFAULTS[id],
    ...(overrides[id] ?? {}),
  }));
  return { version: EDI_MATRIX_VERSION, indicators, ...meta };
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1 — Africa Education Icon (3 pathways, judged)
// ─────────────────────────────────────────────────────────────────────────────

export const EDI_ICON_PHILANTHROPY = build(
  {
    tier: "africa-education-icon",
    category: "africa-education-icon",
    pathway: "education-philanthropy-icon",
    title: "EDI Matrix — Africa Education Philanthropy Icon",
  },
  {
    edi_lifetime_impact: {
      label: "Cumulative Philanthropic Investment (2006–2026)",
      description: "Verified value of endowments, scholarships, and grants directed to education.",
    },
    edi_scale_reach: {
      label: "Beneficiary Reach",
      description: "Number of learners, teachers, or institutions funded across the two-decade window.",
    },
    edi_inclusion_equity: {
      label: "Equity of Distribution",
      description: "Reach into low-income, girl-child, disability, and post-conflict populations.",
    },
    edi_innovation: {
      label: "Model Innovation",
      description: "New funding models, matched-giving, or venture-philanthropy structures introduced.",
    },
    edi_sustainability: {
      label: "Endowment Sustainability",
      description: "Continuity of funding vehicles and institutional trusts beyond the founder.",
    },
    edi_leadership: {
      label: "Philanthropic Governance",
      description: "Transparent trusteeship, audit trails, and independent grant oversight.",
    },
    edi_continental_relevance: {
      label: "Cross-Border Giving",
      description: "Evidence of grants deployed across at least two African regions or one region + Diaspora.",
    },
    edi_evidence_quality: {
      label: "Audited Giving Records",
      description: "Independently audited disbursement records, foundation reports, and beneficiary testimonies.",
    },
  },
);

export const EDI_ICON_LITERARY = build(
  {
    tier: "africa-education-icon",
    category: "africa-education-icon",
    pathway: "literary-new-curriculum-advocate",
    title: "EDI Matrix — Literary & New Curriculum Advocate Icon",
  },
  {
    edi_lifetime_impact: {
      label: "Body of Literary / Curriculum Work",
      description: "Published works, textbooks, or approved curricula authored between 2006 and 2026.",
    },
    edi_scale_reach: {
      label: "Adoption Footprint",
      description: "Schools, ministries, and teacher-training bodies that formally adopted the work.",
    },
    edi_inclusion_equity: {
      label: "Indigenous Language & Inclusion",
      description: "Coverage of African languages, girls' literacy, and inclusive pedagogy.",
    },
    edi_innovation: {
      label: "Curriculum Innovation",
      description: "Introduction of new pedagogies, 21st-century skills, or decolonised content.",
    },
    edi_sustainability: {
      label: "Longevity in Use",
      description: "Continued classroom use, reprints, and revision cycles.",
    },
    edi_leadership: {
      label: "Editorial & Ethical Integrity",
      description: "Peer review record, plagiarism-free scholarship, and transparent authorship.",
    },
    edi_continental_relevance: {
      label: "Continental Curriculum Alignment",
      description: "Alignment with AU Agenda 2063, CESA, and multi-country adoption.",
    },
    edi_evidence_quality: {
      label: "Bibliographic & Ministerial Evidence",
      description: "ISBN records, ministry approval letters, and independent scholarly reviews.",
    },
  },
);

export const EDI_ICON_TECHNICAL = build(
  {
    tier: "africa-education-icon",
    category: "africa-education-icon",
    pathway: "technical-educator-icon",
    title: "EDI Matrix — Africa Technical Educator Icon",
  },
  {
    edi_lifetime_impact: {
      label: "Lifetime TVET / STEM Contribution",
      description: "Institutions founded, programmes led, or graduates produced in TVET, STEM, or digital skills.",
    },
    edi_scale_reach: {
      label: "Graduate & Apprentice Reach",
      description: "Numbers trained, certified, and placed in employment or further study.",
    },
    edi_inclusion_equity: {
      label: "Women & Youth in STEM/TVET",
      description: "Documented pipelines for girls, women, and out-of-school youth into technical fields.",
    },
    edi_innovation: {
      label: "Applied Innovation",
      description: "Patents, prototypes, industry partnerships, and problem-based learning designs.",
    },
    edi_sustainability: {
      label: "Workshop & Programme Continuity",
      description: "Ongoing operation of labs, workshops, and industry-linked training pipelines.",
    },
    edi_leadership: {
      label: "Technical Governance & Ethics",
      description: "Safety compliance, accreditation record, and ethical industry ties.",
    },
    edi_continental_relevance: {
      label: "Pan-African TVET Networks",
      description: "Membership in continental TVET bodies and cross-border programme replication.",
    },
    edi_evidence_quality: {
      label: "Accreditation & Placement Data",
      description: "Accreditation certificates, employer letters, and independent tracer studies.",
    },
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// TIER 2 — Influencer Education Impact (3 pathways, non-competitive)
// ─────────────────────────────────────────────────────────────────────────────

export const EDI_INFLUENCER_SOCIAL = build(
  {
    tier: "influencer-education-impact",
    category: "influencer-education-impact",
    pathway: "social-media",
    title: "EDI Matrix — Social Media Education Influencer",
  },
  {
    edi_lifetime_impact: {
      label: "Educational Content Body",
      description: "Volume and quality of educational content published between 2020 and 2026.",
    },
    edi_scale_reach: {
      label: "Verified Audience Reach",
      description: "Platform-verified reach and engagement of educational content (not vanity followers).",
    },
    edi_inclusion_equity: {
      label: "Inclusive Content Design",
      description: "Multi-language content, captioning, and accessibility for underserved learners.",
    },
    edi_innovation: {
      label: "Format Innovation",
      description: "Novel formats — micro-learning, live tutoring, community challenges.",
    },
    edi_sustainability: {
      label: "Publishing Consistency",
      description: "Sustained educational cadence beyond one-off viral moments.",
    },
    edi_leadership: {
      label: "Community Stewardship",
      description: "Moderation standards, safeguarding of minors, and misinformation controls.",
    },
    edi_continental_relevance: {
      label: "Cross-African Reach",
      description: "Documented viewership across multiple African regions or Diaspora.",
    },
    edi_evidence_quality: {
      label: "Platform & Analytics Evidence",
      description: "Platform analytics screenshots, third-party dashboards, testimonials from learners.",
    },
  },
);

export const EDI_INFLUENCER_SPORTS = build(
  {
    tier: "influencer-education-impact",
    category: "influencer-education-impact",
    pathway: "sports",
    title: "EDI Matrix — Sports Icon Supporting Education",
  },
  {
    edi_lifetime_impact: {
      label: "Educational Investment via Sport",
      description: "Value of scholarships, schools, or academies funded by the sports figure.",
    },
    edi_scale_reach: {
      label: "Youth Reached",
      description: "Children and youth enrolled, trained, or educated through the initiatives.",
    },
    edi_inclusion_equity: {
      label: "Access for Underserved Youth",
      description: "Reach into girls' education, disability sport, and low-income communities.",
    },
    edi_innovation: {
      label: "Sport-for-Education Design",
      description: "Innovative pairing of athletic development with academic outcomes.",
    },
    edi_sustainability: {
      label: "Foundation Continuity",
      description: "Ongoing operation and funding of the education arm beyond media cycles.",
    },
    edi_leadership: {
      label: "Public Conduct & Advocacy",
      description: "Consistent public advocacy for education and clean personal record.",
    },
    edi_continental_relevance: {
      label: "Pan-African Programme Reach",
      description: "Programme delivery across multiple African countries or Diaspora communities.",
    },
    edi_evidence_quality: {
      label: "Foundation Reports",
      description: "Audited foundation accounts, partner MOUs, and beneficiary testimonies.",
    },
  },
);

export const EDI_INFLUENCER_MUSIC = build(
  {
    tier: "influencer-education-impact",
    category: "influencer-education-impact",
    pathway: "music",
    title: "EDI Matrix — Music Icon Supporting Education",
  },
  {
    edi_lifetime_impact: {
      label: "Educational Investment via Music",
      description: "Scholarships, libraries, and music-education programmes funded.",
    },
    edi_scale_reach: {
      label: "Beneficiary Reach",
      description: "Learners supported through concerts, royalties, and dedicated programmes.",
    },
    edi_inclusion_equity: {
      label: "Access for Underserved Learners",
      description: "Reach into rural, refugee, and marginalised populations.",
    },
    edi_innovation: {
      label: "Creative Education Design",
      description: "Innovative use of music, arts and media to advance literacy or STEM.",
    },
    edi_sustainability: {
      label: "Programme Continuity",
      description: "Long-term operation of the education-supporting programme.",
    },
    edi_leadership: {
      label: "Public Advocacy & Conduct",
      description: "Consistent educational advocacy and integrity in public role.",
    },
    edi_continental_relevance: {
      label: "Pan-African & Diaspora Reach",
      description: "Documented programme reach across multiple African regions or Diaspora.",
    },
    edi_evidence_quality: {
      label: "Foundation & Media Evidence",
      description: "Audited accounts, partner letters, and independent media coverage.",
    },
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// TIER 3 — Platinum (7 categories, non-competitive)
// ─────────────────────────────────────────────────────────────────────────────

export const EDI_PLATINUM_LIBRARY = build(
  {
    tier: "platinum",
    category: "tertiary-institution-library",
    title: "EDI Matrix — Tertiary Institution Library",
  },
  {
    edi_lifetime_impact: {
      label: "Collections & Scholarly Depth",
      description: "Size, currency and academic depth of physical and digital collections.",
    },
    edi_scale_reach: {
      label: "Registered Users & Access Hours",
      description: "Students, faculty, and external researchers served annually.",
    },
    edi_inclusion_equity: {
      label: "Access for Persons with Disabilities",
      description: "Assistive tech, accessible catalogues, and inclusive membership policies.",
    },
    edi_innovation: {
      label: "Digital Library Innovation",
      description: "Institutional repositories, OER programmes, and research-data services.",
    },
    edi_sustainability: {
      label: "Preservation & Funding",
      description: "Conservation practice and diversified funding for continuity.",
    },
    edi_leadership: {
      label: "Library Governance",
      description: "Professional accreditation, ethics, and information-literacy programmes.",
    },
    edi_continental_relevance: {
      label: "African Consortia & Exchange",
      description: "Participation in AfLIA, EIFL, and cross-border resource sharing.",
    },
    edi_evidence_quality: {
      label: "Usage Analytics & Audits",
      description: "Verified circulation, gate counts, and independent audit reports.",
    },
  },
);

export const EDI_PLATINUM_RESEARCH = build(
  {
    tier: "platinum",
    category: "research-development",
    title: "EDI Matrix — Research & Development",
  },
  {
    edi_lifetime_impact: {
      label: "Research Contribution to Education",
      description: "Peer-reviewed research shaping African education policy or practice.",
    },
    edi_scale_reach: {
      label: "Policy & Curriculum Uptake",
      description: "Ministries, universities, or programmes that adopted the research outputs.",
    },
    edi_inclusion_equity: {
      label: "Equity Focus in Research Agenda",
      description: "Research addressing gender, disability, refugee, and low-income learners.",
    },
    edi_innovation: {
      label: "Methodological & Applied Innovation",
      description: "Novel methods, tools, or platforms produced and released.",
    },
    edi_sustainability: {
      label: "Funding Diversification",
      description: "Diversified grants and institutional endowment for continuity.",
    },
    edi_leadership: {
      label: "Ethics & Research Integrity",
      description: "IRB compliance, open-data practice, and conflict-of-interest management.",
    },
    edi_continental_relevance: {
      label: "Continental Research Networks",
      description: "Engagement with AAU, ARUA, CODESRIA, or SDG-4 research consortia.",
    },
    edi_evidence_quality: {
      label: "Publication & Citation Evidence",
      description: "DOIs, citation indices, and independently reviewed impact studies.",
    },
  },
);

export const EDI_PLATINUM_CHRISTIAN = build(
  {
    tier: "platinum",
    category: "christian-education-impact",
    title: "EDI Matrix — Christian Enablers of Education",
  },
  {
    edi_lifetime_impact: {
      label: "Educational Mission Footprint",
      description: "Schools, seminaries, and literacy programmes founded or sustained.",
    },
    edi_scale_reach: {
      label: "Learners Served",
      description: "Total learners across mission-run schools, colleges, and adult programmes.",
    },
    edi_inclusion_equity: {
      label: "Access Across Faiths & Communities",
      description: "Open enrolment policies and support for non-affiliated learners.",
    },
    edi_innovation: {
      label: "Pedagogical & Digital Innovation",
      description: "Modern pedagogy, blended learning, and life-skills integration.",
    },
    edi_sustainability: {
      label: "Institutional Continuity",
      description: "Governance and endowment structures ensuring intergenerational continuity.",
    },
    edi_leadership: {
      label: "Ethical Governance",
      description: "Safeguarding standards, transparent finances, and pastoral integrity.",
    },
    edi_continental_relevance: {
      label: "Continental Missional Reach",
      description: "Programmes across multiple African regions or Diaspora.",
    },
    edi_evidence_quality: {
      label: "Diocesan & Audit Records",
      description: "Denominational records, audited accounts, and independent evaluations.",
    },
  },
);

export const EDI_PLATINUM_ISLAMIC = build(
  {
    tier: "platinum",
    category: "islamic-education-impact",
    title: "EDI Matrix — Islamic Enablers of Education",
  },
  {
    edi_lifetime_impact: {
      label: "Educational Waqf Footprint",
      description: "Madaris, universities, and literacy programmes founded or endowed.",
    },
    edi_scale_reach: {
      label: "Learners Served",
      description: "Total learners across Islamic schools, universities, and adult programmes.",
    },
    edi_inclusion_equity: {
      label: "Girls' Education & Inclusion",
      description: "Documented enrolment and retention of girls and marginalised learners.",
    },
    edi_innovation: {
      label: "Integrated Curriculum Innovation",
      description: "Integration of religious and secular sciences, digital learning, and life skills.",
    },
    edi_sustainability: {
      label: "Waqf & Endowment Continuity",
      description: "Sustained waqf structures and diversified funding.",
    },
    edi_leadership: {
      label: "Ethical & Scholarly Integrity",
      description: "Recognised scholarly leadership, safeguarding, and transparent finances.",
    },
    edi_continental_relevance: {
      label: "Continental Reach",
      description: "Programmes across multiple African regions or Diaspora communities.",
    },
    edi_evidence_quality: {
      label: "Institutional & Audit Records",
      description: "Waqf deeds, accreditation, audited accounts, and independent evaluations.",
    },
  },
);

export const EDI_PLATINUM_POLITICAL = build(
  {
    tier: "platinum",
    category: "political-leadership",
    title: "EDI Matrix — Political Leadership Enablers",
  },
  {
    edi_lifetime_impact: {
      label: "Education Policy Reform Record",
      description: "Legislation, budgets, and reforms enacted that advanced education.",
    },
    edi_scale_reach: {
      label: "Learners Impacted by Reforms",
      description: "Estimated learners affected by policies during and after tenure.",
    },
    edi_inclusion_equity: {
      label: "Equity Legislation",
      description: "Laws or budgets addressing girls, disability, and out-of-school children.",
    },
    edi_innovation: {
      label: "Policy Innovation",
      description: "Novel financing, digital learning, or teacher-development frameworks introduced.",
    },
    edi_sustainability: {
      label: "Reform Continuity",
      description: "Durability of reforms across administrations.",
    },
    edi_leadership: {
      label: "Integrity in Office",
      description: "Clean anti-corruption record and transparent public financial management.",
    },
    edi_continental_relevance: {
      label: "AU / CESA Alignment",
      description: "Alignment with AU Agenda 2063 and CESA 16-25 education priorities.",
    },
    edi_evidence_quality: {
      label: "Gazetted & Independent Evidence",
      description: "Gazette records, audit reports, and independent policy evaluations.",
    },
  },
);

export const EDI_PLATINUM_INTERNATIONAL = build(
  {
    tier: "platinum",
    category: "international-partnership",
    title: "EDI Matrix — International Partnership Enablers",
  },
  {
    edi_lifetime_impact: {
      label: "Funding Committed to African Education",
      description: "Verified value and duration of educational funding to African countries.",
    },
    edi_scale_reach: {
      label: "Countries and Learners Reached",
      description: "African countries served and learners directly supported.",
    },
    edi_inclusion_equity: {
      label: "Equity Focus of Funding",
      description: "Share of funding directed to girls, disability, refugee, and rural learners.",
    },
    edi_innovation: {
      label: "Programme Innovation",
      description: "Novel financing (e.g. results-based, blended) and joint-innovation designs.",
    },
    edi_sustainability: {
      label: "Multi-Year Commitment",
      description: "Length and predictability of funding envelopes.",
    },
    edi_leadership: {
      label: "Partnership Governance",
      description: "Joint governance, local ownership, and transparent reporting.",
    },
    edi_continental_relevance: {
      label: "Alignment with African Priorities",
      description: "Alignment with AU Agenda 2063, CESA, and national education plans.",
    },
    edi_evidence_quality: {
      label: "Audited Partnership Reports",
      description: "Audited disbursement, joint evaluations, and third-party impact studies.",
    },
  },
);

export const EDI_PLATINUM_DIASPORA = build(
  {
    tier: "platinum",
    category: "diaspora-education-impact",
    title: "EDI Matrix — Diaspora Educational Impact",
  },
  {
    edi_lifetime_impact: {
      label: "Diaspora Educational Contribution",
      description: "Cumulative educational contribution from diaspora-led institutions to Africa.",
    },
    edi_scale_reach: {
      label: "African Countries Served",
      description: "Number of African countries where programmes have delivered outcomes.",
    },
    edi_inclusion_equity: {
      label: "Equity Focus",
      description: "Reach into underserved learners in origin countries.",
    },
    edi_innovation: {
      label: "Diaspora-Africa Model Innovation",
      description: "Innovative knowledge-transfer, remote-teaching, or twinning designs.",
    },
    edi_sustainability: {
      label: "Institutional Continuity",
      description: "Continuity of diaspora institutions across generations of leadership.",
    },
    edi_leadership: {
      label: "Governance & Integrity",
      description: "Registered status in host country and transparent finances.",
    },
    edi_continental_relevance: {
      label: "Africa-Wide Reach",
      description: "Programme footprint across at least two African regions.",
    },
    edi_evidence_quality: {
      label: "Audited Reports & MOUs",
      description: "Audited accounts, host-country registration, and African partner MOUs.",
    },
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// TIER 4 — Gold-Blue Garnet (9 categories, non-competitive)
// ─────────────────────────────────────────────────────────────────────────────

export const EDI_GBG_AFRICA_CSR = build(
  {
    tier: "gold-blue-garnet",
    category: "africa-regional-csr",
    title: "EDI Matrix — Africa Regional CSR",
  },
  {
    edi_lifetime_impact: {
      label: "CSR Investment in Education",
      description: "Verified corporate spend on education within the reporting window.",
    },
    edi_scale_reach: {
      label: "Learners & Schools Reached",
      description: "Beneficiary schools, teachers, and learners across African regions served.",
    },
    edi_inclusion_equity: {
      label: "Equity in CSR Design",
      description: "Focus on girls, disability, rural and low-income learners.",
    },
    edi_innovation: {
      label: "CSR Programme Innovation",
      description: "Innovative partnership designs and employee-volunteering models.",
    },
    edi_sustainability: {
      label: "Multi-Year CSR Continuity",
      description: "Continuity beyond single fiscal cycles.",
    },
    edi_leadership: {
      label: "Corporate Governance",
      description: "Board-level oversight of CSR, ESG disclosure, and transparency.",
    },
    edi_continental_relevance: {
      label: "Multi-Region Reach",
      description: "Programme reach across two or more of the 8 African regions or Diaspora.",
    },
    edi_evidence_quality: {
      label: "ESG & Audited Reports",
      description: "Audited CSR/ESG reports and independently evaluated programmes.",
    },
  },
);

export const EDI_GBG_NIGERIA_CSR = build(
  {
    tier: "gold-blue-garnet",
    category: "nigeria-csr",
    title: "EDI Matrix — Nigeria CSR",
  },
  {
    edi_lifetime_impact: {
      label: "CSR Investment in Nigerian Education",
      description: "Verified corporate spend on education within Nigeria in the reporting window.",
    },
    edi_scale_reach: {
      label: "States, Schools & Learners Reached",
      description: "Beneficiary states, schools, and learners across Nigeria's 6 geopolitical zones.",
    },
    edi_inclusion_equity: {
      label: "Equity in CSR Design",
      description: "Focus on girls, out-of-school children, IDPs, and PWDs.",
    },
    edi_innovation: {
      label: "Programme Innovation",
      description: "Novel partnerships with SUBEBs, NGOs, and community structures.",
    },
    edi_sustainability: {
      label: "Multi-Year Continuity",
      description: "Continuity of programme delivery across fiscal years.",
    },
    edi_leadership: {
      label: "Corporate Governance",
      description: "Board oversight and transparent CSR / NSE-ESG disclosure.",
    },
    edi_continental_relevance: {
      label: "Multi-Zone Reach in Nigeria",
      description: "Reach across two or more of the 6 geopolitical zones.",
    },
    edi_evidence_quality: {
      label: "Audited CSR Reports",
      description: "Audited CSR reports, NSE ESG disclosures, and independent evaluations.",
    },
  },
);

export const EDI_GBG_EDUTECH = build(
  {
    tier: "gold-blue-garnet",
    category: "africa-edutech",
    title: "EDI Matrix — Africa EduTech",
  },
  {
    edi_lifetime_impact: {
      label: "Learning Outcomes Delivered",
      description: "Verified learning outcomes attributable to the platform or tool.",
    },
    edi_scale_reach: {
      label: "Active Learner Base",
      description: "Monthly active learners across African markets served.",
    },
    edi_inclusion_equity: {
      label: "Access & Affordability",
      description: "Low-bandwidth support, offline mode, freemium and inclusive UX.",
    },
    edi_innovation: {
      label: "Product Innovation",
      description: "Novel pedagogy, AI use, adaptive learning, or local-language delivery.",
    },
    edi_sustainability: {
      label: "Business Model Sustainability",
      description: "Revenue model, runway, and evidence of durable operations.",
    },
    edi_leadership: {
      label: "Data & Safeguarding",
      description: "Learner data protection, child safeguarding, and ethical AI standards.",
    },
    edi_continental_relevance: {
      label: "Multi-Country Deployment",
      description: "Deployment across two or more African countries.",
    },
    edi_evidence_quality: {
      label: "Independent Impact Studies",
      description: "Third-party impact studies, RCTs, or usage analytics attested by auditors.",
    },
  },
);

export const EDI_GBG_NIGERIA_MEDIA = build(
  {
    tier: "gold-blue-garnet",
    category: "nigeria-media",
    title: "EDI Matrix — Nigeria Media",
  },
  {
    edi_lifetime_impact: {
      label: "Educational Coverage Volume",
      description: "Volume and quality of education-focused coverage produced.",
    },
    edi_scale_reach: {
      label: "Audience Reach",
      description: "Verified reach of educational coverage across Nigeria.",
    },
    edi_inclusion_equity: {
      label: "Coverage of Underserved Learners",
      description: "Reportage covering girls, IDPs, PWDs, and out-of-school children.",
    },
    edi_innovation: {
      label: "Format & Platform Innovation",
      description: "Investigative series, data journalism, radio-education, and podcasts.",
    },
    edi_sustainability: {
      label: "Editorial Continuity",
      description: "Sustained education desk / beat across at least three years.",
    },
    edi_leadership: {
      label: "Editorial Integrity",
      description: "Adherence to NUJ standards, corrections policy, and source protection.",
    },
    edi_continental_relevance: {
      label: "Multi-Zone Coverage",
      description: "Coverage spanning multiple Nigerian geopolitical zones.",
    },
    edi_evidence_quality: {
      label: "Circulation & Analytics Evidence",
      description: "Verified circulation, digital analytics, and independent citations.",
    },
  },
);

export const EDI_GBG_NIGERIA_NGO = build(
  {
    tier: "gold-blue-garnet",
    category: "nigeria-ngo",
    title: "EDI Matrix — Nigeria NGO",
  },
  {
    edi_lifetime_impact: {
      label: "Programme Outcomes",
      description: "Verified educational outcomes delivered in Nigeria.",
    },
    edi_scale_reach: {
      label: "Beneficiaries Reached",
      description: "Learners, teachers, and schools directly served.",
    },
    edi_inclusion_equity: {
      label: "Equity Focus",
      description: "Reach into girls, IDPs, PWDs, and almajiri populations.",
    },
    edi_innovation: {
      label: "Programme Design Innovation",
      description: "Novel delivery models, community mobilisation, or tech use.",
    },
    edi_sustainability: {
      label: "Financial & Programme Continuity",
      description: "Diversified funding and multi-year continuity.",
    },
    edi_leadership: {
      label: "NGO Governance",
      description: "SCUML/CAC compliance, safeguarding policies, and audited accounts.",
    },
    edi_continental_relevance: {
      label: "Multi-Zone Delivery",
      description: "Delivery across two or more Nigerian geopolitical zones.",
    },
    edi_evidence_quality: {
      label: "Audited Programme Reports",
      description: "Audited reports, donor evaluations, and beneficiary testimony.",
    },
  },
);

export const EDI_GBG_AFRICA_NGO = build(
  {
    tier: "gold-blue-garnet",
    category: "africa-regional-ngo",
    title: "EDI Matrix — Africa Regional NGO",
  },
  {
    edi_lifetime_impact: {
      label: "Programme Outcomes Delivered",
      description: "Verified educational outcomes across African regions served.",
    },
    edi_scale_reach: {
      label: "Countries & Beneficiaries Reached",
      description: "Countries operated in and learners/teachers directly served.",
    },
    edi_inclusion_equity: {
      label: "Equity in Programme Design",
      description: "Explicit strategies for girls, disability, refugee and low-income learners.",
    },
    edi_innovation: {
      label: "Programme Innovation",
      description: "Novel delivery models, tech use, or community-led designs.",
    },
    edi_sustainability: {
      label: "Financial Continuity",
      description: "Diversified funding and multi-year delivery record.",
    },
    edi_leadership: {
      label: "NGO Governance & Safeguarding",
      description: "Registered status per country and safeguarding standards.",
    },
    edi_continental_relevance: {
      label: "Multi-Region African Reach",
      description: "Reach across two or more of the 8 African regions.",
    },
    edi_evidence_quality: {
      label: "Audited Reports & Evaluations",
      description: "Audited accounts, donor evaluations, and third-party impact studies.",
    },
  },
);

export const EDI_GBG_STEM = build(
  {
    tier: "gold-blue-garnet",
    category: "africa-stem",
    title: "EDI Matrix — Africa STEM Programme",
  },
  {
    edi_lifetime_impact: {
      label: "STEM Learner Outcomes",
      description: "Verified STEM learning outcomes and downstream placements.",
    },
    edi_scale_reach: {
      label: "Learners & Educators Reached",
      description: "STEM learners and teachers trained across African countries served.",
    },
    edi_inclusion_equity: {
      label: "Girls & Underserved in STEM",
      description: "Documented pipelines for girls, PWDs, and low-income learners.",
    },
    edi_innovation: {
      label: "STEM Pedagogy Innovation",
      description: "Applied learning, robotics, AI, and problem-based curriculum.",
    },
    edi_sustainability: {
      label: "Programme & Equipment Continuity",
      description: "Continuity of labs, kits, and teacher-support structures.",
    },
    edi_leadership: {
      label: "Safety & Ethical Standards",
      description: "Lab safety, child safeguarding, and ethical partnership standards.",
    },
    edi_continental_relevance: {
      label: "Multi-Country Delivery",
      description: "Delivery across two or more African countries or regions.",
    },
    edi_evidence_quality: {
      label: "Outcome & Tracer Studies",
      description: "Assessment data, tracer studies, and independent evaluations.",
    },
  },
);

export const EDI_GBG_CREATIVE_ARTS = build(
  {
    tier: "gold-blue-garnet",
    category: "nigeria-creative-arts",
    title: "EDI Matrix — Nigeria Creative Arts Programme",
  },
  {
    edi_lifetime_impact: {
      label: "Creative-Education Outcomes",
      description: "Verified learning outcomes delivered through creative-arts programming.",
    },
    edi_scale_reach: {
      label: "Learners Reached",
      description: "Youth and children reached across Nigerian states and zones served.",
    },
    edi_inclusion_equity: {
      label: "Access for Underserved Youth",
      description: "Reach into low-income communities, IDPs, and PWDs.",
    },
    edi_innovation: {
      label: "Creative Pedagogy Innovation",
      description: "Novel integration of arts with literacy, life skills, or civic education.",
    },
    edi_sustainability: {
      label: "Programme Continuity",
      description: "Continuity of production, delivery, and teacher-artist pipelines.",
    },
    edi_leadership: {
      label: "Safeguarding & Ethics",
      description: "Child safeguarding, copyright integrity, and transparent finances.",
    },
    edi_continental_relevance: {
      label: "Multi-Zone Reach",
      description: "Delivery across two or more Nigerian geopolitical zones.",
    },
    edi_evidence_quality: {
      label: "Programme Documentation",
      description: "Production records, audience data, and independent evaluations.",
    },
  },
);

export const EDI_GBG_EDU_FRIENDLY_STATES = build(
  {
    tier: "gold-blue-garnet",
    category: "nigeria-education-friendly-states",
    title: "EDI Matrix — Nigeria Education-Friendly States",
  },
  {
    edi_lifetime_impact: {
      label: "State Investment in Education",
      description: "State budgetary commitment to education relative to total spend.",
    },
    edi_scale_reach: {
      label: "Learners Reached by Reforms",
      description: "Learners across basic, secondary, and tertiary levels affected by state action.",
    },
    edi_inclusion_equity: {
      label: "Equity Policies at State Level",
      description: "Policies addressing girls, PWDs, IDPs, almajiri and out-of-school children.",
    },
    edi_innovation: {
      label: "State-Level Innovation",
      description: "Novel state programmes, digital learning, and teacher-development frameworks.",
    },
    edi_sustainability: {
      label: "Reform Durability",
      description: "Durability of reforms across administrations and budget cycles.",
    },
    edi_leadership: {
      label: "State Governance & Integrity",
      description: "Anti-corruption record and transparent education-budget disclosure.",
    },
    edi_continental_relevance: {
      label: "Alignment with National & Continental Plans",
      description: "Alignment with the National Policy on Education, CESA and AU Agenda 2063.",
    },
    edi_evidence_quality: {
      label: "Gazetted & Audited Evidence",
      description: "State Gazette records, audit reports, and independent policy evaluations.",
    },
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Generic fallback (kept for downstream compatibility).
// ─────────────────────────────────────────────────────────────────────────────

export const EDI_MATRIX_GENERIC_MATRIX: EDIMatrix = build(
  {
    tier: "generic",
    category: "generic",
    title: "EDI Matrix — Generic (Fallback)",
  },
  {},
);

/** Legacy export kept for existing hub/shell code paths. */
export const EDI_MATRIX_GENERIC: EDIIndicator[] = EDI_MATRIX_GENERIC_MATRIX.indicators;

// ─────────────────────────────────────────────────────────────────────────────
// Registry + resolver
// ─────────────────────────────────────────────────────────────────────────────

/** Matrices keyed by `${tier}/${category}` or `${tier}/${category}#${pathway}`. */
export const EDI_MATRICES: Record<string, EDIMatrix> = {
  // Tier 1
  "africa-education-icon/africa-education-icon#education-philanthropy-icon": EDI_ICON_PHILANTHROPY,
  "africa-education-icon/africa-education-icon#literary-new-curriculum-advocate": EDI_ICON_LITERARY,
  "africa-education-icon/africa-education-icon#technical-educator-icon": EDI_ICON_TECHNICAL,
  // Tier 2
  "influencer-education-impact/influencer-education-impact#social-media": EDI_INFLUENCER_SOCIAL,
  "influencer-education-impact/influencer-education-impact#sports": EDI_INFLUENCER_SPORTS,
  "influencer-education-impact/influencer-education-impact#music": EDI_INFLUENCER_MUSIC,
  // Tier 3
  "platinum/tertiary-institution-library": EDI_PLATINUM_LIBRARY,
  "platinum/research-development": EDI_PLATINUM_RESEARCH,
  "platinum/christian-education-impact": EDI_PLATINUM_CHRISTIAN,
  "platinum/islamic-education-impact": EDI_PLATINUM_ISLAMIC,
  "platinum/political-leadership": EDI_PLATINUM_POLITICAL,
  "platinum/international-partnership": EDI_PLATINUM_INTERNATIONAL,
  "platinum/diaspora-education-impact": EDI_PLATINUM_DIASPORA,
  // Tier 4
  "gold-blue-garnet/africa-regional-csr": EDI_GBG_AFRICA_CSR,
  "gold-blue-garnet/nigeria-csr": EDI_GBG_NIGERIA_CSR,
  "gold-blue-garnet/africa-edutech": EDI_GBG_EDUTECH,
  "gold-blue-garnet/nigeria-media": EDI_GBG_NIGERIA_MEDIA,
  "gold-blue-garnet/nigeria-ngo": EDI_GBG_NIGERIA_NGO,
  "gold-blue-garnet/africa-regional-ngo": EDI_GBG_AFRICA_NGO,
  "gold-blue-garnet/africa-stem": EDI_GBG_STEM,
  "gold-blue-garnet/nigeria-creative-arts": EDI_GBG_CREATIVE_ARTS,
  "gold-blue-garnet/nigeria-education-friendly-states": EDI_GBG_EDU_FRIENDLY_STATES,
};

/**
 * Resolve the correct EDI matrix for a given tier + category (and optional
 * pathway for Tier 1 & 2). Falls back to the category-only variant, then to
 * the generic matrix, so callers always get 8 indicators.
 */
export function getEDIMatrix(
  tier: TierSlug | string | undefined,
  category: string | undefined,
  pathway?: string,
): EDIMatrix {
  if (!tier || !category) return EDI_MATRIX_GENERIC_MATRIX;
  if (pathway) {
    const keyed = EDI_MATRICES[`${tier}/${category}#${pathway}`];
    if (keyed) return keyed;
  }
  const base = EDI_MATRICES[`${tier}/${category}`];
  return base ?? EDI_MATRIX_GENERIC_MATRIX;
}

/** Convenience: list every matrix for admin/QA screens. */
export function listAllEDIMatrices(): EDIMatrix[] {
  return Object.values(EDI_MATRICES);
}
