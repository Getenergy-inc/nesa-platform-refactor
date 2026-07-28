import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  ShieldCheck,
  ClipboardList,
  Trophy,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Combined campaign + participation slider.
 * Mobile: horizontal snap-scroll with dots. Desktop: 3-card row.
 */

type Slide = {
  key: string;
  kicker: string;
  title: string;
  body: string;
  bullets?: string[];
  cta: { label: string; to: string; icon: React.ComponentType<{ className?: string }> };
  Icon: React.ComponentType<{ className?: string }>;
};

const slides: Slide[] = [
  {
    key: "why",
    kicker: "Step 1",
    title: "Why Nominate for 2026?",
    body:
      "NESA-Africa gives the public a platform to recognise, celebrate, and amplify the people and institutions advancing education across Africa — Africans in Africa, Africans in the diaspora, and Friends of Africa.",
    bullets: ["Recognise impact", "Independently verified", "Celebrate education"],
    cta: { label: "Start Nomination", to: "/nominate", icon: Trophy },
    Icon: Sparkles,
  },
  {
    key: "who",
    kicker: "Step 2",
    title: "Who Can Be Nominated?",
    body:
      "From classrooms to communities, education changemakers are everywhere. Nominate a Changemaker for 2026 now — every submission enters independent NRC verification.",
    bullets: [
      "A mentor or school founder",
      "An NGO leader or youth advocate",
      "A philanthropist / CSR leader",
      "A diaspora supporter / Friend of Africa",
    ],
    cta: { label: "Nominate a 2026 Changemaker", to: "/nominate", icon: Users },
    Icon: Users,
  },
  {
    key: "how",
    kicker: "Step 3",
    title: "How Recognition Works",
    body:
      "Nominate. Verify. Recognise. Every nominee is reviewed by the NRC, scored on the EDI Matrix, and judged by an independent jury — no public voting, no pay-to-win.",
    bullets: [
      "Submit a 2026 nominee",
      "Track verification and EDI scoring",
      "Explore recognition during the cycle",
    ],
    cta: { label: "View Award Categories", to: "/categories", icon: ClipboardList },
    Icon: ShieldCheck,
  },
];

export function CampaignParticipationSlider() {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const idx = Math.round(el.scrollLeft / w);
      setActive(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="bg-charcoal py-14 sm:py-20 border-t border-gold/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
          <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Campaign · Participation
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl text-white">
            Africa, Who Is Your Education Changemaker?
          </h2>
          <p className="mt-2 text-white/70 text-sm sm:text-base">
            Nominate. Verify. Celebrate Education Impact.
          </p>
        </div>

        {/* Mobile / tablet: snap slider. Desktop: 3-col row */}
        <div
          ref={scrollerRef}
          className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {slides.map((s, i) => {
            const CtaIcon = s.cta.icon;
            const SIcon = s.Icon;
            return (
              <motion.article
                key={s.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="snap-center shrink-0 w-[88%] sm:w-[70%] lg:w-auto rounded-2xl border border-gold/20 bg-gradient-to-b from-charcoal-light/60 to-charcoal/60 p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold/80">
                  <SIcon className="h-3.5 w-3.5" /> {s.kicker}
                </div>
                <h3 className="mt-3 font-display text-xl sm:text-2xl text-white leading-snug">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-white/75 leading-relaxed">{s.body}</p>
                {s.bullets && (
                  <ul className="mt-4 space-y-1.5">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-[13px] text-white/80"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to={s.cta.to}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal hover:brightness-110 transition self-start"
                >
                  <CtaIcon className="h-4 w-4" />
                  {s.cta.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Dots (mobile/tablet) */}
        <div className="mt-5 flex items-center justify-center gap-3 lg:hidden">
          <button
            aria-label="Previous"
            onClick={() => scrollTo(Math.max(0, active - 1))}
            className="p-1 text-white/60 hover:text-gold transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.key}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  active === i ? "w-6 bg-gold" : "w-2 bg-white/25"
                }`}
              />
            ))}
          </div>
          <button
            aria-label="Next"
            onClick={() => scrollTo(Math.min(slides.length - 1, active + 1))}
            className="p-1 text-white/60 hover:text-gold transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-white/40 lg:hidden">
          Swipe to explore
        </p>
      </div>
    </section>
  );
}

export default CampaignParticipationSlider;
