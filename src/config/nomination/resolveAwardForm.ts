// resolveAwardForm.ts — best-effort resolution of an AwardCategoryForm for any
// award category or pathway slug/name coming from the recognition2026 taxonomy.
//
// Tries: exact slug → family-scoped token overlap → global token overlap.

import {
  AWARD_CATEGORY_FORMS,
  getCategoryFormBySlug,
} from "@/config/nomination/awardCategoryForms";
import type { AwardCategoryForm } from "@/config/nomination/types";

const STOP_WORDS = new Set([
  "best",
  "award",
  "awards",
  "africa",
  "african",
  "education",
  "for",
  "the",
  "and",
  "nesa",
  "category",
  "impact",
  "2026",
]);

function tokens(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 3 && !STOP_WORDS.has(t));
}

export function resolveAwardForm(
  slug: string,
  name: string,
  family?: string,
): AwardCategoryForm | undefined {
  const direct = getCategoryFormBySlug(slug);
  if (direct) return direct;

  const target = new Set(tokens(`${slug} ${name}`));
  if (target.size === 0) return undefined;

  const pools: AwardCategoryForm[][] = [];
  if (family) pools.push(AWARD_CATEGORY_FORMS.filter((f) => f.family === family));
  pools.push(AWARD_CATEGORY_FORMS);

  for (const pool of pools) {
    let best: { form: AwardCategoryForm; score: number } | undefined;
    for (const form of pool) {
      const hay = `${form.slug} ${form.name}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      let score = 0;
      for (const t of hay) if (target.has(t)) score += 1;
      if (!best || score > best.score) best = { form, score };
    }
    if (best && best.score >= 2) return best.form;
  }
  return undefined;
}
