import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { useNominees } from "@/hooks/useNominees";
import { normalizeRegion } from "@/lib/regions";

const REGIONS: { slug: string; label: string; match: string; flag: string }[] = [
  { slug: "west-africa", label: "West Africa", match: "west", flag: "🌍" },
  { slug: "east-africa", label: "East Africa", match: "east", flag: "🌍" },
  { slug: "central-africa", label: "Central Africa", match: "central", flag: "🌍" },
  { slug: "southern-africa", label: "Southern Africa", match: "south", flag: "🌍" },
  { slug: "north-africa", label: "North Africa", match: "north", flag: "🌍" },
  { slug: "horn-of-africa", label: "Horn of Africa", match: "horn", flag: "🌍" },
  { slug: "indian-ocean-islands", label: "Indian Ocean Islands", match: "indian", flag: "🏝️" },
  { slug: "diaspora", label: "Diaspora & Global Africa", match: "diaspora", flag: "🌐" },
];

/**
 * Interactive region explorer for the nominees directory.
 * Clicking a region updates the `?region=` URL param to filter the hub.
 */
export function AfricaRegionExplorer() {
  const { data: nominees } = useNominees();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const active = params.get("region") ?? "all";

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    (nominees ?? []).forEach((n) => {
      const norm = normalizeRegion(n.region ?? "").toLowerCase();
      REGIONS.forEach((r) => {
        if (norm.includes(r.match)) m[r.slug] = (m[r.slug] ?? 0) + 1;
      });
    });
    return m;
  }, [nominees]);

  const setRegion = (slug: string) => {
    const next = new URLSearchParams(params);
    if (active === slug) next.delete("region");
    else next.set("region", slug);
    navigate({ pathname: "/nominees", search: `?${next.toString()}` });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section aria-labelledby="region-explorer-heading" className="mb-10">
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h2
            id="region-explorer-heading"
            className="font-display text-xl md:text-2xl font-bold text-ivory flex items-center gap-2"
          >
            <MapPin className="w-5 h-5 text-gold" /> Explore by African Region
          </h2>
          <p className="text-xs md:text-sm text-ivory/60 mt-1">
            Discover nominees across all 8 NESA-Africa legacy regions.
          </p>
        </div>
        {active !== "all" && (
          <button
            type="button"
            onClick={() => setRegion(active)}
            className="text-xs text-gold underline-offset-4 hover:underline"
          >
            Clear region filter
          </button>
        )}
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {REGIONS.map((r, i) => {
          const count = counts[r.slug] ?? 0;
          const isActive = active === r.slug;
          return (
            <motion.li
              key={r.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <button
                type="button"
                onClick={() => setRegion(r.slug)}
                aria-pressed={isActive}
                className={`group relative w-full text-left rounded-xl border px-3 py-3 transition-all ${
                  isActive
                    ? "bg-gold/15 border-gold shadow-md shadow-gold/10"
                    : "bg-charcoal-light/40 border-gold/15 hover:border-gold/50 hover:bg-charcoal-light/70"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-lg" aria-hidden>
                    {r.flag}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? "text-gold translate-x-0.5" : "text-ivory/30 group-hover:text-gold group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-ivory leading-tight">{r.label}</p>
                <p className="text-[11px] text-ivory/55 mt-0.5">
                  {count.toLocaleString()} nominee{count === 1 ? "" : "s"}
                </p>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

export default AfricaRegionExplorer;
