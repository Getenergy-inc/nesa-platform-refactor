import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NRCArenaLayout } from "@/components/nrc/arena/NRCArenaLayout";
import {
  NRC_TEAMS,
  NRC_TIER_META,
  NRC_TOTALS,
  type NrcTier,
} from "@/config/nrc/arenaTeams";

const TIERS: (NrcTier | "all")[] = ["all", "icon", "influencer", "platinum", "gold_blue_garnet"];

export default function NRCTeams() {
  const [tier, setTier] = useState<NrcTier | "all">("all");
  const [q, setQ] = useState("");

  const teams = useMemo(() => {
    return NRC_TEAMS.filter((t) => tier === "all" || t.tier === tier)
      .filter((t) => !q || `${t.name} ${t.category}`.toLowerCase().includes(q.toLowerCase()));
  }, [tier, q]);

  return (
    <NRCArenaLayout>
      <Helmet><title>NRC Teams · NESA-Africa 2026</title></Helmet>
      <header className="mb-5">
        <p className="text-xs uppercase tracking-wider text-gold/80">Operational teams</p>
        <h1 className="font-display text-2xl font-bold">NRC Teams</h1>
        <p className="text-white/60 text-sm mt-1">
          {NRC_TOTALS.teams} teams · {NRC_TOTALS.slots} approved member slots across 4 recognition tiers.
        </p>
      </header>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {TIERS.map((t) => (
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
            placeholder="Search teams…"
            className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => (
          <Link
            key={t.slug}
            to={`/nrc/teams/${t.slug}`}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:border-gold hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <Badge variant="outline" className={`border-white/20 ${NRC_TIER_META[t.tier].accent} text-[10px]`}>
                {NRC_TIER_META[t.tier].short}
              </Badge>
              <span className="text-xs text-white/50 inline-flex items-center gap-1">
                <Users className="h-3 w-3" /> {t.memberSlots}
              </span>
            </div>
            <h3 className="mt-2 font-display font-semibold text-white leading-snug">{t.name}</h3>
            {t.pathway && t.tier !== "icon" && (
              <p className="mt-1 text-xs text-white/55">{t.pathway}</p>
            )}
            <p className="mt-3 text-[11px] text-white/45 uppercase tracking-wider">Roles</p>
            <ul className="mt-1 text-xs text-white/70 space-y-0.5">
              {t.roles.map((r) => <li key={r}>· {r}</li>)}
            </ul>
          </Link>
        ))}
      </div>
      {teams.length === 0 && (
        <p className="mt-8 text-center text-white/50 text-sm">No teams match your filters.</p>
      )}
    </NRCArenaLayout>
  );
}
