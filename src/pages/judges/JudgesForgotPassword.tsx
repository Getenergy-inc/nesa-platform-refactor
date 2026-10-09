import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Gavel, Loader2, MailCheck } from "lucide-react";
import { BRAND } from "@/config/brandHierarchy";

/** /judges/forgot-password — password recovery for appointed judges. */
export default function JudgesForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    // Never confirm whether an address is an appointed judge.
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Password Recovery — {BRAND.flagship} Judges Arena</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Gavel className="h-10 w-10 text-gold mx-auto mb-3" aria-hidden />
          <h1 className="font-serif text-2xl text-white">Password recovery</h1>
          <p className="text-sm text-white/60 mt-1">Judges Arena · {BRAND.flagship}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-arena-rail p-6">
          {sent ? (
            <div className="text-center space-y-3">
              <MailCheck className="h-8 w-8 text-emerald-400 mx-auto" aria-hidden />
              <p className="text-sm text-white/70">
                If that address belongs to an appointed judge, a recovery link is on its way. The
                link expires shortly and can be used once.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white/80">Registered email address</Label>
                <Input
                  id="email" type="email" value={email} required autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-black/30 border-white/15 text-white"
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full bg-gold text-charcoal hover:bg-gold/90">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send recovery link"}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-white/50">
          <Link to="/judges/sign-in" className="text-gold hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
