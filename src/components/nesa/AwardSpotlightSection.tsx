// Pathways to Recognition — NESA Africa 2026
// Premium 4-card grid + Impact Wrap-Up + Regional Reach
// African-inspired, gold + deep green accents on charcoal

import { motion } from "framer-motion";
import {
  Crown,
  Building2,
  Megaphone,
  Globe2,
  ArrowRight,
  Sparkles,
  Trophy,
  Users,
  Radio,
  Handshake,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import iconImg from "@/assets/pathways/icon.jpg";
import csrImg from "@/assets/pathways/csr.jpg";
import influencerImg from "@/assets/pathways/influencer.jpg";
import grantsImg from "@/assets/pathways/grants.jpg";

type Pathway = {
  id: string;
  icon: typeof Crown;
  visualIcon: typeof Trophy;
  category: string;
  headline: string;
  awardLine: string;
  description: string;
  href: string;
  cta: string;
  visualGradient: string;
  accentLabel: string;
  image: string;
  imageAlt: string;
};

const pathways: Pathway[] = [
  {
    id: "icon",
    icon: Crown,
    visualIcon: Trophy,
    category: "Lifetime Achievement",
    headline: "Who Will Be Crowned Africa Education Icon?",
    awardLine: "Africa Education Icon — Lifetime Achievement (2006–2026)",
    description:
      "Recognizing transformational leaders shaping education across Africa for over two decades.",
    href: "/awards/africa-education-icon",
    cta: "Discover the Icon Award",
    visualGradient:
      "from-gold/40 via-emerald-900/40 to-charcoal",
    accentLabel: "Legacy • 2006–2026",
    image: iconImg,
    imageAlt: "Africa Education Icon — distinguished laureate holding the gold Africa trophy",
  },
  {
    id: "csr",
    icon: Building2,
    visualIcon: Users,
    category: "Corporate Recognition",
    headline: "Who Will Emerge as Africa's Leading CSR for Education Company?",
    awardLine: "Top CSR for Education Company Across African Regions — 2026",
    description:
      "Celebrating organizations funding, supporting, and transforming education systems.",
    href: "/awards/csr-education",
    cta: "Explore CSR Recognition",
    visualGradient:
      "from-emerald-800/50 via-emerald-900/30 to-charcoal",
    accentLabel: "Corporate • Continental",
    image: csrImg,
    imageAlt: "CSR for Education — corporate leader mentoring an African student with a tablet",
  },
  {
    id: "influencer",
    icon: Megaphone,
    visualIcon: Radio,
    category: "Digital Voices",
    headline: "Who Are Africa's Top Education Influencers?",
    awardLine: "Social Media, Music, and Sports Voices Shaping Education — 2026",
    description:
      "Recognizing influential voices driving education awareness across the continent.",
    href: "/awards/influencer-education",
    cta: "See Influencer Categories",
    visualGradient:
      "from-gold/35 via-orange-900/30 to-charcoal",
    accentLabel: "Creators • Music • Sports",
    image: influencerImg,
    imageAlt: "Digital Voices — African creators, musicians and athletes shaping education",
  },
  {
    id: "grants",
    icon: Globe2,
    visualIcon: Handshake,
    category: "Global Partnerships",
    headline: "Which Global Grants Are Powering Education in Africa?",
    awardLine: "Bilateral, Multilateral, and International Education Support — 2026",
    description: "Honoring global partners investing in education across Africa.",
    href: "/awards/grants-global-support",
    cta: "View Global Support Awards",
    visualGradient:
      "from-emerald-900/50 via-gold/15 to-charcoal",
    accentLabel: "Global • Bilateral • Multilateral",
    image: grantsImg,
    imageAlt: "Global Partnerships — bilateral and multilateral leaders shaking hands before flags",
  },
];

// African Kente-inspired pattern overlay (SVG)
const PatternOverlay = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="kente" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kente)" />
  </svg>
);

import { usePathwayCards } from "@/hooks/usePathwayCards";

const pathwayDefaults = Object.fromEntries(pathways.map((p) => [p.id, p]));

export function AwardSpotlightSection() {
  const { cards: dbCards } = usePathwayCards();

  // Merge: DB rows (when active) override defaults; preserve static defaults for icons/fallbacks.
  const merged: Pathway[] = (() => {
    const byId: Record<string, Pathway> = { ...pathwayDefaults };
    for (const row of dbCards) {
      if (!row.is_active) {
        delete byId[row.id];
        continue;
      }
      const base = pathwayDefaults[row.id] ?? pathways[0];
      byId[row.id] = {
        ...base,
        id: row.id,
        category: row.category,
        headline: row.headline,
        awardLine: row.award_line,
        description: row.description,
        cta: row.cta,
        href: row.href,
        accentLabel: row.accent_label || base.accentLabel,
        visualGradient: row.visual_gradient || base.visualGradient,
        image: row.image_url || base.image,
        imageAlt: base.imageAlt,
      };
    }
    // Preserve order: prefer DB display_order, fallback to static order
    const order = dbCards.length
      ? dbCards.filter((r) => r.is_active && byId[r.id]).map((r) => r.id)
      : pathways.map((p) => p.id);
    const seen = new Set<string>();
    const ordered: Pathway[] = [];
    for (const id of order) {
      if (byId[id] && !seen.has(id)) {
        ordered.push(byId[id]);
        seen.add(id);
      }
    }
    // Append any remaining defaults not yet included
    for (const p of pathways) if (!seen.has(p.id) && byId[p.id]) ordered.push(byId[p.id]);
    return ordered;
  })();

  return (
    <section className="relative bg-charcoal py-16 sm:py-24 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-emerald-700/10 blur-3xl" />
      </div>

      <div className="container relative px-4 sm:px-6">
        {/* ════ 1. SECTION HEADER ════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-5">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs sm:text-sm font-semibold text-gold uppercase tracking-[0.2em]">
              Nominate & Vote
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Nominate and <span className="text-gold">Vote</span>
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-7">
            Celebrate Africa's education changemakers — from lifetime icons and corporate champions
            to digital voices and global partners advancing{" "}
            <span className="text-gold font-medium">Education for All</span> across Africa and the
            diaspora.
          </p>

          {/* Header CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/nominate">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-7 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.6)]"
              >
                Start a Nomination
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vote">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-gold/60 text-gold hover:bg-gold/10 rounded-full gap-2 px-7"
              >
                Vote for Nominees
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-white/80 hover:text-gold hover:bg-white/5 rounded-full gap-2 px-7"
              >
                Explore Categories
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ════ 2. PATHWAY CARDS — Compact GSR-style template ════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-14">
          {merged.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
              >
                <Link to={card.href} className="group block h-full">
                  <article className="relative h-full rounded-2xl bg-charcoal-light/30 ring-1 ring-gold/20 hover:ring-gold/60 hover:bg-charcoal-light/50 transition-all duration-300 p-5 sm:p-6">
                    {/* Compact header: icon + title + subtitle (GSR template) */}
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
                        <Icon className="w-7 h-7 text-charcoal" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight tracking-tight group-hover:text-gold transition-colors">
                          {card.headline}
                        </h3>
                        <p className="text-white/50 text-xs sm:text-sm mt-1">
                          {card.awardLine}
                        </p>
                      </div>
                    </div>

                    {/* Description + CTA */}
                    <p className="text-white/70 text-sm leading-relaxed mt-4">
                      {card.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-gold text-sm font-semibold mt-4 group-hover:gap-3 transition-all">
                      {card.cta}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AwardSpotlightSection;
