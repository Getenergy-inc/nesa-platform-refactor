// Homepage §11 Section 6 — "From Recognition to Impact".

import { Link } from "react-router-dom";
import { IMPACT_CHAIN } from "@/config/brandHierarchy";

export function RecognitionToImpactSection() {
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-impact-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Why recognition matters</div>
          <h2 id="ed-impact-heading" className="ed-section-title">
            From Recognition to Impact
          </h2>
          <p className="ed-section-sub">
            Recognition is the beginning of a chain that ends in classrooms.
          </p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none">
          {IMPACT_CHAIN.map((s, i) => (
            <li
              key={s.step}
              className="rounded-lg border border-gold/20 bg-white/[0.03] p-5"
            >
              <div className="ed-mono text-xs text-gold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 text-base text-white">{s.step}</h3>
              <p className="mt-1.5 text-sm text-white/65">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link to="/impact" className="ed-btn-ghost">
            See how recognition becomes intervention →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RecognitionToImpactSection;
