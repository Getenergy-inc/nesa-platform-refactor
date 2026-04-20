// Pathways to Recognition — NESA Africa 2026
// 2x2 premium feature grid + Impact wrap-up + Regional context

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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Spotlight = {
  id: string;
  icon: typeof Crown;
  eyebrow: string;
  headline: string;
  subheadline: string;
  description: string;
  href: string;
  cta: string;
  tone: "icon" | "csr" | "influencer" | "grants";
};

const cards: Spotlight[] = [
  {
    id: "icon",
    icon: Crown,
    eyebrow: "Lifetime Achievement",
    headline: "Who Will Be Crowned Africa Education Icon?",
    subheadline: "Africa Education Icon — Lifetime Achievement (2006–2026)",
    description:
      "Recognizing transformational leaders shaping education across Africa for over two decades.",
    href: "/awards/africa-education-icon",
    cta: "Discover the Icon Award",
    tone: "icon",
  },
  {
    id: "csr",
    icon: Building2,
    eyebrow: "Corporate Recognition",
    headline: "Who Will Emerge as Africa's Leading CSR for Education Company?",
    subheadline: "Top CSR for Education company across African regions — 2026",
    description:
      "Celebrating organizations funding, supporting, and transforming education systems.",
    href: "/awards/csr-education",
    cta: "Explore CSR Recognition",
    tone: "csr",
  },
  {
    id: "influencer",
    icon: Megaphone,
    eyebrow: "Digital Voices",
    headline: "Who Are Africa's Top Education Influencers?",
    subheadline: "Social media, music, and sports voices shaping education — 2026",
    description:
      "Recognizing influential voices driving education awareness across the continent.",
    href: "/awards/influencer-education",
    cta: "See Influencer Categories",
    tone: "influencer",
  },
  {
    id: "grants",
    icon: Globe2,
    eyebrow: "Global Partnerships",
    headline: "Which Global Grants Are Powering Education in Africa?",
    subheadline: "Bilateral, multilateral, and international education support — 2026",
    description: "Honoring global partners investing in education across Africa.",
    href: "/awards/grants-global-support",
    cta: "View Global Support Awards",
    tone: "grants",
  },
];

const toneStyles: Record<Spotlight["tone"], { gradient: string; ring: string; glow: string; iconBg: string }> = {
  icon: {
    gradient: "from-gold/40 via-gold/15 to-charcoal",
    ring: "ring-2 ring-gold/60 hover:ring-gold",
    glow: "shadow-[0_0_70px_-10px_hsl(var(--gold)/0.55)]",
    iconBg: "bg-gradient-to-br from-gold via-gold-dark to-gold/70",
  },
  csr: {
    gradient: "from-gold/20 via-charcoal to-charcoal",
    ring: "ring-1 ring-gold/25 hover:ring-gold/60",
    glow: "shadow-[0_0_45px_-15px_hsl(var(--gold)/0.35)]",
    iconBg: "bg-gradient-to-br from-gold to-gold-dark",
  },
  influencer: {
    gradient: "from-gold/25 via-gold/5 to-charcoal",
    ring: "ring-1 ring-gold/30 hover:ring-gold/70",
    glow: "shadow-[0_0_50px_-15px_hsl(var(--gold)/0.4)]",
    iconBg: "bg-gradient-to-br from-gold to-gold-dark",
  },
  grants: {
    gradient: "from-gold/15 via-charcoal to-charcoal",
    ring: "ring-1 ring-gold/25 hover:ring-gold/60",
    glow: "shadow-[0_0_45px_-15px_hsl(var(--gold)/0.3)]",
    iconBg: "bg-gradient-to-br from-gold to-gold-dark",
  },
};

export function AwardSpotlightSection() {
  return (
    <section className="relative bg-charcoal py-16 sm:py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="container relative px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-4">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
              NESA Africa 2026
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Pathways to <span className="text-gold">Recognition</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            From lifetime icons to corporate champions, digital voices, and global partners — celebrating those
            advancing <span className="text-gold font-medium">Education for All</span> across Africa and the diaspora.
          </p>
        </motion.div>

        {/* 2x2 GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const styles = toneStyles[card.tone];
            const isIcon = card.tone === "icon";

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              >
                <Link to={card.href} className="group block h-full">
                  <article
                    className={`relative h-full overflow-hidden rounded-3xl ${styles.ring} ${styles.glow} transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.01]`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient}`} />
                    <div className="absolute inset-0 bg-charcoal/65" />

                    <div className="pointer-events-none absolute -right-8 -top-8 opacity-[0.08] group-hover:opacity-[0.14] transition-opacity duration-500">
                      <Icon className={isIcon ? "h-72 w-72 text-gold" : "h-56 w-56 text-gold"} strokeWidth={1} />
                    </div>
                    {isIcon && (
                      <div className="pointer-events-none absolute -left-10 -bottom-10 opacity-[0.05]">
                        <Crown className="h-56 w-56 text-gold" strokeWidth={1} />
                      </div>
                    )}

                    <div className={`relative flex flex-col h-full ${isIcon ? "p-7 sm:p-10 min-h-[420px]" : "p-6 sm:p-8 min-h-[360px]"}`}>
                      <div className="mb-5">
                        <div
                          className={`inline-flex items-center justify-center rounded-2xl shadow-2xl ${styles.iconBg} ${
                            isIcon ? "h-20 w-20 sm:h-24 sm:w-24" : "h-14 w-14"
                          }`}
                        >
                          <Icon
                            className={`text-charcoal ${isIcon ? "h-11 w-11 sm:h-12 sm:w-12" : "h-7 w-7"}`}
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>

                      <span
                        className={`inline-block self-start px-2.5 py-1 rounded-full font-bold uppercase tracking-widest mb-3 ${
                          isIcon
                            ? "bg-gold text-charcoal text-[11px] sm:text-xs"
                            : "bg-gold/15 text-gold border border-gold/40 text-[10px]"
                        }`}
                      >
                        {card.eyebrow}
                      </span>

                      <h3
                        className={`font-display font-bold text-white mb-2 group-hover:text-gold transition-colors leading-tight ${
                          isIcon ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl"
                        }`}
                      >
                        {card.headline}
                      </h3>

                      <p
                        className={`text-gold font-semibold mb-3 leading-snug ${
                          isIcon ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                        }`}
                      >
                        {card.subheadline}
                      </p>

                      <p className={`text-white/70 leading-relaxed mb-6 flex-1 ${isIcon ? "text-sm sm:text-base" : "text-sm"}`}>
                        {card.description}
                      </p>

                      <div
                        className={`inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all ${
                          isIcon ? "text-gold text-base" : "text-gold text-sm"
                        }`}
                      >
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

        {/* From Recognition to Real Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-gold/30 shadow-[0_0_50px_-15px_hsl(var(--gold)/0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-charcoal to-charcoal" />
            <div className="absolute inset-0 bg-charcoal/50" />

            <div className="pointer-events-none absolute right-0 top-0 opacity-10">
              <School className="h-72 w-72 text-gold" strokeWidth={1} />
            </div>

            <div className="relative p-6 sm:p-10 md:p-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 mb-4">
                  <Heart className="h-3.5 w-3.5 text-gold" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold">
                    Impact Wrap-Up
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                  From Recognition to <span className="text-gold">Real Impact</span>
                </h3>
                <p className="text-white/75 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                  Through <span className="text-gold font-semibold">EduAid Africa</span> and{" "}
                  <span className="text-gold font-semibold">Rebuild My School Africa</span>, the 2026 season delivers:
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-7">
                  {[
                    { icon: School, label: "Special school grants support (2026–2027)" },
                    { icon: HandCoins, label: "Education infrastructure crowdfunding" },
                    { icon: Building2, label: "CSR for Education contributions" },
                    { icon: MapPin, label: "Regional school interventions across Africa" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-gold/20 backdrop-blur-sm"
                    >
                      <item.icon className="h-5 w-5 text-gold shrink-0" />
                      <span className="text-white/85 text-xs sm:text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/nominate?type=school">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2"
                    >
                      Nominate a School
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/partners">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
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

        {/* Regional Context */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-gold/20 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-7"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center">
                <Globe2 className="h-5 w-5 text-gold" />
              </div>
              <span className="font-display text-lg font-bold text-white">Regional Reach</span>
            </div>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed flex-1">
              Nominations and voting are regionally driven across Africa, ensuring fair representation across:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {[
              "West Africa",
              "East Africa",
              "North Africa",
              "Central Africa",
              "Southern Africa",
              "Diaspora & Global Africa",
            ].map((region) => (
              <span
                key={region}
                className="px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs sm:text-sm font-medium hover:bg-gold/20 transition-colors"
              >
                {region}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AwardSpotlightSection;
