import { EDX_WEIGHTS } from "@/config/awards/influencerImpact2026";

const PILLARS = [
  {
    key: "education",
    label: "Education Impact",
    weight: EDX_WEIGHTS.education,
    examples: {
      "Social Media": "Scholarships advocated, learners reached, content syllabus impact",
      Sports: "Schools supported, school feeding, scholarships, mentorship hours",
      Music: "Concert-funded school projects, lyric advocacy, scholarships",
    },
  },
  {
    key: "development",
    label: "Development Contribution",
    weight: EDX_WEIGHTS.development,
    examples: {
      "Social Media": "Communities reached, partnerships with NGOs / ministries",
      Sports: "Academies operated, infrastructure funded, teacher training",
      Music: "Foundations operated, education fundraising concerts, partnerships",
    },
  },
  {
    key: "excellence",
    label: "Excellence & Reach",
    weight: EDX_WEIGHTS.excellence,
    examples: {
      "Social Media": "Authentic engagement, multi-platform reach, sustained advocacy",
      Sports: "Professional excellence, continental recognition, mentorship reach",
      Music: "Cultural reach, awards, multi-genre / multi-region influence",
    },
  },
] as const;

export function EDXFrameworkPanel() {
  return (
    <section className="py-14 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[11px] font-semibold tracking-wider uppercase mb-3">
            EDX Scoring Framework
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            How nominees are <span className="text-primary">scored</span>
          </h2>
          <p className="text-white/65 text-sm md:text-base max-w-2xl mx-auto">
            A weighted three-pillar framework. Examples shown per category so
            nominees and verifiers know exactly what evidence is evaluated.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div
              key={p.key}
              className="rounded-2xl border border-gold/20 bg-charcoal/40 p-6"
            >
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-display text-lg font-bold text-white">
                  {p.label}
                </h3>
                <span className="text-gold font-display text-2xl font-bold">
                  {p.weight}%
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                {Object.entries(p.examples).map(([cat, ex]) => (
                  <div key={cat} className="border-l-2 border-gold/30 pl-2.5">
                    <p className="text-[10px] uppercase tracking-wider text-gold/80 font-semibold">
                      {cat}
                    </p>
                    <p className="text-white/70 leading-snug">{ex}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
