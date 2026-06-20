/**
 * WhyNESAExistsSection — concise mission framing: recognition → impact pipeline.
 * Replaces long EDI/governance text on the homepage.
 */
import { Award, Eye, Handshake, Coins, Wrench, Sparkles } from "lucide-react";

const STEPS = [
  { icon: Award, label: "Recognition" },
  { icon: Eye, label: "Visibility" },
  { icon: Handshake, label: "Partnerships" },
  { icon: Coins, label: "Funding" },
  { icon: Wrench, label: "Intervention" },
  { icon: Sparkles, label: "Legacy" },
];

export function WhyNESAExistsSection() {
  return (
    <section className="py-14 md:py-20 bg-charcoal border-t border-gold/10">
      <div className="container mx-auto px-4 text-center">
        <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
          Why NESA-Africa Exists
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2 mb-4">
          Recognition Without Impact Is Incomplete
        </h2>
        <p className="text-ivory/70 max-w-2xl mx-auto mb-10 text-sm md:text-base">
          NESA-Africa transforms recognition into measurable educational
          outcomes across the continent.
        </p>

        <ol className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {STEPS.map((s, i) => (
            <li
              key={s.label}
              className="relative rounded-xl border border-gold/20 bg-charcoal-light/40 p-4 flex flex-col items-center gap-2"
            >
              <span className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-gold text-charcoal text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <s.icon className="h-6 w-6 text-gold" />
              <span className="text-ivory text-sm font-semibold">{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default WhyNESAExistsSection;
