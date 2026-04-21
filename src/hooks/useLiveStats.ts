import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LiveStats {
  nomineeCount: number;
  voteCount: number;
  categoryCount: number;
  subcategoryCount: number;
  regionCount: number;
  judgeCount: number;
}

const QUERY_KEY = ["live-stats"] as const;

async function fetchLiveStats(): Promise<LiveStats> {
  const [nominees, votes, categories, subcategories, regions, judges] = await Promise.all([
    supabase.from("nominees").select("*", { count: "exact", head: true }),
    supabase.from("votes").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("subcategories").select("*", { count: "exact", head: true }),
    supabase.from("regions").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "jury"),
  ]);

  return {
    nomineeCount: nominees.count ?? 0,
    voteCount: votes.count ?? 0,
    categoryCount: categories.count ?? 0,
    subcategoryCount: subcategories.count ?? 0,
    regionCount: regions.count ?? 0,
    judgeCount: judges.count ?? 0,
  };
}

/**
 * Live, realtime-aware stats for the landing page.
 * Subscribes to nominees + votes channels; cache invalidates on any change.
 */
export function useLiveStats() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchLiveStats,
    staleTime: 30_000,
    refetchInterval: 60_000,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    const channel = supabase
      .channel("live-stats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "nominees" },
        () => qc.invalidateQueries({ queryKey: QUERY_KEY })
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        () => qc.invalidateQueries({ queryKey: QUERY_KEY })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return query;
}
