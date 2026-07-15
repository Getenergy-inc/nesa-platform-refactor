import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  UserPlus,
  Heart,
  ThumbsUp,
  Sparkles,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getTierBySlug } from "@/config/recognitionArchitecture2026";
import { listSubcategoriesForCategory } from "@/config/recognition/categoryAlias";
import { buildCategoryForm } from "@/config/recognition/buildCategoryForm";
import { NativeCategoryNominationForm } from "@/components/awards/NativeCategoryNominationForm";
import { AwardOverviewHowTo } from "@/components/awards/AwardOverviewHowTo";
import { getStoryHeroImage } from "@/config/awards/subpageHeroImages";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const SITE = "https://nesaafrica.lovable.app";
const BRAND_TAGLINE = "Enablers of Education for All Across Africa";

interface Nominee {
  id: string;
  name: string;
  slug: string;
  organization: string | null;
  country: string | null;
  photo_url: string | null;
  logo_url: string | null;
}

export default function TierCategorySubcategoryPage() {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string;
    subcategorySlug: string;
  }>();

  const tier = getTierBySlug("gold-blue-garnet");
  const category = tier?.categories.find((c) => c.slug === categorySlug);
  const subs = useMemo(
    () => (categorySlug ? listSubcategoriesForCategory(categorySlug) : []),
    [categorySlug],
  );
  const subcategory = subs.find((s) => s.slug === subcategorySlug);
  const form = useMemo(
    () => (categorySlug ? buildCategoryForm(categorySlug) : null),
    [categorySlug],
  );

  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subcategorySlug) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("nominees")
        .select(
          `id,name,slug,organization,country,photo_url,logo_url,
           subcategories:subcategory_id ( slug )`,
        )
        .eq("status", "approved")
        .limit(120);
      if (cancelled) return;
      const rows = ((data as unknown as Array<Record<string, unknown>>) ?? [])
        .filter((r) => {
          const s = r.subcategories as { slug?: string } | null;
          return s?.slug === subcategorySlug;
        })
        .map((r) => ({
          id: r.id as string,
          name: r.name as string,
          slug: r.slug as string,
          organization: (r.organization as string | null) ?? null,
          country: (r.country as string | null) ?? null,
          photo_url: (r.photo_url as string | null) ?? null,
          logo_url: (r.logo_url as string | null) ?? null,
        }));
      setNominees(rows);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [subcategorySlug]);

  if (!category) return <Navigate to="/awards/18-categories" replace />;
  if (!subcategory)
    return <Navigate to={`/awards/gold-blue-garnet/${category.slug}`} replace />;

  const basePath = `/awards/gold-blue-garnet/${category.slug}`;
  const subPath = `${basePath}/${subcategory.slug}`;
  const donateHref = `/donate?category=${category.slug}&subcategory=${subcategory.slug}`;

  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <Helmet>
        <title>{`${subcategory.title} · ${category.name} | NESA-Africa 2026`}</title>
        <meta name="description" content={subcategory.description} />
        <link rel="canonical" href={`${SITE}${subPath}`} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          { name: "Gold–Blue Garnet", path: "/awards/gold-blue-garnet" },
          { name: category.name, path: basePath },
          { name: subcategory.shortLabel ?? subcategory.title, path: subPath },
        ]}
      />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        {(() => {
          const heroImg =
            getStoryHeroImage(subcategory.slug) ?? getStoryHeroImage(category.slug);
          return heroImg ? (
            <>
              <img
                src={heroImg}
                alt={`${subcategory.title} — ${BRAND_TAGLINE}`}
                loading="eager"
                width={1600}
                height={900}
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/80 to-charcoal"
              />
            </>
          ) : null;
        })()}
        <div className="container relative mx-auto px-4 py-10 md:py-14">
          <Link
            to={basePath}
            className="inline-flex items-center gap-1.5 text-xs text-ivory/60 hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to {category.name}
          </Link>

          <div className="mt-4 max-w-3xl">
            <Badge className="mb-3 border-gold/40 bg-gold/10 text-gold">
              <Sparkles className="mr-1.5 h-3 w-3" /> {BRAND_TAGLINE}
            </Badge>
            <p className="text-xs uppercase tracking-[0.25em] text-gold/80">
              {category.name}
            </p>
            <h1 className="mt-2 font-serif text-3xl md:text-5xl text-ivory leading-tight">
              {subcategory.title}
            </h1>
            <p className="mt-4 text-lg text-ivory/75 leading-relaxed">
              {subcategory.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-6"
              >
                <a href="#nominate">
                  <UserPlus className="mr-2 h-4 w-4" /> Nominate another Enabler
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6"
              >
                <a href="#existing">
                  <ThumbsUp className="mr-2 h-4 w-4" /> Endorse Existing Nominee
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6"
              >
                <Link to={donateHref}>
                  <Heart className="mr-2 h-4 w-4" /> Donate
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & How to Nominate */}
      <AwardOverviewHowTo
        name={subcategory.title}
        tagline={subcategory.description}
        tierLabel={`Gold–Blue Garnet · ${category.name}`}
        nominateHref="#nominate"
        secondaryHref={basePath}
        secondaryLabel={`All of ${category.name}`}
        kind="subcategory"
      />

      {/* About */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gold/20 bg-charcoal-light/50 p-5">
            <ShieldCheck className="h-6 w-6 text-gold" />
            <h3 className="mt-3 font-serif text-lg text-ivory">NRC Verified</h3>
            <p className="mt-1 text-sm text-ivory/65">
              Every nomination in this subcategory is evidence-checked by the Nominee
              Review Committee before it enters public review.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-charcoal-light/50 p-5">
            <Users className="h-6 w-6 text-gold" />
            <h3 className="mt-3 font-serif text-lg text-ivory">Public + Jury</h3>
            <p className="mt-1 text-sm text-ivory/65">
              Gold–Blue Garnet finalists are chosen via a combined public voting and
              expert jury evaluation.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-charcoal-light/50 p-5">
            <Sparkles className="h-6 w-6 text-gold" />
            <h3 className="mt-3 font-serif text-lg text-ivory">{BRAND_TAGLINE}</h3>
            <p className="mt-1 text-sm text-ivory/65">
              Recognises individuals and institutions delivering measurable education
              impact across Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Existing Nominees */}
      <section
        id="existing"
        className="container mx-auto px-4 py-10 scroll-mt-24"
      >
        <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-serif text-2xl md:text-3xl text-ivory">
            Existing Nominees{" "}
            <span className="text-gold/70 text-lg">
              ({loading ? "…" : nominees.length})
            </span>
          </h2>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            <Link to={`/nominees?subcategory=${encodeURIComponent(subcategory.slug)}`}>
              View full directory
            </Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-ivory/50">Loading nominees…</p>
        ) : nominees.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gold/30 bg-black/30 p-8 text-center">
            <p className="text-ivory/70">
              No nominees yet in <span className="text-gold">{subcategory.title}</span>.
              Be the first to nominate an enabler below.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nominees.slice(0, 12).map((n) => {
              const img = n.photo_url || n.logo_url;
              return (
                <li key={n.id}>
                  <Link
                    to={`/nominees/${n.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-gold/15 bg-charcoal-light/40 p-3 hover:border-gold/40 hover:bg-charcoal-light/70 transition-colors"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/25 bg-charcoal">
                      {img ? (
                        <img
                          src={img}
                          alt={n.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gold/60">
                          {n.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ivory">
                        {n.name}
                      </p>
                      {(n.organization || n.country) && (
                        <p className="truncate text-xs text-ivory/55">
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

      {/* Nominate */}
      {form && (
        <section
          id="nominate"
          className="border-t border-gold/20 bg-charcoal-light/30 py-12 md:py-16 scroll-mt-24"
        >
          <div className="container mx-auto max-w-4xl px-4">
            <div className="mb-6 text-center">
              <Badge className="mb-3 border-gold/40 bg-gold/10 text-gold">
                <UserPlus className="mr-1.5 h-3 w-3" /> Nominate an Enabler
              </Badge>
              <h2 className="font-serif text-2xl md:text-4xl text-ivory">
                Nominate for {subcategory.shortLabel ?? subcategory.title}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-ivory/70">
                Your submission is pre-tagged to this subcategory —
                <span className="text-gold"> {BRAND_TAGLINE}</span>.
              </p>
            </div>
            <NativeCategoryNominationForm
              form={form}
              defaultSubcategorySlug={subcategory.slug}
              successRedirectHref="/awards/gold-blue-garnet/nominees"
              successRedirectLabel="Gold–Blue Garnet Nominees"
            />

          </div>
        </section>
      )}
    </div>
  );
}
