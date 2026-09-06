/**
 * LaneGalleryPage — live nominee gallery for one real award lane.
 * Route: /nominees/lane/:lane
 *
 * Reads only real rows from the public `public_nominees` view through the
 * existing `useCategoryNominees` data layer. No fabricated nominees, honest
 * empty states, stable image fallbacks.
 */
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Search, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { NomineeAvatar } from "@/components/nominees/NomineeAvatar";
import {
  useCategoryNominees,
  nomineeImage,
  type CategoryNomineeRow,
  type CategorySubcategoryRow,
} from "@/components/awards/branded/categoryNomineeData";
import { getNomineeLane } from "@/config/nomineeLanes";

const PAGE_SIZE = 24;
const SITE = "https://nesaafrica.lovable.app";

/**
 * Parse `<category>-<family>-<region>` subcategory slugs into the lane's
 * configured focus-area and region keys. Returns nulls when the slug does
 * not match any configured family/region — such rows stay visible under
 * "All" but are not miscounted.
 */
function parseSubSlug(
  sub: CategorySubcategoryRow,
  families: { key: string }[],
  regions: { key: string }[],
) {
  const family = families.find((f) => sub.slug.includes(`-${f.key}-`))?.key ?? null;
  const region = regions.find((r) => sub.slug.endsWith(`-${r.key}`))?.key ?? null;
  return { family, region };
}




export function LaneNomineeCard({
  nominee,
  laneSlug,
}: {
  nominee: CategoryNomineeRow;
  laneSlug: string;
}) {
  const img = nomineeImage(nominee);
  const to = nominee.slug ? `/nominees/lane/${laneSlug}/${nominee.slug}` : undefined;

  const body = (
    <div className="group h-full rounded-2xl border border-gold/15 bg-charcoal-light/50 overflow-hidden transition-colors hover:border-gold/40">
      <div className="aspect-[4/3] bg-charcoal overflow-hidden">
        <NomineeAvatar
          name={nominee.name}
          src={img}
          kind="organization"
          shape="square"
          interactive
          context={nominee.country ?? undefined}
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-sm font-bold text-ivory line-clamp-2">
          {nominee.name}
        </h3>
        {nominee.organization && nominee.organization !== nominee.name && (
          <p className="mt-1 text-xs text-ivory/60 line-clamp-1">{nominee.organization}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {nominee.country && (
            <span className="inline-flex items-center gap-1 text-[11px] text-ivory/60">
              <MapPin className="h-3 w-3 text-gold/70" /> {nominee.country}
            </span>
          )}
          {nominee.nrc_verified && (
            <Badge className="border-0 bg-gold/15 text-gold text-[10px]">
              <ShieldCheck className="mr-1 h-3 w-3" /> NRC verified
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

export default function LaneGalleryPage() {
  const { lane: laneSlug } = useParams<{ lane: string }>();
  const lane = getNomineeLane(laneSlug);

  const { data, isLoading, error } = useCategoryNominees(
    lane?.categorySlug ?? "",
    Boolean(lane),
  );

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [sub, setSub] = useState("all");
  const [family, setFamily] = useState("all");
  const [laneRegion, setLaneRegion] = useState("all");
  const [page, setPage] = useState(1);

  const families = lane?.subFamilies ?? [];
  const laneRegions = lane?.regionSuffixes ?? [];
  const grouped = families.length > 0;

  const subs = useMemo(() => {
    if (!data || !lane) return [];
    return lane.subcategorySlug
      ? data.subs.filter((s) => s.slug === lane.subcategorySlug)
      : data.subs;
  }, [data, lane]);

  /** subcategory id → { family, region } for the grouped lanes. */
  const subMeta = useMemo(() => {
    const map = new Map<string, { family: string | null; region: string | null }>();
    if (!grouped) return map;
    for (const s of subs) map.set(s.id, parseSubSlug(s, families, laneRegions));
    return map;
  }, [subs, families, laneRegions, grouped]);

  const scoped = useMemo(() => {
    if (!data) return [];
    const ids = new Set(subs.map((s) => s.id));
    return data.nominees.filter((n) => n.subcategory_id && ids.has(n.subcategory_id));
  }, [data, subs]);

  const countries = useMemo(
    () => Array.from(new Set(scoped.map((n) => n.country).filter(Boolean) as string[])).sort(),
    [scoped],
  );

  /** Live per-focus-area counts, so no empty tab is advertised as populated. */
  const familyCounts = useMemo(() => {
    const counts = new Map<string, number>();
    if (!grouped) return counts;
    for (const n of scoped) {
      const key = n.subcategory_id ? subMeta.get(n.subcategory_id)?.family : null;
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [scoped, subMeta, grouped]);

  const activeFamilies = useMemo(
    () => families.filter((f) => (familyCounts.get(f.key) ?? 0) > 0),
    [families, familyCounts],
  );

  const regionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    if (!grouped) return counts;
    for (const n of scoped) {
      const key = n.subcategory_id ? subMeta.get(n.subcategory_id)?.region : null;
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [scoped, subMeta, grouped]);

  const activeRegions = useMemo(
    () => laneRegions.filter((r) => (regionCounts.get(r.key) ?? 0) > 0),
    [laneRegions, regionCounts],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scoped.filter((n) => {
      if (country !== "all" && n.country !== country) return false;
      if (!grouped && sub !== "all" && n.subcategory_id !== sub) return false;
      if (grouped) {
        const meta = n.subcategory_id ? subMeta.get(n.subcategory_id) : undefined;
        if (family !== "all" && meta?.family !== family) return false;
        if (laneRegion !== "all" && meta?.region !== laneRegion) return false;
      }
      if (!q) return true;
      return (
        n.name.toLowerCase().includes(q) ||
        (n.organization ?? "").toLowerCase().includes(q) ||
        (n.country ?? "").toLowerCase().includes(q)
      );
    });
  }, [scoped, search, country, sub, family, laneRegion, grouped, subMeta]);

  if (!lane) return <Navigate to="/nominees" replace />;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const canonical = `${SITE}/nominees/lane/${lane.slug}`;

  return (
    <>
      <Helmet>
        <title>{`${lane.title} Nominees | NESA-Africa 2026`}</title>
        <meta name="description" content={lane.intro.slice(0, 155)} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${lane.title} Nominees | NESA-Africa 2026`} />
        <meta property="og:description" content={lane.intro.slice(0, 155)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
      </Helmet>

      <section className="min-h-screen bg-charcoal py-10 md:py-14">
        <div className="container">
          <NomineeBreadcrumbs
            items={[
              { label: "Nominees", href: "/nominees" },
              { label: lane.title },
            ]}
          />

          <header className="mb-8 rounded-3xl border border-gold/20 bg-charcoal-light/40 p-6 md:p-9">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80">{lane.tier}</p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory">
              {lane.title}
            </h1>
            {lane.officialName !== lane.title && (
              <p className="mt-1 text-sm text-ivory/50">Official category: {lane.officialName}</p>
            )}
            <p className="mt-3 max-w-3xl text-ivory/70">{lane.intro}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to={lane.nominateHref}>Nominate in this category</Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                <Link to={lane.laneHref}>About this lane</Link>
              </Button>
            </div>
            {!isLoading && !error && (
              <p className="mt-4 text-sm text-ivory/60">
                <Users className="mr-1.5 inline h-4 w-4 text-gold/70" />
                {scoped.length} nominee{scoped.length === 1 ? "" : "s"} on record
                {grouped && activeFamilies.length
                  ? ` across ${activeFamilies.length} focus area${activeFamilies.length === 1 ? "" : "s"}`
                  : subs.length > 1
                    ? ` across ${subs.length} subcategories`
                    : ""}
                {grouped && activeRegions.length
                  ? ` · ${activeRegions.length} regions`
                  : ""}
                {countries.length ? ` · ${countries.length} countries` : ""}
              </p>
            )}
          </header>

          {/* Focus-area tabs (grouped lanes only) */}
          {grouped && activeFamilies.length > 1 && (
            <Tabs
              value={family}
              onValueChange={(v) => {
                setFamily(v);
                setPage(1);
              }}
              className="mb-5"
            >
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1.5 bg-charcoal-light/40 p-1.5">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70"
                >
                  All focus areas ({scoped.length})
                </TabsTrigger>
                {activeFamilies.map((f) => (
                  <TabsTrigger
                    key={f.key}
                    value={f.key}
                    className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70"
                  >
                    {f.label} ({familyCounts.get(f.key)})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/40" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search nominees by name, organisation, or country"
                aria-label="Search nominees"
                className="pl-9 bg-charcoal-light/60 border-gold/20 text-ivory"
              />
            </div>
            {grouped && activeRegions.length > 1 && (
              <Select
                value={laneRegion}
                onValueChange={(v) => {
                  setLaneRegion(v);
                  setPage(1);
                }}
              >
                <SelectTrigger
                  className="md:w-56 bg-charcoal-light/60 border-gold/20 text-ivory"
                  aria-label="Filter by African region"
                >
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All regions</SelectItem>
                  {activeRegions.map((r) => (
                    <SelectItem key={r.key} value={r.key}>
                      {r.label} ({regionCounts.get(r.key)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!grouped && subs.length > 1 && (
              <Select
                value={sub}
                onValueChange={(v) => {
                  setSub(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="md:w-64 bg-charcoal-light/60 border-gold/20 text-ivory" aria-label="Filter by subcategory">
                  <SelectValue placeholder="All subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subcategories</SelectItem>
                  {subs.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {countries.length > 1 && (
              <Select
                value={country}
                onValueChange={(v) => {
                  setCountry(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="md:w-48 bg-charcoal-light/60 border-gold/20 text-ivory" aria-label="Filter by country">
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-gold/20 bg-charcoal-light/40 p-10 text-center">
              <p className="text-ivory/80">We couldn't load this gallery.</p>
              <p className="mt-2 text-sm text-ivory/50">{(error as Error).message}</p>
              <Button className="mt-5" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          ) : pageItems.length === 0 ? (
            <div className="rounded-2xl border border-gold/20 bg-charcoal-light/40 p-12 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-gold/30" />
              <p className="text-ivory/80">
                {scoped.length === 0
                  ? "No nominees have been published in this category yet."
                  : "No nominees match your filters."}
              </p>
              <p className="mt-2 text-sm text-ivory/50">
                {scoped.length === 0
                  ? "This lane is open for the 2026 season — be the first to put a name forward."
                  : "Clear the filters to see the full list."}
              </p>
              <Button asChild className="mt-5 bg-gold text-charcoal hover:bg-gold/90">
                <Link to={lane.nominateHref}>Nominate in this category</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((n) => (
                <LaneNomineeCard key={n.id} nominee={n} laneSlug={lane.slug} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                Previous
              </Button>
              <span className="px-3 text-sm text-ivory/70">
                Page <span className="font-semibold text-gold">{current}</span> of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={current === totalPages}
                onClick={() => setPage(current + 1)}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                Next
              </Button>
            </div>
          )}

          <div className="mt-12">
            <Link
              to="/nominees"
              className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold/80"
            >
              <ArrowLeft className="h-4 w-4" /> Back to the full nominee directory
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
