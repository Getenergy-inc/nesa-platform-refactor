import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  /** Optional category slug filter (matches categories.slug via subcategory join). */
  categorySlug?: string;
  /** Max nominees to render in the grid (default 12). */
  limit?: number;
  /** Heading shown above the grid. */
  title?: string;
  /** Optional subtitle. */
  subtitle?: string;
  /** className overrides for the wrapping <section>. */
  className?: string;
}

interface Row {
  id: string;
  name: string;
  slug: string;
  organization: string | null;
  country: string | null;
  photo_url: string | null;
  logo_url: string | null;
  category_slug: string | null;
}

/**
 * Inline "existing nominees" display — replaces CTA-only "Explore Existing
 * Nominees" buttons across the app with an actual grid of approved nominees.
 * Falls back gracefully to a "See all" link when no data is available.
 */
export function ExistingNomineesInline({
  categorySlug,
  limit = 12,
  title = "Existing Nominees",
  subtitle,
  className = "",
}: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select(
          `id,name,slug,organization,country,photo_url,logo_url,
           subcategories:subcategory_id ( slug, categories:category_id ( slug ) )`,
        )
        .eq("status", "approved")
        .order("public_votes", { ascending: false, nullsFirst: false })
        .limit(Math.max(limit * 4, 40));

      if (cancelled) return;
      if (error) {
        console.warn("[ExistingNomineesInline] fetch failed", error);
        setRows([]);
        setLoading(false);
        return;
      }

      const mapped: Row[] = ((data as unknown as Array<Record<string, unknown>>) ?? []).map((r) => {
        const sub = r.subcategories as { categories?: { slug?: string } } | null;
        return {
          id: r.id as string,
          name: r.name as string,
          slug: r.slug as string,
          organization: (r.organization as string | null) ?? null,
          country: (r.country as string | null) ?? null,
          photo_url: (r.photo_url as string | null) ?? null,
          logo_url: (r.logo_url as string | null) ?? null,
          category_slug: sub?.categories?.slug ?? null,
        };
      });

      const filtered = categorySlug
        ? mapped.filter((r) => r.category_slug === categorySlug)
        : mapped;

      setRows(filtered.slice(0, limit));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [categorySlug, limit]);

  const allHref = categorySlug
    ? `/nominees?category=${encodeURIComponent(categorySlug)}`
    : "/nominees";

  return (
    <section
      className={`rounded-2xl border border-gold/25 bg-charcoal-light/40 p-4 md:p-6 ${className}`}
    >
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 className="font-playfair text-lg md:text-xl text-gold flex items-center gap-2">
            <Trophy className="h-4 w-4 md:h-5 md:w-5" /> {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs md:text-sm text-foreground/65 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
        <Link
          to={allHref}
          className="text-xs md:text-sm text-gold hover:text-gold/80 flex items-center gap-1 whitespace-nowrap"
        >
          See all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-foreground/60 py-6">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading nominees…
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-foreground/55 italic py-4">
          No approved nominees yet — be the first to nominate.
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((n) => {
            const img = n.photo_url || n.logo_url;
            return (
              <li key={n.id}>
                <Link
                  to={`/nominees/${n.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-gold/15 bg-charcoal/40 p-2 hover:border-gold/40 hover:bg-charcoal/60 transition-colors"
                >
                  <div className="h-10 w-10 shrink-0 rounded-full bg-charcoal-light overflow-hidden border border-gold/20">
                    {img ? (
                      <img
                        src={img}
                        alt={n.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gold/60 text-sm">
                        {n.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground/90 truncate">
                      {n.name}
                    </p>
                    {(n.organization || n.country) && (
                      <p className="text-[11px] text-foreground/55 truncate">
                        {n.organization || n.country}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default ExistingNomineesInline;
