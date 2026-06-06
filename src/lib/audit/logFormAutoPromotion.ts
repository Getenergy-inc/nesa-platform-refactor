// Records an admin-visible audit event when the status resolver auto-promotes
// a Google Form record from "Link Pending" to "Active". Deduped per browser
// session per (formKind, formSlug) to avoid spamming `audit_events` on
// every render or page visit.
//
// RLS: `audit_events` accepts INSERTs from any authenticated user; the
// `actor_id` and `actor_role: 'admin'` columns identify the viewer.

import { supabase } from "@/integrations/supabase/client";

export type FormKind = "rmsa-region" | "award-category";

export interface LogFormAutoPromotionInput {
  formKind: FormKind;
  formSlug: string;
  actorId: string;
  rawStatus: string;
  resolvedStatus: string;
}

const SESSION_KEY_PREFIX = "nesa:auto-promoted-logged:";

function sessionKey(input: Pick<LogFormAutoPromotionInput, "formKind" | "formSlug" | "actorId">) {
  return `${SESSION_KEY_PREFIX}${input.actorId}:${input.formKind}:${input.formSlug}`;
}

function hasLogged(input: LogFormAutoPromotionInput): boolean {
  if (typeof window === "undefined" || !window.sessionStorage) return false;
  try {
    return window.sessionStorage.getItem(sessionKey(input)) === "1";
  } catch {
    return false;
  }
}

function markLogged(input: LogFormAutoPromotionInput): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.setItem(sessionKey(input), "1");
  } catch {
    // Ignore quota / privacy-mode errors.
  }
}

export async function logFormAutoPromotion(
  input: LogFormAutoPromotionInput,
): Promise<{ logged: boolean; error?: unknown }> {
  if (input.rawStatus !== "Link Pending" || input.resolvedStatus !== "Active") {
    return { logged: false };
  }
  if (hasLogged(input)) {
    return { logged: false };
  }

  const { error } = await supabase.from("audit_events").insert({
    action: "form_auto_promoted",
    entity_type: "google_form",
    actor_id: input.actorId,
    actor_role: "admin",
    metadata: {
      form_kind: input.formKind,
      form_slug: input.formSlug,
      raw_status: input.rawStatus,
      resolved_status: input.resolvedStatus,
      observed_at: new Date().toISOString(),
    },
  });

  if (error) {
    return { logged: false, error };
  }

  markLogged(input);
  return { logged: true };
}
