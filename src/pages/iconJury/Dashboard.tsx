import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSummaryStrip } from "@/features/iconJudges/DashboardSummaryStrip";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, AlertTriangle, FileEdit, Trophy } from "lucide-react";

interface Stats {
  assigned: number;
  completed: number;
  pending: number;
  conflicts: number;
  notes: number;
}

export default function IconJuryDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState<string>("");
  const [stats, setStats] = useState<Stats>({ assigned: 0, completed: 0, pending: 0, conflicts: 0, notes: 0 });
  const [deadline, setDeadline] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: judge } = await supabase
        .from("icon_judges").select("id, full_name").eq("user_id", user.id).maybeSingle();
      if (judge?.full_name) setName(judge.full_name);
      if (!judge?.id) return;

      const [asg, rev, coi, notes, dl] = await Promise.all([
        supabase.from("icon_judge_assignments").select("*", { count: "exact", head: true }).eq("judge_id", judge.id),
        supabase.from("icon_judge_reviews").select("*", { count: "exact", head: true }).eq("judge_id", judge.id).in("status", ["submitted", "locked"]),
        supabase.from("icon_judge_conflicts").select("*", { count: "exact", head: true }).eq("judge_id", judge.id),
        supabase.from("icon_judge_notes").select("*", { count: "exact", head: true }).eq("judge_id", judge.id),
        supabase.from("icon_judge_assignments").select("deadline").eq("judge_id", judge.id).not("deadline", "is", null).order("deadline", { ascending: true }).limit(1).maybeSingle(),
      ]);
      const assigned = asg.count ?? 0;
      const completed = rev.count ?? 0;
      setStats({
        assigned, completed,
        pending: Math.max(assigned - completed, 0),
        conflicts: coi.count ?? 0,
        notes: notes.count ?? 0,
      });
      setDeadline(dl.data?.deadline ?? null);
    })();
  }, [user]);

  const cards = [
    { label: "Assigned", value: stats.assigned },
    { label: "Completed", value: stats.completed },
    { label: "Pending", value: stats.pending },
    { label: "Conflicts", value: stats.conflicts },
    { label: "Notes", value: stats.notes },
    { label: "Final deadline", value: deadline ? new Date(deadline).toLocaleDateString() : "—" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gold/80">Africa Education Icon Judges</p>
        <h1 className="text-2xl md:text-3xl font-semibold mt-1">
          Welcome{name ? `, ${name}` : ""}
        </h1>
        <p className="text-white/60 text-sm max-w-3xl mt-2">
          Review your assigned Africa Education Icon nominees, record evidence-based scores, submit
          confidential notes, and complete your jury responsibilities.
        </p>
      </div>

      <DashboardSummaryStrip />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-white/10 bg-black/30 p-4">
            <p className="text-xs text-white/50">{c.label}</p>
            <p className="text-xl font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link to="/judges/assignments"><Action icon={<ClipboardList className="h-4 w-4" />}>Continue Reviewing</Action></Link>
        <Link to="/judges/assignments"><Action icon={<ArrowRight className="h-4 w-4" />}>View Assignments</Action></Link>
        <Link to="/judges/conflicts"><Action icon={<AlertTriangle className="h-4 w-4" />}>Declare a Conflict</Action></Link>
        <Link to="/judges/scoring"><Action icon={<FileEdit className="h-4 w-4" />}>Scoring Guide</Action></Link>
      </div>

      <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-black/50 to-charcoal p-6">
        <div className="flex items-start gap-3">
          <Trophy className="h-6 w-6 text-gold mt-1" />
          <div>
            <h2 className="text-lg font-semibold">3 Pathways · 3 Classifications · 9 Laureates</h2>
            <p className="text-white/60 text-sm mt-1 max-w-3xl">
              The Africa Education Icon Award is the highest lifetime recognition within NESA-Africa.
              Twenty-seven independent judges review more than 500 nominees across three pathways and
              three classifications to recommend nine laureates. Final recognition is subject to NRC
              verification, jury deliberation, conflict-of-interest controls, and governance approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Action({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Button variant="outline" className="w-full justify-start border-gold/30 bg-black/30 text-white hover:bg-gold/10 hover:text-gold">
      {icon}<span className="ml-2">{children}</span>
    </Button>
  );
}
