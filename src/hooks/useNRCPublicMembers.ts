// Public NRC member reads.
//
// Source of truth: the `nrc_public_members` view (opt-in only — is_public = true
// AND status = 'active'). No fallback, no seeded/demo people: when the corps has
// not been onboarded yet these hooks return an empty list and the UI shows an
// honest empty state.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublicNRCMember {
  id: string;
  display_name: string;
  slug: string;
  bio: string | null;
  photo_url: string | null;
  country: string | null;
  specialization: string[] | null;
  created_at: string;
}

export function usePublicNRCMembers() {
  return useQuery({
    queryKey: ["nrc-public-members"],
    queryFn: async (): Promise<PublicNRCMember[]> => {
      const { data, error } = await supabase
        .from("nrc_public_members")
        .select("id, display_name, slug, bio, photo_url, country, specialization, created_at")
        .order("display_name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PublicNRCMember[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicNRCMember(slug?: string) {
  return useQuery({
    queryKey: ["nrc-public-member", slug],
    queryFn: async (): Promise<PublicNRCMember | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("nrc_public_members")
        .select("id, display_name, slug, bio, photo_url, country, specialization, created_at")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as PublicNRCMember | null) ?? null;
    },
    enabled: !!slug,
  });
}
