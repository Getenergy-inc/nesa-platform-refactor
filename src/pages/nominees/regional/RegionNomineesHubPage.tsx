import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Trophy, Users, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { AFRICA_REGIONS, classifyRegion, getRegionMeta, isValidRegionSlug } from "@/lib/regionClassifier";

const BASE_URL = "https://nesaafrica.lovable.app";

export default function RegionNomineesHubPage() {
  const { region } = useParams<{ region: string }>();
  const { data: nominees, isLoading } = useNominees();

  if (!region || !isValidRegionSlug(region)) {
    return <Navigate to="/nominees" replace />;
  }
  const meta = getRegionMeta(region)!;

  const { regionNominees, categoryGroups, countriesCount } = useMemo(() => {
    const empty = { regionNominees: [] as EnrichedDatabaseNominee[], categoryGroups: [] as Array<{ slug: string; name: string; count: number; sample: EnrichedDatabaseNominee[] }>, countriesCount: 0 };
    if (!nominees) return empty;
    const valid = nominees.filter((n) => n.status === "approved" || n.status === "platinum" || n.status === "pending");
    const inRegion = valid.filter((n) => classifyRegion({ country: n.country, region: n.region, categoryName: n.categoryName }).region === region);

    const catMap = new Map<string, { slug: string; name: string; count: number; sample: EnrichedDatabaseNominee[] }>();
    inRegion.forEach((n) => {
      const e = catMap.get(n.categorySlug) ?? { slug: n.categorySlug, name: n.categoryName, count: 0, sample: [] };
      e.count++;
      if (e.sample.length < 3) e.sample.push(n);
      catMap.set(n.categorySlug, e);
    });
    const countries = new Set(inRegion.map((n) => (n.country || "").trim()).filter(Boolean));

    return {
      regionNominees: inRegion,
      categoryGroups: Array.from(catMap.values()).sort((a, b) => b.count - a.count),
      countriesCount: countries.size,
    };
  }, [nominees, region]);

  const featured = useMemo(
    () => [...regionNominees].sort((a, b) => b.publicVotes - a.publicVotes).slice(0, 6),
    [regionNominees]
  );

  const canonical = `${BASE_URL}/nominees/${region}`;

  return (
    <>
      <Helmet>
        <title>{`${meta.name} Education Nominees | NESA-Africa 2026`}</title>
        <meta name="description" content={`Explore NESA-Africa nominees from ${meta.name}. ${meta.tagline}. ${regionNominees.length} nominees across ${categoryGroups.length} award categories.`} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${meta.name} Education Nominees — NESA-Africa`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${meta.name} Education Nominees`,
          url: canonical,
          description: meta.description,
          mainEntity: { "@type": "ItemList", numberOfItems: regionNominees.length },
        })}</script>
      </Helmet>

      <section className="bg-charcoal py-10 md:py-14 min-h-screen pb-20">
        <div className="container">
          <NomineeBreadcrumbs items={[{ label: "Nominees", href: "/nominees" }, { label: meta.name }]} />

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-charcoal-light via-charcoal to-charcoal mb-8 shadow-[0_0_60px_-15px_rgba(212,175,55,0.25)]"
          >
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gold/25 rounded-full blur-3xl" />
            </div>
            <div className="relative px-6 py-10 md:px-10 md:py-14 text-center flex flex-col items-center">
              <div className="mb-5 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/40 shadow-[0_0_30px_-5px_rgba(212,175,55,0.5)]">
                <Globe2 className="w-8 h-8 md:w-10 md:h-10 text-gold" />
              </div>
              <Badge className="mb-4 bg-gold/15 text-gold border-gold/30 uppercase tracking-[0.2em] text-[10px] px-3 py-1">
                <MapPin className="w-3 h-3 mr-1.5" /> Africa Region
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-ivory mb-3 leading-[1.1]">{meta.name}</h1>
              <p className="text-gold/90 italic mb-4">{meta.tagline}</p>
              <p className="text-ivory/70 max-w-2xl text-base md:text-lg mb-6">{meta.description}</p>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-7 text-sm">
                <div className="flex items-center gap-2 text-ivory/85">
                  <Users className="w-4 h-4 text-gold" />
                  <span className="font-display text-xl text-gold font-bold">{regionNominees.length.toLocaleString()}</span>
                  <span className="text-ivory/60">nominees</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gold/40" />
                <div className="flex items-center gap-2 text-ivory/85">
                  <span className="font-display text-xl text-gold font-bold">{categoryGroups.length}</span>
                  <span className="text-ivory/60">categories</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gold/40" />
                <div className="flex items-center gap-2 text-ivory/85">
                  <span className="font-display text-xl text-gold font-bold">{countriesCount}</span>
                  <span className="text-ivory/60">countries</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/vote"><Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-7 gap-2 shadow-lg shadow-gold/20"><Trophy className="w-4 h-4" /> Vote Now</Button></Link>
                <Link to="/nominate"><Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-7 gap-2 bg-charcoal/40 backdrop-blur">Nominate <ArrowRight className="w-4 h-4" /></Button></Link>
              </div>

              {/* Country chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-1.5 max-w-3xl">
                {meta.countries.slice(0, 18).map((c) => (
                  <span key={c} className="text-[11px] px-2.5 py-1 rounded-full bg-gold/5 border border-gold/15 text-ivory/70">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && regionNominees.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-gold/20 bg-charcoal-light/40">
              <Globe2 className="w-12 h-12 mx-auto text-gold/40 mb-4" />
              <h3 className="font-display text-2xl text-ivory mb-2">No verified nominees from {meta.name} yet</h3>
              <p className="text-ivory/60 max-w-md mx-auto mb-6">
                Be the first to nominate an education changemaker from {meta.name} for the 2026 NESA-Africa Awards.
              </p>
              <Link to="/nominate"><Button className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-7 gap-2"><Trophy className="w-4 h-4" /> Submit a Nomination</Button></Link>
            </div>
          )}

          {/* Category grid */}
          {!isLoading && categoryGroups.length > 0 && (
            <>
              <div className="flex items-end justify-between mb-5">
                <h2 className="font-display text-2xl md:text-3xl text-ivory">Award Categories in {meta.shortName} Africa</h2>
                <span className="text-xs text-ivory/50">{categoryGroups.length} categories</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {categoryGroups.map((c, i) => (
                  <motion.div
                    key={c.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  >
                    <Link
                      to={`/nominees/${region}/${c.slug}`}
                      className="group block h-full p-5 rounded-2xl border border-gold/20 bg-charcoal-light/40 hover:border-gold/50 hover:bg-charcoal-light/70 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Trophy className="w-5 h-5 text-gold" />
                        <span className="text-[11px] text-ivory/50">{c.count} nominees</span>
                      </div>
                      <h3 className="font-display text-lg text-ivory mb-2 group-hover:text-gold transition-colors line-clamp-2">{c.name}</h3>
                      <p className="text-xs text-ivory/50 mb-4 line-clamp-2">
                        {c.sample.map((n) => n.name).join(" • ")}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-gold font-medium">
                        Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Featured nominees */}
          {!isLoading && featured.length > 0 && (
            <>
              <div className="flex items-end justify-between mb-5">
                <h2 className="font-display text-2xl md:text-3xl text-ivory">Featured Nominees</h2>
                <span className="text-xs text-ivory/50">Top-voted in {meta.shortName} Africa</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {featured.map((n, i) => (
                  <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                    <LandingNomineeCard nominee={n} />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Cross-region navigation */}
          <div className="rounded-2xl border border-gold/20 bg-charcoal-light/40 p-6 md:p-8">
            <h3 className="font-display text-xl text-ivory mb-4">Explore Other Regions</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {AFRICA_REGIONS.filter((r) => r.slug !== region).map((r) => (
                <Link
                  key={r.slug}
                  to={`/nominees/${r.slug}`}
                  className="px-4 py-3 rounded-xl border border-gold/15 bg-charcoal/60 hover:border-gold/40 hover:bg-charcoal-light/60 text-ivory hover:text-gold text-sm text-center font-medium transition-all"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
