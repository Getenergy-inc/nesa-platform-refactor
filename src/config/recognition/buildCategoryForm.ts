// Synthesizes an AwardCategoryForm for one of the 18 Gold–Blue Garnet
// categories using the canonical subcategory registry. Used to power the
// inline native nomination form embedded on each category / subcategory page.

import type { AwardCategoryForm } from "@/config/nomination/types";
import { getTierBySlug } from "@/config/recognitionArchitecture2026";
import { listSubcategoriesForCategory } from "@/config/recognition/categoryAlias";

export function buildCategoryForm(categorySlug: string): AwardCategoryForm | null {
  const tier = getTierBySlug("gold-blue-garnet");
  const category = tier?.categories.find((c) => c.slug === categorySlug);
  if (!category) return null;

  const subs = listSubcategoriesForCategory(categorySlug);

  return {
    slug: category.slug,
    name: category.name,
    family: "gold-blue-garnet",
    group: "Gold–Blue Garnet",
    gmail: "",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "",
    status: "Active",
    lastUpdated: new Date().toISOString().slice(0, 10),
    shortDescription: category.tagline,
    subcategories: subs.map((s) => ({
      slug: s.slug,
      name: s.shortLabel ?? s.title,
      description: s.description,
    })),
    awardFamilyName: "Gold-Blue Garnet — Competitive Excellence",
  };
}
