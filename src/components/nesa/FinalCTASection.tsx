import { ArrowRight, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

export function FinalCTASection() {
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
            Know Someone Whose Work Deserves to Be Seen?
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Nominate a person or institution expanding education across Africa. It is free and takes about 10 minutes. Every nomination starts a review; it is not a win.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/nominate" className="group" onClick={() => trackEvent("final_cta_click", { cta: "nominate", to: "/nominate", location: "final_cta" })}>
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-10 gap-2.5 shadow-xl shadow-gold/25 hover:shadow-gold/40 transition-all min-h-[56px] text-lg">
                Submit a Nomination
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/get-involved" className="group" onClick={() => trackEvent("final_cta_click", { cta: "get_involved", to: "/get-involved", location: "final_cta" })}>
              <Button size="lg" variant="outline" className="border-2 border-gold/50 text-gold hover:bg-gold/10 hover:border-gold rounded-full px-10 gap-2.5 transition-all min-h-[56px] text-lg">
                Get Involved
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
