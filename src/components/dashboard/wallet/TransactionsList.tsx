import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "lucide-react";
import { formatAgc, getEntryTypeLabel, isCredit } from "@/api/wallet";
import type { WalletLedgerEntry } from "@/types/wallet";

interface TransactionsListProps {
  transactions: WalletLedgerEntry[];
  loading?: boolean;
  limit?: number;
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

function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

function TransactionItem({ entry }: { entry: WalletLedgerEntry }) {
  const credit = isCredit(entry.direction);
  const icon = entryTypeIcons[entry.entry_type] || <Coins className="h-4 w-4" />;

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {getEntryTypeLabel(entry.entry_type)}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {entry.description || new Date(entry.created_at).toLocaleDateString()}
        </p>
      </div>
      <Badge
        variant="outline"
        className={credit ? "text-green-600 border-green-200" : "text-red-500 border-red-200"}
      >
        {credit ? "+" : "-"}{formatAgc(entry.agc_amount)}
      </Badge>
    </div>
  );
}

export function TransactionsList({ transactions, loading, limit = 10 }: TransactionsListProps) {
  const displayTransactions = transactions.slice(0, limit);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>Recent Transactions</span>
          {transactions.length > 0 && (
            <span className="text-xs text-muted-foreground font-normal">
              {transactions.length} entries
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {loading ? (
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <TransactionSkeleton key={i} />
            ))}
          </div>
        ) : displayTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Coins className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/70">
              Your wallet activity will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-0">
              {displayTransactions.map((entry) => (
                <TransactionItem key={entry.id} entry={entry} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
