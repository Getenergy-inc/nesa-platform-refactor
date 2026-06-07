import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  CATEGORIES,
  RECOGNITION_CLASSES,
  REGIONS,
  SOCIAL_PLATFORMS,
  SPORT_AREAS,
  MUSIC_GENRES,
  SOCIAL_CONTENT_IMPACT_AREAS,
  SPORTS_IMPACT_AREAS,
  MUSIC_IMPACT_AREAS,
  SEED_NOMINEES,
  COUNTRIES_BY_REGION,
  ALL_COUNTRIES,
  filterNominees,
  type CategoryId,
  type NomineeFilters,
} from "@/config/awards/influencerImpact2026";
import { NomineeCard } from "./NomineeCard";

interface Props {
  category: CategoryId | "all";
  onCategoryChange: (c: CategoryId | "all") => void;
}

export function NomineeDiscovery({ category, onCategoryChange }: Props) {
  const [filters, setFilters] = useState<NomineeFilters>({});
  const [search, setSearch] = useState("");

  const allImpactAreas = [
    ...SOCIAL_CONTENT_IMPACT_AREAS,
    ...SPORTS_IMPACT_AREAS,
    ...MUSIC_IMPACT_AREAS,
  ];

  const countries = useMemo(
    () => Array.from(new Set(SEED_NOMINEES.map((n) => n.nominee_country))).sort(),
    [],
  );

  const results = useMemo(
    () =>
      filterNominees(SEED_NOMINEES, {
        ...filters,
        category,
        search,
      }),
    [filters, category, search],
  );

  const update = (patch: Partial<NomineeFilters>) =>
    setFilters((p) => ({ ...p, ...patch }));

  return (
    <section id="nominees" className="py-14 border-t border-white/5 scroll-mt-20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Nominee <span className="text-primary">Discovery Platform</span>
          </h2>
          <p className="text-white/65 text-sm md:text-base max-w-2xl mx-auto">
            Searchable, filterable, classification-based. Find nominees by
            category, recognition class, region, country, platform, sport, music
            genre, education impact area, and verification status.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nominee, foundation, campaign, club, label, platform, creator, athlete or artist."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold/60"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
          <Select
            label="Category"
            value={category}
            options={[
              { v: "all", l: "All Categories" },
              ...CATEGORIES.map((c) => ({ v: c.id, l: c.shortName })),
            ]}
            onChange={(v) => onCategoryChange(v as CategoryId | "all")}
          />
          <Select
            label="Recognition Class"
            value={filters.recognitionClass ?? "all"}
            options={[
              { v: "all", l: "All Classes" },
              ...RECOGNITION_CLASSES.map((r) => ({ v: r, l: r })),
            ]}
            onChange={(v) => update({ recognitionClass: v as any })}
          />
          <Select
            label="Region"
            value={filters.region ?? "all"}
            options={[
              { v: "all", l: "All Regions" },
              ...REGIONS.map((r) => ({ v: r, l: r })),
            ]}
            onChange={(v) => update({ region: v as any })}
          />
          <Select
            label="Country"
            value={filters.country ?? "all"}
            options={[
              { v: "all", l: "All Countries" },
              ...countries.map((c) => ({ v: c, l: c })),
            ]}
            onChange={(v) => update({ country: v })}
          />
          <Select
            label="Verification"
            value={filters.verification ?? "all"}
            options={[
              { v: "all", l: "All Statuses" },
              { v: "VERIFIED", l: "Verified" },
              { v: "PENDING", l: "Pending" },
              { v: "REJECTED", l: "Rejected" },
            ]}
            onChange={(v) => update({ verification: v as any })}
          />

          {(category === "all" || category === "social-media") && (
            <Select
              label="Platform"
              value={filters.platform ?? "all"}
              options={[
                { v: "all", l: "All Platforms" },
                ...SOCIAL_PLATFORMS.map((p) => ({ v: p, l: p })),
              ]}
              onChange={(v) => update({ platform: v })}
            />
          )}
          {(category === "all" || category === "sports") && (
            <Select
              label="Sport Area"
              value={filters.sportArea ?? "all"}
              options={[
                { v: "all", l: "All Sports" },
                ...SPORT_AREAS.map((s) => ({ v: s, l: s })),
              ]}
              onChange={(v) => update({ sportArea: v })}
            />
          )}
          {(category === "all" || category === "music") && (
            <Select
              label="Music Genre"
              value={filters.musicGenre ?? "all"}
              options={[
                { v: "all", l: "All Genres" },
                ...MUSIC_GENRES.map((g) => ({ v: g, l: g })),
              ]}
              onChange={(v) => update({ musicGenre: v })}
            />
          )}
          <Select
            label="Education Impact Area"
            value={filters.impactArea ?? "all"}
            options={[
              { v: "all", l: "All Impact Areas" },
              ...Array.from(new Set(allImpactAreas)).map((a) => ({ v: a, l: a })),
            ]}
            onChange={(v) => update({ impactArea: v })}
          />
        </div>

        <p className="text-xs text-white/55 mb-4" data-testid="nominee-result-count">
          {results.length} {results.length === 1 ? "nominee" : "nominees"} match
          your filters
        </p>

        {/* Grid */}
        {results.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((n) => (
              <NomineeCard key={n.slug} nominee={n} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-white/60 text-sm">
            No nominees match these filters. Try widening your search.
          </div>
        )}
      </div>
    </section>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { v: string; l: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-white/45 block mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/85 text-xs focus:outline-none focus:border-gold/60"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v} className="bg-charcoal">
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}
