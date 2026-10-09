// Landing-page Sponsorship preview — short gateway card (no pricing).
// Full pricing/details live at /sponsorship-packages, /sponsor, /sponsor/:slug.
import { Link } from "react-router-dom";
import { Handshake, Sparkles, Layers, ShieldCheck } from "lucide-react";

const BADGES = [
  "Award Sponsorship",
  "Gala Sponsorship",
  "NESA TV",
  "EduAid-Africa",
  "RMSA Legacy Fund",
];

export function SponsorPreviewSection() {
  return (
    <section
      aria-labelledby="sponsor-preview-heading"
      className="py-12 md:py-16 bg-charcoal"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-charcoal-light/60 to-charcoal p-6 md:p-10 shadow-gold/10 shadow-xl">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.18em] mb-3 text-center md:text-left">
            Partnership Opportunities
          </p>
          <h2
            id="sponsor-preview-heading"
            className="font-display text-2xl md:text-3xl text-white leading-tight mb-4 text-center md:text-left"
          >
            Sponsor NESA-Africa 2026
          </h2>
          <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 text-center md:text-left">
            Connect your brand to Africa's education recognition, media visibility,
            and post-award legacy impact. Sponsorship opportunities are available
            across award categories, the Blue Garnet Awards Gala, NESA-Africa TV,
            EduAid-Africa, and Rebuild My School Africa.
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

          <div className="grid gap-3 sm:grid-cols-3 mb-5">
            <Link
              to="/sponsorship-packages"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-charcoal font-semibold text-sm px-4 py-3 hover:bg-gold-dark transition-colors"
            >
              <Layers className="h-4 w-4" aria-hidden="true" />
              View Sponsorship Packages
            </Link>
            <Link
              to="/sponsor"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 text-gold font-semibold text-sm px-4 py-3 hover:bg-gold/10 transition-colors"
            >
              <Handshake className="h-4 w-4" aria-hidden="true" />
              Become a Sponsor
            </Link>
            <Link
              to="/sponsor/award-categories"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 text-gold font-semibold text-sm px-4 py-3 hover:bg-gold/10 transition-colors"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Sponsor a Category
            </Link>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-gold/15 bg-charcoal/60 px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-[12px] md:text-xs text-white/70 leading-relaxed">
              Sponsorship and partnership do not influence nominations, voting,
              judging, finalist selection, honourees, winners, or school
              intervention outcomes.{" "}
              <Link to="/sponsor/governance" className="text-gold hover:underline font-semibold">
                Read the full integrity policy →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SponsorPreviewSection;
