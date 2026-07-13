// Phase 1 shell for a dedicated category page.
// Implements the 13-section skeleton driven entirely by the category config.
// Full form engine (section 9) and rich sub-sections land in Phases 2–4.

import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  getCategoryByTierAndSlug,
  getCategoryPath,
  type CategoryDefinition,
} from "@/config/recognition2026/categories";
import { getTier, type TierSlug } from "@/config/recognition2026/tiers";
import { INTEGRITY_NOTICE_2026, STANDARD_FAQS } from "@/config/recognition2026/integrity";
import { GEOGRAPHY_MODEL_LABELS } from "@/config/recognition2026/geographyModels";
import { NOMINEE_TYPE_LABELS } from "@/config/recognition2026/nomineeTypes";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="py-8 border-b border-gold/10 last:border-b-0">
      <h2 id={`${id}-h`} className="font-display text-xl md:text-2xl font-bold text-gold mb-4">{title}</h2>
      <div className="text-white/80 text-sm md:text-base leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function CategoryPage() {
  const { tier, category } = useParams<{ tier: TierSlug; category: string }>();
  const tierDef = tier ? getTier(tier as TierSlug) : undefined;
  const cat: CategoryDefinition | undefined = tier && category ? getCategoryByTierAndSlug(tier as TierSlug, category) : undefined;

  if (!tierDef || !cat) {
    return <Navigate to="/recognition" replace />;
  }

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Helmet>
        <title>{cat.seo.title}</title>
        <meta name="description" content={cat.seo.description} />
        <link rel="canonical" href={`https://nesaafrica.lovable.app${getCategoryPath(cat)}`} />
        <meta property="og:title" content={cat.seo.title} />
        <meta property="og:description" content={cat.seo.description} />
        <meta property="og:url" content={`https://nesaafrica.lovable.app${getCategoryPath(cat)}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-white/60 mb-6 flex flex-wrap items-center gap-1">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/recognition" className="hover:text-gold">Recognition 2026</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={tierDef.href} className="hover:text-gold">{tierDef.shortName}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold">{cat.shortName}</span>
        </nav>

        {/* 2. Hero */}
        <header className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80 font-semibold mb-2">{tierDef.name}</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{cat.name}</h1>
          <p className="text-white/75 text-base md:text-lg max-w-3xl">{cat.summary}</p>

          <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg border border-gold/20 bg-white/5 p-3">
              <dt className="text-white/50 uppercase tracking-wide">Nominee Type</dt>
              <dd className="text-gold font-semibold mt-1">{cat.nomineeTypes.map((t) => NOMINEE_TYPE_LABELS[t]).join(" · ")}</dd>
            </div>
            <div className="rounded-lg border border-gold/20 bg-white/5 p-3">
              <dt className="text-white/50 uppercase tracking-wide">Subcategories</dt>
              <dd className="text-gold font-semibold mt-1">{cat.subcategories.length || "See tier"}</dd>
            </div>
            <div className="rounded-lg border border-gold/20 bg-white/5 p-3">
              <dt className="text-white/50 uppercase tracking-wide">Opens</dt>
              <dd className="text-gold font-semibold mt-1">{formatDate(cat.openingDate)}</dd>
            </div>
            <div className="rounded-lg border border-gold/20 bg-white/5 p-3">
              <dt className="text-white/50 uppercase tracking-wide">Closes</dt>
              <dd className="text-gold font-semibold mt-1">{formatDate(cat.closingDate)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
              <a href="#nomination-form">Start Nomination</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/nominees">View Existing Education Enablers</Link>
            </Button>
          </div>
        </header>

        {/* 3. Overview */}
        <Section id="overview" title="Category Overview">
          <p>{cat.overview}</p>
        </Section>

        {/* 4. Who Can Be Nominated */}
        <Section id="who" title="Who Can Be Nominated">
          <ul className="list-disc pl-5 space-y-1">
            {cat.nomineeTypes.map((t) => <li key={t}>{NOMINEE_TYPE_LABELS[t]}</li>)}
          </ul>
        </Section>

        {/* 5. Approved Subcategories */}
        <Section id="subcategories" title="Approved Subcategories">
          {cat.subcategories.length === 0 ? (
            <p className="text-white/60 italic">Subcategory list finalising — publishes with the form in Phase 4.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {cat.subcategories.map((sc) => (
                <li key={sc.code} className="rounded-lg border border-gold/20 bg-white/5 p-4">
                  <div className="text-gold font-semibold text-sm">{sc.name}</div>
                  <p className="text-white/70 text-xs mt-1">{sc.description}</p>
                  <p className="text-white/50 text-[11px] mt-2"><strong className="text-white/70">Evidence:</strong> {sc.evidenceSummary}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* 6. Geographic Coverage */}
        <Section id="geography" title="Geographic Coverage">
          <p><strong className="text-gold">{GEOGRAPHY_MODEL_LABELS[cat.geographyModel]}</strong></p>
        </Section>

        {/* 7. Eligibility Requirements */}
        <Section id="eligibility" title="Eligibility Requirements">
          <ul className="list-disc pl-5 space-y-1">
            {cat.eligibility.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Section>

        {/* 8. Evidence Required */}
        <Section id="evidence" title="Evidence Required">
          <ul className="list-disc pl-5 space-y-1">
            {cat.evidenceRequired.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Section>

        {/* 9. Embedded Nomination Form (placeholder — Phase 3/4) */}
        <Section id="nomination-form" title="Nomination Form">
          <div className="rounded-xl border border-dashed border-gold/40 bg-white/5 p-6 text-center">
            <p className="text-white/70 text-sm">
              The dedicated nomination form for <span className="text-gold font-semibold">{cat.shortName}</span> will be embedded here.
            </p>
            <p className="text-white/50 text-xs mt-2">Reference number format: <code>NESA-2026-{cat.code}-000001</code></p>
            <Button asChild size="lg" className="mt-4 bg-gold text-charcoal hover:bg-gold-dark">
              <Link to={`/nominate?tier=${cat.tier}&category=${cat.slug}`}>Open Interim Nomination Form</Link>
            </Button>
          </div>
        </Section>

        {/* 10. Review Process */}
        <Section id="review" title="Review Process">
          <ol className="list-decimal pl-5 space-y-1">
            {cat.reviewRoute.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </Section>

        {/* 11. Integrity Notice */}
        <Section id="integrity" title="Integrity Notice">
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-white/80 text-sm">{INTEGRITY_NOTICE_2026}</p>
          </div>
        </Section>

        {/* 12. FAQs */}
        <Section id="faqs" title="Frequently Asked Questions">
          <dl className="space-y-3">
            {STANDARD_FAQS.map((f) => (
              <div key={f.q} className="rounded-lg border border-gold/15 bg-white/5 p-3">
                <dt className="text-gold font-semibold text-sm">{f.q}</dt>
                <dd className="text-white/70 text-sm mt-1">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* 13. Final CTA */}
        <Section id="final-cta" title="Take Action">
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark">
              <a href="#nomination-form">Start a Nomination</a>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to={tierDef.href}>Nominate Another Education Enabler</Link>
            </Button>
            <Button asChild variant="ghost" className="text-white/80 hover:text-gold">
              <Link to="/recognition">Return to Recognition 2026</Link>
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}
