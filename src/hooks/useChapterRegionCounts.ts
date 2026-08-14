import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChapterRegionCounts {
  /** region slug -> number of active chapters */
  bySlug: Record<string, number>;
  /** total active chapters across the 8 Africa regions + diaspora */
  total: number;
  loading: boolean;
  error: string | null;
}

/**
 * Live active-chapter counts grouped by region slug.
 * Never fabricates numbers — regions with no chapter yet return 0.
 */
export function useChapterRegionCounts(): ChapterRegionCounts {
  const [bySlug, setBySlug] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data: regions, error: regionError } = await supabase
          .from("regions")
          .select("id, slug")
          .eq("is_active", true);
        if (regionError) throw regionError;

        const { data: chapters, error: chapterError } = await supabase
          .from("chapters")
          .select("id, region_id, is_active")
          .eq("is_active", true);
        if (chapterError) throw chapterError;

        const slugById = new Map((regions ?? []).map((r) => [r.id, r.slug]));
        const counts: Record<string, number> = {};
        for (const chapter of chapters ?? []) {
          const slug = chapter.region_id ? slugById.get(chapter.region_id) : undefined;
          if (!slug) continue;
          counts[slug] = (counts[slug] ?? 0) + 1;
        }

        if (cancelled) return;
        setBySlug(counts);
        setTotal((chapters ?? []).length);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load chapters");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { bySlug, total, loading, error };
}
