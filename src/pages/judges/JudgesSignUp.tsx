import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Gavel, ShieldCheck, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/config/brandHierarchy";

/**
 * /judges/sign-up — invitation-only registration.
 *
 * Registration is never public. The invitation code is verified against a
 * SHA-256 hash held server-side and tied to the email governance approved.
 * The raw code is held in component state only and is never logged.
 */
export default function JudgesSignUp() {
  const nav = useNavigate();
  const [step, setStep] = useState<"code" | "account">("code");
  const [code, setCode] = useState("");
  const [invitedName, setInvitedName] = useState<string | null>(null);
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.rpc("icon_check_invitation", { p_token: code.trim() });
    setBusy(false);
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row?.valid) {
      toast.error("That invitation code is not valid, has expired, or has already been used.");
      return;
    }
    setInvitedName(row.full_name ?? null);
    setEmailHint(row.email_hint ?? null);
    setStep("account");
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/judges/onboarding` },
    });

    if (signUpError && !/already registered/i.test(signUpError.message)) {
      setBusy(false);
      return toast.error(signUpError.message);
    }

    // An already-registered invitee simply signs in to redeem.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError) {
      setBusy(false);
      toast.message("Account created. Please confirm your email, then sign in to complete onboarding.");
      return nav("/judges/sign-in", { replace: true });
    }

    const { error: redeemError } = await supabase.rpc("redeem_icon_invitation", {
      p_token: code.trim(),
    });
    setBusy(false);
    if (redeemError) return toast.error(redeemError.message);

    toast.success("Invitation redeemed. Please complete your appointment onboarding.");
    nav("/judges/onboarding", { replace: true });
  };

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Judge Registration — {BRAND.flagship}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Gavel className="h-10 w-10 text-gold mx-auto mb-3" aria-hidden />
          <h1 className="font-serif text-2xl text-white">{BRAND.flagship}</h1>
          <p className="text-sm text-white/60 mt-1">Judges Arena — invitation-only registration</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-arena-rail p-6">
          {step === "code" ? (
            <form onSubmit={verifyCode} className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-gold/25 bg-gold/5 p-3">
                <KeyRound className="h-4 w-4 text-gold mt-0.5 shrink-0" aria-hidden />
                <p className="text-xs text-white/70">
                  Registration is not open to the public. Enter the single-use invitation code issued
                  to you by the governance secretariat.
                </p>
              </div>
              <div>
                <Label htmlFor="code" className="text-white/80">Invitation code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="XXXX-XXXX-XXXX"
                  className="mt-1 bg-black/30 border-white/15 text-white"
                />
              </div>
              <Button type="submit" disabled={busy || !code.trim()} className="w-full bg-gold text-charcoal hover:bg-gold/90">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify invitation"}
              </Button>
            </form>
          ) : (
            <form onSubmit={createAccount} className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden />
                <p className="text-xs text-white/70">
                  Invitation verified{invitedName ? ` for ${invitedName}` : ""}. Create your account
                  using the approved address{emailHint ? ` (${emailHint})` : ""}.
                </p>
              </div>
              <div>
                <Label htmlFor="email" className="text-white/80">Approved email address</Label>
                <Input
                  id="email" type="email" value={email} required autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-black/30 border-white/15 text-white"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white/80">Create a password</Label>
                <Input
                  id="password" type="password" value={password} required minLength={10}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-black/30 border-white/15 text-white"
                />
                <p className="text-[11px] text-white/40 mt-1">Minimum 10 characters.</p>
              </div>
              <Button type="submit" disabled={busy} className="w-full bg-gold text-charcoal hover:bg-gold/90">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account & redeem invitation"}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/40">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Confidential judging system · all activity is audit-logged
        </div>
        <p className="mt-4 text-center text-sm text-white/50">
          Already appointed?{" "}
          <Link to="/judges/sign-in" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
