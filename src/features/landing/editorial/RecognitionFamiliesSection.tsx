// Homepage §11 Section 3 — "Six Ways We Recognise Education Impact".
// Public-facing recognition families only; the full taxonomy stays one click
// deeper at /recognition/categories (progressive disclosure).

import { Link } from "react-router-dom";
import { RECOGNITION_FAMILIES } from "@/config/brandHierarchy";

export function RecognitionFamiliesSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-families-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Education Impact Certificates</div>
          <h2 id="ed-families-heading" className="ed-section-title">
            Six Ways We Recognise Education Impact
          </h2>
          <p className="ed-section-sub">
            Six recognition families under one umbrella programme — The African Blue-Garnet
            Awards for Education.
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
              <div className="ed-card-cta">
                <Link to={`/recognition/${f.slug}`} className="ed-link-inline">
                  Explore Recognition →
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
