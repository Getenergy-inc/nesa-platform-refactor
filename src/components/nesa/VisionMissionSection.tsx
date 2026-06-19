// Vision & Mission — NESA-Africa institutional identity.
// Charcoal/Gold tokens, no custom CSS, no inline styles.
import { Target, Compass } from "lucide-react";

export function VisionMissionSection() {
  return (
    <section id="vision-mission" className="bg-charcoal py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-gold text-sm font-medium mb-2 uppercase tracking-wide">
            Who We Are
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Vision & Mission
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
            NESA-Africa is the continental recognition and impact platform of the
            Santos Creations Educational Foundation (SCEF), advancing Education
            For All across Africa and the diaspora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Vision */}
          <div className="rounded-2xl border border-gold/25 bg-charcoal-light p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gold/15 text-gold">
                <Compass className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                Our Vision
              </h3>
            </div>
            <p className="text-white/80 leading-relaxed">
              An Africa where every learner — child, youth and adult — has equitable
              access to quality, relevant and dignified education, and where the
              changemakers driving that transformation are recognised, supported
              and connected across borders.
            </p>
          </div>

          {/* Mission */}
          <div className="rounded-2xl border border-gold/25 bg-charcoal-light p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gold/15 text-gold">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                Our Mission
              </h3>
            </div>
            <p className="text-white/80 leading-relaxed">
              To advocate and achieve Education For All in Africa by identifying,
              honouring and amplifying education changemakers; mobilising public
              participation through transparent recognition; and channelling
              recognition into measurable legacy impact — schools rebuilt,
              learners supported, communities transformed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
