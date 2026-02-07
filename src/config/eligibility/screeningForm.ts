/**
 * NESA-Africa 2025 — Screening Form Template
 * Quick template for reviewer use
 */

export type ScreeningVerdict = "PASS" | "INCOMPLETE" | "FAIL";
export type RoutingDecision = "gold" | "platinum" | "icon" | "renomination";

export interface ScreeningSection {
  id: string;
  title: string;
  description: string;
  items: ScreeningItem[];
}

export interface ScreeningItem {
  id: string;
  label: string;
  required: boolean;
}

export interface ScreeningFormState {
  universalChecks: Record<string, boolean>;
  superCategory: "blue_garnet_icon" | "blue_garnet_gold" | "platinum" | null;
  categoryChecks: Record<string, boolean>;
  sdgTargets: string[];
  routingDecision: RoutingDecision | null;
  renominationReason?: string;
  verdict: ScreeningVerdict;
  reasonCode?: string;
  reviewerInitials?: string;
  reviewedAt?: string;
}

// Section 1 — Universal (100% mandatory)
export const UNIVERSAL_SECTION: ScreeningSection = {
  id: "universal",
  title: "Section 1 — Universal (100% mandatory)",
  description: "All items must pass for eligibility",
  items: [
    { id: "identity_legal", label: "Identity/legal", required: true },
    { id: "safeguarding_policy", label: "Safeguarding policy", required: true },
    { id: "data_privacy", label: "Data/privacy", required: true },
    { id: "equity_inclusion", label: "Equity/inclusion", required: true },
    { id: "evidence_pack", label: "Evidence pack (Tier A/B/C)", required: true },
    { id: "coi_declarations", label: "COI declarations", required: true },
  ],
};

// Section 2 — Super Category Selection
export const SUPER_CATEGORY_OPTIONS = [
  { id: "blue_garnet_icon", label: "Blue Garnet — African Education Icon" },
  { id: "blue_garnet_gold", label: "Blue Garnet — Gold Certificate (Competitive)" },
  { id: "platinum", label: "Platinum Certificate (Threshold)" },
];

// Section 4 — SDG/AU Alignment
export const SDG_ALIGNMENT_OPTIONS = [
  { code: "4.1", label: "4.1 - Foundational Learning" },
  { code: "4.2", label: "4.2 - Early Childhood" },
  { code: "4.3", label: "4.3 - TVET/Tertiary" },
  { code: "4.4", label: "4.4 - Skills for Employment" },
  { code: "4.5", label: "4.5 - Equity/Inclusion" },
  { code: "4.a", label: "4.a - Learning Spaces" },
  { code: "4.c", label: "4.c - Teacher Quality" },
  { code: "AU2063", label: "AU 2063 Education Goals" },
];

// Section 5 — Routing Decision
export const ROUTING_OPTIONS = [
  { id: "gold", label: "Route to Gold (Competitive)" },
  { id: "platinum", label: "Route to Platinum (Threshold)" },
  { id: "icon", label: "Route to Icons (Non-competitive)" },
  { id: "renomination", label: "Re-nomination (if better fit)" },
];

// Section 6 — Verdict
export const VERDICT_OPTIONS: { id: ScreeningVerdict; label: string; description: string; color: string }[] = [
  { id: "PASS", label: "PASS", description: "All mandatory checks met → proceed", color: "green" },
  { id: "INCOMPLETE", label: "INCOMPLETE", description: "Cure window (48–72h)", color: "amber" },
  { id: "FAIL", label: "FAIL", description: "Reason code filed", color: "red" },
];

// Documents to Upload (standard pack)
export const REQUIRED_DOCUMENTS = [
  { id: "registration_id", label: "Registration or ID", required: true },
  { id: "policies", label: "Policies (safeguarding, privacy, code of conduct)", required: true },
  { id: "results_summary", label: "Results summary + KPI table", required: true },
  { id: "me_reports", label: "M&E or evaluation reports", required: true },
  { id: "data_dictionaries", label: "Data dictionaries or indicator definitions", required: false },
  { id: "financials", label: "Financial summary (and audit/review if applicable)", required: true },
  { id: "partnership_letters", label: "Partnership/MoU letters", required: false },
  { id: "references", label: "3–5 references (with contact details)", required: true },
  { id: "media", label: "Consent-cleared media (photos/videos) or press links", required: false },
];

/**
 * Initialize empty screening form state
 */
export function createEmptyScreeningForm(): ScreeningFormState {
  return {
    universalChecks: {},
    superCategory: null,
    categoryChecks: {},
    sdgTargets: [],
    routingDecision: null,
    verdict: "INCOMPLETE",
  };
}

/**
 * Calculate if universal section passes
 */
export function validateUniversalSection(checks: Record<string, boolean>): boolean {
  return UNIVERSAL_SECTION.items
    .filter(item => item.required)
    .every(item => checks[item.id] === true);
}

/**
 * Calculate overall verdict based on form state
 */
export function calculateVerdict(state: ScreeningFormState): ScreeningVerdict {
  const universalPass = validateUniversalSection(state.universalChecks);
  
  if (!universalPass) {
    // Check if any items are explicitly false vs just missing
    const hasExplicitFails = Object.values(state.universalChecks).some(v => v === false);
    return hasExplicitFails ? "FAIL" : "INCOMPLETE";
  }
  
  if (!state.superCategory || !state.routingDecision) {
    return "INCOMPLETE";
  }
  
  return "PASS";
}
