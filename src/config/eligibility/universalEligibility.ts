/**
 * NESA-Africa 2025 — Universal Eligibility Criteria
 * Gate = 100% PASS required (fail any = ineligible; incomplete = cure window 48–72h)
 */

export interface EligibilityGate {
  id: string;
  category: "identity_legal" | "time_geography" | "safeguarding_ethics" | "data_privacy" | "equity_inclusion" | "evidence_pack" | "conflict_of_interest";
  label: string;
  description: string;
  required: boolean;
  cureWindowHours?: number;
  aiAssistEnabled: boolean;
}

export const UNIVERSAL_ELIGIBILITY_GATES: EligibilityGate[] = [
  // Identity & Legal
  {
    id: "identity_registered",
    category: "identity_legal",
    label: "Registered Entity/Identifiable Individual",
    description: "Registered entity or identifiable individual (IDs/incorporation docs)",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: true,
  },
  {
    id: "identity_legal_operating",
    category: "identity_legal",
    label: "Legal Operations",
    description: "Operating legally in country(ies) of impact; no unresolved sanctions/legal disputes",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: true,
  },
  {
    id: "identity_banking",
    category: "identity_legal",
    label: "Banking/Receiving Capacity",
    description: "Banking/receiving capacity for grants or awards (where applicable)",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: false,
  },

  // Time & Geography
  {
    id: "time_results_window",
    category: "time_geography",
    label: "Results Window",
    description: "Evidence of results within Jan 1, 2023 – Sept 30, 2025 (Icons may include earlier)",
    required: true,
    cureWindowHours: 48,
    aiAssistEnabled: true,
  },
  {
    id: "geography_africa_diaspora",
    category: "time_geography",
    label: "Geographic Impact",
    description: "Impact in Africa or the African diaspora (list countries/regions)",
    required: true,
    cureWindowHours: 48,
    aiAssistEnabled: true,
  },

  // Safeguarding & Ethics
  {
    id: "safeguarding_policy",
    category: "safeguarding_ethics",
    label: "Safeguarding Policy",
    description: "Child & vulnerable-person safeguarding policy in force",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: true,
  },
  {
    id: "safeguarding_no_findings",
    category: "safeguarding_ethics",
    label: "No Abuse/Fraud Findings",
    description: "No substantiated abuse, fraud or corruption findings in last 36 months",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: true,
  },
  {
    id: "safeguarding_coc_grievance",
    category: "safeguarding_ethics",
    label: "Code of Conduct & Grievance Mechanism",
    description: "Code of Conduct & Whistleblowing/Grievance mechanism visible to beneficiaries",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: true,
  },

  // Data & Privacy
  {
    id: "data_consent",
    category: "data_privacy",
    label: "Data Consent & Privacy",
    description: "Consent for data use; privacy policy (NDPR/GDPR aligned)",
    required: true,
    cureWindowHours: 48,
    aiAssistEnabled: true,
  },
  {
    id: "data_security",
    category: "data_privacy",
    label: "Data Security",
    description: "Data minimization and secure storage procedures",
    required: true,
    cureWindowHours: 48,
    aiAssistEnabled: true,
  },

  // Equity & Inclusion
  {
    id: "equity_inclusion_demo",
    category: "equity_inclusion",
    label: "Demonstrates Inclusion",
    description: "Demonstrates inclusion (gender, disability, rural/urban, low-income)",
    required: true,
    cureWindowHours: 48,
    aiAssistEnabled: true,
  },
  {
    id: "equity_accessibility",
    category: "equity_inclusion",
    label: "Accessibility",
    description: "Reasonable accommodations or alternative access (language, accessibility)",
    required: true,
    cureWindowHours: 48,
    aiAssistEnabled: true,
  },

  // Evidence Pack
  {
    id: "evidence_results_summary",
    category: "evidence_pack",
    label: "Results Summary",
    description: "Results summary (PDF) + KPI table",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: true,
  },
  {
    id: "evidence_tier_requirement",
    category: "evidence_pack",
    label: "Evidence Tier Requirement",
    description: "At least 1 Tier-A or 2 Tier-B evidence items",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: true,
  },
  {
    id: "evidence_references",
    category: "evidence_pack",
    label: "References",
    description: "3–5 beneficiary or partner references (with contacts)",
    required: true,
    cureWindowHours: 72,
    aiAssistEnabled: false,
  },
  {
    id: "evidence_media_optional",
    category: "evidence_pack",
    label: "Media/Press (Optional)",
    description: "Media/press links, photos/videos with consent",
    required: false,
    aiAssistEnabled: true,
  },

  // Conflict of Interest
  {
    id: "coi_declaration",
    category: "conflict_of_interest",
    label: "COI Declaration",
    description: "COI declaration completed by nominator and nominee",
    required: true,
    cureWindowHours: 48,
    aiAssistEnabled: false,
  },
  {
    id: "coi_judge_disclosure",
    category: "conflict_of_interest",
    label: "Judge Link Disclosure",
    description: "Any direct link to judges disclosed; recusal possible",
    required: true,
    cureWindowHours: 48,
    aiAssistEnabled: false,
  },
];

export const ELIGIBILITY_CATEGORY_LABELS: Record<EligibilityGate["category"], string> = {
  identity_legal: "Identity & Legal",
  time_geography: "Time & Geography",
  safeguarding_ethics: "Safeguarding & Ethics",
  data_privacy: "Data & Privacy",
  equity_inclusion: "Equity & Inclusion",
  evidence_pack: "Evidence Pack",
  conflict_of_interest: "Conflict of Interest",
};

export const CURE_WINDOW_CONFIG = {
  defaultHours: 72,
  minHours: 48,
  maxHours: 72,
  reminderAtHours: [24, 12, 6],
};
