// Public Arena counters — REAL counts only.
//
// Every number rendered on the public /judges and /nrc landing pages comes
// from these queries. When a corps has not been appointed/onboarded yet the
// count is genuinely 0 and the UI renders "—" rather than a mockup number.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ArenaPublicStats {
  publicJudges: number;
  publicNrcMembers: number;
  nominees: number;
}

async function countOf(table: "judges_public" | "nrc_public_members" | "nominees") {
  const { count, error } = await supabase
    .from(table as never)
    .select("id", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export function useArenaPublicStats() {
  return useQuery({
    queryKey: ["arena-public-stats"],
    queryFn: async (): Promise<ArenaPublicStats> => {
      const [publicJudges, publicNrcMembers, nominees] = await Promise.all([
        countOf("judges_public"),
        countOf("nrc_public_members"),
        countOf("nominees"),
      ]);
      return { publicJudges, publicNrcMembers, nominees };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Renders 0 as an em dash so empty datasets never read like a real figure. */
export function arenaCount(value: number | undefined, loading?: boolean) {
  if (loading || value === undefined) return "…";
  return value > 0 ? value.toLocaleString() : "—";
}
