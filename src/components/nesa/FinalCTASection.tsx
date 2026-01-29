import { Award, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function FinalCTASection() {
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
            Nominate a Champion of <span className="text-gold">Education</span>
          </h2>
          
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Know someone making an exceptional impact in African education? 
            Submit your nomination today and help us celebrate excellence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/nominate" className="group">
              <Button 
                size="lg" 
                className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-10 gap-2 shadow-lg hover:shadow-gold/30 transition-all min-h-[56px] text-lg"
              >
                Submit Nomination
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="https://nesa.africa" target="_blank" rel="noopener noreferrer" className="group">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gold text-gold hover:bg-gold/10 rounded-full px-10 gap-2 transition-all min-h-[56px] text-lg"
              >
                <ExternalLink className="h-5 w-5" />
                Visit NESA Africa
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
              { text: "54 Countries" },
              { text: "2,500+ Nominees" },
              { text: "15+ Years of Vision Conception" },
            ].map((item) => (
              <div 
                key={item.text}
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
