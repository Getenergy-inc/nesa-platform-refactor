import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Share2, Users, Gift, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useReferralCode } from "@/hooks/useReferralCode";
import { toast } from "sonner";
import referralsApi from "@/api/referrals";
import { REFERRAL_EARN_COPY, AGC_BONUS_RATES } from "@/constants/agc";

interface ReferralLinkCardProps {
  compact?: boolean;
}

export function ReferralLinkCard({ compact = false }: ReferralLinkCardProps) {
  const { user, loading: authLoading } = useAuth();
  const { generateReferralLink } = useReferralCode();
  const navigate = useNavigate();
  
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
  });

  // Load user's referral code
  useEffect(() => {
    if (user) {
      loadReferralInfo();
    }
  }, [user]);

  const loadReferralInfo = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await referralsApi.getMyReferral();
      
      if (!error && data) {
        if (data.referral?.referral_code) {
          setReferralCode(data.referral.referral_code);
          setReferralLink(generateReferralLink(data.referral.referral_code));
        }
        if (data.earnings) {
          setStats({
            totalReferrals: data.earnings.total_referrals || 0,
            totalEarnings: data.earnings.total_agc || 0,
          });
        }
      }
    } catch (e) {
      console.error("Failed to load referral info:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await referralsApi.generateInviteLink();
      
      if (error) {
        toast.error("Failed to generate referral link");
        return;
      }
      
      if (data) {
        setReferralCode(data.referral_code);
        setReferralLink(data.invite_link || generateReferralLink(data.referral_code));
        toast.success("Referral link generated!");
      }
    } catch (e) {
      toast.error("Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "NESA-Africa Gala 2026",
          text: "Join me at the NESA-Africa Grand Gala Night! Use my referral link to get tickets:",
          url: referralLink,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  // Not logged in state
  if (!authLoading && !user) {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6 text-center">
          <Gift className="mx-auto h-10 w-10 text-primary mb-3" />
          <h3 className="font-semibold text-lg mb-2">Refer & Earn Voting Credits</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to get your unique referral link and earn AGC when friends buy tickets.
          </p>
          <Button onClick={() => navigate("/login?redirect=/buy-your-ticket")}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In to Get Link
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <Card className="border-primary/30">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Compact variant
  if (compact && referralLink) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
        <Input
          value={referralLink}
          readOnly
          className="text-sm bg-muted/50"
        />
        <Button size="sm" onClick={handleCopy} variant={copied ? "secondary" : "default"}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button size="sm" variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{REFERRAL_EARN_COPY.title}</CardTitle>
            <CardDescription>{REFERRAL_EARN_COPY.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* How it works */}
        <div className="space-y-2">
          <p className="text-sm font-medium">How it works:</p>
          <ol className="space-y-1 text-sm text-muted-foreground">
            {REFERRAL_EARN_COPY.howItWorks.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold text-primary">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Bonus info */}
        <div className="flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-2">
          <Gift className="h-4 w-4 text-gold" />
          <span className="text-sm">
            Earn <span className="font-bold text-gold">+{AGC_BONUS_RATES.referralFirstPurchase} AGC</span> per referred ticket purchase!
          </span>
        </div>

        {/* Referral link section */}
        {referralLink ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={referralLink}
                readOnly
                className="font-mono text-sm bg-muted/50"
              />
              <Button 
                size="icon" 
                onClick={handleCopy} 
                variant={copied ? "secondary" : "default"}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShare} className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Share & Earn
              </Button>
              <Button variant="outline" asChild>
                <Link to="/wallet">
                  View Earnings
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleGenerateLink} className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Gift className="mr-2 h-4 w-4" />
            )}
            Get My Referral Link
          </Button>
        )}

        {/* Stats */}
        {(stats.totalReferrals > 0 || stats.totalEarnings > 0) && (
          <div className="flex gap-4 pt-2 border-t">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-primary">{stats.totalReferrals}</p>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gold">{stats.totalEarnings} AGC</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center">
          🔒 {REFERRAL_EARN_COPY.disclaimer}
        </p>
      </CardContent>
    </Card>
  );
}
