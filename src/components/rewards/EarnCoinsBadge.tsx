import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, Vote, Share2, Users, Star, Calendar, Trophy, Wallet, History,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EarnCoinsBadgeProps {
  compact?: boolean;
  className?: string;
}

const QUICK_EARN = [
  { label: "Vote for a nominee",   reward: "+15 AGCc", to: "/nominees",     icon: Vote },
  { label: "Share a profile",      reward: "+20 AGCc", to: "/nominees",     icon: Share2 },
  { label: "Invite a friend",      reward: "+1 AGC",   to: "/dashboard",    icon: Users },
  { label: "Nominate someone",     reward: "+3 AGC",   to: "/nominate",     icon: Star },
  { label: "Join an event",        reward: "+1 AGC",   to: "/upcoming-events", icon: Calendar },
];

const fmtAGC = (n: number) => (n % 1 === 0 ? n.toLocaleString() : n.toFixed(2));
const relTime = (iso: string) => {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
};

/**
 * AGC Wallet Badge — Afri-Gold Coin currency for the NESA Africa engagement economy.
 * Click opens a premium dropdown: mini balance · last earnings · quick-earn shortcuts.
 */
export function EarnCoinsBadge({ compact = false, className }: EarnCoinsBadgeProps) {
  const { user } = useAuth();

  const { data: account } = useQuery({
    queryKey: ["agc-account", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: balance } = useQuery({
    queryKey: ["agc-balance", account?.id],
    enabled: !!account?.id,
    staleTime: 30_000,
    queryFn: async () => {
      const { data } = await supabase
        .from("wallet_balances")
        .select("balance_agc, balance_agcc")
        .eq("account_id", account!.id)
        .maybeSingle();
      return { agc: Number(data?.balance_agc ?? 0), agcc: Number(data?.balance_agcc ?? 0) };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["agc-recent", account?.id],
    enabled: !!account?.id,
    staleTime: 30_000,
    queryFn: async () => {
      const { data } = await supabase
        .from("wallet_transactions")
        .select("id, amount_agc, amount_agcc, description, source, tx_type, created_at")
        .eq("account_id", account!.id)
        .eq("tx_type", "EARN")
        .order("created_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  const agc = balance?.agc ?? 0;
  const agcc = balance?.agcc ?? 0;

  const trigger = (
    <button
      type="button"
      aria-label="AGC wallet · Afri-Gold Coin rewards"
      className={cn(
        "group relative inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gradient-to-r from-gold/15 via-amber-500/10 to-gold/15 px-2.5 py-1.5 text-gold backdrop-blur transition-all hover:border-gold hover:from-gold/25 hover:via-amber-500/20 hover:to-gold/25 hover:shadow-[0_0_20px_rgba(212,170,76,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
        compact ? "h-8" : "h-9 sm:px-3",
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-gold/30 animate-pulse" />
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
          <span>{fmtAGC(agc)}</span>
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

      <span aria-hidden className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
    </button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[320px] p-0 border border-gold/30 bg-gradient-to-b from-charcoal via-black to-charcoal text-white shadow-[0_20px_60px_-15px_rgba(212,170,76,0.45)] rounded-2xl overflow-hidden"
      >
        {/* ===== Balance header ===== */}
        <div className="relative px-4 pt-4 pb-3 bg-gradient-to-br from-gold/15 via-amber-500/5 to-transparent border-b border-gold/15">
          <div aria-hidden className="absolute -top-10 -right-8 h-32 w-32 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[9px] tracking-[0.28em] uppercase text-gold/70 flex items-center gap-1.5">
                <Wallet className="h-3 w-3" /> AGC Wallet
              </p>
              {user ? (
                <>
                  <p className="font-display text-2xl font-bold text-gold mt-1 tabular-nums leading-none">
                    {fmtAGC(agc)} <span className="text-xs text-gold/70 font-semibold">AGC</span>
                  </p>
                  <p className="text-[11px] text-white/60 mt-1 tabular-nums">
                    + <span className="text-gold/90 font-semibold">{agcc} AGCc</span> · Afri-Gold Cents
                  </p>
                </>
              ) : (
                <p className="font-display text-base font-bold text-white mt-1 leading-snug">
                  Sign in to start<br />earning AGC
                </p>
              )}
            </div>
            <motion.div
              aria-hidden
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 5, ease: "linear", repeat: Infinity }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-gold to-amber-700 shadow-[0_0_24px_rgba(212,170,76,0.55)] ring-1 ring-amber-200/60"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="text-[10px] font-black tracking-tighter text-charcoal">AGC</span>
            </motion.div>
          </div>
        </div>

        {/* ===== Recent earnings ===== */}
        {user && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] tracking-[0.28em] uppercase text-gold/70 flex items-center gap-1.5">
                <History className="h-3 w-3" /> Recent Earnings
              </p>
              <Link to="/earn-agc#history" className="text-[10px] text-gold/80 hover:text-gold underline-offset-2 hover:underline">
                View all
              </Link>
            </div>
            {recent && recent.length > 0 ? (
              <ul className="space-y-1">
                {recent.map((r) => {
                  const agcAmt = Number(r.amount_agc ?? 0);
                  const agccAmt = Number(r.amount_agcc ?? 0);
                  const label = agcAmt > 0 ? `+${fmtAGC(agcAmt)} AGC` : `+${agccAmt} AGCc`;
                  return (
                    <li key={r.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.04]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold flex-shrink-0">
                        <Sparkles className="h-3 w-3" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-white/90 truncate leading-tight">
                          {r.description || r.source?.toString().replace(/_/g, " ").toLowerCase() || "AGC earned"}
                        </p>
                        <p className="text-[10px] text-white/40">{relTime(r.created_at)}</p>
                      </div>
                      <span className="text-[11px] font-bold text-gold tabular-nums whitespace-nowrap">{label}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 px-3 py-3 text-center">
                <p className="text-[11px] text-white/50">No earnings yet — complete an action below to start.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== Quick earn shortcuts ===== */}
        <div className="px-4 pt-3 pb-2 border-t border-white/5">
          <p className="text-[9px] tracking-[0.28em] uppercase text-gold/70 mb-2 flex items-center gap-1.5">
            <Trophy className="h-3 w-3" /> Quick Earn
          </p>
          <ul className="grid grid-cols-1 gap-1">
            {QUICK_EARN.slice(0, 4).map((q) => {
              const Icon = q.icon;
              return (
                <li key={q.label}>
                  <Link
                    to={q.to}
                    className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gold/10 transition-colors"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-gold/90 group-hover:bg-gold/20">
                      <Icon className="h-3 w-3" />
                    </span>
                    <span className="flex-1 text-[12px] text-white/90 leading-tight">{q.label}</span>
                    <span className="text-[10px] font-bold text-gold tabular-nums whitespace-nowrap">{q.reward}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ===== Footer CTAs ===== */}
        <div className="px-3 pb-3 pt-2 grid grid-cols-2 gap-2 border-t border-white/5 bg-black/30">
          <Link
            to="/earn-agc"
            className="inline-flex items-center justify-center gap-1 rounded-full border border-gold/40 px-3 py-1.5 text-[11px] font-semibold text-gold hover:bg-gold/10 transition-colors"
          >
            Reward Levels
          </Link>
          <Link
            to={user ? "/earn-agc" : "/auth/register"}
            className="inline-flex items-center justify-center gap-1 rounded-full bg-gold px-3 py-1.5 text-[11px] font-bold text-charcoal hover:bg-gold/90 transition-colors"
          >
            {user ? "Earn AGC" : "Sign up"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
