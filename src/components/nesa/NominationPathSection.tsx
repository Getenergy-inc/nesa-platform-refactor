import { Award, Vote, Users, Check, Rocket, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion } from "framer-motion";

interface PathCard {
  icon: React.ElementType;
  badge: string;
  title: string;
  period: string;
  description: string;
  bullets: string[];
  emoji: string;
  gradient: string;
}

function buildNominationPaths(displayYear: number): PathCard[] {
  return [
    {
      icon: Award,
      badge: "Lifetime Achievement",
      title: "Africa Icon Blue Garnet Award",
      period: `2005–${displayYear}`,
      description: "Reserved for lifetime achievement. Nominees must have 10+ years institutional achievements.",
      bullets: ["Institutional Achievements", "Long-term Impact", "Legacy Recognition"],
      emoji: "👑",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Vote,
      badge: "Public Voting",
      title: "Blue Garnet & Gold Certificate Awards",
      period: "Annual Competition",
      description: "Open competition with public participation through AGC voting and expert judging.",
      bullets: ["Public Voting", "Expert Judging", "138+ Subcategories"],
      emoji: "🗳️",
      gradient: "from-gold/20 to-yellow-500/20",
    },
    {
      icon: Users,
      badge: "Expert Selection",
      title: "Platinum Certificate of Recognition",
      period: "Merit-Based",
      description: "Merit-based recognition through expert panel evaluation and institutional review.",
      bullets: ["No Voting", "Internal Judging", "Global Nomination"],
      emoji: "🎖️",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
  ];
}

export function NominationPathSection() {
  const { currentEdition } = useSeason();
  const nominationPaths = buildNominationPaths(currentEdition.displayYear);

  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      {/* Fun background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[5%] text-5xl opacity-10 animate-float-emoji">🏆</div>
        <div className="absolute bottom-10 right-[5%] text-5xl opacity-10 animate-float-emoji" style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-gold animate-bounce-fun" />
            <span className="text-gold font-medium">Start Your Journey</span>
            <Rocket className="w-5 h-5 text-gold animate-bounce-fun" style={{ animationDelay: '0.2s', transform: 'scaleX(-1)' }} />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Nomination Path <span className="inline-block animate-wiggle">🎯</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Select the appropriate award category based on the nominee's achievements and recognition type ✨
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {nominationPaths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className={`group glass-dark rounded-2xl p-6 border-2 border-transparent hover:border-gold/50 transition-all hover:shadow-[0_0_40px_rgba(201,162,39,0.15)] hover-pop bg-gradient-to-br ${path.gradient}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-charcoal/50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {path.emoji}
                </div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider px-3 py-1 rounded-full bg-gold/10">
                  {path.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gold transition-colors">{path.title}</h3>
              <p className="text-gold text-sm mb-3 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {path.period}
              </p>
              <p className="text-white/70 text-sm mb-4">{path.description}</p>

              <ul className="space-y-2 mb-6">
                {path.bullets.map((bullet, i) => (
                  <motion.li 
                    key={bullet} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <Check className="h-4 w-4 text-gold flex-shrink-0" />
                    {bullet}
                  </motion.li>
                ))}
              </ul>

              <Link to="/nominate">
                <Button className="w-full bg-gradient-to-r from-gold via-yellow-400 to-gold hover:from-gold-dark hover:to-gold-dark text-charcoal font-bold rounded-full shadow-gold group-hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] transition-all animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                  <Trophy className="w-4 h-4 mr-2" />
                  Nominate Now 🚀
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
