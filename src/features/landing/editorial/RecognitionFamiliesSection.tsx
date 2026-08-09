// Homepage §11 Section 3 — "Six Ways We Recognise Education Impact".
// Public-facing recognition families only; the full taxonomy stays one click
// deeper at /recognition/categories (progressive disclosure).

import { Link } from "react-router-dom";
import { RECOGNITION_FAMILIES, BRAND } from "@/config/brandHierarchy";

export function RecognitionFamiliesSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-families-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Education Impact Certificates</div>
          <h2 id="ed-families-heading" className="ed-section-title">
            One Continental Mission. Six Recognition Pathways.
          </h2>
          <p className="ed-section-sub">
            The {BRAND.flagship} is NESA-Africa&apos;s flagship lifetime recognition, supported by
            six Certificates of Recognition celebrating different forms of education-enabling
            impact.
          </p>
        </div>


        <div className="ed-grid-3">
          {RECOGNITION_FAMILIES.map((f) => (
            <article key={f.slug} className="ed-card">
              <h3>
                <Link to={`/recognition/${f.slug}`} className="hover:underline">
                  {f.name}
                </Link>
              </h3>
              <p>{f.lede}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  Explore {f.name} →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/recognition/certificates" className="ed-btn-ghost">
            Education Impact Certificates — one entry point
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RecognitionFamiliesSection;
