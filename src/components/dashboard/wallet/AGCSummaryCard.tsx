import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, Gift } from "lucide-react";
import { formatAgc } from "@/api/wallet";
import type { WalletBalance } from "@/types/wallet";

interface AGCSummaryCardProps {
  balance: WalletBalance | null;
  loading?: boolean;
}

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
}

function SummaryItem({ icon, label, value, colorClass }: SummaryItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{formatAgc(value)}</p>
      </div>
    </div>
  );
}

export function AGCSummaryCard({ balance, loading }: AGCSummaryCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Coins className="h-4 w-4 text-primary" />
            AGC Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const bonus = balance?.agc_bonus ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Coins className="h-4 w-4 text-primary" />
          AGC Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SummaryItem
          icon={<Gift className="h-5 w-5 text-purple-600" />}
          label="Bonus"
          value={bonus}
          colorClass="bg-purple-100 dark:bg-purple-900/30"
        />
      </CardContent>
    </Card>
  );
}
