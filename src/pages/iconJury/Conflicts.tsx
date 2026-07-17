import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Row {
  id: string;
  nominee_id: string;
  conflict_type: string;
  severity: string;
  description: string | null;
  resolved_at: string | null;
  created_at: string;
  nominee_name?: string;
}

export default function IconJuryConflicts() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: judge } = await supabase.from("icon_judges").select("id").eq("user_id", user.id).maybeSingle();
      if (!judge?.id) { setLoading(false); return; }
      const { data } = await supabase.from("icon_judge_conflicts")
        .select("id, nominee_id, conflict_type, severity, description, resolved_at, created_at")
        .eq("judge_id", judge.id).order("created_at", { ascending: false });
      const list = data ?? [];
      const { data: noms } = list.length
        ? await supabase.from("nominees").select("id,name").in("id", list.map(r => r.nominee_id))
        : { data: [] as any[] };
      const map = new Map((noms ?? []).map((n:any) => [n.id, n.name]));
      setRows(list.map(r => ({ ...r, nominee_name: map.get(r.nominee_id) ?? "—" })));
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-5">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gold/80">Icon Jury</p>
        <h1 className="text-2xl font-semibold">Declared Conflicts</h1>
        <p className="text-white/60 text-sm mt-1 max-w-2xl">
          Any personal, professional, financial, political, institutional, family, or prior collaboration
          relationship with a nominee must be declared before scoring. Declaration triggers automatic
          reallocation to another judge.
        </p>
      </div>
      {loading ? (
        <div className="py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gold" /></div>
      ) : rows.length === 0 ? (
        <div className="py-16 text-center text-white/50 border border-white/10 rounded-xl">No conflicts declared.</div>
      ) : (
        <div className="space-y-3">
          {rows.map(r => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium">{r.nominee_name}</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString()} · {r.conflict_type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-gold/30 text-gold">{r.severity}</Badge>
                  <Badge variant="outline" className={r.resolved_at ? "border-white/20 text-white/60" : "border-yellow-500/40 text-yellow-400"}>
                    {r.resolved_at ? "resolved" : "open"}
                  </Badge>
                </div>
              </div>
              {r.description && <p className="text-sm text-white/70 mt-2">{r.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
