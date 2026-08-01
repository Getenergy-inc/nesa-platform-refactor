import { useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNominees } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { CategoryHero } from "@/components/nominees/CategoryHero";
import { NomineeFilterBar, type NomineeSort } from "@/components/nominees/NomineeFilterBar";
import { FeaturedNomineeSpotlight } from "@/components/nominees/FeaturedNomineeSpotlight";
import { SubcategoryTabs, type SubcategoryTab } from "@/components/nominees/SubcategoryTabs";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";

const PAGE_SIZE = 12;

export default function CategoryLandingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: nominees, isLoading } = useNominees();

  const [activeSub, setActiveSub] = useState<string>("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState<NomineeSort>("votes");
  const [page, setPage] = useState(1);

  const categoryData = useMemo(() => {
    if (!nominees || !categorySlug) return null;
    const inCat = nominees.filter(
      (n) =>
        n.categorySlug === categorySlug &&
        (n.status === "approved" || n.status === "platinum" || n.status === "pending")
    );
    if (inCat.length === 0) return null;

    const countries = Array.from(new Set(inCat.map((n) => n.country).filter(Boolean) as string[])).sort();
    const subcatMap = new Map<string, SubcategoryTab>();
    inCat.forEach((n) => {
      const e = subcatMap.get(n.subcategorySlug) ?? { slug: n.subcategorySlug, name: n.subcategoryName, count: 0 };
      e.count++;
      subcatMap.set(n.subcategorySlug, e);
    });

    const subcategories = Array.from(subcatMap.values()).sort((a, b) => b.count - a.count);

    return {
      name: inCat[0].categoryName,
      nominees: inCat,
      countries,
      subcategories,
      tabs: [{ slug: "", name: "All", count: inCat.length }, ...subcategories] as SubcategoryTab[],
    };
  }, [nominees, categorySlug]);

  const resetPagination = () => setPage(1);

  const filtered = useMemo(() => {
    if (!categoryData) return [];
    let r = [...categoryData.nominees];
    if (activeSub) r = r.filter((n) => n.subcategorySlug === activeSub);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.subcategoryName.toLowerCase().includes(q) ||
          (n.country || "").toLowerCase().includes(q)
      );
    }
    if (country !== "all") r = r.filter((n) => n.country === country);

    if (sort === "votes") r.sort((a, b) => b.publicVotes - a.publicVotes);
    else if (sort === "name") r.sort((a, b) => a.name.localeCompare(b.name));
    else r.sort((a, b) => a.name.localeCompare(b.name));

    return r;
  }, [categoryData, activeSub, search, country, sort]);

  if (isLoading) {
    return (
      <section className="bg-charcoal py-12 min-h-screen">
        <div className="container">
          <Skeleton className="h-64 rounded-3xl mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categoryData) {
    return <Navigate to="/nominees" replace />;
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!search || country !== "all" || sort !== "votes";

  const canonical = `https://nesaafrica.lovable.app/nominees/category/${categorySlug}`;
  const activeSubName =
    activeSub && categoryData.subcategories.find((s) => s.slug === activeSub)?.name;

  return (
    <>
      <Helmet>
        <title>{`${categoryData.name} Nominees — NESA-Africa 2026`}</title>
        <meta
          name="description"
          content={`Explore ${categoryData.nominees.length} nominees in the ${categoryData.name} category at NESA-Africa 2026. Vote, share, and celebrate education changemakers.`}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${categoryData.name} — NESA-Africa Nominees`} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${categoryData.name} Nominees`,
            url: canonical,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: categoryData.nominees.length,
            },
          })}
        </script>
      </Helmet>

      <section className="bg-charcoal py-10 md:py-14 min-h-screen">
        <div className="container">
          <NomineeBreadcrumbs
            items={[
              { label: "Nominees", href: "/nominees" },
              { label: "Recognition Catalogue", href: "/nominees/catalogue" },
              ...(tierMapping
                ? [{ label: tierMapping.tierName, href: `/nominees/catalogue?tier=${tierMapping.tierSlug}` }]
                : []),
              { label: categoryData.name },
              ...(activeSubName ? [{ label: activeSubName }] : []),
            ]}
          />

          <CategoryHero
            title={categoryData.name}
            description={`${categoryData.nominees.length} nominees across ${categoryData.subcategories.length} subcategories advancing Education for All.`}
            nomineeCount={categoryData.nominees.length}
            countryCount={categoryData.countries.length}
            subcategoryCount={categoryData.subcategories.length}
          />

          {tierMapping && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-gold/25 bg-charcoal-light/40 px-4 py-3">
              <span className="text-xs text-foreground/70">
                Tier {tierMapping.tierNumber} · {tierMapping.tierName} · {tierMapping.scope}
              </span>
              <Button asChild size="sm" className="h-8 bg-gold text-xs text-charcoal hover:bg-gold/90">
                <Link to={tierMapping.nominateHref}>Open nomination form</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="h-8 border-gold/40 text-xs text-gold">
                <Link to={`/nominees/catalogue?category=${tierMapping.categorySlug}`}>View in catalogue</Link>
              </Button>
            </div>
          )}

          {/* Horizontal Netflix-style subcategory tabs */}
          <SubcategoryTabs
            tabs={categoryData.tabs}
            activeSlug={activeSub}
            onChange={(slug) => {
              setActiveSub(slug);
              resetPagination();
            }}
          />

          {/* Featured spotlight (top 3 by votes within current filter scope) */}
          {!activeSub && (
            <FeaturedNomineeSpotlight
              nominees={[...categoryData.nominees].sort((a, b) => b.publicVotes - a.publicVotes)}
            />
          )}

          {/* Filters */}
          <NomineeFilterBar
            search={search}
            onSearchChange={(v) => { setSearch(v); resetPagination(); }}
            country={country}
            onCountryChange={(v) => { setCountry(v); resetPagination(); }}
            countries={categoryData.countries}
            sort={sort}
            onSortChange={(v) => { setSort(v); resetPagination(); }}
            onClear={() => { setSearch(""); setCountry("all"); setSort("votes"); resetPagination(); }}
            hasFilters={hasFilters}
            totalCount={filtered.length}
          />

          {/* Grid */}
          {pageItems.length === 0 ? (
            <div className="text-center py-16 text-ivory/60">
              <Users className="w-12 h-12 mx-auto text-gold/30 mb-3" />
              No nominees match your filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pageItems.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                >
                  <LandingNomineeCard nominee={n} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                Previous
              </Button>
              <span className="text-sm text-ivory/70 px-3">
                Page <span className="text-gold font-semibold">{page}</span> of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                Next
              </Button>
            </div>
          )}

          {/* Cross-surface CTA — drive discovery back to the global directory */}
          <div className="mt-12">
            <ExploreNomineesCTA
              filterQuery={`?category=${categorySlug}`}
              title="Explore All Nominees Across Africa"
              description="Compare changemakers in this category against the full Africa Education Impact Directory — 1,760+ nominees across 54 countries and 8 regions."
            />
          </div>
        </div>
      </section>
    </>
  );
}
