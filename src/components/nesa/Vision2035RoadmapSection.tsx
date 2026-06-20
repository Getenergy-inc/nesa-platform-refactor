/**
 * Vision2035RoadmapSection — homepage milestones from 2026 → 2035.
 * Detailed roadmap lives on /about/vision-2035.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const MILESTONES = [
  { year: "2026", label: "Recognition" },
  { year: "2027", label: "Regional Impact" },
  { year: "2028", label: "Education Funding" },
  { year: "2030", label: "Continental Chapters" },
  { year: "2032", label: "Research Network" },
  { year: "2035", label: "Education for All Ecosystem" },
];

export function Vision2035RoadmapSection() {
  return (
    <section className="py-14 md:py-20 bg-charcoal">
      <div className="container mx-auto px-4 text-center">
        <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
          Vision 2035
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2 mb-3">
          Building Africa's Education Future
        </h2>
        <p className="text-ivory/70 max-w-2xl mx-auto mb-10 text-sm md:text-base">
          A decade-long roadmap from recognition to a continental education ecosystem.
        </p>

        <ol className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-5xl mx-auto mb-8">
          {MILESTONES.map((m) => (
            <li
              key={m.year}
              className="rounded-xl border border-gold/20 bg-charcoal-light/40 p-4 text-left"
            >
              <div className="font-display text-2xl font-bold text-gold">{m.year}</div>
              <div className="text-ivory/85 text-sm mt-1">{m.label}</div>
            </li>
          ))}
        </ol>

        <Link
          to="/about/vision-2035"
          className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:underline"
        >
          Explore the full Vision 2035 roadmap <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default Vision2035RoadmapSection;
