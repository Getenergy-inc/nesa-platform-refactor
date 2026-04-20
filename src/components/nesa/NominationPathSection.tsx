import { Award, Vote, Users, Check, ArrowRight, Shield, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion } from "framer-motion";

export function NominationPathSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();

  const nominationPaths = [
    {
      icon: Award,
      badge: "Lifetime Achievement",
      title: "Africa Icon Blue Garnet Award",
      period: `2005–${currentEdition.displayYear}`,
      description: "Reserved for lifetime achievement. Nominees must have 10+ years of institutional achievements.",
      bullets: [
        "Institutional Achievements",
        "Long-term Impact",
        "Legacy Recognition"
      ],
      cta: { label: "Nominate an Icon", href: "/nominate?tier=icon" },
      secondaryCta: null,
      accentColor: "bg-blue-600",
    },
    {
      icon: Vote,
      badge: "Public Voting",
      title: "Blue Garnet & Gold Certificate Awards",
      period: "Annual Competition",
      description: "Open competition with public participation through AGC voting and expert judging.",
      bullets: [
        "Nominate verified changemakers",
        "Earn voting points through participation",
        "Vote with AGC during official public voting windows",
        "Winners protected by integrity controls"
      ],
      cta: { label: "Nominate for Voting Categories", href: "/nominate?tier=voting" },
      secondaryCta: { label: "Learn How Voting Works", href: "/about-agc" },
      accentColor: "bg-gold",
    },
    {
      icon: Users,
      badge: "Expert Selection",
      title: "Platinum Certificate of Recognition",
      period: "Merit-Based",
      description: "Baseline recognition through institutional review. No public voting required.",
      bullets: [
        "Baseline recognition through institutional review",
        "No public voting",
        "Verification and governance checks"
      ],
      cta: { label: "Submit Platinum Nomination", href: "/nominate?tier=platinum" },
      secondaryCta: null,
      accentColor: "bg-slate-500",
    },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Choose Your Path
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            Choose Your Nomination Path
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Select the appropriate award category based on the nominee's achievements and recognition type.
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
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-gold/40 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-12 w-12 rounded-xl ${path.accentColor}/20 flex items-center justify-center`}>
                  <path.icon className="h-6 w-6 text-gold" />
                </div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                  {path.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gold transition-colors">{path.title}</h3>
              <p className="text-gold/80 text-sm mb-3">{path.period}</p>
              <p className="text-white/70 text-sm mb-4">{path.description}</p>

              <ul className="space-y-2 mb-6 flex-grow">
                {path.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="space-y-2 mt-auto">
                <Link to={path.cta.href}>
                  <Button className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full shadow-lg transition-all duration-300 group-hover:shadow-gold/20">
                    {path.cta.label}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {path.secondaryCta && (
                  <Link to={path.secondaryCta.href}>
                    <Button 
                      variant="ghost" 
                      className="w-full text-gold/80 hover:text-gold hover:bg-gold/10 rounded-full text-sm"
                    >
                      {path.secondaryCta.label}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
