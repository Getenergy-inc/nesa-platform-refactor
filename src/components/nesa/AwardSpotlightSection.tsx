// Pathways to Recognition — NESA Africa 2026
// Premium 4-card grid + Impact Wrap-Up + Regional Reach
// African-inspired, gold + deep green accents on charcoal

import { motion } from "framer-motion";
import {
  Crown,
  Building2,
  Megaphone,
  Globe2,
  School,
  ArrowRight,
  Sparkles,
  Heart,
  HandCoins,
  MapPin,
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
              Recognition Pathways
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Pathways to <span className="text-gold">Recognition</span>
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-7">
            From lifetime icons to corporate champions, digital voices, and global partners —
            celebrating those advancing{" "}
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
            <Link to="/categories">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2 px-7"
              >
                Explore Categories
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ════ 2. PATHWAY CARDS — 2x2 GRID ════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-14">
          {pathways.map((card, idx) => {
            const Icon = card.icon;
            const VisualIcon = card.visualIcon;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              >
                <Link to={card.href} className="group block h-full">
                  <article className="relative h-full overflow-hidden rounded-3xl ring-1 ring-gold/25 hover:ring-gold/70 shadow-[0_10px_50px_-15px_hsl(var(--gold)/0.25)] hover:shadow-[0_20px_60px_-15px_hsl(var(--gold)/0.5)] transition-all duration-500 hover:-translate-y-2 bg-charcoal">
                    {/* ───── Visual / Image area (top half) ───── */}
                    <div className="relative h-52 sm:h-64 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Brand tint overlays — keeps NESA charcoal/gold identity */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.visualGradient} mix-blend-multiply opacity-70`} />
                      <div className="absolute inset-0 bg-charcoal/25" />
                      <div className="text-gold absolute inset-0">
                        <PatternOverlay />
                      </div>

                      {/* Floating brand icon badge */}
                      <div className="absolute bottom-4 right-4 h-12 w-12 rounded-2xl bg-charcoal/70 backdrop-blur-md border border-gold/40 flex items-center justify-center shadow-lg">
                        <VisualIcon className="h-6 w-6 text-gold" strokeWidth={1.6} />
                      </div>

                      {/* Accent label */}
                      <div className="absolute top-4 left-4">
                        <span className="px-2.5 py-1 rounded-full bg-charcoal/70 backdrop-blur-md border border-gold/30 text-[10px] font-semibold text-gold uppercase tracking-wider">
                          {card.accentLabel}
                        </span>
                      </div>

                      {/* Bottom fade into content */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-charcoal to-transparent" />
                    </div>

                    {/* ───── Content (bottom half) ───── */}
                    <div className="relative p-6 sm:p-7">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-gold to-gold-dark shadow-lg shrink-0">
                          <Icon className="h-5 w-5 text-charcoal" strokeWidth={2} />
                        </div>
                        <span className="inline-block self-center px-2.5 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-[10px] font-bold uppercase tracking-widest">
                          {card.category}
                        </span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-gold transition-colors leading-tight">
                        {card.headline}
                      </h3>

                      <p className="text-gold font-semibold text-xs sm:text-sm mb-3 leading-snug">
                        {card.awardLine}
                      </p>

                      <p className="text-white/70 text-sm leading-relaxed mb-5">
                        {card.description}
                      </p>

                      <div className="inline-flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all">
                        {card.cta}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ════ 3. IMPACT WRAP-UP ════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-gold/30 shadow-[0_0_60px_-15px_hsl(var(--gold)/0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-charcoal to-charcoal" />
            <div className="absolute inset-0 bg-charcoal/40" />
            <div className="text-gold">
              <PatternOverlay />
            </div>

            <div className="pointer-events-none absolute right-0 top-0 opacity-10">
              <School className="h-72 w-72 text-gold" strokeWidth={1} />
            </div>

            <div className="relative p-6 sm:p-10 md:p-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 mb-4">
                  <Heart className="h-3.5 w-3.5 text-gold" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold">
                    Impact Wrap-Up
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  From Recognition to <span className="text-gold">Real Impact</span>
                </h3>
                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-7">
                  Through <span className="text-gold font-semibold">EduAid Africa</span> and{" "}
                  <span className="text-gold font-semibold">Rebuild My School Africa</span>, the
                  2026 season connects recognition to practical education intervention.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: School, label: "Special school grants support (2026–2027)" },
                    { icon: HandCoins, label: "Education infrastructure crowdfunding" },
                    { icon: Building2, label: "CSR for Education contributions" },
                    { icon: MapPin, label: "Regional school interventions across Africa" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-gold/20 backdrop-blur-sm hover:bg-white/10 hover:border-gold/40 transition-all"
                    >
                      <div className="h-9 w-9 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-gold" />
                      </div>
                      <span className="text-white/85 text-xs sm:text-sm font-medium">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/nominate?type=school">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-7 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.6)]"
                    >
                      Nominate a School
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/partners">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2 px-7"
                    >
                      Partner for Impact
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ════ 4. REGIONAL REACH ════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-gold/25 bg-gradient-to-br from-emerald-900/20 via-white/[0.02] to-charcoal backdrop-blur-sm p-6 sm:p-8 overflow-hidden"
        >
          <div className="text-gold">
            <PatternOverlay />
          </div>

          <div className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-6">
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gold to-gold-dark border border-gold/40 flex items-center justify-center shadow-lg">
                  <Globe2 className="h-6 w-6 text-charcoal" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-0.5">
                    Continental Coverage
                  </div>
                  <span className="font-display text-xl font-bold text-white">Regional Reach</span>
                </div>
              </div>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed flex-1">
                Nominations and voting are regionally driven across Africa, ensuring fair
                representation across regions and the diaspora.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "West Africa", color: "from-gold/30 to-gold/10" },
                { name: "East Africa", color: "from-emerald-700/40 to-emerald-900/20" },
                { name: "North Africa", color: "from-gold/25 to-orange-900/20" },
                { name: "Central Africa", color: "from-emerald-800/40 to-emerald-900/20" },
                { name: "Southern Africa", color: "from-gold/20 to-emerald-900/20" },
                { name: "Diaspora & Global Africa", color: "from-emerald-700/30 to-gold/15" },
              ].map((region) => (
                <div
                  key={region.name}
                  className={`group relative overflow-hidden rounded-2xl border border-gold/25 hover:border-gold/60 bg-gradient-to-br ${region.color} p-4 transition-all hover:-translate-y-0.5 cursor-default`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-gold shrink-0" />
                    <span className="text-white text-xs sm:text-sm font-semibold leading-tight">
                      {region.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AwardSpotlightSection;
