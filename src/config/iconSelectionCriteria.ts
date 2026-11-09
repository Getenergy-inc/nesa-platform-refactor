import { ICON_SCORING_CRITERIA } from "@/config/iconAward/scoring";

type IconCriterionSlug = (typeof ICON_SCORING_CRITERIA)[number]["slug"];

const PUBLIC_DESCRIPTIONS: Record<IconCriterionSlug, string> = {
  "lifetime-impact": "The depth and significance of verified educational contribution over time.",
  "scale-reach": "The learners, educators, institutions and communities reached or influenced.",
  "sustainability-legacy": "Benefits that endure beyond the original activity, intervention or funding period.",
  innovation: "New knowledge, methods, curricula or approaches that strengthen education.",
  "inclusion-equity": "Meaningful inclusion of underserved learners and communities, with attention to equity.",
  "leadership-integrity": "Ethical leadership, responsible stewardship and a credible record of service.",
  "evidence-quality": "Independent, credible documentation supporting the nominee's claims and outcomes.",
  "continental-relevance": "The contribution's relevance to African education priorities and wider educational progress.",
};

/** Public presentation of the existing Icon jury rubric; weights remain scoring-owned. */
export const ICON_SELECTION_CRITERIA = ICON_SCORING_CRITERIA.map((criterion) => ({
  ...criterion,
  description: PUBLIC_DESCRIPTIONS[criterion.slug],
}));
