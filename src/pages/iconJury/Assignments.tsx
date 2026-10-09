import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

interface Row {
  id: string;
  nominee_id: string;
  status: string;
  deadline: string | null;
  pathway_name?: string;
  classification_name?: string;
  nominee_name?: string;
}

export default function IconJuryAssignments() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all"|"pending"|"in_review"|"submitted">("all");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: judge } = await supabase.from("icon_judges").select("id").eq("user_id", user.id).maybeSingle();
      if (!judge?.id) { setLoading(false); return; }
      const { data } = await supabase
        .from("icon_judge_assignments")
        .select("id, nominee_id, status, deadline, pathway_id, classification_id")
        .eq("judge_id", judge.id);
      const list = data ?? [];
      const [{ data: paths }, { data: classes }, { data: nominees }] = await Promise.all([
        supabase.from("icon_pathways").select("id,name"),
        supabase.from("icon_classifications").select("id,name"),
        list.length
          ? supabase.from("nominees").select("id,name").in("id", list.map(l => l.nominee_id))
          : Promise.resolve({ data: [] as any[] } as any),
      ]);
      const pMap = new Map((paths ?? []).map((p:any) => [p.id, p.name]));
      const cMap = new Map((classes ?? []).map((c:any) => [c.id, c.name]));
      const nMap = new Map((nominees ?? []).map((n:any) => [n.id, n.name]));
      setRows(list.map((r:any) => ({
        ...r,
        pathway_name: pMap.get(r.pathway_id),
        classification_name: cMap.get(r.classification_id),
        nominee_name: nMap.get(r.nominee_id) ?? "—",
      })));
      setLoading(false);
    })();
  }, [user]);

  const filtered = useMemo(() => rows.filter(r => {
    if (filter !== "all" && r.status !== filter) return false;
    if (q && !(`${r.nominee_name} ${r.pathway_name} ${r.classification_name}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [rows, q, filter]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gold/80">Icon Jury</p>
        <h1 className="text-2xl font-semibold">My Assignments</h1>
        <p className="text-white/60 text-sm mt-1">
          Nominees allocated to you for confidential Icon Award review.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search nominee, pathway, classification" className="pl-9" />
        </div>
        <div className="flex gap-2">
          {(["all","pending","in_review","submitted"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border ${filter===f ? "bg-gold text-black border-gold" : "border-white/15 text-white/70 hover:border-gold/40"}`}
            >{f.replace("_"," ")}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-white/60"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-white/50 border border-white/10 rounded-xl">
          No assignments match your filters.
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/40 text-white/60">
              <tr>
                <th className="text-left px-4 py-2">Nominee</th>
                <th className="text-left px-4 py-2 hidden md:table-cell">Pathway</th>
                <th className="text-left px-4 py-2 hidden md:table-cell">Classification</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2 hidden sm:table-cell">Deadline</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{r.nominee_name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-white/70">{r.pathway_name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-white/70">{r.classification_name}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className="border-gold/30 text-gold">{r.status}</Badge></td>
                  <td className="px-4 py-3 hidden sm:table-cell text-white/60">
                    {r.deadline ? new Date(r.deadline).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/icon-jury/nominees/${r.nominee_id}`} className="text-gold hover:underline text-xs">
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
