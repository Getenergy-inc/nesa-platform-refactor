// Pathways to Recognition — NESA Africa 2026
// Cinematic 4-card grid with embedded YouTube storytelling experiences.

import { motion } from "framer-motion";
import {
  Crown,
  Building2,
  Megaphone,
  Globe2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PathwayVideoCard, type PathwayVideoCardData } from "./PathwayVideoCard";
import { usePathwayCards } from "@/hooks/usePathwayCards";

const pathways: PathwayVideoCardData[] = [
  {
    id: "icon",
    icon: Crown,
    accentLabel: "Legacy • 2006–2026",
    category: "Lifetime Achievement",
    headline: "Who Will Be Crowned Africa Education Icon?",
    story:
      "For two decades, Africa's most transformative education leaders have shaped learning, expanded access, and redefined opportunity across the continent. The Africa Education Icon Award honours those whose legacy inspires generations to come.",
    videoId: "Hdu_qlFLfrQ",
    videoTitle: "The Icon Show — Africa Education Legends",
    posterAlt:
      "Africa Education Icon — distinguished laureate holding the gold Africa trophy",
    visualGradient: "from-gold/45 via-emerald-900/40 to-charcoal",
    primaryCta: { label: "Explore Icon Nominees", href: "/nominees/icon" },
    secondaryCta: { label: "Nominate an Education Legend", href: "/nominate?category=icon" },
    engagementCtaLabel: "Watch Legacy Stories",
  },
  {
    id: "csr",
    icon: Building2,
    accentLabel: "Corporate • Continental",
    category: "Corporate Recognition",
    headline: "Who Will Emerge as Africa's Leading CSR for Education Company?",
    story:
      "Across Africa, visionary organisations are funding innovation, building schools, empowering teachers, and investing in the next generation of learners. Corporate Recognition celebrates companies creating measurable, lasting education impact.",
    videoId: "DDREAU_bmRk",
    videoTitle: "Corporate Impact — Rebuilding Africa's Classrooms",
    posterAlt:
      "Corporate Recognition — leaders supporting African students with technology and scholarships",
    visualGradient: "from-emerald-800/55 via-emerald-900/30 to-charcoal",
    primaryCta: { label: "Explore Corporate Nominees", href: "/awards/csr-education" },
    secondaryCta: { label: "Partner With NESA Africa", href: "/partners" },
    engagementCtaLabel: "See Corporate Impact Stories",
  },
  {
    id: "influencer",
    icon: Megaphone,
    accentLabel: "Creators • Music • Sports",
    category: "Digital Voices",
    headline: "Who Are Africa's Top Education Influencers?",
    story:
      "From music and sports to digital storytelling and online advocacy, influential African voices are using culture, creativity, and community to inspire learning. Digital Voices recognises creators turning influence into impact.",
    videoId: "aP0SskrfioI",
    videoTitle: "Digital Voices — Creators Inspiring Africa's Classrooms",
    posterAlt:
      "Digital Voices — African creators, musicians and athletes shaping education",
    visualGradient: "from-gold/35 via-orange-900/35 to-charcoal",
    primaryCta: { label: "Explore Gold Nominees", href: "/nominees/gold" },
    secondaryCta: { label: "Vote for Influencers", href: "/vote" },
    engagementCtaLabel: "Watch Impact Stories",
  },
  {
    id: "grants",
    icon: Globe2,
    accentLabel: "Global • Bilateral • Multilateral",
    category: "Global Partnerships",
    headline: "Which Global Grants Are Powering Education in Africa?",
    story:
      "Global partnerships are expanding educational opportunity across Africa through funding, innovation, and long-term investment. This recognition honours the institutions and allies helping shape the future of African education.",
    videoId: "nQCXDX_X3rs",
    videoTitle: "Global Partnerships — Powering Africa's Education Future",
    posterAlt:
      "Global Partnerships — bilateral and multilateral leaders backing African education",
    visualGradient: "from-emerald-900/55 via-gold/15 to-charcoal",
    primaryCta: { label: "Explore Global Partners", href: "/awards/grants-global-support" },
    secondaryCta: { label: "Become a Strategic Partner", href: "/partners" },
    engagementCtaLabel: "View Partnership Impact",
  },
];

const pathwayDefaults = Object.fromEntries(pathways.map((p) => [p.id, p]));

export function AwardSpotlightSection() {
  const { cards: dbCards } = usePathwayCards();

  // Merge DB overrides (text/links) on top of cinematic defaults; keep videos + icons.
  const merged: PathwayVideoCardData[] = (() => {
    const byId: Record<string, PathwayVideoCardData> = { ...pathwayDefaults };
    for (const row of dbCards) {
      if (!row.is_active) {
        delete byId[row.id];
        continue;
      }
      const base = pathwayDefaults[row.id] ?? pathways[0];
      byId[row.id] = {
        ...base,
        id: row.id,
        category: row.category || base.category,
        headline: row.headline || base.headline,
        story: row.description || base.story,
        accentLabel: row.accent_label || base.accentLabel,
        visualGradient: row.visual_gradient || base.visualGradient,
        primaryCta: row.href
          ? { label: row.cta || base.primaryCta.label, href: row.href }
          : base.primaryCta,
      };
    }
    const order = dbCards.length
      ? dbCards.filter((r) => r.is_active && byId[r.id]).map((r) => r.id)
      : pathways.map((p) => p.id);
    const seen = new Set<string>();
    const ordered: PathwayVideoCardData[] = [];
    for (const id of order) {
      if (byId[id] && !seen.has(id)) {
        ordered.push(byId[id]);
        seen.add(id);
      }
    }
    for (const p of pathways) if (!seen.has(p.id) && byId[p.id]) ordered.push(byId[p.id]);
    return ordered;
  })();

  return (
    <section
      className="relative bg-charcoal py-16 sm:py-24 overflow-hidden"
      aria-labelledby="pathways-heading"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-emerald-700/10 blur-3xl" />
      </div>

      <div className="container relative px-4 sm:px-6">
        {/* Section header */}
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
          <h2
            id="pathways-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
          >
            Nominate and <span className="text-gold">Vote</span>
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-7">
            Celebrate Africa's education changemakers — from lifetime icons and corporate champions
            to digital voices and global partners advancing{" "}
            <span className="text-gold font-medium">Education for All</span> across Africa and the
            diaspora.
          </p>

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

        {/* Cinematic 2×2 video card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-4">
          {merged.map((card, idx) => (
            <PathwayVideoCard key={card.id} card={card} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AwardSpotlightSection;
