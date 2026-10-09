import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MailCheck, ShieldCheck, UserPlus, LogIn, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { linkNominationToAccount } from "@/features/nominate/submitPublicNomination";

/** Verbatim platform copy — do not paraphrase. */
export const NOMINATION_COPY = {
  preSubmit: "Start your nomination now. No account is required to begin.",
  accountPrompt:
    "Your information will be saved. First-time nominators will create a free account at submission to track the nomination.",
  accountScreen: "Almost done. Create your free account to submit and track your nomination.",
  success: (reference: string) =>
    `Nomination received. Your reference is ${reference}. Verify your email to access tracking and updates.`,
} as const;

interface Props {
  /** Reference generated at submission — already recorded server-side. */
  reference: string;
  defaultEmail?: string;
  defaultFullName?: string;
  /** Analytics + audit context (category slug). */
  formSlug: string;
  /** True when the visitor was already signed in when they submitted. */
  alreadySignedIn?: boolean;
}

/**
 * Step shown ONLY after the user clicks Submit.
 * The nomination is already recorded; this screen creates or confirms the
 * free account used to track it. Email verification never blocks submission.
 */
export function NominationAccountAtSubmit({
  reference,
  defaultEmail = "",
  defaultFullName = "",
  formSlug,
  alreadySignedIn = false,
}: Props) {
  const [mode, setMode] = useState<"create" | "signin">("create");
  const [email, setEmail] = useState(defaultEmail);
  const [fullName, setFullName] = useState(defaultFullName);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(alreadySignedIn);

  const finish = () => {
    setDone(true);
    trackEvent("nomination_tracking_ready", { form: formSlug, reference });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      trackEvent("account_creation_started", { form: formSlug, reference });
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/nominator`,
          data: { full_name: fullName.trim(), nomination_reference: reference },
        },
      });
      if (error) {
        if (/registered|already/i.test(error.message)) {
          trackEvent("existing_account_detected", { form: formSlug, reference });
          setMode("signin");
          toast({
            title: "You already have an account",
            description: "Sign in here to track this nomination — you will not lose anything.",
          });
          return;
        }
        throw error;
      }
      trackEvent("account_creation_completed", { form: formSlug, reference });
      await linkNominationToAccount(reference);
      finish();
    } catch (err) {
      toast({
        title: "Could not create account",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      trackEvent("existing_account_signin_started", { form: formSlug, reference });
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      trackEvent("existing_account_signin_completed", { form: formSlug, reference });
      await linkNominationToAccount(reference);
      finish();
    } catch (err) {
      toast({
        title: "Sign in failed",
        description: err instanceof Error ? err.message : "Please check your details.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    trackEvent("account_creation_started", { form: formSlug, reference, provider: "google" });
    try {
      window.sessionStorage.setItem("nesa.pending-nomination-ref", reference);
    } catch {
      /* ignore */
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/nominator` },
    });
    if (error) {
      toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
    }
  };

  if (done) {
    return (
      <div
        className="rounded-2xl border-2 border-gold/40 bg-gold/10 p-5 md:p-6"
        role="status"
        aria-live="polite"
        data-testid="nomination-success"
      >
        <div className="mb-2 flex items-center gap-2 text-gold">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-playfair text-lg">Nomination received</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          {NOMINATION_COPY.success(reference)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to="/dashboard/nominations">Track my nomination</Link>
          </Button>
          <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
            <Link to="/nominate">Nominate someone else</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border-2 border-gold/40 bg-charcoal-light/40 p-5 md:p-6 space-y-4"
      data-testid="account-at-submit"
    >
      <div className="flex items-start gap-2">
        <UserPlus className="mt-0.5 h-5 w-5 text-gold" aria-hidden />
        <div>
          <h3 className="font-playfair text-lg text-gold">{NOMINATION_COPY.accountScreen}</h3>
          <p className="mt-1 text-xs text-foreground/70">
            Your nomination is already recorded under reference{" "}
            <span className="text-gold">{reference}</span>. Email verification is not required for
            it to be reviewed.
          </p>
        </div>
      </div>

      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`rounded-full border px-3 py-1.5 transition ${
            mode === "create"
              ? "border-gold bg-gold/15 text-gold"
              : "border-gold/25 text-foreground/70 hover:border-gold/50"
          }`}
        >
          <UserPlus className="mr-1 inline h-3 w-3" /> Create free account
        </button>
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`rounded-full border px-3 py-1.5 transition ${
            mode === "signin"
              ? "border-gold bg-gold/15 text-gold"
              : "border-gold/25 text-foreground/70 hover:border-gold/50"
          }`}
        >
          <LogIn className="mr-1 inline h-3 w-3" /> I already have an account
        </button>
      </div>

      <form onSubmit={mode === "create" ? handleCreate : handleSignIn} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          {mode === "create" && (
            <div className="space-y-1.5">
              <Label htmlFor="nom_acc_name" className="text-xs">
                Full name
              </Label>
              <Input
                id="nom_acc_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="nom_acc_email" className="text-xs">
              Email
            </Label>
            <Input
              id="nom_acc_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="nom_acc_password" className="text-xs">
              Password {mode === "create" ? "(min 8 characters)" : ""}
            </Label>
            <Input
              id="nom_acc_password"
              type="password"
              minLength={mode === "create" ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            disabled={busy}
            className="bg-gold font-semibold text-charcoal hover:bg-gold/90"
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working…
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                {mode === "create" ? "Create account & track" : "Sign in & track"}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              trackEvent("account_step_skipped", { form: formSlug, reference });
              finish();
            }}
            className="text-foreground/70 hover:text-gold"
          >
            Skip for now
          </Button>
        </div>
      </form>

      <p className="flex items-start gap-2 text-[11px] text-foreground/55">
        <MailCheck className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
        Your nomination has already been submitted. Verification only unlocks tracking and updates.
      </p>
    </div>
  );
}

export default NominationAccountAtSubmit;
