// Award Spotlight Section — Premium 2026 feature blocks
// 4 prestige award category banners + Impact wrap-up

import { motion } from "framer-motion";
import { Crown, Building2, Megaphone, Globe2, School, ArrowRight, Sparkles, Heart, HandCoins } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Spotlight = {
  id: string;
  icon: typeof Crown;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  cta: string;
  variant: "icon" | "csr" | "influencer" | "grants";
};

const spotlights: Spotlight[] = [
  {
    id: "icon",
    icon: Crown,
    eyebrow: "Primary Brand Pillar",
    title: "Who Will Be Crowned Africa Education Icon?",
    subtitle: "Africa Education Icon — Lifetime Achievement (2006–2026)",
    description:
      "Recognizing transformational leaders who have shaped and advanced education across Africa over the past two decades.",
    href: "/awards/africa-education-icon",
    cta: "Discover the Icon Award",
    variant: "icon",
  },
  {
    id: "csr",
    icon: Building2,
    eyebrow: "Corporate Recognition",
    title: "Who Will Emerge as the Best CSR for Education Company in Africa?",
    subtitle: "Recognizing the top CSR for Education company from each African region in 2026",
    description:
      "Celebrating corporate leadership, education investment, and meaningful support for learning systems across Africa.",
    href: "/awards/csr-education",
    cta: "Explore CSR Recognition",
    variant: "csr",
  },
  {
    id: "influencer",
    icon: Megaphone,
    eyebrow: "Digital Voices",
    title: "Who Are the Top Social Media Influencers for Education in Africa?",
    subtitle: "Recognizing the best education influencers from each African region in 2026",
    description:
      "Honoring digital voices using social platforms to advocate for education, inspire youth, and drive learning awareness across the continent.",
    href: "/awards/influencer-education",
    cta: "See Influencer Categories",
    variant: "influencer",
  },
  {
    id: "grants",
    icon: Globe2,
    eyebrow: "Global Partnerships",
    title: "Which Grants and Global Support Systems Are Advancing Education in Africa?",
    subtitle: "Recognizing the best grants, bilateral, and international support systems for education in Africa in 2026",
    description:
      "Celebrating grantmakers, bilateral institutions, multilateral agencies, and strategic partners driving education access and transformation across Africa.",
    href: "/awards/grants-global-support",
    cta: "View Global Support Awards",
    variant: "grants",
  },
];

const variantStyles: Record<Spotlight["variant"], { gradient: string; ring: string; glow: string; badge: string }> = {
  icon: {
    gradient: "from-gold/30 via-gold/10 to-transparent",
    ring: "ring-gold/40 hover:ring-gold/70",
    glow: "shadow-[0_0_60px_-15px_hsl(var(--gold)/0.5)]",
    badge: "bg-gold text-charcoal",
  },
  csr: {
    gradient: "from-gold/15 via-charcoal to-charcoal",
    ring: "ring-gold/20 hover:ring-gold/50",
    glow: "shadow-[0_0_40px_-15px_hsl(var(--gold)/0.3)]",
    badge: "bg-gold/15 text-gold border border-gold/40",
  },
  influencer: {
    gradient: "from-gold/20 via-gold/5 to-charcoal",
    ring: "ring-gold/25 hover:ring-gold/60",
    glow: "shadow-[0_0_45px_-15px_hsl(var(--gold)/0.35)]",
    badge: "bg-gold/15 text-gold border border-gold/40",
  },
  grants: {
    gradient: "from-gold/15 via-charcoal to-charcoal",
    ring: "ring-gold/20 hover:ring-gold/50",
    glow: "shadow-[0_0_40px_-15px_hsl(var(--gold)/0.3)]",
    badge: "bg-gold/15 text-gold border border-gold/40",
  },
};

export function AwardSpotlightSection() {
  const iconCard = spotlights[0];
  const restCards = spotlights.slice(1);

  return (
    <section className="relative bg-charcoal py-16 sm:py-24 overflow-hidden">
      {/* Subtle gold ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="container relative px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-4">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs sm:text-sm font-medium text-gold uppercase tracking-wider">
              The 2026 Recognition Spotlight
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Who Will Define Education Excellence in Africa?
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            From lifetime icons to corporate champions, digital voices, and global partners — celebrating those
            advancing <span className="text-gold font-medium">Education for All</span> across Africa and the diaspora.
          </p>
        </motion.div>

        {/* PRIMARY PILLAR — Africa Education Icon (full-width prestige banner) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <Link to={iconCard.href} className="group block">
            <div
              className={`relative overflow-hidden rounded-3xl ring-1 ${variantStyles.icon.ring} ${variantStyles.icon.glow} transition-all duration-500 hover:-translate-y-1`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles.icon.gradient}`} />
              <div className="absolute inset-0 bg-charcoal/60" />

              {/* Decorative crown patterns */}
              <div className="pointer-events-none absolute -right-10 -top-10 opacity-10">
                <Crown className="h-64 w-64 text-gold" />
              </div>
              <div className="pointer-events-none absolute -left-10 -bottom-10 opacity-5">
                <Crown className="h-48 w-48 text-gold" />
              </div>

              <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 sm:gap-8 items-center p-6 sm:p-10 md:p-12">
                {/* Plaque visual */}
                <div className="flex justify-center md:justify-start">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold/40 blur-2xl rounded-full" />
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-br from-gold via-gold-dark to-gold/60 flex items-center justify-center shadow-2xl">
                      <Crown className="h-14 w-14 sm:h-16 sm:w-16 text-charcoal" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 ${variantStyles.icon.badge}`}
                  >
                    {iconCard.eyebrow}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                    {iconCard.title}
                  </h3>
                  <p className="text-gold text-sm sm:text-base font-semibold mb-3">{iconCard.subtitle}</p>
                  <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-2xl">
                    {iconCard.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex justify-center md:justify-end">
                  <Button
                    size="lg"
                    className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 group-hover:scale-105 transition-transform"
                  >
                    {iconCard.cta}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* SECONDARY PILLARS — 3-column grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {restCards.map((card, idx) => {
            const Icon = card.icon;
            const styles = variantStyles[card.variant];
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link to={card.href} className="group block h-full">
                  <div
                    className={`relative h-full overflow-hidden rounded-2xl ring-1 ${styles.ring} ${styles.glow} transition-all duration-500 hover:-translate-y-1`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient}`} />
                    <div className="absolute inset-0 bg-charcoal/70" />

                    {/* Decorative icon */}
                    <div className="pointer-events-none absolute -right-6 -top-6 opacity-10">
                      <Icon className="h-40 w-40 text-gold" />
                    </div>

                    <div className="relative p-6 sm:p-8 flex flex-col h-full min-h-[340px]">
                      {/* Icon plaque */}
                      <div className="mb-5">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark shadow-lg">
                          <Icon className="h-7 w-7 text-charcoal" strokeWidth={1.5} />
                        </div>
                      </div>

                      <span
                        className={`inline-block self-start px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 ${styles.badge}`}
                      >
                        {card.eyebrow}
                      </span>

                      <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-gold/90 text-xs sm:text-sm font-semibold mb-3 leading-snug">
                        {card.subtitle}
                      </p>
                      <p className="text-white/65 text-xs sm:text-sm leading-relaxed mb-5 flex-1">
                        {card.description}
                      </p>

                      <div className="inline-flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                        {card.cta}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* IMPACT WRAP-UP — From Recognition to Real School Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-gold/30 shadow-[0_0_50px_-15px_hsl(var(--gold)/0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-charcoal to-charcoal" />
            <div className="absolute inset-0 bg-charcoal/50" />

            {/* Decorative pattern */}
            <div className="pointer-events-none absolute right-0 top-0 opacity-10">
              <School className="h-72 w-72 text-gold" />
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
                  From Recognition to <span className="text-gold">Real School Impact</span>
                </h3>
                <p className="text-white/75 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                  Through <span className="text-gold font-semibold">EduAid Africa</span> and{" "}
                  <span className="text-gold font-semibold">Rebuild My School Africa</span>, the 2026 season extends
                  into special school grants support, education infrastructure crowdfunding, and CSR for Education
                  contributions across African regions.
                </p>

                {/* Impact pillars */}
                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: School, label: "Special School Grants 2026/2027" },
                    { icon: HandCoins, label: "Education Infrastructure Crowdfunding" },
                    { icon: Building2, label: "CSR for Education Contributions" },
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
                  <Link to="/programs/eduaid-africa">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2"
                    >
                      Explore EduAid Africa
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/programs/rebuild-my-school-africa">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
                    >
                      Rebuild My School Africa
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Regional footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-white/50 text-xs sm:text-sm mt-8 max-w-2xl mx-auto"
        >
          Nominations and voting are <span className="text-gold/80 font-medium">regional-Africa based</span> —
          spanning West, East, North, Central, Southern Africa, and the global African diaspora.
        </motion.p>
      </div>
    </section>
  );
}

export default AwardSpotlightSection;
