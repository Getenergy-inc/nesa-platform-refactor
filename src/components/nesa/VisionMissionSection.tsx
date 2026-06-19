// Vision, Mission & Purpose — NESA-Africa institutional identity.
// Charcoal/Gold tokens, no custom CSS, no inline styles.
import { Compass, Target, Sparkles } from "lucide-react";

export function VisionMissionSection() {
  return (
    <section id="vision-mission" className="bg-charcoal py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-gold text-sm font-medium mb-2 uppercase tracking-wide">
            Who We Are
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Our Vision, Mission &amp; Purpose
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Vision */}
          <div className="rounded-2xl border border-gold/25 bg-charcoal-light p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gold/15 text-gold">
                <Compass className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-bold text-white">Vision</h3>
            </div>
            <p className="text-white/80 leading-relaxed">
              To become Africa's most trusted and influential education
              recognition, impact, media, volunteer, and legacy ecosystem by 2035.
            </p>
          </div>

          {/* Mission */}
          <div className="rounded-2xl border border-gold/25 bg-charcoal-light p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gold/15 text-gold">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-bold text-white">Mission</h3>
            </div>
            <p className="text-white/80 leading-relaxed">
              To identify, celebrate, document, connect, support, and amplify
              education changemakers while converting recognition into measurable,
              on-the-ground educational impact across Africa.
            </p>
          </div>

          {/* Core Purpose */}
          <div className="rounded-2xl border border-gold/40 bg-gold/5 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gold/20 text-gold">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-bold text-white">Core Purpose</h3>
            </div>
            <p className="text-white/85 leading-relaxed font-medium">
              Recognition without impact is incomplete. We turn honour into
              lasting change.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
