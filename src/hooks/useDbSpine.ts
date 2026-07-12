// DB-first hydration for the recognition spine.
// Returns categories/subcategories from Lovable Cloud, falling back gracefully
// while the query resolves. Consumers merge with static config for metadata.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DbCategory = {
  slug: string;
  name: string;
  description: string | null;
  tier_slug: string;
};

export type DbSubcategory = {
  slug: string;
  name: string;
  description: string | null;
  category_slug: string;
};

type SpineState = {
  ready: boolean;
  categoriesByTier: Record<string, DbCategory[]>;
  subcategoriesByCategory: Record<string, DbSubcategory[]>;
};

let cache: SpineState | null = null;
let inflight: Promise<SpineState> | null = null;

async function loadSpine(): Promise<SpineState> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const [{ data: tiers }, { data: cats }, { data: subs }] = await Promise.all([
      supabase.from("recognition_tiers").select("id, slug"),
      supabase
        .from("recognition_categories")
        .select("slug, name, description, tier_id"),
      supabase
        .from("recognition_subcategories")
        .select("slug, name, description, category_id"),
    ]);

    const tierIdToSlug = new Map<string, string>();
    (tiers ?? []).forEach((t: any) => tierIdToSlug.set(t.id, t.slug));

    const categoriesByTier: Record<string, DbCategory[]> = {};
    const catIdToSlug = new Map<string, string>();
    (cats ?? []).forEach((c: any) => {
      const tierSlug = tierIdToSlug.get(c.tier_id) ?? "";
      catIdToSlug.set(c.id, c.slug);
      const row: DbCategory = {
        slug: c.slug,
        name: c.name,
        description: c.description,
        tier_slug: tierSlug,
      };
      (categoriesByTier[tierSlug] ||= []).push(row);
    });

    const subcategoriesByCategory: Record<string, DbSubcategory[]> = {};
    (subs ?? []).forEach((s: any) => {
      const catSlug = catIdToSlug.get(s.category_id) ?? "";
      const row: DbSubcategory = {
        slug: s.slug,
        name: s.name,
        description: s.description,
        category_slug: catSlug,
      };
      (subcategoriesByCategory[catSlug] ||= []).push(row);
    });

    cache = { ready: true, categoriesByTier, subcategoriesByCategory };
    return cache;
  })();

  try {
    return await inflight;
  } catch {
    return { ready: true, categoriesByTier: {}, subcategoriesByCategory: {} };
  } finally {
    inflight = null;
  }
}

export function useDbSpine(): SpineState {
  const [state, setState] = useState<SpineState>(
    cache ?? { ready: false, categoriesByTier: {}, subcategoriesByCategory: {} },
  );

  useEffect(() => {
    let cancelled = false;
    loadSpine().then((s) => {
      if (!cancelled) setState(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
