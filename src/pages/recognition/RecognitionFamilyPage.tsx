// Recognition family page — one indexable page per Education Impact Certificate
// family (§14). Progressive disclosure: family → categories → subcategories.

import { useParams, Link, Navigate } from "react-router-dom";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import {
  BRAND,
  getRecognitionFamily,
  getFamilyCategories,
} from "@/config/brandHierarchy";

export default function RecognitionFamilyPage({ slugOverride }: { slugOverride?: string }) {
  const params = useParams();
  const slug = slugOverride ?? params.family ?? "";
  const family = getRecognitionFamily(slug);

  if (!family) return <Navigate to="/recognition/certificates" replace />;

  const categories = getFamilyCategories(family);

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <LocalizedSEO
        pathname={`/recognition/${family.slug}`}
        title={`${family.name} | ${BRAND.platform} 2026`}
        description={family.lede}
      />

      <header className="border-b border-gold/15 py-14 md:py-20">
        <div className="container">
          <nav aria-label="Breadcrumb" className="text-xs text-white/50">
            <Link to="/" className="hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/recognition/certificates" className="hover:text-gold">
              Education Impact Certificates
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{family.name}</span>
          </nav>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-gold">
            {BRAND.programme}
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-white">
            {family.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">{family.lede}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/nominate?family=${family.slug}`}
              className="inline-flex h-11 items-center rounded-md bg-gold px-6 text-sm font-bold text-charcoal hover:bg-gold/90"
            >
              Nominate an Education Enabler
            </Link>
            <Link
              to={`/nominees?family=${family.slug}`}
              className="inline-flex h-11 items-center rounded-md border border-gold/40 px-6 text-sm font-semibold text-gold hover:bg-gold/10"
            >
              Explore Existing Nominees
            </Link>
          </div>
        </div>
      </header>

      <section className="py-12 md:py-16" aria-labelledby="family-overview">
        <div className="container grid gap-8 md:grid-cols-3">
          <div>
            <h2 id="family-overview" className="font-display text-lg text-gold">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{family.overview}</p>
          </div>
          <div>
            <h2 className="font-display text-lg text-gold">Who can be nominated</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {family.whoCanBeNominated}
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg text-gold">What impact qualifies</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {family.qualifyingImpact}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-gold/15 py-12 md:py-16" aria-labelledby="family-cats">
        <div className="container">
          <h2 id="family-cats" className="font-display text-2xl text-white">
            Recognition categories in this family
          </h2>
          <p className="mt-2 text-sm text-white/60">
            The full award architecture remains intact underneath this page.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {categories.map((c) => (
              <article
                key={c.slug}
                className="rounded-lg border border-gold/20 bg-white/[0.03] p-6"
              >
                <h3 className="font-display text-lg text-gold">{c.shortName}</h3>
                <p className="mt-2 text-sm text-white/70">{c.summary}</p>

                {c.subcategories?.length > 0 && (
                  <details className="mt-4 group">
                    <summary className="cursor-pointer text-xs font-semibold text-white/70 hover:text-gold">
                      {c.subcategories.length} subcategories
                    </summary>
                    <ul className="mt-3 space-y-1.5 text-xs text-white/60">
                      {c.subcategories.map((s) => (
                        <li key={s.code}>· {s.name}</li>
                      ))}
                    </ul>
                  </details>
                )}

                <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
                  <Link to={`/recognition/subpage/${c.slug}`} className="text-gold hover:underline">
                    Category page →
                  </Link>
                  <Link
                    to={`/nominees?tier=${c.tier}&category=${c.slug}`}
                    className="text-white/70 hover:text-gold"
                  >
                    Existing nominees →
                  </Link>
                  <Link
                    to={`/nominate?tier=${c.tier}&category=${c.slug}`}
                    className="text-white/70 hover:text-gold"
                  >
                    Nominate →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/recognition/categories" className="text-sm text-gold hover:underline">
              Explore All Recognition Categories →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
