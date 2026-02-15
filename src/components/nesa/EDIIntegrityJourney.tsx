/**
 * EDI Integrity Journey — Visual UX Wall
 * 
 * Connects the EDI Matrix across the full lifecycle:
 * Landing → Nomination → Acceptance → Judges → Voting
 * 
 * Each step links to the corresponding guidelines page
 * with documentary-style African imagery.
 */

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Shield, FileText, CheckCircle, Scale, Vote, 
  ChevronRight, ArrowRight, BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";

import ediMatrixImg from "@/assets/cards/edi-matrix-shield.jpg";
import ediNominationImg from "@/assets/cards/edi-nomination.jpg";
import ediAcceptanceImg from "@/assets/cards/edi-acceptance.jpg";
import ediJudgesImg from "@/assets/cards/edi-judges.jpg";
import ediVotingImg from "@/assets/cards/edi-voting.jpg";
import ediBannerImg from "@/assets/cards/edi-integrity-banner.jpg";

const INTEGRITY_STEPS = [
  {
    step: 1,
    title: "EDI Matrix",
    subtitle: "Integrity Backbone",
    description: "The Education Development Index defines evaluation standards across 3 levels and 17 categories.",
    icon: Shield,
    image: ediMatrixImg,
    href: "/guidelines/edi-matrix",
    badge: "Foundation",
    badgeColor: "bg-gold/20 text-gold border-gold/30",
  },
  {
    step: 2,
    title: "Nomination",
    subtitle: "For Nominators",
    description: "Ethical nomination guidelines, category selection, and evidence submission requirements.",
    icon: FileText,
    image: ediNominationImg,
    href: "/guidelines/nominators",
    badge: "Step 1",
    badgeColor: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  },
  {
    step: 3,
    title: "Acceptance",
    subtitle: "For Nominees",
    description: "NRC screening process, acceptance journey, and nominee dashboard status tracking.",
    icon: CheckCircle,
    image: ediAcceptanceImg,
    href: "/guidelines/nominees",
    badge: "Step 2",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  },
  {
    step: 4,
    title: "Judges Panel",
    subtitle: "For Judges",
    description: "20-point weighted criteria, COI protocols, and independent jury evaluation process.",
    icon: Scale,
    image: ediJudgesImg,
    href: "/guidelines/judges",
    badge: "Step 3",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  },
  {
    step: 5,
    title: "Public Voting",
    subtitle: "For Voters",
    description: "AGC participation credits, Gold & Blue Garnet voting windows, and ethical voting rules.",
    icon: Vote,
    image: ediVotingImg,
    href: "/guidelines/voters",
    badge: "Step 4",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  },
];

export function EDIIntegrityJourney() {
  const { t } = useTranslation("pages");
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={ediBannerImg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-charcoal/92" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/25 mb-4">
            <Shield className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold uppercase tracking-wider">
              {t("ediIntegrity.badge")}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("ediIntegrity.title")}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {t("ediIntegrity.description")}
          </p>
        </motion.div>

        {/* Desktop: Horizontal Connected Cards */}
        <div className="hidden lg:block">
          {/* Connection Line */}
          <div className="relative max-w-6xl mx-auto mb-8">
            <div className="absolute top-[7.5rem] left-[10%] right-[10%] h-0.5">
              <div className="w-full h-full bg-gradient-to-r from-gold/60 via-gold/30 to-gold/60" />
              {/* Animated pulse dots */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gold"
                  style={{ left: `${25 * i + 12.5}%` }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>

            <div className="grid grid-cols-5 gap-4">
              {INTEGRITY_STEPS.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={step.href}
                    className="group block bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-gold/40 transition-all duration-300 overflow-hidden h-full"
                  >
                    {/* Image */}
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                      
                      {/* Step badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${step.badgeColor}`}>
                          {step.badge}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="absolute bottom-3 left-3 h-9 w-9 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <step.icon className="h-4 w-4 text-white/70 group-hover:text-gold transition-colors" />
                      </div>

                      {/* Arrow indicator */}
                      {index < INTEGRITY_STEPS.length - 1 && (
                        <div className="absolute bottom-3 right-3">
                          <ChevronRight className="h-4 w-4 text-gold/40 group-hover:text-gold transition-colors" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 group-hover:text-gold transition-colors text-sm">
                        {step.title}
                      </h3>
                      <p className="text-gold/60 text-xs mb-2">{step.subtitle}</p>
                      <p className="text-white/45 text-xs leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-3 max-w-lg mx-auto">
          {INTEGRITY_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={step.href}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-gold/30 hover:bg-white/8 transition-all duration-300 group"
              >
                {/* Image thumbnail */}
                <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-charcoal/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-white/80 group-hover:text-gold transition-colors" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                    <h4 className="text-white font-semibold text-sm group-hover:text-gold transition-colors">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-white/45 text-xs leading-snug line-clamp-2">
                    {step.description}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link to="/guidelines/edi-matrix">
            <Button
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {t("ediIntegrity.viewFullGuidelines")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EDIIntegrityJourney;
