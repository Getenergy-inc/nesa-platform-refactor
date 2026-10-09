import { FileCheck, Sparkles } from "lucide-react";
import { InfluencerNominationForm } from "./InfluencerNominationForm";

/**
 * Dedicated nomination section for the Influencer Education Impact Award 2026.
 * Matches the Africa Education Icon nomination surface: gold-on-charcoal card,
 * two-column grid on desktop, single column on mobile, gold CTA, trust messaging.
 */
export function InfluencerNominationSection() {
  return (
    <section
      id="nominate-influencer"
      className="py-12 md:py-16 bg-charcoal border-y border-gold/20"
    >
      <div className="container mx-auto max-w-5xl px-4">
        {/* Hero */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold mb-3">
            <FileCheck className="h-3.5 w-3.5" />
            Nomination Form
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-gold mb-3 leading-tight">
            Nominate for Influencer Education Impact Award 2026
          </h2>
          <p className="text-foreground/75 text-sm sm:text-base max-w-3xl leading-relaxed">
            Use the native intake form below to submit your nomination. Select the most
            appropriate <span className="text-gold">Primary Medium of Influence</span>. Every
            submission is independently reviewed by the Nominee Research Corps (NRC) before
            progressing to verification, public recognition, certificate approval and
            publication.
          </p>
        </div>

        {/* Recognition philosophy */}
        <div className="mb-6 rounded-2xl border border-gold/25 bg-charcoal-light/50 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/40">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-gold/80 font-semibold">
                Education Influence Framework
              </p>
              <h3 className="font-playfair text-xl md:text-2xl text-white leading-tight">
                Recognition Philosophy
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                The Influencer Education Impact Award recognises African public figures who
                intentionally use their influence, platforms, talents and public visibility to
                enable Education for All across Africa and the African Diaspora.
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Recognition is based on{" "}
                <span className="text-gold">verified education impact</span> — not popularity,
                celebrity status, media visibility or follower count. NESA-Africa recognises
                individuals whose influence creates measurable educational outcomes through
                scholarships, mentorship, school support, digital learning, advocacy and
                community transformation.
              </p>
            </div>
          </div>
        </div>

        <InfluencerNominationForm />
      </div>
    </section>
  );
}

export default InfluencerNominationSection;
