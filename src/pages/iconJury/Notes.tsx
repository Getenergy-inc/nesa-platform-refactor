import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface Row { id: string; nominee_id: string; body: string; note_type: string; created_at: string; nominee_name?: string; }

export default function IconJuryNotes() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: judge } = await supabase.from("icon_judges").select("id").eq("user_id", user.id).maybeSingle();
      if (!judge?.id) { setLoading(false); return; }
      const { data } = await supabase.from("icon_judge_notes")
        .select("id, nominee_id, body, note_type, created_at")
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
        <h1 className="text-2xl font-semibold">My Confidential Notes</h1>
        <p className="text-white/60 text-sm mt-1">Notes captured during review. Visible only to you and moderators.</p>
      </div>
      {loading ? (
        <div className="py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gold" /></div>
      ) : rows.length === 0 ? (
        <div className="py-16 text-center text-white/50 border border-white/10 rounded-xl">No notes yet.</div>
      ) : rows.map(r => (
        <div key={r.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="flex justify-between text-xs text-white/50 mb-2">
            <span>{r.nominee_name}</span>
            <span>{r.note_type} · {new Date(r.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-white/80 whitespace-pre-wrap">{r.body}</p>
        </div>
      ))}
    </div>
  );
}
