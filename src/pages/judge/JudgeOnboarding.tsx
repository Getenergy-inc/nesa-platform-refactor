import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  BookOpen,
  Compass,
  ClipboardCheck,
  Sparkles,
  Handshake,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const STEPS = [
  {
    key: "welcome",
    title: "Welcome to the Judges Arena",
    icon: Handshake,
    body: (
      <div className="space-y-3 text-white/80">
        <p>
          Thank you for accepting the responsibility of judging Africa’s most prestigious education awards.
          The Judges Arena is your private workspace for reviewing nominees, scoring on the EDI Matrix and
          collaborating with fellow jurors.
        </p>
        <p>This 6-step onboarding takes about 8 minutes. You can resume any step later from your dashboard.</p>
      </div>
    ),
  },
  {
    key: "conduct",
    title: "Code of Conduct",
    icon: ShieldCheck,
    body: (
      <ul className="space-y-2 text-white/80 list-disc list-inside">
        <li>Judge with integrity, independence and confidentiality.</li>
        <li>Declare any conflict of interest before scoring.</li>
        <li>Never share nominee evidence or scores outside the Arena.</li>
        <li>Treat every nominee with respect and apply criteria consistently.</li>
      </ul>
    ),
    requireAccept: true,
  },
  {
    key: "edi",
    title: "EDI Training",
    icon: BookOpen,
    body: (
      <div className="space-y-3 text-white/80">
        <p>The EDI Matrix scores nominees across six dimensions on a 1–100 scale:</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {["Education Impact", "Leadership", "Innovation", "Inclusion", "Sustainability", "Community Reach"].map(
            (d) => (
              <div key={d} className="rounded-md border border-white/10 bg-white/5 px-3 py-2">{d}</div>
            ),
          )}
        </div>
        <p className="text-sm text-white/60">
          Detailed rubrics and worked examples are available in{" "}
          <Link to="/guidelines/edi-matrix" className="text-gold underline">EDI Matrix guidelines</Link>.
        </p>
      </div>
    ),
  },
  {
    key: "tour",
    title: "Arena Tour",
    icon: Compass,
    body: (
      <ul className="space-y-2 text-white/80 text-sm">
        <li><strong className="text-white">Dashboard</strong> — your assignments, deadlines and progress.</li>
        <li><strong className="text-white">Scoring</strong> — split-screen profile + EDI Matrix scoring.</li>
        <li><strong className="text-white">COI</strong> — declare conflicts and recuse where needed.</li>
        <li><strong className="text-white">Chat</strong> — private discussion with the panel and head judge.</li>
        <li><strong className="text-white">Rubric &amp; Guidelines</strong> — reference materials, always one click away.</li>
      </ul>
    ),
  },
  {
    key: "practice",
    title: "Practice Review",
    icon: ClipboardCheck,
    body: (
      <div className="space-y-3 text-white/80">
        <p>
          Try a non-binding practice review on a sample nominee. Your practice score is private and is never
          counted toward results.
        </p>
        <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
          <Link to="/judge/scoring?practice=1">Open practice scoring</Link>
        </Button>
      </div>
    ),
  },
  {
    key: "activate",
    title: "Activation",
    icon: Sparkles,
    body: (
      <div className="space-y-3 text-white/80">
        <p>
          You’re ready! Activating your account unlocks live assignments. You will receive an email when the
          first nominee is added to your queue.
        </p>
      </div>
    ),
  },
];

export default function JudgeOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const Current = STEPS[step];
  const Icon = Current.icon;
  const progress = ((step + 1) / STEPS.length) * 100;
  const isLast = step === STEPS.length - 1;
  const canAdvance = !Current.requireAccept || accepted;

  const next = () => {
    if (!canAdvance) return;
    if (isLast) {
      try {
        localStorage.setItem("nesa.judge.onboarded", "1");
      } catch {/* ignore */}
      toast({ title: "Welcome to the Judges Arena", description: "Your account is activated." });
      navigate("/judge/dashboard");
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <div className="min-h-screen bg-charcoal text-white pb-16">
      <Helmet>
        <title>Judge Onboarding — NESA-Africa</title>
      </Helmet>

      <section className="border-b border-white/10 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="border-gold/60 text-gold w-fit">Judges Arena</Badge>
          <h1 className="text-3xl md:text-4xl font-serif">Judge Onboarding</h1>
          <p className="text-white/70">6 quick steps to activate your jury workspace.</p>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Step {step + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/10" />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-serif">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Icon className="h-5 w-5" />
              </span>
              {Current.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Current.body}

            {Current.requireAccept && (
              <label className="flex items-start gap-3 rounded-md border border-white/10 bg-white/5 p-3 cursor-pointer">
                <Checkbox
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(v === true)}
                  className="mt-0.5"
                />
                <span className="text-sm text-white/80">
                  I have read and agree to the NESA-Africa Judges’ Code of Conduct.
                </span>
              </label>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={next}
                disabled={!canAdvance}
                className="bg-gold text-charcoal hover:bg-gold/90"
              >
                {isLast ? (<><Check className="h-4 w-4 mr-2" /> Activate my account</>) : (<>Continue <ArrowRight className="h-4 w-4 ml-2" /></>)}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stepper rail */}
        <ol className="mt-6 grid grid-cols-6 gap-2 text-[10px] text-white/50">
          {STEPS.map((s, i) => (
            <li
              key={s.key}
              className={`text-center truncate ${i <= step ? "text-gold" : ""}`}
            >
              {s.title.split(" ")[0]}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
