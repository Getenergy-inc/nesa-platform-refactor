// AboutChooseJourneySection — self-selection router. Mandatory on /about.
// Five large cards to reduce bounce and guide visitors into the right path.

import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";
import {
  UserPlus,
  Search,
  Trophy,
  Handshake,
  Users,
  ArrowRight,
} from "lucide-react";

const JOURNEYS = [
  {
    icon: UserPlus,
    title: "I Want to Nominate Someone",
    description: "Honour an educator, innovator, or institution shaping African education.",
    href: "/nominate",
    cta: "Start a Nomination",
  },
  {
    icon: Search,
    title: "I Want to Explore Nominees",
    description: "Discover changemakers across 10 regions and the diaspora.",
    href: "/nominees",
    cta: "Browse Nominees",
  },
  {
    icon: Trophy,
    title: "I Want to Learn About Awards",
    description: "Understand the Blue Garnet, Platinum, Icon, and Influencers tiers.",
    href: "/awards",
    cta: "View Awards Framework",
  },
  {
    icon: Handshake,
    title: "I Want to Become a Sponsor",
    description: "Power continental education recognition and impact programmes.",
    href: "/sponsors",
    cta: "Sponsor NESA-Africa",
  },
  {
    icon: Users,
    title: "I Want to Join the Movement",
    description: "Volunteer, ambassador, judge, chapter — find your role.",
    href: "/movement",
    cta: "Join the Community",
  },
];

export function AboutChooseJourneySection() {
  return (
    <section
      aria-labelledby="choose-journey-heading"
      className="bg-charcoal py-16 md:py-24 border-y border-gold/10"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
            Choose Your Journey
          </span>
          <h2
            id="choose-journey-heading"
            className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory"
          >
            How would you like to engage with NESA-Africa?
          </h2>
          <p className="mt-3 text-ivory/70 max-w-2xl mx-auto text-sm md:text-base">
            Pick the path that fits you — every journey strengthens the movement.
          </p>
        </div>

        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {JOURNEYS.map((j, i) => (
            <motion.div
              key={j.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                to={j.href}
                className="group h-full flex flex-col rounded-2xl border border-gold/20 bg-charcoal-light/30 p-6 hover:border-gold/50 hover:bg-charcoal-light/50 transition-all"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold mb-4">
                  <j.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg md:text-xl font-bold text-ivory leading-snug mb-2">
                  {j.title}
                </h3>
                <p className="text-ivory/70 text-sm leading-relaxed mb-5 flex-1">
                  {j.description}
                </p>
                <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold">
                  {j.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutChooseJourneySection;
