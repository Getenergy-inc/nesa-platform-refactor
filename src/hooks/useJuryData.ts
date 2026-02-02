import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssignments, getStats, getCOIDeclarations, submitScore, declareCOI, getDossier } from "@/api/jury";
import type { JuryAssignment, JuryStats, COIDeclaration, EvidenceDossier } from "@/api/jury";

export function useJuryAssignments() {
  return useQuery({
    queryKey: ["jury", "assignments"],
    queryFn: async () => {
      const response = await getAssignments();
      if (response.error) throw new Error(response.error);
      return response.data?.assignments || [];
    },
  });
}

export function useJuryStats() {
  return useQuery({
    queryKey: ["jury", "stats"],
    queryFn: async () => {
      const response = await getStats();
      if (response.error) throw new Error(response.error);
      return response.data?.stats;
    },
  });
}

export function useJuryCOI() {
  return useQuery({
    queryKey: ["jury", "coi"],
    queryFn: async () => {
      const response = await getCOIDeclarations();
      if (response.error) throw new Error(response.error);
      return response.data?.declarations || [];
    },
  });
}

export function useNomineeDossier(nomineeId: string | null) {
  return useQuery({
    queryKey: ["jury", "dossier", nomineeId],
    queryFn: async () => {
      if (!nomineeId) return null;
      const response = await getDossier(nomineeId);
      if (response.error) throw new Error(response.error);
      return response.data?.dossier;
    },
    enabled: !!nomineeId,
  });
}

export function useSubmitScore() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ nomineeId, score, comment }: { nomineeId: string; score: number; comment?: string }) => {
      return submitScore(nomineeId, score, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jury", "assignments"] });
      queryClient.invalidateQueries({ queryKey: ["jury", "stats"] });
    },
  });
}

export function useDeclareCOI() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ nomineeId, reason }: { nomineeId: string; reason: string }) => {
      return declareCOI(nomineeId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jury", "assignments"] });
      queryClient.invalidateQueries({ queryKey: ["jury", "coi"] });
      queryClient.invalidateQueries({ queryKey: ["jury", "stats"] });
    },
  });
}

export type { JuryAssignment, JuryStats, COIDeclaration, EvidenceDossier };
