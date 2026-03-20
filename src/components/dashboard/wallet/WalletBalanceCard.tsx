import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import type { WalletBalance } from "@/types/wallet";

interface WalletBalanceCardProps {
  balance: WalletBalance | null;
  loading?: boolean;
}

export function WalletBalanceCard({
  balance,
  loading,
}: WalletBalanceCardProps) {
  if (loading) {
    return (
      <Card className="border-white/10 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur">
        <CardContent className="p-8">
          <Skeleton className="h-8 w-32 bg-white/20 mb-4" />
          <Skeleton className="h-16 w-48 bg-white/20" />
        </CardContent>
      </Card>
    );
  }

  const agcTotal = Number(balance?.agc_total || 0);

  const formattedBalance = agcTotal.toFixed(2);
  const formattedReceived = agcTotal.toFixed(2);

  return (
    <Card className="relative overflow-hidden border border-amber-500/20 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#141414] shadow-lg shadow-amber-900/20 backdrop-blur-sm">
      {/* Gold ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.25),transparent_60%)]" />

      {/* subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,215,0,0.4) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <CardContent className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="h-5 w-5 text-amber-400" />
              <p className="text-xs font-semibold tracking-widest text-amber-400/80 uppercase">
                Wallet Balance
              </p>
            </div>

            <p className="text-6xl font-bold text-white tracking-tight leading-none">
              {formattedBalance}
              <span className="ml-2 text-2xl text-amber-400/80 font-semibold">
                AGC
              </span>
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-amber-300/80 font-medium">
                Available Balance
              </span>

              <span className="text-[10px] px-2 py-[2px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Coin Icon */}
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/40">
            <Coins className="h-9 w-9 text-black" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-6 grid grid-cols-2 gap-6">
          {/* Received */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
              <ArrowUpCircle className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <p className="text-[11px] tracking-wider uppercase text-emerald-400/60">
                Total Received
              </p>

              <p className="text-lg font-semibold text-white">
                +{formattedReceived}
                <span className="ml-1 text-sm text-emerald-400/70">AGC</span>
              </p>
            </div>
          </div>

          {/* Spent */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-rose-500/15 flex items-center justify-center border border-rose-500/20">
              <ArrowDownCircle className="h-5 w-5 text-rose-400" />
            </div>

            <div>
              <p className="text-[11px] tracking-wider uppercase text-rose-400/60">
                Total Spent
              </p>

              <p className="text-lg font-semibold text-white">
                0.00
                <span className="ml-1 text-sm text-rose-400/70">AGC</span>
              </p>
            </div>
          </div>
        </div>

        {/* Exchange rate */}
        {/* <div className="mt-5 text-[11px] text-amber-400/40 text-right tracking-wide">
          1 AGC ≈ $0.10 USD
        </div> */}
      </CardContent>
    </Card>
  );
}
