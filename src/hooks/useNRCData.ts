import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, avatar_url")
        .in("user_id", userIds);

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
      const { count: totalMembers } = await supabase
        .from("nrc_members")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "active"]);

      const { count: activeMembers } = await supabase
        .from("nrc_members")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      const { count: pendingInvitations } = await supabase
        .from("nrc_invitations")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: totalQueueItems } = await supabase
        .from("nrc_queue")
        .select("*", { count: "exact", head: true })
        .in("status", ["assigned", "in_review"]);

      const { count: completedReviews } = await supabase
        .from("nrc_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      return {
        total_members: totalMembers || 0,
        active_members: activeMembers || 0,
        pending_invitations: pendingInvitations || 0,
        total_queue_items: totalQueueItems || 0,
        completed_reviews: completedReviews || 0,
        avg_review_time_days: 3.5,
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
