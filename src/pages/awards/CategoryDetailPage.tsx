import { useMemo, useState } from "react";
import { Link, useParams, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Users,
  ShieldCheck,
  ChevronDown,
  Heart,
  UserPlus,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getTierBySlug } from "@/config/recognitionArchitecture2026";
import { listSubcategoriesForCategory } from "@/config/recognition/categoryAlias";
import { buildCategoryForm } from "@/config/recognition/buildCategoryForm";
import { NativeCategoryNominationForm } from "@/components/awards/NativeCategoryNominationForm";
import { CategorySubcategoryNominees } from "@/components/awards/CategorySubcategoryNominees";

const SITE = "https://nesaafrica.lovable.app";
const BRAND_TAGLINE = "Enablers of Education for All Across Africa";

export default function CategoryDetailPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams] = useSearchParams();
  const tier = getTierBySlug("gold-blue-garnet");
  const category = tier?.categories.find((c) => c.slug === categorySlug);
  const subcategories = useMemo(
    () => (categorySlug ? listSubcategoriesForCategory(categorySlug) : []),
    [categorySlug],
  );
  const form = useMemo(
    () => (categorySlug ? buildCategoryForm(categorySlug) : null),
    [categorySlug],
  );
  // Prefill subcategory from ?sub= / ?subcategory= if it matches an available option;
  // otherwise fall back to the first subcategory (handled inside the form).
  const subParam = searchParams.get("sub") ?? searchParams.get("subcategory") ?? undefined;
  const prefillSubSlug = useMemo(() => {
    if (!subParam || !form) return undefined;
    return form.subcategories.find((s) => s.slug === subParam)?.slug;
  }, [subParam, form]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!category) return <Navigate to="/awards/18-categories" replace />;

  const basePath = `/awards/gold-blue-garnet/${category.slug}`;
  const nominateHref = `/nominate?tier=gold-blue-garnet&category=${category.slug}`;
  const donateHref = `/donate?category=${category.slug}`;

  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <Helmet>
        <title>{`${category.name} · Enablers of Education for All Across Africa | NESA-Africa 2026`}</title>
        <meta
          name="description"
          content={`${category.name} — ${category.tagline} Browse subcategories, endorse existing nominees, or nominate another enabler.`}
        />
        <link rel="canonical" href={`${SITE}${basePath}`} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          { name: "Gold–Blue Garnet", path: "/awards/gold-blue-garnet" },
          { name: category.name, path: basePath },
        ]}
      />

      {/* Header */}
      <section className="border-b border-gold/20 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <Link
            to="/awards/18-categories"
            className="inline-flex items-center gap-1.5 text-xs text-ivory/60 hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All 18 categories
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 max-w-3xl"
          >
            <Badge className="mb-3 border-gold/40 bg-gold/10 text-gold">
              <Sparkles className="mr-1.5 h-3 w-3" /> {BRAND_TAGLINE}
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl text-ivory leading-tight">
              {category.name}
            </h1>
            <p className="mt-4 text-lg text-ivory/75 leading-relaxed">{category.tagline}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ivory/70">
              <span className="inline-flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gold" /> Gold–Blue Garnet Tier
              </span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-gold" /> Jury + Public
              </span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" /> NRC Verified
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-6"
              >
                <a href="#nominate">Nominate an Enabler</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6"
              >
                <a href="#existing-nominees">Endorse Existing Nominee</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6"
              >
                <Link to={donateHref}>Donate</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Subcategory Nav */}
      {subcategories.length > 0 && (
        <div className="sticky top-0 z-30 border-b border-gold/20 bg-charcoal/95 backdrop-blur supports-[backdrop-filter]:bg-charcoal/80">
          <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold/80">
              <FileCheck className="h-3.5 w-3.5" />
              {subcategories.length} Subcategor{subcategories.length === 1 ? "y" : "ies"}
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gold/40 text-ivory hover:bg-gold/10"
                    aria-label="Open subcategory menu"
                  >
                    Browse subcategories
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="max-h-[70vh] w-[min(90vw,26rem)] overflow-y-auto bg-charcoal-light border-gold/30 text-ivory"
                >
                  <DropdownMenuLabel className="text-gold">
                    Subcategories · {category.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gold/20" />
                  {subcategories.map((s) => (
                    <DropdownMenuItem key={s.slug} asChild>
                      <Link
                        to={`${basePath}/${s.slug}`}
                        className="cursor-pointer text-sm hover:text-gold focus:text-gold"
                      >
                        {s.shortLabel ?? s.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-gold/20" />
                  <DropdownMenuItem asChild>
                    <a href="#nominate" className="text-gold cursor-pointer">
                      + Nominate another enabler
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                asChild
                size="sm"
                className="bg-gold text-charcoal hover:bg-gold/90"
              >
                <a href="#nominate">Nominate</a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Nomination Form — surfaced FIRST so visitors can nominate immediately */}
      {form && (
        <section
          id="nominate"
          className="border-b border-gold/20 bg-charcoal-light/30 py-12 md:py-16 scroll-mt-24"
        >
          <div className="container mx-auto max-w-4xl px-4">
            <div className="mb-6 text-center">
              <Badge className="mb-3 border-gold/40 bg-gold/10 text-gold">
                <UserPlus className="mr-1.5 h-3 w-3" /> Nominate an Enabler
              </Badge>
              <h2 className="font-serif text-2xl md:text-4xl text-ivory">
                Nominate for {category.name}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-ivory/70">
                Submit a nomination directly — NRC will evidence-check the entry
                before it enters public review.{" "}
                <span className="text-gold">{BRAND_TAGLINE}</span>.
              </p>
            </div>
            <NativeCategoryNominationForm
              form={form}
              successRedirectHref="/awards/gold-blue-garnet/nominees"
              successRedirectLabel="Gold–Blue Garnet Nominees"
            />
          </div>
        </section>
      )}

      {/* Subcategories */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-ivory md:text-3xl">
              Recognition Subcategories
            </h2>
            <p className="mt-1 text-sm text-ivory/60">
              {subcategories.length > 0
                ? `${subcategories.length} subcategor${subcategories.length === 1 ? "y" : "ies"} — open one to see existing nominees, endorse them, or nominate another enabler.`
                : "This category is open for direct nominations — subcategory listings are being finalised."}
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold/70">{BRAND_TAGLINE}</p>
        </div>

        {subcategories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((s, idx) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: (idx % 6) * 0.03 }}
              >
                <Link
                  to={`${basePath}/${s.slug}`}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl"
                  aria-label={`Open subcategory: ${s.title}`}
                >
                  <Card className="h-full border-gold/15 bg-charcoal-light/60 transition-all hover:border-gold/50 hover:shadow-[0_0_25px_-12px_rgba(244,196,48,0.4)]">
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-gold/70">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {s.scope === "africa-regional" && (
                          <Badge
                            variant="outline"
                            className="border-gold/30 text-gold/90 text-[10px]"
                          >
                            Regional
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-serif text-base leading-snug text-ivory group-hover:text-gold transition-colors">
                        {s.shortLabel ?? s.title}
                      </h3>
                      <p className="mt-2 text-xs text-ivory/60 leading-relaxed line-clamp-3">
                        {s.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold group-hover:gap-2 transition-all">
                        View nominees & nominate <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gold/30 bg-black/30 p-8 text-center">
            <p className="text-ivory/70">
              Subcategories for <span className="text-gold">{category.name}</span> are being
              finalised. Nominations are already open at the category level below.
            </p>
          </div>
        )}
      </section>

      {/* Existing Nominees (grouped by subcategory) */}
      {form && form.subcategories.length > 0 && (
        <section id="existing-nominees" className="container mx-auto px-4 pb-12 md:pb-16 scroll-mt-24">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl text-ivory md:text-3xl">
              Existing Nominees
            </h2>
          </div>
          <p className="mb-4 text-sm text-ivory/60 max-w-2xl">
            Endorse an enabler already nominated, or scroll up to nominate another —
            <span className="text-gold"> {BRAND_TAGLINE}</span>.
          </p>
          <CategorySubcategoryNominees form={form} />
        </section>
      )}

      {/* Footer CTA */}
      <section className="border-t border-gold/15 bg-charcoal-light/40">
        <div className="container mx-auto px-4 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{BRAND_TAGLINE}</p>
          <h3 className="mt-2 font-serif text-2xl text-ivory">
            Support {category.name}
          </h3>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-gold text-charcoal hover:bg-gold/90 rounded-full px-6"
            >
              <a href="#nominate">
                <UserPlus className="mr-2 h-4 w-4" /> Nominate
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
            <Button
              asChild
              variant="outline"
              className="border-ivory/30 text-ivory hover:bg-ivory/10 rounded-full px-6"
            >
              <Link to="/awards/gold-blue-garnet">Tier Overview</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
