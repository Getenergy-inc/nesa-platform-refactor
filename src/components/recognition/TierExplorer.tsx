// Awards Tier Explorer — progressive 4-tier hub.
// Renders the canonical 4 Recognition Pathways as expandable cards that
// progressively reveal their categories on hover/focus/tap.

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Trophy, Star, Medal, Sparkles } from "lucide-react";
import {
  RECOGNITION_PATHWAYS,
  getCategoriesByPathway,
  type PathwaySlug,
} from "@/config/recognitionArchitecture";
import { trackPathwayView } from "@/lib/analytics";

const ICONS: Record<PathwaySlug, typeof Trophy> = {
  "africa-education-icon": Star,
  "blue-garnet": Trophy,
  "platinum-recognition": Medal,
  "influencers-education-impact": Sparkles,
};

interface Props {
  className?: string;
}

export function TierExplorer({ className = "" }: Props) {
  const [active, setActive] = useState<PathwaySlug | null>(null);

  return (
    <section
      aria-label="Recognition Pathways"
      className={`relative w-full ${className}`}
    >
      <header className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Four Recognition Pathways
        </p>
        <h2 className="font-display text-3xl text-white md:text-4xl">
          Choose a pathway to explore
        </h2>
        <p className="mt-3 text-sm text-white/70 md:text-base">
          18 award categories · ~100 recognition subcategories · 10 education
          regions. Discover progressively — never all at once.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {RECOGNITION_PATHWAYS.map((p) => {
          const Icon = ICONS[p.slug];
          const cats = getCategoriesByPathway(p.slug);
          const isActive = active === p.slug;
          return (
            <motion.article
              key={p.slug}
              layout
              onMouseEnter={() => setActive(p.slug)}
              onMouseLeave={() => setActive((cur) => (cur === p.slug ? null : cur))}
              onFocus={() => setActive(p.slug)}
              className={`group relative overflow-hidden rounded-2xl border bg-black/60 p-5 transition-colors md:p-6 ${
                isActive ? "border-gold/70" : "border-gold/20 hover:border-gold/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/40">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/70">
                  Tier {p.tierNumber}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl text-white md:text-2xl">
                {p.name}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gold/80">
                {p.subtitle}
              </p>
              <p className="mt-3 text-sm text-white/70">{p.oneLiner}</p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                {p.voteMechanicLabel}
              </p>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 space-y-1 border-t border-gold/15 pt-3"
                  >
                    {cats.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to={`/awards/explore/${p.slug}/${c.slug}`}
                          onClick={() =>
                            trackPathwayView(p.slug, { category: c.slug })
                          }
                          className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-white/80 hover:bg-gold/10 hover:text-gold"
                        >
                          <span className="truncate">{c.name}</span>
                          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 opacity-60" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              <div className="mt-5 flex items-center gap-3">
                <Link
                  to={`/awards/explore/${p.slug}`}
                  onClick={() => trackPathwayView(p.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-charcoal hover:bg-gold/90"
                >
                  Explore pathway
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <Link
                  to={p.href}
                  className="text-sm font-medium text-white/70 underline-offset-4 hover:text-gold hover:underline"
                >
                  Premium page
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default TierExplorer;
