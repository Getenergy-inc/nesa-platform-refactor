/**
 * Server-backed nominee media resolver.
 * Loads the verified records from `nominee_media` once per session and
 * exposes a fast lookup so every nominee card / profile / carousel / voting
 * page / OG image automatically uses the licensed admin upload when one
 * exists, falling back to the bundled placeholder otherwise.
 */
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface NomineeMediaRecord {
  nominee_slug: string;
  nominee_name: string;
  kind: "person" | "organization";
  image_url: string | null;
  thumbnail_url: string | null;
  banner_url: string | null;
  logo_url: string | null;
  og_image_url: string | null;
  alt_text: string | null;
  caption: string | null;
  source_url: string | null;
  source_type: string | null;
  license_status: string | null;
  attribution: string | null;
  verified: boolean;
}

export interface ResolvedMedia {
  image: string | null;
  thumbnail: string | null;
  banner: string | null;
  logo: string | null;
  og: string | null;
  alt: string | null;
  source: string | null;
  attribution: string | null;
  kind: "person" | "organization" | null;
  verified: boolean;
}

const EMPTY: ResolvedMedia = {
  image: null, thumbnail: null, banner: null, logo: null, og: null,
  alt: null, source: null, attribution: null, kind: null, verified: false,
};

async function fetchAllVerifiedMedia(): Promise<Record<string, NomineeMediaRecord>> {
  const { data, error } = await supabase
    .from("nominee_media")
    .select("*")
    .eq("verified", true);
  if (error) {
    console.warn("[nominee_media] fetch failed", error.message);
    return {};
  }
  const map: Record<string, NomineeMediaRecord> = {};
  for (const row of data ?? []) {
    map[row.nominee_slug] = row as NomineeMediaRecord;
  }
  return map;
}

export function useNomineeMediaIndex() {
  return useQuery({
    queryKey: ["nominee-media-index"],
    queryFn: fetchAllVerifiedMedia,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

export function useResolveNomineeMedia() {
  const { data } = useNomineeMediaIndex();
  return useCallback(
    (slug?: string | null, fallbackImage?: string | null, fallbackAlt?: string | null): ResolvedMedia => {
      if (!slug) return { ...EMPTY, image: fallbackImage ?? null, alt: fallbackAlt ?? null };
      const rec = data?.[slug];
      if (!rec) return { ...EMPTY, image: fallbackImage ?? null, alt: fallbackAlt ?? null };
      const primary = rec.image_url ?? rec.logo_url ?? fallbackImage ?? null;
      return {
        image: primary,
        thumbnail: rec.thumbnail_url ?? primary,
        banner: rec.banner_url ?? primary,
        logo: rec.logo_url ?? null,
        og: rec.og_image_url ?? primary,
        alt: rec.alt_text ?? fallbackAlt ?? null,
        source: rec.source_url,
        attribution: rec.attribution,
        kind: rec.kind,
        verified: rec.verified,
      };
    },
    [data],
  );
}
