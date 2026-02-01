import { Link } from "react-router-dom";
import { Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CampaignBanner() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-charcoal via-charcoal-dark to-charcoal">
      {/* Background accent */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
      </div>
      
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <Award className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">2025 Season Open</span>
          </div>
          
          {/* Headline */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            NESA-Africa 2025 –{" "}
            <span className="text-gold">Now Accepting Nominations</span>
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 mb-6 max-w-3xl mx-auto leading-relaxed">
            New nominations and <span className="text-gold font-semibold">Platinum re-nominations</span> across all 17 categories are now open.
          </p>
          
          {/* Platinum highlight */}
          <div className="inline-flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-8 text-left max-w-2xl">
            <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-white/70 text-sm md:text-base">
              The <span className="text-white font-medium">Africa Education for All Platinum Certificate</span> recognises verified, scalable, and equitable impact in education across Africa.
            </p>
          </div>
          
          {/* CTA */}
          <Link to="/nominate">
            <Button 
              size="lg" 
              className="bg-gold hover:bg-gold-dark text-charcoal font-bold text-lg px-10 py-6 rounded-full shadow-gold group"
            >
              <Award className="h-5 w-5 mr-2" />
              NOMINATE NOW
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
