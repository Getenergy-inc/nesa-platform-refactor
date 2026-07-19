import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface GroupRow {
  id: string;
  title: string;
  voting_status: string;
  ballot_count: number;
  results_computed: boolean;
  has_tie: boolean;
  laureate_name: string | null;
}

export default function GovernanceReviewDashboard() {
  const [rows, setRows] = useState<GroupRow[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const { data: groups } = await supabase
      .from("icon_grand_jury_groups").select("id, title, voting_status").order("title");
    const { data: ballots } = await supabase
      .from("icon_grand_jury_ballots").select("group_id");
    const { data: results } = await supabase
      .from("icon_grand_jury_results")
      .select("group_id, tie_flag, is_laureate, nominee:nominees(name)");

    const counts = new Map<string, number>();
    (ballots ?? []).forEach((b: any) => counts.set(b.group_id, (counts.get(b.group_id) ?? 0) + 1));
    const byGroup = new Map<string, any[]>();
    (results ?? []).forEach((r: any) => {
      const arr = byGroup.get(r.group_id) ?? []; arr.push(r); byGroup.set(r.group_id, arr);
    });

    setRows((groups ?? []).map((g: any) => {
      const rs = byGroup.get(g.id) ?? [];
      const laureate = rs.find((r) => r.is_laureate);
      return {
        id: g.id,
        title: g.title,
        voting_status: g.voting_status,
        ballot_count: counts.get(g.id) ?? 0,
        results_computed: rs.length > 0,
        has_tie: rs.some((r) => r.tie_flag),
        laureate_name: laureate?.nominee?.name ?? null,
      };
    }));
  };

  useEffect(() => { load(); }, []);

  const compute = async (groupId: string) => {
    setBusy(groupId);
    const { error } = await supabase.rpc("compute_icon_grand_jury_results", { p_group_id: groupId });
    setBusy(null);
    if (error) toast({ title: "Compute failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Results computed" }); load(); }
  };

  const decide = async (groupId: string, decision: "approve" | "hold" | "reopen") => {
    const notes = window.prompt(`Notes for governance decision (${decision})?`) ?? "";
    setBusy(groupId);
    const { error } = await supabase.rpc("icon_governance_decide", {
      p_group_id: groupId, p_decision: decision, p_notes: notes,
    });
    setBusy(null);
    if (error) toast({ title: "Decision failed", description: error.message, variant: "destructive" });
    else { toast({ title: `Group ${decision}d` }); load(); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-[#c9a24a]">Governance Review</p>
        <h1 className="mt-1 font-serif text-3xl text-white">Icon Grand Jury Governance</h1>
        <p className="mt-2 text-sm text-white/60 max-w-2xl">
          Verify ballot completion, compute ranked-choice results, and approve, hold,
          or reopen each finalist group. All actions are recorded in the audit log.
        </p>
      </header>

      {rows === null ? (
        <div className="p-16 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-white/50" /></div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
          No grand jury groups configured yet.
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#08122b]/70 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-white/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Group</th>
                <th className="px-4 py-3 text-left">Ballots</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Laureate</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white/90">{r.title}</td>
                  <td className="px-4 py-3 text-white/70">{r.ballot_count} / 27</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border ${
                      r.voting_status === "approved" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
                      r.voting_status === "held"     ? "bg-amber-500/15 text-amber-300 border-amber-500/30" :
                      r.voting_status === "closed"   ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" :
                      "bg-white/5 text-white/60 border-white/15"
                    }`}>
                      {r.voting_status}
                    </span>
                    {r.has_tie && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-300">
                        <AlertTriangle className="h-3 w-3" /> Tie
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {r.laureate_name ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#c9a24a]" />
                        {r.laureate_name}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" disabled={busy === r.id}
                        onClick={() => compute(r.id)}
                        className="border-white/20 text-white/80">Compute</Button>
                      <Button size="sm" disabled={busy === r.id || !r.results_computed}
                        onClick={() => decide(r.id, "approve")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white">Approve</Button>
                      <Button size="sm" variant="outline" disabled={busy === r.id}
                        onClick={() => decide(r.id, "hold")}
                        className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10">Hold</Button>
                      <Button size="sm" variant="outline" disabled={busy === r.id}
                        onClick={() => decide(r.id, "reopen")}
                        className="border-white/20 text-white/70">Reopen</Button>
                    </div>
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
