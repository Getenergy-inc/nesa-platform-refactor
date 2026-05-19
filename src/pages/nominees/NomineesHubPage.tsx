import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, Trophy, Users, ArrowRight, ChevronRight, Flame, TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";

export default function NomineesHubPage() {
  const navigate = useNavigate();
  const { data: nominees, isLoading } = useNominees();
  const [search, setSearch] = useState("");

  const { categories, trending, mostVoted, totalCount } = useMemo(() => {
    if (!nominees) return { categories: [], trending: [], mostVoted: [], totalCount: 0 };

    const valid = nominees.filter(
      (n) => n.status === "approved" || n.status === "platinum" || n.status === "pending"
    );

    const catMap = new Map<
      string,
      { slug: string; name: string; count: number; topNominees: EnrichedDatabaseNominee[] }
    >();
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
  }, [nominees]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

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
        <title>Nominees Directory — NESA-Africa 2026</title>
        <meta
          name="description"
          content="Explore every NESA-Africa nominee by award category. Discover changemakers, vote, and renominate champions advancing Education for All."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/nominees" />
        <meta property="og:title" content="NESA-Africa Nominees Directory" />
        <meta property="og:description" content="Browse every NESA-Africa nominee by award category." />
        <meta property="og:url" content="https://nesaafrica.lovable.app/nominees" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "NESA-Africa Nominees Directory",
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
              <Sparkles className="w-3 h-3 mr-1" /> Nominees Directory
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory mb-3">
              Discover Africa's Education Changemakers
            </h1>
            <p className="text-ivory/70 max-w-2xl mx-auto mb-6">
              Explore {totalCount.toLocaleString()}+ nominees across every award category — from lifetime icons
              to digital voices advancing Education for All.
            </p>

            <form onSubmit={onSearchSubmit} className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, or country..."
                className="pl-12 h-12 bg-charcoal-light border-gold/30 text-ivory placeholder:text-ivory/40 focus:border-gold rounded-full"
              />
            </form>
          </motion.div>

          {/* Trending rail */}
          {!isLoading && trending.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl md:text-2xl font-bold text-ivory flex items-center gap-2">
                  <Flame className="w-5 h-5 text-gold" /> Trending Now
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {trending.slice(0, 4).map((n) => (
                  <LandingNomineeCard key={n.id} nominee={n} />
                ))}
              </div>
            </section>
          )}

          {/* Category Index */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory flex items-center gap-2">
              <Trophy className="w-6 h-6 text-gold" /> Browse by Category
            </h2>
            <span className="text-sm text-ivory/60">{filteredCategories.length} categories</span>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16 text-ivory/60">
              <Users className="w-12 h-12 mx-auto text-gold/30 mb-3" />
              No categories match your search.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.4) }}
                >
                  <Link
                    to={`/nominees/category/${cat.slug}`}
                    className="block group relative overflow-hidden rounded-2xl border border-gold/15 hover:border-gold/40 bg-gradient-to-br from-charcoal-light to-charcoal p-5 h-full transition-all hover:shadow-lg hover:shadow-gold/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-11 w-11 rounded-xl bg-gold/15 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-gold" />
                      </div>
                      <Badge className="bg-charcoal text-ivory/80 border-gold/20 text-[10px]">
                        {cat.count} nominees
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg font-bold text-ivory group-hover:text-gold transition-colors line-clamp-2 mb-2">
                      {cat.name}
                    </h3>
                    {/* Avatar stack */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex -space-x-2">
                        {cat.topNominees.slice(0, 3).map((n) => (
                          <div
                            key={n.id}
                            className="w-8 h-8 rounded-full border-2 border-charcoal overflow-hidden bg-charcoal-light"
                            title={n.name}
                          >
                            <img
                              src={n.photoUrl}
                              alt=""
                              className={n.imageType === "logo" ? "object-contain w-full h-full p-1 bg-white/90" : "object-cover w-full h-full"}
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
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
              <Link to="/nominate">
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
        </div>
      </section>
    </>
  );
}
