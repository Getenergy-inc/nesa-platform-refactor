import { supabase } from "@/integrations/supabase/client";

/**
 * Credits the referrer when a signed-in member submits a nomination after
 * arriving through a referral link. Runs through a security-definer RPC
 * (`referral_events` is not client-writable) and never throws into the
 * submission flow.
 */
export async function recordNominationReferral(code: string | null): Promise<void> {
  if (!code) return;
  try {
    await supabase.rpc("record_nomination_referral", { p_referral_code: code });
  } catch {
    /* attribution is best-effort */
  }
}
