import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RegionNomineeCount {
  region_name: string;
  region_slug: string;
  nominee_count: number;
}

export function useRegionNomineeCounts() {
  return useQuery({
    queryKey: ["region-nominee-counts"],
    queryFn: async () => {
      // Get counts per region
      const { data: regions } = await supabase
        .from("regions")
        .select("name, slug")
        .eq("is_active", true)
        .order("display_order");

      const { data: nominees } = await supabase
        .from("nominees")
        .select("region");

      const countMap: Record<string, number> = {};
      let totalCount = 0;

      (nominees || []).forEach((n) => {
        const r = n.region || "Unknown";
        countMap[r] = (countMap[r] || 0) + 1;
        totalCount++;
      });

      const regionCounts: RegionNomineeCount[] = (regions || []).map((r) => ({
        region_name: r.name,
        region_slug: r.slug,
        nominee_count: countMap[r.name] || 0,
      }));

      return { regionCounts, totalCount };
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchInterval: 1000 * 60 * 2, // auto-refresh every 2 min
  });
}
