/**
 * useCategoryHeroStats — live subcategory + nominee counts for a real
 * `categories.slug`, using the same public read path as
 * CategoryNomineeDashboard (`public_nominees` scoped to the category's
 * subcategories). No new policies, no cached numbers.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CategoryHeroStats {
  subcategoryCount: number;
  nomineeCount: number;
  categoryName: string | null;
}

export function useCategoryHeroStats(categorySlug: string | undefined) {
  return useQuery<CategoryHeroStats>({
    queryKey: ["category-hero-stats", categorySlug],
    enabled: Boolean(categorySlug),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data: category, error } = await supabase
        .from("categories")
        .select("id, name, subcategories ( id )")
        .eq("slug", categorySlug as string)
        .maybeSingle();
      if (error) throw error;
      if (!category) return { subcategoryCount: 0, nomineeCount: 0, categoryName: null };

      const subIds = ((category.subcategories ?? []) as { id: string }[]).map((s) => s.id);
      let nomineeCount = 0;
      if (subIds.length) {
        const { count, error: cErr } = await supabase
          .from("public_nominees")
          .select("id", { count: "exact", head: true })
          .in("subcategory_id", subIds);
        if (cErr) throw cErr;
        nomineeCount = count ?? 0;
      }

      return {
        subcategoryCount: subIds.length,
        nomineeCount,
        categoryName: (category.name as string) ?? null,
      };
    },
  });
}
