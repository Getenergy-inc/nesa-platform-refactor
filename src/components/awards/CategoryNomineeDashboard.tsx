/**
 * CategoryNomineeDashboard — ONE reusable, category-slug-parameterised nominee
 * dashboard used across every real award category page.
 *
 * - Reads live data from the public `public_nominees` view joined to the real
 *   `subcategories` / `categories` rows (existing public RLS, no new policies).
 * - Shows every real subcategory as a filter tab, including empty ones.
 * - Live per-subcategory counters queried at render time (no cache).
 * - "Nominate for this category" opens the existing nomination form inline in a
 *   modal, pre-scoped to the category (subcategory picked inside the form),
 *   behind the existing nominations StageGate.
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Sparkles, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import { InitialsAvatar } from "@/components/influencer-impact/InitialsAvatar";
import { NomineeMediaImage } from "@/components/nominees/NomineeMediaImage";
import { useNomineeMediaResolver } from "@/hooks/useNomineeMediaSourcing";

import { resolveAwardForm } from "@/config/nomination/resolveAwardForm";
import { getCategoryDisplayName } from "@/config/categoryDisplayBrand";
import { cn } from "@/lib/utils";

interface SubcategoryRow {
  id: string;
  name: string;
  slug: string;
}

interface NomineeRow {
  id: string;
  name: string;
  slug: string | null;
  organization: string | null;
  country: string | null;
  region: string | null;
  photo_url: string | null;
  logo_url: string | null;
  subcategory_id: string | null;
}

interface Props {
  /** Real `categories.slug` value as stored in the database. */
  categorySlug: string;
  /** Render the branded name as an <h1> (page header) or <h2> (section). */
  headingLevel?: "h1" | "h2";
  className?: string;
}

export function CategoryNomineeDashboard({
  categorySlug,
  headingLevel = "h2",
  className,
}: Props) {
  const [activeSub, setActiveSub] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const { resolve } = useNomineeMediaResolver();


  const { data, isLoading } = useQuery({
    queryKey: ["category-nominee-dashboard", categorySlug],
    // Live counters: always re-query on mount, never serve stale numbers.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      const { data: category, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, subcategories ( id, name, slug )")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (error) throw error;
      if (!category) return null;

      const subs = ((category.subcategories ?? []) as SubcategoryRow[])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

      let nominees: NomineeRow[] = [];
      if (subs.length) {
        const { data: rows, error: nErr } = await supabase
          .from("public_nominees")
          .select(
            "id, name, slug, organization, country, region, photo_url, logo_url, subcategory_id",
          )
          .in(
            "subcategory_id",
            subs.map((s) => s.id),
          )
          .order("name", { ascending: true })
          .limit(2000);
        if (nErr) throw nErr;
        nominees = (rows ?? []) as NomineeRow[];
      }

      return {
        category: {
          id: category.id as string,
          name: category.name as string,
          slug: category.slug as string,
        },
        subs,
        nominees,
      };
    },
  });

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const n of data?.nominees ?? []) {
      if (!n.subcategory_id) continue;
      map.set(n.subcategory_id, (map.get(n.subcategory_id) ?? 0) + 1);
    }
    return map;
  }, [data]);

  const visible = useMemo(() => {
    const all = data?.nominees ?? [];
    const bySub = activeSub === "all" ? all : all.filter((n) => n.subcategory_id === activeSub);
    const q = query.trim().toLowerCase();
    if (!q) return bySub;
    return bySub.filter((n) => {
      const hay = `${n.name} ${n.organization ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data, activeSub, query]);

  const brandName = getCategoryDisplayName(categorySlug, data?.category.name ?? "");
  const Heading = headingLevel;
  const awardForm = data
    ? resolveAwardForm(data.category.slug, data.category.name)
    : undefined;
  const googleFormReady =
    !!awardForm &&
    awardForm.status === "Active" &&
    Boolean(awardForm.formEmbedUrl) &&
    Boolean(awardForm.formPublicUrl);

  if (isLoading) {
    return (
      <section className={cn("bg-charcoal py-12", className)}>
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-2/3 mb-6 bg-white/5" />
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl bg-white/5" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const total = data.nominees.length;

  return (
    <section
      id="existing-nominees"
      className={cn("bg-charcoal py-12 md:py-16 border-y border-gold/15", className)}
      aria-label="Category nominee dashboard"
    >
      <div className="container mx-auto px-4">
        {/* Branded header (display-layer only) */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-gold/40 bg-gold/5 text-gold text-[10px] uppercase tracking-[0.18em]"
            >
              <Sparkles className="mr-1.5 h-3 w-3" /> Live Nominee Dashboard
            </Badge>
            <Heading className="font-playfair text-2xl md:text-4xl font-bold text-white leading-tight">
              {brandName}
            </Heading>
            <p className="mt-2 text-sm md:text-base text-white/65 max-w-3xl">
              {total} nominee{total === 1 ? "" : "s"} across {data.subs.length}{" "}
              subcategor{data.subs.length === 1 ? "y" : "ies"} — counts update live from the
              verified nominee register.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gold text-charcoal hover:bg-gold/90 rounded-full font-semibold shrink-0"
            onClick={() => setFormOpen(true)}
          >
            Nominate for this category
          </Button>
        </div>

        {/* Counters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold">
            Total · {total}
          </span>
          {data.subs.map((s) => (
            <span
              key={`stat-${s.id}`}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70"
            >
              {s.name} · {counts.get(s.id) ?? 0}
            </span>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/70" />
          <Input
            type="search"
            placeholder="Filter nominees by name or organization…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-charcoal border-gold/20 text-white placeholder:text-white/40 focus:border-gold"
            aria-label="Filter nominees by name or organization"
          />
        </div>

        {/* Subcategory filter tabs — every real subcategory, including empty ones */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter by subcategory">
          <button
            type="button"
            role="tab"
            aria-selected={activeSub === "all"}
            onClick={() => setActiveSub("all")}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              activeSub === "all"
                ? "border-gold bg-gold text-charcoal font-semibold"
                : "border-gold/25 bg-white/[0.03] text-white/75 hover:bg-white/[0.08]",
            )}
          >
            All ({total})
          </button>
          {data.subs.map((s) => {
            const c = counts.get(s.id) ?? 0;
            const active = activeSub === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveSub(s.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                  active
                    ? "border-gold bg-gold text-charcoal font-semibold"
                    : "border-gold/25 bg-white/[0.03] text-white/75 hover:bg-white/[0.08]",
                )}
              >
                {s.name} ({c})
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-white/[0.02] py-12 text-center">
            <Users className="mx-auto mb-3 h-9 w-9 text-gold/60" />
            <p className="text-white/85 font-medium">
              {query.trim()
                ? "No nominees match your search — try a different name or organization."
                : "No nominees yet in this subcategory — be the first to nominate"}
            </p>
            <Button
              className="mt-5 rounded-full bg-gold text-charcoal hover:bg-gold/90"
              onClick={() => setFormOpen(true)}
            >
              Nominate now
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((n) => {
              const sub = data.subs.find((s) => s.id === n.subcategory_id);
              const media = resolve({
                id: n.id,
                slug: n.slug,
                name: n.name,
                organization: n.organization,
                photo_url: n.photo_url,
                logo_url: n.logo_url,
              });
              const card = (
                <div className="group h-full overflow-hidden rounded-2xl border border-gold/15 bg-gradient-to-b from-charcoal-light to-charcoal transition-colors hover:border-gold/45">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/40">
                    <NomineeMediaImage
                      media={media}
                      name={n.name}
                      label={sub?.name}
                      size="sm"
                      fallback={<InitialsAvatar name={n.name} label={sub?.name} size="sm" />}
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                      {n.name}
                    </p>
                    {n.organization && (
                      <p className="mt-1 text-[11px] text-white/60 line-clamp-1">
                        {n.organization}
                      </p>
                    )}
                    {sub && (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-gold/80 line-clamp-1">
                        {sub.name}
                      </p>
                    )}
                    {(n.country || n.region) && (
                      <p className="mt-1 text-[11px] text-white/50 line-clamp-1">
                        {[n.country, n.region].filter(Boolean).join(" · ")}
                      </p>
                    )}
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
        )}
      </div>

      {/* Inline nomination modal — existing wizard/form, pre-scoped to category */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-charcoal border-gold/30">
          <DialogHeader>
            <DialogTitle className="font-playfair text-gold text-xl md:text-2xl">
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
              <div className="rounded-xl border border-gold/25 bg-white/[0.03] p-5 text-white/80">
                <p className="text-sm mb-4">
                  The dedicated nomination form for this category opens on the main
                  nomination page.
                </p>
                <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                  <Link to={`/nominate?category=${encodeURIComponent(data.category.slug)}`}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin hidden" />
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

export default CategoryNomineeDashboard;
