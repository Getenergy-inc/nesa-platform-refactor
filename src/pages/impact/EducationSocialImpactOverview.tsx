// NESA-Africa Education Social Impact — section overview page (/impact).
//
// Replaces the former "Impact Programmes Hub". Brand order is locked:
// NESA-Africa → Education Social Impact → funded by Friends of EduAid-Africa.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import {
  IMPACT_BRAND,
  IMPACT_PRIORITY_CARDS,
  IMPACT_TRUST_STATEMENTS,
  IMPACT_NAV_ITEMS,
  IMPACT_NAV_FOOTER,
  IMPACT_GALA,
  IMPACT_CTAS,
} from "@/config/educationSocialImpact";
import EducationImpactStatsGrid from "@/components/impact/EducationImpactStatsGrid";

export default function EducationSocialImpactOverview() {
  return (
    <>
      <Helmet>
        <title>NESA-Africa Education Social Impact</title>
        <meta name="description" content={IMPACT_BRAND.positioning} />
        <link rel="canonical" href="https://nesa.africa/impact" />
        <meta property="og:title" content="NESA-Africa Education Social Impact" />
        <meta property="og:description" content={IMPACT_BRAND.positioning} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section className="bg-charcoal text-white px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-gold">NESA-Africa</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Education Social Impact</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-gold">
            {IMPACT_BRAND.name}
          </h1>
          <p className="mt-3 text-lg md:text-2xl text-white/90 font-medium">
            {IMPACT_BRAND.overviewHeadline}
          </p>
          <p className="mt-2 text-base md:text-lg text-white/75 max-w-3xl">
            {IMPACT_BRAND.positioning}
          </p>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-3xl">
            {IMPACT_BRAND.supportingLine}
          </p>
          <p className="mt-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            {IMPACT_BRAND.fundingLine}
          </p>

          <p className="mt-6 text-base md:text-lg text-white/85 max-w-3xl border-l-2 border-gold/50 pl-4">
            {IMPACT_BRAND.overviewMessage}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/eduaid-africa/rebuild-my-school"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90"
            >
              {IMPACT_CTAS.rebuild} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/impact/special-needs-schools"
              className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10"
            >
              {IMPACT_CTAS.specialNeeds}
            </Link>
            <Link
              to="/impact/regional"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white/85 hover:border-gold/40 hover:text-gold"
            >
              {IMPACT_CTAS.regional}
            </Link>
          </div>
        </div>
      </section>

      {/* Live stats */}
      <section className="bg-charcoal text-white px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">
            Measurable Education Impact
          </h2>
          <EducationImpactStatsGrid />
        </div>
      </section>

      {/* Three priority pathways */}
      <section className="bg-charcoal text-white px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">
            Where Impact Happens
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {IMPACT_PRIORITY_CARDS.map((c) => (
              <Link
                key={c.id}
                to={c.href}
                className="group rounded-2xl border border-gold/20 bg-white/[0.03] p-6 hover:border-gold/50 transition-colors"
              >
                <h3 className="font-playfair text-xl font-bold text-white group-hover:text-gold">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-white/70">{c.tagline}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-gold">{c.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section directory */}
      <section className="bg-charcoal text-white px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">
            Explore Education Impact
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_NAV_ITEMS.map((i) => (
              <li key={i.href}>
                <Link
                  to={i.href}
                  className="block rounded-lg border border-white/10 px-4 py-3 text-sm text-white/80 hover:border-gold/40 hover:text-gold"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/60">
            {IMPACT_GALA.longLabel}
          </p>
        </div>
      </section>

      {/* Trust & governance */}
      <section className="bg-charcoal text-white px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Governance &amp; Trust
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {IMPACT_TRUST_STATEMENTS.map((t) => (
              <div key={t.title} className="rounded-xl border border-gold/20 bg-white/[0.03] p-5">
                <h3 className="text-sm font-semibold text-gold">{t.title}</h3>
                <p className="mt-2 text-sm text-white/70">{t.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6 text-center">
            <p className="text-sm text-white/75">{IMPACT_NAV_FOOTER.note}</p>
            <Link
              to={IMPACT_NAV_FOOTER.ctaHref}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90"
            >
              {IMPACT_NAV_FOOTER.ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
