import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Radio,
  Trophy,
  Music,
  ArrowRight,
  Globe2,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  CATEGORIES,
  REGIONS,
  SEED_NOMINEES,
  COUNTRIES_BY_REGION,
  NOMINATE_URL,
  type CategoryId,
  type RegionId,
  type InfluencerNominee,
} from "@/config/awards/influencerImpact2026";
import { NomineeCard } from "@/components/influencer-impact/NomineeCard";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

/**
 * Influencer Education Impact — Existing Nominees & Hall of Fame Preview.
 *
 * Replaces the generic HallOfFamePreview with a dynamic discovery hub organised
 * by the three recognition subcategories (Social Media, Sports, Music) and grouped
 * by 8 African regions + African Diaspora.
 */
export function InfluencerHallOfFameSection() {
  const [pathway, setPathway] = useState<CategoryId | "all">("all");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<RegionId | "all">("all");

  const filtered = useMemo(() => {
    return SEED_NOMINEES.filter((n) => {
      if (pathway !== "all" && n.award_category !== pathway) return false;
      if (region !== "all" && n.nominee_region !== region) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay =
          `${n.nominee_name} ${n.nominee_country} ${n.education_impact_summary} ${n.club_team_or_foundation ?? ""} ${n.label_or_foundation ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [pathway, region, search]);

  const byRegion = useMemo(() => {
    const map = new Map<RegionId, InfluencerNominee[]>();
    REGIONS.forEach((r) => map.set(r, []));
    filtered.forEach((n) => map.get(n.nominee_region)?.push(n));
    return map;
  }, [filtered]);

  const stats = useMemo(() => {
    const total = SEED_NOMINEES.length;
    const social = SEED_NOMINEES.filter((n) => n.award_category === "social-media").length;
    const sports = SEED_NOMINEES.filter((n) => n.award_category === "sports").length;
    const music = SEED_NOMINEES.filter((n) => n.award_category === "music").length;
    const countries = new Set(SEED_NOMINEES.map((n) => n.nominee_country)).size;
    const regions = new Set(SEED_NOMINEES.map((n) => n.nominee_region)).size;
    const diaspora = SEED_NOMINEES.filter(
      (n) => n.recognition_class === "African in the Diaspora",
    ).length;
    const verified = SEED_NOMINEES.filter((n) => n.verification_status === "VERIFIED").length;
    return { total, social, sports, music, countries, regions, diaspora, verified };
  }, []);

  return (
    <section
      id="existing-nominees"
      className="border-t border-gold/10 bg-black/40 py-14 lg:py-20 scroll-mt-20"
      aria-label="Existing Nominees and Hall of Fame Preview"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
            <Sparkles className="h-3 w-3" /> Existing Nominees · Hall of Fame Preview
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Africa's Education Influencers <span className="text-gold">Discovery Hub</span>
          </h2>
          <p className="mt-4 text-white/70 text-sm md:text-base leading-relaxed">
            Explore some of Africa's leading public figures using their influence to advance
            Education for All. Browse nominees by recognition subcategory and discover inspiring
            Education Enablers from across Africa and the African Diaspora.
          </p>
        </div>

        {/* Recognition Subcategory Cards */}
        <div className="grid gap-5 md:grid-cols-3 mb-12">
          <PathwayCard
            id="social-media"
            title="African Social Media Influencers Education Impact Award"
            icon={Radio}
            gradient="from-sky-500/25 via-sky-500/5 to-transparent"
            description="Digital creators, educational influencers, podcasters, bloggers and online advocates using digital platforms to improve learning across Africa."
            recognises={[
              "Social Media Creators",
              "Educational Content Creators",
              "YouTubers",
              "Podcasters",
              "Bloggers",
              "Digital Learning Creators",
              "Online Community Builders",
              "Educational Newsletter Publishers",
            ]}
            onView={() => {
              setPathway("social-media");
              document.getElementById("influencer-regional-grid")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            active={pathway === "social-media"}
          />
          <PathwayCard
            id="sports"
            title="African Sports Icons Supporting Education"
            icon={Trophy}
            gradient="from-amber-500/25 via-amber-500/5 to-transparent"
            description="Celebrating athletes, coaches, sports academies and sports leaders investing in scholarships, school development, youth empowerment and educational transformation."
            recognises={[
              "Footballers",
              "Athletes",
              "Basketball Players",
              "Rugby Players",
              "Cricket Players",
              "Tennis Players",
              "Sports Academies",
              "Coaches",
              "Sports Foundations",
            ]}
            onView={() => {
              setPathway("sports");
              document.getElementById("influencer-regional-grid")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            active={pathway === "sports"}
          />
          <PathwayCard
            id="music"
            title="African Music Icons Supporting Education"
            icon={Music}
            gradient="from-rose-500/25 via-rose-500/5 to-transparent"
            description="Recognising musicians and music industry leaders using their influence to fund scholarships, support schools, mentor young people and promote Education for All."
            recognises={[
              "Music Artists",
              "Gospel Artists",
              "Music Producers",
              "Choirs",
              "Music Foundations",
              "Music Executives",
            ]}
            onView={() => {
              setPathway("music");
              document.getElementById("influencer-regional-grid")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            active={pathway === "music"}
          />
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-8">
          <Stat label="Total Nominees" value={stats.total} icon={Users} />
          <Stat label="Social Media" value={stats.social} />
          <Stat label="Sports" value={stats.sports} />
          <Stat label="Music" value={stats.music} />
          <Stat label="Countries" value={stats.countries} icon={Globe2} />
          <Stat label="African Regions" value={stats.regions} />
          <Stat label="Diaspora" value={stats.diaspora} />
          <Stat label="Verified" value={stats.verified} icon={CheckCircle2} />
        </div>

        {/* Search + Filter Toolbar */}
        <div className="sticky top-16 z-10 -mx-4 px-4 py-3 bg-charcoal/85 backdrop-blur border-y border-white/5 mb-6">
          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nominee, country, foundation, club or label…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold/60"
                aria-label="Search nominees"
              />
            </div>
            <select
              value={pathway}
              onChange={(e) => setPathway(e.target.value as CategoryId | "all")}
              aria-label="Recognition Subcategory"
              className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/85 text-sm focus:outline-none focus:border-gold/60"
            >
              <option value="all" className="bg-charcoal">All Subcategories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-charcoal">
                  {c.shortName}
                </option>
              ))}
            </select>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionId | "all")}
              aria-label="Region"
              className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/85 text-sm focus:outline-none focus:border-gold/60"
            >
              <option value="all" className="bg-charcoal">All Regions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r} className="bg-charcoal">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Region Chip Row (mobile-friendly quick jump) */}
        <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            <RegionChip
              label="All Regions"
              active={region === "all"}
              count={filtered.length}
              onClick={() => setRegion("all")}
            />
            {REGIONS.map((r) => (
              <RegionChip
                key={r}
                label={r}
                active={region === r}
                count={byRegion.get(r)?.length ?? 0}
                onClick={() => setRegion(r)}
              />
            ))}
          </div>
        </div>

        {/* Browse by Region */}
        <div id="influencer-regional-grid">
          <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
            Browse Existing Nominees by Region
          </h3>
          <p className="text-white/60 text-sm mb-6">
            {filtered.length} {filtered.length === 1 ? "nominee" : "nominees"} match your filters.
          </p>

          <div className="space-y-10">
            {REGIONS.map((r) => {
              const list = byRegion.get(r) ?? [];
              if (region !== "all" && region !== r) return null;
              return (
                <RegionalBlock
                  key={r}
                  region={r}
                  nominees={list}
                  pathway={pathway}
                />
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-white/60 text-sm">
              No nominees match these filters. Try widening your search — or{" "}
              <Link
                to="/nominate/influencer-education-impact"
                className="text-gold underline"
              >
                nominate an Education Enabler
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────

function PathwayCard({
  id,
  title,
  icon: Icon,
  gradient,
  description,
  recognises,
  onView,
  active,
}: {
  id: CategoryId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  description: string;
  recognises: string[];
  onView: () => void;
  active: boolean;
}) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl border overflow-hidden bg-gradient-to-br ${gradient} bg-charcoal-light/40 transition-all ${
        active ? "border-gold/60 shadow-lg shadow-gold/10" : "border-white/10 hover:border-gold/40"
      }`}
    >
      <div className="p-5 lg:p-6 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <Icon className="h-5 w-5 text-gold" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/50">
            Africa & Diaspora
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-white leading-snug mb-2">
          {title}
        </h3>
        <p className="text-white/65 text-sm leading-relaxed mb-4">{description}</p>

        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-gold/80 font-semibold mb-2">
            Recognises
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recognises.map((r) => (
              <span
                key={r}
                className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/75"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-[11px] text-white/55 mb-3">
            <span className="text-gold font-semibold">Verification-led assessment</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-gold/40 text-white hover:bg-gold/10"
              onClick={() => {
                trackEvent("influencer_pathway_view_nominees", { pathway: id });
                onView();
              }}
            >
              View Existing Nominees
            </Button>
            <Button
              asChild
              size="sm"
              className="flex-1 bg-gold text-charcoal hover:bg-gold/90"
              onClick={() =>
                trackEvent("influencer_pathway_nominate", { pathway: id })
              }
            >
              <Link to={NOMINATE_URL(id)}>Nominate Here</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1 text-gold">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        <span className="font-display text-lg font-bold">{value}</span>
      </div>
      <div className="text-[10px] uppercase tracking-wider text-white/55 mt-0.5">
        {label}
      </div>
    </div>
  );
}

function RegionChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-all ${
        active
          ? "bg-gold text-charcoal border-gold font-semibold"
          : "bg-white/5 text-white/70 border-white/10 hover:border-gold/40 hover:text-white"
      }`}
    >
      {label} <span className={active ? "opacity-70" : "text-white/40"}>({count})</span>
    </button>
  );
}

function RegionalBlock({
  region,
  nominees,
  pathway,
}: {
  region: RegionId;
  nominees: InfluencerNominee[];
  pathway: CategoryId | "all";
}) {
  const viewAllHref = `/nominees?awardFamily=influencer${
    pathway !== "all" ? `&category=${pathway}` : ""
  }&region=${encodeURIComponent(region)}`;
  const countryCount = new Set(nominees.map((n) => n.nominee_country)).size;
  const totalRegionCountries = COUNTRIES_BY_REGION[region]?.length ?? 0;

  return (
    <div>
      <div className="flex items-end justify-between gap-3 flex-wrap mb-4 pb-2 border-b border-white/5">
        <div>
          <h4 className="font-display text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-gold" /> {region}
          </h4>
          <p className="text-xs text-white/55 mt-0.5">
            {nominees.length} {nominees.length === 1 ? "nominee" : "nominees"} ·{" "}
            {countryCount}/{totalRegionCountries} countries represented
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-gold hover:bg-gold/10 hover:text-gold"
        >
          <Link to={viewAllHref}>
            View All {region} Nominees <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {nominees.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {nominees.slice(0, 4).map((n) => (
            <NomineeCard key={n.slug} nominee={n} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-white/50 text-xs">
          No nominees yet from {region}.{" "}
          <Link
            to="/nominate/influencer-education-impact"
            className="text-gold underline"
          >
            Be the first to nominate
          </Link>
          .
        </div>
      )}
    </div>
  );
}

export default InfluencerHallOfFameSection;
