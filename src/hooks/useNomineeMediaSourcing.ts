/**
 * Loads the publicly-approved nominee media register once per session and
 * exposes a resolver bound to it. Public pages NEVER perform image discovery —
 * they only read already-resolved, already-approved media.
 */
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  buildSharedOrganisationIndex,
  resolveNomineeMedia,
  type NomineeMediaInput,
  type NomineeMediaSourcingRecord,
  type ResolvedNomineeMedia,
  type ResolverOptions,
} from "@/lib/nomineeMediaResolver";

const SELECT =
  "nominee_id, nominee_slug, nominee_name, entity_type, media_kind, media_status, candidate_image_url, approved_asset_url, storage_path, source_url, source_domain, source_type, attribution, confidence, date_checked, verification_note, approved_for_public, submitted_by_nominee";

async function fetchApprovedMedia(): Promise<NomineeMediaSourcingRecord[]> {
  const { data, error } = await supabase
    .from("nominee_media_sourcing")
    .select(SELECT)
    .eq("approved_for_public", true)
    .in("media_status", ["verified", "manually_approved"])
    .limit(5000);
  if (error) {
    console.warn("[nominee_media_sourcing] read failed:", error.message);
    return [];
  }
  return (data ?? []) as unknown as NomineeMediaSourcingRecord[];
}

export function useApprovedNomineeMedia() {
  return useQuery({
    queryKey: ["nominee-media-sourcing", "approved"],
    queryFn: fetchApprovedMedia,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Returns `resolve(nominee, extraOptions)` — the single entry point every
 * nominee card/gallery/spotlight should use to pick its visual.
 */
export function useNomineeMediaResolver() {
  const { data, isLoading } = useApprovedNomineeMedia();

  const options = useMemo<ResolverOptions>(() => {
    const rows = data ?? [];
    const sourcing: Record<string, NomineeMediaSourcingRecord> = {};
    for (const row of rows) sourcing[row.nominee_id] = row;
    return { sourcing, sharedByOrganisation: buildSharedOrganisationIndex(rows) };
  }, [data]);

  const resolve = useCallback(
    (nominee: NomineeMediaInput, extra?: Partial<ResolverOptions>): ResolvedNomineeMedia =>
      resolveNomineeMedia(nominee, { ...options, ...extra }),
    [options],
  );

  return { resolve, isLoading };
}
