import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  FileText,
  Vote,
  Heart,
  Ticket,
  Gift,
  Users,
  Coins,
  ArrowRightLeft,
  ChevronRight,
} from "lucide-react";
import { formatAgc, getEntryTypeLabel, isCredit } from "@/api/wallet";
import type { WalletLedgerEntry } from "@/types/wallet";

interface TransactionsTableProps {
  transactions: WalletLedgerEntry[];
  loading?: boolean;
  showViewAll?: boolean;
  showAll?: boolean;
  onViewAll?: () => void;
}

const entryTypeIcons: Record<string, React.ReactNode> = {
  TOPUP: <ArrowUpCircle className="h-4 w-4 text-green-600" />,
  NOMINATION_FEE: <FileText className="h-4 w-4 text-blue-600" />,
  VOTE_FEE: <Vote className="h-4 w-4 text-purple-600" />,
  DONATION: <Heart className="h-4 w-4 text-red-500" />,
  TICKET: <Ticket className="h-4 w-4 text-orange-600" />,
  REFERRAL_BONUS: <Users className="h-4 w-4 text-green-600" />,
  AMBASSADOR_BONUS: <Gift className="h-4 w-4 text-purple-600" />,
  CHAPTER_BONUS: <Coins className="h-4 w-4 text-primary" />,
  WITHDRAW_REQUEST: <ArrowDownCircle className="h-4 w-4 text-orange-500" />,
  WITHDRAW_APPROVED: <ArrowDownCircle className="h-4 w-4 text-green-600" />,
  ADJUSTMENT: <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />,
};

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/10">
      <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-24 bg-white/10" />
        <Skeleton className="h-3 w-32 bg-white/10" />
      </div>
      <Skeleton className="h-5 w-16 bg-white/10" />
    </div>
  );
}

function TransactionRow({ entry }: { entry: WalletLedgerEntry }) {
  const credit = isCredit(entry.walletDirection);
  const date = new Date(entry.createdAt);
  const formatted = `${date.toLocaleDateString()} • ${date.toLocaleTimeString()}`;
  const icon = entryTypeIcons[entry.transactionType] || (
    <Coins className="h-4 w-4" />
  );

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-white truncate">
          {getEntryTypeLabel(entry.transactionType)}
        </p>
        <p className="text-xs text-ivory/40 truncate">{formatted}</p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "border-0 px-2 py-1",
          credit
            ? "text-green-400 bg-green-500/10"
            : "text-red-400 bg-red-500/10",
        )}
      >
        {credit ? "+" : "-"}
        {formatAgc(entry.agcAmount.toString())}
      </Badge>
    </div>
  );
}

export function TransactionsTable({
  transactions,
  loading,
  showViewAll,
  showAll,
  onViewAll,
}: TransactionsTableProps) {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);

  if (loading) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Coins className="h-12 w-12 text-ivory/20 mb-3" />
            <p className="text-sm text-ivory/60">No transactions yet</p>
            <p className="text-xs text-ivory/40 mt-1">
              Your wallet activity will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Transactions</CardTitle>
        {showViewAll && transactions.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-gold hover:text-gold/80"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className={showAll ? "h-[500px]" : "h-auto"}>
          <div className="space-y-0 pr-4">
            {displayTransactions.map((entry) => (
              <TransactionRow key={entry.id} entry={entry} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
