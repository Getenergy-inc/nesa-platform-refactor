// Homepage — "Meet Africa's Education Enablers".
//
// One Continental Mission. Six Recognition Pathways.
//
// This is the Education Impact Certificate counterpart to the Africa Education
// Icon Award flagship section (IconLifetimeSection). It deliberately reuses the
// same editorial card template (`ed-card` / `ed-grid-3`), the same CTA pattern
// (Nominate · Explore Existing Nominees · Explore pathway →) and the same
// nominee data layer — the published `public_nominees` view, read through
// `useFamilyFeaturedProfiles`, strictly scoped per recognition family.
//
// Nothing is invented: a pathway with no eligible published record shows an
// honest empty state rather than a substituted profile from another family.

import { useState } from "react";
import { Link } from "react-router-dom";
import { RECOGNITION_FAMILIES, BRAND } from "@/config/brandHierarchy";
import { FamilyLivingGalleryStrip } from "./FamilyLivingGalleryStrip";
import { FamilyEnablerStrip } from "./FamilyEnablerStrip";

/**
 * Per-family CTA overrides.
 *
 * Most families are served by the generic `?family=` routes. Influencer
 * Education Impact is not: its real data model is three catalogue categories
 * (Music / Social Media / Sports), so both CTAs must point at the same
 * surfaces the /awards/influencer-education-impact slider uses, never at the
 * empty legacy "influencer-education-impact" family route.
 */
const FAMILY_CTA_OVERRIDES: Record<string, { nominate?: string; explore?: string }> = {
  "influencer-education-impact": {
    nominate: "/nominate?tier=influencer-2026",
    explore: "/awards/influencer-education-impact/nominees",
  },
};

export function RecognitionFamiliesSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-families-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Education Impact Certificates</div>
          <h2 id="ed-families-heading" className="ed-section-title">
            Meet Africa&apos;s Education Enablers
          </h2>
          <p className="ed-section-sub">
            <strong className="text-white">
              One Continental Mission. Six Recognition Pathways.
            </strong>
          </p>
          <p className="ed-section-sub">
            The {BRAND.flagship} is NESA-Africa&apos;s flagship lifetime recognition, supported by
            six Certificates of Recognition celebrating different forms of education-enabling
            impact.
          </p>
        </div>

        <div className="mb-3 text-center">
          <Link to="/recognition/certificates" className="ed-btn-ghost">
            Education Impact Certificates — one entry point
          </Link>
        </div>
        <p className="mb-10 text-center text-xs text-white/50">
          Enabler profiles are published as nominations are reviewed.
        </p>

        <FamilyLivingGalleryStrip />

        <div className="ed-grid-3">
          {RECOGNITION_FAMILIES.map((f) => {
            const cta = FAMILY_CTA_OVERRIDES[f.slug] ?? {};
            const exploreHref = cta.explore ?? `/nominees?family=${f.slug}`;
            return (
              <article key={f.slug} className="ed-card">
                <div className="ed-card-badge">Recognition Pathway</div>
                <h3>
                  <Link to={`/recognition/${f.slug}`} className="hover:underline">
                    {f.name}
                  </Link>
                </h3>
                <p>{f.lede}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    to={cta.nominate ?? `/nominate?family=${f.slug}`}
                    className="inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal transition-colors hover:bg-gold/90"
                  >
                    Nominate
                  </Link>
                  <Link
                    to={exploreHref}
                    className="inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
                  >
                    Explore Existing Nominees
                  </Link>

                  <Link
                    to={`/recognition/${f.slug}`}
                    className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    Explore {f.name} →
                  </Link>
                </div>

                <FamilyEnablerStrip
                  familySlug={f.slug}
                  familyName={f.name}
                  exploreHref={exploreHref}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RecognitionFamiliesSection;
