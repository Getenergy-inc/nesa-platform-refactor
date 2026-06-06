import { supabase } from "@/integrations/supabase/client";
import type { CleanedRow, IngestContext } from "@/lib/nominations/mapRawRow";

export interface IngestRequest {
  headers: string[];
  rows: (string | number | null)[][];
  startingRowNumber?: number;
  context: IngestContext;
}

export interface IngestPersistedRecord {
  record_id: string;
  id: string;
  duplicate_of: string | null;
  duplicate_status: string;
}

export interface IngestPersistError {
  record_id: string;
  message: string;
}

export interface IngestResponse {
  cleaned: CleanedRow[];
  total: number;
  warnings: { rowNumber: number; messages: string[] }[];
  persisted: IngestPersistedRecord[];
  persistErrors: IngestPersistError[];
}

/**
 * POSTs Raw Form Responses rows to the admin edge function for mapping into
 * Cleaned Data records. Admin role enforced server-side.
 */
export async function ingestRawRows(req: IngestRequest): Promise<IngestResponse> {
  const { data, error } = await supabase.functions.invoke("admin/nominations/ingest", {
    method: "POST",
    body: req,
  });

  if (error) throw error;
  if (!data?.ok) {
    throw new Error((data && (data.error as string)) || "Failed to ingest rows");
  }

  const meta = (data.meta ?? {}) as {
    total?: number;
    warnings?: { rowNumber: number; messages: string[] }[];
    persisted?: IngestPersistedRecord[];
    persist_errors?: IngestPersistError[];
  };

  return {
    cleaned: (data.data ?? []) as CleanedRow[],
    total: meta.total ?? 0,
    warnings: meta.warnings ?? [],
    persisted: meta.persisted ?? [],
    persistErrors: meta.persist_errors ?? [],
  };
}
