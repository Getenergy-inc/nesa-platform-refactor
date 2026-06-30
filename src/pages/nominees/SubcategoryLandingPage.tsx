import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Users,
  ChevronRight,
  Award,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNominees } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";
import {
  getSubcategoryBySlug,
  listSiblingSubcategories,
  listRegionalVariants,
  TIER_LABELS,
  type SubcategoryEntry,
} from "@/config/recognition/subcategoryRegistry";
import { trackEvent } from "@/lib/analytics";

interface Props {
  entry: SubcategoryEntry;
}

const TIER_COLOR: Record<string, string> = {
  icon: "from-amber-500/20 to-amber-700/10 border-amber-400/40",
  "blue-garnet": "from-blue-700/20 to-rose-700/10 border-blue-400/40",
  platinum: "from-slate-300/20 to-slate-500/10 border-slate-200/40",
  influencer: "from-fuchsia-500/20 to-rose-500/10 border-fuchsia-400/40",
};

export default function SubcategoryLandingPage({ entry }: Props) {
  const { data: nominees, isLoading } = useNominees();

  const matched = useMemo(() => {
    if (!nominees) return [];
    return nominees.filter(
      (n) =>
        (n.subcategorySlug === entry.slug ||
          (entry.baseSlug && n.subcategorySlug === entry.baseSlug)) &&
        (n.status === "approved" ||
          n.status === "platinum" ||
          n.status === "pending"),
    );
  }, [nominees, entry.slug, entry.baseSlug]);

  const siblings = useMemo(() => listSiblingSubcategories(entry.slug), [entry.slug]);
  const regionalVariants = useMemo(
    () => (entry.isRegional ? [] : listRegionalVariants(entry.slug)),
    [entry.slug, entry.isRegional],
  );

  const canonical = `https://nesaafrica.lovable.app/nominees/${entry.slug}`;
  const nominateHref = `/nominate?${entry.nominateQuery}`;
  const isGBG = entry.tier === "blue-garnet";

  const breadcrumbs = [
    { label: "Nominees", href: "/nominees" },
    { label: TIER_LABELS[entry.tier], href: "/awards" },
    { label: entry.parentCategory, href: `/awards/${entry.parentCategorySlug}` },
    { label: entry.shortLabel ?? entry.title },
  ];

  return (
    <>
      <Helmet>
        <title>{`${entry.title} | NESA-Africa 2026`}</title>
        <meta name="description" content={entry.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={entry.title} />
        <meta property="og:description" content={entry.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: entry.title,
            description: entry.description,
            url: canonical,
            numberOfItems: matched.length,
          })}
        </script>
      </Helmet>

      <section className="min-h-screen bg-charcoal py-10 md:py-14">
        <div className="container">
          <NomineeBreadcrumbs items={breadcrumbs} />

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${TIER_COLOR[entry.tier]} p-8 md:p-12 mb-10`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-gold/15 border border-gold/40 text-gold">
                <Trophy className="mr-1 h-3 w-3" />
                {TIER_LABELS[entry.tier]}
              </Badge>
              <Badge variant="outline" className="border-ivory/30 text-ivory/80">
                {entry.parentCategory}
              </Badge>
              {entry.isRegional && entry.regionName && (
                <Badge variant="outline" className="border-emerald-400/40 text-emerald-200">
                  <MapPin className="mr-1 h-3 w-3" />
                  {entry.regionName}
                </Badge>
              )}
              <Badge variant="outline" className="border-ivory/20 text-ivory/70 capitalize">
                {entry.scope.replace("-", " ")}
              </Badge>
            </div>

            <h1 className="font-playfair text-3xl md:text-5xl text-ivory leading-tight max-w-4xl">
              {entry.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base md:text-lg text-ivory/80">
              {entry.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-ivory/70">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gold" />
                <strong className="text-ivory">{matched.length}</strong> nominees
              </span>
              {matched.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold" />
                  <strong className="text-ivory">
                    {new Set(matched.map((n) => n.country).filter(Boolean)).size}
                  </strong>{" "}
                  countries
                </span>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-charcoal hover:bg-gold/90 rounded-full"
                onClick={() =>
                  trackEvent("subcategory_nominate_click", {
                    slug: entry.slug,
                    tier: entry.tier,
                  })
                }
              >
                <Link to={nominateHref}>
                  Nominate in this Category
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 rounded-full"
              >
                <Link to={`/awards/${entry.parentCategorySlug}`}>
                  View Parent Category
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr,300px] gap-8">
            {/* MAIN */}
            <div className="space-y-12">
              {/* Why this matters */}
              <section>
                <h2 className="font-playfair text-2xl text-gold mb-3">
                  Why This Category Matters
                </h2>
                <p className="text-ivory/75 leading-relaxed">
                  {entry.description} Recognition under {TIER_LABELS[entry.tier]} signals
                  verified, sustained impact on African learners and education systems.
                </p>
              </section>

              {/* Eligibility */}
              <section>
                <h2 className="font-playfair text-2xl text-gold mb-4">
                  Eligibility Criteria
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {[
                    "Active education impact in the stated scope (2023–2026)",
                    "Verifiable evidence — reports, MoUs, beneficiary counts",
                    "No active sanctions or unresolved governance issues",
                    entry.isRegional
                      ? `Demonstrated work within ${entry.regionName}`
                      : `Alignment with ${entry.parentCategory} mission`,
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2 rounded-lg border border-gold/15 bg-charcoal-light/40 p-3 text-sm text-ivory/80"
                    >
                      <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Nominees */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-playfair text-2xl text-gold">
                    Nominees in this Category
                  </h2>
                  {matched.length > 0 && (
                    <Badge className="bg-gold/15 border border-gold/40 text-gold">
                      {matched.length} verified
                    </Badge>
                  )}
                </div>

                {isLoading ? (
                  <p className="text-ivory/60">Loading verified nominees…</p>
                ) : matched.length === 0 ? (
                  <div className="rounded-2xl border border-gold/20 bg-charcoal-light/40 p-8 text-center">
                    <Award className="mx-auto h-10 w-10 text-gold/40 mb-3" />
                    <p className="text-ivory/80 font-semibold mb-1">
                      This category is open for nominations.
                    </p>
                    <p className="text-sm text-ivory/60 mb-5">
                      Be among the first to nominate an Education Enabler in{" "}
                      {entry.shortLabel ?? entry.title}.
                    </p>
                    <Button
                      asChild
                      className="bg-gold text-charcoal hover:bg-gold/90 rounded-full"
                    >
                      <Link to={nominateHref}>
                        Submit a Nomination
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {matched.slice(0, 24).map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      >
                        <LandingNomineeCard nominee={n} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* How to Nominate */}
              <section>
                <h2 className="font-playfair text-2xl text-gold mb-4">
                  How to Nominate
                </h2>
                <ol className="space-y-3">
                  {[
                    "Open the guided nomination form via the button above.",
                    "Provide verifiable evidence — links, reports, beneficiary metrics.",
                    "NRC reviewers screen every submission for integrity and eligibility.",
                    isGBG
                      ? "Approved nominees enter the 60/40 jury + public voting flow."
                      : "Approved nominees advance to independent jury evaluation.",
                  ].map((step, i) => (
                    <li
                      key={step}
                      className="flex gap-3 rounded-lg border border-gold/15 bg-charcoal-light/40 p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-ivory/80 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-5">
              <Link
                to={`/awards/${entry.parentCategorySlug}`}
                className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold/80"
              >
                <ArrowLeft className="w-3 h-3" /> Back to {entry.parentCategory}
              </Link>

              {regionalVariants.length > 0 && (
                <div className="rounded-2xl border border-gold/15 bg-charcoal-light/60 p-4">
                  <h3 className="font-display text-sm font-bold text-ivory mb-3">
                    Regional Editions
                  </h3>
                  <ul className="space-y-1">
                    {regionalVariants.map((r) => (
                      <li key={r.slug}>
                        <Link
                          to={`/nominees/${r.slug}`}
                          className="flex items-center justify-between gap-2 text-xs text-ivory/70 hover:text-gold px-2 py-2 rounded-lg hover:bg-gold/5 transition-colors"
                        >
                          <span>{r.regionName}</span>
                          <ChevronRight className="h-3 w-3 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {siblings.length > 0 && (
                <div className="rounded-2xl border border-gold/15 bg-charcoal-light/60 p-4">
                  <h3 className="font-display text-sm font-bold text-ivory mb-3">
                    Other Subcategories in {entry.parentCategory}
                  </h3>
                  <ul className="space-y-1">
                    {siblings.slice(0, 12).map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/nominees/${s.slug}`}
                          className="flex items-start gap-2 text-xs text-ivory/70 hover:text-gold px-2 py-2 rounded-lg hover:bg-gold/5 transition-colors"
                        >
                          <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{s.shortLabel ?? s.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          <div className="mt-14">
            <ExploreNomineesCTA
              filterQuery={`?subcategory=${entry.slug}`}
              title="Explore More Education Enablers"
              description="Discover every approved nominee across Africa, the diaspora, and Friends of Africa communities."
            />
          </div>
        </div>
      </section>
    </>
  );
}

export { getSubcategoryBySlug };
