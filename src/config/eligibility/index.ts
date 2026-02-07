/**
 * NESA-Africa 2025 — Eligibility & Screening Configuration
 * Central export for all eligibility-related configs
 * 
 * Aligned with:
 * - UN SDG 4 (Quality Education)
 * - AU Agenda 2063 (Education & Skills Revolution)
 * - SCEF / NESA-Africa / EduAid-Africa goals
 */

// Universal Eligibility
export {
  type EligibilityGate,
  UNIVERSAL_ELIGIBILITY_GATES,
  ELIGIBILITY_CATEGORY_LABELS,
  CURE_WINDOW_CONFIG,
} from "./universalEligibility";

// Evidence Tiers
export {
  type EvidenceTier,
  type EvidenceType,
  EVIDENCE_TYPES,
  TIER_CONFIG,
  validateEvidenceRequirement,
  calculateEvidenceScore,
} from "./evidenceTiers";

// Super Categories
export {
  type SuperCategory,
  type CategoryCheck,
  type SuperCategoryConfig,
  BLUE_GARNET_ICON_CONFIG,
  BLUE_GARNET_GOLD_CONFIG,
  PLATINUM_CONFIG,
  PLATINUM_COMMUNITY_ENDORSED_CONFIG,
  ALL_SUPER_CATEGORIES,
} from "./superCategories";

// SDG & AU Alignment
export {
  type SDGTarget,
  type AU2063Goal,
  SDG4_TARGETS,
  AU_2063_GOALS,
  STRATEGIC_OBJECTIVES,
  GOLD_SDG_ALIGNMENT_CHECKS,
  MINIMUM_SDG_ALIGNMENT,
  validateSDGAlignment,
} from "./sdgAlignment";

// Red Flags
export {
  type RedFlagSeverity,
  type RedFlagCategory,
  type RedFlag,
  RED_FLAGS,
  RED_FLAG_CATEGORY_LABELS,
  RED_FLAG_SEVERITY_CONFIG,
  TRIGGER_ACTION_LABELS,
  hasCriticalRedFlags,
  getRecommendedAction,
} from "./redFlags";

// Screening Form
export {
  type ScreeningVerdict,
  type RoutingDecision,
  type ScreeningSection,
  type ScreeningItem,
  type ScreeningFormState,
  UNIVERSAL_SECTION,
  SUPER_CATEGORY_OPTIONS,
  SDG_ALIGNMENT_OPTIONS,
  ROUTING_OPTIONS,
  VERDICT_OPTIONS,
  REQUIRED_DOCUMENTS,
  createEmptyScreeningForm,
  validateUniversalSection,
  calculateVerdict,
} from "./screeningForm";

// Quick reference constants
export const ELIGIBILITY_CONSTANTS = {
  resultsWindowStart: "2023-01-01",
  resultsWindowEnd: "2025-09-30",
  cureWindowMinHours: 48,
  cureWindowMaxHours: 72,
  safeguardingLookbackMonths: 36,
  platinumRenominationThreshold: 50,
  platinumRenominationWindowMonths: 24,
  minimumSDGAlignment: 2,
  iconMinYearsContribution: 10,
  goldSubcategoryCount: 101,
  platinumSubcategoryCount: 53,
  iconSubcategoryCount: 9,
} as const;
