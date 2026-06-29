import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getTierBySlug } from "@/config/recognitionArchitecture2026";

const SITE = "https://nesaafrica.lovable.app";

export default function EighteenCategoriesPage() {
  const tier = getTierBySlug("gold-blue-garnet");
  const categories = tier?.categories ?? [];

  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <Helmet>
        <title>The 18 Award Categories | Gold-Blue Garnet · NESA-Africa 2026</title>
        <meta
          name="description"
          content="Explore the 18 Gold-Blue Garnet Award Categories of NESA-Africa 2026 — Africa's competitive, jury and public-voting recognition track for education impact."
        />
        <link rel="canonical" href={`${SITE}/awards/18-categories`} />
      </Helmet>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE },
          { name: "Awards", url: `${SITE}/awards` },
          { name: "18 Award Categories", url: `${SITE}/awards/18-categories` },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="mb-4 border-gold/40 bg-gold/10 text-gold">
              Gold–Blue Garnet · Competitive Track
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory">
              The 18 Award Categories
            </h1>
            <p className="mt-5 text-lg text-ivory/75 leading-relaxed">
              Africa's competitive recognition for individuals and organisations driving
              measurable education impact across the continent, the Diaspora, and Friends of
              Africa. Each category follows the same governance flow:
              <span className="text-gold"> NRC eligibility check</span> →
              <span className="text-gold"> independent jury shortlist</span> →
              <span className="text-gold"> combined public + jury vote</span>.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-ivory/70">
              <span className="inline-flex items-center gap-2"><Trophy className="h-4 w-4 text-gold" /> 18 Categories</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-gold" /> Jury + Public</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> NRC Verified</span>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-6">
                <Link to="/nominate?tier=gold-blue-garnet">Nominate a Champion</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6"
              >
                <Link to="/awards/gold-blue-garnet">View Tier Overview</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (idx % 6) * 0.04 }}
            >
              <Link
                to={`/awards/gold-blue-garnet/${cat.slug}`}
                className="group block h-full"
                aria-label={`View category: ${cat.name}`}
              >
                <Card className="h-full border-gold/15 bg-charcoal-light/60 transition-all hover:border-gold/50 hover:shadow-[0_0_30px_-12px_rgba(244,196,48,0.35)]">
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs text-gold/80">
                        {String(idx + 1).padStart(2, "0")} / 18
                      </span>
                      <Badge variant="outline" className="border-gold/30 text-gold/90 text-[10px]">
                        Blue Garnet
                      </Badge>
                    </div>
                    <h2 className="font-serif text-xl text-ivory leading-snug group-hover:text-gold transition-colors">
                      {cat.name}
                    </h2>
                    <p className="mt-3 text-sm text-ivory/65 leading-relaxed">{cat.tagline}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm text-gold/90 group-hover:gap-3 transition-all">
                      Explore category <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-gold/15 bg-charcoal-light/40">
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="font-serif text-2xl text-ivory">Know a champion who deserves recognition?</h3>
          <p className="mt-2 text-ivory/70">Nominations are open across all 18 categories.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-6">
              <Link to="/nominate?tier=gold-blue-garnet">Start a Nomination</Link>
            </Button>
            <Button asChild variant="outline" className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6">
              <Link to="/nominees">Browse Existing Nominees</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
