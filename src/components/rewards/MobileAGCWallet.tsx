import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Vote, Share2, Users, Star, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/**
 * MobileAGCWallet — floating AGC wallet widget + sticky "Earn AGC" CTA for mobile.
 * Hidden on lg+ (header badge handles desktop). Hidden on /earn-agc and /auth/* routes.
 * Sits above MobileBottomNav (bottom-0, h-16) and BottomPageNav (bottom-16).
 */
const QUICK = [
  { label: "Vote",     reward: "+15 AGCc", to: "/nominees", icon: Vote },
  { label: "Share",    reward: "+20 AGCc", to: "/nominees", icon: Share2 },
  { label: "Invite",   reward: "+1 AGC",   to: "/dashboard", icon: Users },
  { label: "Nominate", reward: "+3 AGC",   to: "/nominate", icon: Star },
];

const fmtAGC = (n: number) => (n % 1 === 0 ? n.toLocaleString() : n.toFixed(2));

export function MobileAGCWallet() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const { data: balance } = useQuery({
    queryKey: ["agc-mobile-balance", user?.id],
    enabled: !!user,
    staleTime: 30_000,
    queryFn: async () => {
      const { data: account } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user!.id)
        .maybeSingle();
      if (!account) return { agc: 0, agcc: 0 };
      const { data } = await supabase
        .from("wallet_balances")
        .select("balance_agc, balance_agcc")
        .eq("account_id", account.id)
        .maybeSingle();
      return { agc: Number(data?.balance_agc ?? 0), agcc: Number(data?.balance_agcc ?? 0) };
    },
  });

  // Hide on AGC pages or auth flows
  if (
    pathname.startsWith("/earn-agc") ||
    pathname.startsWith("/agc-rewards") ||
    pathname.startsWith("/auth")
  ) {
    return null;
  }

  const agc = balance?.agc ?? 0;
  const agcc = balance?.agcc ?? 0;

  return (
    <>
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating widget — above MobileBottomNav (h-16) + BottomPageNav (h-16) */}
      <div className="fixed right-3 z-[56] lg:hidden pointer-events-none" style={{ bottom: "calc(8rem + env(safe-area-inset-bottom))" }}>
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="pointer-events-auto w-[280px] rounded-2xl border border-gold/30 bg-gradient-to-b from-charcoal via-black to-charcoal shadow-[0_20px_60px_-15px_rgba(212,170,76,0.5)] overflow-hidden"
            >
              {/* Header */}
              <div className="relative px-4 pt-3.5 pb-3 bg-gradient-to-br from-gold/15 via-amber-500/5 to-transparent border-b border-gold/15">
                <div aria-hidden className="absolute -top-8 -right-6 h-24 w-24 rounded-full bg-gold/25 blur-3xl pointer-events-none" />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close AGC wallet"
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <p className="text-[9px] tracking-[0.28em] uppercase text-gold/70">AGC Wallet</p>
                {user ? (
                  <>
                    <p className="font-display text-2xl font-bold text-gold mt-0.5 tabular-nums leading-none">
                      {fmtAGC(agc)} <span className="text-xs text-gold/70 font-semibold">AGC</span>
                    </p>
                    <p className="text-[11px] text-white/60 mt-1 tabular-nums">
                      + <span className="text-gold/90 font-semibold">{agcc} AGCc</span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-white mt-1 max-w-[180px] leading-snug">
                    Sign in to start earning AGC
                  </p>
                )}
              </div>

              {/* Quick earn */}
              <div className="px-3 py-3">
                <p className="text-[9px] tracking-[0.28em] uppercase text-gold/70 mb-2 px-1 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Quick Earn
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK.map((q) => {
                    const Icon = q.icon;
                    return (
                      <Link
                        key={q.label}
                        to={q.to}
                        onClick={() => setOpen(false)}
                        className="group flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 hover:bg-gold/10 hover:border-gold/40 transition-colors active:scale-95"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15 text-gold">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-[11px] font-semibold text-white/90 leading-none">{q.label}</span>
                        <span className="text-[10px] font-bold text-gold tabular-nums leading-none">{q.reward}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Footer CTA */}
              <Link
                to={user ? "/earn-agc" : "/auth/register"}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-gold py-3 text-sm font-bold text-charcoal hover:bg-gold/90 active:bg-amber-500 transition-colors"
              >
                {user ? "Earn More AGC" : "Sign up to Earn"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            /* ===== Collapsed floating wallet pill ===== */
            <motion.button
              key="pill"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setOpen(true)}
              aria-label="Open AGC wallet"
              className={cn(
                "pointer-events-auto relative inline-flex items-center gap-2 rounded-full border border-gold/50",
                "bg-gradient-to-r from-charcoal via-black to-charcoal pl-1.5 pr-3 py-1.5",
                "shadow-[0_10px_30px_-8px_rgba(212,170,76,0.6)] backdrop-blur",
              )}
            >
              {/* Pulsing ring */}
              <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-gold/30 animate-pulse" />
              {/* Spinning AGC token */}
              <motion.span
                aria-hidden
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3.5, ease: "linear", repeat: Infinity }}
                className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-gold to-amber-700 shadow-inner ring-1 ring-amber-200/70"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="text-[9px] font-black tracking-tighter text-charcoal leading-none">AGC</span>
              </motion.span>

              {user ? (
                <span className="flex items-baseline gap-1 text-xs font-bold text-gold tabular-nums">
                  {fmtAGC(agc)}
                  <span className="text-[9px] tracking-[0.15em] uppercase text-gold/70">AGC</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-gold">
                  <Sparkles className="h-3 w-3" /> Earn AGC
                </span>
              )}

              {/* Notification ping */}
              <span aria-hidden className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Sticky "Earn AGC" bottom strip (subtle, full-width) ===== */}
      {!open && (
        <Link
          to={user ? "/earn-agc" : "/auth/register"}
          aria-label="Earn AGC"
          className="fixed left-3 z-[54] lg:hidden inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-charcoal/90 pl-2 pr-3 py-1.5 text-[11px] font-bold text-gold backdrop-blur shadow-lg hover:bg-gold/15 transition-colors"
          style={{ bottom: "calc(8rem + env(safe-area-inset-bottom))" }}
        >
          <Sparkles className="h-3 w-3" />
          Earn AGC
        </Link>
      )}
    </>
  );
}

export default MobileAGCWallet;
