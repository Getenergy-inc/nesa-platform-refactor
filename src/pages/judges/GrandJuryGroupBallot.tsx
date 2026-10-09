import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Finalist {
  id: string;
  nominee_id: string;
  seed_rank: number;
  nominee: { id: string; name: string; country: string | null; image_url: string | null };
}

export default function GrandJuryGroupBallot() {
  const { groupId } = useParams<{ groupId: string }>();
  const nav = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [finalists, setFinalists] = useState<Finalist[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<Record<number, string>>({});
  const [existing, setExisting] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      setLoading(true);
      const [{ data: g }, { data: fs }, { data: mine }] = await Promise.all([
        supabase.from("icon_grand_jury_groups").select("*").eq("id", groupId).maybeSingle(),
        supabase.from("icon_grand_jury_finalists")
          .select("id, nominee_id, seed_rank, nominee:nominees(id, name, country, image_url)")
          .eq("group_id", groupId).order("seed_rank"),
        supabase.from("icon_grand_jury_ballots")
          .select("*").eq("group_id", groupId).maybeSingle(),
      ]);
      setGroup(g);
      setFinalists((fs ?? []) as any);
      setExisting(mine);
      setLoading(false);
    })();
  }, [groupId]);

  const selectedIds = Object.values(rankings);
  const allRanked = [1, 2, 3].every((r) => rankings[r]) &&
    new Set(selectedIds).size === 3;

  const setRank = (rank: number, nomineeId: string) => {
    setRankings((prev) => {
      const next = { ...prev };
      // Remove nominee from any other rank
      Object.entries(next).forEach(([k, v]) => {
        if (v === nomineeId && Number(k) !== rank) delete next[Number(k)];
      });
      next[rank] = nomineeId;
      return next;
    });
  };

  const submit = async () => {
    if (!allRanked || !groupId) return;
    setSubmitting(true);
    const { data, error } = await supabase.rpc("submit_icon_grand_jury_ballot", {
      p_group_id: groupId,
      p_first: rankings[1],
      p_second: rankings[2],
      p_third: rankings[3],
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Ballot could not be submitted", description: error.message, variant: "destructive" });
      return;
    }
    const receipt = (data as any)?.[0]?.receipt ?? "";
    toast({ title: "Ballot locked", description: `Receipt: ${receipt.slice(0, 12)}…` });
    setConfirmOpen(false);
    nav("/judges/voting");
  };

  if (loading) return <div className="p-16 text-center text-white/60"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  if (!group) return <div className="p-8 text-white">Group not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Link to="/judges/voting" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All groups
      </Link>

      <header className="rounded-xl border border-white/10 bg-[#08122b]/70 p-6">
        <p className="text-xs uppercase tracking-widest text-[#c9a24a]">Grand Jury Group</p>
        <h1 className="mt-1 font-serif text-2xl text-white">{group.title}</h1>
        <p className="mt-2 text-xs text-white/50">
          Voting closes 7 October 2026 · one ballot per judge · ranked choice (3-2-1)
        </p>
      </header>

      {existing ? (
        <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/5 p-6">
          <div className="flex items-center gap-2 text-emerald-300">
            <Lock className="h-4 w-4" /> Your ballot is locked
          </div>
          <p className="mt-2 text-sm text-white/70">
            Submitted {new Date(existing.submitted_at).toLocaleString()}. Receipt{" "}
            <span className="font-mono text-xs text-white/60">{existing.receipt_hash.slice(0, 24)}…</span>
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {finalists.map((f) => (
              <FinalistCard
                key={f.id}
                finalist={f}
                rankings={rankings}
                onSelect={setRank}
              />
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-white/70 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#c9a24a]" />
              Assign 1st, 2nd and 3rd to each finalist. All three ranks required.
            </div>
            <Button disabled={!allRanked} onClick={() => setConfirmOpen(true)}
              className="bg-[#c9a24a] text-[#050b1a] hover:bg-[#e0b96b] disabled:opacity-40">
              Review & Submit Ballot
            </Button>
          </div>
        </>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-[#08122b] border-white/15 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#c9a24a]">Confirm your ballot</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-white/70">
              Once submitted, your ballot is locked and cannot be edited. A cryptographic
              receipt will be issued for your records.
            </p>
            <ol className="mt-4 space-y-2">
              {[1, 2, 3].map((r) => {
                const nid = rankings[r];
                const f = finalists.find((x) => x.nominee_id === nid);
                return (
                  <li key={r} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#c9a24a] text-[#050b1a] text-xs font-bold flex items-center justify-center">{r}</span>
                    <span className="font-medium">{f?.nominee.name ?? "—"}</span>
                    <span className="text-white/50 text-xs ml-auto">{f?.nominee.country ?? ""}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}
              className="border-white/20 text-white/80">Cancel</Button>
            <Button onClick={submit} disabled={submitting}
              className="bg-[#c9a24a] text-[#050b1a] hover:bg-[#e0b96b]">
              {submitting ? "Submitting…" : "Confirm & Lock Ballot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FinalistCard({
  finalist, rankings, onSelect,
}: {
  finalist: Finalist;
  rankings: Record<number, string>;
  onSelect: (rank: number, nomineeId: string) => void;
}) {
  const myRank = Object.entries(rankings).find(([, v]) => v === finalist.nominee_id)?.[0];
  return (
    <div className={`rounded-xl border p-4 bg-[#08122b]/70 transition ${
      myRank ? "border-[#c9a24a]/60" : "border-white/10"
    }`}>
      <div className="aspect-[4/3] rounded-lg bg-white/5 overflow-hidden mb-3">
        {finalist.nominee.image_url ? (
          <img src={finalist.nominee.image_url} alt={finalist.nominee.name}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-3xl font-serif">
            {finalist.nominee.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="font-medium text-white leading-tight">{finalist.nominee.name}</p>
      <p className="text-xs text-white/50 mt-0.5">{finalist.nominee.country ?? ""}</p>
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((r) => {
          const active = Number(myRank) === r;
          return (
            <button
              key={r}
              onClick={() => onSelect(r, finalist.nominee_id)}
              className={`rounded-md px-2 py-2 text-xs font-medium border transition ${
                active
                  ? "bg-[#c9a24a] text-[#050b1a] border-[#c9a24a]"
                  : "bg-white/[0.04] text-white/70 border-white/10 hover:border-white/30"
              }`}
              aria-label={`Set ${finalist.nominee.name} as choice ${r}`}
            >
              {r === 1 ? "1st" : r === 2 ? "2nd" : "3rd"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
