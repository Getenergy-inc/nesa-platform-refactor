import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Users, ChevronRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNominees } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { CategoryHero } from "@/components/nominees/CategoryHero";
import { NomineeFilterBar, type NomineeSort } from "@/components/nominees/NomineeFilterBar";

const PAGE_SIZE = 12;

export default function SubcategoryPage() {
  const { categorySlug, subSlug } = useParams<{ categorySlug: string; subSlug: string }>();
  const { data: nominees, isLoading } = useNominees();

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState<NomineeSort>("votes");
  const [page, setPage] = useState(1);

  const data = useMemo(() => {
    if (!nominees || !categorySlug || !subSlug) return null;
    const inSub = nominees.filter(
      (n) =>
        n.categorySlug === categorySlug &&
        n.subcategorySlug === subSlug &&
        (n.status === "approved" || n.status === "platinum" || n.status === "pending")
    );
    if (inSub.length === 0) return null;

    const sibling = nominees.filter((n) => n.categorySlug === categorySlug);
    const siblingMap = new Map<string, { slug: string; name: string; count: number }>();
    sibling.forEach((n) => {
      const e = siblingMap.get(n.subcategorySlug) ?? { slug: n.subcategorySlug, name: n.subcategoryName, count: 0 };
      e.count++;
      siblingMap.set(n.subcategorySlug, e);
    });

    return {
      categoryName: inSub[0].categoryName,
      subcategoryName: inSub[0].subcategoryName,
      nominees: inSub,
      countries: Array.from(new Set(inSub.map((n) => n.country).filter(Boolean) as string[])).sort(),
      siblings: Array.from(siblingMap.values()).filter((s) => s.slug !== subSlug),
    };
  }, [nominees, categorySlug, subSlug]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let r = [...data.nominees];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (n) => n.name.toLowerCase().includes(q) || (n.country || "").toLowerCase().includes(q)
      );
    }
    if (country !== "all") r = r.filter((n) => n.country === country);

    if (sort === "votes") r.sort((a, b) => b.publicVotes - a.publicVotes);
    else r.sort((a, b) => a.name.localeCompare(b.name));

    return r;
  }, [data, search, country, sort]);

  if (isLoading) {
    return (
      <section className="bg-charcoal py-12 min-h-screen">
        <div className="container">
          <Skeleton className="h-48 rounded-3xl mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data) return <Navigate to={`/nominees/category/${categorySlug}`} replace />;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!search || country !== "all" || sort !== "votes";
  const canonical = `https://nesaafrica.lovable.app/nominees/category/${categorySlug}/${subSlug}`;

  return (
    <>
      <Helmet>
        <title>{`${data.subcategoryName} — ${data.categoryName} | NESA-Africa`}</title>
        <meta
          name="description"
          content={`${data.nominees.length} nominees in ${data.subcategoryName}, part of ${data.categoryName} at NESA-Africa 2026.`}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${data.subcategoryName} — NESA-Africa`} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: data.subcategoryName,
            numberOfItems: data.nominees.length,
            url: canonical,
          })}
        </script>
      </Helmet>

      <section className="bg-charcoal py-10 md:py-14 min-h-screen">
        <div className="container">
          <NomineeBreadcrumbs
            items={[
              { label: "Nominees", href: "/nominees" },
              { label: data.categoryName, href: `/nominees/category/${categorySlug}` },
              { label: data.subcategoryName },
            ]}
          />

          <CategoryHero
            eyebrow="Subcategory"
            title={data.subcategoryName}
            description={`Part of ${data.categoryName}. ${data.nominees.length} nominees representing ${data.countries.length} countries.`}
            nomineeCount={data.nominees.length}
            countryCount={data.countries.length}
          />

          <div className="grid lg:grid-cols-[1fr,260px] gap-8">
            <div>
              <NomineeFilterBar
                search={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                country={country}
                onCountryChange={(v) => { setCountry(v); setPage(1); }}
                countries={data.countries}
                sort={sort}
                onSortChange={(v) => { setSort(v); setPage(1); }}
                onClear={() => { setSearch(""); setCountry("all"); setSort("votes"); setPage(1); }}
                hasFilters={hasFilters}
                totalCount={filtered.length}
              />

              {pageItems.length === 0 ? (
                <div className="text-center py-16 text-ivory/60">
                  <Users className="w-12 h-12 mx-auto text-gold/30 mb-3" />
                  No nominees match your filters.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="border-gold/30 text-gold hover:bg-gold/10">
                    Previous
                  </Button>
                  <span className="text-sm text-ivory/70 px-3">
                    Page <span className="text-gold font-semibold">{page}</span> of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border-gold/30 text-gold hover:bg-gold/10">
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar: other subcategories */}
            <aside className="space-y-4">
              <Link
                to={`/nominees/category/${categorySlug}`}
                className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold/80"
              >
                <ArrowLeft className="w-3 h-3" /> Back to {data.categoryName}
              </Link>

              {data.siblings.length > 0 && (
                <div className="rounded-2xl border border-gold/15 bg-charcoal-light/60 p-4">
                  <h3 className="font-display text-sm font-bold text-ivory mb-3">
                    Other Subcategories
                  </h3>
                  <ul className="space-y-1">
                    {data.siblings.map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/nominees/category/${categorySlug}/${s.slug}`}
                          className="flex items-center justify-between gap-2 text-xs text-ivory/70 hover:text-gold px-2 py-2 rounded-lg hover:bg-gold/5 transition-colors"
                        >
                          <span className="line-clamp-2">{s.name}</span>
                          <Badge className="bg-gold/10 text-gold border-0 text-[10px] shrink-0">
                            {s.count}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
