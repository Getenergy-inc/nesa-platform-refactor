import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Gavel, ShieldCheck, Loader2 } from "lucide-react";

export default function IconJurySignIn() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const otpMode = sp.get("otp") === "1";
  const next = sp.get("next") || "/icon-jury/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session && !otpMode) nav(`/icon-jury/sign-in?otp=1&next=${encodeURIComponent(next)}`, { replace: true });
    })();
  }, [nav, next, otpMode]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in. Please complete two-factor verification.");
    nav(`/icon-jury/sign-in?otp=1&next=${encodeURIComponent(next)}`, { replace: true });
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    // Simple demo OTP: any 6-digit accepted; production would call an edge function to email/verify.
    if (!/^\d{6}$/.test(otp)) {
      setBusy(false);
      return toast.error("Enter the 6-digit code sent to your registered email.");
    }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setBusy(false); return toast.error("Session expired. Please sign in again."); }
    const { error } = await supabase.from("icon_judge_otp_sessions").insert({
      user_id: userData.user.id,
      user_agent: navigator.userAgent,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    await supabase.from("icon_jury_audit_logs").insert({
      actor_user_id: userData.user.id,
      action: "icon_jury_sign_in",
      entity_type: "auth",
      metadata: { via: "otp" },
    });
    nav(next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col">
      <Helmet>
        <title>Africa Education Icon Judges Portal — Sign In</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Gavel className="h-8 w-8 text-gold" />
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-widest text-gold/80">Africa Education Icon</p>
              <h1 className="text-lg font-semibold">Judges Portal</h1>
            </div>
          </div>

          <div className="rounded-xl border border-gold/20 bg-black/40 p-6">
            {!otpMode ? (
              <>
                <h2 className="text-xl font-semibold mb-1">Secure jury sign-in</h2>
                <p className="text-sm text-white/60 mb-6">
                  Independent review of Africa Education Icon nominees. Invitation-only access.
                </p>
                <form onSubmit={signIn} className="space-y-4">
                  <div>
                    <Label className="text-white/80">Email</Label>
                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-white/80">Password</Label>
                    <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full bg-gold hover:bg-gold/90 text-black">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-gold mb-2">
                  <ShieldCheck className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Two-factor verification</h2>
                </div>
                <p className="text-sm text-white/60 mb-6">
                  Enter the 6-digit code from your authenticator or registered email.
                </p>
                <form onSubmit={verifyOtp} className="space-y-4">
                  <Input
                    inputMode="numeric" maxLength={6} pattern="\d{6}"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-widest"
                  />
                  <Button type="submit" disabled={busy} className="w-full bg-gold hover:bg-gold/90 text-black">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                  </Button>
                </form>
              </>
            )}
            <p className="text-[11px] text-white/40 mt-6 text-center leading-relaxed">
              Access is limited to appointed Icon judges. All access is logged. Confidentiality
              obligations apply to every session.
            </p>
          </div>
          <p className="text-center text-xs text-white/40 mt-6">
            Not a judge? <Link to="/" className="text-gold hover:underline">Return to nesa.africa</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
