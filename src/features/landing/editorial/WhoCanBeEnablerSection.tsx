// Homepage §11 Section 4 — "Who Can Be an Education Enabler?"

import { Link } from "react-router-dom";
import { ENABLER_AUDIENCES, EDUCATION_ENABLER_DEFINITION } from "@/config/brandHierarchy";

export function WhoCanBeEnablerSection() {
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-enabler-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">The master vocabulary</div>
          <h2 id="ed-enabler-heading" className="ed-section-title">
            Who Can Be an Education Enabler?
          </h2>
          <p className="ed-section-sub">{EDUCATION_ENABLER_DEFINITION}</p>
        </div>

        <ul className="flex flex-wrap justify-center gap-2.5 list-none">
          {ENABLER_AUDIENCES.map((a) => (
            <li key={a} className="ed-stat-pill">
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/nominate" className="ed-btn-primary">
            Nominate an Education Enabler
          </Link>
          <Link to="/nominate/help-me-choose" className="ed-btn-ghost">
            Not sure which recognition applies? →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WhoCanBeEnablerSection;
