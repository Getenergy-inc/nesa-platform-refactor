import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/http";
import type { NRCMember, NRCQueueItem, NRCStats } from "@/types/nrc";

// Fetch NRC members with profile data
export function useNRCMembers() {
  return useQuery({
    queryKey: ["nrc-members"],
    queryFn: async (): Promise<NRCMember[]> => {
      // First get NRC members
      const { data: members, error } = await supabase
        .from("nrc_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!members || members.length === 0) return [];

      // Then get profiles for these members
      const userIds = members.map(m => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, avatar_url")
        .in("user_id", userIds);

      if (profilesError) throw profilesError;

      const profilesMap = new Map(
        profiles?.map(p => [p.user_id, p]) || []
      );
      
      return members.map((member) => ({
        ...member,
        status: member.status as NRCMember["status"],
        profile: profilesMap.get(member.user_id) || undefined,
      }));
    },
  });
}

// Fetch current user's queue
export function useMyQueue() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["nrc-my-queue", user?.id],
    queryFn: async (): Promise<NRCQueueItem[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("nrc_queue")
        .select(`
          *,
          nominations (
            id,
            nominee_name,
            nominee_title,
            nominee_organization,
            nominee_bio,
            nominee_photo_url,
            evidence_urls,
            justification,
            status,
            created_at,
            subcategories (
              id,
              name,
              categories (
                id,
                name,
                slug
              )
            )
          )
        `)
        .eq("assigned_to", user.id)
        .in("status", ["assigned", "in_review"])
        .order("priority", { ascending: false })
        .order("due_date", { ascending: true });

      if (error) throw error;

      return (data || []).map((item: any) => ({
        ...item,
        status: item.status as NRCQueueItem["status"],
        nomination: item.nominations
          ? {
              ...item.nominations,
              subcategory: item.nominations.subcategories
                ? {
                    ...item.nominations.subcategories,
                    category: item.nominations.subcategories.categories,
                  }
                : undefined,
            }
          : undefined,
      }));
    },
    enabled: !!user,
  });
}

// Fetch NRC dashboard stats
export function useNRCStats() {
  return useQuery({
    queryKey: ["nrc-stats"],
    queryFn: async (): Promise<NRCStats> => {
      // Get member counts
      const { count: totalMembers, error: totalErr } = await supabase
        .from("nrc_members")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "active"]);
      if (totalErr) throw totalErr;

      const { count: activeMembers, error: activeErr } = await supabase
        .from("nrc_members")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      if (activeErr) throw activeErr;

      const { count: pendingInvitations, error: inviteErr } = await supabase
        .from("nrc_invitations")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      if (inviteErr) throw inviteErr;

      const { count: totalQueueItems, error: queueErr } = await supabase
        .from("nrc_queue")
        .select("*", { count: "exact", head: true })
        .in("status", ["assigned", "in_review"]);
      if (queueErr) throw queueErr;

      const { count: completedReviews, error: doneErr } = await supabase
        .from("nrc_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");
      if (doneErr) throw doneErr;

      // Average turnaround is derived from real completed queue items only.
      // When nothing has been completed yet we report null rather than a
      // placeholder figure.
      const { data: completed, error: turnaroundErr } = await supabase
        .from("nrc_queue")
        .select("started_at, created_at, completed_at")
        .eq("status", "completed")
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(200);
      if (turnaroundErr) throw turnaroundErr;

      let avgReviewTimeDays: number | null = null;
      const durations = (completed || [])
        .map((row) => {
          const start = row.started_at || row.created_at;
          if (!start || !row.completed_at) return null;
          const ms = new Date(row.completed_at).getTime() - new Date(start).getTime();
          return ms > 0 ? ms / (1000 * 60 * 60 * 24) : null;
        })
        .filter((d): d is number => d !== null);

      if (durations.length > 0) {
        avgReviewTimeDays =
          Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10;
      }

      return {
        total_members: totalMembers || 0,
        active_members: activeMembers || 0,
        pending_invitations: pendingInvitations || 0,
        total_queue_items: totalQueueItems || 0,
        completed_reviews: completedReviews || 0,
        avg_review_time_days: avgReviewTimeDays,
      };
    },
  });
}

// Check if current user is NRC member
export function useIsNRCMember() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["is-nrc-member", user?.id],
    queryFn: async (): Promise<NRCMember | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("nrc_members")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        status: data.status as NRCMember["status"],
      };
    },
    enabled: !!user,
  });
}

// ==========================================
// WRITE PATHS (nrc edge function)
// ==========================================

export interface NRCQuorumResult {
  quorum_reached: boolean;
  decision?: "verified" | "rejected";
  reason?: string;
  needs_lead?: boolean;
  approve_count?: number;
  reject_count?: number;
}

/**
 * Workload-balanced auto-assignment. Runs assign_nrc_reviewers() server-side
 * (service role only) via the `nrc` edge function.
 */
export function useAutoAssignReviewers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      nominationId,
      numReviewers = 2,
    }: {
      nominationId: string;
      numReviewers?: number;
    }) => {
      const res = await api.post<{ success: boolean; reviewers: string[]; sla_deadline: string }>(
        "nrc",
        "/assign/auto",
        { nominationId, numReviewers }
      );
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nrc-my-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
    },
  });
}

/** Marks the current reviewer's queue item as in_review. */
export function useStartNRCReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nominationId: string) => {
      const res = await api.post<{ success: boolean; started_at: string }>(
        "nrc",
        `/review/${nominationId}/start`,
        {}
      );
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nrc-my-queue"] });
    },
  });
}

/**
 * Submits one reviewer verdict and returns the 2-of-3 quorum outcome from
 * check_nrc_quorum(). The nomination status is only changed once quorum is met.
 */
export function useSubmitNRCReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      nominationId: string;
      decision: "APPROVE" | "REJECT" | "REQUEST_MORE_EVIDENCE" | "ESCALATE";
      notes?: string;
      identity_match?: boolean;
      category_fit?: boolean;
      evidence_sufficiency?: number;
      timeframe_fit?: boolean;
    }) => {
      const { nominationId, ...rest } = payload;
      const res = await api.post<{ success: boolean; quorum: NRCQuorumResult }>(
        "nrc",
        `/review/${nominationId}`,
        rest
      );
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nrc-my-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
    },
  });
}
