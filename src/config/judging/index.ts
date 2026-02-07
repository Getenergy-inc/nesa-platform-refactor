/**
 * NESA-Africa 2025 — Judging Configuration
 * Central export for all judging-related configs
 */

// Judging Criteria
export {
  type JudgingCriterion,
  type JudgingCategory,
  type JudgeScore,
  type CategoryScorecard,
  MEDIA_ADVOCACY_CRITERIA,
  CSR_AFRICA_CRITERIA,
  NGO_AFRICA_CRITERIA,
  CREATIVE_ARTS_NIGERIA_CRITERIA,
  EDUTECH_AFRICA_CRITERIA,
  NGO_NIGERIA_CRITERIA,
  CSR_NIGERIA_CRITERIA,
  ALL_JUDGING_CATEGORIES,
  SCORE_RANGE,
  calculateScores,
  calculateWeightedScore,
  getJudgingCategoryById,
  getJudgingCategoriesByScope,
  validateScorecard,
} from "./judgingCriteria";

// Quick reference constants
export const JUDGING_CONSTANTS = {
  criteriaPerCategory: 20,
  maxScore: 10,
  minScore: 1,
  totalCategories: 7,
  africaCategories: 4,
  nigeriaCategories: 3,
  maxTotalScore: 200, // 20 criteria × 10 points
} as const;
