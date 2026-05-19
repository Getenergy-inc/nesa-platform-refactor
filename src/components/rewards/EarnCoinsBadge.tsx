import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Coins, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface EarnCoinsBadgeProps {
  compact?: boolean;
  className?: string;
}

export function EarnCoinsBadge({ compact = false, className }: EarnCoinsBadgeProps) {
  const { user } = useAuth();

  const { data: balance } = useQuery({
    queryKey: ["voting-coins-balance", user?.id],
    enabled: !!user,
    staleTime: 30_000,
    queryFn: async () => {
      if (!user) return 0;
      const { data: account } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (!account) return 0;
      const { data: bal } = await supabase
        .from("wallet_balances")
        .select("balance_agcc")
        .eq("account_id", account.id)
        .maybeSingle();
      return bal?.balance_agcc ?? 0;
    },
  });

  const coins = balance ?? 0;
  const formatted = coins.toLocaleString();

  return (
    <Link
      to="/earn-voting-coins"
      aria-label="Earn Voting Coins"
      className={cn(
        "group relative inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gradient-to-r from-gold/15 via-amber-500/10 to-gold/15 px-2.5 py-1.5 text-gold backdrop-blur transition-all hover:border-gold hover:from-gold/25 hover:via-amber-500/20 hover:to-gold/25 hover:shadow-[0_0_20px_rgba(212,170,76,0.45)]",
        compact ? "h-8" : "h-9 sm:px-3",
        className,
      )}
    >
      {/* Pulsing glow ring */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-gold/30 animate-pulse" />

      {/* Spinning coin */}
      <motion.span
        aria-hidden
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 3.2, ease: "linear", repeat: Infinity }}
        className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-gold to-amber-600 shadow-inner"
      >
        <Coins className="h-3 w-3 text-charcoal" />
      </motion.span>

      {user ? (
        <span className="flex items-center gap-1 text-xs font-semibold tabular-nums">
          <span className={cn("hidden sm:inline text-[10px] tracking-[0.18em] uppercase text-gold/70")}>
            Coins
          </span>
          <span>{formatted}</span>
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wide">
          <Sparkles className="h-3 w-3" />
          <span className="hidden sm:inline">Earn Voting Coins</span>
          <span className="sm:hidden">Earn</span>
        </span>
      )}

      {/* Notification pulse dot */}
      <span aria-hidden className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
    </Link>
  );
}
