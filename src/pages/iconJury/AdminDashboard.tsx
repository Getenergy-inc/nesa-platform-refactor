import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { DashboardSummaryStrip } from "@/features/iconJudges/DashboardSummaryStrip";
import { Loader2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface JudgeStat { id: string; full_name: string; email: string; status: string; region: string | null; }

export default function IconJuryAdminDashboard() {
  const [judges, setJudges] = useState<JudgeStat[]>([]);
  const [pending, setPending] = useState({ conflicts: 0, reviewsInProgress: 0, snapshots: 0 });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [{ data: js }, { count: conflicts }, { count: reviewsInProgress }, { count: snapshots }] = await Promise.all([
      supabase.from("icon_judges").select("id, full_name, email, status, region").order("full_name"),
      supabase.from("icon_judge_conflicts").select("*", { count: "exact", head: true }).is("resolved_at", null),
      supabase.from("icon_judge_reviews").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
      supabase.from("icon_jury_result_snapshots").select("*", { count: "exact", head: true }),
    ]);
    setJudges((js ?? []) as any);
    setPending({
      conflicts: conflicts ?? 0,
      reviewsInProgress: reviewsInProgress ?? 0,
      snapshots: snapshots ?? 0,
    });
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const computeResults = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("compute_icon_results");
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Results snapshot computed.");
    load();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <Helmet><title>Icon Jury Moderation · Admin</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="flex flex-wrap justify-between gap-4 items-end">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gold/80">Africa Education Icon</p>
          <h1 className="text-2xl md:text-3xl font-semibold">Jury Moderation Console</h1>
          <p className="text-white/60 text-sm max-w-2xl mt-1">
            Governance-only view. Manage judges, monitor progress, and compute laureate snapshots.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <Link to="/admin/icon-jury/audit"><ShieldCheck className="h-4 w-4 mr-2" /> Audit Trail</Link>
          </Button>
          <Button onClick={computeResults} disabled={busy} className="bg-gold text-black hover:bg-gold/90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Compute Results Snapshot"}
          </Button>
        </div>
      </div>

      <DashboardSummaryStrip />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Open conflicts" value={pending.conflicts} />
        <Stat label="Reviews in progress" value={pending.reviewsInProgress} />
        <Stat label="Result snapshots" value={pending.snapshots} />
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-white/60">
            <tr><th className="px-4 py-2 text-left">Judge</th><th className="px-4 py-2 text-left">Email</th><th className="px-4 py-2 text-left">Region</th><th className="px-4 py-2 text-left">Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-white/50"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></td></tr>
            ) : judges.map(j => (
              <tr key={j.id} className="border-t border-white/5">
                <td className="px-4 py-2.5 font-medium">{j.full_name}</td>
                <td className="px-4 py-2.5 text-white/60">{j.email}</td>
                <td className="px-4 py-2.5 text-white/60">{j.region ?? "—"}</td>
                <td className="px-4 py-2.5"><span className="text-gold text-xs">{j.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-black/40 px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-gold/70">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
