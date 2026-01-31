import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { Loader2, ExternalLink, Gift, CheckCircle, AlertCircle, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Sponsor {
  id: string;
  name: string;
  slug: string;
  tier: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  cta_links: { label: string; url: string }[];
}

interface Campaign {
  id: string;
  name: string;
  credit_per_claim_agc: number;
  pool_remaining_agc: number;
  status: string;
  start_at: string;
  end_at: string;
}

export default function SponsorLanding() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadSponsor();
      logClick();
    }
  }, [slug]);

  useEffect(() => {
    if (user && campaign) {
      checkExistingClaim();
    }
  }, [user, campaign]);

  const loadSponsor = async () => {
    if (!slug) return;
    setLoading(true);
    
    // Load sponsor
    const { data: sponsorData, error: sponsorError } = await supabase
      .from("sponsors")
      .select("*")
      .eq("slug", slug)
      .eq("status", "ACTIVE")
      .single();

    if (sponsorError || !sponsorData) {
      navigate("/partners");
      return;
    }

    setSponsor({
      ...sponsorData,
      cta_links: (sponsorData.cta_links_json as { label: string; url: string }[]) || [],
    });

    // Load active campaign
    const now = new Date().toISOString();
    const { data: campaignData } = await supabase
      .from("sponsor_campaigns")
      .select("*")
      .eq("sponsor_id", sponsorData.id)
      .eq("status", "ACTIVE")
      .lte("start_at", now)
      .gte("end_at", now)
      .gt("pool_remaining_agc", 0)
      .single();

    if (campaignData) {
      setCampaign(campaignData);
    }

    setLoading(false);
  };

  const logClick = async () => {
    if (!slug) return;
    try {
      await supabase.functions.invoke("sponsors", {
        method: "POST",
        body: { action: "click", slug },
      });
    } catch (e) {
      // Silent fail for analytics
    }
  };

  const checkExistingClaim = async () => {
    if (!user || !campaign) return;
    
    const { data } = await supabase
      .from("sponsor_claims")
      .select("id")
      .eq("campaign_id", campaign.id)
      .eq("user_id", user.id)
      .single();

    if (data) {
      setClaimed(true);
    }
  };

  const handleClaim = async () => {
    if (!user || !campaign || !slug) {
      return;
    }

    setClaiming(true);
    setClaimError(null);

    try {
      const { data, error } = await supabase.functions.invoke("sponsors", {
        method: "POST",
        body: { action: "claim", slug },
      });

      if (error) throw error;

      if (data?.ok) {
        setClaimed(true);
        toast.success(`+${campaign.credit_per_claim_agc} AGC credited to your wallet!`);
      } else {
        setClaimError(data?.error || "Claim failed");
      }
    } catch (e: any) {
      setClaimError(e.message || "Failed to claim credits");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (!sponsor) return null;

  return (
    <PublicLayout>
      <Helmet>
        <title>{sponsor.name} | NESA-Africa Sponsor</title>
        <meta name="description" content={sponsor.description || `${sponsor.name} is a proud sponsor of NESA-Africa.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            {/* Sponsor Header */}
            <Card className="bg-card border-border mb-8">
              <CardContent className="p-8 text-center">
                {sponsor.logo_url && (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    className="h-24 w-auto mx-auto mb-6 object-contain"
                  />
                )}
                <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                  {sponsor.tier} Partner
                </Badge>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  {sponsor.name}
                </h1>
                {sponsor.description && (
                  <p className="text-muted-foreground mb-6">{sponsor.description}</p>
                )}
                
                {/* CTA Links */}
                {sponsor.cta_links.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {sponsor.cta_links.map((link, i) => (
                      <Button key={i} variant="outline" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.label}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ))}
                  </div>
                )}

                {sponsor.website_url && (
                  <Button variant="ghost" asChild>
                    <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Claim Widget */}
            {campaign && (
              <Card className="bg-gradient-to-r from-primary/10 to-gold/10 border-primary/30">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <GFAWalletIcon size={32} />
                    <CardTitle className="text-2xl">Claim Voting Credits (AGC)</CardTitle>
                  </div>
                  <p className="text-muted-foreground">
                    {sponsor.name} is sponsoring <span className="text-gold font-bold">+{campaign.credit_per_claim_agc} AGC</span> for verified users
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  {authLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : !user ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Log in or sign up to claim your voting credits
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button asChild>
                          <Link to={`/login?redirect=/sponsors/${slug}`}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Log In
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/register?redirect=/sponsors/${slug}`}>Sign Up</Link>
                        </Button>
                      </div>
                    </div>
                  ) : claimed ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-medium">You've already claimed credits from this campaign!</span>
                    </div>
                  ) : claimError ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                        <span>{claimError}</span>
                      </div>
                      <Button onClick={handleClaim} disabled={claiming}>
                        {claiming ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-gradient-gold text-secondary font-semibold"
                      onClick={handleClaim}
                      disabled={claiming}
                    >
                      {claiming ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <Gift className="mr-2 h-5 w-5" />
                      )}
                      Claim +{campaign.credit_per_claim_agc} AGC
                    </Button>
                  )}

                  {/* AGC Disclaimer */}
                  <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                    <p className="text-xs text-warning">
                      ⚠️ AGC is non-tradeable—no withdrawals, no cash-out, no payouts. Credits are used exclusively for voting within the NESA-Africa/SCEF ecosystem.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Back Link */}
            <div className="text-center mt-8">
              <Button variant="ghost" asChild>
                <Link to="/partners">← Back to Partners</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
