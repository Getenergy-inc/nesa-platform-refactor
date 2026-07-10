import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle, Loader2, AlertCircle, Clock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AcceptanceSuccessCard } from "@/components/acceptance";

interface NomineePreview {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  acceptance_status: string | null;
  acceptance_token_expires_at: string | null;
  renomination_count: number;
  country: string | null;
  region: string | null;
  organization: string | null;
  title: string | null;
  recognition_pathway: "social_media" | "sports" | "music" | null;
}

const PATHWAY_LABEL: Record<string, string> = {
  social_media: "Social Media Education Champion",
  sports: "Sports Icon Supporting Education",
  music: "Music Icon Supporting Education",
};

export default function NomineeAccept() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nominee, setNominee] = useState<NomineePreview | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [signInSent, setSignInSent] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Load nominee preview by token
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setError("Invalid acceptance link");
        setLoading(false);
        return;
      }
      const { data, error: fetchErr } = await supabase
        .from("nominees")
        .select(
          "id, name, slug, email, acceptance_status, acceptance_token_expires_at, renomination_count, country, region, organization, title, referral_code, recognition_pathway",
        )
        .eq("acceptance_token", token)
        .maybeSingle();

      if (cancelled) return;
      if (fetchErr || !data) {
        setError("This acceptance link is invalid or has been revoked.");
        setLoading(false);
        return;
      }
      if (data.acceptance_token_expires_at && new Date(data.acceptance_token_expires_at) < new Date()) {
        setError("This acceptance link has expired. Please contact support for a new one.");
        setLoading(false);
        return;
      }
      setNominee(data as unknown as NomineePreview);
      setEmailInput(data.email ?? "");
      if (data.acceptance_status === "ACCEPTED" && data.referral_code) {
        setAccepted(true);
        setReferralCode(data.referral_code);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [token]);

  // If the magic-link callback landed us here as an authenticated user, auto-accept.
  const doAccept = useCallback(async () => {
    if (!token) return;
    setSubmitting(true);
    const { data, error: rpcErr } = await supabase.rpc("accept_nomination_by_token", { p_token: token });
    setSubmitting(false);
    if (rpcErr || !data || !data[0]) {
      toast.error(rpcErr?.message ?? "Failed to accept nomination");
      return;
    }
    setReferralCode(data[0].referral_code);
    setAccepted(true);
    toast.success("Nomination accepted!", {
      description: "Your public profile and dashboard are now live.",
    });
  }, [token]);

  useEffect(() => {
    // Auto-accept if signed in with matching email and not yet accepted
    if (!loading && nominee && user && !accepted && !submitting) {
      const emailMatches = user.email?.toLowerCase() === nominee.email?.toLowerCase();
      if (emailMatches) void doAccept();
    }
  }, [loading, nominee, user, accepted, submitting, doAccept]);

  const sendMagicLink = async () => {
    if (!emailInput || !nominee) return;
    if (emailInput.toLowerCase() !== (nominee.email ?? "").toLowerCase()) {
      toast.error("Email must match the address on your nomination.");
      return;
    }
    setSubmitting(true);
    const { error: otpErr } = await supabase.auth.signInWithOtp({
      email: emailInput,
      options: { emailRedirectTo: `${window.location.origin}/nominee/accept/${token}` },
    });
    setSubmitting(false);
    if (otpErr) {
      toast.error(otpErr.message);
      return;
    }
    setSignInSent(true);
    toast.success("Sign-in link sent — check your email.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <Card className="max-w-2xl w-full"><CardContent className="p-8 space-y-4">
          <Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-32 w-full" />
        </CardContent></Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full text-center"><CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="bg-destructive/10 p-4 rounded-full">
              {error.includes("expired") ? <Clock className="h-12 w-12 text-destructive" /> : <AlertCircle className="h-12 w-12 text-destructive" />}
            </div>
          </div>
          <div><h2 className="text-xl font-semibold">Unable to Process</h2><p className="text-muted-foreground mt-2">{error}</p></div>
          <Button asChild><Link to="/contact">Contact Support</Link></Button>
        </CardContent></Card>
      </div>
    );
  }

  if (accepted && nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4 py-12">
        <div className="max-w-2xl w-full space-y-4">
          <AcceptanceSuccessCard
            nomineeName={nominee.name}
            certificateDownloadLocked={nominee.renomination_count < 200}
            renominationsNeeded={Math.max(0, 200 - nominee.renomination_count)}
            token={token}
            chapterName={undefined}
            region={nominee.region ?? undefined}
          />
          {referralCode && (
            <Card className="border-gold/40 bg-gold/5">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-gold-dark">
                  <Sparkles className="h-5 w-5" />
                  <p className="font-semibold">Your shareable endorsement link</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share this link so supporters can renominate and endorse you. Every endorsement counts toward your Platinum certificate.
                </p>
                <div className="bg-background rounded-md p-3 font-mono text-sm break-all border">
                  {`${window.location.origin}/nominee/${nominee.slug}?ref=${referralCode}`}
                </div>
                <Button
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal"
                  onClick={() => navigate(`/nominee/dashboard/${token}`)}
                >
                  Go to my dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (!nominee) return null;

  // Not yet accepted — show acceptance CTA with magic-link sign-in if unauthenticated
  const needsSignIn = !user || user.email?.toLowerCase() !== nominee.email?.toLowerCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4 py-12">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardContent className="p-6 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-display font-bold">Congratulations, {nominee.name}!</h1>
            <p className="text-muted-foreground">
              You have been nominated for the <strong className="text-foreground">New Education Standard Award Africa (NESA-Africa) 2026</strong>.
            </p>
            {nominee.title || nominee.organization ? (
              <p className="text-sm text-muted-foreground">
                {[nominee.title, nominee.organization].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
            <p className="font-medium">By accepting, you will:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Activate your public nominee profile at <code>/nominee/{nominee.slug}</code></li>
              <li>Unlock your private nominee dashboard</li>
              <li>Receive a unique shareable link to gather endorsements</li>
              <li>Progress toward your Platinum certificate (200 endorsements)</li>
            </ul>
          </div>

          {needsSignIn ? (
            <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Mail className="h-5 w-5" />
                <p className="font-semibold">Verify it's you</p>
              </div>
              <p className="text-sm text-muted-foreground">
                For security, we'll send a one-time sign-in link to the email on your nomination.
              </p>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  disabled={signInSent}
                />
              </div>
              <Button onClick={sendMagicLink} disabled={submitting || signInSent || !emailInput} className="w-full">
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {signInSent ? "Sign-in link sent — check your inbox" : "Send sign-in link"}
              </Button>
            </div>
          ) : (
            <Button size="lg" onClick={doAccept} disabled={submitting} className="w-full text-lg py-6">
              {submitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <CheckCircle className="h-5 w-5 mr-2" />}
              Accept My Nomination & Activate Profile
            </Button>
          )}

          <div className="text-center">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link to={`/nominee/decline/${token}`}>I'd like to decline this nomination</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
