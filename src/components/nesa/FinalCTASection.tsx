import { Award, ExternalLink, ArrowRight, Vote, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function FinalCTASection() {
  const { t } = useTranslation("pages");

  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Elegant icon */}
          <motion.div 
            className="h-20 w-20 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Award className="h-10 w-10 text-gold" />
          </motion.div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            {t("landing.finalCTA.title")} <span className="text-gold">{t("landing.finalCTA.titleAccent")}</span>
          </h2>
          
          <p className="text-white/70 text-lg mb-4 max-w-2xl mx-auto">
            {t("landing.finalCTA.description")}
          </p>

          {/* AGC Strip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8">
            <Coins className="h-4 w-4 text-gold" />
            <span className="text-sm text-white/80">
              Earn voting points. Vote with AGC for Gold & Blue Garnet.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link to="/nominate" className="group">
              <Button 
                size="lg" 
                className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-10 gap-2 shadow-lg hover:shadow-gold/30 transition-all min-h-[56px] text-lg"
              >
                {t("landing.finalCTA.submitNomination")}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/vote" className="group">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gold text-gold hover:bg-gold/10 rounded-full px-10 gap-2 transition-all min-h-[56px] text-lg"
              >
                <Vote className="h-5 w-5" />
                Vote Now
              </Button>
            </Link>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/buy-your-ticket">
              <Button variant="ghost" className="text-gold/70 hover:text-gold hover:bg-gold/10 rounded-full">
                Get Tickets
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="ghost" className="text-gold/70 hover:text-gold hover:bg-gold/10 rounded-full">
                Donate
              </Button>
            </Link>
            <Link to="/partners">
              <Button variant="ghost" className="text-gold/70 hover:text-gold hover:bg-gold/10 rounded-full">
                Partner
              </Button>
            </Link>
            <a href="https://nesa.africa" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="text-gold/70 hover:text-gold hover:bg-gold/10 rounded-full gap-1">
                <ExternalLink className="h-4 w-4" />
                nesa.africa
              </Button>
            </a>
          </div>

          {/* Trust indicators - Clean and professional */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            {[
              { key: "countries", text: t("landing.finalCTA.trustIndicators.countries") },
              { key: "nominees", text: t("landing.finalCTA.trustIndicators.nominees") },
              { key: "years", text: t("landing.finalCTA.trustIndicators.years") },
            ].map((item) => (
              <div 
                key={item.key}
                className="flex items-center gap-2 text-sm text-white/60"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
