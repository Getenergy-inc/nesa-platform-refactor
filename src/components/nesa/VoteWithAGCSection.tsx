import { Coins, Vote, Shield, ArrowRight, UserPlus, Award, Check, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function VoteWithAGCSection() {
  const { t } = useTranslation("pages");

  const steps = [
    { icon: UserPlus, title: t("landing.voteWithAGC.joinTitle"), description: t("landing.voteWithAGC.joinDesc") },
    { icon: Coins, title: t("landing.voteWithAGC.earnTitle"), description: t("landing.voteWithAGC.earnDesc") },
    { icon: Vote, title: t("landing.voteWithAGC.voteTitle"), description: t("landing.voteWithAGC.voteDesc") },
    { icon: Award, title: t("landing.voteWithAGC.impactTitle"), description: t("landing.voteWithAGC.impactDesc") },
  ];

  const earningMethods = [
    { amount: t("landing.voteWithAGC.nominationAmount"), label: t("landing.voteWithAGC.nominationLabel") },
    { amount: t("landing.voteWithAGC.signInAmount"), label: t("landing.voteWithAGC.signInLabel") },
    { amount: t("landing.voteWithAGC.firstReferralAmount"), label: t("landing.voteWithAGC.firstReferralLabel") },
    { amount: t("landing.voteWithAGC.secondReferralAmount"), label: t("landing.voteWithAGC.secondReferralLabel") },
    { amount: t("landing.voteWithAGC.watchTVAmount"), label: t("landing.voteWithAGC.watchTVLabel") },
    { amount: t("landing.voteWithAGC.signupAmount"), label: t("landing.voteWithAGC.signupLabel") },
  ];

  return (
    <section className="bg-gradient-to-b from-charcoal via-charcoal-light/20 to-charcoal py-16 md:py-24" data-event="vote-with-agc-section-view">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Visual Flow */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="space-y-5">
              {steps.map((step, index) => (
                <motion.div key={step.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="relative flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-gold" />
                    </div>
                    {index < steps.length - 1 && <div className="w-0.5 h-8 bg-gold/15 mt-2" />}
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
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <Coins className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold">{t("landing.voteWithAGC.badge")}</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {t("landing.voteWithAGC.title")}{" "}
              <span className="text-gold">{t("landing.voteWithAGC.titleAccent")}</span>
            </h2>

            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              {t("landing.voteWithAGC.description")}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
              {earningMethods.map((method) => (
                <div key={method.label} className="p-3 rounded-xl bg-white/4 border border-white/8 hover:border-gold/25 transition-colors">
                  <p className="text-gold font-semibold text-sm">{method.amount}</p>
                  <p className="text-white/50 text-xs">{method.label}</p>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-white/50 mb-5 p-2.5 rounded-lg bg-white/4 border border-white/8">
              💡 <span className="text-gold">{t("landing.voteWithAGC.conversionNote")}</span>
            </p>

            <ul className="space-y-2.5 mb-7">
              {[
                t("landing.voteWithAGC.goldPoint"),
                t("landing.voteWithAGC.blueGarnetPoint"),
                t("landing.voteWithAGC.auditPoint"),
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-white/75 text-sm">
                  <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mb-5">
              <Link to="/about-agc">
                <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                  <Coins className="h-4 w-4" />
                  {t("landing.voteWithAGC.learnAboutAGC")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/vote">
                <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2">
                  <Vote className="h-4 w-4" />
                  {t("landing.voteWithAGC.goToVoting")}
                </Button>
              </Link>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
              <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning/80">
                <span className="font-semibold">{t("landing.voteWithAGC.disclaimer")}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}