import { Coins, Vote, Shield, ArrowRight, UserPlus, Award, Check, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function VoteWithAGCSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Join & Participate",
      description: "Create your account and engage with the platform through nominations, referrals, and daily activities.",
    },
    {
      icon: Coins,
      title: "Earn Voting Points",
      description: "Your participation unlocks AGC voting points—structured credits for public participation.",
    },
    {
      icon: Vote,
      title: "Vote During Windows",
      description: "Use your AGC during official voting windows to support Gold and Blue Garnet nominees.",
    },
    {
      icon: Award,
      title: "Impact Education",
      description: "Winners are announced and legacy funding flows to Rebuild My School Africa projects.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-charcoal via-charcoal-light/30 to-charcoal py-16 md:py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Visual Flow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-4"
                >
                  {/* Step Number & Line */}
                  <div className="relative flex flex-col items-center">
                    <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-gold" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-12 bg-gold/20 mt-2" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="pt-1.5">
                    <h4 className="text-white font-semibold text-lg mb-1">{step.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <Coins className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold">Structured Public Participation</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Vote with <span className="text-gold">AGC</span>
            </h2>

            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Afri Gold Coins (AGC) are voting points earned through your participation on the NESA-Africa platform. 
              They enable structured, auditable public input during official voting windows.
            </p>

            {/* Key Points */}
            <ul className="space-y-3 mb-8">
              {[
                "Gold Certificate: 100% public participation",
                "Blue Garnet: Combined jury & public weighting",
                "All votes recorded with full audit trail",
                "Sponsors cannot influence outcomes",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-white/80">
                  <Check className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link to="/about-agc">
                <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                  <Coins className="h-4 w-4" />
                  Learn About AGC
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/vote">
                <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2">
                  <Vote className="h-4 w-4" />
                  Go to Voting
                </Button>
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
              <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning/80">
                <span className="font-semibold">AGC is non-tradeable</span>—no withdrawals, no cash-out, no payouts. 
                AGC is not a cryptocurrency.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
