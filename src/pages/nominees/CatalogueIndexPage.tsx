// ============================================================================
// Africa's Education Impact Directory — Recognition Catalogue
// Route: /nominees/catalogue
//
// Organises every historical nominee under the approved NESA-Africa 2026
// framework: Award Tier → Award Category → Award Subcategory → Nominees.
// Includes live counters, full-text search, nine filters, lazy-loaded cards
// and the Migration Review Queue.
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search, ChevronRight, ChevronDown, BadgeCheck, Share2, RotateCcw,
  Layers, X, AlertTriangle, MapPin, Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { buildCatalogue } from "@/lib/directory/buildCatalogue";
import { subcategoryFamilySlug } from "@/config/directory/catalogueTaxonomy";
import { toast } from "@/hooks/use-toast";

const PAGE_SIZE = 24;
const CANONICAL = "https://nesa.africa/nominees/catalogue";

type FilterKey =
  | "tier" | "category" | "subcategory" | "region"
  | "country" | "year" | "verification" | "organisation";

const EMPTY_FILTERS: Record<FilterKey, string> = {
  tier: "", category: "", subcategory: "", region: "",
  country: "", year: "", verification: "", organisation: "",
};

function verificationLabel(n: EnrichedDatabaseNominee) {
  if (n.nrcVerified) return "Verified";
  if (n.acceptanceStatus === "accepted") return "Accepted";
  if (n.status === "rejected") return "Rejected";
  if (n.status === "needs_review") return "Needs Review";
  return "Pending";
}

function Counter({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-gold/25 bg-charcoal-light/40 px-4 py-3">
      <p className="font-playfair text-2xl text-gold">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-foreground/60">{label}</p>
    </div>
  );
}

export default function CatalogueIndexPage() {
  const { data: nominees, isLoading } = useNominees();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    ...EMPTY_FILTERS,
    tier: params.get("tier") ?? "",
    category: params.get("category") ?? "",
    subcategory: params.get("subcategory") ?? "",
  });
  const [expanded, setExpanded] = useState<string[]>([]);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showReview, setShowReview] = useState(false);

  const catalogue = useMemo(() => buildCatalogue(nominees), [nominees]);

  // Tier lookup per nominee (used by the results list + filters).
  const decorated = useMemo(() => {
    const map = new Map<
      string,
      { tier: string; tierName: string; category: string; categoryName: string; sub: string; subName: string }
    >();
    for (const tier of catalogue.tiers) {
      for (const cat of tier.categories) {
        for (const sub of cat.subcategories) {
          for (const n of sub.nominees) {
            map.set(n.id, {
              tier: tier.slug, tierName: tier.name,
              category: cat.categorySlug, categoryName: cat.name,
              sub: sub.slug, subName: sub.name,
            });
          }
        }
      }
    }
    return map;
  }, [catalogue]);

  const setFilter = (key: FilterKey, value: string) => {
    setFilters((f) => ({ ...f, [key]: f[key] === value ? "" : value }));
    setVisible(PAGE_SIZE);
  };

  useEffect(() => {
    const next = new URLSearchParams();
    if (search) next.set("q", search);
    (["tier", "category", "subcategory"] as FilterKey[]).forEach((k) => {
      if (filters[k]) next.set(k, filters[k]);
    });
    setParams(next, { replace: true });
  }, [search, filters, setParams]);

  const options = useMemo(() => {
    const list = nominees ?? [];
    const uniq = (vals: (string | null)[]) =>
      Array.from(new Set(vals.filter(Boolean) as string[])).sort();
    return {
      regions: uniq(list.map((n) => n.region)),
      countries: uniq(list.map((n) => n.country)),
      years: uniq(list.map((n) => (n.nominationYear ? String(n.nominationYear) : null))).reverse(),
      verifications: ["Verified", "Accepted", "Pending", "Needs Review", "Rejected"],
    };
  }, [nominees]);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (nominees ?? []).filter((n) => {
      const meta = decorated.get(n.id);
      if (!meta) return false; // review-queue rows are listed separately
      if (filters.tier && meta.tier !== filters.tier) return false;
      if (filters.category && meta.category !== filters.category) return false;
      if (filters.subcategory && meta.sub !== filters.subcategory) return false;
      if (filters.region && n.region !== filters.region) return false;
      if (filters.country && n.country !== filters.country) return false;
      if (filters.year && String(n.nominationYear ?? "") !== filters.year) return false;
      if (filters.verification && verificationLabel(n) !== filters.verification) return false;
      if (filters.organisation && (n.organization ?? "") !== filters.organisation) return false;
      if (!q) return true;
      return [
        n.name, n.organization, n.country, n.region, n.title,
        meta.categoryName, meta.subName, meta.tierName,
        n.achievement,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [nominees, decorated, filters, search]);

  const activeFilters = (Object.keys(filters) as FilterKey[]).filter((k) => filters[k]);

  const share = async (n: EnrichedDatabaseNominee) => {
    const url = `${window.location.origin}/nominees/${n.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: n.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Profile link copied", description: url });
      }
    } catch {
      /* dismissed */
    }
  };

  return (
    <>
      <Helmet>
        <title>Recognition Catalogue · Africa's Education Impact Directory</title>
        <meta
          name="description"
          content="Browse every NESA-Africa nominee organised by award tier, category, subcategory, region, country, classification, nomination year and NRC verification status."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Recognition Catalogue · NESA-Africa 2026" />
        <meta
          property="og:description"
          content="Africa's Education Impact Directory — every education enabler, fully categorised across 4 recognition tiers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://nesa.africa/" },
              { "@type": "ListItem", position: 2, name: "Explore Existing Nominees", item: "https://nesa.africa/nominees" },
              { "@type": "ListItem", position: 3, name: "Recognition Catalogue", item: CANONICAL },
            ],
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-charcoal py-10">
        <div className="container max-w-7xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-foreground/60">
            <Link to="/" className="hover:text-gold">Home</Link>
            <ChevronRight className="mx-1 inline h-3 w-3" />
            <Link to="/nominees" className="hover:text-gold">Explore Existing Nominees</Link>
            <ChevronRight className="mx-1 inline h-3 w-3" />
            <span className="text-gold">Recognition Catalogue</span>
          </nav>

          <header className="mb-8">
            <Badge className="mb-3 border-gold/40 bg-gold/10 text-gold">
              <Layers className="mr-1 h-3 w-3" /> Africa's Education Impact Directory
            </Badge>
            <h1 className="font-playfair text-3xl text-gold md:text-4xl">
              Recognition Catalogue
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-foreground/70">
              Every historical nominee, organised under the NESA-Africa 2026 Recognition
              Framework: Award Tier → Award Category → Award Subcategory. Counters update
              automatically from the live record set.
            </p>
          </header>

          {/* Counters */}
          {isLoading ? (
            <Skeleton className="mb-8 h-24 rounded-xl" />
          ) : (
            <section aria-label="Catalogue counters" className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              <Counter label="Total Nominees" value={catalogue.counters.total} />
              <Counter label="Categorised" value={catalogue.counters.mapped} />
              <Counter label="Award Tiers" value={catalogue.tiers.length} />
              <Counter label="Categories" value={catalogue.counters.categories} />
              <Counter label="Subcategories" value={catalogue.counters.subcategories} />
              <Counter label="Review Queue" value={catalogue.counters.review} />
            </section>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE); }}
              placeholder="Search by name, organisation, country, region, category, subcategory, tier, year or profession"
              className="pl-9"
              aria-label="Search the recognition catalogue"
            />
          </div>

          {/* Filters */}
          <section aria-label="Filters" className="mb-6 space-y-3 rounded-2xl border border-gold/20 bg-charcoal-light/30 p-4">
            <div className="flex flex-wrap gap-2">
              {catalogue.tiers.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => setFilter("tier", t.slug)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    filters.tier === t.slug
                      ? "border-gold bg-gold text-charcoal"
                      : "border-gold/30 text-foreground/75 hover:border-gold/60"
                  }`}
                >
                  Tier {t.tierNumber} · {t.name} ({t.count})
                </button>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {([
                ["region", "All Regions", options.regions],
                ["country", "All Countries", options.countries],
                ["year", "All Years", options.years],
                ["verification", "All Verification States", options.verifications],
              ] as [FilterKey, string, string[]][]).map(([key, placeholder, values]) => (
                <select
                  key={key}
                  aria-label={placeholder}
                  value={filters[key]}
                  onChange={(e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setVisible(PAGE_SIZE); }}
                  className="rounded-lg border border-gold/25 bg-charcoal px-3 py-2 text-xs text-foreground/85"
                >
                  <option value="">{placeholder}</option>
                  {values.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              ))}
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activeFilters.map((k) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k, filters[k])}
                    className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] text-gold"
                  >
                    {k}: {filters[k]} <X className="h-3 w-3" />
                  </button>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[11px] text-foreground/60"
                  onClick={() => { setFilters({ ...EMPTY_FILTERS }); setVisible(PAGE_SIZE); }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* Hierarchy browser */}
            <aside aria-label="Catalogue hierarchy" className="space-y-3">
              {catalogue.tiers.map((tier) => (
                <div key={tier.slug} className="rounded-2xl border border-gold/20 bg-charcoal-light/30 p-3">
                  <div className="mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/45">
                      Tier {tier.tierNumber}
                    </p>
                    <h2 className="font-playfair text-base text-gold">
                      {tier.name} <span className="text-foreground/50 text-xs">({tier.count})</span>
                    </h2>
                    <p className="mt-1 text-[11px] leading-relaxed text-foreground/55">{tier.blurb}</p>
                  </div>
                  <ul className="space-y-1">
                    {tier.categories.map((cat) => {
                      const open = expanded.includes(cat.categorySlug);
                      return (
                        <li key={cat.categorySlug}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setExpanded((e) =>
                                  open ? e.filter((s) => s !== cat.categorySlug) : [...e, cat.categorySlug],
                                )
                              }
                              aria-expanded={open}
                              className="flex flex-1 items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-foreground/80 hover:bg-gold/10"
                            >
                              <span className="truncate">{cat.name}</span>
                              <span className="flex items-center gap-1 text-[11px] text-gold">
                                {cat.count}
                                {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                              </span>
                            </button>
                          </div>
                          {open && (
                            <ul className="ml-2 border-l border-gold/15 pl-2">
                              {cat.subcategories.map((sub) => (
                                <li key={sub.slug}>
                                  <button
                                    onClick={() => {
                                      setFilters((f) => ({
                                        ...f, tier: tier.slug, category: cat.categorySlug, subcategory: sub.slug,
                                      }));
                                      setVisible(PAGE_SIZE);
                                    }}
                                    className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left text-[11px] hover:bg-gold/10 ${
                                      filters.subcategory === sub.slug ? "text-gold" : "text-foreground/65"
                                    }`}
                                  >
                                    <span className="truncate">{sub.name}</span>
                                    <span>{sub.count}</span>
                                  </button>
                                </li>
                              ))}
                              <li className="px-2 py-1.5">
                                <div className="flex flex-wrap gap-2">
                                  <Link to={cat.href} className="text-[11px] text-gold hover:underline">
                                    Explore category
                                  </Link>
                                  <Link to={cat.nominateHref} className="text-[11px] text-gold/80 hover:underline">
                                    Nomination form
                                  </Link>
                                </div>
                              </li>
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {/* Migration review queue */}
              {catalogue.reviewQueue.length > 0 && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3">
                  <button
                    onClick={() => setShowReview((s) => !s)}
                    aria-expanded={showReview}
                    className="flex w-full items-center justify-between gap-2 text-left"
                  >
                    <span className="flex items-center gap-2 text-xs font-medium text-amber-300">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Migration Review Queue ({catalogue.reviewQueue.length})
                    </span>
                    {showReview ? <ChevronDown className="h-3 w-3 text-amber-300" /> : <ChevronRight className="h-3 w-3 text-amber-300" />}
                  </button>
                  <p className="mt-1 text-[11px] text-foreground/60">
                    Records held for manual mapping. Nothing is deleted, guessed or overwritten.
                  </p>
                  {showReview && (
                    <ul className="mt-2 max-h-72 space-y-1 overflow-auto">
                      {catalogue.reviewQueue.map((r) => (
                        <li key={r.id} className="rounded border border-amber-500/20 bg-charcoal/40 px-2 py-1.5 text-[11px]">
                          <Link to={`/nominees/${r.slug}`} className="text-gold hover:underline">{r.name}</Link>
                          <p className="text-foreground/55">{r.categoryName} · {r.reason}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </aside>

            {/* Results */}
            <section aria-label="Nominees">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-foreground/60">
                  {isLoading ? "Loading catalogue…" : `${results.length} nominee${results.length === 1 ? "" : "s"}`}
                </p>
              </div>

              {isLoading ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-56 rounded-xl" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="rounded-xl border border-gold/20 bg-charcoal-light/30 p-8 text-center text-sm text-foreground/60">
                  No nominees match these filters yet.
                </p>
              ) : (
                <>
                  <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {results.slice(0, visible).map((n) => {
                      const meta = decorated.get(n.id)!;
                      const status = verificationLabel(n);
                      return (
                        <li
                          key={n.id}
                          className="flex flex-col rounded-xl border border-gold/20 bg-charcoal-light/40 p-3 transition-colors hover:border-gold/50"
                        >
                          <div className="flex gap-3">
                            <img
                              src={n.photoUrl}
                              alt={n.name}
                              loading="lazy"
                              decoding="async"
                              className={`h-16 w-16 shrink-0 rounded-lg border border-gold/20 bg-charcoal ${
                                n.imageType === "logo" ? "object-contain p-1" : "object-cover"
                              }`}
                            />
                            <div className="min-w-0">
                              <Link to={`/nominees/${n.slug}`} className="block truncate font-medium text-foreground/95 hover:text-gold">
                                {n.name}
                              </Link>
                              {n.title && <p className="truncate text-[11px] text-foreground/60">{n.title}</p>}
                              {n.organization && (
                                <p className="flex items-center gap-1 truncate text-[11px] text-foreground/55">
                                  <Building2 className="h-3 w-3" /> {n.organization}
                                </p>
                              )}
                              <p className="flex items-center gap-1 truncate text-[11px] text-foreground/55">
                                <MapPin className="h-3 w-3" /> {n.country || "—"}
                                {n.region ? ` · ${n.region}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-1">
                            <Badge variant="outline" className="border-gold/40 text-[10px] text-gold">
                              {meta.tierName}
                            </Badge>
                            <Badge variant="outline" className="border-gold/20 text-[10px] text-foreground/70">
                              {meta.categoryName}
                            </Badge>
                            <Badge variant="outline" className="border-gold/20 text-[10px] text-foreground/70">
                              {meta.subName}
                            </Badge>
                            {n.recognitionClass && (
                              <Badge variant="outline" className="border-gold/20 text-[10px] text-foreground/70">
                                {n.recognitionClass}
                              </Badge>
                            )}
                            {n.nominationYear && (
                              <Badge variant="outline" className="border-gold/20 text-[10px] text-foreground/70">
                                {n.nominationYear}
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                status === "Verified"
                                  ? "border-emerald-500/40 text-emerald-300"
                                  : "border-foreground/25 text-foreground/60"
                              }`}
                            >
                              <BadgeCheck className="mr-1 h-3 w-3" /> NRC {status}
                            </Badge>
                          </div>

                          {n.achievement && (
                            <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-foreground/60">
                              {n.achievement}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2 pt-1">
                            <Button asChild size="sm" className="h-7 bg-gold text-[11px] text-charcoal hover:bg-gold/90">
                              <Link to={`/nominees/${n.slug}`}>View Profile</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline" className="h-7 border-gold/40 text-[11px] text-gold">
                              <Link to={`/nominate?renominate=${encodeURIComponent(n.slug)}&category=${encodeURIComponent(meta.category)}`}>
                                <RotateCcw className="mr-1 h-3 w-3" /> Recommend Again
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-[11px] text-foreground/70"
                              onClick={() => share(n)}
                            >
                              <Share2 className="mr-1 h-3 w-3" /> Share
                            </Button>
                            <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] text-foreground/70">
                              <Link to={`/nominees/category/${meta.category}`}>Explore Category</Link>
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {visible < results.length && (
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        className="border-gold/40 text-gold"
                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      >
                        Load more ({results.length - visible} remaining)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

/** Exported for tests — collapses a database subcategory slug to its family. */
export { subcategoryFamilySlug };
