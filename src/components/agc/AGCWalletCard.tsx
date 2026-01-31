import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, ArrowRightLeft, Wallet, TrendingUp } from "lucide-react";
import { formatAgc, formatAgcc, AGC_CONVERSION_RATE } from "@/config/agcConfig";

interface AGCWalletCardProps {
  agccBalance: number;
  agcBalance: number;
  loading?: boolean;
  onConvert?: () => void;
  canConvert?: boolean;
}

export function AGCWalletCard({
  agccBalance,
  agcBalance,
  loading,
  onConvert,
  canConvert = false,
}: AGCWalletCardProps) {
  const convertibleAgc = Math.floor(agccBalance / AGC_CONVERSION_RATE);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-background to-gold/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-primary" />
            AGC Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-gold/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-primary" />
          AGC Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* AGCc Balance */}
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              AGCc (Cents)
            </div>
            <p className="text-2xl font-bold text-foreground">
              {formatAgcc(agccBalance)}
            </p>
            {convertibleAgc > 0 && (
              <p className="text-xs text-primary mt-1">
                ≈ {formatAgc(convertibleAgc)} convertible
              </p>
            )}
          </div>

          {/* AGC Balance */}
          <div className="rounded-lg bg-gold/10 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Coins className="h-4 w-4 text-gold" />
              AGC (Voting)
            </div>
            <p className="text-2xl font-bold text-gold">
              {formatAgc(agcBalance)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Available for voting
            </p>
          </div>
        </div>

        {/* Conversion */}
        <div className="flex items-center justify-between rounded-lg border border-dashed p-3 bg-muted/30">
          <div className="flex items-center gap-2 text-sm">
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {AGC_CONVERSION_RATE} AGCc = 1 AGC
            </span>
          </div>
          {canConvert && convertibleAgc > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={onConvert}
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Convert
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
