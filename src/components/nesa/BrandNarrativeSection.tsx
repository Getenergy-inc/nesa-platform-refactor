import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Slim, scrolling intro banner for the landing page.
 * Full ecosystem content lives on /ecosystem.
 */
const slides = [
  {
    eyebrow: "What NESA-Africa Represents",
    title: "More Than an Award — A Continental Changemaker Movement",
    body:
      "NESA-Africa is not just an award platform. It is a continental movement recognising changemakers, institutions, and organisations advancing education across Africa and the diaspora.",
  },
  {
    eyebrow: "Public Recognition • Continental Visibility",
    title: "Celebrating Every Form of Education Impact",
    body:
      "Advocacy, innovation, funding, infrastructure, mentorship, technology, policy, community action, and social impact — every meaningful contribution to African education deserves visibility and public recognition.",
  },
  {
    eyebrow: "Africans • Diaspora • Friends of Africa",
    title: "One Continent. One Changemaker Movement.",
    body:
      "Whether they are Africans in Africa, Africans in the diaspora, or Friends of Africa supporting education development, their contributions deserve celebration, independent verification, and pan-African storytelling.",
  },
];

export function BrandNarrativeSection() {
  return (
    <section className="relative py-16 md:py-20 bg-charcoal overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container relative z-10">
        {/* Horizontal scrolling marquee carousel */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
            {[...slides, ...slides].map((slide, idx) => (
              <motion.article
                key={idx}
                className="shrink-0 w-[88vw] sm:w-[520px] md:w-[640px] rounded-3xl border border-gold/20 bg-charcoal-light/40 backdrop-blur-sm p-7 md:p-9"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-[10px] font-semibold tracking-widest uppercase mb-4">
                  <Sparkles className="h-3 w-3" />
                  {slide.eyebrow}
                </span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-3 leading-snug">
                  {slide.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">{slide.body}</p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/ecosystem">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold hover:bg-gold-dark text-charcoal text-sm font-bold transition-colors">
              Explore the Ecosystem
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link to="/movement">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/50 text-gold hover:bg-gold/10 text-sm font-semibold transition-colors">
              Be Part of the Movement
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

export default BrandNarrativeSection;
