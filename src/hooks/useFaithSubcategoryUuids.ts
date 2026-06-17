import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves the live `public.subcategories.id` for a list of canonical slugs.
 *
 * Used by faith-based category pages (Islamic / Christian) so that a tile
 * with a `null` UUID — e.g. "Christian Advocacy & Awareness" — automatically
 * enables the "Nominate" button the moment the backend row is created with
 * the expected slug. No code change required at that point.
 *
 * Returns a stable `Record<slug, uuid>` containing only slugs that resolved.
 */
export function useFaithSubcategoryUuids(slugs: string[]) {
  // Stable key so the effect only re-runs when the slug set actually changes.
  const key = [...slugs].filter(Boolean).sort().join("|");
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(slugs.length > 0);

  useEffect(() => {
    let cancelled = false;
    const list = key ? key.split("|") : [];
    if (list.length === 0) {
      setMap({});
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("subcategories")
      .select("id, slug")
      .in("slug", list)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setMap({});
        } else {
          const next: Record<string, string> = {};
          for (const row of data) {
            if (row.slug && row.id) next[row.slug] = row.id as string;
          }
          setMap(next);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { uuidBySlug: map, loading };
}
