// Recognition Hub — DB-driven index of the NESA-Africa 2026 spine.
// Reads recognition_tiers / _categories / _subcategories seeded in Stage 3–4.
// Serves as the canonical entry point for the 4-tier / 18-category /
// 96-subcategory architecture, replacing scattered legacy hubs.

import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Tier = {
  id: string;
  slug: string;
  name: string;
  rank: number;
  description: string | null;
};
type Category = {
  id: string;
  tier_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  sort_order: number | null;
};
type Sub = {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

const CYCLE_SLUG = "nesa-africa-2026";

export default function RecognitionHubPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [activeTier, setActiveTier] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: cycle, error: cycleErr } = await supabase
          .from("recognition_cycles")
          .select("id")
          .eq("slug", CYCLE_SLUG)
          .maybeSingle();
        if (cycleErr) throw cycleErr;
        if (!cycle) throw new Error("Recognition cycle not found");

        const [{ data: t }, { data: c }, { data: s }] = await Promise.all([
          supabase
            .from("recognition_tiers")
            .select("id, slug, name, rank, description")
            .eq("cycle_id", cycle.id)
            .order("rank"),
          supabase
            .from("recognition_categories")
            .select("id, tier_id, slug, name, tagline, description, sort_order")
            .order("sort_order", { nullsFirst: false }),
          supabase
            .from("recognition_subcategories")
            .select("id, category_id, slug, name, description, sort_order")
            .order("sort_order", { nullsFirst: false }),
        ]);
        if (cancelled) return;
        setTiers((t as Tier[]) ?? []);
        setCategories((c as Category[]) ?? []);
        setSubs((s as Sub[]) ?? []);
        setActiveTier(((t as Tier[]) ?? [])[0]?.id ?? null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load recognition spine");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const catsByTier = useMemo(() => {
    const map = new Map<string, Category[]>();
    for (const c of categories) {
      const arr = map.get(c.tier_id) ?? [];
      arr.push(c);
      map.set(c.tier_id, arr);
    }
    return map;
  }, [categories]);

  const subsByCat = useMemo(() => {
    const map = new Map<string, Sub[]>();
    for (const s of subs) {
      const arr = map.get(s.category_id) ?? [];
      arr.push(s);
      map.set(s.category_id, arr);
    }
    return map;
  }, [subs]);

  return (
    <>
      <Helmet>
        <title>Recognition Hub · NESA-Africa 2026</title>
        <meta
          name="description"
          content="Enablers of Education for All Across Africa — explore the 4 tiers, 18 categories and 96 subcategories of the 2026 Recognition Architecture."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/recognition" />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <header className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              NESA-Africa 2026
            </p>
            <h1 className="font-display text-3xl text-white md:text-5xl">
              Recognition Architecture
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-white/75 md:text-base">
              Enablers of Education for All Across Africa. Four recognition tiers,
              eighteen categories and ninety-six subcategories — one canonical spine.
            </p>
            {!loading && !error && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                {tiers.length} tiers · {categories.length} categories · {subs.length} subcategories
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gold/30 bg-black/40 p-4">
              <p className="text-sm text-white/80">
                <span className="font-semibold text-gold">New:</span> all 22 award landing pages
                are live — each with its own story, pathways and tailored nomination form.
              </p>
              <Link
                to="/recognition/pages"
                className="inline-flex items-center gap-1 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-charcoal hover:bg-gold/90"
              >
                Browse the 22 pages
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </header>


          {loading && (
            <div className="flex items-center gap-2 text-white/70" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading recognition spine…
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          )}

          {!loading && !error && tiers.length > 0 && (
            <>
              <nav
                aria-label="Recognition tiers"
                className="mb-8 flex flex-wrap gap-2"
              >
                {tiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTier(t.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTier === t.id
                        ? "bg-gold text-charcoal"
                        : "border border-white/15 text-white/80 hover:border-gold/60"
                    }`}
                  >
                    Tier {t.rank} · {t.name}
                  </button>
                ))}
              </nav>

              {tiers
                .filter((t) => t.id === activeTier)
                .map((tier) => {
                  const cats = catsByTier.get(tier.id) ?? [];
                  return (
                    <section key={tier.id} aria-label={`${tier.name} categories`}>
                      {tier.description && (
                        <p className="mb-6 max-w-3xl text-sm text-white/70">
                          {tier.description}
                        </p>
                      )}
                      <div className="grid gap-4 md:grid-cols-2">
                        {cats.map((c) => {
                          const catSubs = subsByCat.get(c.id) ?? [];
                          return (
                            <article
                              key={c.id}
                              className="rounded-xl border border-gold/20 bg-black/40 p-5"
                            >
                              <header className="mb-3">
                                <h2 className="font-display text-lg text-white">
                                  {c.name}
                                </h2>
                                {c.tagline && (
                                  <p className="mt-1 text-xs text-gold/80">{c.tagline}</p>
                                )}
                                {c.description && (
                                  <p className="mt-2 line-clamp-3 text-sm text-white/65">
                                    {c.description}
                                  </p>
                                )}
                              </header>
                              {catSubs.length > 0 ? (
                                <ul className="flex flex-wrap gap-2">
                                  {catSubs.map((s) => (
                                    <li key={s.id}>
                                      <Link
                                        to={`/awards/explore/${tier.slug}/${c.slug}/${s.slug}`}
                                        className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-black/60 px-3 py-1 text-xs text-white/85 hover:border-gold hover:bg-gold/10 hover:text-gold"
                                      >
                                        {s.name}
                                        <ChevronRight className="h-3 w-3" aria-hidden />
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-white/50">
                                  Subcategories publish with the nomination window.
                                </p>
                              )}
                              <footer className="mt-4">
                                <Link
                                  to={`/awards/explore/${tier.slug}/${c.slug}`}
                                  className="text-xs font-semibold text-gold hover:underline"
                                >
                                  Open category →
                                </Link>
                              </footer>
                            </article>
                          );
                        })}
                        {cats.length === 0 && (
                          <p className="text-sm text-white/60">
                            No categories seeded for this tier yet.
                          </p>
                        )}
                      </div>
                    </section>
                  );
                })}
            </>
          )}
        </main>
      </div>
    </>
  );
}
