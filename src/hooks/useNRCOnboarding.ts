// Real per-user NRC onboarding progress, backed by public.nrc_onboarding.
// No placeholder state: if there is no row, the caller must show that honestly.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const NRC_ONBOARDING_STEPS = [
  { key: "profile_completed", label: "Professional Profile", self: true },
  { key: "identity_verified", label: "Identity Verification", self: true },
  { key: "appointment_accepted", label: "Appointment Acceptance", self: true },
  { key: "mou_signed", label: "NRC MOU", self: true },
  { key: "confidentiality_signed", label: "Confidentiality Agreement", self: true },
  { key: "code_of_conduct", label: "Code of Conduct", self: true },
  { key: "conflict_declared", label: "Conflict Declaration", self: true },
  { key: "data_protection", label: "Data Protection", self: true },
  { key: "evidence_training", label: "Evidence Verification Training", self: true },
  { key: "category_training", label: "Category or Pathway Training", self: true },
  { key: "assessment_passed", label: "Assessment", self: true },
  { key: "activated", label: "Activation (NRC leadership)", self: false },
] as const;

export type NRCOnboardingStepKey = (typeof NRC_ONBOARDING_STEPS)[number]["key"];

export interface NRCOnboardingRow {
  id: string;
  user_id: string;
  completed_at: string | null;
  activated: boolean;
  activated_at: string | null;
  [key: string]: unknown;
}

export function useNRCOnboarding() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["nrc-onboarding", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<NRCOnboardingRow | null> => {
      const { data, error } = await supabase
        .from("nrc_onboarding")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as NRCOnboardingRow) ?? null;
    },
  });
}

export function useSetNRCOnboardingStep() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: NRCOnboardingStepKey; value: boolean }) => {
      if (!user?.id) throw new Error("You must be signed in.");
      const { error } = await supabase
        .from("nrc_onboarding")
        .update({ [key]: value })
        .eq("user_id", user.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["nrc-onboarding", user?.id] });
    },
  });
}

/** True only when every self-serve step is ticked (activation excluded). */
export function isNRCOnboardingComplete(row: NRCOnboardingRow | null | undefined): boolean {
  if (!row) return false;
  return NRC_ONBOARDING_STEPS.filter((s) => s.self).every((s) => row[s.key] === true);
}
