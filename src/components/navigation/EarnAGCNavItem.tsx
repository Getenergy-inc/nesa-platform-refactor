// Earn AGC — 5th primary nav item
// Premium glowing trigger + cinematic dropdown (desktop)

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Sparkles,
  Vote,
  Share2,
  Users,
  Star,
  Calendar,
  Mail,
  UserPlus,
  Award,
  Trophy,
  Wallet,
  Flame,
  ArrowRight,
  Coins,
  PlayCircle,
  Gift,
  Target,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const fmtAGC = (n: number) =>
  n % 1 === 0 ? n.toLocaleString() : n.toFixed(2);

const EARN_GROUPS = [
  {
    title: "Account",
    icon: UserPlus,
    items: [
      { label: "Create Account", reward: "+1 AGC", to: "/auth/register", icon: UserPlus },
      { label: "Complete Profile", reward: "+1.5 AGC", to: "/dashboard/profile", icon: Star },
      { label: "Verify Email", reward: "+50 AGCc", to: "/dashboard/profile", icon: Mail },
    ],
  },
  {
    title: "Engagement",
    icon: PlayCircle,
    items: [
      { label: "Daily Login", reward: "+10 AGCc", to: "/dashboard", icon: Calendar },
      { label: "Watch Impact Stories", reward: "+15 AGCc", to: "/media/tv", icon: PlayCircle },
      { label: "Share Nominee Profile", reward: "+20 AGCc", to: "/nominees", icon: Share2 },
      { label: "Vote for Nominees", reward: "+Bonus", to: "/vote", icon: Vote },
    ],
  },
  {
    title: "Social",
    icon: Users,
    items: [
      { label: "Invite Friends", reward: "+1 AGC", to: "/dashboard?tab=referrals", icon: Users },
      { label: "Referral Signup", reward: "+2.5 AGC", to: "/dashboard?tab=referrals", icon: Gift },
      { label: "Share Campaigns", reward: "+40 AGCc", to: "/programs", icon: Share2 },
    ],
  },
  {
    title: "Movement",
    icon: Trophy,
    items: [
      { label: "Nominate Someone", reward: "+3 AGC", to: "/nominate", icon: Award },
      { label: "Attend Event", reward: "+5 AGC", to: "/upcoming-events", icon: Calendar },
      { label: "Join Local Chapter", reward: "+5 AGC", to: "/chapters", icon: Users },
      { label: "Become Ambassador", reward: "+10 AGC", to: "/ambassadors", icon: Star },
    ],
  },
] as const;

const MISSIONS = [
  { label: "Vote Today", reward: "+25 AGCc", progress: 0, to: "/vote", icon: Vote },
  { label: "Invite 3 Friends", reward: "+3 AGC", progress: 33, to: "/dashboard?tab=referrals", icon: Users },
  { label: "Watch a Legacy Story", reward: "+15 AGCc", progress: 0, to: "/media/tv", icon: PlayCircle },
];

const QUICK_LINKS = [
  { label: "Earn More AGC", to: "/earn-agc", icon: Coins },
  { label: "Leaderboard", to: "/earn-agc#leaderboard", icon: Trophy },
  { label: "AGC Wallet", to: "/dashboard/wallet", icon: Wallet },
  { label: "Reward History", to: "/earn-agc#history", icon: Sparkles },
  { label: "Voting Center", to: "/vote", icon: Vote },
  { label: "Ambassadors", to: "/ambassadors", icon: Star },
  { label: "Daily Missions", to: "/earn-agc#missions", icon: Target },
  { label: "Referrals", to: "/dashboard?tab=referrals", icon: Gift },
];

function tierFor(agc: number) {
  if (agc >= 150) return { label: "Diamond Patron", next: null, pct: 100 };
  if (agc >= 50) return { label: "Gold Ambassador", next: 150, pct: ((agc - 50) / 100) * 100 };
  if (agc >= 10) return { label: "Silver Voter", next: 50, pct: ((agc - 10) / 40) * 100 };
  return { label: "Bronze Supporter", next: 10, pct: (agc / 10) * 100 };
}

export function EarnAGCNavItem() {
  const { user } = useAuth();

  const { data: account } = useQuery({
    queryKey: ["agc-account-nav", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: balance } = useQuery({
    queryKey: ["agc-balance-nav", account?.id],
    enabled: !!account?.id,
    staleTime: 30_000,
    queryFn: async () => {
      const { data } = await supabase
        .from("wallet_balances")
        .select("balance_agc, balance_agcc")
        .eq("account_id", account!.id)
        .maybeSingle();
      return {
        agc: Number(data?.balance_agc ?? 0),
        agcc: Number(data?.balance_agcc ?? 0),
      };
    },
  });

  const agc = balance?.agc ?? 0;
  const agcc = balance?.agcc ?? 0;
  const tier = tierFor(agc);
  const streak = 5; // placeholder until streak service is wired

  return (
    <NavigationMenuItem className="shrink-0">
      <NavigationMenuTrigger
        className={cn(
          "relative h-8 xl:h-9 px-2 xl:px-3 text-[11px] xl:text-sm leading-none gap-1.5",
          "bg-gradient-to-r from-gold/15 via-amber-500/10 to-gold/15",
          "border border-gold/40 text-gold font-semibold",
          "hover:border-gold hover:from-gold/25 hover:via-amber-500/20 hover:to-gold/25",
          "data-[state=open]:from-gold/30 data-[state=open]:to-gold/30 data-[state=open]:text-gold",
          "hover:shadow-[0_0_20px_rgba(212,170,76,0.45)] focus:shadow-[0_0_20px_rgba(212,170,76,0.45)]",
          "overflow-hidden",
        )}
      >
        {/* shimmer */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/30 to-transparent group-hover:translate-x-full transition-transform duration-1000"
        />
        {/* pulsing ring */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-gold/30 animate-pulse"
        />
        {/* spinning coin */}
        <motion.span
          aria-hidden
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 3.5, ease: "linear", repeat: Infinity }}
          className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-gold to-amber-700 shadow-inner ring-1 ring-amber-200/60"
          style={{ transformStyle: "preserve-3d" }}
        >
          <span className="text-[6px] font-black tracking-tighter text-charcoal leading-none">
            AGC
          </span>
        </motion.span>
        <span className="relative z-10">Earn AGC</span>
        {/* notification ping */}
        <span aria-hidden className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <div className="w-[760px] xl:w-[860px] bg-gradient-to-br from-charcoal via-black to-charcoal text-white border border-gold/30 rounded-xl overflow-hidden shadow-[0_30px_80px_-15px_rgba(212,170,76,0.45)]">
          {/* ===== SECTION 1 — Balance / tier / streak ===== */}
          <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-gold/15 via-amber-500/5 to-transparent border-b border-gold/15 overflow-hidden">
            <div aria-hidden className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
            <div aria-hidden className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-12 gap-4 items-center">
              {/* Wallet card */}
              <div className="col-span-7 flex items-center gap-4">
                <motion.div
                  aria-hidden
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-gold to-amber-700 shadow-[0_0_30px_rgba(212,170,76,0.6)] ring-2 ring-amber-200/60"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span className="text-[11px] font-black tracking-tighter text-charcoal">AGC</span>
                </motion.div>
                <div className="min-w-0">
                  <p className="text-[9px] tracking-[0.28em] uppercase text-gold/70 flex items-center gap-1.5">
                    <Wallet className="h-3 w-3" /> AGC Wallet
                  </p>
                  {user ? (
                    <>
                      <p className="font-display text-3xl font-bold text-gold leading-none tabular-nums mt-1">
                        {fmtAGC(agc)}{" "}
                        <span className="text-sm text-gold/70 font-semibold">AGC</span>
                        <span className="text-white/40 mx-2">•</span>
                        <span className="text-xl text-gold/90 tabular-nums">{agcc}</span>{" "}
                        <span className="text-xs text-gold/70 font-semibold">AGCc</span>
                      </p>
                      <p className="text-[11px] text-white/60 mt-1">
                        Afri-Gold Coin · 1 AGC = 100 AGCc
                      </p>
                    </>
                  ) : (
                    <p className="font-display text-xl font-bold text-white mt-1 leading-snug">
                      Sign in to start earning AGC
                    </p>
                  )}
                </div>
              </div>

              {/* Tier + streak */}
              <div className="col-span-5">
                <div className="rounded-xl bg-black/40 backdrop-blur border border-gold/20 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] tracking-[0.22em] uppercase text-gold/70">Tier</p>
                      <p className="text-sm font-bold text-gold">{tier.label}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Flame className="h-4 w-4" />
                      <span className="text-sm font-bold tabular-nums">{streak}</span>
                      <span className="text-[10px] text-white/60">day streak</span>
                    </div>
                  </div>
                  <div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(4, tier.pct))}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-300 via-gold to-amber-600 shadow-[0_0_10px_rgba(212,170,76,0.6)]"
                      />
                    </div>
                    <p className="text-[10px] text-white/50 mt-1">
                      {tier.next ? `${tier.next - agc} AGC to next tier` : "Max tier reached"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SECTION 2 + 3 — Earn cards + missions ===== */}
          <div className="grid grid-cols-12 gap-4 p-5">
            {/* Earn groups */}
            <div className="col-span-8">
              <p className="text-[10px] tracking-[0.28em] uppercase text-gold/70 mb-3 flex items-center gap-1.5">
                <Trophy className="h-3 w-3" /> Quick Ways to Earn AGC
              </p>
              <div className="grid grid-cols-2 gap-3">
                {EARN_GROUPS.map((group) => {
                  const GIcon = group.icon;
                  return (
                    <div
                      key={group.title}
                      className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 hover:border-gold/30 hover:bg-gold/[0.04] transition-colors"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gold/90 flex items-center gap-1.5 mb-1.5">
                        <GIcon className="h-3 w-3" />
                        {group.title}
                      </p>
                      <ul className="space-y-0.5">
                        {group.items.map((it) => {
                          const Icon = it.icon;
                          return (
                            <li key={it.label}>
                              <Link
                                to={it.to}
                                className="group flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-gold/10 transition-colors"
                              >
                                <Icon className="h-3 w-3 text-gold/70 flex-shrink-0" />
                                <span className="text-[11px] text-white/85 truncate flex-1">
                                  {it.label}
                                </span>
                                <span className="text-[10px] font-bold text-gold tabular-nums whitespace-nowrap">
                                  {it.reward}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missions */}
            <div className="col-span-4">
              <p className="text-[10px] tracking-[0.28em] uppercase text-gold/70 mb-3 flex items-center gap-1.5">
                <Target className="h-3 w-3" /> Featured Missions
              </p>
              <ul className="space-y-2">
                {MISSIONS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <li key={m.label}>
                      <Link
                        to={m.to}
                        className="block rounded-lg border border-gold/15 bg-gradient-to-br from-gold/5 to-transparent p-2.5 hover:border-gold/40 hover:from-gold/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold/15 text-gold">
                            <Icon className="h-3 w-3" />
                          </span>
                          <span className="flex-1 text-[11px] font-semibold text-white/90 truncate">
                            {m.label}
                          </span>
                          <span className="text-[10px] font-bold text-gold tabular-nums">
                            {m.reward}
                          </span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-300 via-gold to-amber-600"
                            style={{ width: `${Math.max(4, m.progress)}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-white/40 mt-1 tabular-nums">
                          {m.progress}% complete · resets daily
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ===== SECTION 4 — Quick links ===== */}
          <div className="px-5 pb-3 pt-1">
            <p className="text-[10px] tracking-[0.28em] uppercase text-gold/70 mb-2">
              Quick Access
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {QUICK_LINKS.map((q) => {
                const Icon = q.icon;
                return (
                  <Link
                    key={q.label}
                    to={q.to}
                    className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5 text-[11px] text-white/80 hover:border-gold/30 hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    <Icon className="h-3 w-3 text-gold/80" />
                    <span className="truncate">{q.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ===== SECTION 5 — Explainer + CTAs ===== */}
          <div className="grid grid-cols-12 gap-4 px-5 py-4 border-t border-white/5 bg-black/40">
            <div className="col-span-7">
              <p className="text-[10px] tracking-[0.28em] uppercase text-gold/70 mb-1 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> What is AGC?
              </p>
              <p className="text-[11px] leading-relaxed text-white/70">
                <span className="text-gold font-semibold">AGC (Afri-Gold Coin)</span> is the
                official engagement and participation reward currency of the NESA Africa
                ecosystem. Earn AGC by supporting nominees, participating in campaigns,
                promoting education, and engaging with the movement.
              </p>
            </div>
            <div className="col-span-5 flex flex-col gap-2 justify-center">
              <Link
                to={user ? "/earn-agc" : "/auth/register"}
                className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-gold to-amber-600 px-4 py-2 text-[12px] font-bold text-charcoal hover:shadow-[0_0_25px_rgba(212,170,76,0.55)] transition-shadow"
              >
                {user ? "Start Earning AGC" : "Sign up & Earn AGC"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/awards/gold-blue-garnet"
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-gold/40 px-3 py-1.5 text-[11px] font-semibold text-gold hover:bg-gold/10 transition-colors"
                >
                  <Vote className="h-3 w-3" /> Vote & Earn
                </Link>
                <Link
                  to="/wallet"
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-gold/40 px-3 py-1.5 text-[11px] font-semibold text-gold hover:bg-gold/10 transition-colors"
                >
                  <Wallet className="h-3 w-3" /> View Wallet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
