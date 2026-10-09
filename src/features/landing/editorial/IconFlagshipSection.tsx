// Homepage — Africa Education Icon flagship band.
// Names and eligible communities are sourced from brandHierarchy.ts, never
// retyped in prose, to prevent naming drift.

import { Link } from "react-router-dom";
import { Crown } from "lucide-react";
import {
  BRAND,
  RECOGNITION_COMMUNITIES,
  ICON_NO_PUBLIC_VOTING_NOTE,
} from "@/config/brandHierarchy";

export function IconFlagshipSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-icon-flagship-heading">
      <div className="ed-wrap">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gold/35 bg-gradient-to-b from-gold/[0.09] to-transparent px-6 py-10 text-center sm:px-10">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <Crown className="h-4 w-4" aria-hidden="true" />
            Flagship Recognition
          </p>
          <h2 id="ed-icon-flagship-heading" className="ed-section-title mt-3">
            {BRAND.flagship}
          </h2>
          <p className="mt-1 font-serif text-lg text-white/85">
            Africa&apos;s Flagship Lifetime Education Honour
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            Honouring exceptional individuals whose lifelong contribution has helped advance
            Education for All across Africa.
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Eligible communities">
            {RECOGNITION_COMMUNITIES.map((c) => (
              <li key={c.slug} className="ed-stat-pill">
                {c.name}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/nominees/africa-education-icon-award" className="ed-btn-primary">
              Explore Africa Education Icons →
            </Link>
            <Link to="/nominate" className="ed-btn-ghost">
              Nominate an Education Enabler →
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/50">{ICON_NO_PUBLIC_VOTING_NOTE}</p>
        </div>
      </div>
    </section>
  );
}

export default IconFlagshipSection;
