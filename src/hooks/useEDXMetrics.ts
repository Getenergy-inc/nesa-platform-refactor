/**
 * EDX (Education Development Index) Analytics Hooks
 * 
 * Tracks and provides metrics for:
 * - Nomination activity by region and category
 * - Voting participation
 * - Legacy engagement (Rebuild My School Africa)
 * - AGC allocation and conversion rates
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ============================================================================
// TYPES
// ============================================================================

export interface EDXCategoryEngagement {
  categoryId: string;
  categoryName: string;
  nominationCount: number;
  voteCount: number;
  participationScore: number; // Normalized 0-100
}

export interface EDXRegionMetrics {
  regionName: string;
  regionSlug: string;
  nomineeCount: number;
  nominationCount: number;
  voteCount: number;
  rebuildNominationCount: number;
}

export interface EDXOverview {
  totalNominations: number;
  totalVotes: number;
  totalNominees: number;
  totalRegionsActive: number;
  totalCategoriesEngaged: number;
  agcInCirculation: number;
  rebuildSchoolNominations: number;
  volunteerBodApplications: number;
}

// ============================================================================
// OVERVIEW HOOK
// ============================================================================

export function useEDXOverview() {
  return useQuery({
    queryKey: ["edx-overview"],
    queryFn: async (): Promise<EDXOverview> => {
      const [
        { count: nominationsCount },
        { count: votesCount },
        { count: nomineesCount },
        { data: regions },
        { data: categories },
      ] = await Promise.all([
        supabase.from("nominations").select("*", { count: "exact", head: true }),
        supabase.from("votes").select("*", { count: "exact", head: true }),
        supabase.from("nominees").select("*", { count: "exact", head: true }),
        supabase.from("regions").select("slug").eq("is_active", true),
        supabase.from("categories").select("id").eq("is_active", true),
      ]);

      // Rebuild nominations count
      let rebuildCount = 0;
      try {
        const { count } = await supabase
          .from("rebuild_nominations")
          .select("*", { count: "exact", head: true });
        rebuildCount = count ?? 0;
      } catch {
        // Table may not exist yet
      }

      return {
        totalNominations: nominationsCount ?? 0,
        totalVotes: votesCount ?? 0,
        totalNominees: nomineesCount ?? 0,
        totalRegionsActive: regions?.length ?? 0,
        totalCategoriesEngaged: categories?.length ?? 0,
        agcInCirculation: 0, // Calculated server-side
        rebuildSchoolNominations: rebuildCount,
        volunteerBodApplications: 0, // TODO: wire to volunteer table
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ============================================================================
// ENGAGEMENT BY CATEGORY
// ============================================================================

export function useEDXCategoryEngagement() {
  return useQuery({
    queryKey: ["edx-category-engagement"],
    queryFn: async (): Promise<EDXCategoryEngagement[]> => {
      // Get categories
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("display_order");

      if (!categories?.length) return [];

      // Get nominations per category (via subcategory)
      const { data: nominations } = await supabase
        .from("nominations")
        .select("subcategory_id, subcategories!inner(category_id)");

      // Get votes per nominee category
      const { data: votes } = await supabase
        .from("votes")
        .select("nominee_id, nominees!inner(subcategory_id, subcategories!inner(category_id))");

      // Aggregate
      const catMap = new Map<string, { nominations: number; votes: number }>();
      categories.forEach((c) => catMap.set(c.id, { nominations: 0, votes: 0 }));

      nominations?.forEach((n: any) => {
        const catId = n.subcategories?.category_id;
        if (catId && catMap.has(catId)) {
          catMap.get(catId)!.nominations++;
        }
      });

      votes?.forEach((v: any) => {
        const catId = v.nominees?.subcategories?.category_id;
        if (catId && catMap.has(catId)) {
          catMap.get(catId)!.votes++;
        }
      });

      const maxEngagement = Math.max(
        ...Array.from(catMap.values()).map((v) => v.nominations + v.votes),
        1
      );

      return categories.map((c) => {
        const data = catMap.get(c.id) ?? { nominations: 0, votes: 0 };
        return {
          categoryId: c.id,
          categoryName: c.name,
          nominationCount: data.nominations,
          voteCount: data.votes,
          participationScore: Math.round(
            ((data.nominations + data.votes) / maxEngagement) * 100
          ),
        };
      });
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ============================================================================
// ENGAGEMENT BY REGION
// ============================================================================

export function useEDXRegionMetrics() {
  return useQuery({
    queryKey: ["edx-region-metrics"],
    queryFn: async (): Promise<EDXRegionMetrics[]> => {
      const { data: regions } = await supabase
        .from("regions")
        .select("name, slug")
        .eq("is_active", true)
        .order("display_order");

      if (!regions?.length) return [];

      const { data: nominees } = await supabase
        .from("nominees")
        .select("region");

      const { data: votes } = await supabase
        .from("votes")
        .select("nominee_id, nominees!inner(region)");

      // Count nominees per region
      const nomineeMap = new Map<string, number>();
      nominees?.forEach((n) => {
        const r = n.region || "Unknown";
        nomineeMap.set(r, (nomineeMap.get(r) ?? 0) + 1);
      });

      // Count votes per nominee region
      const voteMap = new Map<string, number>();
      votes?.forEach((v: any) => {
        const r = v.nominees?.region || "Unknown";
        voteMap.set(r, (voteMap.get(r) ?? 0) + 1);
      });

      return regions.map((r) => ({
        regionName: r.name,
        regionSlug: r.slug,
        nomineeCount: nomineeMap.get(r.name) ?? 0,
        nominationCount: 0, // Would need region on nominations
        voteCount: voteMap.get(r.name) ?? 0,
        rebuildNominationCount: 0,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ============================================================================
// EDX EVENT LOGGER (Client-side tracking)
// ============================================================================

export type EDXEventType =
  | "page_view"
  | "nomination_started"
  | "nomination_submitted"
  | "vote_cast"
  | "agc_earned"
  | "rebuild_nomination"
  | "volunteer_application"
  | "cta_click";

export interface EDXEvent {
  type: EDXEventType;
  category?: string;
  region?: string;
  metadata?: Record<string, string | number>;
}

/**
 * Log an EDX analytics event.
 * Events are stored in audit_events for governance-grade traceability.
 */
export async function logEDXEvent(event: EDXEvent, userId?: string) {
  try {
    await supabase.from("audit_events").insert({
      action: `edx_${event.type}`,
      entity_type: "edx",
      actor_id: userId ?? null,
      metadata: {
        category: event.category ?? null,
        region: event.region ?? null,
        ...event.metadata,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Silently fail — analytics should never block UX
    console.warn("EDX event log failed:", error);
  }
}
