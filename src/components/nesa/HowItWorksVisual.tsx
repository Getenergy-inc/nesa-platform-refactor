import { BookOpen, Award, Medal, Trophy, Star, Building, ArrowRight, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HowItWorksVisual() {
  const journey = [
    { 
      icon: BookOpen, 
      label: "Webinar", 
      description: "Public Education",
      color: "bg-slate-500"
    },
    { 
      icon: Award, 
      label: "Platinum", 
      description: "Baseline Recognition",
      color: "bg-slate-400"
    },
    { 
      icon: Star, 
      label: "Icon", 
      description: "Lifetime Achievement",
      color: "bg-purple-500"
    },
    { 
      icon: Medal, 
      label: "Gold", 
      description: "Public Voting",
      color: "bg-amber-500",
      hasAGC: true
    },
    { 
      icon: Trophy, 
      label: "Blue Garnet", 
      description: "Jury + Public",
      color: "bg-blue-500",
      hasAGC: true
    },
    { 
      icon: Building, 
      label: "Legacy", 
      description: "Rebuild Schools",
      color: "bg-emerald-500"
    },
  ];

  return (
    <section className="bg-charcoal-light py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            How NESA-Africa Works
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            From recognition to lasting impact—every step of the journey matters.
          </p>
        </div>

        {/* Visual Journey */}
        <div className="relative max-w-5xl mx-auto">
          {/* Desktop: Horizontal Flow */}
          <div className="hidden md:block">
            {/* Connection Line */}
            <div className="absolute top-12 left-12 right-12 h-0.5 bg-gradient-to-r from-slate-500 via-gold to-emerald-500 opacity-30" />
            
            <div className="grid grid-cols-6 gap-4">
              {journey.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon Circle */}
                  <div className={`relative z-10 h-24 w-24 rounded-2xl ${step.color}/10 border border-${step.color.replace('bg-', '')}/30 flex items-center justify-center mb-4 group hover:scale-110 transition-transform`}>
                    <step.icon className={`h-10 w-10 ${step.color.replace('bg-', 'text-').replace('-500', '-400').replace('-400', '-300')}`} />
                    
                    {/* AGC Badge */}
                    {step.hasAGC && (
                      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold flex items-center justify-center">
                        <Coins className="h-3 w-3 text-charcoal" />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-white font-semibold text-sm mb-1">{step.label}</h4>
                  <p className="text-white/50 text-xs">{step.description}</p>
                  
                  {/* Arrow (except last) */}
                  {index < journey.length - 1 && (
                    <ArrowRight className="absolute top-12 -right-4 h-4 w-4 text-gold/30 hidden lg:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Flow */}
          <div className="md:hidden space-y-4">
            {journey.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className={`h-12 w-12 rounded-xl ${step.color}/10 flex items-center justify-center shrink-0`}>
                  <step.icon className={`h-6 w-6 ${step.color.replace('bg-', 'text-').replace('-500', '-400')}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">{step.label}</h4>
                  <p className="text-white/50 text-xs">{step.description}</p>
                </div>
                {step.hasAGC && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold/10 border border-gold/30">
                    <Coins className="h-3 w-3 text-gold" />
                    <span className="text-gold text-xs font-medium">AGC</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* AGC Note */}
        <div className="flex items-center justify-center gap-2 mt-10 p-4 rounded-xl bg-gold/5 border border-gold/20 max-w-2xl mx-auto">
          <Coins className="h-5 w-5 text-gold flex-shrink-0" />
          <p className="text-sm text-white/80">
            Participation unlocks voting points. Voting uses AGC (non-tradeable) during official windows.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link to="/about">
            <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2">
              Learn More About the Process
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
