/**
 * EDI Integrity Journey — Visual UX Wall
 * 
 * Premium redesign: Large hero foundation card + 4 step cards
 * with glowing connectors and cinematic hover effects.
 */

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Shield, FileText, CheckCircle, Scale, Vote, 
  ArrowRight, BookOpen, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

import ediMatrixImg from "@/assets/cards/edi-matrix-shield.jpg";
import ediNominationImg from "@/assets/cards/edi-nomination.jpg";
import ediAcceptanceImg from "@/assets/cards/edi-acceptance.jpg";
import ediJudgesImg from "@/assets/cards/edi-judges.jpg";
import ediVotingImg from "@/assets/cards/edi-voting.jpg";

const FOUNDATION_STEP = {
  title: "EDI Matrix",
  subtitle: "The Integrity Backbone",
  description: "The Education Development Index defines evaluation standards across 3 levels and 17 categories — the foundation every nomination, judge score, and vote is measured against.",
  icon: Shield,
  image: ediMatrixImg,
  href: "/guidelines/edi-matrix",
};

const JOURNEY_STEPS = [
  {
    step: 1,
    title: "Nomination",
    subtitle: "For Nominators",
    description: "Ethical guidelines, category selection, and evidence submission.",
    icon: FileText,
    image: ediNominationImg,
    href: "/guidelines/nominators",
    accentColor: "from-amber-500/30 to-amber-600/10",
    glowColor: "group-hover:shadow-amber-500/20",
    borderHover: "hover:border-amber-400/40",
    iconBg: "group-hover:bg-amber-500/20",
    textHover: "group-hover:text-amber-300",
  },
  {
    step: 2,
    title: "Acceptance",
    subtitle: "For Nominees",
    description: "NRC screening, acceptance journey, and dashboard tracking.",
    icon: CheckCircle,
    image: ediAcceptanceImg,
    href: "/guidelines/nominees",
    accentColor: "from-emerald-500/30 to-emerald-600/10",
    glowColor: "group-hover:shadow-emerald-500/20",
    borderHover: "hover:border-emerald-400/40",
    iconBg: "group-hover:bg-emerald-500/20",
    textHover: "group-hover:text-emerald-300",
  },
  {
    step: 3,
    title: "Judges Panel",
    subtitle: "For Judges",
    description: "20-point weighted criteria, COI protocols, and independent evaluation.",
    icon: Scale,
    image: ediJudgesImg,
    href: "/guidelines/judges",
    accentColor: "from-blue-500/30 to-blue-600/10",
    glowColor: "group-hover:shadow-blue-500/20",
    borderHover: "hover:border-blue-400/40",
    iconBg: "group-hover:bg-blue-500/20",
    textHover: "group-hover:text-blue-300",
  },
  {
    step: 4,
    title: "Public Voting",
    subtitle: "For Voters",
    description: "AGC credits, Gold & Blue Garnet voting windows, and ethical rules.",
    icon: Vote,
    image: ediVotingImg,
    href: "/guidelines/voters",
    accentColor: "from-violet-500/30 to-violet-600/10",
    glowColor: "group-hover:shadow-violet-500/20",
    borderHover: "hover:border-violet-400/40",
    iconBg: "group-hover:bg-violet-500/20",
    textHover: "group-hover:text-violet-300",
  },
];

export function EDIIntegrityJourney() {
  const { t } = useTranslation("pages");
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-charcoal">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gold/[0.04] rounded-full blur-[120px]" />

      <div className="container relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-[0.15em]">
              {t("ediIntegrity.badge")}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            {t("ediIntegrity.title")}
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {t("ediIntegrity.description")}
          </p>
        </motion.div>

        {/* Foundation Card — Full Width Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <Link
            to={FOUNDATION_STEP.href}
            className="group relative block rounded-2xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/10"
          >
            {/* Background Image */}
            <div className="relative h-48 md:h-56">
              <img
                src={FOUNDATION_STEP.image}
                alt={FOUNDATION_STEP.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="px-8 md:px-12 max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center group-hover:bg-gold/25 transition-colors">
                      <Shield className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <span className="text-gold/70 text-xs font-semibold uppercase tracking-widest">Foundation</span>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-gold transition-colors">
                        {FOUNDATION_STEP.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-lg group-hover:text-white/65 transition-colors">
                    {FOUNDATION_STEP.description}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/25 group-hover:border-gold/40 transition-all">
                <ArrowRight className="h-5 w-5 text-gold group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Connector */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-gradient-to-b from-gold/40 to-gold/15" />
            <div className="h-2 w-2 rounded-full bg-gold/30 ring-4 ring-gold/10" />
            <div className="w-px h-6 bg-gradient-to-b from-gold/15 to-transparent" />
          </div>
        </div>

        {/* 4 Journey Steps — Desktop: 4-col grid, Mobile: stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {JOURNEY_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                to={step.href}
                className={`group relative block rounded-xl overflow-hidden border border-white/10 ${step.borderHover} transition-all duration-500 h-full hover:shadow-xl ${step.glowColor} bg-white/[0.03]`}
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${step.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />

                  {/* Step number */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[11px] font-bold text-white/70">
                      {step.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`absolute bottom-3 right-3 h-9 w-9 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center ${step.iconBg} transition-colors duration-300`}>
                    <step.icon className={`h-4 w-4 text-white/60 ${step.textHover} transition-colors`} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 pb-5">
                  <p className="text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1">{step.subtitle}</p>
                  <h3 className={`font-semibold text-white text-base mb-2 ${step.textHover} transition-colors`}>
                    {step.title}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/55 transition-colors">
                    {step.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${step.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/guidelines/edi-matrix">
            <Button
              variant="outline"
              size="lg"
              className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 rounded-full gap-2.5 px-8 transition-all duration-300"
            >
              <BookOpen className="h-4 w-4" />
              {t("ediIntegrity.viewFullGuidelines")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default EDIIntegrityJourney;
