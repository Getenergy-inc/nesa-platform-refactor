import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MailCheck, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

interface Props {
  /** Nomination reference (public tracking id) to attach the account to. */
  reference?: string | null;
  /** Prefill values from the just-submitted nomination. */
  defaultEmail?: string;
  defaultFullName?: string;
  /** Analytics context. */
  formSlug?: string;
  onAccountCreated?: () => void;
}

/**
 * Post-submission "Create your free account to track this nomination" panel.
 * Optional — the nomination is already recorded; this offers a durable way
 * for the nominator to track status, receive updates, and nominate again.
 */
export function AccountAtSubmitPanel({
  reference,
  defaultEmail = "",
  defaultFullName = "",
  formSlug,
  onAccountCreated,
}: Props) {
  const [email, setEmail] = useState(defaultEmail);
  const [fullName, setFullName] = useState(defaultFullName);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<"created" | "exists" | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
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
          data: { full_name: fullName.trim(), nomination_reference: reference ?? null },
        },
      });
      if (error) {
        // Existing account branch
        if (/registered|already/i.test(error.message)) {
          trackEvent("existing_account_detected", { form: formSlug, reference });
          setDone("exists");
          toast.message("An account with this email already exists — please sign in to track this nomination.");
          return;
        }
        throw error;
      }
      trackEvent("account_creation_completed", { form: formSlug, reference });
      setDone("created");
      toast.success("Account created — check your email to verify.");
      onAccountCreated?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not create account.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    trackEvent("account_creation_started", { form: formSlug, reference, provider: "google" });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/nominator` },
    });
    if (error) toast.error(error.message);
  };

  if (done === "created") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-charcoal/40 p-5 text-sm text-foreground/85">
        <MailCheck className="h-5 w-5 text-gold mb-2" />
        <p className="font-semibold text-gold">Almost done — verify your email</p>
        <p className="mt-1 text-foreground/70">
          We sent a verification link to <span className="text-gold">{email}</span>. Your nomination
          <span className="text-gold"> {reference}</span> is already recorded and does not require
          verification to be reviewed.
        </p>
      </div>
    );
  }

  if (done === "exists") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-charcoal/40 p-5 text-sm text-foreground/85">
        <p className="font-semibold text-gold">Welcome back</p>
        <p className="mt-1 text-foreground/70">
          An account already exists for <span className="text-gold">{email}</span>. Sign in to track
          nomination <span className="text-gold">{reference}</span>.
        </p>
        <Button asChild size="sm" className="mt-3 bg-gold text-charcoal hover:bg-gold/90">
          <Link to={`/account/login?next=${encodeURIComponent("/nominator")}`}>Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleCreate}
      className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 md:p-6 space-y-4"
    >
      <div className="flex items-start gap-2">
        <UserPlus className="h-5 w-5 text-gold mt-0.5" aria-hidden />
        <div>
          <h3 className="font-playfair text-lg text-gold">
            Create your free account to track this nomination
          </h3>
          <p className="text-xs text-foreground/70 mt-1">
            Optional. Your nomination is already recorded. Creating an account lets you
            track status, respond to reviewer questions, and nominate more Enablers of
            Education for All Across Africa.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="acc_name">Full name</Label>
          <Input
            id="acc_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="acc_email">Email</Label>
          <Input
            id="acc_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="acc_password">Password (min 8 characters)</Label>
          <Input
            id="acc_password"
            type="password"
            minLength={8}
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
          className="bg-gold text-charcoal hover:bg-gold/90 font-semibold"
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" /> Create account &amp; track
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
      </div>
      <p className="text-[11px] text-foreground/55">
        Email verification is not required for your nomination to be reviewed.
      </p>
    </form>
  );
}

export default AccountAtSubmitPanel;
