import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, Check, Copy, Filter, Sparkles, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import {
  NIGERIA_ZONES,
  NIGERIA_POLITICAL_ROLES,
  NIGERIA_EDU_IMPACT_SUBCATEGORIES,
} from "@/config/nomination/nigeriaZones";

/**
 * Dedicated nominee directory for
 * "Excellence in Political Leadership for Education — Nigeria".
 *
 * Filters (client-side, no API/business-logic changes):
 *  - Geopolitical Zone (Nigeria's 6 zones)
 *  - State / FCT
 *  - Political Role  (matched against nominee.title)
 *  - Education Impact Subcategory (matched against nominee.subcategoryName)
 *  - Verification Status (verified | pending | rejected)
 *  - Publication Status (published | draft)
 *  - Free-text name/title search
 */

const CATEGORY_NAME =
  "Excellence in Political Leadership for Education — Nigeria";
const CATEGORY_SLUGS = new Set([
  "excellence-in-political-leadership-for-education-nigeria",
  "political-leaders-education-nigeria",
]);
const CATEGORY_NAME_KEYWORDS = ["political leader", "political leadership"];

const ALL_NIGERIA_STATES = NIGERIA_ZONES.flatMap((z) =>
  z.states.map((s) => ({ ...s, zoneSlug: z.slug, zoneName: z.name })),
);

type VerificationStatus = "all" | "verified" | "pending" | "rejected";
type PublicationStatus = "all" | "published" | "draft";

function inferVerification(n: EnrichedDatabaseNominee): Exclude<VerificationStatus, "all"> {
  const s = (n.status || "").toLowerCase();
  if (s === "approved" || s === "platinum" || s === "verified") return "verified";
  if (s === "rejected" || s === "declined") return "rejected";
  return "pending";
}

function inferPublication(n: EnrichedDatabaseNominee): Exclude<PublicationStatus, "all"> {
  const s = (n.status || "").toLowerCase();
  return s === "approved" || s === "platinum" ? "published" : "draft";
}

function matchesCategory(n: EnrichedDatabaseNominee): boolean {
  if (CATEGORY_SLUGS.has((n.categorySlug || "").toLowerCase())) return true;
  const name = (n.categoryName || "").toLowerCase();
  return CATEGORY_NAME_KEYWORDS.some((k) => name.includes(k));
}

function matchesState(
  n: EnrichedDatabaseNominee,
  stateName: string,
): boolean {
  const haystack = [n.region, n.country, n.title, n.bio, n.organization]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(stateName.toLowerCase());
}

export function PoliticalLeadersNigeriaDirectory({
  maxNominees = 12,
}: {
  maxNominees?: number;
}) {
  const { data: allNominees = [], isLoading } = useNominees();
  const [searchParams, setSearchParams] = useSearchParams();

  const zone = searchParams.get("zone") || "all";
  const stateSlug = searchParams.get("state") || "all";
  const role = searchParams.get("role") || "all";
  const impact = searchParams.get("impact") || "all";
  const verification = (searchParams.get("verification") as VerificationStatus) || "all";
  const publication = (searchParams.get("publication") as PublicationStatus) || "all";
  const search = searchParams.get("search") || "";

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params, { replace: true });
  };

  const categoryNominees = useMemo(
    () => allNominees.filter(matchesCategory),
    [allNominees],
  );

  const stateOptions = useMemo(() => {
    if (zone === "all") return ALL_NIGERIA_STATES;
    return ALL_NIGERIA_STATES.filter((s) => s.zoneSlug === zone);
  }, [zone]);

  const filtered = useMemo(() => {
    return categoryNominees.filter((n) => {
      // Zone / State
      if (stateSlug !== "all") {
        const st = ALL_NIGERIA_STATES.find((s) => s.slug === stateSlug);
        if (!st || !matchesState(n, st.name)) return false;
      } else if (zone !== "all") {
        const zStates = ALL_NIGERIA_STATES.filter((s) => s.zoneSlug === zone);
        if (!zStates.some((s) => matchesState(n, s.name))) return false;
      }

      // Role (against title)
      if (role !== "all") {
        const t = (n.title || "").toLowerCase();
        if (!t.includes(role.toLowerCase())) return false;
      }

      // Education impact subcategory
      if (impact !== "all") {
        const sc = (n.subcategoryName || "").toLowerCase();
        if (!sc.includes(impact.toLowerCase())) return false;
      }

      // Verification status
      if (verification !== "all" && inferVerification(n) !== verification) {
        return false;
      }

      // Publication status
      if (publication !== "all" && inferPublication(n) !== publication) {
        return false;
      }

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = [n.name, n.title, n.organization, n.subcategoryName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [categoryNominees, zone, stateSlug, role, impact, verification, publication, search]);

  const hasFilters =
    zone !== "all" ||
    stateSlug !== "all" ||
    role !== "all" ||
    impact !== "all" ||
    verification !== "all" ||
    publication !== "all" ||
    search.trim() !== "";

  const [copied, setCopied] = useState(false);

  const copyShareLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <section
      className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-charcoal via-black to-charcoal py-14 lg:py-20"
      aria-label="Political Leaders (Nigeria) nominee directory"
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/3 h-[32rem] w-[32rem] rounded-full bg-emerald-500/15 blur-3xl opacity-25" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-emerald-500/30 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300"
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              Nigeria · Zone & State Filtered
            </Badge>
            <h2 className="font-display text-2xl font-bold text-white md:text-4xl">
              Political Leaders' Education Impact Directory
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
              Filter nominees by Nigeria's 6 geopolitical zones, 36 states + FCT,
              political role, education impact area, verification and publication
              status.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="gap-2 rounded-full bg-emerald-500 px-6 font-semibold text-charcoal hover:bg-emerald-500/90"
          >
            <Link to={`/nominees?category=${encodeURIComponent(CATEGORY_NAME)}`}>
              <Users className="h-4 w-4" />
              View All Nominees
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Filter panel */}
        <div className="mb-8 rounded-2xl border border-emerald-500/15 bg-charcoal-light/40 p-3 md:p-4">
          <div className="mb-3 flex items-center justify-between gap-2 text-xs uppercase tracking-wider text-ivory/70">
            <span className="inline-flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-emerald-300" />
              Refine — Political Leadership (Nigeria)
            </span>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-300 hover:bg-emerald-500/10"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-6">
            <Select
              value={zone}
              onValueChange={(v) => {
                const params = new URLSearchParams(searchParams);
                if (!v || v === "all") params.delete("zone");
                else params.set("zone", v);
                params.delete("state");
                setSearchParams(params, { replace: true });
              }}
            >
              <SelectTrigger className="h-9 border-gold/20 bg-charcoal text-xs text-ivory">
                <SelectValue placeholder="Geopolitical Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All 6 Zones</SelectItem>
                {NIGERIA_ZONES.map((z) => (
                  <SelectItem key={z.slug} value={z.slug}>
                    {z.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stateSlug} onValueChange={(v) => setParam("state", v)}>
              <SelectTrigger className="h-9 border-gold/20 bg-charcoal text-xs text-ivory">
                <SelectValue placeholder="State / FCT" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All States / FCT</SelectItem>
                {stateOptions.map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={role} onValueChange={(v) => setParam("role", v)}>
              <SelectTrigger className="h-9 border-gold/20 bg-charcoal text-xs text-ivory">
                <SelectValue placeholder="Political Role" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All Roles</SelectItem>
                {NIGERIA_POLITICAL_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={impact} onValueChange={(v) => setParam("impact", v)}>
              <SelectTrigger className="h-9 border-gold/20 bg-charcoal text-xs text-ivory">
                <SelectValue placeholder="Education Impact" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All Impact Areas</SelectItem>
                {NIGERIA_EDU_IMPACT_SUBCATEGORIES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={verification}
              onValueChange={(v) => setParam("verification", v)}
            >
              <SelectTrigger className="h-9 border-gold/20 bg-charcoal text-xs text-ivory">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={publication}
              onValueChange={(v) => setParam("publication", v)}
            >
              <SelectTrigger className="h-9 border-gold/20 bg-charcoal text-xs text-ivory">
                <SelectValue placeholder="Publication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Publication</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft / Unpublished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-2">
            <Input
              value={search}
              onChange={(e) => setParam("search", e.target.value)}
              placeholder="Search by name, title, organization or impact area…"
              className="h-9 border-gold/20 bg-charcoal text-xs text-ivory placeholder:text-ivory/40"
            />
          </div>

          <p className="mt-2 text-[10px] text-ivory/50">
            {filtered.length} of {categoryNominees.length} nominees match these
            filters.
          </p>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-[3/4] rounded-2xl bg-white/[0.04]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-12 text-center">
            <Award className="mx-auto mb-3 h-10 w-10 text-emerald-300" />
            <p className="font-medium text-white/80">
              No nominees match these filters yet.
            </p>
            <p className="mt-1 text-sm text-white/50">
              Try a different zone, state or role — or clear filters to see all
              category nominees.
            </p>
            <Button
              asChild
              className="mt-5 rounded-full bg-emerald-500 text-charcoal hover:bg-emerald-500/90"
            >
              <Link to="/nominate?category=excellence-in-political-leadership-for-education-nigeria">
                Submit a Nomination
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.slice(0, maxNominees).map((n, idx) => (
              <motion.article
                key={n.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(idx * 0.04, 0.4),
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-white/[0.03] ring-1 ring-emerald-400/20 backdrop-blur transition-transform duration-300 hover:-translate-y-0.5",
                )}
              >
                <Link to={`/nominees/${n.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={n.photoUrl}
                      alt={n.name}
                      loading="lazy"
                      className={cn(
                        "h-full w-full transition-transform duration-500 group-hover:scale-105",
                        n.imageType === "logo"
                          ? "bg-white/[0.04] object-contain p-4"
                          : "object-cover",
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                    <Badge
                      className={cn(
                        "absolute right-2 top-2 text-[10px]",
                        inferVerification(n) === "verified"
                          ? "bg-emerald-400/90 text-charcoal"
                          : inferVerification(n) === "rejected"
                            ? "bg-rose-500/90 text-white"
                            : "bg-white/90 text-charcoal",
                      )}
                    >
                      {inferVerification(n)}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 font-display text-sm font-semibold text-white">
                      {n.name}
                    </h3>
                    {n.title && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-emerald-300">
                        {n.title}
                      </p>
                    )}
                    {(n.country || n.region) && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-white/60">
                        {[n.region, n.country].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {!isLoading && filtered.length > maxNominees && (
          <div className="mt-8 text-center">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-emerald-500/30 text-emerald-300 hover:bg-white/5"
            >
              <Link to={`/nominees?category=${encodeURIComponent(CATEGORY_NAME)}`}>
                See all {filtered.length} matching nominees
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default PoliticalLeadersNigeriaDirectory;
