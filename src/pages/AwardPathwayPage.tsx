// Award category placeholder page — branded landing for each Pathway recognition slug.
// Resolves card content from DB (pathway_cards) with static defaults as fallback.

import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Trophy, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathwayCards } from "@/hooks/usePathwayCards";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  scope: string | null;
  subcat_count?: number;
};

// Map each pathway slug to category slugs (and/or scopes) used to surface real award categories.
const PATHWAY_CATEGORY_MATCH: Record<
  string,
  { slugs?: string[]; nameLike?: string[]; scopes?: string[] }
> = {
  "africa-education-icon": {
    slugs: ["africa-education-icon-award"],
  },
  "csr-education": {
    nameLike: ["CSR for Education"],
  },
  "influencer-education": {
    nameLike: ["Influencer Education"],
  },
  "grants-global-support": {
    scopes: ["INTERNATIONAL", "DIASPORA"],
  },
};

type Defaults = Record<
  string,
  {
    category: string;
    headline: string;
    awardLine: string;
    description: string;
    accentLabel: string;
    visualGradient: string;
    cta: string;
  }
>;

const DEFAULTS: Defaults = {
  "africa-education-icon": {
    category: "Lifetime Achievement",
    headline: "Who Will Be Crowned Africa Education Icon?",
    awardLine: "Africa Education Icon — Lifetime Achievement (2006–2026)",
    description:
      "Recognizing transformational leaders shaping education across Africa for over two decades.",
    accentLabel: "Legacy • 2006–2026",
    visualGradient: "from-gold/40 via-emerald-900/40 to-charcoal",
    cta: "Discover the Icon Award",
  },
  "csr-education": {
    category: "Corporate Recognition",
    headline: "Who Will Emerge as Africa's Leading CSR for Education Company?",
    awardLine: "Top CSR for Education Company Across African Regions — 2026",
    description:
      "Celebrating organizations funding, supporting, and transforming education systems.",
    accentLabel: "Corporate • Continental",
    visualGradient: "from-emerald-800/50 via-emerald-900/30 to-charcoal",
    cta: "Explore CSR Recognition",
  },
  "influencer-education": {
    category: "Digital Voices",
    headline: "Who Are Africa's Top Education Influencers?",
    awardLine: "Social Media, Music, and Sports Voices Shaping Education — 2026",
    description:
      "Recognizing influential voices driving education awareness across the continent.",
    accentLabel: "Creators • Music • Sports",
    visualGradient: "from-gold/35 via-orange-900/30 to-charcoal",
    cta: "See Influencer Categories",
  },
  "grants-global-support": {
    category: "Global Partnerships",
    headline: "Which Global Grants Are Powering Education in Africa?",
    awardLine: "Bilateral, Multilateral, and International Education Support — 2026",
    description: "Honoring global partners investing in education across Africa.",
    accentLabel: "Global • Bilateral • Multilateral",
    visualGradient: "from-emerald-900/50 via-gold/15 to-charcoal",
    cta: "View Global Support Awards",
  },
};

const SLUG_TO_DB_ID: Record<string, string> = {
  "africa-education-icon": "icon",
  "csr-education": "csr",
  "influencer-education": "influencer",
  "grants-global-support": "grants",
};

export default function AwardPathwayPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { cards } = usePathwayCards();
  const fallback = DEFAULTS[slug];
  const dbRow = cards.find((c) => c.id === SLUG_TO_DB_ID[slug]);

  const data = dbRow
    ? {
        category: dbRow.category,
        headline: dbRow.headline,
        awardLine: dbRow.award_line,
        description: dbRow.description,
        accentLabel: dbRow.accent_label || fallback?.accentLabel || "",
        visualGradient: dbRow.visual_gradient || fallback?.visualGradient || "",
        cta: dbRow.cta,
        image: dbRow.image_url,
      }
    : fallback
      ? { ...fallback, image: null as string | null }
      : null;

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const match = PATHWAY_CATEGORY_MATCH[slug];
    if (!match) {
      setLoadingCats(false);
      return;
    }
    (async () => {
      let q = supabase
        .from("categories")
        .select("id, slug, name, description, scope, subcategories(count)")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      const orParts: string[] = [];
      if (match.slugs?.length) orParts.push(`slug.in.(${match.slugs.join(",")})`);
      if (match.scopes?.length) orParts.push(`scope.in.(${match.scopes.join(",")})`);
      if (match.nameLike?.length)
        match.nameLike.forEach((n) => orParts.push(`name.ilike.%${n}%`));
      if (orParts.length) q = q.or(orParts.join(","));

      const { data: rows } = await q;
      if (cancelled) return;
      const mapped: CategoryRow[] = (rows || []).map((r: any) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        scope: r.scope,
        subcat_count: Array.isArray(r.subcategories) ? r.subcategories[0]?.count ?? 0 : 0,
      }));
      setCategories(mapped);
      setLoadingCats(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!data) {
    return (
      <div className="bg-charcoal min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-white mb-3">Pathway not found</h1>
          <Link to="/pathways">
            <Button className="bg-gold hover:bg-gold-dark text-charcoal rounded-full">
              Back to Recognition Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${data.category} — NESA-Africa 2026`}</title>
        <meta name="description" content={data.description} />
      </Helmet>

      <section className="relative bg-charcoal overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${data.visualGradient} opacity-80`} />
        {data.image && (
          <img
            src={data.image}
            alt={data.category}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/70 to-charcoal" />

        <div className="container relative px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                {data.accentLabel}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              {data.category}
            </h1>

            <p className="text-gold font-semibold text-lg sm:text-xl mb-3">{data.awardLine}</p>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              {data.headline} {data.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/nominate?category=${slug}`}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-7 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.6)]"
                >
                  Start a Nomination
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pathways">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2 px-7"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Recognition Hub
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Award categories from database */}
      <section className="bg-charcoal py-14 sm:py-20">
        <div className="container px-4 sm:px-6 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <Trophy className="h-5 w-5 text-charcoal" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Award Categories in this Pathway
              </h2>
              <p className="text-white/60 text-sm">
                Explore official {data.category.toLowerCase()} categories open for the 2026 cycle.
              </p>
            </div>
          </div>

          {loadingCats ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl border border-gold/15 bg-white/[0.03] animate-pulse"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6 text-white/70">
              No live categories yet — check back soon or{" "}
              <Link to="/categories" className="text-gold underline">
                browse all categories
              </Link>
              .
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/categories/${c.slug}`}
                  className="group rounded-2xl border border-gold/25 bg-gradient-to-br from-emerald-900/15 to-charcoal p-5 hover:border-gold/60 hover:bg-white/[0.05] transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-lg font-semibold text-white group-hover:text-gold transition">
                      {c.name}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-gold mt-1 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  {c.description && (
                    <p className="text-white/65 text-sm leading-relaxed mb-3 line-clamp-2">
                      {c.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-gold/80">
                    {c.scope && (
                      <span className="px-2 py-0.5 rounded-full border border-gold/30">
                        {c.scope.replace(/_/g, " ")}
                      </span>
                    )}
                    {!!c.subcat_count && (
                      <span className="inline-flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {c.subcat_count} subcategor{c.subcat_count === 1 ? "y" : "ies"}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={`/nominate?category=${slug}`}>
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-6">
                {data.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2 px-6"
              >
                Explore all categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
