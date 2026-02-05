/**
 * NRC Automation Hooks
 * NESA-Africa 2025 - Enhanced Data Fetching
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import nrcApi from "@/api/nrcAutomation";
import type {
  NRCReviewPayload,
  NRCEvidenceQueryPayload,
  NominationWithWorkflow,
} from "@/types/nrcAutomation";
import { toast } from "sonner";

// =====================================================
// QUEUE HOOKS
// =====================================================

export function useNRCQueue(params?: {
  status?: string;
  workflow_status?: string;
  page?: number;
  limit?: number;
  include_ai?: boolean;
}) {
  return useQuery({
    queryKey: ["nrc-queue", params],
    queryFn: () => nrcApi.getQueue(params),
  });
}

export function useMyNRCQueue(params?: {
  status?: string;
  include_overdue?: boolean;
}) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["nrc-my-queue", user?.id, params],
    queryFn: () => nrcApi.getMyQueue(params),
    enabled: !!user,
  });
}

export function useNominationDossier(nominationId: string | undefined) {
  return useQuery({
    queryKey: ["nrc-dossier", nominationId],
    queryFn: () => nrcApi.getNominationDossier(nominationId!),
    enabled: !!nominationId,
  });
}

// =====================================================
// AI ASSESSMENT HOOKS
// =====================================================

export function useAIAssessment(nominationId: string | undefined) {
  return useQuery({
    queryKey: ["nrc-ai-assessment", nominationId],
    queryFn: () => nrcApi.getAIAssessment(nominationId!),
    enabled: !!nominationId,
  });
}

export function useRequestAIAssessment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (nominationId: string) => nrcApi.requestAIAssessment(nominationId),
    onSuccess: (data, nominationId) => {
      queryClient.invalidateQueries({ queryKey: ["nrc-ai-assessment", nominationId] });
      queryClient.invalidateQueries({ queryKey: ["nrc-dossier", nominationId] });
      toast.success("AI assessment completed");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to run AI assessment");
    },
  });
}

// =====================================================
// REVIEW WORKFLOW HOOKS
// =====================================================

export function useStartReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (nominationId: string) => nrcApi.startReview(nominationId),
    onSuccess: (_, nominationId) => {
      queryClient.invalidateQueries({ queryKey: ["nrc-my-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-dossier", nominationId] });
      toast.success("Review started");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to start review");
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: NRCReviewPayload) => nrcApi.submitReview(payload),
    onSuccess: (response, payload) => {
      queryClient.invalidateQueries({ queryKey: ["nrc-my-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-dossier", payload.nomination_id] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
      
      const data = response.data;
      if (data?.quorum_result?.quorum_reached) {
        toast.success(`Quorum reached: Nomination ${data.quorum_result.decision}`);
      } else if (data?.quorum_result?.needs_lead) {
        toast.info("Split decision - awaiting NRC Lead resolution");
      } else {
        toast.success("Review submitted successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}

export function useNominationReviews(nominationId: string | undefined) {
  return useQuery({
    queryKey: ["nrc-reviews", nominationId],
    queryFn: () => nrcApi.getReviews(nominationId!),
    enabled: !!nominationId,
  });
}

export function useVerificationSummary(nominationId: string | undefined) {
  return useQuery({
    queryKey: ["nrc-summary", nominationId],
    queryFn: () => nrcApi.getVerificationSummary(nominationId!),
    enabled: !!nominationId,
  });
}

// =====================================================
// EVIDENCE QUERY HOOKS
// =====================================================

export function useRequestEvidence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: NRCEvidenceQueryPayload) => nrcApi.requestEvidence(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["nrc-dossier", payload.nomination_id] });
      queryClient.invalidateQueries({ queryKey: ["nrc-queries", payload.nomination_id] });
      toast.success("Evidence request sent to nominee");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send evidence request");
    },
  });
}

export function useNominationQueries(nominationId: string | undefined) {
  return useQuery({
    queryKey: ["nrc-queries", nominationId],
    queryFn: () => nrcApi.getQueries(nominationId!),
    enabled: !!nominationId,
  });
}

export function useResolveQuery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ queryId, resolution }: { queryId: string; resolution: "accepted" | "insufficient" }) =>
      nrcApi.resolveQuery(queryId, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nrc-queries"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-dossier"] });
      toast.success("Query resolved");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resolve query");
    },
  });
}

// =====================================================
// ASSIGNMENT HOOKS
// =====================================================

export function useAutoAssign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ nominationId, numReviewers }: { nominationId: string; numReviewers?: number }) =>
      nrcApi.autoAssign(nominationId, numReviewers),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["nrc-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
      
      const data = response.data;
      if (data?.success) {
        toast.success(`Assigned to ${data.reviewers?.length || 0} reviewers`);
      } else {
        toast.error(data?.error || "Assignment failed");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign reviewers");
    },
  });
}

export function useReassign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ nominationId, newReviewerId, reason }: { nominationId: string; newReviewerId: string; reason?: string }) =>
      nrcApi.reassign(nominationId, newReviewerId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nrc-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-my-queue"] });
      toast.success("Nomination reassigned");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reassign");
    },
  });
}

export function useBulkAutoAssign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (limit?: number) => nrcApi.bulkAutoAssign(limit),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["nrc-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
      
      const data = response.data;
      toast.success(`Assigned ${data?.assigned_count || 0} nominations`);
      
      if (data?.errors && data.errors.length > 0) {
        toast.warning(`${data.errors.length} assignments failed`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Bulk assignment failed");
    },
  });
}

// =====================================================
// LEAD ACTIONS HOOKS
// =====================================================

export function useResolveSplitDecision() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ nominationId, decision, notes }: { nominationId: string; decision: "verified" | "rejected"; notes?: string }) =>
      nrcApi.resolveSpitDecision(nominationId, decision, notes),
    onSuccess: (_, { nominationId }) => {
      queryClient.invalidateQueries({ queryKey: ["nrc-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-dossier", nominationId] });
      queryClient.invalidateQueries({ queryKey: ["nrc-splits"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
      toast.success("Split decision resolved");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resolve split decision");
    },
  });
}

export function useSplitDecisions() {
  return useQuery({
    queryKey: ["nrc-splits"],
    queryFn: () => nrcApi.getSplitDecisions(),
  });
}

// =====================================================
// MEMBER HOOKS
// =====================================================

export function useNRCMembersEnhanced() {
  return useQuery({
    queryKey: ["nrc-members-enhanced"],
    queryFn: () => nrcApi.getMembers(),
  });
}

export function useUpdateMemberAvailability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ memberId, isAvailable }: { memberId: string; isAvailable: boolean }) =>
      nrcApi.updateMemberAvailability(memberId, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nrc-members-enhanced"] });
      toast.success("Availability updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update availability");
    },
  });
}

// =====================================================
// DASHBOARD HOOKS
// =====================================================

export function useNRCDashboardStats() {
  return useQuery({
    queryKey: ["nrc-dashboard-stats"],
    queryFn: () => nrcApi.getDashboardStats(),
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useOverdueItems() {
  return useQuery({
    queryKey: ["nrc-overdue"],
    queryFn: () => nrcApi.getOverdueItems(),
    refetchInterval: 300000, // Refresh every 5 minutes
  });
}

// =====================================================
// AUDIT HOOKS
// =====================================================

export function useNRCAuditLogs(params?: {
  page?: number;
  limit?: number;
  action?: string;
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: ["nrc-audit-logs", params],
    queryFn: () => nrcApi.getAuditLogs(params),
  });
}

// =====================================================
// WORKFLOW HOOKS
// =====================================================

export function usePublishForVoting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ nominationId, targetTier }: { nominationId: string; targetTier?: "gold" | "platinum" }) =>
      nrcApi.publishForVoting(nominationId, targetTier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nrc-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });
      toast.success("Nominee published for voting");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to publish");
    },
  });
}
