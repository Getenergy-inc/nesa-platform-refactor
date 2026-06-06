import { supabase } from "@/integrations/supabase/client";

export type FormKind = "rmsa-region" | "award-category";

export interface FormAutoPromotedFilter {
  formKind?: FormKind | "all";
  slug?: string;
  page?: number;
  pageSize?: number;
}

export interface FormAutoPromotedEvent {
  id: string;
  created_at: string;
  actor_id: string | null;
  form_kind: string;
  form_slug: string;
  raw_status: string;
  resolved_status: string;
}

export interface FormAutoPromotedQueryResult {
  events: FormAutoPromotedEvent[];
  total: number;
}

/**
 * Query audit_events for action='form_auto_promoted' with optional
 * filters on form kind and slug. Returns typed events with actor,
 * slug, and raw/resolved status fields.
 *
 * RLS: Requires admin role (policy "Admins view audit events").
 */
export async function queryFormAutoPromoted(
  filter: FormAutoPromotedFilter = {},
): Promise<FormAutoPromotedQueryResult> {
  const page = Math.max(1, filter.page ?? 1);
  const pageSize = Math.max(1, Math.min(100, filter.pageSize ?? 25));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("audit_events")
    .select("id, created_at, actor_id, metadata", { count: "exact" })
    .eq("action", "form_auto_promoted")
    .order("created_at", { ascending: false });

  if (filter.formKind && filter.formKind !== "all") {
    query = query.eq("metadata->>form_kind", filter.formKind);
  }

  const trimmedSlug = filter.slug?.trim();
  if (trimmedSlug) {
    query = query.ilike("metadata->>form_slug", `%${trimmedSlug}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  const events: FormAutoPromotedEvent[] = (data ?? []).map((row) => {
    const meta = (row.metadata ?? {}) as Record<string, unknown>;
    return {
      id: row.id as string,
      created_at: row.created_at as string,
      actor_id: (row.actor_id as string | null) ?? null,
      form_kind: String(meta.form_kind ?? "—"),
      form_slug: String(meta.form_slug ?? "—"),
      raw_status: String(meta.raw_status ?? "—"),
      resolved_status: String(meta.resolved_status ?? "—"),
    };
  });

  return { events, total: count ?? 0 };
}
