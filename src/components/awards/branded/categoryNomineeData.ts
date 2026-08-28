/**
 * Shared data layer for the light-theme category nominee surfaces
 * (FeaturedCategorySpotlight + CategoryPictureCatalogue).
 *
 * Reads live rows from the public `public_nominees` view via the real
 * `categories` / `subcategories` taxonomy. No new policies, no writes.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CategorySubcategoryRow {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryNomineeRow {
  id: string;
  name: string;
  slug: string | null;
  organization: string | null;
  country: string | null;
  region: string | null;
  photo_url: string | null;
  logo_url: string | null;
  subcategory_id: string | null;
  nrc_verified: boolean | null;
  profile_completion_score: number | null;
  bio: string | null;
  work_done: string | null;
  category_fit_summary: string | null;
}

export interface CategoryNomineeData {
  category: { id: string; name: string; slug: string };
  subs: CategorySubcategoryRow[];
  nominees: CategoryNomineeRow[];
}

/** Categories whose real data is too thin to justify a Featured Spotlight. */
export const SPOTLIGHT_EXCLUDED_CATEGORY_SLUGS = new Set([
  "best-ngo-education-africa",
  "best-stem-education-africa",
  "christian-education-impact-africa",
  "islamic-education-impact-africa",
]);

export function useCategoryNominees(categorySlug: string, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(categorySlug),
    queryKey: ["category-nominees-light", categorySlug],
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    queryFn: async (): Promise<CategoryNomineeData | null> => {
      const { data: category, error } = await supabase
        .from("categories")
        .select("id, name, slug, subcategories ( id, name, slug )")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (error) throw error;
      if (!category) return null;

      const subs = ((category.subcategories ?? []) as CategorySubcategoryRow[])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

      let nominees: CategoryNomineeRow[] = [];
      if (subs.length) {
        const { data: rows, error: nErr } = await supabase
          .from("public_nominees")
          .select(
            "id, name, slug, organization, country, region, photo_url, logo_url, subcategory_id, nrc_verified, profile_completion_score, bio, work_done, category_fit_summary",
          )
          .in("subcategory_id", subs.map((s) => s.id))
          .order("name", { ascending: true })
          .limit(2000);
        if (nErr) throw nErr;
        nominees = (rows ?? []) as CategoryNomineeRow[];
      }

      return {
        category: {
          id: category.id as string,
          name: category.name as string,
          slug: category.slug as string,
        },
        subs,
        nominees,
      };
    },
  });
}

export const nomineeImage = (n: CategoryNomineeRow) => n.photo_url || n.logo_url || null;

/** Max times an identical image URL may repeat in a category before it is
 *  treated as a shared fallback/dummy asset rather than a real portrait. */
const DUPLICATE_IMAGE_LIMIT = 5;

/**
 * A URL only counts as a real usable image when it is present, is not an
 * obvious placeholder, and is not repeated across the category (the exact
 * pattern behind the STEM duplicate-placeholder problem).
 */
export function buildUsableImageTest(nominees: CategoryNomineeRow[]) {
  const counts = new Map<string, number>();
  for (const n of nominees) {
    const img = nomineeImage(n);
    if (!img) continue;
    counts.set(img, (counts.get(img) ?? 0) + 1);
  }
  return (n: CategoryNomineeRow) => {
    const img = nomineeImage(n);
    if (!img) return false;
    if (img.toLowerCase().includes("placeholder")) return false;
    return (counts.get(img) ?? 0) <= DUPLICATE_IMAGE_LIMIT;
  };
}

const narrativeLength = (n: CategoryNomineeRow) =>
  `${n.bio ?? ""}${n.work_done ?? ""}${n.category_fit_summary ?? ""}`.trim().length;

/** Heuristic Featured set: real image + completion >= 80 + real narrative. */
export function selectFeaturedNominees(
  nominees: CategoryNomineeRow[],
  limit = 3,
): CategoryNomineeRow[] {
  const usable = buildUsableImageTest(nominees);
  return nominees
    .filter(
      (n) =>
        usable(n) && (n.profile_completion_score ?? 0) >= 80 && narrativeLength(n) > 60,
    )
    .sort(
      (a, b) =>
        (b.profile_completion_score ?? 0) - (a.profile_completion_score ?? 0) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}

export function featuredSummary(n: CategoryNomineeRow): string {
  return (
    [n.category_fit_summary, n.work_done, n.bio]
      .map((v) => v?.trim())
      .find((v) => v && v.length > 20) ?? ""
  );
}
