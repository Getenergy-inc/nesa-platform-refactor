import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Users, Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getTierBySlug } from "@/config/recognitionArchitecture2026";
import { CATEGORY_TO_REGISTRY, countSubcategoriesFor } from "@/config/recognition/categoryAlias";

const SITE = "https://nesaafrica.lovable.app";
const BRAND_TAGLINE = "Enablers of Education for All Across Africa";

export default function EighteenCategoriesPage() {
  const tier = getTierBySlug("gold-blue-garnet");
  const categories = tier?.categories ?? [];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.slug.includes(q),
    );
  }, [categories, query]);

  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <Helmet>
        <title>18 Award Categories · Enablers of Education for All Across Africa | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Browse the 18 Gold–Blue Garnet Award Categories of NESA-Africa 2026 — Enablers of Education for All Across Africa. Jump directly into each category and its subcategories."
        />
        <link rel="canonical" href={`${SITE}/awards/18-categories`} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          { name: "18 Award Categories", path: "/awards/18-categories" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="mb-4 border-gold/40 bg-gold/10 text-gold">
              <Sparkles className="mr-1.5 h-3 w-3" /> {BRAND_TAGLINE}
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory">
              The 18 Award Categories
            </h1>
            <p className="mt-4 text-lg text-ivory/75 leading-relaxed">
              Africa's competitive recognition for individuals and organisations serving as{" "}
              <span className="text-gold">{BRAND_TAGLINE}</span>. Pick a category to view its
              subcategories, existing nominees, and how to nominate.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-ivory/70">
              <span className="inline-flex items-center gap-2"><Trophy className="h-4 w-4 text-gold" /> 18 Categories</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-gold" /> Jury + Public</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> NRC Verified</span>
            </div>

            {/* Search */}
            <div className="mt-8 mx-auto flex max-w-lg items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-2 focus-within:border-gold">
              <Search className="h-4 w-4 text-gold" aria-hidden />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a category (e.g. STEM, CSR, Libraries)…"
                className="border-0 bg-transparent p-0 text-ivory placeholder:text-ivory/40 focus-visible:ring-0"
                aria-label="Search categories"
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-6">
                <Link to="/nominate?tier=gold-blue-garnet">Nominate an Enabler</Link>
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
      <section className="container mx-auto px-4 py-12 md:py-16">
        {filtered.length === 0 ? (
          <p className="text-center text-ivory/60">No category matches "{query}".</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cat, idx) => {
              const subCount = countSubcategoriesFor(cat.slug);
              const globalIdx = categories.findIndex((c) => c.slug === cat.slug);
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: (idx % 6) * 0.03 }}
                >
                  <Link
                    to={`/awards/18-categories/${cat.slug}`}
                    className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl"
                    aria-label={`Open category: ${cat.name}`}
                  >
                    <Card className="h-full border-gold/15 bg-charcoal-light/60 transition-all hover:border-gold/50 hover:shadow-[0_0_30px_-12px_rgba(244,196,48,0.35)]">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-mono text-xs text-gold/80">
                            {String(globalIdx + 1).padStart(2, "0")} / 18
                          </span>
                          <Badge variant="outline" className="border-gold/30 text-gold/90 text-[10px]">
                            {subCount > 0 ? `${subCount} subcategories` : "Open call"}
                          </Badge>
                        </div>
                        <h2 className="font-serif text-xl text-ivory leading-snug group-hover:text-gold transition-colors">
                          {cat.name}
                        </h2>
                        <p className="mt-3 text-sm text-ivory/65 leading-relaxed line-clamp-3">
                          {cat.tagline}
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 text-sm text-gold/90 group-hover:gap-3 transition-all">
                          View category & subcategories <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t border-gold/15 bg-charcoal-light/40">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{BRAND_TAGLINE}</p>
          <h3 className="mt-2 font-serif text-2xl text-ivory">
            Know an Enabler who deserves recognition?
          </h3>
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
