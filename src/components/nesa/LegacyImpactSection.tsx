import { Trophy, Vote, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import specialNeedsSchool from "@/assets/special-needs-school-africa.jpg";

export function LegacyImpactSection() {
  const actionPaths = [
    {
      icon: Trophy,
      title: "Nominate",
      description: "Recognize educators transforming special needs education in your region",
      cta: "Submit Nomination",
      link: "/nominate",
      color: "gold",
    },
    {
      icon: Vote,
      title: "Vote",
      description: "Support nominees with AGC votes to help them win recognition",
      cta: "Vote Now",
      link: "/vote",
      color: "blue",
    },
    {
      icon: Heart,
      title: "Support a School",
      description: "Fund inclusive education facilities in your Africa region",
      cta: "Donate to EduAid",
      link: "/donate",
      color: "emerald",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={specialNeedsSchool} 
          alt="Special needs school in Africa" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/90 via-charcoal/85 to-charcoal/95" />
      </div>
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
            Post-Award Legacy
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Rebuild My School <span className="text-emerald-400">Africa</span>
          </h2>
          <p className="text-white/80 text-lg">
            Every nomination, vote, and donation upgrades inclusive education facilities 
            for special needs students across Africa's regions.
          </p>
        </motion.div>

        {/* Three Action Paths */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {actionPaths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`
                relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border 
                ${path.color === 'gold' ? 'border-gold/30 hover:border-gold/50' : ''}
                ${path.color === 'blue' ? 'border-blue-500/30 hover:border-blue-500/50' : ''}
                ${path.color === 'emerald' ? 'border-emerald-500/30 hover:border-emerald-500/50' : ''}
                transition-all duration-300 hover:bg-white/10
              `}
            >
              {/* Icon */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center mb-4
                ${path.color === 'gold' ? 'bg-gold/20' : ''}
                ${path.color === 'blue' ? 'bg-blue-500/20' : ''}
                ${path.color === 'emerald' ? 'bg-emerald-500/20' : ''}
              `}>
                <path.icon className={`
                  h-7 w-7
                  ${path.color === 'gold' ? 'text-gold' : ''}
                  ${path.color === 'blue' ? 'text-blue-400' : ''}
                  ${path.color === 'emerald' ? 'text-emerald-400' : ''}
                `} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-bold text-white mb-2">
                {path.title}
              </h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                {path.description}
              </p>

              {/* CTA */}
              <Link to={path.link}>
                <Button 
                  className={`
                    w-full rounded-full gap-2 font-semibold
                    ${path.color === 'gold' ? 'bg-gold hover:bg-gold-dark text-charcoal' : ''}
                    ${path.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                    ${path.color === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
                  `}
                >
                  {path.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-white/50 text-sm mt-10"
        >
          Implemented via Santos Creations Educational Foundation • EduAid Programme
        </motion.p>
      </div>
    </section>
  );
}
