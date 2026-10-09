import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentIconPhase } from "@/config/iconAward/calendar";
import { Loader2, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupRow {
  id: string;
  title: string;
  voting_status: string;
  has_ballot: boolean;
  finalist_count: number;
}

export default function GrandJuryVotingHub() {
  const phase = getCurrentIconPhase();
  const [rows, setRows] = useState<GroupRow[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: groups } = await supabase
        .from("icon_grand_jury_groups")
        .select("id, title, voting_status")
        .order("title");
      const { data: myBallots } = await supabase
        .from("icon_grand_jury_ballots")
        .select("group_id");
      const { data: finalists } = await supabase
        .from("icon_grand_jury_finalists")
        .select("group_id");

      const ballotSet = new Set((myBallots ?? []).map((b: any) => b.group_id));
      const countMap = new Map<string, number>();
      (finalists ?? []).forEach((f: any) =>
        countMap.set(f.group_id, (countMap.get(f.group_id) ?? 0) + 1));

      setRows((groups ?? []).map((g: any) => ({
        id: g.id, title: g.title, voting_status: g.voting_status,
        has_ballot: ballotSet.has(g.id),
        finalist_count: countMap.get(g.id) ?? 0,
      })));
    })();
  }, []);

  const completed = useMemo(() =>
    (rows ?? []).filter((r) => r.has_ballot).length, [rows]);
  const total = rows?.length ?? 9;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-[#c9a24a]">Grand Jury Deliberation Arena</p>
        <h1 className="mt-2 font-serif text-3xl text-white">
          2026 Africa Education Icon Grand Jury
        </h1>
        <p className="mt-2 text-sm text-white/60 max-w-2xl">
          Rank all three finalists in every one of the nine groups. Ballots lock on
          submission and each carries a cryptographic receipt.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Groups" value="9" />
        <Stat label="Your ballots" value={`${completed} / ${total}`} />
        <Stat label="Phase" value={phase.label} />
        <Stat label="Closes" value="7 Oct 2026" />
      </div>

      {rows === null ? (
        <div className="p-16 text-center text-white/60"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
          Finalist groups will appear here once specialist panels submit their shortlists.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id}
              className="rounded-xl border border-white/10 bg-[#08122b]/70 p-5 hover:border-[#c9a24a]/40 transition">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-medium text-white leading-tight">{r.title}</h2>
                {r.has_ballot ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Submitted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-300">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-white/50">
                {r.finalist_count} finalists · status: {r.voting_status}
              </p>
              <Button asChild size="sm" className="mt-4 w-full bg-[#c9a24a] text-[#050b1a] hover:bg-[#e0b96b]">
                <Link to={`/judges/voting/${r.id}`}>
                  {r.has_ballot ? "Review Receipt" : "Open Ballot"} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
      <p className="mt-1 text-lg font-medium text-white">{value}</p>
    </div>
  );
}
