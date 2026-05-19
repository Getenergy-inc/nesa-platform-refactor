import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Coins, Sparkles, Trophy, Flame, Users, Share2, Heart, Vote, Calendar,
  CheckCircle2, ArrowRight, Award, Crown, Star, Gift, Target, Rocket,
  PartyPopper, Medal, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// ============= Earn Actions =============
type EarnAction = { label: string; coins: number; icon: any };

const ACCOUNT_ACTIONS: EarnAction[] = [
  { label: "Create Account", coins: 100, icon: Sparkles },
  { label: "Complete Profile", coins: 150, icon: CheckCircle2 },
  { label: "Verify Email", coins: 50, icon: CheckCircle2 },
  { label: "Upload Profile Photo", coins: 25, icon: Heart },
];
const ENGAGEMENT_ACTIONS: EarnAction[] = [
  { label: "Daily Login", coins: 10, icon: Calendar },
  { label: "Share Nominee Profile", coins: 20, icon: Share2 },
  { label: "Share Voting Campaign", coins: 30, icon: Share2 },
  { label: "Watch Impact Stories", coins: 15, icon: Vote },
  { label: "Comment on Stories", coins: 10, icon: MessageCircle },
  { label: "Save Nominee", coins: 10, icon: Heart },
];
const SOCIAL_ACTIONS: EarnAction[] = [
  { label: "Invite Friends", coins: 100, icon: Users },
  { label: "Referral Signup", coins: 250, icon: Users },
  { label: "Share on Social Media", coins: 40, icon: Share2 },
  { label: "Use Official Hashtag", coins: 20, icon: Sparkles },
];
const MOVEMENT_ACTIONS: EarnAction[] = [
  { label: "Nominate Someone", coins: 300, icon: Star },
  { label: "Attend Virtual Event", coins: 100, icon: Calendar },
  { label: "Attend Gala / Event", coins: 500, icon: Crown },
  { label: "Become Ambassador", coins: 1000, icon: Medal },
  { label: "Join Local Chapter", coins: 500, icon: Users },
];

// ============= Tiers =============
const TIERS = [
  { name: "Bronze Supporter", min: 0, max: 999, color: "from-amber-700 to-amber-500", icon: Award },
  { name: "Silver Advocate", min: 1000, max: 4999, color: "from-zinc-400 to-zinc-200", icon: Medal },
  { name: "Gold Ambassador", min: 5000, max: 14999, color: "from-amber-300 to-gold", icon: Trophy },
  { name: "Platinum Education Champion", min: 15000, max: Infinity, color: "from-sky-200 via-fuchsia-300 to-amber-200", icon: Crown },
];

const LEADERBOARD = [
  { name: "Adaeze O.", country: "Nigeria", coins: 28450, badge: "Platinum" },
  { name: "Thabo M.", country: "South Africa", coins: 19320, badge: "Platinum" },
  { name: "Amara K.", country: "Ghana", coins: 12780, badge: "Gold" },
  { name: "Kwame A.", country: "Kenya", coins: 9540, badge: "Gold" },
  { name: "Fatou D.", country: "Senegal", coins: 7210, badge: "Gold" },
  { name: "Lerato S.", country: "Botswana", coins: 4880, badge: "Silver" },
  { name: "Chinedu O.", country: "Nigeria", coins: 3220, badge: "Silver" },
];

const DAILY_MISSIONS = [
  { label: "Cast 1 vote today", coins: 15, progress: 0, target: 1, icon: Vote },
  { label: "Share 1 nominee profile", coins: 20, progress: 0, target: 1, icon: Share2 },
  { label: "Invite a friend", coins: 100, progress: 0, target: 1, icon: Users },
  { label: "Watch 1 impact story", coins: 15, progress: 0, target: 1, icon: PartyPopper },
];

function ActionGroup({ title, eyebrow, actions, accent = "gold" }: {
  title: string; eyebrow: string; actions: EarnAction[]; accent?: "gold" | "emerald" | "sky" | "purple";
}) {
  const accentClass = {
    gold: "text-gold border-gold/40 from-gold/10",
    emerald: "text-emerald-300 border-emerald-500/40 from-emerald-500/10",
    sky: "text-sky-300 border-sky-500/40 from-sky-500/10",
    purple: "text-purple-300 border-purple-500/40 from-purple-500/10",
  }[accent];

  return (
    <div>
      <p className={cn("text-[10px] tracking-[0.32em] uppercase font-semibold mb-2", accentClass.split(" ")[0])}>
        {eyebrow}
      </p>
      <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-4">{title}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.label}
              whileHover={{ y: -2 }}
              className={cn(
                "group relative rounded-2xl border bg-gradient-to-br to-transparent backdrop-blur p-4 transition-all hover:shadow-[0_0_24px_rgba(212,170,76,0.18)]",
                accentClass,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-black/40", accentClass.split(" ")[0])}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-white/90 leading-tight">{a.label}</span>
                </div>
                <span className={cn("inline-flex items-center gap-1 rounded-full border bg-black/40 px-2 py-0.5 text-xs font-bold tabular-nums", accentClass)}>
                  <Coins className="h-3 w-3" />
                  +{a.coins}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function EarnVotingCoins() {
  const { user } = useAuth();
  const [demoCoins] = useState(1250);

  const currentTier = useMemo(() => {
    return TIERS.find((t) => demoCoins >= t.min && demoCoins <= t.max) ?? TIERS[0];
  }, [demoCoins]);
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const tierProgress = nextTier
    ? Math.min(100, ((demoCoins - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  return (
    <>
      <Helmet>
        <title>Earn Voting Coins | NESA-Africa</title>
        <meta
          name="description"
          content="Earn NESA Africa Voting Coins by joining, sharing, nominating and supporting Africa's education movement. Unlock tiers, badges and leaderboards."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/earn-voting-coins" />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gold/10 bg-gradient-to-b from-black via-charcoal to-charcoal">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/4 h-[36rem] w-[36rem] rounded-full bg-gold/20 blur-3xl opacity-50" />
          <div className="absolute -bottom-32 right-1/4 h-[28rem] w-[28rem] rounded-full bg-amber-500/15 blur-3xl opacity-50" />
        </div>

        {/* Floating coins */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 22}%` }}
              animate={{ y: [0, -18, 0], rotate: [0, 360] }}
              transition={{ duration: 6 + i, ease: "easeInOut", repeat: Infinity, delay: i * 0.4 }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-gold to-amber-600 shadow-lg opacity-40">
                <Coins className="h-3.5 w-3.5 text-charcoal" />
              </span>
            </motion.div>
          ))}
        </div>

        <div className="container relative mx-auto px-4 py-14 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <Badge variant="outline" className="mb-5 border-gold/40 bg-gold/10 px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-gold">
                <Sparkles className="mr-1.5 h-3 w-3" />
                NESA Africa Rewards
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white">
                Earn Voting Coins &{" "}
                <span className="bg-gradient-to-r from-amber-200 via-gold to-amber-300 bg-clip-text text-transparent">
                  Power Education Impact
                </span>{" "}
                Across Africa
              </h1>
              <p className="mt-5 max-w-xl text-base md:text-lg text-white/70">
                Support nominees, participate in the movement, complete engagement actions, and earn voting power across the NESA Africa ecosystem.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-gold px-6 font-semibold text-charcoal hover:bg-gold/90">
                  <Link to={user ? "/dashboard" : "/auth/register"}>
                    Start Earning Coins <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-gold/40 px-6 text-gold hover:bg-gold/10">
                  <a href="#tiers">Explore Reward Levels</a>
                </Button>
              </div>
            </motion.div>

            {/* Wallet card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl border border-gold/30 bg-gradient-to-br from-charcoal via-black to-charcoal p-6 backdrop-blur shadow-[0_0_60px_rgba(212,170,76,0.15)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] tracking-[0.28em] uppercase text-gold/70">Your Balance</p>
                    <p className="font-display text-4xl font-bold text-gold mt-1 tabular-nums">
                      {(user ? demoCoins : 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5">Voting Coins</p>
                  </div>
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-gold to-amber-600 shadow-[0_0_30px_rgba(212,170,76,0.5)]"
                  >
                    <Coins className="h-7 w-7 text-charcoal" />
                  </motion.div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white/70 flex items-center gap-1.5">
                      <currentTier.icon className="h-3.5 w-3.5 text-gold" />
                      {currentTier.name}
                    </span>
                    {nextTier && (
                      <span className="text-white/50">
                        {(nextTier.min - demoCoins).toLocaleString()} → {nextTier.name}
                      </span>
                    )}
                  </div>
                  <Progress value={tierProgress} className="h-2 bg-white/10" />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Streak", value: "5d", icon: Flame },
                    { label: "Missions", value: "2/4", icon: Target },
                    { label: "Rank", value: "#247", icon: Trophy },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gold/20 bg-white/[0.03] p-2.5">
                      <s.icon className="h-4 w-4 text-gold mx-auto" />
                      <p className="mt-1 text-sm font-bold text-white tabular-nums">{s.value}</p>
                      <p className="text-[10px] text-white/50">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT ARE COINS */}
      <section className="border-b border-gold/10 bg-charcoal py-14">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-[10px] tracking-[0.32em] uppercase font-semibold text-gold/80">01 · The Basics</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">What Are Voting Coins?</h2>
            <p className="mt-4 text-white/70 max-w-prose">
              Voting Coins are digital engagement rewards you earn for participating in the NESA Africa ecosystem.
              They turn every action — a share, a vote, an invite, an event — into real voting power for the
              education leaders and institutions shaping Africa's future.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Vote, label: "Vote for nominees" },
              { icon: Sparkles, label: "Unlock premium engagement" },
              { icon: Heart, label: "Support categories" },
              { icon: Rocket, label: "Boost campaigns" },
              { icon: Crown, label: "Earn ambassador status" },
              { icon: Gift, label: "Redeem exclusive perks" },
            ].map((u) => (
              <div key={u.label} className="flex items-center gap-3 rounded-2xl border border-gold/20 bg-white/[0.03] p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  <u.icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-white/85">{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAYS TO EARN */}
      <section className="border-b border-gold/10 bg-gradient-to-b from-charcoal via-black to-charcoal py-14">
        <div className="container mx-auto px-4 space-y-10">
          <div className="max-w-2xl">
            <p className="text-[10px] tracking-[0.32em] uppercase font-semibold text-gold/80">02 · Earn</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">Ways to Earn Voting Coins</h2>
            <p className="mt-3 text-white/70">
              Every meaningful action across the platform rewards you. Stack actions, build streaks, and climb the
              leaderboard.
            </p>
          </div>
          <ActionGroup title="Account & Platform" eyebrow="Onboarding" actions={ACCOUNT_ACTIONS} accent="gold" />
          <ActionGroup title="Engagement" eyebrow="Daily Activity" actions={ENGAGEMENT_ACTIONS} accent="emerald" />
          <ActionGroup title="Social" eyebrow="Amplify the Movement" actions={SOCIAL_ACTIONS} accent="purple" />
          <ActionGroup title="Education Movement" eyebrow="High Impact" actions={MOVEMENT_ACTIONS} accent="sky" />
        </div>
      </section>

      {/* TIERS */}
      <section id="tiers" className="border-b border-gold/10 bg-charcoal py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-[10px] tracking-[0.32em] uppercase font-semibold text-gold/80">03 · Levels</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">Reward Tiers</h2>
            <p className="mt-3 text-white/70">
              Climb four tiers. Each level unlocks badges, voting boosts, exclusive experiences and leaderboard prestige.
            </p>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((t) => {
              const Icon = t.icon;
              const active = t.name === currentTier.name;
              return (
                <motion.div
                  key={t.name}
                  whileHover={{ y: -3 }}
                  className={cn(
                    "relative rounded-3xl border bg-gradient-to-b from-white/[0.04] to-transparent p-5 backdrop-blur transition-all",
                    active ? "border-gold ring-1 ring-gold/40 shadow-[0_0_30px_rgba(212,170,76,0.25)]" : "border-white/10",
                  )}
                >
                  {active && (
                    <span className="absolute -top-2.5 left-4 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-charcoal">
                      You're Here
                    </span>
                  )}
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-inner", t.color)}>
                    <Icon className="h-6 w-6 text-charcoal" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{t.name}</h3>
                  <p className="mt-1 text-xs text-white/60 tabular-nums">
                    {t.min.toLocaleString()}{t.max === Infinity ? "+" : `–${t.max.toLocaleString()}`} coins
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-white/70">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-gold" /> Profile badge</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-gold" /> Voting boost</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-gold" /> Leaderboard rank</li>
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEADERBOARD + DAILY MISSIONS */}
      <section className="border-b border-gold/10 bg-gradient-to-b from-charcoal via-black to-charcoal py-14">
        <div className="container mx-auto px-4 grid lg:grid-cols-5 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-3">
            <p className="text-[10px] tracking-[0.32em] uppercase font-semibold text-gold/80">04 · Glory</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">Top Education Supporters</h2>
            <p className="mt-3 text-white/70 max-w-prose">
              The most active voices, voters and ambassadors powering the movement this season.
            </p>
            <div className="mt-6 rounded-3xl border border-gold/20 bg-charcoal/60 backdrop-blur overflow-hidden">
              <ul className="divide-y divide-white/5">
                {LEADERBOARD.map((row, i) => (
                  <li key={row.name} className={cn(
                    "flex items-center gap-4 p-4 transition-colors hover:bg-gold/[0.04]",
                    i < 3 && "bg-gradient-to-r from-gold/[0.06] to-transparent",
                  )}>
                    <span className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                      i === 0 && "bg-gradient-to-br from-amber-200 to-gold text-charcoal",
                      i === 1 && "bg-gradient-to-br from-zinc-300 to-zinc-100 text-charcoal",
                      i === 2 && "bg-gradient-to-br from-amber-700 to-amber-500 text-white",
                      i > 2 && "bg-white/5 text-white/70 border border-white/10",
                    )}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{row.name}</p>
                      <p className="text-[11px] text-white/50">{row.country}</p>
                    </div>
                    <span className="text-[10px] tracking-wider uppercase text-gold/80 hidden sm:inline">{row.badge}</span>
                    <span className="flex items-center gap-1 text-sm font-bold text-gold tabular-nums">
                      <Coins className="h-3.5 w-3.5" />
                      {row.coins.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Daily Missions */}
          <div className="lg:col-span-2">
            <p className="text-[10px] tracking-[0.32em] uppercase font-semibold text-gold/80">05 · Today</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">Daily Missions</h2>
            <p className="mt-3 text-white/70">Complete all four to keep your streak alive.</p>

            <div className="mt-6 rounded-3xl border border-gold/20 bg-charcoal/60 p-4 backdrop-blur">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Flame className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-semibold text-white">5-Day Streak</span>
                <span className="ml-auto text-[10px] tracking-wider uppercase text-amber-300/80">+25 bonus</span>
              </div>
              <ul className="space-y-2.5">
                {DAILY_MISSIONS.map((m) => {
                  const Icon = m.icon;
                  const pct = (m.progress / m.target) * 100;
                  return (
                    <li key={m.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/90 truncate">{m.label}</p>
                          <Progress value={pct} className="mt-1.5 h-1 bg-white/10" />
                        </div>
                        <span className="flex items-center gap-1 rounded-full border border-gold/40 bg-black/40 px-2 py-0.5 text-[11px] font-bold text-gold tabular-nums">
                          <Coins className="h-3 w-3" />
                          +{m.coins}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-charcoal py-14">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-black via-charcoal to-black p-8 md:p-12 text-center">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[24rem] w-[24rem] rounded-full bg-gold/15 blur-3xl" />
            </div>
            <PartyPopper className="relative mx-auto h-10 w-10 text-gold" />
            <h2 className="relative mt-4 font-display text-3xl md:text-5xl font-bold text-white">
              Your Coins. <span className="bg-gradient-to-r from-amber-200 via-gold to-amber-300 bg-clip-text text-transparent">Africa's Future.</span>
            </h2>
            <p className="relative mt-3 max-w-xl mx-auto text-white/70">
              Every coin becomes a vote, every vote becomes a voice, every voice helps shape education across the continent.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-gold px-6 font-semibold text-charcoal hover:bg-gold/90">
                <Link to={user ? "/dashboard" : "/auth/register"}>
                  Start Earning Now <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-gold/40 px-6 text-gold hover:bg-gold/10">
                <Link to="/nominees">Browse Nominees</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
