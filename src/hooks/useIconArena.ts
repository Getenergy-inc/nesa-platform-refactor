import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Shared data access for the Africa Education Icon Judges Arena. */

export interface IconPanel {
  id: string;
  title: string;
  status: string | null;
  pathway_id: string;
  classification_id: string;
  chair_judge_id: string | null;
  secretary_judge_id: string | null;
}

export interface IconTaxonomy {
  pathways: { id: string; slug: string; name: string; description: string | null; sort_order: number | null }[];
  classifications: { id: string; slug: string; name: string; description: string | null; sort_order: number | null }[];
}

export const panelSlug = (pathwaySlug: string, classificationSlug: string) =>
  `${pathwaySlug}--${classificationSlug}`;

export function useIconTaxonomy() {
  return useQuery<IconTaxonomy>({
    queryKey: ["icon-arena", "taxonomy"],
    queryFn: async () => {
      const [{ data: pathways }, { data: classifications }] = await Promise.all([
        supabase.from("icon_pathways").select("id,slug,name,description,sort_order").order("sort_order"),
        supabase.from("icon_classifications").select("id,slug,name,description,sort_order").order("sort_order"),
      ]);
      return { pathways: pathways ?? [], classifications: classifications ?? [] };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useIconPanels() {
  return useQuery<IconPanel[]>({
    queryKey: ["icon-arena", "panels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("icon_judge_panels")
        .select("id,title,status,pathway_id,classification_id,chair_judge_id,secretary_judge_id");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyIconJudge() {
  return useQuery({
    queryKey: ["icon-arena", "me"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data } = await supabase
        .from("icon_judges")
        .select("id, full_name, email, status, active, region, country, expertise")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      return data ?? null;
    },
  });
}

export function useMyPanelIds() {
  const me = useMyIconJudge();
  return useQuery({
    queryKey: ["icon-arena", "my-panels", me.data?.id],
    enabled: !!me.data?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("icon_judge_panel_members")
        .select("panel_id, role")
        .eq("judge_id", me.data!.id);
      return data ?? [];
    },
  });
}

export function useGrandJuryGroups() {
  return useQuery({
    queryKey: ["icon-arena", "gj-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("icon_grand_jury_groups")
        .select(
          "id,panel_id,pathway_id,classification_id,title,voting_status,voting_opens_at,voting_closes_at,ballots_locked_at,results_locked_at",
        )
        .order("title");
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Judge directory — visible to authenticated judges only (enforced by RLS). */
export function useJudgeDirectory() {
  return useQuery({
    queryKey: ["icon-arena", "directory"],
    queryFn: async () => {
      const { data: judges } = await supabase
        .from("icon_judges")
        .select("id, full_name, status, active, region, country, expertise")
        .order("full_name");
      const { data: profiles } = await supabase
        .from("icon_judge_profiles")
        .select("judge_id, title, institution, bio, photo_url, affiliation");
      const { data: members } = await supabase
        .from("icon_judge_panel_members")
        .select("judge_id, panel_id, role");
      const pMap = new Map((profiles ?? []).map((p: any) => [p.judge_id, p]));
      const seatMap = new Map<string, { panel_id: string; role: string }[]>();
      (members ?? []).forEach((m: any) => {
        seatMap.set(m.judge_id, [...(seatMap.get(m.judge_id) ?? []), m]);
      });
      return (judges ?? []).map((j: any) => ({
        ...j,
        profile: pMap.get(j.id) ?? null,
        seats: seatMap.get(j.id) ?? [],
      }));
    },
  });
}

export function useNomineeNames(ids: string[]) {
  const key = [...new Set(ids)].sort().join(",");
  return useQuery({
    queryKey: ["icon-arena", "nominee-names", key],
    enabled: ids.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("nominees")
        .select("id, name, country, photo_url")
        .in("id", [...new Set(ids)]);
      return new Map((data ?? []).map((n: any) => [n.id, n]));
    },
  });
}
