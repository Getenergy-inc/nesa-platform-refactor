import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Loader2, AlertTriangle, Lock } from "lucide-react";
import { NRCArenaLayout } from "@/components/nrc/arena/NRCArenaLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  NRC_ONBOARDING_STEPS,
  isNRCOnboardingComplete,
  useNRCOnboarding,
  useSetNRCOnboardingStep,
  type NRCOnboardingStepKey,
} from "@/hooks/useNRCOnboarding";

export default function NRCOnboarding() {
  const { data: row, isLoading, error, refetch } = useNRCOnboarding();
  const setStep = useSetNRCOnboardingStep();

  const selfSteps = NRC_ONBOARDING_STEPS.filter((s) => s.self);
  const doneCount = row ? selfSteps.filter((s) => row[s.key] === true).length : 0;
  const complete = isNRCOnboardingComplete(row);

  const toggle = (key: NRCOnboardingStepKey, value: boolean) => {
    setStep.mutate(
      { key, value },
      {
        onError: (e: unknown) => toast.error((e as Error).message),
        onSuccess: () => toast.success(value ? "Step marked complete" : "Step reopened"),
      }
    );
  };

  return (
    <NRCArenaLayout>
      <Helmet><title>NRC Onboarding · NESA-Africa 2026</title></Helmet>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gold/80">Onboarding centre</p>
        <h1 className="font-display text-2xl font-bold">Appointment &amp; compliance</h1>
        <p className="text-white/65 mt-1 text-sm">
          All eleven compliance steps must be completed before your review queue unlocks. Activation
          is then confirmed by NRC leadership.
        </p>
      </header>

      {error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Could not load your onboarding record</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{(error as Error).message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </div>
      ) : !row ? (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>No onboarding record yet</AlertTitle>
          <AlertDescription>
            An onboarding checklist is created when you redeem an NRC invitation. If you have an
            invitation, <Link to="/nrc/redeem" className="text-gold underline">redeem it here</Link>.
            Otherwise you can <Link to="/nrc/apply" className="text-gold underline">apply to join the NRC</Link>.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Compliance progress</span>
              <span className="text-white/60">{doneCount} of {selfSteps.length} steps</span>
            </div>
            <Progress value={(doneCount / selfSteps.length) * 100} className="mt-2 h-2" />
            {complete && !row.activated && (
              <p className="mt-3 text-xs text-emerald-300">
                All compliance steps complete — awaiting activation by NRC leadership.
              </p>
            )}
            {row.activated && (
              <p className="mt-3 text-xs text-emerald-300">
                Activated{row.activated_at ? ` on ${new Date(row.activated_at).toLocaleDateString()}` : ""}.
                Your review queue is open.
              </p>
            )}
          </div>

          <ol className="space-y-2">
            {NRC_ONBOARDING_STEPS.map((step, i) => {
              const done = row[step.key] === true;
              return (
                <li
                  key={step.key}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
                  ) : (
                    <Circle className="h-5 w-5 text-white/30" aria-hidden />
                  )}
                  <span className="flex-1 text-white/85">
                    <span className="text-gold/70 text-xs mr-2 font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.label}
                  </span>
                  {step.self ? (
                    <Button
                      size="sm"
                      variant={done ? "outline" : "default"}
                      disabled={setStep.isPending}
                      className={done ? "border-white/20 text-white/70" : "bg-gold text-charcoal hover:bg-gold/90"}
                      onClick={() => toggle(step.key, !done)}
                    >
                      {done ? "Reopen" : "Mark complete"}
                    </Button>
                  ) : (
                    <Badge variant="outline" className="border-white/20 text-white/60 text-[10px]">
                      {done ? "Activated" : "Leadership only"}
                    </Badge>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      )}
    </NRCArenaLayout>
  );
}
