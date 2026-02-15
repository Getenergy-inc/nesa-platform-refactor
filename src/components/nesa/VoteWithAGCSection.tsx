import { Coins, Vote, Shield, ArrowRight, UserPlus, Award, Check, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function VoteWithAGCSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Join & Participate",
      description: "Create your account and engage through nominations, referrals, and daily activities.",
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

  const earningMethods = [
    { amount: "+5 AGCc", label: "Verified Nomination" },
    { amount: "+1 AGCc", label: "Daily Sign-in" },
    { amount: "+15 AGC", label: "First Referral" },
    { amount: "+5 AGC", label: "Second Referral" },
    { amount: "+1 AGCc", label: "Watch NESA TV" },
    { amount: "+2 AGCc", label: "Signup & Verify" },
  ];

  return (
    <section className="bg-gradient-to-b from-charcoal via-charcoal-light/20 to-charcoal py-16 md:py-24" data-event="vote-with-agc-section-view">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Visual Flow + Coin Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Steps */}
            <div className="space-y-5">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-4"
                >
                  <div className="relative flex flex-col items-center">
                    <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-gold" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-8 bg-gold/15 mt-2" />
                    )}
                  </div>
                  
                  <div className="pt-1">
                    <h4 className="text-white font-semibold mb-0.5">{step.title}</h4>
                    <p className="text-white/55 text-sm leading-relaxed">{step.description}</p>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <Coins className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold">Structured Civic Participation</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Afrigold Participation{" "}
              <span className="text-gold">Credit (AGC)</span>
            </h2>

            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Your participation earns <span className="text-gold font-semibold">Afrigold Credits (AGCc)</span> — structured 
              participation credits to support nominees for <span className="text-gold">Gold</span> and <span className="text-blue-400">Blue Garnet</span> awards.
            </p>
            
            {/* Earning Methods — Clean Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
              {earningMethods.map((method) => (
                <div key={method.label} className="p-3 rounded-xl bg-white/4 border border-white/8 hover:border-gold/25 transition-colors">
                  <p className="text-gold font-semibold text-sm">{method.amount}</p>
                  <p className="text-white/50 text-xs">{method.label}</p>
                </div>
              ))}
            </div>
            
            {/* Conversion Note */}
            <p className="text-xs text-white/50 mb-5 p-2.5 rounded-lg bg-white/4 border border-white/8">
              💡 <span className="text-gold">10 AGCc = 1 AGC</span> — AGCc auto-converts to AGC for voting. <span className="text-blue-400">1 Vote = 1 AGC.</span>
            </p>

            {/* Key Points */}
            <ul className="space-y-2.5 mb-7">
              {[
                "Gold Certificate: 100% public participation",
                "Blue Garnet: Combined jury & public weighting",
                "All votes recorded with full audit trail",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-white/75 text-sm">
                  <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mb-5">
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
