// Homepage — closing Icon band. Gala date comes from the canonical
// programme config via ICON_CLOSING_SECTION.

import { Link } from "react-router-dom";
import { ICON_CLOSING_SECTION, ICON_AWARD_SECTION } from "@/config/brandHierarchy";

export function IconClosingSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-icon-closing-heading">
      <div className="ed-wrap">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gold/35 bg-gradient-to-b from-gold/[0.09] to-transparent px-6 py-10 text-center sm:px-10">
          <h2 id="ed-icon-closing-heading" className="ed-section-title">
            {ICON_CLOSING_SECTION.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            {ICON_CLOSING_SECTION.body}
          </p>

          <div className="mt-6 space-y-1">
            {ICON_CLOSING_SECTION.lines.map((line, i) => (
              <p
                key={line}
                className={
                  i === 0
                    ? "font-serif text-lg text-gold"
                    : "text-sm text-white/70"
                }
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/nominees/africa-education-icon-award" className="ed-btn-ghost">
              Explore Existing Icon Nominees →
            </Link>
            <Link to={ICON_AWARD_SECTION.nominateHref} className="ed-btn-primary">
              Nominate an Education Icon →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IconClosingSection;
