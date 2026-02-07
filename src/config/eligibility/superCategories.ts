/**
 * NESA-Africa 2025 — Super Category–Specific Checklists
 */

export type SuperCategory = "blue_garnet_icon" | "blue_garnet_gold" | "platinum";

export interface CategoryCheck {
  id: string;
  label: string;
  description: string;
  required: boolean;
  minToPass?: number; // For "meet ≥X" requirements
  aiAssistEnabled: boolean;
}

export interface SuperCategoryConfig {
  id: SuperCategory;
  name: string;
  purpose: string;
  competitive: boolean;
  subcategoryCount?: number;
  routing: string;
  eligibility: CategoryCheck[];
  impactRecognition?: CategoryCheck[]; // For Icon category
  additionalChecks?: Record<string, CategoryCheck[]>; // Subcategory-specific
}

// Blue Garnet — African Education Icon (Non-Competitive; 9 Icons)
export const BLUE_GARNET_ICON_CONFIG: SuperCategoryConfig = {
  id: "blue_garnet_icon",
  name: "Blue Garnet — African Education Icon",
  purpose: "Honor lifetime/continental influence and ethical leadership in education",
  competitive: false,
  subcategoryCount: 9,
  routing: "All-Judges internal ballot (1–10) → Honors Committee validation (no public vote)",
  eligibility: [
    {
      id: "icon_10_years",
      label: "10+ Years Contribution",
      description: "10+ years of sustained, documented contribution to education",
      required: true,
      aiAssistEnabled: true,
    },
    {
      id: "icon_continental_reach",
      label: "Continental Reach",
      description: "Continental reach or multi-country influence (policies, systems, or large networks)",
      required: true,
      aiAssistEnabled: true,
    },
    {
      id: "icon_ethical_record",
      label: "Ethical Record",
      description: "Ethical record: no unresolved integrity issues; role-model conduct",
      required: true,
      aiAssistEnabled: true,
    },
    {
      id: "icon_legacy_evidence",
      label: "Legacy Evidence",
      description: "Legacy evidence: policy adoptions, reforms, institutions built, literature, or programs scaled",
      required: true,
      aiAssistEnabled: true,
    },
  ],
  impactRecognition: [
    {
      id: "icon_policy_change",
      label: "Policy/System Change",
      description: "Policy or system change adopted by a ministry/multi-lateral",
      required: false,
      minToPass: 3,
      aiAssistEnabled: true,
    },
    {
      id: "icon_measurable_gains",
      label: "Measurable Gains at Scale",
      description: "Measurable gains at scale (enrolment, completion, learning outcomes, TVET placement)",
      required: false,
      minToPass: 3,
      aiAssistEnabled: true,
    },
    {
      id: "icon_mentorship_pipeline",
      label: "Mentorship Pipeline",
      description: "Mentorship or pipeline created for educators/leaders",
      required: false,
      minToPass: 3,
      aiAssistEnabled: true,
    },
    {
      id: "icon_sdg4_au2063",
      label: "SDG 4 / AU 2063 Contributions",
      description: "Documented contributions to SDG 4 targets or AU 2063 education goals",
      required: false,
      minToPass: 3,
      aiAssistEnabled: true,
    },
  ],
};

// Blue Garnet — Gold Certificate (Competitive; 101 subcategories)
export const BLUE_GARNET_GOLD_CONFIG: SuperCategoryConfig = {
  id: "blue_garnet_gold",
  name: "Blue Garnet — Gold Certificate",
  purpose: "Recognize measurable excellence & innovation with public engagement",
  competitive: true,
  subcategoryCount: 101,
  routing: "Stage-1 Judges scoring (1–10) → Public rating (1–10) → Final = 60% Public + 40% Judges (no sponsor voting)",
  eligibility: [
    {
      id: "gold_active_program",
      label: "Active Program",
      description: "Program/initiative active in 2023–2025 with current beneficiaries",
      required: true,
      aiAssistEnabled: true,
    },
    {
      id: "gold_toc_kpis",
      label: "Theory of Change & KPIs",
      description: "Clear theory of change/KPIs and recent M&E data",
      required: true,
      aiAssistEnabled: true,
    },
    {
      id: "gold_replicable",
      label: "Replicable/Scalable Model",
      description: "Replicable or scalable model (documented processes/partnerships)",
      required: true,
      aiAssistEnabled: true,
    },
    {
      id: "gold_no_pay_to_win",
      label: "No Pay-to-Win",
      description: "No pay-to-win or unethical fundraising that compromises access or results",
      required: true,
      aiAssistEnabled: true,
    },
  ],
  additionalChecks: {
    edtech: [
      { id: "edtech_offline", label: "Offline/Low-Data Access", description: "Accessibility offline/low-data", required: false, aiAssistEnabled: true },
      { id: "edtech_privacy", label: "Privacy by Design", description: "Privacy-by-design implementation", required: false, aiAssistEnabled: true },
      { id: "edtech_learning", label: "Usage → Learning Evidence", description: "Evidence linking usage to learning outcomes", required: false, aiAssistEnabled: true },
    ],
    early_years: [
      { id: "ey_safety_ratios", label: "Child Safety Ratios", description: "Child safety ratios maintained", required: false, aiAssistEnabled: true },
      { id: "ey_play_based", label: "Play-Based Pedagogy", description: "Play-based pedagogy approach", required: false, aiAssistEnabled: true },
      { id: "ey_caregiver", label: "Caregiver Engagement", description: "Caregiver engagement programs", required: false, aiAssistEnabled: true },
    ],
    tvet_skills: [
      { id: "tvet_employer", label: "Employer Links", description: "Active employer partnerships", required: false, aiAssistEnabled: true },
      { id: "tvet_credential", label: "Credentialing", description: "Recognized credentialing system", required: false, aiAssistEnabled: true },
      { id: "tvet_placement", label: "6-Month Placement Data", description: "≥6-month placement/earnings data", required: false, aiAssistEnabled: true },
    ],
    teacher_dev: [
      { id: "teacher_coaching", label: "Coaching Cycles", description: "Structured coaching cycles", required: false, aiAssistEnabled: true },
      { id: "teacher_observation", label: "Classroom Observation", description: "Classroom observation data", required: false, aiAssistEnabled: true },
      { id: "teacher_cert", label: "Certification", description: "Teacher certification programs", required: false, aiAssistEnabled: true },
    ],
    girls_education: [
      { id: "girls_transition", label: "Transition/Retention", description: "Transition and retention programs", required: false, aiAssistEnabled: true },
      { id: "girls_srh_gbv", label: "SRH/GBV Safeguards", description: "Sexual health and GBV protection", required: false, aiAssistEnabled: true },
    ],
    inclusion_disability: [
      { id: "incl_udl", label: "UDL Practices", description: "Universal Design for Learning implementation", required: false, aiAssistEnabled: true },
      { id: "incl_assistive", label: "Assistive Technology", description: "Assistive technology provision", required: false, aiAssistEnabled: true },
      { id: "incl_individual", label: "Individualized Plans", description: "Individualized education plans", required: false, aiAssistEnabled: true },
    ],
    policy_governance: [
      { id: "policy_fidelity", label: "Adoption Fidelity", description: "Policy adoption fidelity tracking", required: false, aiAssistEnabled: true },
      { id: "policy_budget", label: "Budget Execution", description: "Budget execution monitoring", required: false, aiAssistEnabled: true },
      { id: "policy_coverage", label: "Coverage Scale", description: "Coverage scale documentation", required: false, aiAssistEnabled: true },
    ],
    csr_philanthropy: [
      { id: "csr_governance", label: "Independent Governance", description: "Independent governance structures", required: false, aiAssistEnabled: true },
      { id: "csr_codesign", label: "Community Co-Design", description: "Community co-design processes", required: false, aiAssistEnabled: true },
      { id: "csr_transparency", label: "Transparency", description: "Financial and impact transparency", required: false, aiAssistEnabled: true },
    ],
    media_storytelling: [
      { id: "media_accuracy", label: "Accuracy & Ethics", description: "Journalistic accuracy and ethics", required: false, aiAssistEnabled: true },
      { id: "media_reach", label: "Reach/Engagement", description: "Audience reach and engagement metrics", required: false, aiAssistEnabled: true },
      { id: "media_behavior", label: "Behavior/Attitude Shifts", description: "Evidence of behavior/attitude changes", required: false, aiAssistEnabled: true },
    ],
    stem_climate: [
      { id: "stem_labs", label: "Labs/Experiments", description: "Laboratory and experimental work", required: false, aiAssistEnabled: true },
      { id: "stem_green", label: "Green Skills", description: "Green and sustainability skills", required: false, aiAssistEnabled: true },
      { id: "stem_local", label: "Local Relevance", description: "Local context relevance", required: false, aiAssistEnabled: true },
    ],
  },
};

// Platinum Certificate (Non-Competitive; 53 threshold subcategories)
export const PLATINUM_CONFIG: SuperCategoryConfig = {
  id: "platinum",
  name: "Platinum Certificate",
  purpose: "Certify service quality and compliance against verified thresholds; includes Community-Endorsed pathway via re-nomination",
  competitive: false,
  subcategoryCount: 53,
  routing: "Immediate certification (standard Platinum) or milestone tracking to Community-Endorsed Platinum",
  eligibility: [
    // Governance & Financials
    { id: "plat_board", label: "Board/Oversight", description: "Board/oversight in place; policies published", required: true, aiAssistEnabled: true },
    { id: "plat_financials", label: "Financial Statements", description: "Basic financial statements (externally reviewed or audited if ≥$100k annual)", required: true, aiAssistEnabled: true },
    { id: "plat_anticorruption", label: "Anti-Corruption Policy", description: "Anti-corruption & procurement policy", required: true, aiAssistEnabled: true },
    
    // Safeguarding & Protection
    { id: "plat_child_protection", label: "Child Protection", description: "Written child protection & staff vetting", required: true, aiAssistEnabled: true },
    { id: "plat_incident_response", label: "Incident Response", description: "Incident reporting & survivor-centred response", required: true, aiAssistEnabled: true },
    
    // Service Quality
    { id: "plat_curriculum", label: "Curriculum Standards", description: "Curriculum/pedagogy standards matched to national/recognized frameworks", required: true, aiAssistEnabled: true },
    { id: "plat_staff_cpd", label: "Staff Qualifications & CPD", description: "Staff qualifications & CPD plan", required: true, aiAssistEnabled: true },
    { id: "plat_learning_time", label: "Learning Time & Class Size", description: "Learning time & class size within policy (justify if alternative)", required: true, aiAssistEnabled: true },
    { id: "plat_attendance", label: "Attendance/Retention", description: "Reasonable attendance/retention benchmarks or trend improvement", required: true, aiAssistEnabled: true },
    
    // Equity & Access
    { id: "plat_fee_waivers", label: "Fee Waivers/Scholarships", description: "Fee waivers/scholarships for low-income or marginalized learners", required: true, aiAssistEnabled: true },
    { id: "plat_accessibility_plan", label: "Accessibility Plan", description: "Accessibility plan (disability, language, distance, safety)", required: true, aiAssistEnabled: true },
    
    // Data & Results
    { id: "plat_baseline_followup", label: "Baseline & Follow-up Metrics", description: "Baseline & follow-up metrics (attendance, learning, completion, placement)", required: true, aiAssistEnabled: true },
    { id: "plat_data_quality", label: "Data Quality Controls", description: "Data quality controls; consent & privacy", required: true, aiAssistEnabled: true },
    
    // Community & Sustainability
    { id: "plat_community_engagement", label: "Community/PTA Engagement", description: "Community/PTA engagement; feedback loops", required: true, aiAssistEnabled: true },
    { id: "plat_maintenance", label: "Maintenance & O&M Plan", description: "Maintenance & O&M plan for facilities/equipment", required: true, aiAssistEnabled: true },
    { id: "plat_environmental", label: "Environmental & Climate Safety", description: "Environmental & climate safety considerations", required: true, aiAssistEnabled: true },
  ],
};

// Community-Endorsed Platinum Milestone
export const PLATINUM_COMMUNITY_ENDORSED_CONFIG = {
  requiredRenominations: 50,
  renominationWindowMonths: 24,
  requirements: [
    "Passed all Universal & Platinum thresholds",
    "50 validated re-nominations within 24 months (unique verified sources; KYC/OTP; deduped)",
    "Quick threshold re-check before download is enabled",
  ],
  output: "Platinum Certificate — Verified & Downloadable (with timestamp)",
};

export const ALL_SUPER_CATEGORIES: SuperCategoryConfig[] = [
  BLUE_GARNET_ICON_CONFIG,
  BLUE_GARNET_GOLD_CONFIG,
  PLATINUM_CONFIG,
];
