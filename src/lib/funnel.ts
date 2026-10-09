/**
 * Nomination funnel instrumentation.
 *
 * Fire-and-forget step logging into `public.nomination_funnel_events`
 * (anon INSERT allowed, admin-only SELECT). Never blocks or throws into the
 * nomination flow — a failed log is silently dropped.
 */

import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

export interface FunnelContext {
  formType?: string | null;
  awardTier?: string | null;
  categorySlug?: string | null;
}

/** Logs one funnel step. Safe to call from render effects. */
export function logFunnelStep(step: string, ctx: FunnelContext = {}) {
  if (typeof window === "undefined") return;
  const { utm, referralCode, sessionId } = getAttribution();

  trackEvent("nomination_funnel_step", {
    step,
    form: ctx.formType ?? null,
    tier: ctx.awardTier ?? null,
    category: ctx.categorySlug ?? null,
    utm_source: utm.utm_source ?? null,
    referral_code: referralCode,
  });

  void supabase
    .from("nomination_funnel_events")
    .insert({
      session_id: sessionId,
      step,
      form_type: ctx.formType ?? null,
      award_tier: ctx.awardTier ?? null,
      category_slug: ctx.categorySlug ?? null,
      utm_source: utm.utm_source ?? null,
      utm_medium: utm.utm_medium ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      referral_code: referralCode,
    })
    .then(
      () => undefined,
      () => undefined,
    );
}

/**
 * De-duplicated step logging — a step is only logged once per page session,
 * so revisiting a wizard step by going back does not inflate the funnel.
 */
const seen = new Set<string>();

export function logFunnelStepOnce(step: string, ctx: FunnelContext = {}) {
  const key = `${ctx.formType ?? "form"}::${step}`;
  if (seen.has(key)) return;
  seen.add(key);
  logFunnelStep(step, ctx);
}
