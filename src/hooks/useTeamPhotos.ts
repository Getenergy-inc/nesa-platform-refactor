// Live public team portraits for the /meet-the-team collage hero.
//
// Sources: `volunteers` (public + approved only) and the `judges_public`
// view (already stripped of PII). The published static roster fills in only
// when the database returns fewer portraits, so the collage is never empty
// and grows automatically as real people are added.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STATIC_VOLUNTEERS } from "@/lib/volunteersData";

export interface TeamPhoto {
  id: string;
  name: string;
  photoUrl: string;
  role: string;
  country?: string | null;
  slug?: string | null;
}

export function useTeamPhotos(limit = 40) {
  const [photos, setPhotos] = useState<TeamPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const collected: TeamPhoto[] = [];
      try {
        const [vRes, jRes] = await Promise.all([
          supabase
            .from("volunteers")
            .select("id, slug, full_name, photo_url, country, role")
            .eq("visibility_status", "public")
            .eq("verification_status", "approved")
            .not("photo_url", "is", null)
            .order("contribution_score", { ascending: false })
            .limit(limit),
          supabase
            .from("judges_public")
            .select("id, slug, full_name, photo_url, professional_title, country_residence")
            .not("photo_url", "is", null)
            .limit(limit),
        ]);

        for (const v of (vRes.data || []) as Array<Record<string, string | null>>) {
          if (!v.photo_url) continue;
          collected.push({
            id: `v-${v.id}`,
            name: v.full_name || "",
            photoUrl: v.photo_url,
            role: v.role || "Volunteer",
            country: v.country,
            slug: v.slug ? `/volunteers/${v.slug}` : "/volunteers",
          });
        }
        for (const j of (jRes.data || []) as Array<Record<string, string | null>>) {
          if (!j.photo_url) continue;
          collected.push({
            id: `j-${j.id}`,
            name: j.full_name || "",
            photoUrl: j.photo_url,
            role: j.professional_title || "Judge",
            country: j.country_residence,
            slug: j.slug ? `/judges/${j.slug}` : "/judges",
          });
        }
      } catch (err) {
        console.error("[useTeamPhotos] failed to load team portraits", err);
      }

      // Fill from the published static roster (public entries with photos only).
      if (collected.length < limit) {
        const have = new Set(collected.map((p) => p.name.trim().toLowerCase()));
        for (const v of STATIC_VOLUNTEERS) {
          if (collected.length >= limit) break;
          if (v.visibility !== "public" || !v.photoUrl) continue;
          if (have.has(v.fullName.trim().toLowerCase())) continue;
          have.add(v.fullName.trim().toLowerCase());
          collected.push({
            id: `s-${v.id}`,
            name: v.fullName,
            photoUrl: v.photoUrl,
            role: v.role || v.headline || "Volunteer",
            country: v.country,
            slug: `/volunteers/${v.slug}`,
          });
        }
      }

      if (!cancelled) {
        setPhotos(collected.slice(0, limit));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { photos, loading };
}
