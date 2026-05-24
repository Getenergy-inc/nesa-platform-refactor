import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Share2, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useVolunteers } from "@/hooks/useVolunteers";
import { TEAM_LABELS, tierFor, TIER_LABEL } from "@/lib/volunteersData";

export default function VolunteerLeaderboard() {
  const { volunteers, loading } = useVolunteers();
  const top = volunteers.slice(0, 50);
  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet><title>Volunteer Leaderboard — NESA-Africa</title></Helmet>
      <section className="container mx-auto px-4 pt-12">
        <Link to="/volunteers" className="inline-flex items-center gap-1 text-gold/80 hover:text-gold text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-7 w-7 text-gold" />
          <h1 className="font-playfair text-4xl md:text-5xl text-gold font-bold">Leaderboard</h1>
        </div>
        <p className="text-white/70 max-w-2xl">Top contributors ranked by contribution score, referrals, and tasks completed.</p>

        <Card className="mt-8 border-gold/20 bg-gradient-to-br from-charcoal to-black overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-white/60">Loading…</div>
          ) : (
            <div className="divide-y divide-gold/10">
              {top.map((v, i) => {
                const tier = tierFor(v.contributionScore);
                const rank = i + 1;
                const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
                return (
                  <Link key={v.id} to={`/volunteers/${v.slug}`}
                        className="flex items-center gap-4 p-4 hover:bg-gold/5 transition">
                    <div className="w-10 text-center font-mono text-gold text-lg">{medal}</div>
                    <div className="h-11 w-11 rounded-full bg-gold/20 overflow-hidden shrink-0">
                      {v.photoUrl ? <img src={v.photoUrl} alt="" className="h-full w-full object-cover" /> :
                        <div className="h-full w-full flex items-center justify-center text-gold/60 text-sm">{v.fullName.charAt(0)}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-white truncate">{v.fullName}</span>
                        {v.badges.includes("verified") && <BadgeCheck className="h-4 w-4 text-gold shrink-0" />}
                      </div>
                      <div className="text-xs text-white/50 truncate">
                        {v.teamSlug && TEAM_LABELS[v.teamSlug]} {v.country && `· ${v.country}`} · {TIER_LABEL[tier]}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-gold font-bold">{v.contributionScore}</div>
                      <div className="text-[10px] text-white/50 flex items-center gap-1 justify-end">
                        <Share2 className="h-3 w-3" /> {v.referralCount}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
