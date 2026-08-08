/**
 * /trending — full Featured Nominees discovery page.
 * Extracted from the homepage so the landing page stays a high-conversion gateway.
 */

import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, TrendingUp, ArrowLeft, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { usePageView } from "@/hooks/usePageView";

export default function TrendingPage() {
  usePageView("/trending", "Featured Nominees — NESA-Africa 2026");
  const { data: nominees, isLoading } = useNominees();

  const { trending, mostVoted } = useMemo(() => {
    if (!nominees) return { trending: [], mostVoted: [] };
    const valid = nominees.filter(
      (n) => n.status === "approved" || n.status === "platinum" || n.status === "pending",
    );
    const sorted = [...valid].sort((a, b) => Number(b.nrcVerified ?? false) - Number(a.nrcVerified ?? false) || a.name.localeCompare(b.name);
    return { trending: sorted.slice(0, 24), mostVoted: sorted.slice(0, 12) };
  }, [nominees]);

  return (
    <>
      <Helmet>
        <title>Featured Nominees — NESA-Africa 2026</title>
        <meta
          name="description"
          content="See who's trending across NESA-Africa nominee categories — the most-voted education changemakers across Africa and the diaspora."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/trending" />
        <meta property="og:title" content="Featured Nominees — NESA-Africa 2026" />
        <meta property="og:description" content="The most-voted NESA-Africa nominees this season." />
        <meta property="og:url" content="https://nesaafrica.lovable.app/trending" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Trending NESA-Africa Nominees",
            url: "https://nesaafrica.lovable.app/trending",
          })}
        </script>
      </Helmet>

      <section className="bg-charcoal py-10 md:py-16 min-h-screen">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="mb-3 bg-gold/15 text-gold border-gold/30">
              <Flame className="w-3 h-3 mr-1" /> Live Trending
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory mb-3">
              Featured Nominees
            </h1>
            <p className="text-ivory/70 max-w-2xl mx-auto">
              The most-voted NESA-Africa nominees right now — across every award category, region, and country.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : trending.length === 0 ? (
            <div className="text-center py-16 text-ivory/60">
              <Trophy className="w-10 h-10 mx-auto text-gold/30 mb-3" />
              No trending nominees yet.
            </div>
          ) : (
            <>
              <section className="mb-12">
                <h2 className="font-display text-xl md:text-2xl font-bold text-ivory flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-gold" /> Hottest Right Now
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {trending.map((n) => (
                    <LandingNomineeCard key={n.id} nominee={n} />
                  ))}
                </div>
              </section>

              {mostVoted.length > 0 && (
                <section className="mt-14">
                  <h2 className="font-display text-xl md:text-2xl font-bold text-ivory flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-gold" /> Most Voted (Season Total)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {mostVoted.map((n) => (
                      <LandingNomineeCard key={n.id} nominee={n} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full">
              <Link to="/nominees">Browse All Nominees</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
