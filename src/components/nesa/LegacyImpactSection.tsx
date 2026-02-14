import { Trophy, Vote, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import legacyRebuildImg from "@/assets/nesa-legacy-rebuild.jpg";

export function LegacyImpactSection() {
  const actionPaths = [
    {
      icon: Trophy,
      title: "Nominate",
      description: "Recognize educators transforming special needs education in your region",
      cta: "Submit Nomination",
      link: "/nominate",
      accent: "gold",
    },
    {
      icon: Vote,
      title: "Vote",
      description: "Support nominees with AGC votes to help them win recognition",
      cta: "Vote Now",
      link: "/vote",
      accent: "blue",
    },
    {
      icon: Heart,
      title: "Support a School",
      description: "Fund inclusive education facilities in your Africa region",
      cta: "Donate to EduAid",
      link: "/donate",
      accent: "emerald",
    },
  ];

  const accentStyles: Record<string, { border: string; iconBg: string; iconColor: string; button: string }> = {
    gold: {
      border: "border-gold/25 hover:border-gold/50",
      iconBg: "bg-gold/15",
      iconColor: "text-gold",
      button: "bg-gold hover:bg-gold-dark text-charcoal",
    },
    blue: {
      border: "border-blue-500/25 hover:border-blue-500/50",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    emerald: {
      border: "border-emerald-500/25 hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      button: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background — New generated image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={legacyRebuildImg} 
          alt="Community school rebuild project in Africa" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/92 via-charcoal/88 to-charcoal/95" />
      </div>
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium mb-4">
            Post-Award Legacy
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Rebuild My School{" "}
            <span className="text-emerald-400">Africa</span>
          </h2>
          <p className="text-white/75 text-lg leading-relaxed">
            Every nomination, vote, and donation upgrades inclusive education facilities 
            for special needs students across Africa's regions.
          </p>
        </motion.div>

        {/* Three Action Paths */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {actionPaths.map((path, index) => {
            const styles = accentStyles[path.accent];
            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border ${styles.border} transition-all duration-300`}
              >
                <div className={`w-13 h-13 rounded-xl flex items-center justify-center mb-4 ${styles.iconBg}`}>
                  <path.icon className={`h-6 w-6 ${styles.iconColor}`} />
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {path.title}
                </h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  {path.description}
                </p>

                <Link to={path.link}>
                  <Button className={`w-full rounded-full gap-2 font-semibold ${styles.button}`}>
                    {path.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-white/40 text-sm mt-10"
        >
          Implemented via Santos Creations Educational Foundation • EduAid Programme
        </motion.p>
      </div>
    </section>
  );
}
