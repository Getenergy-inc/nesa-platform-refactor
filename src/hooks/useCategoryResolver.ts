// useCategoryResolver — DB-backed lookup that resolves a legacy category slug
// to the canonical `/awards/explore/:tier/:category` spine path.
// Used by Stage 7 legacy category redirects so we can collapse per-category
// page files without hard-coding a mapping.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ResolvedCategory {
  tierSlug: string;
  categorySlug: string;
  path: string;
}

export function useCategoryResolver(categorySlug: string | undefined) {
  const [state, setState] = useState<{
    loading: boolean;
    resolved: ResolvedCategory | null;
    error: string | null;
  }>({ loading: true, resolved: null, error: null });

  useEffect(() => {
    if (!categorySlug) {
      setState({ loading: false, resolved: null, error: "Missing category slug" });
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("recognition_categories")
        .select("slug, recognition_tiers!inner(slug)")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setState({ loading: false, resolved: null, error: error.message });
        return;
      }
      if (!data) {
        setState({ loading: false, resolved: null, error: "Category not found" });
        return;
      }
      const tierSlug =
        (data as { recognition_tiers?: { slug?: string } }).recognition_tiers?.slug ?? "";
      setState({
        loading: false,
        resolved: {
          tierSlug,
          categorySlug: data.slug,
          path: `/awards/explore/${tierSlug}/${data.slug}`,
        },
        error: null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return state;
}
