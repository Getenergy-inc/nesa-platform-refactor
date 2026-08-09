import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STATIC_VOLUNTEERS, type Volunteer, type TeamSlug } from "@/lib/volunteersData";

interface Row {
  id: string;
  person_id: string;
  slug: string;
  full_name: string;
  photo_url: string | null;
  headline: string | null;
  bio: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  team_slug: string | null;
  role: string | null;
  badges: string[] | null;
  social_links: Record<string, string> | null;
  contribution_score: number;
  referral_code: string;
  referral_count: number;
  tasks_completed: number;
  is_featured: boolean;
  visibility_status: "public" | "hidden" | "alumni";
  verification_status: "pending" | "approved" | "rejected";
  joined_at: string;
}

function rowToVolunteer(r: Row): Volunteer {
  return {
    id: r.id,
    slug: r.slug,
    fullName: r.full_name,
    photoUrl: r.photo_url ?? undefined,
    headline: r.headline ?? undefined,
    bio: r.bio ?? undefined,
    country: r.country ?? undefined,
    region: r.region ?? undefined,
    city: r.city ?? undefined,
    teamSlug: (r.team_slug as TeamSlug) ?? undefined,
    role: r.role ?? undefined,
    badges: r.badges ?? [],
    socialLinks: r.social_links ?? {},
    contributionScore: r.contribution_score,
    referralCode: r.referral_code,
    referralCount: r.referral_count,
    tasksCompleted: r.tasks_completed,
    isFeatured: r.is_featured,
    visibility: r.visibility_status,
    verification: r.verification_status,
    joinedAt: r.joined_at,
    source: "db",
  };
}

export function useVolunteers() {
  const [dbVolunteers, setDb] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .eq("visibility_status", "public")
        .eq("verification_status", "approved")
        .order("contribution_score", { ascending: false });
      if (alive) {
        if (!error && data) setDb((data as Row[]).map(rowToVolunteer));
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Merge: DB takes precedence by slug; static fills the rest so the page is never empty.
  const all = useMemo(() => {
    const bySlug = new Map<string, Volunteer>();
    for (const v of STATIC_VOLUNTEERS) bySlug.set(v.slug, v);
    for (const v of dbVolunteers) bySlug.set(v.slug, v);
    return Array.from(bySlug.values()).sort((a, b) => b.contributionScore - a.contributionScore);
  }, [dbVolunteers]);

  return { volunteers: all, loading };
}

export function useVolunteerBySlug(slug: string | undefined) {
  const { volunteers, loading } = useVolunteers();
  const volunteer = useMemo(
    () => (slug ? volunteers.find((v) => v.slug === slug) : undefined),
    [slug, volunteers]
  );
  return { volunteer, loading };
}
