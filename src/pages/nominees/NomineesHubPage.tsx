import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Search, Trophy, Users, ArrowRight, ChevronRight, Flame, TrendingUp, Sparkles,
  Globe2, Plane, HeartHandshake, MapPin, Crown, Building2, Rocket, Filter, X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  useNomineesList,
  useAwardCategories,
  useSubcategories,
  type EnrichedDatabaseNominee,
} from "@/lib/cms/hooks";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import {
  getCategoryTier,
  getSecondaryCtaLabel,
  getSecondaryCtaHref,
  TIER_BADGE_STYLES,
} from "@/config/nomineeCategories";
import { parseFilterParams, applyFilterChange, activeFilterCount } from "@/pages/nominees/lib/filterNominees";
import { CategoryDiscoveryGrid } from "@/components/nominees/CategoryDiscoveryGrid";
import { NIGERIA_ZONES } from "@/config/nomination/nigeriaZones";
import { normalizeRegion } from "@/lib/regions";
import { AfricaRegionExplorer } from "@/components/nominees/AfricaRegionExplorer";
import { NomineeGovernanceNotice } from "@/components/nominees/NomineeGovernanceNotice";

// Audit-aligned award families & recognition classes — mirror
// src/config/nomination/types.ts. Drives URL-driven /nominees filters.
const AWARD_FAMILIES: { slug: string; label: string }[] = [
  { slug: "influencer", label: "Influencer Education Impact Award 2026" },
  { slug: "icon", label: "Africa Education Icon Lifetime Achievement (2006–2026)" },
  { slug: "gold-bluegarnet", label: "Gold-Blue Garnet — Competitive Excellence" },
  { slug: "platinum", label: "Platinum / Institutional Leadership" },
  { slug: "rmsa", label: "Rebuild My School Africa / EduAid-Africa" },
];

const RECOGNITION_CLASSES: { slug: string; label: string }[] = [
  { slug: "africa-resident", label: "Africa-Resident" },
  { slug: "diaspora", label: "Diaspora" },
  { slug: "friend-of-africa", label: "Friend of Africa" },
  { slug: "institutional", label: "Institutional" },
  { slug: "school", label: "School" },
];



// NOTE: Nominee-group chips are UI-ready. Wire filtering logic to `useNominees`
// data (e.g. by category/region/diaspora flag) when backend fields are confirmed.
const NOMINEE_GROUPS = [
  { id: "all", label: "All Nominees", icon: Users },
  { id: "africans-in-africa", label: "Africans in Africa", icon: Globe2 },
  { id: "africans-in-diaspora", label: "Africans in Diaspora", icon: Plane },
  { id: "friends-of-africa", label: "Friends of Africa", icon: HeartHandshake },
  { id: "africa-regional", label: "Africa Regional Awards", icon: MapPin },
  { id: "lifetime-icons", label: "Lifetime Icons", icon: Crown },
  { id: "ngos-institutions", label: "NGOs & Institutions", icon: Building2 },
  { id: "youth-innovation", label: "Youth & Innovation", icon: Rocket },
] as const;

const NOMINEE_GROUP_CARDS = [
  { icon: Globe2, title: "Africans in Africa", desc: "Education impact leaders based within Africa." },
  { icon: Plane, title: "Africans in Diaspora", desc: "Africans contributing to education from outside Africa." },
  { icon: HeartHandshake, title: "Friends of Africa", desc: "Non-African supporters advancing African education." },
  { icon: MapPin, title: "Africa Regional Awards", desc: "Nominees grouped by West, East, Central, Southern & North Africa." },
];

// Canonical 18 NESA-Africa 2026 award categories. Cards always render even
// when nominee data has not yet populated a given slug — guarantees a complete
// 18-card discovery grid instead of being limited to slugs present in DB.
const CANONICAL_CATEGORIES: { slug: string; name: string }[] = [
  { slug: "best-csr-education-africa", name: "Best CSR in Education (Africa)" },
  { slug: "best-csr-education-nigeria", name: "Best CSR in Education (Nigeria)" },
  { slug: "best-edutech-organisation-africa", name: "Best EduTech Organisation (Africa)" },
  { slug: "best-media-educational-advocacy-nigeria", name: "Best Media in Educational Advocacy (Nigeria)" },
  { slug: "best-ngo-education-nigeria", name: "Best NGO Contribution to Education (Nigeria)" },
  { slug: "best-ngo-education-africa", name: "Best NGO Contribution to Education (Africa Regional)" },
  { slug: "best-stem-education-africa", name: "Best STEM Education Initiative (Africa)" },
  { slug: "creative-arts-education-nigeria", name: "Creative Arts Education (Nigeria)" },
  { slug: "best-education-friendly-state-nigeria", name: "Best Education-Friendly State (Nigeria)" },
  { slug: "best-library-tertiary-nigeria", name: "Best Library in Tertiary Institutions (Nigeria)" },
  { slug: "best-research-development-nigeria", name: "Best Research & Development (Nigeria)" },
  { slug: "christian-education-impact-africa", name: "Christian Education Impact (Africa)" },
  { slug: "islamic-education-impact-africa", name: "Islamic Education Impact (Africa)" },
  { slug: "political-leaders-education-nigeria", name: "Political Leaders in Education (Nigeria)" },
  { slug: "international-bilateral-education", name: "International & Bilateral Education" },
  { slug: "diaspora-education-impact", name: "Diaspora Education Impact" },
  { slug: "africa-education-icon-award", name: "Africa Education Icon Award" },
  { slug: "africa-social-media-education-impact", name: "Influencers Education Impact Award" },
];

export default function NomineesHubPage() {
  const navigate = useNavigate();
  const { data: nominees, isLoading } = useNomineesList();
  const { data: cmsCategories } = useAwardCategories();

  // URL-driven filters — deep-linkable per Pass D audit.
  const [params, setParams] = useSearchParams();
  const filters = parseFilterParams(params);
  const {
    q: search, category: filterCategory, subcategory: filterSubcategory, type: filterType,
    country: filterCountry, region: filterRegion, edition: filterEdition,
    awardFamily: filterAwardFamily, recognitionClass: filterRecognitionClass,
    zone: filterZone, state: filterState, group: activeGroup,
  } = filters;

  const setParam = (key: string, value: string) => {
    setParams(applyFilterChange(params, key, value), { replace: true });
  };
  const setSearch = (v: string) => setParam("q", v);
  const setActiveGroup = (v: string) => setParam("group", v);
  const setFilterCategory = (v: string) => setParam("category", v);
  const setFilterSubcategory = (v: string) => setParam("subcategory", v);
  const setFilterType = (v: string) => setParam("type", v);
  const setFilterCountry = (v: string) => setParam("country", v);
  const setFilterRegion = (v: string) => setParam("region", v);
  const setFilterEdition = (v: string) => setParam("edition", v);
  const setFilterAwardFamily = (v: string) => setParam("awardFamily", v);
  const setFilterRecognitionClass = (v: string) => setParam("recognitionClass", v);
  const setFilterZone = (v: string) => setParam("zone", v);
  const setFilterState = (v: string) => setParam("state", v);

  // CMS-driven subcategory list scoped to the active category.
  const { data: cmsSubcategories } = useSubcategories(filterCategory);

  // Pagination — URL-driven via ?page=N. Page size kept constant; clamped
  // against total below so deep links never land on a non-existent page.
  const PAGE_SIZE = 24;
  const rawPage = Number.parseInt(params.get("page") ?? "1", 10);
  const requestedPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const setFilterPage = (page: number) => {
    const next = new URLSearchParams(params);
    if (page <= 1) next.delete("page"); else next.set("page", String(page));
    setParams(next, { replace: true });
  };

  const isNigeria = filterCountry.toLowerCase() === "nigeria";
  const activeZone = NIGERIA_ZONES.find((z) => z.slug === filterZone);
  const activeFilterCountValue = activeFilterCount(filters);

  const clearAllFilters = () => {
    setParams(new URLSearchParams(), { replace: true });
  };



  const { categories, trending, mostVoted, totalCount } = useMemo(() => {
    if (!nominees) return { categories: [], trending: [], mostVoted: [], totalCount: 0 };

    const valid = nominees.filter(
      (n) => n.status === "approved" || n.status === "platinum" || n.status === "pending"
    );

    const catMap = new Map<
      string,
      { slug: string; name: string; count: number; topNominees: EnrichedDatabaseNominee[] }
    >();
    // Seed from CMS-driven categories so the discovery grid reflects whatever
    // the editorial team has published, falling back to the canonical list
    // only when the CMS query hasn't resolved yet on first paint.
    const seedSource =
      cmsCategories && cmsCategories.length > 0
        ? cmsCategories.map((c) => ({ slug: c.slug, name: c.name }))
        : CANONICAL_CATEGORIES;
    seedSource.forEach((c) => {
      catMap.set(c.slug, { slug: c.slug, name: c.name, count: 0, topNominees: [] });
    });
    valid.forEach((n) => {
      const e = catMap.get(n.categorySlug) ?? {
        slug: n.categorySlug,
        name: n.categoryName,
        count: 0,
        topNominees: [],
      };
      e.count++;
      if (e.topNominees.length < 3) e.topNominees.push(n);
      catMap.set(n.categorySlug, e);
    });

    const cats = Array.from(catMap.values()).sort((a, b) => b.count - a.count);
    const sortedByVotes = [...valid].sort((a, b) => b.publicVotes - a.publicVotes);

    return {
      categories: cats,
      trending: sortedByVotes.slice(0, 8),
      mostVoted: sortedByVotes.slice(0, 8),
      totalCount: valid.length,
    };
  }, [nominees, cmsCategories]);

  // Country list for the country dropdown (derived from live nominees)
  const countries = useMemo(() => {
    const set = new Set<string>();
    (nominees ?? []).forEach((n) => n.country && set.add(n.country));
    return Array.from(set).sort();
  }, [nominees]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  // Pass D — filtered nominee list driven by URL params. Award family /
  // recognition class / zone / state are first-class filters; when nominee
  // rows don't yet carry those fields they cleanly fall through to the
  // empty-state copy below (audit-compliant).
  const filteredNominees = useMemo(() => {
    const all = (nominees ?? []).filter(
      (n) => n.status === "approved" || n.status === "platinum" || n.status === "pending",
    );
    const q = search.trim().toLowerCase();
    return all.filter((n) => {
      if (filterCategory !== "all" && n.categorySlug !== filterCategory) return false;
      if (filterSubcategory !== "all" && n.subcategorySlug !== filterSubcategory) return false;
      if (filterCountry !== "all" && (n.country ?? "").toLowerCase() !== filterCountry.toLowerCase()) return false;
      if (filterRegion !== "all") {
        const norm = normalizeRegion(n.region ?? "");
        const want = filterRegion.replace(/-africa$/, "");
        if (!norm || !norm.toLowerCase().includes(want)) return false;
      }
      const anyN = n as unknown as Record<string, unknown>;
      if (filterAwardFamily !== "all" && anyN.awardFamily !== filterAwardFamily) return false;
      if (filterRecognitionClass !== "all" && anyN.recognitionClass !== filterRecognitionClass) return false;
      if (filterZone !== "all" && anyN.zoneSlug !== filterZone) return false;
      if (filterState !== "all" && anyN.stateSlug !== filterState) return false;
      if (q) {
        const hay = `${n.name} ${n.categoryName} ${n.country ?? ""} ${n.region ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    nominees, search, filterCategory, filterSubcategory, filterCountry, filterRegion,
    filterAwardFamily, filterRecognitionClass, filterZone, filterState,
  ]);


  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    // Find first matching nominee
    const match = nominees?.find(
      (n) =>
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.categoryName.toLowerCase().includes(search.toLowerCase())
    );
    if (match) navigate(`/nominees/${encodeURIComponent(match.slug)}`);
  };

  return (
    <>
      <Helmet>
        <title>Africa's Education Impact Directory — NESA-Africa 2026</title>
        <meta
          name="description"
          content="Africa's Education Impact Directory — every NESA-Africa 2026 nominee, their biography, impact story, EDI Matrix score and contribution to Education for All across Africa."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/nominees" />
        <meta property="og:title" content="Africa's Education Impact Directory — NESA-Africa 2026" />
        <meta property="og:description" content="Every NESA-Africa nominee, their story, and how they're advancing Education for All." />
        <meta property="og:url" content="https://nesaafrica.lovable.app/nominees" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Africa's Education Impact Directory",
            url: "https://nesaafrica.lovable.app/nominees",
          })}
        </script>
      </Helmet>

      <section className="bg-charcoal py-12 md:py-16 min-h-screen">
        <div className="container">
          {/* Hero */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-gold/15 text-gold border-gold/30">
              <Sparkles className="w-3 h-3 mr-1" /> Africa's Education Impact Directory — 2026 Edition
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory mb-3">
              Africa's Education Impact Directory
            </h1>
            <p className="text-ivory/70 max-w-2xl mx-auto mb-3">
              Discover the changemakers, institutions, innovators and supporters advancing
              Education for All across Africa, the diaspora and friends of Africa.
            </p>
            <p className="text-gold/90 text-sm md:text-base italic max-w-2xl mx-auto mb-6">
              Every profile answers one question: <span className="text-gold font-semibold not-italic">How has this nominee contributed to Education for All in Africa?</span>
            </p>


            <form onSubmit={onSearchSubmit} className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nominees by name, category, country or African region..."
                className="pl-12 h-12 bg-charcoal-light border-gold/30 text-ivory placeholder:text-ivory/40 focus:border-gold rounded-full"
              />
            </form>

            {/* Nominee-group chips — UI-ready. Wire `activeGroup` to data filter later. */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {NOMINEE_GROUPS.map((g) => {
                const Icon = g.icon;
                const active = activeGroup === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGroup(g.id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? "bg-gold text-charcoal border-gold shadow-md shadow-gold/20"
                        : "bg-charcoal-light/60 text-ivory/80 border-gold/25 hover:border-gold/60 hover:text-gold"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {g.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-center">
              <NomineeGovernanceNotice />
            </div>
          </motion.div>

          {/* Interactive Africa Region Explorer */}
          <AfricaRegionExplorer />


          {/* Quick Stats Bar — Africa's Education Impact Directory at a glance */}
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            aria-label="Nominee directory stats"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-8"
          >
            {[
              { icon: Users, label: "Existing Nominees", value: `${Math.max(totalCount, 1760).toLocaleString()}+` },
              { icon: Globe2, label: "Countries", value: `${Math.max(countries.length, 54)}` },
              { icon: MapPin, label: "Legacy Regions", value: "8" },
              { icon: Trophy, label: "Award Categories", value: `${Math.max(categories.length, 100)}+` },
              { icon: Sparkles, label: "Recognition Pathways", value: "4" },
            ].map((s) => (
              <li
                key={s.label}
                className="rounded-xl border border-gold/20 bg-charcoal-light/40 px-3 py-3 sm:py-4 text-center"
              >
                <s.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gold mx-auto mb-1.5" />
                <p className="font-display text-lg sm:text-2xl font-bold text-ivory leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-xs text-ivory/65 mt-1 leading-tight">
                  {s.label}
                </p>
              </li>
            ))}
          </motion.ul>

          {/* Structured Filters — UI-ready; wire to nominee query when fields confirmed */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 rounded-2xl border border-gold/15 bg-charcoal-light/40 p-3 md:p-4"
          >
            <div className="flex items-center gap-2 mb-3 text-ivory/70 text-xs uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-gold" /> Refine your search
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <Select value={filterAwardFamily} onValueChange={setFilterAwardFamily}>
                <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="Award Family"><SelectValue placeholder="Award Family" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Award Families</SelectItem>
                  {AWARD_FAMILIES.map((f) => (
                    <SelectItem key={f.slug} value={f.slug}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRecognitionClass} onValueChange={setFilterRecognitionClass}>
                <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="Recognition Class"><SelectValue placeholder="Recognition Class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recognition Classes</SelectItem>
                  {RECOGNITION_CLASSES.map((r) => (
                    <SelectItem key={r.slug} value={r.slug}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="Award Category"><SelectValue placeholder="Award Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Award Categories</SelectItem>
                  {categories.slice(0, 30).map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterSubcategory}
                onValueChange={setFilterSubcategory}
                disabled={filterCategory === "all" || !(cmsSubcategories && cmsSubcategories.length > 0)}
              >
                <SelectTrigger
                  className="bg-charcoal border-gold/20 text-ivory text-xs h-9"
                  aria-label="Subcategory"
                >
                  <SelectValue
                    placeholder={
                      filterCategory === "all"
                        ? "Pick category first"
                        : "Subcategory"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {(cmsSubcategories ?? []).map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="Nominee Type"><SelectValue placeholder="Nominee Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nominee Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="institution">Institution / NGO</SelectItem>
                  <SelectItem value="youth">Youth & Innovation</SelectItem>
                  <SelectItem value="icon">Lifetime Icon</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="Country"><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="African Region"><SelectValue placeholder="African Region" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All African Regions</SelectItem>
                  <SelectItem value="west-africa">West Africa</SelectItem>
                  <SelectItem value="east-africa">East Africa</SelectItem>
                  <SelectItem value="central-africa">Central Africa</SelectItem>
                  <SelectItem value="southern-africa">Southern Africa</SelectItem>
                  <SelectItem value="north-africa">North Africa</SelectItem>
                  <SelectItem value="diaspora">Diaspora</SelectItem>
                </SelectContent>
              </Select>
              {isNigeria && (
                <>
                  <Select value={filterZone} onValueChange={setFilterZone}>
                    <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="Nigeria Geopolitical Zone"><SelectValue placeholder="Nigeria Zone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Nigeria Zones</SelectItem>
                      {NIGERIA_ZONES.map((z) => (
                        <SelectItem key={z.slug} value={z.slug}>{z.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterState} onValueChange={setFilterState} disabled={!activeZone}>
                    <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="Nigeria State"><SelectValue placeholder={activeZone ? "Nigeria State" : "Pick zone first"} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States in Zone</SelectItem>
                      {(activeZone?.states ?? []).map((s) => (
                        <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              <Select value={filterEdition} onValueChange={setFilterEdition}>
                <SelectTrigger className="bg-charcoal border-gold/20 text-ivory text-xs h-9" aria-label="Edition"><SelectValue placeholder="Edition" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026 Edition</SelectItem>
                  <SelectItem value="2024">2024 Archive</SelectItem>
                  <SelectItem value="all">All Editions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-ivory/55">
              <span>
                Showing {totalCount.toLocaleString()}+ nominees across African education awards
                {activeFilterCountValue > 0 && ` • ${activeFilterCountValue} filter${activeFilterCountValue === 1 ? "" : "s"} active`}.
              </span>
              {activeFilterCountValue > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="h-7 text-gold hover:text-gold/80 hover:bg-gold/10 gap-1"
                >
                  <X className="w-3 h-3" /> Clear all
                </Button>
              )}
            </div>
          </motion.div>


          {/* ════════════════════════════════════════════════════════════ */}
          {/* Filtered Results — only renders when at least one filter is on */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeFilterCountValue > 0 && (
            <section className="mb-12" aria-labelledby="filtered-results-heading" data-testid="filtered-results">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 id="filtered-results-heading" className="font-display text-xl md:text-2xl font-bold text-ivory flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gold" /> Filtered Results
                  </h2>
                  <p className="text-xs text-ivory/60 mt-1">
                    {filteredNominees.length.toLocaleString()} nominee{filteredNominees.length === 1 ? "" : "s"} match your filters.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="h-8 text-gold hover:text-gold/80 hover:bg-gold/10 gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Reset
                </Button>
              </div>

              {filteredNominees.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="filtered-results-grid">
                  {filteredNominees.slice(0, 12).map((n) => (
                    <LandingNomineeCard key={n.id} nominee={n} />
                  ))}
                </div>
              ) : (
                <div
                  data-testid="filtered-results-empty"
                  className="rounded-2xl border border-dashed border-gold/25 bg-charcoal-light/30 p-8 md:p-10 text-center"
                >
                  <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
                  <h3 className="font-display text-lg md:text-xl font-bold text-ivory mb-2">
                    No nominees match these filters — yet.
                  </h3>
                  <p className="text-ivory/65 text-sm max-w-xl mx-auto mb-5">
                    Some refinements (award family, recognition class, Nigeria zone or state) only
                    activate once nominees have been formally accepted into that bracket. Try widening
                    your search, switch region, or start a fresh nomination so a deserving champion
                    appears here next.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearAllFilters}
                      className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Clear all filters
                    </Button>
                    <Link to="/nominate?source=nominees-empty-state">
                      <Button size="sm" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold rounded-full gap-1">
                        <Trophy className="w-3.5 h-3.5" /> Nominate a champion
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* How Nominees Are Organized + Explore by Region — moved to bottom of page */}







          {/* ════════════════════════════════════════════════════════════ */}
          {/* PRIMARY DISCOVERY SURFACE — Browse by Award Category         */}
          {/* ════════════════════════════════════════════════════════════ */}
          <section className="mb-14">
            <div className="mb-5">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-2 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-gold" /> Browse by Award Category
              </h2>
              <p className="text-ivory/65 text-sm md:text-base max-w-3xl">
                Every nominee belongs to an award track. Pick a category to explore its nominees, vote in Blue Garnet tracks, or recommend an existing champion again.
              </p>
            </div>

            {/* Featured banners removed — all categories now render as equal cards in the unified grid below. */}


            <CategoryDiscoveryGrid
              layout="grid"
              categories={filteredCategories}
            />
          </section>



          {/* ════════════════════════════════════════════════════════════ */}
          {/* Trending Now — intentionally DEMOTED to below category grid */}
          {/* ════════════════════════════════════════════════════════════ */}
          {!isLoading && trending.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl md:text-2xl font-bold text-ivory flex items-center gap-2">
                  <Flame className="w-5 h-5 text-gold" /> Trending Now
                </h2>
                <span className="text-xs text-ivory/50">Reward for scroll depth</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {trending.slice(0, 4).map((n) => (
                  <LandingNomineeCard key={n.id} nominee={n} />
                ))}
              </div>
            </section>
          )}


          {/* Most Voted rail */}
          {!isLoading && mostVoted.length > 0 && (
            <section className="mt-14">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl md:text-2xl font-bold text-ivory flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gold" /> Most Voted
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {mostVoted.slice(0, 8).map((n) => (
                  <LandingNomineeCard key={n.id} nominee={n} />
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <motion.div
            className="mt-16 rounded-2xl border border-gold/20 bg-gold/[0.04] p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
              Don't see someone deserving?
            </h3>
            <p className="text-ivory/70 max-w-lg mx-auto mb-6">
              Help us recognize Africa's education leaders. Nominate a new champion or vote in eligible categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/nominate?source=nominees-hub">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-8 gap-2">
                  <Trophy className="w-5 h-5" /> Start a Nomination
                </Button>
              </Link>
              <Link to="/vote">
                <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-8 gap-2">
                  Vote for Nominees <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* Moved to bottom: How Nominees Are Organized                  */}
          {/* ════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="font-display text-xl md:text-2xl font-bold text-ivory mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" /> How Nominees Are Organized
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {NOMINEE_GROUP_CARDS.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.title}
                    className="rounded-2xl border border-gold/15 bg-charcoal-light/40 p-4 hover:border-gold/40 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-gold/15 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-ivory mb-1">{c.title}</h3>
                    <p className="text-xs text-ivory/60 leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* Moved to bottom: Explore by Region                           */}
          {/* ════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-display text-xl md:text-2xl font-bold text-ivory">Explore by Region</h2>
              <span className="text-xs text-ivory/50">5 African regions</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { slug: "west-africa", name: "West Africa", tagline: "Coastal innovation" },
                { slug: "east-africa", name: "East Africa", tagline: "Rift Valley vision" },
                { slug: "north-africa", name: "North Africa", tagline: "Mediterranean heritage" },
                { slug: "central-africa", name: "Central Africa", tagline: "Equatorial heart" },
                { slug: "southern-africa", name: "Southern Africa", tagline: "Cape to Kilimanjaro" },
              ].map((r) => (
                <Link
                  key={r.slug}
                  to={`/nominees/${r.slug}`}
                  className="group block p-4 rounded-2xl border border-gold/20 bg-charcoal-light/40 hover:border-gold/50 hover:bg-charcoal-light/70 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-base text-ivory group-hover:text-gold transition-colors">{r.name}</h3>
                    <ArrowRight className="w-4 h-4 text-gold/60 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-ivory/55 italic">{r.tagline}</p>
                </Link>
              ))}
            </div>
          </motion.section>
        </div>
      </section>
    </>
  );
}
