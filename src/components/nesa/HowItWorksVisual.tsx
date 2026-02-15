import { BookOpen, Award, Medal, Trophy, Star, Building, ArrowRight, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import howItWorksBg from "@/assets/nesa-how-it-works-bg.jpg";

export function HowItWorksVisual() {
  const { t } = useTranslation("pages");

  const journey = [
    { icon: BookOpen, label: t("landing.howItWorksVisual.webinar"), description: t("landing.howItWorksVisual.webinarDesc"), color: "bg-slate-500", href: "/media/webinars" },
    { icon: Award, label: t("landing.howItWorksVisual.platinum"), description: t("landing.howItWorksVisual.platinumDesc"), color: "bg-slate-400", href: "/awards/platinum" },
    { icon: Star, label: t("landing.howItWorksVisual.icon"), description: t("landing.howItWorksVisual.iconDesc"), color: "bg-purple-500", href: "/awards/icon" },
    { icon: Medal, label: t("landing.howItWorksVisual.gold"), description: t("landing.howItWorksVisual.goldDesc"), color: "bg-amber-500", hasAGC: true, href: "/awards/gold" },
    { icon: Trophy, label: t("landing.howItWorksVisual.blueGarnet"), description: t("landing.howItWorksVisual.blueGarnetDesc"), color: "bg-blue-500", hasAGC: true, href: "/awards/blue-garnet" },
    { icon: Building, label: t("landing.howItWorksVisual.legacy"), description: t("landing.howItWorksVisual.legacyDesc"), color: "bg-emerald-500", href: "/rebuild" },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={howItWorksBg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-charcoal/88" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold font-medium text-sm uppercase tracking-wider mb-4">
            {t("landing.howItWorksVisual.badge")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("landing.howItWorksVisual.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            {t("landing.howItWorksVisual.description")}
          </p>
        </motion.div>

        {/* Visual Journey — Desktop: Horizontal Flow */}
        <div className="relative max-w-5xl mx-auto">
          <div className="hidden md:block">
            <div className="absolute top-14 left-16 right-16 h-0.5 bg-gradient-to-r from-slate-500/40 via-gold/40 to-emerald-500/40" />
            
            <div className="grid grid-cols-6 gap-4">
              {journey.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col items-center text-center"
                >
                  <Link to={step.href} className="group flex flex-col items-center">
                    <div className="relative z-10 h-28 w-28 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-gold/40 group-hover:bg-white/10 transition-all duration-300">
                      <step.icon className="h-10 w-10 text-white/60 group-hover:text-gold transition-colors" />
                      {step.hasAGC && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/30">
                          <Coins className="h-3 w-3 text-charcoal" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-gold transition-colors">{step.label}</h4>
                    <p className="text-white/45 text-xs">{step.description}</p>
                  </Link>
                  {index < journey.length - 1 && (
                    <ArrowRight className="absolute top-14 -right-4 h-4 w-4 text-gold/30 hidden lg:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Flow */}
          <div className="md:hidden space-y-3">
            {journey.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={step.href}
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                    <step.icon className="h-6 w-6 text-white/60 group-hover:text-gold transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm group-hover:text-gold transition-colors">{step.label}</h4>
                    <p className="text-white/45 text-xs">{step.description}</p>
                  </div>
                  {step.hasAGC && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold/10 border border-gold/30">
                      <Coins className="h-3 w-3 text-gold" />
                      <span className="text-gold text-xs font-medium">AGC</span>
                    </div>
                  )}
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10 p-4 rounded-xl bg-gold/5 backdrop-blur-sm border border-gold/20 max-w-2xl mx-auto">
          <Coins className="h-5 w-5 text-gold flex-shrink-0" />
          <p className="text-sm text-white/80">
            {t("landing.howItWorksVisual.agcNote")}
          </p>
        </div>

        <div className="text-center mt-8">
          <Link to="/about">
            <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2">
              {t("landing.howItWorksVisual.learnMore")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}