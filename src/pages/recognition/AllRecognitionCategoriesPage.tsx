// §5 — "Explore All Recognition Categories".
// The complete authoritative architecture, organised hierarchically:
// Recognition Family → Category → Subcategory → Regions → Classification.

import { Link } from "react-router-dom";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import type { CategoryDefinition } from "@/config/recognition2026/categories";
import {
  BRAND,
  RECOGNITION_FAMILIES,
  getFamilyCategories,
  getUnbundledCategories,
  ICON_PATHWAYS,
  RECOGNITION_COMMUNITIES,
} from "@/config/brandHierarchy";

function CategoryBlock({ c }: { c: CategoryDefinition }) {
  return (
    <article className="rounded-lg border border-gold/20 bg-white/[0.03] p-6">
      <h3 className="font-display text-lg text-gold">{c.name}</h3>
      <p className="mt-2 text-sm text-white/70">{c.summary}</p>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-semibold text-white/70 hover:text-gold">
          Overview, eligibility, subcategories &amp; regions
        </summary>
        <div className="mt-4 space-y-4 text-sm text-white/70">
          <div>
            <h4 className="text-xs uppercase tracking-wide text-gold/80">Overview</h4>
            <p className="mt-1">{c.overview}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide text-gold/80">Who can be nominated</h4>
            <ul className="mt-1 space-y-1">
              {c.eligibility.map((e) => (
                <li key={e}>· {e}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide text-gold/80">What impact qualifies</h4>
            <ul className="mt-1 space-y-1">
              {c.evidenceRequired.map((e) => (
                <li key={e}>· {e}</li>
              ))}
            </ul>
          </div>
          {c.subcategories?.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-gold/80">
                Subcategories ({c.subcategories.length})
              </h4>
              <ul className="mt-1 space-y-1">
                {c.subcategories.map((s) => (
                  <li key={s.code}>· {s.name}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h4 className="text-xs uppercase tracking-wide text-gold/80">Regions</h4>
            <p className="mt-1">
              {c.geographyModel.replace(/_/g, " ").toLowerCase()} — 8 African regions plus the
              African Diaspora.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wide text-gold/80">Classification</h4>
            <p className="mt-1">{c.nomineeTypes.join(", ")}</p>
          </div>
        </div>
      </details>

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
  );
}

export default function AllRecognitionCategoriesPage() {
  const unbundled = getUnbundledCategories();

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <LocalizedSEO
        pathname="/recognition/categories"
        title={`Explore All Recognition Categories | ${BRAND.platform} 2026`}
        description="Every Education Enabler has a place within the NESA-Africa recognition ecosystem. The complete category and subcategory architecture."
      />

      <header className="border-b border-gold/15 py-14 md:py-20">
        <div className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{BRAND.programme}</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold">
            Explore All Recognition Categories
          </h1>
          <p className="mt-4 text-lg text-white/75">
            Every Education Enabler has a place within the NESA-Africa recognition ecosystem.
          </p>
        </div>
      </header>

      {/* Flagship */}
      <section className="py-12" aria-labelledby="cat-icon">
        <div className="container">
          <h2 id="cat-icon" className="font-display text-2xl text-white">
            Flagship · {BRAND.flagship}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/60">{BRAND.flagshipTagline}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {ICON_PATHWAYS.map((p) => (
              <article key={p.slug} className="rounded-lg border border-gold/25 bg-white/[0.03] p-6">
                <h3 className="font-display text-base text-gold">{p.name}</h3>
                <p className="mt-2 text-sm text-white/70">{p.blurb}</p>
                <Link
                  to={p.nomineesHref}
                  className="mt-4 inline-block text-xs font-semibold text-gold hover:underline"
                >
                  Existing nominees →
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/50">
            Recognition communities: {RECOGNITION_COMMUNITIES.map((c) => c.name).join(" · ")}.
          </p>
        </div>
      </section>

      {/* Six families */}
      {RECOGNITION_FAMILIES.map((f) => (
        <section key={f.slug} className="border-t border-gold/15 py-12" aria-labelledby={`fam-${f.slug}`}>
          <div className="container">
            <h2 id={`fam-${f.slug}`} className="font-display text-2xl text-white">
              <Link to={`/recognition/${f.slug}`} className="hover:text-gold">
                {f.name}
              </Link>
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/60">{f.lede}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {getFamilyCategories(f).map((c) => (
                <CategoryBlock key={c.slug} c={c} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Everything else — still fully public */}
      {unbundled.length > 0 && (
        <section className="border-t border-gold/15 py-12" aria-labelledby="cat-more">
          <div className="container">
            <h2 id="cat-more" className="font-display text-2xl text-white">
              Further recognition categories
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Institutional, faith, policy and specialist categories — fully available for
              nomination.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {unbundled.map((c) => (
                <CategoryBlock key={c.slug} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
