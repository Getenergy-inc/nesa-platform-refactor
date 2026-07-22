import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NRCArenaLayout } from "@/components/nrc/arena/NRCArenaLayout";
import {
  NRC_TEAMS,
  NRC_TIER_META,
  NRC_TOTALS,
  type NrcTier,
} from "@/config/nrc/arenaTeams";

const TIERS: NrcTier[] = ["icon", "influencer", "platinum", "gold_blue_garnet"];

export default function NRCDirectory() {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<NrcTier | "all">("all");

  const groups = useMemo(() => {
    return TIERS.filter((t) => tier === "all" || tier === t).map((t) => ({
      tier: t,
      teams: NRC_TEAMS.filter((team) => team.tier === t)
        .filter((team) => !q || `${team.name} ${team.category}`.toLowerCase().includes(q.toLowerCase())),
    }));
  }, [tier, q]);

  return (
    <NRCArenaLayout>
      <Helmet><title>NRC Directory · NESA-Africa 2026</title></Helmet>

      <header className="mb-5">
        <p className="text-xs uppercase tracking-wider text-gold/80">Approved directory</p>
        <h1 className="font-display text-2xl font-bold">NRC Member Directory</h1>
        <p className="text-white/60 text-sm mt-1">
          Proposed structure · {NRC_TOTALS.slots} approved members across {NRC_TOTALS.teams} teams. Individual
          member profiles appear once appointments are activated.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(["all", ...TIERS] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              tier === t
                ? "bg-gold text-charcoal border-gold"
                : "border-white/15 text-white/70 hover:border-gold hover:text-gold"
            }`}
          >
            {t === "all" ? "All tiers" : NRC_TIER_META[t].short}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" aria-hidden />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search teams or categories…"
            className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.tier}>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className={`font-display text-lg font-bold ${NRC_TIER_META[g.tier].accent}`}>
                {NRC_TIER_META[g.tier].label}
              </h2>
              <span className="text-xs text-white/50">
                {g.teams.length} teams · {g.teams.reduce((n, t) => n + t.memberSlots, 0)} slots
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.teams.map((team) => (
                <Link
                  key={team.slug}
                  to={`/nrc/teams/${team.slug}`}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:border-gold hover:bg-white/[0.07] transition-colors"
                >
                  <p className="font-display font-semibold text-white leading-snug">{team.name}</p>
                  <p className="text-xs text-white/50 mt-1">{team.category}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Array.from({ length: team.memberSlots }).map((_, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-dashed border-white/20 text-white/40 text-[10px]"
                      >
                        Slot {i + 1} · open
                      </Badge>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </NRCArenaLayout>
  );
}
