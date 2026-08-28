/**
 * CategoryPictureCatalogue — light-theme, category-slug-parameterised picture
 * catalogue that replaces CategoryNomineeDashboard inside
 * DetailedCategoryPageTemplate (S9).
 *
 * Photo-forward cards with initials-avatar fallback, subcategory filter tabs,
 * search, region grouping and live counts, plus the existing StageGate-guarded
 * inline nomination modal.
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StageGate } from "@/components/StageGate";
import { GoogleFormDisplay } from "@/components/nominate/GoogleFormDisplay";
import { NativeCategoryNominationForm } from "@/components/awards/NativeCategoryNominationForm";
import { resolveAwardForm } from "@/config/nomination/resolveAwardForm";
import { getCategoryDisplayName } from "@/config/categoryDisplayBrand";
import { NomineeImageOrInitials } from "./LightInitialsAvatar";
import {
  nomineeImage,
  useCategoryNominees,
  type CategoryNomineeRow,
} from "./categoryNomineeData";
import { cn } from "@/lib/utils";

interface Props {
  categorySlug: string;
  headingLevel?: "h1" | "h2";
  className?: string;
}

const UNPLACED = "Region not yet recorded";

export function CategoryPictureCatalogue({
  categorySlug,
  headingLevel = "h2",
  className,
}: Props) {
  const [activeSub, setActiveSub] = useState<string>("all");
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading } = useCategoryNominees(categorySlug);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const n of data?.nominees ?? []) {
      if (!n.subcategory_id) continue;
      map.set(n.subcategory_id, (map.get(n.subcategory_id) ?? 0) + 1);
    }
    return map;
  }, [data]);

  const filtered = useMemo(() => {
    const all = data?.nominees ?? [];
    const q = query.trim().toLowerCase();
    return all.filter((n) => {
      if (activeSub !== "all" && n.subcategory_id !== activeSub) return false;
      if (activeRegion !== "all" && (n.region ?? UNPLACED) !== activeRegion) return false;
      if (!q) return true;
      return `${n.name} ${n.organization ?? ""} ${n.country ?? ""}`.toLowerCase().includes(q);
    });
  }, [data, activeSub, activeRegion, query]);

  /** Regions that actually hold rows for the current subcategory selection. */
  const regionOptions = useMemo(() => {
    const base = (data?.nominees ?? []).filter(
      (n) => activeSub === "all" || n.subcategory_id === activeSub,
    );
    const map = new Map<string, number>();
    for (const n of base) {
      const key = n.region ?? UNPLACED;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [data, activeSub]);

  const grouped = useMemo(() => {
    const map = new Map<string, CategoryNomineeRow[]>();
    for (const n of filtered) {
      const key = n.region ?? UNPLACED;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(n);
    }
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  }, [filtered]);

  const brandName = getCategoryDisplayName(categorySlug, data?.category.name ?? "");
  const Heading = headingLevel;
  const awardForm = data ? resolveAwardForm(data.category.slug, data.category.name) : undefined;
  const googleFormReady =
    !!awardForm &&
    awardForm.status === "Active" &&
    Boolean(awardForm.formEmbedUrl) &&
    Boolean(awardForm.formPublicUrl);

  if (isLoading) {
    return (
      <section className={cn("bg-muted/30 py-12", className)}>
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="mb-6 h-10 w-2/3" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const total = data.nominees.length;
  const verified = data.nominees.filter((n) => n.nrc_verified).length;

  return (
    <section
      id="existing-nominees"
      aria-label="Category nominee catalogue"
      className={cn("bg-muted/30 border-y border-border py-12 md:py-16", className)}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-gold/50 bg-gold/10 text-gold text-[10px] uppercase tracking-[0.18em]"
            >
              Live Nominee Catalogue
            </Badge>
            <Heading className="font-serif text-2xl md:text-4xl font-bold leading-tight text-foreground">
              {brandName}
            </Heading>
            <p className="mt-2 max-w-3xl text-sm md:text-base text-muted-foreground">
              {total} nominee{total === 1 ? "" : "s"} across {data.subs.length}{" "}
              subcategor{data.subs.length === 1 ? "y" : "ies"} and {regionOptions.length}{" "}
              region{regionOptions.length === 1 ? "" : "s"} — {verified} NRC-verified so far.
              Counts update live from the public nominee register.
            </p>
          </div>
          <Button
            size="lg"
            className="shrink-0 rounded-full bg-gold font-semibold text-charcoal hover:bg-gold/90"
            onClick={() => setFormOpen(true)}
          >
            Nominate for this category
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter nominees by name, organisation or country…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            aria-label="Filter nominees by name, organisation or country"
          />
        </div>

        {/* Subcategory tabs */}
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter by subcategory">
          <FilterChip
            active={activeSub === "all"}
            onClick={() => {
              setActiveSub("all");
              setActiveRegion("all");
            }}
            label={`All (${total})`}
          />
          {data.subs.map((s) => (
            <FilterChip
              key={s.id}
              active={activeSub === s.id}
              onClick={() => {
                setActiveSub(s.id);
                setActiveRegion("all");
              }}
              label={`${s.name} (${counts.get(s.id) ?? 0})`}
            />
          ))}
        </div>

        {/* Region tabs — only regions with real rows for this selection */}
        {regionOptions.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter by region">
            <FilterChip
              active={activeRegion === "all"}
              onClick={() => setActiveRegion("all")}
              label="All regions"
            />
            {regionOptions.map(([region, count]) => (
              <FilterChip
                key={region}
                active={activeRegion === region}
                onClick={() => setActiveRegion(region)}
                label={`${region} (${count})`}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-12 text-center">
            <Users className="mx-auto mb-3 h-9 w-9 text-gold/70" />
            <p className="font-medium text-foreground">
              {query.trim()
                ? "No nominees match your search — try a different name, organisation or country."
                : "No nominees yet in this selection — be the first to nominate."}
            </p>
            <Button
              className="mt-5 rounded-full bg-gold text-charcoal hover:bg-gold/90"
              onClick={() => setFormOpen(true)}
            >
              Nominate now
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(([region, rows]) => (
              <div key={region}>
                <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-2">
                  <h3 className="font-serif text-lg md:text-xl text-foreground">{region}</h3>
                  <span className="text-xs text-muted-foreground">
                    {rows.length} nominee{rows.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {rows.map((n) => {
                    const img = nomineeImage(n);
                    const sub = data.subs.find((s) => s.id === n.subcategory_id);
                    const card = (
                      <div className="group h-full overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-gold/50">
                        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                          <NomineeImageOrInitials
                            src={img}
                            name={n.name}
                            label={sub?.name}
                            size="sm"
                          />
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-gold">
                            {n.name}
                          </p>
                          {n.organization && (
                            <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                              {n.organization}
                            </p>
                          )}
                          {sub && (
                            <p className="mt-2 line-clamp-1 text-[10px] uppercase tracking-[0.12em] text-gold">
                              {sub.name}
                            </p>
                          )}
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="line-clamp-1 text-[11px] text-muted-foreground">
                              {[n.country, n.region].filter(Boolean).join(" · ")}
                            </p>
                            {n.nrc_verified && (
                              <BadgeCheck
                                className="h-3.5 w-3.5 shrink-0 text-gold"
                                aria-label="NRC verified"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                    return n.slug ? (
                      <Link key={n.id} to={`/nominees/${n.slug}`} className="block h-full">
                        {card}
                      </Link>
                    ) : (
                      <div key={n.id}>{card}</div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl md:text-2xl text-foreground">
              Nominate — {data.category.name}
            </DialogTitle>
          </DialogHeader>
          <StageGate action="nominations">
            {googleFormReady && awardForm ? (
              <GoogleFormDisplay
                title={awardForm.name}
                status={awardForm.status}
                formPublicUrl={awardForm.formPublicUrl}
                formEmbedUrl={awardForm.formEmbedUrl}
                gmail={awardForm.gmail}
              />
            ) : awardForm ? (
              <NativeCategoryNominationForm form={awardForm} />
            ) : (
              <div className="rounded-xl border border-border bg-muted/40 p-5 text-foreground">
                <p className="mb-4 text-sm">
                  The dedicated nomination form for this category opens on the main
                  nomination page.
                </p>
                <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                  <Link to={`/nominate?category=${encodeURIComponent(data.category.slug)}`}>
                    Start nomination
                  </Link>
                </Button>
              </div>
            )}
          </StageGate>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
        active
          ? "border-gold bg-gold font-semibold text-charcoal"
          : "border-border bg-card text-muted-foreground hover:border-gold/50 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export default CategoryPictureCatalogue;
