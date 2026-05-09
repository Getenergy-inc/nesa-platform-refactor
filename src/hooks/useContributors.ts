import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  CONTRIBUTORS,
  type Contributor,
  type ContributorRole,
  type ContributionArea,
  type ContributorSocials,
} from "@/data/contributors";

interface EntryRow {
  id: string;
  name: string;
  role: string;
  title: string | null;
  country: string | null;
  region: string | null;
  year_start: number;
  year_end: number | null;
  image_url: string | null;
  highlight: string | null;
  bio: string | null;
  contribution_description: string | null;
  contributions: string[] | null;
  appreciation: string | null;
  recommendation: string | null;
  socials: Record<string, string> | null;
  is_custom: boolean;
  updated_at: string;
}

function rowToContributor(row: EntryRow, base?: Contributor): Contributor {
  return {
    id: row.id,
    name: row.name,
    role: row.role as ContributorRole,
    title: row.title ?? base?.title,
    country: row.country ?? base?.country,
    region: row.region ?? base?.region,
    yearStart: row.year_start,
    yearEnd: row.year_end ?? base?.yearEnd,
    imageUrl: row.image_url ?? base?.imageUrl,
    highlight: row.highlight ?? base?.highlight,
    bio: row.bio ?? base?.bio,
    contributionDescription: row.contribution_description ?? base?.contributionDescription,
    contributions: (row.contributions as ContributionArea[]) ?? base?.contributions,
    appreciation: row.appreciation ?? base?.appreciation,
    recommendation: row.recommendation ?? base?.recommendation,
    socials: (row.socials as ContributorSocials) ?? base?.socials,
  };
}

export function useContributors() {
  const [rows, setRows] = useState<EntryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contributor_entries")
      .select("*")
      .order("year_start", { ascending: false });
    if (!error && data) setRows(data as EntryRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const merged = useMemo<Contributor[]>(() => {
    const byId = new Map<string, Contributor>();
    for (const c of CONTRIBUTORS) byId.set(c.id, c);
    for (const r of rows) {
      const base = byId.get(r.id);
      byId.set(r.id, rowToContributor(r, base));
    }
    return Array.from(byId.values());
  }, [rows]);

  const overridesById = useMemo(() => {
    const m = new Map<string, EntryRow>();
    for (const r of rows) m.set(r.id, r);
    return m;
  }, [rows]);

  return { contributors: merged, overrides: overridesById, loading, refetch };
}
