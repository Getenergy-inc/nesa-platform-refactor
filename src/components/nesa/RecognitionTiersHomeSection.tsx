import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Trophy, Gem, Megaphone, ArrowRight, type LucideIcon } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Tier = {
  number: string;
  title: string;
  body: string;
  href: string;
  icon: LucideIcon;
};

const TIERS: Tier[] = [
  {
    number: "Tier 1",
    title: "Africa Education Icon Award",
    body: "Lifetime recognition for transformational leaders whose work has reshaped education across Africa.",
    href: "/awards/africa-education-icon",
    icon: Crown,
  },
  {
    number: "Tier 2",
    title: "Gold-Blue Garnet Awards",
    body: "Competitive recognition for CSR, EdTech, NGOs and faith-based organisations enabling Education for All.",
    href: "/awards/blue-garnet",
    icon: Trophy,
  },
  {
    number: "Tier 3",
    title: "Platinum Recognition",
    body: "Institutional leadership recognition for governments, ministries, universities and policy leaders.",
    href: "/awards/platinum",
    icon: Gem,
  },
  {
    number: "Tier 4",
    title: "Influencer Education Impact",
    body: "Recognising sports, music and social media champions amplifying Education for All.",
    href: "/awards/influencers-education-impact-2026-recognition",
    icon: Megaphone,
  },
];

export function RecognitionTiersHomeSection() {
  return (
    <section
      className="relative py-20 md:py-28 bg-charcoal"
      aria-labelledby="recognition-tiers-heading"
    >
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-gold/80 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Recognition Architecture
          </p>
          <h2
            id="recognition-tiers-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Four <span className="text-gold">Recognition Tiers</span>
          </h2>
          <p className="text-white/75 text-base md:text-lg">
            NESA-Africa is organised through four recognition tiers, eighteen categories
            and more than one hundred recognition pathways — each one a route into Africa's
            Education Impact Directory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <Link
                  to={tier.href}
                  onClick={() =>
                    trackEvent("home_cta_click", {
                      cta: "tier_card",
                      label: tier.title,
                      to: tier.href,
                      section: "recognition_tiers",
                    })
                  }
                  className="group block h-full rounded-2xl border border-gold/20 bg-charcoal/60 p-6 hover:border-gold/60 hover:bg-charcoal/80 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <p className="text-gold/80 text-[11px] font-semibold tracking-[0.16em] uppercase mb-2">
                    {tier.number}
                  </p>
                  <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-gold transition">
                    {tier.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{tier.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-gold text-sm font-semibold">
                    Explore tier <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RecognitionTiersHomeSection;
