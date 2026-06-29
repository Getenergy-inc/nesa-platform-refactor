// Canonical Category Page — `/awards/:tierSlug/category/:categorySlug`
//
// Renders ANY of the 43 canonical architecture categories
// (1 Icon + 18 GBG + 21 Platinum + 3 Influencer) using the same premium
// tier-styled layout as the four tier pages. Each page:
//   • Tier-themed hero (badge, title, lead, primary CTA)
//   • Embedded CategorySubcategoriesPanel — accordion of subcategories with
//     deep-link "Nominate" buttons + StageGate-protected voting for GBG.
//   • Hall of Fame / Eligibility / Final CTA standard sections.

import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import {
  getTierBySlug,
  getCategoryBySlug,
} from "@/config/recognitionArchitecture2026";
import { getFormForCategory } from "@/config/awards/categoryToFormMap";
import {
  AwardHeroStandard,
  FinalAwardCTA,
} from "@/components/awards/standard/sections";
import CategorySubcategoriesPanel from "@/components/awards/CategorySubcategoriesPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CanonicalCategoryPage() {
  const { tierSlug, categorySlug } = useParams<{
    tierSlug: string;
    categorySlug: string;
  }>();

  const tier = tierSlug ? getTierBySlug(tierSlug) : undefined;
  const category =
    tier && categorySlug ? getCategoryBySlug(tier.slug, categorySlug) : undefined;

  if (!tier) return <Navigate to="/awards" replace />;
  if (!category) return <Navigate to={tier.url} replace />;

  const form = getFormForCategory(category.slug);
  const subCount = category.subcategories.length || form?.subcategories.length || 0;
  const pageTitle = `${category.name} · ${tier.shortLabel} · NESA-Africa 2026`;
  const description =
    category.tagline ??
    `${category.name} — recognition category under ${tier.fullName}.`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description.slice(0, 158)} />
        <link
          rel="canonical"
          href={`https://nesa.africa/awards/${tier.slug}/category/${category.slug}`}
        />
      </Helmet>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-charcoal border-b border-gold/10 text-xs text-ivory/60"
      >
        <ol className="container mx-auto flex flex-wrap items-center gap-1.5 px-4 py-3">
          <li><Link to="/awards" className="hover:text-gold">Awards</Link></li>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <li><Link to={tier.url} className="hover:text-gold">{tier.shortLabel}</Link></li>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <li aria-current="page" className="text-ivory/90">{category.name}</li>
        </ol>
      </nav>

      <AwardHeroStandard
        pageSlug={`${tier.slug}-${category.slug}`}
        badge={`${tier.shortLabel} · Recognition Category`}
        title={category.name}
        subhead={category.tagline}
        lead={tier.description}
        stats={[
          { label: "Subcategories", value: subCount || "—" },
          { label: "Selection", value: tier.selectionMethod },
          { label: "Voting", value: tier.votingMode === "none" ? "Jury Only" : tier.votingMode === "public" ? "Public" : "Hybrid" },
          { label: "Tier", value: tier.shortLabel },
        ]}
        primaryCta={{
          label: "Nominate an Education Champion",
          href: form
            ? `/nominate?form=${form.slug}`
            : `/nominate?tier=${tier.slug}&category=${category.slug}`,
        }}
        secondaryCta={{
          label: "View Tier Overview",
          href: tier.url,
        }}
        trustLine={`Reviewed by the NRC · Aligned to SDG 4 · ${tier.tagline}`}
      />

      {/* Embedded subcategories + nomination panel */}
      {form ? (
        <CategorySubcategoriesPanel formSlug={form.slug} categoryTitle={category.name} />
      ) : (
        <section className="py-12 md:py-16 bg-charcoal border-y border-gold/15">
          <div className="container mx-auto max-w-4xl px-4">
            <Badge variant="outline" className="border-gold/40 text-gold mb-3">
              Subcategories
            </Badge>
            <h2 className="font-playfair text-2xl sm:text-3xl text-gold mb-4">
              {category.name} — Recognition Lanes
            </h2>
            {category.subcategories.length > 0 ? (
              <ul className="grid sm:grid-cols-2 gap-3">
                {category.subcategories.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/awards/${tier.slug}/category/${category.slug}/${s.slug}`}
                      className="block rounded-xl border border-gold/20 bg-charcoal-light/40 p-4 hover:border-gold/50 transition-all group"
                    >
                      <h3 className="text-ivory font-medium mb-1">{s.name}</h3>
                      {s.description && (
                        <p className="text-ivory/60 text-sm">{s.description}</p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold group-hover:gap-2 transition-all">
                        View subcategory <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ivory/60 text-sm">
                Subcategory lanes for {category.name} will publish ahead of the
                2026 nomination window. Use the button below to register interest
                or browse related recognition tiers.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to={`/nominate?tier=${tier.slug}&category=${category.slug}`}>
                  Begin Nomination
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                <Link to={tier.url}>Back to {tier.shortLabel}</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <FinalAwardCTA
        title={`Nominate a leader for ${category.name}`}
        lead={`Recognition under ${tier.fullName} reaches verified Education Enablers, jury members and policy stakeholders across Africa.`}
        primary={{
          label: "Start Nomination",
          href: form
            ? `/nominate?form=${form.slug}`
            : `/nominate?tier=${tier.slug}&category=${category.slug}`,
        }}
        secondary={{ label: "Africa's Education Impact Directory", href: "/nominees" }}
      />
    </>
  );
}
