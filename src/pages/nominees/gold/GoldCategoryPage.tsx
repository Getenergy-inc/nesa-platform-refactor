import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ChevronRight, Search, Sparkles, Trophy, Users, Vote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { GOLD_CATEGORIES, getGoldCategory } from "@/data/goldSpecialRecognition";
import { useResolveNomineeMedia } from "@/hooks/useNomineeMedia";
import { cn } from "@/lib/utils";
import { HonoureeImage } from "@/components/honourees/HonoureeImage";

type Sort = "votes" | "newest" | "trending" | "az";

const PAGE_SIZE = 9;

export default function GoldCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categorySlug ? getGoldCategory(categorySlug) : undefined;
  const resolveMedia = useResolveNomineeMedia();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState<Sort>("votes");
  const [page, setPage] = useState(1);

  const countries = useMemo(() => {
    if (!category) return [];
    return Array.from(new Set(category.nominees.map((n) => n.country))).sort();
  }, [category]);

  const filtered = useMemo(() => {
    if (!category) return [];
    let r = [...category.nominees];
    if (filter !== "All") {
      const f = filter.toLowerCase();
      r = r.filter((n) => n.filterTags.includes(f) || n.discipline.toLowerCase().includes(f));
    }
    if (country !== "all") r = r.filter((n) => n.country === country);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.country.toLowerCase().includes(q) ||
          n.discipline.toLowerCase().includes(q),
      );
    }
    if (sort === "votes" || sort === "trending") r.sort((a, b) => b.votes - a.votes);
    else if (sort === "az") r.sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [category, filter, country, search, sort]);

  if (!category) return <Navigate to="/nominees/gold-special-recognition" replace />;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featured = [...category.nominees].sort((a, b) => b.votes - a.votes).slice(0, 3);
  const relatedCategories = GOLD_CATEGORIES.filter((c) => c.slug !== category.slug);
  const canonical = `https://nesaafrica.lovable.app/nominees/gold-special-recognition/${category.slug}`;
  const seoMap: Record<string, string> = {
    "sports-for-education": "Sports for Education Nominees | NESA Africa 2026",
    "music-for-education": "Music for Education Nominees | NESA Africa 2026",
    "social-media-for-education": "Social Media for Education Nominees | NESA Africa 2026",
  };

  return (
    <>
      <Helmet>
        <title>{seoMap[category.slug] || `${category.title} Nominees | NESA Africa 2026`}</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${category.title} — NESA Africa 2026`} />
        <meta property="og:description" content={category.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.title} Nominees`,
            url: canonical,
            mainEntity: { "@type": "ItemList", numberOfItems: category.nominees.length },
          })}
        </script>
      </Helmet>

      <section className="bg-charcoal min-h-screen py-10 md:py-14">
        <div className="container">
          <NomineeBreadcrumbs
            items={[
              { label: "Nominees", href: "/nominees" },
              { label: "Influencers Education Impact Award", href: "/nominees/gold-special-recognition" },
              { label: category.shortName },
            ]}
          />

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-charcoal-light via-charcoal to-charcoal mb-8 shadow-[0_0_60px_-15px_rgba(212,175,55,0.25)]"
          >
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full blur-3xl bg-gradient-to-br ${category.accent}`} />
            </div>
            <div className="relative px-6 py-10 md:px-10 md:py-14 text-center flex flex-col items-center">
              <div className="mb-5 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/40">
                <category.icon className="w-8 h-8 md:w-10 md:h-10 text-gold" />
              </div>
              <Badge className="mb-4 bg-gold/15 text-gold border-gold/30 uppercase tracking-[0.2em] text-[10px] px-3 py-1">
                Influencers Education Impact Award · 2026
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory mb-4 leading-[1.1] max-w-3xl">
                {category.pageTitle}
              </h1>
              <p className="text-ivory/70 max-w-2xl text-base md:text-lg mb-6">
                {category.description}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2 text-ivory/85">
                  <Users className="w-4 h-4 text-gold" />
                  <span className="font-display text-xl text-gold font-bold">{category.nominees.length}</span>
                  <span className="text-ivory/60">nominees</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gold/40" />
                <div className="flex items-center gap-2 text-ivory/85">
                  <span className="font-display text-xl text-gold font-bold">{countries.length}</span>
                  <span className="text-ivory/60">countries</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="#vote">
                  <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-7 gap-2 shadow-lg shadow-gold/20">
                    <Vote className="w-4 h-4" /> Vote Now
                  </Button>
                </a>
                <Link to="/nominate">
                  <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-7 gap-2 bg-charcoal/40 backdrop-blur">
                    Nominate <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Filter tabs */}
          <div className="sticky top-16 z-30 -mx-4 md:mx-0 mb-6 backdrop-blur-md bg-charcoal/85 border-y border-gold/10 md:border md:rounded-2xl py-3 px-3 md:px-4">
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {category.filters.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setPage(1); }}
                    className={cn(
                      "shrink-0 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all border",
                      active
                        ? "bg-gold text-charcoal border-gold shadow-md shadow-gold/30"
                        : "bg-charcoal-light/60 text-ivory/75 border-gold/15 hover:border-gold/40 hover:text-gold",
                    )}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured */}
          {filter === "All" && !search && country === "all" && (
            <section className="mb-10">
              <h2 className="font-display text-xl md:text-2xl font-bold text-ivory mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" /> Featured Nominees
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {featured.map((n) => (
                  <Link
                    key={n.slug}
                    to={`/nominees/gold-special-recognition/${category.slug}/${n.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-gold/30 bg-charcoal-light hover:border-gold transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <HonoureeImage slug={n.slug} name={n.name} fallbackImage={n.image} flag={n.flag} imgClassName="transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-transparent to-transparent" />
                      <Badge className="absolute top-3 right-3 bg-gold text-charcoal border-0 font-bold text-[10px]">
                        ★ Top Voted
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display text-lg font-bold text-ivory group-hover:text-gold transition-colors">{n.name}</h3>
                        {n.verified && <BadgeCheck className="w-4 h-4 text-gold" />}
                      </div>
                      <p className="text-xs text-ivory/60 mb-2">{n.flag} {n.country} · {n.discipline}</p>
                      <p className="text-sm text-ivory/70 line-clamp-2">{n.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Discovery filters */}
          <div id="vote" className="bg-charcoal-light/60 border border-gold/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3 scroll-mt-24">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
              <Input
                placeholder="Search nominees..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10 bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40 focus:border-gold"
              />
            </div>
            <Select value={country} onValueChange={(v) => { setCountry(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-48 bg-charcoal border-gold/20 text-ivory">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger className="w-full md:w-44 bg-charcoal border-gold/20 text-ivory">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="votes">Most Voted</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="az">A → Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid */}
          {pageItems.length === 0 ? (
            <div className="text-center py-16 text-ivory/60">
              <Users className="w-12 h-12 mx-auto text-gold/30 mb-3" />
              No nominees match your filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pageItems.map((n, i) => (
                <motion.article
                  key={n.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-charcoal-light hover:border-gold/50 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.35)] transition-all flex flex-col"
                >
                  <Link to={`/nominees/gold-special-recognition/${category.slug}/${n.slug}`} className="relative h-56 overflow-hidden block">
                    <img src={resolveMedia(n.slug, n.image, n.name).image ?? n.image} alt={resolveMedia(n.slug, n.image, n.name).alt ?? n.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-transparent to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-charcoal/80 backdrop-blur text-gold border-gold/40 text-[10px]">
                      {n.badge}
                    </Badge>
                    {n.verified && (
                      <div className="absolute top-3 right-3 bg-gold rounded-full p-1.5">
                        <BadgeCheck className="w-3 h-3 text-charcoal" />
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg font-bold text-ivory group-hover:text-gold transition-colors">{n.name}</h3>
                    </div>
                    <p className="text-xs text-ivory/55 mb-2">
                      {n.flag} {n.country} · <span className="text-ivory/70">{n.discipline}</span>
                      {n.followers && <span className="text-gold/80"> · {n.followers}</span>}
                    </p>
                    <p className="text-sm text-ivory/70 line-clamp-3 mb-4 flex-1">{n.summary}</p>

                    <div className="flex gap-2">
                      <Link to={`/nominees/gold-special-recognition/${category.slug}/${n.slug}#vote`} className="flex-1">
                        <Button size="sm" className="w-full bg-gold hover:bg-gold/90 text-charcoal font-bold gap-1.5">
                          <Vote className="w-3.5 h-3.5" /> Vote Now
                        </Button>
                      </Link>
                      <Link to={`/nominees/gold-special-recognition/${category.slug}/${n.slug}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10 gap-1.5">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="border-gold/30 text-gold hover:bg-gold/10">
                Previous
              </Button>
              <span className="text-sm text-ivory/70 px-3">
                Page <span className="text-gold font-semibold">{page}</span> of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="border-gold/30 text-gold hover:bg-gold/10">
                Next
              </Button>
            </div>
          )}

          {/* Related Gold categories */}
          <section className="mt-14">
            <h2 className="font-display text-xl md:text-2xl font-bold text-ivory mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" /> Related Gold Categories
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedCategories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/nominees/gold-special-recognition/${c.slug}`}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-gold/20 bg-charcoal-light hover:border-gold/50 transition-all"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/40 flex items-center justify-center">
                    <c.icon className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-bold text-ivory group-hover:text-gold transition-colors">{c.title}</h3>
                    <p className="text-xs text-ivory/55 line-clamp-1">{c.nominees.length} nominees</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gold/60 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <div className="mt-12 rounded-3xl border border-gold/20 bg-gradient-to-br from-charcoal-light to-charcoal p-8 md:p-10 text-center">
            <h3 className="font-display text-xl md:text-2xl font-bold text-ivory mb-2">
              Don't see your champion?
            </h3>
            <p className="text-ivory/60 mb-5 text-sm md:text-base">
              Submit a {category.shortName} nominee advancing education across Africa.
            </p>
            <Link to="/nominate">
              <Button className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-7 gap-2">
                Nominate Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
