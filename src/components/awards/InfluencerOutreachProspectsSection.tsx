import { useMemo, useState } from "react";
import { Search, Globe2, Users, ShieldCheck } from "lucide-react";
import {
  INFLUENCER_PROSPECTS,
  INFLUENCER_PROSPECT_REGIONS,
} from "@/data/influencerProspects";

/**
 * Influencer Education Impact — Outreach Prospects.
 *
 * Renders the 250 prospective nominees extracted from the NESA-Africa 2026
 * Influencer Outreach Register. These are prospects only (not endorsements)
 * and require verification and written consent before public recognition.
 */
export function InfluencerOutreachProspectsSection() {
  const [region, setRegion] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return INFLUENCER_PROSPECTS.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${p.name} ${p.knownWork} ${p.impactAngle} ${p.prospectType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [region, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof INFLUENCER_PROSPECTS>();
    INFLUENCER_PROSPECT_REGIONS.forEach((r) => map.set(r, []));
    filtered.forEach((p) => {
      const arr = map.get(p.region) ?? [];
      arr.push(p);
      map.set(p.region, arr);
    });
    return map;
  }, [filtered]);

  const total = INFLUENCER_PROSPECTS.length;
  const countries = INFLUENCER_PROSPECT_REGIONS.length;

  return (
    <section
      id="outreach-prospects"
      className="border-t border-gold/10 bg-black/40 py-14 lg:py-20 scroll-mt-20"
      aria-label="Influencer Outreach Prospects Register"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">
            NESA-Africa 2026 Outreach Register
          </p>
          <h2 className="mt-2 font-playfair text-3xl text-white sm:text-4xl">
            Africa's Education Influencer Prospects
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-white/70">
            250 continental voices identified for education-impact outreach across 10 regional
            groupings. Prospects only — recognition follows verification and written consent.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4" />} value={total} label="Prospects" />
          <StatCard icon={<Globe2 className="h-4 w-4" />} value={countries} label="Regions" />
          <StatCard icon={<ShieldCheck className="h-4 w-4" />} value={"NRC"} label="Verified by" />
          <StatCard icon={<Users className="h-4 w-4" />} value={filtered.length} label="Showing" />
        </div>

        <div className="sticky top-16 z-10 mb-6 flex flex-col gap-3 rounded-2xl border border-gold/20 bg-black/70 p-3 backdrop-blur sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, work, or angle"
              className="w-full rounded-lg border border-gold/20 bg-black/40 px-9 py-2 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
            />
          </div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-lg border border-gold/20 bg-black/40 px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
          >
            <option value="all">All Regions</option>
            {INFLUENCER_PROSPECT_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-10">
          {INFLUENCER_PROSPECT_REGIONS.map((r) => {
            const list = grouped.get(r) ?? [];
            if (list.length === 0) return null;
            return (
              <div key={r}>
                <div className="mb-3 flex items-baseline justify-between border-b border-gold/10 pb-2">
                  <h3 className="font-playfair text-xl text-gold">{r}</h3>
                  <span className="text-xs text-white/50">{list.length} prospects</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => (
                    <article
                      key={p.id}
                      className="rounded-xl border border-gold/15 bg-black/50 p-4 transition hover:border-gold/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-white">{p.name}</h4>
                        <span className="shrink-0 rounded-full border border-gold/30 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gold/80">
                          #{p.no}
                        </span>
                      </div>
                      {p.knownWork && (
                        <p className="mt-1 text-xs text-white/60">{p.knownWork}</p>
                      )}
                      {p.prospectType && (
                        <p className="mt-2 text-[11px] uppercase tracking-wide text-gold/70">
                          {p.prospectType}
                        </p>
                      )}
                      {p.impactAngle && (
                        <p className="mt-2 text-xs text-white/70">{p.impactAngle}</p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-white/50">
              No prospects match your search.
            </p>
          )}
        </div>

        <p className="mt-10 text-center text-xs text-white/40">
          Source: NESA-Africa 2026 Influencer Outreach Register · Prospect only — do not announce
          publicly without written consent.
        </p>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-gold/20 bg-black/50 p-3 text-center">
      <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold">
        {icon}
      </div>
      <div className="font-playfair text-xl text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-white/60">{label}</div>
    </div>
  );
}
