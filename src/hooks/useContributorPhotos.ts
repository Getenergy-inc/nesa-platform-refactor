import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ContributorPhoto {
  contributor_id: string;
  image_url: string;
  storage_path: string | null;
  updated_at: string;
}

export function useContributorPhotos() {
  const [photos, setPhotos] = useState<Record<string, ContributorPhoto>>({});
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contributor_photos")
      .select("contributor_id, image_url, storage_path, updated_at");
    if (!error && data) {
      const map: Record<string, ContributorPhoto> = {};
      for (const row of data as ContributorPhoto[]) map[row.contributor_id] = row;
      setPhotos(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { photos, loading, refetch };
}

/** Return the override URL if present, otherwise the static fallback. */
export function resolveContributorImage(
  id: string,
  fallback: string | undefined,
  photos: Record<string, ContributorPhoto>,
): string | undefined {
  return photos[id]?.image_url || fallback;
}
