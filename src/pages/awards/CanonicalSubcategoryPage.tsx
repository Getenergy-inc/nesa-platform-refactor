// Canonical Subcategory Page — dedicated route for every architecture
// subcategory under a tier+category. Route:
//   /awards/:tierSlug/category/:categorySlug/:subcategorySlug
//
// Renders: tier-themed hero · subcategory description · embedded
// NativeCategoryNominationForm preselected to this subcategory.

import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  getTierBySlug,
  getCategoryBySlug,
  getSubcategoryBySlug,
} from "@/config/recognitionArchitecture2026";
import { getFormForCategory } from "@/config/awards/categoryToFormMap";
import { getCategoryFormBySlug } from "@/config/nomination/awardCategoryForms";
import {
  AwardHeroStandard,
  FinalAwardCTA,
} from "@/components/awards/standard/sections";
import NativeCategoryNominationForm from "@/components/awards/NativeCategoryNominationForm";
import { Button } from "@/components/ui/button";

export default function CanonicalSubcategoryPage() {
  const { tierSlug, categorySlug, subcategorySlug } = useParams<{
    tierSlug: string;
    categorySlug: string;
    subcategorySlug: string;
  }>();

  const tier = tierSlug ? getTierBySlug(tierSlug) : undefined;
  const category =
    tier && categorySlug ? getCategoryBySlug(tier.slug, categorySlug) : undefined;
  const archSub =
    tier && category && subcategorySlug
      ? getSubcategoryBySlug(tier.slug, category.slug, subcategorySlug)
      : undefined;

  if (!tier) return <Navigate to="/awards" replace />;
  if (!category) return <Navigate to={tier.url} replace />;

  // Prefer architecture metadata; fall back to a form-subcategory if mapped.
  const form = getFormForCategory(category.slug);
  const formSub = form?.subcategories.find((s) => s.slug === subcategorySlug);
  const subName = archSub?.name ?? formSub?.name ?? subcategorySlug;
  const subDescription =
    archSub?.description ??
    formSub?.exampleNominees?.slice(0, 1).join(" · ") ??
    `${subName} — a recognition lane within ${category.name}.`;

  // If the subcategory does not exist in either source, send the user back.
  if (!archSub && !formSub) {
    return <Navigate to={`/awards/${tier.slug}/category/${category.slug}`} replace />;
  }

  const liveForm = form ? getCategoryFormBySlug(form.slug) : undefined;
  const nominateHref = liveForm
    ? `/nominate?form=${liveForm.slug}&subcategory=${subcategorySlug}`
    : `/nominate?tier=${tier.slug}&category=${category.slug}&subcategory=${subcategorySlug}`;

  return (
    <>
      <Helmet>
        <title>{`${subName} · ${category.name} · NESA-Africa 2026`}</title>
        <meta
          name="description"
          content={`${subName} recognition — ${category.name} (${tier.shortLabel}). Nominate an Education Enabler across Africa.`.slice(
            0,
            158,
          )}
        />
        <link
          rel="canonical"
          href={`https://nesa.africa/awards/${tier.slug}/category/${category.slug}/${subcategorySlug}`}
        />
      </Helmet>

      <nav
        aria-label="Breadcrumb"
        className="bg-charcoal border-b border-gold/10 text-xs text-ivory/60"
      >
        <ol className="container mx-auto flex flex-wrap items-center gap-1.5 px-4 py-3">
          <li><Link to="/awards" className="hover:text-gold">Awards</Link></li>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <li><Link to={tier.url} className="hover:text-gold">{tier.shortLabel}</Link></li>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <li>
            <Link
              to={`/awards/${tier.slug}/category/${category.slug}`}
              className="hover:text-gold"
            >
              {category.name}
            </Link>
          </li>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <li aria-current="page" className="text-ivory/90">{subName}</li>
        </ol>
      </nav>

      <AwardHeroStandard
        pageSlug={`${tier.slug}-${category.slug}-${subcategorySlug}`}
        badge={`${category.name} · Subcategory`}
        title={subName}
        subhead={subDescription}
        lead={tier.description}
        primaryCta={{ label: "Nominate Now", href: nominateHref }}
        secondaryCta={{
          label: `← Back to ${category.name}`,
          href: `/awards/${tier.slug}/category/${category.slug}`,
        }}
        trustLine={`Reviewed by the NRC · ${tier.selectionMethod}`}
      />

      {/* Embedded nomination form (preselected to this subcategory) */}
      {liveForm ? (
        <section className="py-12 md:py-16 bg-charcoal-light/30 border-y border-gold/15">
          <div className="container mx-auto max-w-3xl px-4">
            <header className="mb-6 text-center">
              <h2 className="font-playfair text-2xl sm:text-3xl text-gold mb-2">
                Nominate for {subName}
              </h2>
              <p className="text-ivory/70 text-sm max-w-2xl mx-auto">
                Submit your nomination below. Entries are reviewed by the
                Nominee Review Committee (NRC) before reaching the jury.
              </p>
            </header>
            <NativeCategoryNominationForm
              form={liveForm}
              defaultSubcategorySlug={subcategorySlug}
            />
          </div>
        </section>
      ) : (
        <section className="py-16 bg-charcoal-light/30 border-y border-gold/15">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <h2 className="font-playfair text-2xl text-gold mb-3">
              Nominations Opening Soon
            </h2>
            <p className="text-ivory/70 mb-6">
              The dedicated nomination form for {subName} will publish ahead of
              the 2026 nomination window. Use the button below to register
              your nomination through the unified intake.
            </p>
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to={nominateHref}>Begin Nomination</Link>
            </Button>
          </div>
        </section>
      )}

      <FinalAwardCTA
        title={`Champion ${subName}`}
        lead={`Your nomination strengthens Africa's largest verified roster of Education Enablers under ${tier.fullName}.`}
        primary={{ label: "Start Nomination", href: nominateHref }}
        secondary={{
          label: `Explore ${category.name}`,
          href: `/awards/${tier.slug}/category/${category.slug}`,
        }}
      />
    </>
  );
}
