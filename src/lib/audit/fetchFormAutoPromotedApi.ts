import { supabase } from "@/integrations/supabase/client";

export type FormKindFilter = "rmsa-region" | "award-category";

export interface FetchFormAutoPromotedApiParams {
  page?: number;
  limit?: number;
  formKind?: FormKindFilter | "all";
  formSlug?: string;
}

export interface FormAutoPromotedApiRow {
  id: string;
  action: string;
  actor_id: string | null;
  entity_type: string | null;
  entity_id: string | null;
  form_kind: string | null;
  form_slug: string | null;
  raw_status: string | null;
  resolved_status: string | null;
  created_at: string;
}

export interface FormAutoPromotedApiResponse {
  rows: FormAutoPromotedApiRow[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * Calls the backend admin audit-logs endpoint
 * (GET /admin/audit-logs?action=form_auto_promoted) via the `admin`
 * edge function. Returns paginated rows with actor_id, form_slug,
 * raw_status, and resolved_status surfaced as top-level fields.
 *
 * Requires the caller to be authenticated as an admin; the function
 * enforces the role server-side and returns 403 otherwise.
 */
export async function fetchFormAutoPromotedApi(
  params: FetchFormAutoPromotedApiParams = {},
): Promise<FormAutoPromotedApiResponse> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 25));

  const search = new URLSearchParams();
  search.set("action", "form_auto_promoted");
  search.set("page", String(page));
  search.set("limit", String(limit));
  if (params.formKind && params.formKind !== "all") {
    search.set("form_kind", params.formKind);
  }
  const trimmedSlug = params.formSlug?.trim();
  if (trimmedSlug) {
    search.set("form_slug", trimmedSlug);
  }

  const { data, error } = await supabase.functions.invoke(
    `admin/audit-logs?${search.toString()}`,
    { method: "GET" },
  );

  if (error) throw error;
  if (!data?.ok) {
    throw new Error((data && (data.error as string)) || "Failed to load audit logs");
  }

  const meta = (data.meta ?? {}) as {
    page?: number;
    limit?: number;
    total?: number;
    total_pages?: number;
  };

  return {
    rows: (data.data ?? []) as FormAutoPromotedApiRow[],
    page: meta.page ?? page,
    limit: meta.limit ?? limit,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 1,
  };
}
