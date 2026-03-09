/**
 * EDI Matrix Introduction Section — Landing Page
 * 
 * Introduces the Education Development Index (EDI) Matrix as the
 * integrity backbone of NESA-Africa 2025 evaluation framework.
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  BarChart3,
  Award,
  GraduationCap,
  Lightbulb,
  Leaf,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const EDI_PILLARS = [
  {
    icon: GraduationCap,
    label: "Access",
    weight: "20%",
    description: "Reach & inclusion across underserved communities",
  },
  {
    icon: BarChart3,
    label: "Quality",
    weight: "25%",
    description: "Measurable learning outcomes & pedagogical excellence",
  },
  {
    icon: Shield,
    label: "Institutional Strength",
    weight: "20%",
    description: "Governance, accountability & operational resilience",
  },
  {
    icon: Lightbulb,
    label: "Innovation",
    weight: "20%",
    description: "Novel approaches to solving education challenges",
  },
  {
    icon: Leaf,
    label: "Sustainability",
    weight: "15%",
    description: "Long-term viability & scalable impact models",
  },
];

const AWARD_TIERS = [
  { name: "Blue Garnet Award", split: "40% Public Vote / 60% Jury", href: "/awards/blue-garnet" },
  { name: "Platinum Certificate", split: "NRC Verification Threshold", href: "/awards/platinum" },
  { name: "Gold Special 2025", split: "Editorial Pillar Assessment", href: "/awards/gold-special-recognition" },
  { name: "Gold Certificate", split: "Standard Evaluation", href: "/awards/gold" },
];

export function EDIMatrixIntroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/95 to-secondary" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />

      <div className="relative container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold tracking-wider uppercase text-primary">
              Integrity Framework
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-4">
            The <span className="text-primary">EDI Matrix</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            The Education Development Index is the backbone of every NESA-Africa evaluation —
            a rigorous, transparent framework that ensures every nominee is measured against
            Africa's most pressing education priorities.
          </p>
        </motion.div>

        {/* 5 Pillars Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {EDI_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              className="group relative bg-card/5 backdrop-blur-sm border border-primary/10 rounded-xl p-5 hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold text-primary font-display">
                  {pillar.weight}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-secondary-foreground mb-1">
                {pillar.label}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tier-Specific Logic */}
        <motion.div
          className="bg-card/5 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-secondary-foreground">
              Tier-Specific Evaluation Logic
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AWARD_TIERS.map((tier) => (
              <Link
                key={tier.name}
                to={tier.href}
                className="group flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-primary/5 hover:border-primary/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-secondary-foreground group-hover:text-primary transition-colors">
                    {tier.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tier.split}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-8 font-semibold"
          >
            <Link to="/guidelines/edi-matrix">
              Explore the Full EDI Matrix
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Aligned with UN SDG 4 & AU Agenda 2063
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default EDIMatrixIntroSection;
