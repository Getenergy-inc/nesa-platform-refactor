// Unified public entry point for the six Education Impact Certificate families
// (§3 pathway 2) — one door instead of six disconnected ones.

import { Link } from "react-router-dom";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import { BRAND, RECOGNITION_FAMILIES } from "@/config/brandHierarchy";

export default function EducationImpactCertificatesPage() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <LocalizedSEO
        pathname="/recognition/certificates"
        title={`Education Impact Certificates | ${BRAND.platform} 2026`}
        description="Six recognition families honouring Africa's Education Enablers under The African Blue-Garnet Awards for Education."
      />

      <header className="border-b border-gold/15 py-14 md:py-20">
        <div className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{BRAND.programme}</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold">
            Education Impact Certificates
          </h1>
          <p className="mt-4 text-lg text-white/75">
            {BRAND.programmeTagline}. Six recognition families, one umbrella programme —
            each sitting on the full NESA-Africa award architecture.
          </p>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="container grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {RECOGNITION_FAMILIES.map((f) => (
            <article
              key={f.slug}
              className="flex flex-col rounded-lg border border-gold/20 bg-white/[0.03] p-6"
            >
              <h2 className="font-display text-lg text-gold">{f.name}</h2>
              <p className="mt-2 flex-1 text-sm text-white/70">{f.lede}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link
                  to={`/nominate?family=${f.slug}`}
                  className="inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal hover:bg-gold/90 transition-colors"
                >
                  Nominate
                </Link>
                <Link
                  to={`/nominees?family=${f.slug}`}
                  className="inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold hover:bg-gold/10 transition-colors"
                >
                  Explore Existing Nominees
                </Link>
                <Link
                  to={`/recognition/${f.slug}`}
                  className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 hover:border-gold/40 hover:text-gold transition-colors"
                >
                  About This Award Category
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="container mt-12 flex flex-wrap gap-3">
          <Link
            to="/nominate"
            className="inline-flex h-11 items-center rounded-md bg-gold px-6 text-sm font-bold text-charcoal hover:bg-gold/90"
          >
            Nominate an Education Enabler
          </Link>
          <Link
            to="/recognition/categories"
            className="inline-flex h-11 items-center rounded-md border border-gold/40 px-6 text-sm font-semibold text-gold hover:bg-gold/10"
          >
            Explore All Recognition Categories
          </Link>
        </div>
      </section>
    </div>
  );
}
