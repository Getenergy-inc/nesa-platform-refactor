import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
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
import { SubcategoryTabs, type SubcategoryTab } from "@/components/nominees/SubcategoryTabs";
import { classifyRegion, getRegionMeta, isValidRegionSlug } from "@/lib/regionClassifier";

const PAGE_SIZE = 12;
const BASE_URL = "https://nesaafrica.lovable.app";

export default function RegionCategoryPage({ region: regionProp }: { region?: string } = {}) {
  const params = useParams<{ region?: string; categorySlug: string; subcategorySlug?: string }>();
  const region = regionProp ?? params.region;
  const { categorySlug, subcategorySlug } = params;
  const { data: nominees, isLoading } = useNominees();

  const [activeSub, setActiveSub] = useState(subcategorySlug ?? "");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState<NomineeSort>("votes");
  const [page, setPage] = useState(1);

  if (!region || !isValidRegionSlug(region)) return <Navigate to="/nominees" replace />;
  const meta = getRegionMeta(region)!;

  const data = useMemo(() => {
    if (!nominees || !categorySlug) return null;
    const inScope = nominees.filter(
      (n) =>
        n.categorySlug === categorySlug &&
        (n.status === "approved" || n.status === "platinum" || n.status === "pending") &&
        classifyRegion({ country: n.country, region: n.region, categoryName: n.categoryName }).region === region
    );
    if (inScope.length === 0) return null;
    const countries = Array.from(new Set(inScope.map((n) => n.country).filter(Boolean) as string[])).sort();
    const subMap = new Map<string, SubcategoryTab>();
    inScope.forEach((n) => {
      const e = subMap.get(n.subcategorySlug) ?? { slug: n.subcategorySlug, name: n.subcategoryName, count: 0 };
      e.count++;
      subMap.set(n.subcategorySlug, e);
    });
    const subs = Array.from(subMap.values()).sort((a, b) => b.count - a.count);
    return {
      name: inScope[0].categoryName,
      nominees: inScope,
      countries,
      subcategories: subs,
      tabs: [{ slug: "", name: "All", count: inScope.length }, ...subs] as SubcategoryTab[],
    };
  }, [nominees, categorySlug, region]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let r = [...data.nominees];
    if (activeSub) r = r.filter((n) => n.subcategorySlug === activeSub);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((n) => n.name.toLowerCase().includes(q) || n.subcategoryName.toLowerCase().includes(q) || (n.country || "").toLowerCase().includes(q));
    }
    if (country !== "all") r = r.filter((n) => n.country === country);
    if (sort === "votes") r.sort((a, b) => b.publicVotes - a.publicVotes);
    else r.sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [data, activeSub, search, country, sort]);

  if (isLoading) {
    return (
      <section className="bg-charcoal py-12 min-h-screen">
        <div className="container">
          <Skeleton className="h-64 rounded-3xl mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  if (!data) return <Navigate to={`/nominees/${region}`} replace />;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!search || country !== "all" || sort !== "votes";
  const canonical = `${BASE_URL}/nominees/${region}/${categorySlug}`;
  const activeSubName = activeSub && data.subcategories.find((s) => s.slug === activeSub)?.name;

  return (
    <>
      <Helmet>
        <title>{`${data.name} in ${meta.name} | NESA-Africa Nominees`}</title>
        <meta name="description" content={`${data.nominees.length} ${data.name} nominees from ${meta.name} across ${data.subcategories.length} subcategories. Vote and explore at NESA-Africa 2026.`} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${data.name} — ${meta.name} | NESA-Africa`} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${data.name} — ${meta.name}`,
          url: canonical,
          mainEntity: { "@type": "ItemList", numberOfItems: data.nominees.length },
        })}</script>
      </Helmet>

      <section className="bg-charcoal py-10 md:py-14 min-h-screen pb-20">
        <div className="container">
          <NomineeBreadcrumbs items={[
            { label: "Nominees", href: "/nominees" },
            { label: meta.name, href: `/nominees/${region}` },
            { label: data.name },
            ...(activeSubName ? [{ label: activeSubName as string }] : []),
          ]} />

          <CategoryHero
            eyebrow={`${meta.name} Award Category`}
            title={data.name}
            description={`${data.nominees.length} ${meta.name} nominees across ${data.subcategories.length} subcategories advancing Education for All.`}
            nomineeCount={data.nominees.length}
            countryCount={data.countries.length}
            subcategoryCount={data.subcategories.length}
          />

          <SubcategoryTabs tabs={data.tabs} activeSlug={activeSub} onChange={(s) => { setActiveSub(s); setPage(1); }} />

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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pageItems.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}>
                  <LandingNomineeCard nominee={n} />
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="border-gold/30 text-gold hover:bg-gold/10">Previous</Button>
              <span className="text-sm text-ivory/70 px-3">Page <span className="text-gold font-semibold">{page}</span> of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border-gold/30 text-gold hover:bg-gold/10">Next</Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
