import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface EarnCoinsBadgeProps {
  compact?: boolean;
  className?: string;
}

/**
 * AGC Wallet Badge — Afri-Gold Coin currency for the NESA Africa engagement economy.
 * Displays user balance as `X AGC • Y AGCc` (1 AGC = 100 AGCc).
 * Guests see an "Earn AGC" CTA.
 */
export function EarnCoinsBadge({ compact = false, className }: EarnCoinsBadgeProps) {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["agc-wallet-balance", user?.id],
    enabled: !!user,
    staleTime: 30_000,
    queryFn: async () => {
      if (!user) return { agc: 0, agcc: 0 };
      const { data: account } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (!account) return { agc: 0, agcc: 0 };
      const { data: bal } = await supabase
        .from("wallet_balances")
        .select("balance_agc, balance_agcc")
        .eq("account_id", account.id)
        .maybeSingle();
      return {
        agc: Number(bal?.balance_agc ?? 0),
        agcc: Number(bal?.balance_agcc ?? 0),
      };
    },
  });

  const agc = data?.agc ?? 0;
  const agcc = data?.agcc ?? 0;
  const agcFormatted = agc % 1 === 0 ? agc.toLocaleString() : agc.toFixed(2);

  return (
    <Link
      to="/earn-agc"
      aria-label="Earn AGC — Afri-Gold Coin rewards"
      className={cn(
        "group relative inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gradient-to-r from-gold/15 via-amber-500/10 to-gold/15 px-2.5 py-1.5 text-gold backdrop-blur transition-all hover:border-gold hover:from-gold/25 hover:via-amber-500/20 hover:to-gold/25 hover:shadow-[0_0_20px_rgba(212,170,76,0.45)]",
        compact ? "h-8" : "h-9 sm:px-3",
        className,
      )}
    >
      {/* Pulsing prestige ring */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-gold/30 animate-pulse" />

      {/* AGC token — engraved gold with shine */}
      <motion.span
        aria-hidden
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 3.2, ease: "linear", repeat: Infinity }}
        className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-gold to-amber-700 shadow-inner ring-1 ring-amber-200/60"
        style={{ transformStyle: "preserve-3d" }}
      >
        <span className="text-[8px] font-black tracking-tighter text-charcoal leading-none">AGC</span>
      </motion.span>

      {user ? (
        <span className="flex items-baseline gap-1 text-xs font-semibold tabular-nums">
          <span>{agcFormatted}</span>
          <span className="text-[9px] tracking-[0.15em] uppercase text-gold/70">AGC</span>
          <span className="hidden md:inline text-gold/40">•</span>
          <span className="hidden md:inline text-gold/80">{agcc}</span>
          <span className="hidden md:inline text-[9px] tracking-[0.15em] uppercase text-gold/60">AGCc</span>
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wide">
          <Sparkles className="h-3 w-3" />
          <span className="hidden sm:inline">Earn AGC</span>
          <span className="sm:hidden">AGC</span>
        </span>
      )}

      {/* Notification pulse */}
      <span aria-hidden className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
    </Link>
  );
}
