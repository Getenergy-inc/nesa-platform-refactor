import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Coins, TrendingUp } from "lucide-react";
import { AGC_CONVERSION_RATE } from "@/config/agcConfig";

interface AGCConversionCardProps {
  className?: string;
}

export function AGCConversionCard({ className }: AGCConversionCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Coins className="h-5 w-5 text-gold" />
          AGCc vs AGC (How the System Works)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          To make participation accessible, NESA uses two balances:
        </p>

        {/* Two Balance Types */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* AGCc */}
          <div className="rounded-lg border p-4 bg-secondary/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <TrendingUp className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">AGCc</h4>
                <p className="text-xs text-muted-foreground">Afri Gold Coin cents</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Earned through daily activity and engagement
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Cannot be used directly to vote
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Converts automatically into AGC
              </li>
            </ul>
          </div>

          {/* AGC */}
          <div className="rounded-lg border p-4 bg-gold/10 border-gold/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold">
                <Coins className="h-5 w-5 text-charcoal" />
              </div>
              <div>
                <h4 className="font-semibold">AGC</h4>
                <p className="text-xs text-muted-foreground">Afri Gold Coin</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold">•</span>
                Used directly for voting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">•</span>
                Earned through conversion
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold">•</span>
                Also earned via paid support, referrals, and sponsorships
              </li>
            </ul>
          </div>
        </div>

        {/* Conversion Rule */}
        <div className="rounded-lg bg-gradient-to-r from-secondary/50 to-gold/20 p-6">
          <h4 className="font-medium mb-4 text-center">Conversion Rule</h4>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{AGC_CONVERSION_RATE}</p>
              <p className="text-sm text-muted-foreground">AGCc</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gold">1</p>
              <p className="text-sm text-muted-foreground">AGC</p>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Conversion is automatic and system-controlled.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
