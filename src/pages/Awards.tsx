// /awards — Recognition Pathway discovery hub.
//
// Enforces the funnel: Recognition Pathway → Geography → Category → Subcategory.
// Pathway cards, category counts, and featured nominees come from the CMS
// adapter layer (Lovable Cloud today; Contentful/Sanity once connected).
//
// Replaces the legacy 13-line awards.json stub. Drill-downs route into the
// existing per-tier pages (BlueGarnetAward, PlatinumAward, IconAward,
// InfluencerImpact2026) and the full category master index.

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Crown,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Globe2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  usePathwayCards,
  useAwardCategories,
  useFeaturedNominees,
} from "@/lib/cms/hooks";

const SITE = "https://nesaafrica.lovable.app";

/** Visual treatments for the four recognition pathways. */
const PATHWAY_STYLE: Record<
  string,
  { icon: typeof Trophy; gradient: string; pill: string }
> = {
  icon: {
    icon: Star,
    gradient: "from-amber-500/30 via-yellow-500/15 to-transparent",
    pill: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
  csr: {
    icon: Crown,
    gradient: "from-purple-500/30 via-fuchsia-500/15 to-transparent",
    pill: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  },
  influencer: {
    icon: Sparkles,
    gradient: "from-pink-500/30 via-rose-500/15 to-transparent",
    pill: "bg-pink-500/10 text-pink-300 border-pink-500/30",
  },
  grants: {
    icon: Globe2,
    gradient: "from-sky-500/30 via-blue-500/15 to-transparent",
    pill: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  },
};

const REGIONS = [
  { label: "West Africa", slug: "west-africa" },
  { label: "East Africa", slug: "east-africa" },
  { label: "Central Africa", slug: "central-africa" },
  { label: "Southern Africa", slug: "southern-africa" },
  { label: "North Africa", slug: "north-africa" },
  { label: "Horn of Africa", slug: "horn-of-africa" },
  { label: "Sahel Region", slug: "sahel" },
  { label: "Indian Ocean Islands", slug: "indian-ocean-islands" },
  { label: "Africans in Diaspora", slug: "diaspora" },
  { label: "Friends of Africa", slug: "friends-of-africa" },
];

export default function AwardsPage() {
  const { data: pathways, isLoading: pathwaysLoading } = usePathwayCards();
  const { data: categories, isLoading: catsLoading } = useAwardCategories();
  const { data: featured, isLoading: featuredLoading } = useFeaturedNominees(6);

  return (
    <>
      <Helmet>
        <title>Awards & Recognition Pathways | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Discover the four NESA-Africa recognition pathways — Africa Education Icon, Blue-Garnet, Platinum, and Influencer Impact. Explore by region, category, and subcategory."
        />
        <link rel="canonical" href={`${SITE}/awards`} />
        <meta property="og:title" content="Awards & Recognition Pathways | NESA-Africa 2026" />
        <meta property="og:url" content={`${SITE}/awards`} />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        {/* HEADER */}
        <section className="border-b border-gold/20 bg-gradient-to-b from-black via-charcoal to-charcoal py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gold uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 font-semibold">
              The Recognition Framework
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl mb-4 leading-tight">
              Four Pathways. One Continent.
              <span className="block text-gold">Every Education Changemaker.</span>
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mb-6">
              Choose how you want to discover Africa's education honourees —
              by pathway, by region, or by category. Every drill-down leads
              to nominees you can support, endorse, or nominate.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-white/80">
              <Badge className="bg-gold/20 text-gold border-gold/40">4 Tiers</Badge>
              <Badge className="bg-white/10 text-white/90 border-white/20">
                {categories?.length ?? 20} Categories
              </Badge>
              <Badge className="bg-white/10 text-white/90 border-white/20">96 Subcategories</Badge>
              <Badge className="bg-white/10 text-white/90 border-white/20">10 Regions</Badge>
            </div>
          </div>
        </section>

        {/* STEP 1 — RECOGNITION PATHWAY */}
        <section className="py-12 sm:py-16 px-4 sm:px-6" aria-labelledby="pathway-heading">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">
                  Step 1
                </p>
                <h2 id="pathway-heading" className="font-playfair text-2xl sm:text-3xl">
                  Pick a Recognition Pathway
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pathwaysLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-xl bg-white/5" />
                  ))
                : (pathways ?? []).map((card, i) => {
                    const style = PATHWAY_STYLE[card.id] ?? PATHWAY_STYLE.icon;
                    const Icon = style.icon;
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Link to={card.href} className="block group">
                          <Card
                            className={cn(
                              "relative overflow-hidden border-gold/20 bg-gradient-to-br",
                              style.gradient,
                              "hover:border-gold/50 transition-all",
                            )}
                          >
                            <CardContent className="p-5 sm:p-6">
                              <div className="flex items-start justify-between mb-3">
                                <Icon className="h-8 w-8 text-gold" aria-hidden="true" />
                                {card.accentLabel && (
                                  <Badge
                                    variant="outline"
                                    className={cn("text-[10px] sm:text-xs", style.pill)}
                                  >
                                    {card.accentLabel}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-playfair text-xl sm:text-2xl text-white mb-1">
                                {card.category}
                              </h3>
                              <p className="text-gold text-sm font-medium mb-3 line-clamp-2">
                                {card.awardLine}
                              </p>
                              <p className="text-white/70 text-sm leading-snug mb-4 line-clamp-2">
                                {card.headline}
                              </p>
                              <span className="inline-flex items-center text-gold text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                {card.cta}
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                              </span>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
            </div>
          </div>
        </section>

        {/* STEP 2 — GEOGRAPHY */}
        <section
          className="py-12 sm:py-16 px-4 sm:px-6 bg-black/30 border-y border-gold/10"
          aria-labelledby="geography-heading"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">
                Step 2
              </p>
              <h2 id="geography-heading" className="font-playfair text-2xl sm:text-3xl">
                …or browse by Region
              </h2>
              <p className="text-white/60 text-sm mt-2 max-w-xl">
                Every nominee belongs to one of ten education regions. Jump
                straight into nominees from the part of the continent you care
                about most.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {REGIONS.map((r) => (
                <Link
                  key={r.slug}
                  to={`/nominees?region=${r.slug}`}
                  className="rounded-lg border border-gold/20 bg-white/[0.03] hover:bg-gold/10 hover:border-gold/50 transition-all py-3 px-2 text-center text-xs sm:text-sm text-white/85 hover:text-gold font-medium"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* STEP 3 — CATEGORY */}
        <section className="py-12 sm:py-16 px-4 sm:px-6" aria-labelledby="category-heading">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">
                  Step 3
                </p>
                <h2 id="category-heading" className="font-playfair text-2xl sm:text-3xl">
                  …or pick a Category
                </h2>
              </div>
              <Button asChild variant="outline" size="sm" className="border-gold/40 text-gold hover:bg-gold/10">
                <Link to="/awards/categories">
                  See all categories
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {catsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg bg-white/5" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(categories ?? []).slice(0, 12).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/categories/${cat.slug}`}
                    className="group rounded-lg border border-gold/15 bg-white/[0.02] hover:bg-gold/5 hover:border-gold/40 transition-all p-4"
                  >
                    <h3 className="text-white font-semibold text-sm group-hover:text-gold transition-colors">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-white/55 text-xs mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STEP 4 — NOMINATE OR EXPLORE */}
        <section
          className="py-12 sm:py-16 px-4 sm:px-6 bg-black/30 border-y border-gold/10"
          aria-labelledby="explore-heading"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">
                  Step 4
                </p>
                <h2 id="explore-heading" className="font-playfair text-2xl sm:text-3xl">
                  Nominate or explore existing nominees
                </h2>
              </div>
              <Button asChild variant="outline" size="sm" className="border-gold/40 text-gold hover:bg-gold/10">
                <Link to="/nominees">
                  All nominees
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {featuredLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-lg bg-white/5" />
                  ))
                : (featured ?? []).map((n) => (
                    <Link
                      key={n.id}
                      to={`/nominee/${n.slug}`}
                      className="group rounded-lg overflow-hidden border border-gold/15 bg-white/[0.02] hover:border-gold/40 transition-all"
                    >
                      <div className="aspect-square bg-charcoal/60 flex items-center justify-center overflow-hidden">
                        {n.photoUrl || n.logoUrl ? (
                          <img
                            src={n.photoUrl || n.logoUrl || ""}
                            alt={n.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Users className="h-10 w-10 text-gold/40" aria-hidden="true" />
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-white text-xs font-semibold truncate group-hover:text-gold transition-colors">
                          {n.name}
                        </p>
                        {n.country && (
                          <p className="text-white/50 text-[10px] truncate">{n.country}</p>
                        )}
                      </div>
                    </Link>
                  ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90 font-semibold">
                <Link to="/nominate">
                  Nominate for 2026
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                <Link to="/nominees">
                  Explore Existing Nominees
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* INTEGRITY NOTICE */}
        <section className="py-8 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto flex items-start gap-3 rounded-lg border border-gold/15 bg-white/[0.02] p-4">
            <ShieldCheck className="h-5 w-5 text-gold mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Endorsements, sponsorships, and partnerships <strong>do not</strong> influence judging,
              verification, finalist selection, or winner selection. NESA-Africa operates an
              independent governance and integrity firewall.{" "}
              <Link to="/about/governance" className="text-gold hover:underline">
                View governance framework →
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
