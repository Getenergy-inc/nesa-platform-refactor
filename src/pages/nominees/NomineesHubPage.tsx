// ============================================================================
// Africa's Education Impact Directory — /nominees
// 11-section premium discovery hub. Composes existing data layer
// (useNominees, PILLARS, RECOGNITION_TIERS_2026, AFRICAN_REGIONS) into a
// long-form section-based experience. No business-logic changes.
// ============================================================================

import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Search, Trophy, Users, ArrowRight, Sparkles, Globe2, Plane,
  HeartHandshake, MapPin, Crown, Building2, Award, Star, Medal,
  BookOpen, GraduationCap, Megaphone, Tv, Filter, Shield, ScrollText,
  ChevronRight, X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { DIRECTORY_NAME, PRIMARY_CTAS, REGION_FRAMING, TRUST_STATEMENT } from "@/config/platformCopy";
import { AfricaRegionExplorer } from "@/components/nominees/AfricaRegionExplorer";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { trackEvent } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Static reference data
// ---------------------------------------------------------------------------

const TIER_META = [
  {
    slug: "africa-education-icon",
    title: "Africa Education Icon Award",
    period: "2006–2026 · Lifetime Recognition",
    bullets: ["Hall of Fame", "3 Icon Categories", "3 Global Classifications"],
    href: "/awards/africa-education-icon",
    Icon: Crown,
    accent: "from-amber-500/30 to-amber-700/10",
  },
  {
    slug: "gold-blue-garnet",
    title: "Gold–Blue Garnet Awards",
    period: "Competitive Recognition · 60% Jury / 40% Public",
    bullets: ["9 Competitive Categories", "Public + Jury Voting", "Continental Reach"],
    href: "/awards/blue-garnet",
    Icon: Trophy,
    accent: "from-rose-500/30 to-rose-800/10",
  },
  {
    slug: "platinum",
    title: "Platinum Recognition",
    period: "Institutional Leadership · Non-Competitive",
    bullets: ["7 Institutional Categories", "Governments & Universities", "Policy Leaders"],
    href: "/awards/platinum",
    Icon: Medal,
    accent: "from-sky-500/30 to-sky-800/10",
  },
  {
    slug: "influencer-education-impact",
    title: "Influencer Education Impact",
    period: "Public Recognition · 100% AfriGold Coin",
    bullets: ["Sports & Music Icons", "Digital Creators", "Public Voting"],
    href: "/awards/influencers-education-impact-2026-recognition",
    Icon: Sparkles,
    accent: "from-violet-500/30 to-violet-800/10",
  },
];

const ENABLER_TYPES = [
  { id: "people", label: "People", Icon: Users },
  { id: "organisations", label: "Organisations", Icon: Building2 },
  { id: "companies", label: "Companies", Icon: Building2 },
  { id: "ngos", label: "NGOs", Icon: HeartHandshake },
  { id: "governments", label: "Governments", Icon: Shield },
  { id: "ministries", label: "Ministries", Icon: ScrollText },
  { id: "universities", label: "Universities", Icon: GraduationCap },
  { id: "libraries", label: "Libraries", Icon: BookOpen },
  { id: "schools", label: "Schools", Icon: GraduationCap },
  { id: "research-centres", label: "Research Centres", Icon: BookOpen },
  { id: "faith-based", label: "Faith-Based Organisations", Icon: Sparkles },
  { id: "foundations", label: "Foundations", Icon: HeartHandshake },
  { id: "development-partners", label: "Development Partners", Icon: Globe2 },
  { id: "media", label: "Media Organisations", Icon: Tv },
  { id: "csr", label: "CSR Programmes", Icon: Award },
  { id: "social-enterprises", label: "Social Enterprises", Icon: Sparkles },
  { id: "edtech", label: "EdTech Startups", Icon: Sparkles },
  { id: "stem", label: "STEM Programmes", Icon: Sparkles },
  { id: "creative", label: "Creative Industry", Icon: Star },
  { id: "sports", label: "Sports Foundations", Icon: Trophy },
  { id: "music", label: "Music Foundations", Icon: Megaphone },
  { id: "diaspora", label: "Diaspora Associations", Icon: Plane },
  { id: "international", label: "International Agencies", Icon: Globe2 },
  { id: "bilateral", label: "Bilateral Organisations", Icon: Globe2 },
  { id: "friends", label: "Friends of Africa", Icon: HeartHandshake },
];

const AFRICA_REGIONS = REGION_FRAMING.africaRegions;
const GLOBAL_COMMUNITIES = REGION_FRAMING.globalCommunities;

const IMPACT_STORY_THEMES = [
  { tag: "School Transformation", body: "From dilapidated classrooms to modern learning hubs — rebuilt across rural Africa." },
  { tag: "Scholarship Pipelines", body: "Foundations sending thousands of first-generation students to university." },
  { tag: "STEM Innovation", body: "EdTech founders making coding, robotics and AI accessible to African youth." },
  { tag: "Policy Reform", body: "Ministries and reformers expanding curriculum access nationwide." },
  { tag: "Faith & Education", body: "Faith-based networks operating Africa's largest mission school systems." },
  { tag: "Diaspora Giving", body: "Diaspora professionals funding libraries, labs and teacher salaries back home." },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function NomineesHubPage() {
  const { data: nominees, isLoading } = useNominees();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [tierFilter, setTierFilter] = useState<string>(params.get("tier") ?? "all");

  useEffect(() => {
    trackEvent("directory_view", { name: DIRECTORY_NAME });
  }, []);

  // -- Counts per facet ------------------------------------------------------
  const tierCounts = useMemo(() => {
    const out: Record<string, number> = {};
    (nominees ?? []).forEach((n) => {
      const slug = String(n.categorySlug ?? "");
      const family =
        slug.includes("icon") ? "africa-education-icon" :
        slug.includes("platinum") || slug.includes("institutional") ? "platinum" :
        slug.includes("influencer") || slug.includes("social") || slug.includes("sport") || slug.includes("music") ? "influencer-education-impact" :
        "gold-blue-garnet";
      out[family] = (out[family] ?? 0) + 1;
    });
    return out;
  }, [nominees]);

  const categoryCounts = useMemo(() => {
    const out = new Map<string, { name: string; count: number }>();
    (nominees ?? []).forEach((n) => {
      const existing = out.get(n.categorySlug) ?? { name: n.categoryName, count: 0 };
      existing.count += 1;
      out.set(n.categorySlug, existing);
    });
    return Array.from(out.entries());
  }, [nominees]);

  // -- Search results --------------------------------------------------------
  const results = useMemo(() => {
    const list = nominees ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((n) => {
      if (q && !`${n.name} ${n.organization ?? ""} ${n.country ?? ""} ${n.categoryName}`.toLowerCase().includes(q)) return false;
      if (tierFilter !== "all") {
        const slug = String(n.categorySlug ?? "");
        const matches =
          (tierFilter === "africa-education-icon" && slug.includes("icon")) ||
          (tierFilter === "platinum" && (slug.includes("platinum") || slug.includes("institutional"))) ||
          (tierFilter === "influencer-education-impact" && (slug.includes("influencer") || slug.includes("social") || slug.includes("sport") || slug.includes("music"))) ||
          (tierFilter === "gold-blue-garnet" && !slug.includes("icon") && !slug.includes("platinum") && !slug.includes("influencer"));
        if (!matches) return false;
      }
      return true;
    });
  }, [nominees, search, tierFilter]);

  const featured = useMemo(
    () => (nominees ?? []).slice().sort((a, b) => b.publicVotes - a.publicVotes).slice(0, 6),
    [nominees],
  );

  // -- JSON-LD ---------------------------------------------------------------
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${DIRECTORY_NAME} — NESA-Africa 2026`,
    description:
      "Discover verified Education Enablers creating measurable impact across Eight Africa Regions, the Diaspora and Friends of Africa.",
    url: "https://nesaafrica.lovable.app/nominees",
  };

  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <Helmet>
        <title>{DIRECTORY_NAME} — NESA-Africa 2026</title>
        <meta
          name="description"
          content="Africa's largest verified discovery platform for Education Enablers. Explore people, organisations and institutions transforming education across the continent."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/nominees" />
        <meta property="og:title" content={`${DIRECTORY_NAME} — NESA-Africa 2026`} />
        <meta property="og:url" content="https://nesaafrica.lovable.app/nominees" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        {/* ────────────────────────────────────────────────────────────────
            SECTION 1 — HERO
        ──────────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="directory-hero"
          className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-charcoal-dark via-charcoal to-charcoal-light"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-rose-700/20 blur-3xl" />
          </div>
          <div className="container relative max-w-7xl mx-auto px-4 py-16 md:py-24">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-gold/15 text-gold border border-gold/30 mb-5">
                <BadgeCheck className="h-3.5 w-3.5 mr-1" /> Africa's Verified Education Impact Hub
              </Badge>
              <h1
                id="directory-hero"
                className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-ivory leading-[1.05] mb-5"
              >
                Africa's Education<br />
                <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
                  Impact Directory
                </span>
              </h1>
              <p className="text-ivory/75 text-base md:text-xl max-w-3xl leading-relaxed mb-6">
                Discover verified Education Enablers creating measurable impact across <strong className="text-ivory">Eight Africa Regions</strong>, Africans in the <strong className="text-ivory">Diaspora</strong> and <strong className="text-ivory">Friends of Africa</strong>.
              </p>
              <p className="text-gold/80 font-medium tracking-wide text-sm md:text-base mb-8">
                Search · Discover · Connect · Celebrate · Support
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gold/20 bg-charcoal/40 backdrop-blur p-3 text-center"
                    aria-label={`${s.value} ${s.label}`}
                  >
                    <div className="font-playfair text-2xl md:text-3xl text-gold font-bold">
                      {isLoading ? "—" : s.value.toLocaleString()}
                    </div>
                    <div className="text-[10px] md:text-xs text-ivory/65 mt-1 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold rounded-full">
                  <Link to="/nominees/catalogue" onClick={() => trackEvent("directory_cta_click", { cta: "recognition_catalogue" })}>
                    <Trophy className="h-4 w-4 mr-2" /> Open Recognition Catalogue
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10 rounded-full">
                  <a href="#tiers" onClick={() => trackEvent("directory_cta_click", { cta: "explore_tiers" })}>
                    <Trophy className="h-4 w-4 mr-2" /> Explore Recognition Tiers
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10 rounded-full">
                  <a href="#categories" onClick={() => trackEvent("directory_cta_click", { cta: "browse_categories" })}>
                    <BookOpen className="h-4 w-4 mr-2" /> Browse Categories
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10 rounded-full">
                  <a href="#discovery" onClick={() => trackEvent("directory_cta_click", { cta: "search" })}>
                    <Search className="h-4 w-4 mr-2" /> Search Education Enablers
                  </a>
                </Button>
                <Button asChild size="lg" className="bg-rose-700 hover:bg-rose-800 text-ivory rounded-full">
                  <Link to={PRIMARY_CTAS.nominate.href} onClick={() => trackEvent("directory_cta_click", { cta: "nominate" })}>
                    <Sparkles className="h-4 w-4 mr-2" /> Nominate an Enabler
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-ivory hover:bg-ivory/5 rounded-full">
                  <Link to="/media" onClick={() => trackEvent("directory_cta_click", { cta: "tv" })}>
                    <Tv className="h-4 w-4 mr-2" /> NESA Africa TV
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 2 — FOUR RECOGNITION TIERS
        ──────────────────────────────────────────────────────────────── */}
        <Section id="tiers" eyebrow="01 · Recognition Architecture" title="Four Recognition Tiers">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIER_META.map((t, i) => (
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={t.href}
                  onClick={() => trackEvent("directory_tier_click", { tier: t.slug })}
                  className={`group block rounded-2xl border border-gold/20 bg-gradient-to-br ${t.accent} p-6 hover:border-gold/60 transition-all h-full`}
                >
                  <t.Icon className="h-9 w-9 text-gold mb-4" />
                  <h3 className="font-playfair text-xl text-ivory font-semibold mb-1">{t.title}</h3>
                  <p className="text-[11px] uppercase tracking-wider text-gold/80 mb-3">{t.period}</p>
                  <ul className="text-sm text-ivory/70 space-y-1 mb-4">
                    {t.bullets.map((b) => <li key={b}>· {b}</li>)}
                  </ul>
                  <div className="text-xs text-gold flex items-center gap-1">
                    {tierCounts[t.slug] ?? 0} verified enablers
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 3 — NINE RECOGNITION PILLARS
        ──────────────────────────────────────────────────────────────── */}
        <Section eyebrow="02 · Themes of Impact" title="Nine Recognition Pillars" sub="Each pillar represents a verified force enabling Education for All across Africa.">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLARS.map((p) => {
              const PIcon = p.icon ?? Star;
              return (
                <Link
                  key={p.slug}
                  to={`/awards/pillars/${p.slug}`}
                  onClick={() => trackEvent("directory_pillar_click", { pillar: p.slug })}
                  className="group rounded-2xl border border-gold/15 bg-charcoal-light/40 p-5 hover:border-gold/50 hover:bg-charcoal-light/70 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <PIcon className="h-7 w-7 text-gold" />
                    <Badge variant="outline" className="border-gold/30 text-gold text-[10px]">
                      Pillar {p.number}
                    </Badge>
                  </div>
                  <h3 className="font-playfair text-lg text-ivory mb-1">{p.shortTitle}</h3>
                  <p className="text-xs text-gold/70 italic mb-2">{p.sellLine}</p>
                  <p className="text-sm text-ivory/65 line-clamp-3">{p.intro?.[0]}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-ivory/60">{pillarCounts[p.slug] ?? 0} enablers</span>
                    <span className="text-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 4 — BROWSE BY AWARD CATEGORY
        ──────────────────────────────────────────────────────────────── */}
        <Section id="categories" eyebrow={`03 · ${categoryCounts.length || 18} Categories`} title="Browse by Award Category" sub="Every category curates a verified roster of Education Enablers. Click any card to open its dedicated page.">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl bg-charcoal-light/50" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryCounts.length === 0 ? (
                <p className="text-ivory/55 text-sm italic">Categories will populate as nominees are verified.</p>
              ) : (
                categoryCounts.map(([slug, info]) => (
                  <Link
                    key={slug}
                    to={`/nominees/category/${slug}`}
                    onClick={() => trackEvent("directory_category_click", { category: slug })}
                    className="rounded-xl border border-gold/15 bg-charcoal-light/30 p-4 hover:border-gold/45 hover:bg-charcoal-light/50 transition-all group focus:outline-none focus:ring-2 focus:ring-gold/60"
                    aria-label={`Explore ${info.name} category page`}
                  >
                    <Award className="h-6 w-6 text-gold mb-2" />
                    <h4 className="font-medium text-ivory text-sm mb-1">{info.name}</h4>
                    <p className="text-xs text-ivory/55">{info.count} verified enablers</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold group-hover:gap-2 transition-all">
                      Explore category <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))
              )}
            </div>
          )}
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 5 — BROWSE BY RECOGNITION TIER (filter chips)
        ──────────────────────────────────────────────────────────────── */}
        <Section eyebrow="04 · Filter" title="Browse by Recognition Tier">
          <div className="flex flex-wrap gap-2">
            <TierChip active={tierFilter === "all"} onClick={() => setTierFilter("all")} label="All Tiers" count={nominees?.length ?? 0} />
            {TIER_META.map((t) => (
              <TierChip
                key={t.slug}
                active={tierFilter === t.slug}
                onClick={() => {
                  setTierFilter(t.slug);
                  trackEvent("directory_filter_apply", { facet: "tier", value: t.slug });
                  document.getElementById("discovery")?.scrollIntoView({ behavior: "smooth" });
                }}
                label={t.title}
                count={tierCounts[t.slug] ?? 0}
              />
            ))}
          </div>
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 6 — BROWSE BY EDUCATION ENABLER TYPE
        ──────────────────────────────────────────────────────────────── */}
        <Section eyebrow="05 · Who They Are" title="Browse by Education Enabler Type">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {ENABLER_TYPES.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setSearch(e.label);
                  trackEvent("directory_filter_apply", { facet: "enabler_type", value: e.id });
                  document.getElementById("discovery")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 rounded-lg border border-gold/15 bg-charcoal-light/30 px-3 py-2.5 hover:border-gold/50 transition-all text-left"
              >
                <e.Icon className="h-4 w-4 text-gold shrink-0" />
                <span className="text-xs text-ivory/80 truncate">{e.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 7 — REGIONS + GLOBAL COMMUNITIES
        ──────────────────────────────────────────────────────────────── */}
        <Section eyebrow="06 · Geography" title="Browse by Eight Africa Regions" sub={REGION_FRAMING.headline}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {AFRICA_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  navigate(`/nominees?region=${encodeURIComponent(r)}`);
                  trackEvent("directory_region_click", { region: r });
                }}
                className="rounded-xl border border-gold/20 bg-charcoal-light/30 p-4 hover:border-gold/55 transition-all text-left"
              >
                <MapPin className="h-5 w-5 text-gold mb-2" />
                <div className="font-medium text-ivory text-sm">{r}</div>
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/10 to-charcoal-light/30 p-5">
            <h4 className="font-playfair text-lg text-gold mb-3 flex items-center gap-2">
              <Globe2 className="h-5 w-5" /> Global Communities
            </h4>
            <p className="text-xs text-ivory/65 mb-3">Recognised separately — not Africa regions.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {GLOBAL_COMMUNITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => navigate(`/nominees?region=${encodeURIComponent(c)}`)}
                  className="rounded-lg border border-gold/25 bg-charcoal/40 p-4 hover:border-gold/55 text-left transition-all"
                >
                  {c.includes("Diaspora") ? <Plane className="h-5 w-5 text-gold mb-2" /> : <HeartHandshake className="h-5 w-5 text-gold mb-2" />}
                  <div className="font-medium text-ivory text-sm">{c}</div>
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 8 — INTERACTIVE AFRICA MAP (existing component)
        ──────────────────────────────────────────────────────────────── */}
        <Section eyebrow="07 · Map" title="Interactive Africa Map">
          <AfricaRegionExplorer />
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 9 — FEATURED EDUCATION ENABLERS
        ──────────────────────────────────────────────────────────────── */}
        <Section eyebrow="08 · Spotlight" title="Featured Education Enablers">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl bg-charcoal-light/50" />)}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-ivory/55 text-sm italic">Featured enablers will appear once data is verified.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((n) => <LandingNomineeCard key={n.id} nominee={n} />)}
            </div>
          )}
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 10 — IMPACT STORIES
        ──────────────────────────────────────────────────────────────── */}
        <Section eyebrow="09 · Stories" title="Education Impact Stories" sub="Real change, verified. Behind every enabler is a community transformed.">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {IMPACT_STORY_THEMES.map((s, i) => (
              <motion.div
                key={s.tag}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-gold/15 bg-charcoal-light/30 p-5 hover:border-gold/45 transition-all"
              >
                <Badge className="bg-gold/15 text-gold border border-gold/30 mb-3">{s.tag}</Badge>
                <p className="text-sm text-ivory/75 leading-relaxed">{s.body}</p>
                <Link to="/about/impact" className="mt-4 inline-flex items-center gap-1 text-xs text-gold hover:gap-2 transition-all">
                  Read stories <ChevronRight className="h-3 w-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            SECTION 11 — ADVANCED DISCOVERY
        ──────────────────────────────────────────────────────────────── */}
        <Section id="discovery" eyebrow="10 · Discover" title="Advanced Discovery" sub="Search Africa's verified education impact ecosystem.">
          <div className="rounded-2xl border border-gold/20 bg-charcoal-light/40 p-4 md:p-6 mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ivory/40" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  trackEvent("directory_search", { q: e.target.value });
                }}
                placeholder="Search by name, organisation, country, category, pillar..."
                className="pl-10 bg-charcoal/60 border-gold/20 text-ivory placeholder:text-ivory/40"
                aria-label="Search Education Enablers"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-ivory"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[11px] text-ivory/55 mr-2 self-center">
                <Filter className="h-3 w-3 inline mr-1" /> Try:
              </span>
              {["Philanthropy", "STEM", "Libraries", "Nigeria", "Kenya", "Diaspora", "Scholarships", "AI", "Universities", "Faith", "Media"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setSearch(q); trackEvent("directory_search", { q, source: "suggestion" }); }}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-gold/25 bg-charcoal/40 text-ivory/70 hover:border-gold/55 hover:text-ivory"
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-xs text-ivory/55 mt-3">
              {isLoading ? "Loading…" : `${results.length} ${results.length === 1 ? "enabler" : "enablers"} match your search`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl bg-charcoal-light/50" />)}
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gold/25 bg-charcoal-light/20 p-10 text-center">
              <p className="text-ivory/60 text-sm mb-4">No enablers match these filters yet.</p>
              <Button asChild className="bg-gold hover:bg-gold/90 text-charcoal">
                <Link to={PRIMARY_CTAS.nominate.href}>Nominate an Education Enabler</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.slice(0, 24).map((n) => <LandingNomineeCard key={n.id} nominee={n} />)}
            </div>
          )}

          {results.length > 24 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10">
                Showing 24 of {results.length} · Refine filters to narrow
              </Button>
            </div>
          )}
        </Section>

        {/* ────────────────────────────────────────────────────────────────
            FOOTER TRUST
        ──────────────────────────────────────────────────────────────── */}
        <section aria-labelledby="trust-footer" className="border-t border-gold/15 bg-charcoal-dark/50 py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 id="trust-footer" className="font-playfair text-2xl text-gold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" /> Independent Verification & Governance
            </h2>
            <p className="text-sm text-ivory/70 max-w-3xl mb-6">{TRUST_STATEMENT}</p>
            <div className="flex flex-wrap gap-3 text-xs">
              {[
                { l: "Governance Framework", h: "/about/governance" },
                { l: "Selection Integrity", h: "/about/governance#selection" },
                { l: "Evaluation Methodology", h: "/about/governance#methodology" },
                { l: "EDI Matrix", h: "/about/governance#edi" },
                { l: "FAQs", h: "/support" },
                { l: "Sponsor Independence", h: "/about/governance#sponsors" },
                { l: "Privacy", h: "/policies" },
                { l: "Accessibility", h: "/policies#accessibility" },
                { l: "Contact", h: "/contact" },
              ].map((l) => (
                <Link key={l.l} to={l.h} className="px-3 py-1.5 rounded-full border border-gold/25 text-ivory/75 hover:border-gold/55 hover:text-ivory">
                  {l.l}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline helpers
// ---------------------------------------------------------------------------

function Section({
  id, eyebrow, title, sub, children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id ?? title}-heading`} className="py-14 md:py-20 border-b border-gold/10">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="mb-8 max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.18em] text-gold/80 mb-2">{eyebrow}</div>
          <h2 id={`${id ?? title}-heading`} className="font-playfair text-3xl md:text-4xl text-ivory font-bold mb-3">
            {title}
          </h2>
          {sub && <p className="text-ivory/65 text-sm md:text-base">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function TierChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-all ${
        active
          ? "bg-gold text-charcoal border-gold font-semibold"
          : "border-gold/25 text-ivory/80 hover:border-gold/55 hover:text-ivory"
      }`}
      aria-pressed={active}
    >
      {label} <span className="opacity-70 ml-1">· {count}</span>
    </button>
  );
}
