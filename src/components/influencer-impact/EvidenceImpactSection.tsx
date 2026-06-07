import { GraduationCap, School, Users, Sparkles, Megaphone, Laptop, Heart, BookOpen } from "lucide-react";
import { EVIDENCE_CATEGORIES } from "@/config/awards/influencerImpact2026";

const ICONS = [GraduationCap, School, Users, Sparkles, BookOpen, Megaphone, Laptop, Heart];

export function EvidenceImpactSection() {
  return (
    <section className="py-14 border-t border-white/5">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Influence Must Produce{" "}
            <span className="text-primary">Measurable Education Impact</span>
          </h2>
          <p className="text-white/65 text-sm md:text-base max-w-2xl mx-auto">
            Every nominee submits documented evidence across the categories
            below. Numbers and verifiable links — not popularity — determine
            recognition.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {EVIDENCE_CATEGORIES.map((cat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={cat}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-gold/30 transition-colors"
              >
                <Icon className="h-5 w-5 text-gold mb-2" />
                <p className="text-sm font-semibold text-white leading-snug">{cat}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
