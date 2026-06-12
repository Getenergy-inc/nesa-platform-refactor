import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { AwardCategoryForm } from "@/config/nomination/types";

interface Props {
  form: AwardCategoryForm;
}

interface NomineeRow {
  id: string;
  name: string;
  slug: string;
  organization: string | null;
  country: string | null;
  photo_url: string | null;
  logo_url: string | null;
  subcategory_slug: string | null;
  category_slug: string | null;
  status: string | null;
}

/**
 * Renders nominees grouped by subcategory for a given award category form.
 * Used inside per-category nomination sections so visitors can see who has
 * already been nominated within each subcategory option before submitting.
 */
export function CategorySubcategoryNominees({ form }: Props) {
  const [rows, setRows] = useState<NomineeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const subSlugs = form.subcategories.map((s) => s.slug).filter(Boolean);

    (async () => {
      // Best-effort fetch: filter by category_slug OR any of the subcategory slugs
      let q = supabase
        .from("nominees")
        .select(
          "id,name,slug,organization,country,photo_url,logo_url,subcategory_slug,category_slug,status",
        )
        .eq("status", "approved")
        .limit(120);

      if (subSlugs.length > 0) {
        q = q.or(
          [
            `category_slug.eq.${form.slug}`,
            `subcategory_slug.in.(${subSlugs.join(",")})`,
          ].join(","),
        );
      } else {
        q = q.eq("category_slug", form.slug);
      }

      const { data, error } = await q;
      if (cancelled) return;
      if (error) {
        console.warn("[CategorySubcategoryNominees] fetch failed", error);
        setRows([]);
      } else {
        setRows((data as NomineeRow[]) ?? []);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [form.slug, form.subcategories]);

  const grouped = useMemo(() => {
    const map = new Map<string, NomineeRow[]>();
    for (const sub of form.subcategories) {
      map.set(sub.slug, []);
    }
    for (const r of rows) {
      const key = r.subcategory_slug && map.has(r.subcategory_slug)
        ? r.subcategory_slug
        : form.subcategories[0]?.slug ?? "_";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return map;
  }, [rows, form.subcategories]);

  if (!form.subcategories.length) return null;

  return (
    <section className="mt-8 rounded-2xl border border-gold/25 bg-charcoal-light/30 p-5 md:p-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gold" />
          <h3 className="font-playfair text-lg md:text-xl text-gold">
            Nominees by subcategory
          </h3>
        </div>
        <span className="text-xs text-foreground/60">
          {loading ? "Loading…" : `${rows.length} nominee${rows.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading nominees…
        </div>
      ) : (
        <div className="space-y-5">
          {form.subcategories.map((sub) => {
            const list = grouped.get(sub.slug) ?? [];
            return (
              <div key={sub.slug} className="border-t border-gold/15 pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-foreground/90">
                    {sub.name}
                    <span className="ml-2 text-xs text-foreground/55">
                      ({list.length})
                    </span>
                  </h4>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-gold hover:bg-gold/10"
                  >
                    <Link to={`/nominees?subcategory=${encodeURIComponent(sub.slug)}`}>
                      View all <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>

                {list.length === 0 ? (
                  <p className="text-xs text-foreground/50 italic">
                    No nominees yet — be the first to nominate for this subcategory.
                  </p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {list.slice(0, 6).map((n) => {
                      const img = n.photo_url || n.logo_url;
                      return (
                        <li key={n.id}>
                          <Link
                            to={`/nominees/${n.slug}`}
                            className="flex items-center gap-3 rounded-lg border border-gold/15 bg-charcoal/40 p-2 hover:border-gold/40 hover:bg-charcoal/60 transition-colors"
                          >
                            <div className="h-9 w-9 shrink-0 rounded-full bg-charcoal-light overflow-hidden border border-gold/20">
                              {img ? (
                                <img
                                  src={img}
                                  alt={n.name}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gold/60 text-xs">
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
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CategorySubcategoryNominees;
