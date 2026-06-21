// React Query hooks over the CMS adapter layer.
// Pages import from here; they never call Supabase or any CMS directly.

import { useQuery } from "@tanstack/react-query";
import {
  fetchPathwayCards,
  fetchCategories,
  fetchSubcategories,
  fetchFeaturedNominees,
} from "./index";

// Re-export the nominee listing hook through the CMS surface so pages
// import nominee data the same way they import categories. The
// underlying implementation already targets Lovable Cloud and performs
// enrichment (image type, geographic bucket, region normalisation).
export { useNominees as useNomineesList, type EnrichedDatabaseNominee } from "@/hooks/useNominees";

export function usePathwayCards() {
  return useQuery({
    queryKey: ["cms", "pathway_cards"],
    queryFn: fetchPathwayCards,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAwardCategories() {
  return useQuery({
    queryKey: ["cms", "categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubcategories(categorySlug?: string) {
  const slug = categorySlug && categorySlug !== "all" ? categorySlug : undefined;
  return useQuery({
    queryKey: ["cms", "subcategories", slug ?? "__all__"],
    queryFn: () => fetchSubcategories(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedNominees(limit = 8) {
  return useQuery({
    queryKey: ["cms", "featured_nominees", limit],
    queryFn: () => fetchFeaturedNominees(limit),
    staleTime: 60 * 1000,
  });
}
