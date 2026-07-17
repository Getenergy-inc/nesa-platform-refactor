import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ICON_RECOMMENDATIONS, ICON_CONFLICT_TYPES } from "@/config/iconAward/scoring";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, Loader2, Save } from "lucide-react";

interface Criterion { id: string; slug: string; name: string; weight: number; max_score: number; description?: string | null; }
interface Nominee { id: string; name: string; bio?: string | null; photo_url?: string | null; organization?: string | null; }

export default function IconJuryNomineeReview() {
  const { nomineeId = "" } = useParams();
  const { user } = useAuth();
  const [judgeId, setJudgeId] = useState<string | null>(null);
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("in_progress");
  const [scores, setScores] = useState<Record<string, { score: number; justification: string; evidence_ref: string }>>({});
  const [recommendation, setRecommendation] = useState<string>("");
  const [evidenceFlag, setEvidenceFlag] = useState<string>("adequate");
  const [conflictType, setConflictType] = useState<string>("");
  const [conflictSeverity, setConflictSeverity] = useState<string>("medium");
  const [conflictDesc, setConflictDesc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: judge } = await supabase.from("icon_judges").select("id").eq("user_id", user.id).maybeSingle();
      if (!judge?.id) { setLoading(false); return; }
      setJudgeId(judge.id);

      const [{ data: nom }, { data: crit }, { data: asg }] = await Promise.all([
        supabase.from("nominees").select("id, name, bio, photo_url, organization").eq("id", nomineeId).maybeSingle(),
        supabase.from("icon_scoring_criteria").select("id, slug, name, weight, max_score, description").eq("active", true).order("sort_order"),
        supabase.from("icon_judge_assignments").select("id").eq("judge_id", judge.id).eq("nominee_id", nomineeId).maybeSingle(),
      ]);
      setNominee(nom as any);
      setCriteria((crit ?? []) as Criterion[]);

      let reviewIdVal: string | null = null;
      if (asg?.id) {
        const { data: rev } = await supabase.rpc("icon_ensure_review", { p_assignment_id: asg.id });
        reviewIdVal = (typeof rev === "string" ? rev : (rev as any)?.review_id ?? (Array.isArray(rev) ? rev[0] : null)) ?? null;
      }
      setReviewId(reviewIdVal);

      if (reviewIdVal) {
        const [{ data: reviewRow }, { data: existingScores }] = await Promise.all([
          supabase.from("icon_judge_reviews").select("recommendation, evidence_quality_flag, status").eq("id", reviewIdVal).maybeSingle(),
          supabase.from("icon_judge_scores").select("criterion_id, score, justification, evidence_ref").eq("review_id", reviewIdVal),
        ]);
        if (reviewRow) {
          setRecommendation(reviewRow.recommendation ?? "");
          setEvidenceFlag(reviewRow.evidence_quality_flag ?? "adequate");
          setStatus(reviewRow.status ?? "in_progress");
        }
        const map: Record<string, any> = {};
        (existingScores ?? []).forEach((s: any) => {
          map[s.criterion_id] = { score: s.score, justification: s.justification ?? "", evidence_ref: s.evidence_ref ?? "" };
        });
        setScores(map);
      }
      setLoading(false);
    })();
  }, [user, nomineeId]);

  const weightedTotal = useMemo(() => {
    let total = 0;
    for (const c of criteria) {
      const s = scores[c.id]?.score ?? 0;
      total += (s / c.max_score) * c.weight;
    }
    return Math.round(total * 100) / 100;
  }, [criteria, scores]);

  const setScore = (cid: string, patch: Partial<{ score: number; justification: string; evidence_ref: string }>) =>
    setScores(prev => ({ ...prev, [cid]: { score: 0, justification: "", evidence_ref: "", ...prev[cid], ...patch } }));

  const saveDraft = async (submit = false) => {
    if (!reviewId || !judgeId) return;
    setBusy(true);
    const rows = criteria
      .filter(c => scores[c.id])
      .map(c => ({
        review_id: reviewId,
        criterion_id: c.id,
        score: scores[c.id].score,
        justification: scores[c.id].justification || null,
        evidence_ref: scores[c.id].evidence_ref || null,
      }));
    if (rows.length) {
      const { error } = await supabase
        .from("icon_judge_scores")
        .upsert(rows, { onConflict: "review_id,criterion_id" });
      if (error) { setBusy(false); toast.error(`Save failed: ${error.message}`); return; }
    }
    if (submit) {
      const { error } = await supabase.rpc("submit_icon_score", {
        p_review_id: reviewId,
        p_recommendation: recommendation,
        p_evidence_flag: evidenceFlag,
      });
      if (error) { setBusy(false); toast.error(error.message); return; }
      setStatus("submitted");
    } else {
      await supabase.from("icon_judge_reviews").update({
        recommendation: recommendation || null,
        evidence_quality_flag: evidenceFlag,
        total_score: weightedTotal,
      }).eq("id", reviewId);
    }
    await supabase.from("icon_jury_audit_logs").insert({
      actor_user_id: user!.id, action: submit ? "icon_review_submitted" : "icon_review_saved",
      entity_type: "review", entity_id: reviewId, metadata: { nominee_id: nomineeId, total: weightedTotal },
    });
    setBusy(false);
    toast.success(submit ? "Review submitted" : "Draft saved");
  };

  const declareConflict = async () => {
    if (!judgeId || !conflictType) return;
    setBusy(true);
    const { error } = await supabase.rpc("declare_icon_conflict", {
      p_nominee_id: nomineeId,
      p_conflict_type: conflictType,
      p_severity: conflictSeverity,
      p_description: conflictDesc,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Conflict declared. Assignment will be reallocated.");
    setConflictType(""); setConflictDesc("");
  };

  if (loading) {
    return <div className="p-12 text-center text-white/60"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;
  }
  if (!nominee) {
    return <div className="p-12 text-center text-white/60">Nominee not found or not in your assignment set.</div>;
  }
  const locked = status === "submitted" || status === "locked";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <Link to="/icon-jury/assignments" className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to assignments
      </Link>

      <div className="rounded-xl border border-gold/20 bg-black/40 p-6 flex flex-col md:flex-row gap-6">
        {nominee.photo_url && (
          <img src={nominee.photo_url} alt={nominee.name} className="w-32 h-32 rounded-lg object-cover border border-gold/30" />
        )}
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-widest text-gold/80">Africa Education Icon · Confidential</p>
          <h1 className="text-2xl font-semibold mt-1">{nominee.name}</h1>
          {nominee.organization && <p className="text-white/70 text-sm">{nominee.organization}</p>}
          {nominee.bio && <p className="text-white/60 text-sm mt-3 line-clamp-6">{nominee.bio}</p>}
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-widest text-white/40">Weighted total</p>
          <p className="text-3xl font-semibold text-gold">{weightedTotal}</p>
          <p className="text-[10px] text-white/40">of 100</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-4">
        <div className="flex items-center gap-2 text-gold mb-3">
          <AlertTriangle className="h-4 w-4" />
          <h2 className="text-sm font-semibold">Declare a conflict of interest</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          <Select value={conflictType} onValueChange={setConflictType}>
            <SelectTrigger><SelectValue placeholder="Conflict type" /></SelectTrigger>
            <SelectContent>{ICON_CONFLICT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={conflictSeverity} onValueChange={setConflictSeverity}>
            <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>{["low","medium","high","critical"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Brief description" value={conflictDesc} onChange={(e) => setConflictDesc(e.target.value)} className="md:col-span-2" />
        </div>
        <Button onClick={declareConflict} disabled={busy || !conflictType} variant="outline" className="mt-3 border-gold/40 text-gold hover:bg-gold/10">
          Declare & recuse
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Scoring — 8 weighted criteria</h2>
        {criteria.map(c => {
          const val = scores[c.id] ?? { score: 0, justification: "", evidence_ref: "" };
          return (
            <div key={c.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium">{c.name} <span className="text-xs text-white/50">· {c.weight}%</span></h3>
                  {c.description && <p className="text-xs text-white/50 mt-1 max-w-2xl">{c.description}</p>}
                </div>
                <div className="text-right">
                  <Label className="text-[10px] text-white/50">Score / {c.max_score}</Label>
                  <Input
                    type="number" min={0} max={c.max_score} step={0.5} disabled={locked}
                    value={val.score}
                    onChange={(e) => setScore(c.id, { score: Math.min(Math.max(Number(e.target.value) || 0, 0), c.max_score) })}
                    className="w-24 text-right"
                  />
                </div>
              </div>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <Textarea placeholder="Justification (evidence-based)" disabled={locked}
                  value={val.justification}
                  onChange={(e) => setScore(c.id, { justification: e.target.value })} />
                <Textarea placeholder="Evidence references / URLs / dossier page" disabled={locked}
                  value={val.evidence_ref}
                  onChange={(e) => setScore(c.id, { evidence_ref: e.target.value })} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-4 grid md:grid-cols-2 gap-4">
        <div>
          <Label>Recommendation</Label>
          <Select value={recommendation} onValueChange={setRecommendation} disabled={locked}>
            <SelectTrigger><SelectValue placeholder="Select recommendation" /></SelectTrigger>
            <SelectContent>
              {ICON_RECOMMENDATIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Evidence quality</Label>
          <Select value={evidenceFlag} onValueChange={setEvidenceFlag} disabled={locked}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["strong","adequate","weak","insufficient"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 justify-end sticky bottom-0 bg-charcoal/95 py-3">
        <Button variant="outline" disabled={busy || locked} onClick={() => saveDraft(false)} className="border-gold/30 text-white hover:bg-gold/10">
          <Save className="h-4 w-4 mr-2" /> Save draft
        </Button>
        <Button disabled={busy || locked || !recommendation} onClick={() => saveDraft(true)} className="bg-gold hover:bg-gold/90 text-black">
          Submit review
        </Button>
      </div>
      {locked && (
        <p className="text-center text-xs text-gold/80">This review has been submitted and is locked. Contact moderation to request reopening.</p>
      )}
    </div>
  );
}
