import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Ticket,
  ShoppingBag,
  Music,
  Users,
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
  MapPin,
  Trophy,
  Headphones,
  Shirt,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardItem {
  icon: typeof Ticket;
  decorIcon: typeof Trophy;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  badge: string;
  hoverLine: string;
  hoverIcon: typeof Sparkles;
  accent: string;
  ring: string;
  glow: string;
}

const items: CardItem[] = [
  {
    icon: Ticket,
    decorIcon: Trophy,
    eyebrow: "Awards Gala",
    title: "Buy Your Gala Ticket",
    description:
      "Reserve your seat at the NESA-Africa Blue Garnet Awards Gala and celebrate Africa's education changemakers live.",
    cta: "Buy Tickets",
    href: "/buy-your-ticket",
    badge: "Premium Event",
    hoverLine: "Limited seats available",
    hoverIcon: Sparkles,
    accent: "from-gold/30 via-gold/10 to-transparent",
    ring: "hover:border-gold/60",
    glow: "group-hover:shadow-[0_0_40px_-10px_hsl(var(--gold)/0.5)]",
  },
  {
    icon: ShoppingBag,
    decorIcon: Shirt,
    eyebrow: "Shop & Support",
    title: "Buy Official Merchandise",
    description:
      "Wear the movement. Every purchase from the official NESA store supports Rebuild My School Africa and education legacy projects.",
    cta: "Visit Shop",
    href: "/shop",
    badge: "Funds Impact",
    hoverLine: "Every purchase supports impact",
    hoverIcon: Heart,
    accent: "from-emerald-500/30 via-emerald-500/10 to-transparent",
    ring: "hover:border-emerald-400/60",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]",
  },
  {
    icon: Music,
    decorIcon: Headphones,
    eyebrow: "Official Anthem",
    title: "Listen to the NESA Song",
    description:
      "Stream and download the official NESA-Africa anthem — a celebration of learning, hope, and education changemakers across the continent.",
    cta: "Play & Download",
    href: "/media/hub#music",
    badge: "New Release",
    hoverLine: "Share the sound of the movement",
    hoverIcon: Share2,
    accent: "from-fuchsia-500/30 via-fuchsia-500/10 to-transparent",
    ring: "hover:border-fuchsia-400/60",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(217,70,239,0.5)]",
  },
  {
    icon: Users,
    decorIcon: Globe2,
    eyebrow: "Join the Network",
    title: "Become an Ambassador or SCEF Member",
    description:
      "Join a local chapter, become a NESA-Africa Ambassador or SCEF Active Member, lead change in your region, and earn AGC rewards.",
    cta: "Join the Movement",
    href: "/ambassadors",
    badge: "Earn AGC",
    hoverLine: "Lead change in your region",
    hoverIcon: MapPin,
    accent: "from-sky-500/30 via-sky-500/10 to-transparent",
    ring: "hover:border-sky-400/60",
    glow: "group-hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)]",
  },
];

export function SupportExperienceSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/20 to-charcoal" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--gold)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            Experience • Support • Celebrate
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Be Part of the <span className="text-gold">Movement</span>
          </h2>
          <p className="text-white/65 text-base md:text-lg leading-relaxed">
            Four ways to experience, support, and lead Africa's education movement —
            attend the gala, wear the brand, play the anthem, or join a regional chapter.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((item, i) => {
            const HoverIcon = item.hoverIcon;
            const DecorIcon = item.decorIcon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className={`group relative flex flex-col rounded-3xl border border-gold/15 bg-gradient-to-b from-charcoal-light/60 to-charcoal-light/20 backdrop-blur-sm p-6 md:p-7 overflow-hidden transition-all duration-300 ${item.ring} ${item.glow}`}
              >
                {/* Top corner gold accent */}
                <div className="absolute top-0 left-0 h-[2px] w-16 bg-gradient-to-r from-gold to-transparent" />
                <div className="absolute top-0 left-0 w-[2px] h-16 bg-gradient-to-b from-gold to-transparent" />

                {/* Decorative blob */}
                <div
                  className={`absolute -top-20 -right-20 h-52 w-52 rounded-full bg-gradient-to-br ${item.accent} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Decorative outline icon */}
                <DecorIcon
                  className="absolute -bottom-6 -right-6 h-32 w-32 text-white/[0.03] group-hover:text-white/[0.06] transition-colors duration-500"
                  strokeWidth={1}
                />

                {/* Badge */}
                <div className="relative flex justify-between items-start mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-7 w-7 text-gold" />
                  </div>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-gold/90 bg-gold/10 border border-gold/25 px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="relative flex-1 flex flex-col">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-gold/70 font-semibold mb-2">
                    {item.eyebrow}
                  </p>
                  <h3 className="font-display text-xl md:text-[22px] font-bold text-white mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">
                    {item.description}
                  </p>

                  {/* Hover reveal line */}
                  <div className="overflow-hidden mb-4 max-h-0 group-hover:max-h-10 transition-all duration-300">
                    <div className="flex items-center gap-1.5 text-xs text-gold/90 font-medium pt-1">
                      <HoverIcon className="h-3.5 w-3.5" />
                      <span>{item.hoverLine}</span>
                    </div>
                  </div>

                  <Link to={item.href} className="block mt-auto">
                    <Button
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full gap-2 group/btn min-h-[44px]"
                      size="lg"
                    >
                      {item.cta}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Conversion helper + dual CTAs */}
        <motion.div
          className="mt-12 md:mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 text-sm md:text-base mb-5">
            Not sure where to start?{" "}
            <span className="text-gold font-medium">Join the movement today</span> and
            choose your pathway.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/ambassadors">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-8 gap-2 min-h-[48px]"
              >
                <Sparkles className="h-4 w-4" />
                Join the Movement
              </Button>
            </Link>
            <Link to="/donate">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-gold/40 text-white hover:bg-gold/10 hover:text-gold hover:border-gold font-semibold rounded-full px-8 gap-2 min-h-[48px]"
              >
                Explore All Ways to Support
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SupportExperienceSection;
