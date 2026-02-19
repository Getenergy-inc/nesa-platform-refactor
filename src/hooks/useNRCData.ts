import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { NRCMember, NRCQueueItem, NRCStats } from "@/types/nrc";
import { NominationQueueResponse, nrcApi } from "@/api/newnrc";
import { check } from "zod";

// Fetch NRC members with profile data
export function useNRCMembers() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["nrc-members"],
    queryFn: async (): Promise<NRCMember[]> => {
      // const profilesMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
      const res = await nrcApi.fetchNonTeamVolunteers(accessToken);
      const members = res.flatMap((vol) => {
        const status = vol.status.toLowerCase() as
          | "pending"
          | "active"
          | "suspended"
          | "removed";
        const volunteers: NRCMember = {
          id: vol.id,
          user_id: vol.user.id,
          invited_by: null,
          assigned_region: null,
          joined_at: vol.approvedAt,
          max_queue_size: null,
          status,
          profile: {
            full_name: `${vol.user.firstName} ${vol.user.lastName}`,
            email: vol.user.email,
            avatar_url: vol.user.profilePic,
          },
        };
        return volunteers;
      });

      // return members.map((member) => ({
      //   ...member,
      //   status: member.status as NRCMember["status"],
      //   profile: profilesMap.get(member.user_id) || undefined,
      // }));
      return members;
    },
  });
}

// Fetch current user's queue
export function useMyQueue() {
  const { user, accessToken } = useAuth();
  return useQuery({
    queryKey: ["nrc-my-queue", user?.id],
    queryFn: async (): Promise<NRCQueueItem[]> => {
      if (!user) return [];
      try {
        const res = await nrcApi.fetchQueue(accessToken);
        const data: NRCQueueItem[] = res.map((q) => {
          const queue = q.nomination.nominationQueues[0];

          const queueStatus = queue.status.toLocaleLowerCase() as
            | "assigned"
            | "in_review"
            | "completed"
            | "reassigned";
          console.log("the queue status", q);
          const queueItem: NRCQueueItem = {
            id: queue.id,
            assigned_by: null,
            assigned_to: user.fullName,
            nomination_id: q.nomination.id,
            status: queueStatus,
            priority: queue.priority,
            due_date: queue.dueDate,
            completed_at: null,
            started_at: queue.createdAt,
            notes: queue.notes,
            created_at: queue.createdAt,
            updated_at: queue.updatedAt,
            nomination: {
              id: q.nomination.id,
              nominee_title: null,
              nominee_bio: null,
              nominee_organization: null,
              nominee_name: q.nomination.fullName,
              nominee_photo_url: q.nomination.profileImage,
              created_at: q.nomination.createdAt,
              evidence_urls: q.nomination.evidenceUrl,
              subcategory: {
                id: q.nomination.subCategory.id,
                name: q.nomination.subCategory.title,
                category: {
                  id: q.nomination.category.id,
                  name: q.nomination.category.title,
                  slug: q.nomination.category.description,
                },
              },
            },
          };
          console.log("queue item", queueItem);
          return queueItem;
        });
        console.log("check", data);

        const check = data.map((item: NRCQueueItem) => {
          return {
            ...item,
            status: item.status as NRCQueueItem["status"],
            nomination: item.nomination
              ? {
                  ...item.nomination,
                  subcategory: item.nomination.subcategory
                    ? {
                        ...item.nomination.subcategory,
                        category: item.nomination.subcategory.category,
                      }
                    : undefined,
                }
              : undefined,
          };
        });
        return check;
      } catch (err) {
        console.log("the err is this", err);
      }
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
