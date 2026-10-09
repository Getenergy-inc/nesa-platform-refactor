import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trophy } from "lucide-react";

interface Pos {
  id: string;
  pathway_id: string;
  classification_id: string;
  nominee_id: string;
  average_score: number | null;
  status: string;
  nominee_name?: string;
  pathway_name?: string;
  classification_name?: string;
}

export default function IconJuryResults() {
  const [rows, setRows] = useState<Pos[]>([]);
  const [loading, setLoading] = useState(true);
  const [snapshotAt, setSnapshotAt] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: snap } = await supabase.from("icon_jury_result_snapshots")
        .select("id, computed_at").order("computed_at", { ascending: false }).limit(1).maybeSingle();
      if (!snap) { setLoading(false); return; }
      setSnapshotAt(snap.computed_at);
      const { data } = await supabase.from("icon_jury_result_positions")
        .select("id, pathway_id, classification_id, nominee_id, average_score, status")
        .eq("snapshot_id", snap.id);
      const list = data ?? [];
      const [{ data: paths }, { data: classes }, { data: noms }] = await Promise.all([
        supabase.from("icon_pathways").select("id,name,sort_order"),
        supabase.from("icon_classifications").select("id,name,sort_order"),
        list.length ? supabase.from("nominees").select("id,name").in("id", list.map(r => r.nominee_id)) : Promise.resolve({ data: [] as any[] } as any),
      ]);
      const pMap = new Map((paths ?? []).map((p:any) => [p.id, p]));
      const cMap = new Map((classes ?? []).map((c:any) => [c.id, c]));
      const nMap = new Map((noms ?? []).map((n:any) => [n.id, n.name]));
      const enriched = list.map((r:any) => ({
        ...r,
        nominee_name: nMap.get(r.nominee_id) ?? "—",
        pathway_name: pMap.get(r.pathway_id)?.name,
        classification_name: cMap.get(r.classification_id)?.name,
      }));
      enriched.sort((a,b) => (pMap.get(a.pathway_id)?.sort_order ?? 0) - (pMap.get(b.pathway_id)?.sort_order ?? 0)
        || (cMap.get(a.classification_id)?.sort_order ?? 0) - (cMap.get(b.classification_id)?.sort_order ?? 0));
      setRows(enriched);
      setLoading(false);
    })();
  }, []);

  const pathways = Array.from(new Set(rows.map(r => r.pathway_name!)));
  const classes = Array.from(new Set(rows.map(r => r.classification_name!)));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-gold" />
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gold/80">Icon Jury</p>
          <h1 className="text-2xl font-semibold">9-Position Laureate Matrix</h1>
          <p className="text-white/60 text-sm">3 pathways × 3 classifications · Confidential jury outcome</p>
        </div>
      </div>
      {loading ? (
        <div className="py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gold" /></div>
      ) : rows.length === 0 ? (
        <div className="py-16 text-center text-white/50 border border-white/10 rounded-xl">
          No result snapshot yet. Results appear after moderation computes the jury outcome.
        </div>
      ) : (
        <>
          <p className="text-xs text-white/40">Snapshot: {snapshotAt ? new Date(snapshotAt).toLocaleString() : "—"}</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-xl border border-gold/20 overflow-hidden">
              <thead className="bg-black/50 text-white/70">
                <tr>
                  <th className="px-3 py-2 text-left">Pathway \ Classification</th>
                  {classes.map(c => <th key={c} className="px-3 py-2 text-left">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {pathways.map(p => (
                  <tr key={p} className="border-t border-white/5">
                    <td className="px-3 py-3 font-medium text-gold">{p}</td>
                    {classes.map(c => {
                      const cell = rows.find(r => r.pathway_name === p && r.classification_name === c);
                      return (
                        <td key={c} className="px-3 py-3 align-top">
                          {cell ? (
                            <div>
                              <p className="font-medium">{cell.nominee_name}</p>
                              <p className="text-xs text-white/50">
                                {cell.average_score?.toFixed(1) ?? "—"} · {cell.status}
                              </p>
                            </div>
                          ) : <span className="text-white/30">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
