import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Coins, DollarSign } from "lucide-react";
import { formatAgc, formatUsd } from "@/api/wallet";
import type { WalletBalance } from "@/types/wallet";

interface BalanceCardProps {
  balance: WalletBalance | null;
  loading?: boolean;
}

export function BalanceCard({ balance, loading }: BalanceCardProps) {
  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <CardHeader className="relative pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-24" />
        </CardContent>
      </Card>
    );
  }

  // const usdBalance = balance?.usd_balance ?? 0;
  const agcTotal = balance?.agc_total ?? 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          Account Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-3">
        <div>
          <p className="text-3xl font-bold tracking-tight">
            {formatAgc(agcTotal)}
            {/* {formatUsd(usdBalance)} */}
          </p>
          {/* <p className="text-xs text-muted-foreground">USD Equivalent</p> */}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Coins className="mr-1 h-3 w-3" />
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
