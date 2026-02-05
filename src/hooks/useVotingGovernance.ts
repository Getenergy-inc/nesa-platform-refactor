/**
 * NESA-Africa 2025 - Voting Governance Hooks
 * React Query hooks for voting, results, fraud detection, and admin functions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import votingApi from "@/api/votingGovernance";
import type {
  Contest,
  ComputedResult,
  FraudFlag,
  VotingStageStatus,
  VotingDashboardStats,
} from "@/types/votingGovernance";

// ==========================================
// PUBLIC VOTING HOOKS
// ==========================================

/**
 * Check vote eligibility before casting
 */
export function useVoteEligibility(params: {
  voteType: "gold" | "blue-garnet";
  subcategoryId?: string;
  categoryId?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["vote-eligibility", params.voteType, params.subcategoryId, params.categoryId],
    queryFn: async () => {
      const response = await votingApi.checkVoteEligibility({
        voteType: params.voteType,
        subcategoryId: params.subcategoryId,
        categoryId: params.categoryId,
      });
      return response.data;
    },
    enabled: params.enabled !== false && !!(params.subcategoryId || params.categoryId),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Cast a vote with vote-once enforcement
 */
export function useCastVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votingApi.castVoteWithConstraints,
    onSuccess: (response, variables) => {
      toast.success("Vote cast successfully!");
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["vote-eligibility"] });
      queryClient.invalidateQueries({ queryKey: ["user-votes"] });
      queryClient.invalidateQueries({ queryKey: ["voting-balance"] });
      
      if (variables.voteType === "gold") {
        queryClient.invalidateQueries({ queryKey: ["nominees-for-gold-voting"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["nominees-for-blue-garnet-voting"] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cast vote");
    },
  });
}

// ==========================================
// CONTESTS HOOKS
// ==========================================

/**
 * Get active contests
 */
export function useActiveContests() {
  return useQuery({
    queryKey: ["active-contests"],
    queryFn: async () => {
      const response = await votingApi.getActiveContests();
      return response.data?.data || [];
    },
  });
}

// ==========================================
// RESULTS HOOKS
// ==========================================

/**
 * Get published results (public)
 */
export function usePublishedResults(params?: {
  contestType?: string;
  categoryId?: string;
}) {
  return useQuery({
    queryKey: ["published-results", params],
    queryFn: async () => {
      const response = await votingApi.getPublishedResults(params);
      return response.data?.data || [];
    },
  });
}

/**
 * Get all results (admin)
 */
export function useAllResults(params?: {
  status?: string;
  contestType?: string;
}) {
  return useQuery({
    queryKey: ["admin-results", params],
    queryFn: async () => {
      const response = await votingApi.getAllResults(params);
      return response.data?.data || [];
    },
  });
}

/**
 * Compute Gold results
 */
export function useComputeGoldResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votingApi.computeGoldResults,
    onSuccess: (response) => {
      toast.success(`Gold results computed: ${response.data?.results_count || 0} nominees`);
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to compute Gold results");
    },
  });
}

/**
 * Compute Blue Garnet results
 */
export function useComputeBlueGarnetResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votingApi.computeBlueGarnetResults,
    onSuccess: (response) => {
      toast.success(`Blue Garnet results computed: ${response.data?.results_count || 0} nominees`);
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to compute Blue Garnet results");
    },
  });
}

/**
 * Publish results
 */
export function usePublishResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votingApi.publishResults,
    onSuccess: (response, contestType) => {
      toast.success(`Results published: ${response.data?.published_count || 0} nominees`);
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
      queryClient.invalidateQueries({ queryKey: ["published-results"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish results");
    },
  });
}

// ==========================================
// FRAUD DETECTION HOOKS
// ==========================================

/**
 * Get fraud flags (admin)
 */
export function useFraudFlags(params?: {
  status?: string;
  severity?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["fraud-flags", params],
    queryFn: async () => {
      const response = await votingApi.getFraudFlags(params);
      return response.data?.data || [];
    },
  });
}

/**
 * Update fraud flag status
 */
export function useUpdateFraudFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flagId, updates }: { flagId: string; updates: { flag_status?: string; admin_notes?: string } }) =>
      votingApi.updateFraudFlag(flagId, updates),
    onSuccess: () => {
      toast.success("Fraud flag updated");
      queryClient.invalidateQueries({ queryKey: ["fraud-flags"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update fraud flag");
    },
  });
}

/**
 * Run fraud detection
 */
export function useRunFraudDetection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votingApi.runFraudDetection,
    onSuccess: (response) => {
      const flagsCreated = response.data?.flags_created || 0;
      if (flagsCreated > 0) {
        toast.warning(`Fraud detection completed: ${flagsCreated} new flags`);
      } else {
        toast.success("Fraud detection completed: No new flags");
      }
      queryClient.invalidateQueries({ queryKey: ["fraud-flags"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to run fraud detection");
    },
  });
}

// ==========================================
// JURY SUBMISSION HOOKS
// ==========================================

/**
 * Get judge's submission status
 */
export function useMySubmissionStatus(contestId?: string) {
  return useQuery({
    queryKey: ["my-submission-status", contestId],
    queryFn: async () => {
      const response = await votingApi.getMySubmissionStatus(contestId);
      return response.data;
    },
  });
}

/**
 * Lock judge submission
 */
export function useLockSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votingApi.lockSubmission,
    onSuccess: () => {
      toast.success("Submission locked. Your scores have been finalized.");
      queryClient.invalidateQueries({ queryKey: ["my-submission-status"] });
      queryClient.invalidateQueries({ queryKey: ["jury-assignments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to lock submission");
    },
  });
}

// ==========================================
// ADMIN DASHBOARD HOOKS
// ==========================================

/**
 * Get voting stage status
 */
export function useVotingStageStatus() {
  return useQuery<VotingStageStatus>({
    queryKey: ["voting-stage-status"],
    queryFn: async () => {
      const response = await votingApi.getVotingStageStatus();
      return response.data as VotingStageStatus;
    },
  });
}

/**
 * Get voting dashboard stats
 */
export function useVotingDashboardStats() {
  return useQuery<VotingDashboardStats>({
    queryKey: ["voting-dashboard-stats"],
    queryFn: async () => {
      const response = await votingApi.getVotingDashboardStats();
      return response.data as VotingDashboardStats;
    },
  });
}

/**
 * Open/close stages
 */
export function useStageControl() {
  const queryClient = useQueryClient();

  const openMutation = useMutation({
    mutationFn: votingApi.openStage,
    onSuccess: (_, action) => {
      toast.success(`${action} stage opened`);
      queryClient.invalidateQueries({ queryKey: ["voting-stage-status"] });
      queryClient.invalidateQueries({ queryKey: ["stages"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to open stage");
    },
  });

  const closeMutation = useMutation({
    mutationFn: votingApi.closeStage,
    onSuccess: (_, action) => {
      toast.success(`${action} stage closed`);
      queryClient.invalidateQueries({ queryKey: ["voting-stage-status"] });
      queryClient.invalidateQueries({ queryKey: ["stages"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to close stage");
    },
  });

  return { openStage: openMutation, closeStage: closeMutation };
}
