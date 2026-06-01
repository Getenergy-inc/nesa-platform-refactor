// Landing-page Impact preview — short gateway card.
// Full content lives at /impact, /impact/regional-school-intervention,
// /eduaid-africa, /eduaid-africa/rebuild-my-school.
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, GraduationCap, Building2 } from "lucide-react";

const BADGES = [
  "Special Needs Schools",
  "Regional Voting",
  "GFA Wzip Wallets",
  "Rebuild My School Africa 2027",
];

export function ImpactPreviewSection() {
  return (
    <section
      aria-labelledby="impact-preview-heading"
      className="py-12 md:py-16 bg-charcoal"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-charcoal-light/60 to-charcoal p-6 md:p-10 shadow-gold/10 shadow-xl">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.18em] mb-3 text-center md:text-left">
            From Recognition to Impact
          </p>
          <h2
            id="impact-preview-heading"
            className="font-display text-2xl md:text-3xl text-white leading-tight mb-4 text-center md:text-left"
          >
            From Recognition to Regional School Intervention
          </h2>
          <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 text-center md:text-left">
            NESA-Africa 2026 connects award recognition to practical education impact
            through <span className="text-gold font-semibold">EduAid-Africa</span> and{" "}
            <span className="text-gold font-semibold">Rebuild My School Africa</span>.
            From October 2026 to October 2027, Special Needs School nominations,
            regional voting, GFA Wzip funding portals, and selected school
            interventions will support inclusive education across the 8 approved
            African regions.
          </p>

          <ul className="flex flex-wrap gap-2 mb-7 justify-center md:justify-start">
            {BADGES.map((b) => (
              <li
                key={b}
                className="text-[11px] md:text-xs px-2.5 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold/90"
              >
                {b}
              </li>
            ))}
          </ul>

          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              to="/impact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-charcoal font-semibold text-sm px-4 py-3 hover:bg-gold-dark transition-colors"
            >
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              View Impact Pathway
            </Link>
            <Link
              to="/impact/regional-school-intervention"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 text-gold font-semibold text-sm px-4 py-3 hover:bg-gold/10 transition-colors"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Regional Intervention Map
            </Link>
            <Link
              to="/eduaid-africa"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 text-gold font-semibold text-sm px-4 py-3 hover:bg-gold/10 transition-colors"
            >
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Learn About EduAid-Africa
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImpactPreviewSection;
