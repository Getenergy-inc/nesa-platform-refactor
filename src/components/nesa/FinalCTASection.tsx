import { Award, ExternalLink, Rocket, Sparkles, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const floatingEmojis = ["✨", "🏆", "⭐", "🎯", "💫", "🌟"];

export function FinalCTASection() {
  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingEmojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-float-emoji opacity-20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Fun animated icon */}
          <motion.div 
            className="h-20 w-20 rounded-3xl bg-gradient-to-br from-gold/30 to-purple-500/30 flex items-center justify-center mx-auto mb-6 glass-dark"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">🏆</span>
          </motion.div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Nominate a Champion <span className="text-gradient-fun">of Education</span>
            <span className="inline-block ml-2 animate-wiggle">✨</span>
          </h2>
          
          <p className="text-white/70 text-lg mb-8">
            Know someone making an exceptional impact in African education? 🌍 
            <br />Submit your nomination today and help us celebrate excellence! 
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/nominate" className="group">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-gold via-yellow-400 to-gold hover:from-gold-dark hover:to-gold-dark text-charcoal font-bold rounded-full px-10 gap-2 shadow-gold hover:shadow-[0_0_40px_rgba(201,162,39,0.5)] transition-all hover-pop animate-gradient-shift min-h-[56px] text-lg"
                style={{ backgroundSize: '200% 200%' }}
              >
                <Rocket className="h-5 w-5 group-hover:animate-bounce-fun" />
                Submit Nomination 🚀
              </Button>
            </Link>
            <a href="https://nesa.africa" target="_blank" rel="noopener noreferrer" className="group">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gold text-gold hover:bg-gold/20 rounded-full px-10 gap-2 hover-pop transition-all min-h-[56px] text-lg hover:shadow-[0_0_30px_rgba(201,162,39,0.3)]"
              >
                <ExternalLink className="h-5 w-5 group-hover:animate-wiggle" />
                Visit NESA Africa
              </Button>
            </a>
          </div>

          {/* Fun trust indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            {[
              { emoji: "🌍", text: "54 Countries" },
              { emoji: "🏆", text: "2,500+ Nominees" },
              { emoji: "⭐", text: "15+ Years" },
            ].map((item, i) => (
              <div 
                key={item.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-sm text-white/70 hover:text-white transition-colors cursor-default hover-pop"
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
