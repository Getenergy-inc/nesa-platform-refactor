import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Check, ExternalLink, Gift } from "lucide-react";
import { toast } from "sonner";
import { formatAgc } from "@/api/wallet";
import type { Referral } from "@/types/wallet";

interface ReferralCardProps {
  referral: Referral | null;
  totalEarnings?: number;
  loading?: boolean;
}

export function ReferralCard({ referral, totalEarnings = 0, loading }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const referralCode = referral?.referral_code || "";
  const referralLink = referralCode
    ? `${window.location.origin}/register?ref=${referralCode}`
    : "";

  const handleCopy = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-500/5 via-background to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4 text-purple-600" />
            Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/5 via-background to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-purple-600" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Earnings Summary */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Gift className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Total Earnings</p>
            <p className="font-bold text-lg">{formatAgc(totalEarnings)}</p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {referral?.total_referrals || 0} referrals
          </Badge>
        </div>

        {/* Referral Code Input */}
        {referralCode && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Your Referral Code</label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={referralCode}
                className="font-mono text-center font-semibold bg-muted/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button className="w-full" variant="default" onClick={handleCopy}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Invite Friends & Earn AGC
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Earn 5% bonus AGC when your referrals make their first transaction
        </p>
      </CardContent>
    </Card>
  );
}
