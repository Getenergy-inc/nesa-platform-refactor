/**
 * Records an audit event when a user clicks the "Nominations opening soon"
 * button on a locked faith-category subcategory tile (e.g. Christian Advocacy
 * & Awareness before the backend `subcategories` row exists).
 *
 * Writes to `public.audit_events` — RLS only allows authenticated inserts, so
 * anonymous attempts intentionally no-op silently. Never throws into the UI.
 */
import { supabase } from "@/integrations/supabase/client";
import type { FaithSubcategory, FaithCategoryConfig } from "./faithCategoryTypes";

export type LockedNominateAttempt = {
  faith: FaithCategoryConfig["faith"];
  tabKey: FaithSubcategory["tabKey"];
  slug: string | null;
  tileTitle: string;
  routePath: string;
};

export const LOCKED_NOMINATE_ACTION = "nominate_locked_attempt" as const;

export async function logLockedNominateAttempt(
  attempt: LockedNominateAttempt,
): Promise<{ logged: boolean; reason?: string }> {
  try {
    const { data: userResult } = await supabase.auth.getUser();
    const actorId = userResult?.user?.id ?? null;

    const { error } = await supabase.from("audit_events").insert({
      action: LOCKED_NOMINATE_ACTION,
      entity_type: "subcategory",
      actor_id: actorId,
      actor_role: actorId ? "user" : "anonymous",
      metadata: {
        faith: attempt.faith,
        tab_key: attempt.tabKey,
        slug: attempt.slug,
        tile_title: attempt.tileTitle,
        route_path: attempt.routePath,
      },
    });

    if (error) {
      return { logged: false, reason: error.message };
    }
    return { logged: true };
  } catch (err) {
    return { logged: false, reason: (err as Error).message };
  }
}
