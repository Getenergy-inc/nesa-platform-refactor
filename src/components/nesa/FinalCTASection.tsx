import { Award, ArrowRight, Vote, Ticket, Heart, Globe, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

export function FinalCTASection() {
  const { t } = useTranslation("pages");

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light/30 to-charcoal" />
      <div className="absolute inset-0 bg-gradient-to-t from-gold/4 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container relative z-10">
        <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.div className="h-20 w-20 rounded-3xl bg-gold/10 border border-gold/25 flex items-center justify-center mx-auto mb-8" whileHover={{ scale: 1.08, rotate: 3 }} transition={{ duration: 0.2 }}>
            <Award className="h-10 w-10 text-gold" />
          </motion.div>

          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
            Ready to Recognise Africa's{" "}
            <span className="text-gold">Education Enablers?</span>
          </h2>

          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Don't just applaud impact — help the continent see it. Nominate an Education Enabler and join a movement recognising the people and institutions enabling Education for All Across Africa and the Diaspora.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link to="/nominate" className="group" onClick={() => trackEvent("final_cta_click", { cta: "nominate", to: "/nominate", location: "final_cta" })}>
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-10 gap-2.5 shadow-xl shadow-gold/25 hover:shadow-gold/40 transition-all min-h-[56px] text-lg">
                Nominate an Education Enabler Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/awards" className="group" onClick={() => trackEvent("final_cta_click", { cta: "recognition", to: "/awards", location: "final_cta" })}>
              <Button size="lg" variant="outline" className="border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold rounded-full px-10 gap-2.5 transition-all min-h-[56px] text-lg">
                Explore Recognition 2026
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Link to="/donate" onClick={() => trackEvent("final_cta_click", { cta: "donate", to: "/donate", location: "final_cta" })}>
              <Button variant="ghost" className="text-gold/70 hover:text-gold hover:bg-gold/8 rounded-full gap-2">
                <Heart className="h-4 w-4" />
                Donate
              </Button>
            </Link>
            <Link to="/buy-your-ticket" onClick={() => trackEvent("final_cta_click", { cta: "tickets", to: "/buy-your-ticket", location: "final_cta" })}>
              <Button variant="ghost" className="text-gold/60 hover:text-gold hover:bg-gold/8 rounded-full gap-2">
                <Ticket className="h-4 w-4" />
                Get Gala Tickets
              </Button>
            </Link>
            <Link to="/vote" onClick={() => trackEvent("final_cta_click", { cta: "vote", to: "/vote", location: "final_cta" })}>
              <Button variant="ghost" className="text-gold/60 hover:text-gold hover:bg-gold/8 rounded-full gap-2">
                <Vote className="h-4 w-4" />
                Explore Recognition
              </Button>
            </Link>
          </div>


          <motion.div className="flex flex-wrap justify-center gap-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
            {[
              { icon: Globe, text: t("landing.finalCTA.trustIndicators.regions") },
              { icon: Users, text: t("landing.finalCTA.trustIndicators.nominees") },
              { icon: Calendar, text: t("landing.finalCTA.trustIndicators.years") },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-white/50">
                <item.icon className="h-4 w-4 text-gold/50" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}