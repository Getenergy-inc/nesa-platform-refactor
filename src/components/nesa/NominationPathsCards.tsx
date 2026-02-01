import { Award, Vote, Users, Check, ArrowRight, Trophy, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion } from "framer-motion";

export function NominationPathsCards() {
  const { currentEdition } = useSeason();

  const paths = [
    {
      icon: Star,
      badge: "Lifetime Achievement",
      title: "Africa Icon",
      subtitle: "Blue Garnet Award (2005–" + currentEdition.displayYear + ")",
      features: [
        "10+ years institutional achievements",
        "Legacy recognition",
        "Expert panel selection"
      ],
      cta: { label: "Nominate an Icon", href: "/nominate?tier=icon" },
      accent: "blue",
    },
    {
      icon: Vote,
      badge: "Public Voting",
      title: "Blue Garnet & Gold",
      subtitle: "Annual Competition",
      features: [
        "Earn voting points through participation",
        "Vote with AGC during official windows",
        "Jury + public weighting (Blue Garnet)"
      ],
      cta: { label: "Nominate for Voting", href: "/nominate?tier=voting" },
      secondaryCta: { label: "How Voting Works", href: "/about-agc" },
      accent: "gold",
      featured: true,
    },
    {
      icon: Shield,
      badge: "Expert Selection",
      title: "Platinum Certificate",
      subtitle: "Merit-Based Recognition",
      features: [
        "Baseline recognition",
        "No public voting required",
        "Governance verification"
      ],
      cta: { label: "Submit Platinum Nomination", href: "/nominate?tier=platinum" },
      accent: "slate",
    },
  ];

  const getAccentClasses = (accent: string, featured?: boolean) => {
    switch (accent) {
      case 'blue':
        return {
          border: featured ? 'border-blue-500/50' : 'border-blue-500/20',
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          button: 'bg-blue-500 hover:bg-blue-600 text-white',
        };
      case 'gold':
        return {
          border: featured ? 'border-gold/50 ring-2 ring-gold/20' : 'border-gold/20',
          bg: 'bg-gold/10',
          text: 'text-gold',
          button: 'bg-gold hover:bg-gold-dark text-charcoal',
        };
      default:
        return {
          border: 'border-white/20',
          bg: 'bg-white/5',
          text: 'text-white/70',
          button: 'bg-white/10 hover:bg-white/20 text-white',
        };
    }
  };

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Choose Your Path
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            Start Your Nomination Journey
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Select the appropriate award category based on the nominee's achievements.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {paths.map((path, index) => {
            const classes = getAccentClasses(path.accent, path.featured);
            
            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border ${classes.border} flex flex-col hover:bg-white/10 transition-all`}
              >
                {/* Featured Badge */}
                {path.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold rounded-full text-charcoal text-xs font-bold">
                    Most Popular
                  </div>
                )}

                {/* Icon & Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-12 w-12 rounded-xl ${classes.bg} flex items-center justify-center`}>
                    <path.icon className={`h-6 w-6 ${classes.text}`} />
                  </div>
                </div>

                <span className={`text-xs font-semibold ${classes.text} uppercase tracking-wider mb-2`}>
                  {path.badge}
                </span>

                <h3 className="text-xl font-bold text-white mb-1">{path.title}</h3>
                <p className="text-white/50 text-sm mb-4">{path.subtitle}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-grow">
                  {path.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className={`h-4 w-4 ${classes.text} flex-shrink-0 mt-0.5`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="space-y-2 mt-auto">
                  <Link to={path.cta.href} className="block">
                    <Button className={`w-full ${classes.button} font-semibold rounded-full shadow-lg gap-2`}>
                      {path.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {path.secondaryCta && (
                    <Link to={path.secondaryCta.href} className="block">
                      <Button 
                        variant="ghost" 
                        className={`w-full ${classes.text} hover:bg-white/5 rounded-full text-sm`}
                      >
                        {path.secondaryCta.label}
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
