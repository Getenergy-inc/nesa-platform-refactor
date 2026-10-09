import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Search, ShieldCheck } from "lucide-react";
import { useJudgeDirectory, useIconPanels, useIconTaxonomy } from "@/hooks/useIconArena";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

/**
 * /judges/roster — internal roster of appointed judges.
 * Contact details are deliberately not shown; RLS restricts this to judges.
 */
export default function IconJudgeRoster() {
  const directory = useJudgeDirectory();
  const panels = useIconPanels();
  const taxonomy = useIconTaxonomy();
  const [q, setQ] = useState("");

  const panelLabel = useMemo(() => {
    const pathways = new Map((taxonomy.data?.pathways ?? []).map((p) => [p.id, p.name]));
    const classes = new Map((taxonomy.data?.classifications ?? []).map((c) => [c.id, c.name]));
    return new Map(
      (panels.data ?? []).map((p) => [
        p.id,
        `${pathways.get(p.pathway_id) ?? "Pathway"} · ${classes.get(p.classification_id) ?? "Group"}`,
      ]),
    );
  }, [panels.data, taxonomy.data]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = directory.data ?? [];
    if (!term) return list;
    return list.filter((j: any) =>
      [j.full_name, j.country, j.region, j.profile?.institution, ...(j.expertise ?? [])]
        .filter(Boolean)
        .some((v: string) => v.toLowerCase().includes(term)),
    );
  }, [directory.data, q]);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Judge Roster — Judges Arena</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header>
        <p className="text-xs uppercase tracking-widest text-gold">Judges Arena</p>
        <h1 className="mt-2 font-serif text-3xl text-white">Judge roster</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/60">
          Twenty-seven volunteer judges seated across nine pathways. Contact details are withheld —
          all coordination runs through the governance secretariat.
        </p>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, country, institution or expertise"
          aria-label="Search the judge roster"
          className="pl-9 bg-black/30 border-white/15 text-white"
        />
      </div>

      {directory.isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-gold" aria-label="Loading roster" />
        </div>
      ) : rows.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/50">No judges match that search.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((j: any) => (
            <article key={j.id} className="rounded-xl border border-white/10 bg-arena-rail p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-11 w-11 border border-gold/30">
                  {j.profile?.photo_url && <AvatarImage src={j.profile.photo_url} alt="" />}
                  <AvatarFallback className="bg-black/40 text-gold text-xs">
                    {initials(j.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-white">{j.full_name}</h2>
                  <p className="truncate text-xs text-white/50">
                    {j.profile?.title || "Judge"}
                    {j.profile?.institution ? ` · ${j.profile.institution}` : ""}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {[j.country, j.region].filter(Boolean).join(" · ") || "Region pending"}
                  </p>
                </div>
              </div>

              {j.seats.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {j.seats.map((s: any) => (
                    <Badge key={s.panel_id} variant="outline" className="border-gold/30 text-[10px] text-gold">
                      {panelLabel.get(s.panel_id) ?? "Panel"}
                      {s.role && s.role !== "member" ? ` — ${s.role}` : ""}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/40">
                <ShieldCheck className="h-3 w-3" aria-hidden />
                {j.active ? "Active appointment" : "Appointment pending activation"}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
