import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Circle, ShieldCheck, Lock } from "lucide-react";
import { BRAND } from "@/config/brandHierarchy";

/**
 * /judges/onboarding — appointment onboarding and compliance.
 *
 * Sequence: profile -> appointment acceptance -> MOU -> code of conduct ->
 * confidentiality -> conflict of interest -> training -> MFA -> governance
 * activation. A judge cannot self-activate; only governance can.
 */

interface Onboarding {
  judge_id: string;
  profile_completed: boolean;
  appointment_accepted_at: string | null;
  mou_signed_at: string | null;
  code_of_conduct: boolean;
  confidentiality_signed: boolean;
  conflict_declared: boolean;
  training_completed_at: string | null;
  mfa_enrolled_at: string | null;
  activated_at: string | null;
}

const STEPS = [
  { key: "profile_completed", label: "Professional profile" },
  { key: "appointment_accepted_at", label: "Appointment acceptance" },
  { key: "mou_signed_at", label: "Memorandum of Understanding" },
  { key: "code_of_conduct", label: "Code of Conduct" },
  { key: "confidentiality_signed", label: "Confidentiality agreement" },
  { key: "conflict_declared", label: "Conflict of interest declaration" },
  { key: "training_completed_at", label: "Judging training" },
  { key: "mfa_enrolled_at", label: "Two-factor authentication" },
] as const;

export default function JudgesOnboarding() {
  const nav = useNavigate();
  const [judgeId, setJudgeId] = useState<string | null>(null);
  const [ob, setOb] = useState<Onboarding | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");

  const load = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { nav("/judges/sign-in?next=/judges/onboarding", { replace: true }); return; }
    const { data: judge } = await supabase
      .from("icon_judges").select("id, country").eq("user_id", auth.user.id).maybeSingle();
    if (!judge) { setLoading(false); return; }
    setJudgeId(judge.id);
    setCountry(judge.country ?? "");
    const [{ data: onboarding }, { data: profile }] = await Promise.all([
      supabase.from("icon_judge_onboarding").select("*").eq("judge_id", judge.id).maybeSingle(),
      supabase.from("icon_judge_profiles").select("title, institution, bio").eq("judge_id", judge.id).maybeSingle(),
    ]);
    setOb(onboarding as any);
    setTitle(profile?.title ?? "");
    setInstitution(profile?.institution ?? "");
    setBio(profile?.bio ?? "");
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const done = useMemo(() => {
    if (!ob) return 0;
    return STEPS.filter((s) => Boolean((ob as any)[s.key])).length;
  }, [ob]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bio.trim().length < 30) return toast.error("Your biography must be at least 30 characters.");
    if (!judgeId) return;
    setBusy(true);
    const [{ error: pErr }, { error: jErr }] = await Promise.all([
      supabase.from("icon_judge_profiles")
        .update({ title: title.trim(), institution: institution.trim(), bio: bio.trim() })
        .eq("judge_id", judgeId),
      supabase.from("icon_judges").update({ country: country.trim() }).eq("id", judgeId),
    ]);
    if (pErr || jErr) { setBusy(false); return toast.error((pErr ?? jErr)!.message); }
    const { error } = await supabase.from("icon_judge_onboarding")
      .update({ profile_completed: true }).eq("judge_id", judgeId);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Professional profile saved.");
    load();
  };

  const markStep = async (patch: Record<string, unknown>, label: string) => {
    if (!judgeId) return;
    setBusy(true);
    const { error } = await supabase.from("icon_judge_onboarding").update(patch).eq("judge_id", judgeId);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${label} recorded.`);
    load();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-arena-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!judgeId) {
    return (
      <div className="min-h-screen bg-arena-bg text-arena-text flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <ShieldCheck className="h-10 w-10 text-gold mx-auto mb-4" aria-hidden />
          <h1 className="text-white text-xl font-semibold mb-2">No appointment found</h1>
          <p className="text-white/60 text-sm">
            This account has not redeemed a judging invitation. If you were invited, complete
            registration from your invitation code first.
          </p>
        </div>
      </div>
    );
  }

  const stepDone = (k: string) => Boolean((ob as any)?.[k]);

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text px-4 py-10">
      <Helmet>
        <title>Appointment Onboarding — {BRAND.flagship} Judges Arena</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-widest text-gold">Judges Arena</p>
          <h1 className="mt-2 font-serif text-3xl text-white">Appointment onboarding</h1>
          <p className="mt-2 text-sm text-white/60">
            Complete every step below. Your appointment is activated by the governance
            secretariat — not automatically — once all eight are recorded.
          </p>
          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden" role="progressbar"
               aria-valuenow={done} aria-valuemin={0} aria-valuemax={STEPS.length}
               aria-label="Onboarding progress">
            <div className="h-full bg-gold transition-all" style={{ width: `${(done / STEPS.length) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-white/50">{done} of {STEPS.length} steps complete</p>
        </header>

        {ob?.activated_at && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-200">
            Your appointment is active. You may enter the Judges Arena.
            <Button onClick={() => nav("/judges/dashboard")} className="ml-3 bg-gold text-charcoal hover:bg-gold/90" size="sm">
              Go to dashboard
            </Button>
          </div>
        )}

        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li key={s.key} className="flex items-center gap-3 rounded-lg border border-white/10 bg-arena-rail px-4 py-3">
              {stepDone(s.key)
                ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden />
                : <Circle className="h-4 w-4 text-white/30 shrink-0" aria-hidden />}
              <span className={stepDone(s.key) ? "text-white/60 text-sm line-through" : "text-white text-sm"}>
                {s.label}
              </span>
            </li>
          ))}
        </ol>

        {/* 1. Professional profile */}
        <section className="rounded-2xl border border-white/10 bg-arena-rail p-6">
          <h2 className="font-serif text-xl text-white mb-4">1. Professional profile</h2>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="title" className="text-white/80">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
                       className="mt-1 bg-black/30 border-white/15 text-white" />
              </div>
              <div>
                <Label htmlFor="institution" className="text-white/80">Institution</Label>
                <Input id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} required
                       className="mt-1 bg-black/30 border-white/15 text-white" />
              </div>
            </div>
            <div>
              <Label htmlFor="country" className="text-white/80">Country</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required
                     className="mt-1 bg-black/30 border-white/15 text-white" />
            </div>
            <div>
              <Label htmlFor="bio" className="text-white/80">Biography (minimum 30 characters)</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} required
                        className="mt-1 bg-black/30 border-white/15 text-white" />
              <p className="text-[11px] text-white/40 mt-1">{bio.trim().length} characters</p>
            </div>
            <Button type="submit" disabled={busy} className="bg-gold text-charcoal hover:bg-gold/90">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save profile"}
            </Button>
          </form>
        </section>

        {/* 2-6. Compliance attestations */}
        <section className="rounded-2xl border border-white/10 bg-arena-rail p-6 space-y-5">
          <h2 className="font-serif text-xl text-white">2–6. Appointment & compliance</h2>

          <Attestation
            id="appointment" done={stepDone("appointment_accepted_at")} disabled={busy}
            title="Accept the appointment"
            body={`I accept appointment as a volunteer judge of the ${BRAND.flagship} for the 2026 cycle, reviewing verified lifetime contributions made between 2006 and 2026.`}
            onConfirm={() => markStep({ appointment_accepted_at: new Date().toISOString() }, "Appointment acceptance")}
          />
          <Attestation
            id="mou" done={stepDone("mou_signed_at")} disabled={busy}
            title="Memorandum of Understanding"
            body="I have read and agree to the Memorandum of Understanding governing the independence, unpaid volunteer status and time commitment of the judging panel."
            onConfirm={() => markStep({ mou_signed_at: new Date().toISOString() }, "MOU")}
          />
          <Attestation
            id="conduct" done={stepDone("code_of_conduct")} disabled={busy}
            title="Code of Conduct"
            body="I agree to judge solely on verified evidence, to accept no inducement of any kind, and to raise any attempt to influence my assessment with the governance secretariat."
            onConfirm={() => markStep({ code_of_conduct: true }, "Code of Conduct")}
          />
          <Attestation
            id="confidentiality" done={stepDone("confidentiality_signed")} disabled={busy}
            title="Confidentiality agreement"
            body="I will keep all nominee dossiers, deliberations, scores and ballots strictly confidential, and will not disclose any outcome before it is formally published."
            onConfirm={() => markStep({ confidentiality_signed: true }, "Confidentiality agreement")}
          />
          <Attestation
            id="coi" done={stepDone("conflict_declared")} disabled={busy}
            title="Conflict of interest declaration"
            body="I have declared every relationship that could reasonably be seen as a conflict, and I will declare any that arises later and recuse myself from the affected pathway."
            onConfirm={() => markStep({ conflict_declared: true }, "Conflict of interest declaration")}
          />
        </section>

        {/* 7-8 */}
        <section className="rounded-2xl border border-white/10 bg-arena-rail p-6 space-y-5">
          <h2 className="font-serif text-xl text-white">7–8. Training & two-factor authentication</h2>
          <Attestation
            id="training" done={stepDone("training_completed_at")} disabled={busy}
            title="Judging training"
            body="I have completed the scoring framework orientation and the sample dossier review, and I understand the evidence standard applied to lifetime contributions."
            onConfirm={() => markStep({ training_completed_at: new Date().toISOString() }, "Training")}
          />
          <Attestation
            id="mfa" done={stepDone("mfa_enrolled_at")} disabled={busy}
            title="Two-factor authentication"
            body="I understand that every sign-in to the Judges Arena requires a one-time code sent to my registered address, and that my session expires when that verification lapses."
            onConfirm={() => markStep({ mfa_enrolled_at: new Date().toISOString() }, "Two-factor authentication")}
          />
        </section>

        <div className="rounded-xl border border-white/10 bg-black/20 p-4 flex items-start gap-3">
          <Lock className="h-4 w-4 text-gold mt-0.5 shrink-0" aria-hidden />
          <p className="text-xs text-white/60">
            Every step above is timestamped in the immutable audit trail. Your appointment becomes
            active only when the governance secretariat confirms it — this cannot be self-granted.
          </p>
        </div>
      </div>
    </div>
  );
}

function Attestation({
  id, title, body, done, disabled, onConfirm,
}: {
  id: string; title: string; body: string; done: boolean; disabled: boolean; onConfirm: () => void;
}) {
  const [checked, setChecked] = useState(false);
  return (
    <div className={`rounded-xl border p-4 ${done ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-black/20"}`}>
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        {done && <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden />}
        {title}
      </h3>
      <p className="mt-2 text-xs text-white/60 leading-relaxed">{body}</p>
      {done ? (
        <p className="mt-3 text-xs text-emerald-300">Recorded.</p>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-ack`} checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
            <Label htmlFor={`${id}-ack`} className="text-xs text-white/70">I agree</Label>
          </div>
          <Button size="sm" disabled={!checked || disabled} onClick={onConfirm}
                  className="bg-gold text-charcoal hover:bg-gold/90">
            Record
          </Button>
        </div>
      )}
    </div>
  );
}
