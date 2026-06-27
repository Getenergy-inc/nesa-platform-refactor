// Awards Spine — unified Pathway / Category / Subcategory page.
// Drives:
//   /awards/explore/:pathwaySlug
//   /awards/explore/:pathwaySlug/:categorySlug
//   /awards/explore/:pathwaySlug/:categorySlug/:subcategorySlug
//
// One file, progressive discovery. Always renders a DiscoveryBreadcrumb and
// a Region filter when applicable.

import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronRight, Filter } from "lucide-react";
import {
  getPathway,
  getCategory,
  getCategoriesByPathway,
  getSubcategoriesByCategory,
  EDUCATION_REGIONS,
  type EducationRegionSlug,
  type PathwaySlug,
} from "@/config/recognitionArchitecture";
import DiscoveryBreadcrumb from "@/components/recognition/DiscoveryBreadcrumb";
import {
  trackPathwayView,
  trackCategoryView,
  trackSubcategoryView,
  trackRegionView,
} from "@/lib/analytics";
import { filterMasterNominees, getMasterRegions } from "@/lib/nomineeMasterData";

export default function AwardSpinePage() {
  const params = useParams<{
    pathwaySlug?: string;
    categorySlug?: string;
    subcategorySlug?: string;
  }>();

  const pathway = params.pathwaySlug
    ? getPathway(params.pathwaySlug as PathwaySlug)
    : undefined;
  const category = params.categorySlug ? getCategory(params.categorySlug) : undefined;
  const subcategories = category ? getSubcategoriesByCategory(category.slug) : [];
  const subcategory = params.subcategorySlug
    ? subcategories.find((s) => s.slug === params.subcategorySlug)
    : undefined;

  const [regionFilter, setRegionFilter] = useState<EducationRegionSlug | "all">("all");

  // Analytics
  useEffect(() => {
    if (!pathway) return;
    if (subcategory) {
      trackSubcategoryView(subcategory.slug, {
        pathway: pathway.slug,
        category: category?.slug,
      });
    } else if (category) {
      trackCategoryView(category.slug, { pathway: pathway.slug });
    } else {
      trackPathwayView(pathway.slug);
    }
  }, [pathway, category, subcategory]);

  // Resolve nominees pool, narrowed by category/subcategory keyword + region.
  const nominees = useMemo(() => {
    if (!category) return [];
    const pool = filterMasterNominees({});
    const tokens = [
      category.slug.replace(/-/g, " "),
      category.name.toLowerCase(),
      subcategory?.name.toLowerCase(),
      subcategory?.slug.replace(/-/g, " "),
    ].filter(Boolean) as string[];
    const matched = pool.filter((n) => {
      const hay = `${n.category} ${n.subcategory} ${n.categorySlug} ${n.subcategorySlug}`.toLowerCase();
      if (!tokens.some((t) => hay.includes(t.slice(0, 6)))) return false;
      if (regionFilter !== "all") {
        const regionName = EDUCATION_REGIONS.find((r) => r.slug === regionFilter)?.name.toLowerCase() ?? "";
        if (!n.region.toLowerCase().includes(regionName.split(" ")[0])) return false;
      }
      return true;
    });
    return matched.slice(0, 18);
  }, [category, subcategory, regionFilter]);

  if (!pathway) return <Navigate to="/awards" replace />;

  // ---------------------------------------------------------------- breadcrumb
  const crumbs = [
    { label: "Awards", href: "/awards" },
    { label: pathway.name, href: `/awards/explore/${pathway.slug}` },
    ...(category
      ? [
          {
            label: category.name,
            href: `/awards/explore/${pathway.slug}/${category.slug}`,
          },
        ]
      : []),
    ...(subcategory ? [{ label: subcategory.name }] : []),
  ];

  const title = subcategory?.name ?? category?.name ?? pathway.name;
  const description = subcategory
    ? `${subcategory.name} — recognition subcategory within ${category?.name}.`
    : category
      ? category.description
      : pathway.oneLiner;

  const masterRegions = getMasterRegions();
  const regionOptions = EDUCATION_REGIONS.filter((r) =>
    masterRegions.length ? masterRegions.includes(r.name) || true : true,
  );

  return (
    <>
      <Helmet>
        <title>{`${title} · NESA-Africa 2026`}</title>
        <meta name="description" content={description.slice(0, 158)} />
        <link
          rel="canonical"
          href={`https://nesaafrica.lovable.app/awards/explore/${pathway.slug}${
            category ? `/${category.slug}` : ""
          }${subcategory ? `/${subcategory.slug}` : ""}`}
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <DiscoveryBreadcrumb steps={crumbs} className="mb-6" />

          <header className="mb-8 md:mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Tier {pathway.tierNumber} · {pathway.subtitle}
            </p>
            <h1 className="font-display text-3xl text-white md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm text-white/75 md:text-base">
              {description}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
              {pathway.voteMechanicLabel}
            </p>
          </header>

          {/* PATHWAY LEVEL — show categories */}
          {!category && (
            <section aria-label="Categories" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getCategoriesByPathway(pathway.slug).map((c) => (
                <Link
                  key={c.slug}
                  to={`/awards/explore/${pathway.slug}/${c.slug}`}
                  className="group rounded-xl border border-gold/20 bg-black/40 p-5 hover:border-gold/60"
                >
                  <h3 className="font-display text-lg text-white group-hover:text-gold">
                    {c.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-white/65">{c.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                    Explore subcategories <ChevronRight className="h-3 w-3" aria-hidden />
                  </span>
                </Link>
              ))}
            </section>
          )}

          {/* CATEGORY LEVEL — show subcategories drawer (progressive) */}
          {category && !subcategory && subcategories.length > 0 && (
            <section aria-label="Recognition subcategories" className="mb-10">
              <h2 className="mb-4 font-display text-xl text-white md:text-2xl">
                Recognition subcategories
              </h2>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/awards/explore/${pathway.slug}/${category.slug}/${s.slug}`}
                    className="rounded-full border border-gold/30 bg-black/40 px-3 py-1.5 text-xs text-white/85 hover:border-gold hover:bg-gold/10 hover:text-gold"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-xs text-white/50">
                {subcategories.length} subcategor{subcategories.length === 1 ? "y" : "ies"} ·
                shown progressively — pick one to view nominees.
              </p>
            </section>
          )}

          {/* CATEGORY / SUBCATEGORY — region filter + nominee preview */}
          {category && (
            <section aria-label="Nominees in this recognition track" className="mt-2">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <Filter className="h-3.5 w-3.5" aria-hidden /> Region
                </span>
                <button
                  type="button"
                  onClick={() => setRegionFilter("all")}
                  className={`rounded-full px-3 py-1 text-xs ${
                    regionFilter === "all"
                      ? "bg-gold text-charcoal"
                      : "border border-white/15 text-white/75 hover:border-gold/60"
                  }`}
                >
                  All regions
                </button>
                {regionOptions.map((r) => (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => {
                      setRegionFilter(r.slug);
                      trackRegionView(r.slug, {
                        pathway: pathway.slug,
                        category: category.slug,
                        subcategory: subcategory?.slug,
                      });
                    }}
                    className={`rounded-full px-3 py-1 text-xs ${
                      regionFilter === r.slug
                        ? "bg-gold text-charcoal"
                        : "border border-white/15 text-white/75 hover:border-gold/60"
                    }`}
                  >
                    {r.shortName}
                  </button>
                ))}
              </div>

              {nominees.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {nominees.map((n) => (
                    <Link
                      key={n.id}
                      to={`/nominees/${n.categorySlug}/${n.slug}`}
                      className="group flex gap-3 rounded-xl border border-gold/15 bg-black/40 p-3 hover:border-gold/60"
                    >
                      <img
                        src={n.imageUrl || "/images/placeholder.png"}
                        alt=""
                        loading="lazy"
                        className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white group-hover:text-gold">
                          {n.name}
                        </p>
                        <p className="truncate text-xs text-white/60">{n.country}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-white/55">
                          {n.achievement}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gold/30 bg-black/40 p-8 text-center">
                  <p className="text-sm text-white/70">
                    No nominees yet in this recognition track
                    {regionFilter !== "all" ? ` for ${regionFilter}` : ""}.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <Link
                      to={`/nominate?category=${category.slug}${
                        subcategory ? `&subcategory=${subcategory.slug}` : ""
                      }`}
                      className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-charcoal hover:bg-gold/90"
                    >
                      Nominate someone
                    </Link>
                    <Link
                      to="/nominees"
                      className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/85 hover:border-gold"
                    >
                      Explore the directory
                    </Link>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Final CTA strip */}
          <section className="mt-12 rounded-2xl border border-gold/30 bg-gradient-to-br from-black/80 to-charcoal p-6 md:p-8">
            <h2 className="font-display text-xl text-white md:text-2xl">
              Know someone who belongs here?
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Recognition begins with one nomination. Every verified entry feeds
              Africa's Education Impact Directory.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/nominate?pathway=${pathway.slug}${
                  category ? `&category=${category.slug}` : ""
                }${subcategory ? `&subcategory=${subcategory.slug}` : ""}`}
                className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal hover:bg-gold/90"
              >
                Nominate now
              </Link>
              <Link
                to={pathway.href}
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/85 hover:border-gold"
              >
                View {pathway.name} page
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
