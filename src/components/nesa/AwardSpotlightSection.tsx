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
      "Two decades of visionary leaders who reshaped learning, expanded access, and rewrote what is possible for African education. This is the lifetime stage.",
    videoTitle: "Legacy Stories — The Africa Education Icon",
    posterAlt: "Africa Education Icon — cinematic legacy storytelling",
    visualGradient: "from-gold/45 via-emerald-900/40 to-charcoal",
    actionWords: [
      "Legacy", "Impact", "Transformation", "Education for All",
      "Leadership", "Generational Change", "Vision", "Empowerment",
      "Excellence", "Opportunity", "Future Builders", "Lifelong Contribution",
    ],
    animatedPhrases: [
      "Transforming Education Across Africa",
      "Celebrating Lifelong Impact",
      "Honouring Visionary Leaders",
      "Building Africa's Learning Future",
    ],
    previewSummary:
      "Watch how Africa's education leaders transformed generations across two decades.",
    primaryCta: { label: "Explore Icon Nominees", href: "/nominees/icon" },
    secondaryCta: { label: "Nominate a Legend", href: "/nominate?category=icon" },
    engagementCtaLabel: "Watch Story Preview",
  },
  {
    id: "csr",
    icon: Building2,
    accentLabel: "Corporate • Continental",
    category: "Corporate Recognition",
    headline: "Which Companies Are Rebuilding Africa's Classrooms?",
    story:
      "From scholarships and infrastructure to technology and teacher empowerment — meet the corporations turning capital into measurable, lasting learning impact.",
    videoTitle: "Corporate Impact — Funding the Future",
    posterAlt: "Corporate Recognition — cinematic CSR storytelling",
    visualGradient: "from-emerald-800/55 via-emerald-900/30 to-charcoal",
    actionWords: [
      "Innovation", "Infrastructure", "Scholarships", "Inclusion",
      "CSR Impact", "Technology", "Access", "Partnership",
      "Opportunity", "Sustainability",
    ],
    animatedPhrases: [
      "Funding Educational Transformation",
      "Investing in Future Generations",
      "Empowering African Learners",
      "Corporate Impact Across Africa",
    ],
    previewSummary:
      "Discover the corporate champions powering Africa's next learning revolution.",
    primaryCta: { label: "Explore Corporate Nominees", href: "/awards/csr-education" },
    secondaryCta: { label: "Become a Partner", href: "/partners" },
    engagementCtaLabel: "View Impact Story",
  },
  {
    id: "influencer",
    icon: Megaphone,
    accentLabel: "Creators • Music • Sports",
    category: "Digital Voices",
    headline: "Whose Voice Is Moving Africa's Classrooms?",
    story:
      "Musicians, athletes, creators, and digital storytellers turning cultural influence into measurable advocacy for learning and youth empowerment.",
    videoTitle: "Digital Voices — Influence Into Impact",
    posterAlt: "Digital Voices — cinematic creator storytelling",
    visualGradient: "from-gold/35 via-orange-900/35 to-charcoal",
    actionWords: [
      "Influence", "Advocacy", "Creativity", "Awareness",
      "Youth Power", "Social Impact", "Music", "Sports",
      "Culture", "Inspiration",
    ],
    animatedPhrases: [
      "Turning Influence Into Impact",
      "Voices Shaping Education",
      "Culture Driving Change",
      "Creators Empowering Africa",
    ],
    previewSummary:
      "Meet the cultural voices using reach to rewrite Africa's learning narrative.",
    primaryCta: { label: "Explore Gold Nominees", href: "/nominees/gold" },
    secondaryCta: { label: "Vote Now", href: "/vote" },
    engagementCtaLabel: "Explore the Journey",
  },
  {
    id: "grants",
    icon: Globe2,
    accentLabel: "Global • Bilateral • Multilateral",
    category: "Global Partnerships",
    headline: "Which Global Allies Power Africa's Education Future?",
    story:
      "Bilateral grants, multilateral institutions, and global foundations expanding opportunity, innovation, and long-term investment across the continent.",
    videoTitle: "Global Partnerships — Powering Africa's Future",
    posterAlt: "Global Partnerships — cinematic alliance storytelling",
    visualGradient: "from-emerald-900/55 via-gold/15 to-charcoal",
    actionWords: [
      "Collaboration", "Grants", "Diplomacy", "Development",
      "Global Impact", "SDGs", "Partnership", "International Support",
      "Opportunity", "Innovation",
    ],
    animatedPhrases: [
      "Global Support for African Education",
      "Partnerships Creating Opportunity",
      "Investing in Africa's Future",
      "International Collaboration for Learning",
    ],
    previewSummary:
      "Inside the global alliances expanding African education at continental scale.",
    primaryCta: { label: "Explore Global Partners", href: "/awards/grants-global-support" },
    secondaryCta: { label: "Become a Strategic Partner", href: "/partners" },
    engagementCtaLabel: "Watch Partnership Story",
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
