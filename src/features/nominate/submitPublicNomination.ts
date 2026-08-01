import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

export interface PublicNominationInput {
  formType: string;
  awardTier?: string | null;
  categorySlug?: string | null;
  subcategory?: string | null;
  nomineeName: string;
  nomineeCountry?: string | null;
  impactSummary?: string | null;
  nominatorEmail?: string | null;
  draftToken?: string | null;
  payload: Record<string, unknown>;
}

export interface PublicNominationResult {
  reference: string;
  intakeId: string;
  isDuplicate: boolean;
}

/**
 * Submits a nomination WITHOUT requiring an account.
 * A reference is generated and returned immediately; account creation and
 * email verification happen afterwards and never block the submission.
 * Idempotent per draft token — re-submitting the same draft returns the
 * original reference instead of creating a duplicate.
 */
export async function submitPublicNomination(
  input: PublicNominationInput,
): Promise<PublicNominationResult> {
  trackEvent("nomination_submit_attempted", {
    form: input.formType,
    tier: input.awardTier,
    category: input.categorySlug,
  });

  const { data, error } = await supabase.rpc("submit_public_nomination", {
    p_form_type: input.formType,
    p_award_tier: input.awardTier ?? null,
    p_category_slug: input.categorySlug ?? null,
    p_payload: JSON.parse(JSON.stringify(input.payload)),
    p_nominee_name: input.nomineeName,
    p_nominee_country: input.nomineeCountry ?? null,
    p_impact_summary: input.impactSummary ?? null,
    p_nominator_email: input.nominatorEmail ?? null,
    p_draft_token: input.draftToken ?? null,
    p_subcategory: input.subcategory ?? null,
  });

  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.reference) throw new Error("Submission did not return a reference.");

  const result: PublicNominationResult = {
    reference: row.reference,
    intakeId: row.intake_id,
    isDuplicate: Boolean(row.is_duplicate),
  };

  trackEvent(result.isDuplicate ? "nomination_submit_deduped" : "nomination_submitted", {
    form: input.formType,
    tier: input.awardTier,
    category: input.categorySlug,
    reference: result.reference,
  });

  return result;
}

/** Attaches an already-submitted nomination to the signed-in account. */
export async function linkNominationToAccount(reference: string) {
  const { error } = await supabase.rpc("link_nomination_to_account", {
    p_reference: reference,
  });
  if (error) return false;
  trackEvent("nomination_linked_to_account", { reference });
  return true;
}
