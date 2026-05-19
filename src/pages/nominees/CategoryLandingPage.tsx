import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Trophy, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { CategoryHero } from "@/components/nominees/CategoryHero";
import { NomineeFilterBar, type NomineeSort } from "@/components/nominees/NomineeFilterBar";
import { FeaturedNomineeSpotlight } from "@/components/nominees/FeaturedNomineeSpotlight";

const PAGE_SIZE = 12;

export default function CategoryLandingPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: nominees, isLoading } = useNominees();

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
    const subcatMap = new Map<string, { slug: string; name: string; count: number }>();
    inCat.forEach((n) => {
      const e = subcatMap.get(n.subcategorySlug) ?? { slug: n.subcategorySlug, name: n.subcategoryName, count: 0 };
      e.count++;
      subcatMap.set(n.subcategorySlug, e);
    });

    return {
      name: inCat[0].categoryName,
      nominees: inCat,
      countries,
      subcategories: Array.from(subcatMap.values()).sort((a, b) => b.count - a.count),
    };
  }, [nominees, categorySlug]);

  const filtered = useMemo(() => {
    if (!categoryData) return [];
    let r = [...categoryData.nominees];
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
    // "newest" — no created_at available, fall back to votes-then-name
    else r.sort((a, b) => a.name.localeCompare(b.name));

    return r;
  }, [categoryData, search, country, sort]);

  if (isLoading) {
    return (
      <section className="bg-charcoal py-12 min-h-screen">
        <div className="container">
          <Skeleton className="h-64 rounded-3xl mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
            items={[{ label: "Nominees", href: "/nominees" }, { label: categoryData.name }]}
          />

          <CategoryHero
            title={categoryData.name}
            description={`${categoryData.nominees.length} nominees across ${categoryData.subcategories.length} subcategories advancing Education for All.`}
            nomineeCount={categoryData.nominees.length}
            countryCount={categoryData.countries.length}
            subcategoryCount={categoryData.subcategories.length}
          />

          <FeaturedNomineeSpotlight
            nominees={[...categoryData.nominees].sort((a, b) => b.publicVotes - a.publicVotes)}
          />

          {/* Subcategory chips */}
          {categoryData.subcategories.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display text-lg md:text-xl font-bold text-ivory mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold" /> Subcategories
              </h2>
              <div className="flex flex-wrap gap-2">
                {categoryData.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/nominees/category/${categorySlug}/${sub.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-gold/20 hover:border-gold/50 bg-charcoal-light hover:bg-gold/5 px-4 py-2 text-sm text-ivory/80 hover:text-gold transition-all"
                  >
                    <span className="line-clamp-1 max-w-[280px]">{sub.name}</span>
                    <Badge className="bg-gold/15 text-gold border-0 text-[10px] px-1.5">
                      {sub.count}
                    </Badge>
                    <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Filters */}
          <NomineeFilterBar
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            country={country}
            onCountryChange={(v) => { setCountry(v); setPage(1); }}
            countries={categoryData.countries}
            sort={sort}
            onSortChange={(v) => { setSort(v); setPage(1); }}
            onClear={() => { setSearch(""); setCountry("all"); setSort("votes"); setPage(1); }}
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        </div>
      </section>
    </>
  );
}
