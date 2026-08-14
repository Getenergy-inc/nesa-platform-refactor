import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbNomineeProfile {
  id: string;
  name: string;
  slug: string | null;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  country: string | null;
  region: string | null;
  website: string | null;
  linkedin_url: string | null;
  work_done: string | null;
  evidence_urls: string[] | null;
  video_url: string | null;
  youtube_video_id: string | null;
  nrc_verified: boolean | null;
  award_slug: string | null;
  category_slug: string | null;
  classification_slug: string | null;
}

export interface SupportMessage {
  id: string;
  nominee_id: string;
  author_name: string;
  author_organization: string | null;
  message: string;
  created_at: string;
}

/** Reads a published nominee record by slug from the public directory view. */
export function useNomineeProfile(slug?: string) {
  const [profile, setProfile] = useState<DbNomineeProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));

  useEffect(() => {
    let active = true;
    if (!slug) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("public_nominees")
      .select(
        "id,name,slug,title,organization,bio,photo_url,country,region,website,linkedin_url,work_done,evidence_urls,video_url,youtube_video_id,nrc_verified,award_slug,category_slug,classification_slug",
      )
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setProfile((data as unknown as DbNomineeProfile) ?? null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { profile, loading };
}

/** Approved (NRC-moderated) supporter messages for a nominee. No counters, no votes. */
export function useSupportMessages(nomineeId?: string) {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(Boolean(nomineeId));

  const load = useCallback(async () => {
    if (!nomineeId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("nominee_support_messages_public")
      .select("id,nominee_id,author_name,author_organization,message,created_at")
      .eq("nominee_id", nomineeId)
      .order("created_at", { ascending: false })
      .limit(50);
    setMessages((data as unknown as SupportMessage[]) ?? []);
    setLoading(false);
  }, [nomineeId]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = useCallback(
    async (input: {
      author_name: string;
      author_email?: string;
      author_organization?: string;
      message: string;
    }) => {
      if (!nomineeId) throw new Error("This profile is not yet open for messages.");
      const { error } = await supabase.from("nominee_support_messages").insert({
        nominee_id: nomineeId,
        status: "pending",
        ...input,
      });
      if (error) throw error;
    },
    [nomineeId],
  );

  return { messages, loading, submit, reload: load };
}
