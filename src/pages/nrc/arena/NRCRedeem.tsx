// /nrc/redeem?token=... — NRC invitation redemption.
// Mirrors the judges redemption pattern: verify the token server-side first,
// then create (or sign into) the account, then redeem. Redemption creates the
// nrc_members row, the onboarding checklist and grants the NRC role.

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, KeyRound, CheckCircle2, Search, AlertTriangle } from "lucide-react";

export default function NRCRedeem() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") ?? "");
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const verify = async (raw: string) => {
    setChecking(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("nrc_check_invitation", {
      p_token: raw.trim(),
    });
    setChecking(false);
    const row = Array.isArray(data) ? data[0] : data;
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    if (!row?.valid) {
      setError("That invitation is not valid, has expired, or has already been used.");
      return;
    }
    setVerified(true);
    setEmailHint(row.email_hint ?? null);
    setExpiresAt(row.expires_at ?? null);
  };

  // Auto-verify a token that arrived in the emailed link.
  useEffect(() => {
    const t = params.get("token");
    if (t) void verify(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redeem = async () => {
    const { error: redeemError } = await supabase.rpc("redeem_nrc_invitation", {
      p_token: token.trim(),
    });
    if (redeemError) {
      setBusy(false);
      setError(redeemError.message);
      toast.error(redeemError.message);
      return false;
    }
    return true;
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    const { error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { emailRedirectTo: `${window.location.origin}/nrc/onboarding` },
    });
    if (signUpError && !/already registered|already been registered/i.test(signUpError.message)) {
      setBusy(false);
      setError(signUpError.message);
      return toast.error(signUpError.message);
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (signInError) {
      setBusy(false);
      toast.message(
        "Account created. Confirm your email, then sign in and re-open this invitation link to finish."
      );
      return nav(`/nrc/sign-in?next=${encodeURIComponent(`/nrc/redeem?token=${token}`)}`, {
        replace: true,
      });
    }

    const ok = await redeem();
    if (!ok) return;

    setBusy(false);
    toast.success("Invitation redeemed. Complete your appointment onboarding to be activated.");
    nav("/nrc/onboarding", { replace: true });
  };

  return (
    <div className="min-h-screen bg-charcoal text-white flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Redeem NRC Invitation — NESA-Africa 2026</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Search className="mx-auto mb-3 h-9 w-9 text-gold" aria-hidden />
          <h1 className="font-display text-2xl font-bold">Nominee Research Corps</h1>
          <p className="mt-1 text-sm text-white/60">Invitation redemption</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
              <p className="text-xs text-white/80">{error}</p>
            </div>
          )}

          {!verified ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void verify(token);
              }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3 rounded-lg border border-gold/25 bg-gold/5 p-3">
                <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <p className="text-xs text-white/70">
                  NRC registration is invitation-only. Paste the single-use token from your
                  invitation email. Not invited yet?{" "}
                  <Link to="/nrc/apply" className="text-gold underline">
                    Apply to join
                  </Link>
                  .
                </p>
              </div>
              <div>
                <Label htmlFor="token">Invitation token</Label>
                <Input
                  id="token" value={token} onChange={(e) => setToken(e.target.value)}
                  required autoComplete="off" spellCheck={false}
                  className="mt-1 bg-black/30 border-white/15 text-white"
                />
              </div>
              <Button type="submit" disabled={checking || !token.trim()} className="w-full bg-gold text-charcoal hover:bg-gold/90">
                {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify invitation"}
              </Button>
            </form>
          ) : (
            <form onSubmit={createAccount} className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                <p className="text-xs text-white/70">
                  Invitation verified{emailHint ? ` for ${emailHint}` : ""}. Register with that exact
                  address — the invitation is bound to it.
                  {expiresAt ? ` Expires ${new Date(expiresAt).toLocaleDateString()}.` : ""}
                </p>
              </div>
              <div>
                <Label htmlFor="email">Invited email address</Label>
                <Input
                  id="email" type="email" required autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-black/30 border-white/15 text-white"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password" type="password" required minLength={10} autoComplete="new-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-black/30 border-white/15 text-white"
                />
                <p className="mt-1 text-[11px] text-white/45">
                  Minimum 10 characters. Already have an account? Use its existing password.
                </p>
              </div>
              <Button type="submit" disabled={busy} className="w-full bg-gold text-charcoal hover:bg-gold/90">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Redeem invitation"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
