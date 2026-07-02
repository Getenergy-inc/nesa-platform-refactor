import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Trophy, Users, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getTierBySlug } from "@/config/recognitionArchitecture2026";
import { listSubcategoriesForCategory } from "@/config/recognition/categoryAlias";

const SITE = "https://nesaafrica.lovable.app";
const BRAND_TAGLINE = "Enablers of Education for All Across Africa";

export default function CategoryDetailPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const tier = getTierBySlug("gold-blue-garnet");
  const category = tier?.categories.find((c) => c.slug === categorySlug);
  const subcategories = useMemo(
    () => (categorySlug ? listSubcategoriesForCategory(categorySlug) : []),
    [categorySlug],
  );

  if (!category) return <Navigate to="/awards/18-categories" replace />;

  const nominateHref = `/nominate?tier=gold-blue-garnet&category=${category.slug}`;

  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <Helmet>
        <title>{`${category.name} · Enablers of Education for All Across Africa | NESA-Africa 2026`}</title>
        <meta
          name="description"
          content={`${category.name} — ${category.tagline} Explore subcategories, existing nominees, and how to nominate as ${BRAND_TAGLINE}.`}
        />
        <link rel="canonical" href={`${SITE}/awards/18-categories/${category.slug}`} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          { name: "18 Categories", path: "/awards/18-categories" },
          { name: category.name, path: `/awards/18-categories/${category.slug}` },
        ]}
      />

      {/* Header */}
      <section className="border-b border-gold/20 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <Link
            to="/awards/18-categories"
            className="inline-flex items-center gap-1.5 text-xs text-ivory/60 hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all 18 categories
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 max-w-3xl"
          >
            <Badge className="mb-3 border-gold/40 bg-gold/10 text-gold">
              <Sparkles className="mr-1.5 h-3 w-3" /> {BRAND_TAGLINE}
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl text-ivory leading-tight">
              {category.name}
            </h1>
            <p className="mt-4 text-lg text-ivory/75 leading-relaxed">{category.tagline}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ivory/70">
              <span className="inline-flex items-center gap-2"><Trophy className="h-4 w-4 text-gold" /> Gold–Blue Garnet Tier</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-gold" /> Jury + Public Voting</span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> NRC Verified</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-6">
                <Link to={nominateHref}>Nominate an Enabler</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6"
              >
                <Link to="/nominees">Existing Nominees</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subcategories */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-ivory md:text-3xl">Recognition Subcategories</h2>
            <p className="mt-1 text-sm text-ivory/60">
              {subcategories.length > 0
                ? `${subcategories.length} subcategor${subcategories.length === 1 ? "y" : "ies"} under this category — pick one to view nominees and how to nominate.`
                : "This category is open for direct nominations — subcategory listings are being finalised."}
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold/70">{BRAND_TAGLINE}</p>
        </div>

        {subcategories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((s, idx) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: (idx % 6) * 0.03 }}
              >
                <Link
                  to={`/nominees/${s.slug}`}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl"
                  aria-label={`Open subcategory: ${s.title}`}
                >
                  <Card className="h-full border-gold/15 bg-charcoal-light/60 transition-all hover:border-gold/50 hover:shadow-[0_0_25px_-12px_rgba(244,196,48,0.4)]">
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-gold/70">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {s.scope === "africa-regional" && (
                          <Badge variant="outline" className="border-gold/30 text-gold/90 text-[10px]">
                            Regional
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-serif text-base leading-snug text-ivory group-hover:text-gold transition-colors">
                        {s.shortLabel ?? s.title}
                      </h3>
                      <p className="mt-2 text-xs text-ivory/60 leading-relaxed line-clamp-3">
                        {s.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold group-hover:gap-2 transition-all">
                        View subcategory <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gold/30 bg-black/30 p-8 text-center">
            <p className="text-ivory/70">
              Subcategories for <span className="text-gold">{category.name}</span> are being
              finalised. Nominations are already open at the category level.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-5">
                <Link to={nominateHref}>Nominate under this category</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-5"
              >
                <Link to="/awards/18-categories">Browse other categories</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="border-t border-gold/15 bg-charcoal-light/40">
        <div className="container mx-auto px-4 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{BRAND_TAGLINE}</p>
          <h3 className="mt-2 font-serif text-2xl text-ivory">
            Champion an Enabler within {category.name}
          </h3>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-6">
              <Link to={nominateHref}>Start Nomination</Link>
            </Button>
            <Button asChild variant="outline" className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6">
              <Link to="/awards/gold-blue-garnet">Tier Overview</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
