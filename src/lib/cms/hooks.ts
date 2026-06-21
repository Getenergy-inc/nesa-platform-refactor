// React Query hooks over the CMS adapter layer.
// Pages import from here; they never call Supabase or any CMS directly.

import { useQuery } from "@tanstack/react-query";
import {
  fetchPathwayCards,
  fetchCategories,
  fetchFeaturedNominees,
} from "./index";

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

export function useFeaturedNominees(limit = 8) {
  return useQuery({
    queryKey: ["cms", "featured_nominees", limit],
    queryFn: () => fetchFeaturedNominees(limit),
    staleTime: 60 * 1000,
  });
}
