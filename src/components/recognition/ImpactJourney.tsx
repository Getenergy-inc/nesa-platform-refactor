// Recognition → Visibility → Partnerships → Funding → Educational Intervention → Legacy
// Shared 6-stage impact framework used across Home, About, Awards, and Impact Programs.

import { motion } from "framer-motion";
import {
  Award,
  Eye,
  Handshake,
  Coins,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface ImpactStage {
  label: string;
  description: string;
  Icon: LucideIcon;
}

export const IMPACT_STAGES: ImpactStage[] = [
  { label: "Recognition", description: "Identify and verify Africa's education changemakers.", Icon: Award },
  { label: "Visibility", description: "Amplify their stories across the continent and diaspora.", Icon: Eye },
  { label: "Partnerships", description: "Connect verified impact with institutions and allies.", Icon: Handshake },
  { label: "Funding", description: "Unlock sponsorship, grants, and AGC-backed support.", Icon: Coins },
  { label: "Educational Intervention", description: "Translate recognition into classrooms, programmes, and outcomes.", Icon: GraduationCap },
  { label: "Legacy", description: "Document a generational record of African education transformation.", Icon: Sparkles },
];

type Variant = "hero" | "section" | "compact";

interface Props {
  variant?: Variant;
  className?: string;
}

export function ImpactJourney({ variant = "section", className = "" }: Props) {
  const isCompact = variant === "compact";
  const isHero = variant === "hero";

  return (
    <section
      aria-label="NESA-Africa Recognition to Legacy framework"
      className={`relative w-full ${className}`}
    >
      {!isCompact && (
        <header className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            How recognition becomes impact
          </p>
          <h2
            className={`font-display ${
              isHero ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"
            } text-white`}
          >
            From Recognition to Legacy
          </h2>
          <p className="mt-3 text-sm text-white/70 md:text-base">
            Six stages turn verified excellence into measurable educational
            transformation across Africa and the diaspora.
          </p>
        </header>
      )}

      <ol
        className={`relative grid gap-4 ${
          isCompact
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6"
        }`}
      >
        {IMPACT_STAGES.map((stage, idx) => (
          <motion.li
            key={stage.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="group relative flex flex-col rounded-xl border border-gold/20 bg-black/40 p-4 backdrop-blur-sm transition-colors hover:border-gold/60"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/40">
                <stage.Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold/70">
                Step {idx + 1}
              </span>
            </div>
            <h3 className="font-display text-base text-white md:text-lg">
              {stage.label}
            </h3>
            {!isCompact && (
              <p className="mt-1 text-xs leading-relaxed text-white/65 md:text-sm">
                {stage.description}
              </p>
            )}
            {idx < IMPACT_STAGES.length - 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute right-[-12px] top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-gold/60 to-transparent lg:block"
              />
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export default ImpactJourney;
