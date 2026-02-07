import { Link } from "react-router-dom";
import { Users, Trophy, Play, Award, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const paths = [
  {
    icon: Users,
    title: "Browse Nominees",
    description: "Discover 1,760+ education champions across 5 regions",
    href: "/nominees",
    color: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/30",
  },
  {
    icon: Trophy,
    title: "Explore Awards",
    description: "Learn about Platinum, Gold, Blue Garnet & Icon recognition tiers",
    href: "/categories",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    icon: Play,
    title: "Watch NESA TV",
    description: "Live shows, webinars, and award ceremonies",
    href: "/media/tv",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    icon: Award,
    title: "Nominate Someone",
    description: "Recognize an education champion making a difference",
    href: "/nominate",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
];

/**
 * StartHereSection - First-time visitor orientation
 * 
 * Provides clear entry points for new users to understand
 * what NESA is and how to get started.
 */
export function StartHereSection() {
  return (
    <section className="bg-charcoal py-12 md:py-16 border-y border-gold/10">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-4">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">New to NESA?</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Start Your Journey Here
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            NESA-Africa recognizes education champions transforming learning across the continent. 
            Choose your path below to get started.
          </p>
        </div>

        {/* Paths Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link to={path.href}>
                <div className={`group relative h-full bg-white/5 rounded-xl p-6 border ${path.borderColor} hover:bg-white/10 hover:shadow-lg hover:shadow-${path.color.replace('text-', '')}/10 transition-all duration-300`}>
                  {/* Icon with hover animation */}
                  <motion.div 
                    className={`h-12 w-12 rounded-xl ${path.bgColor} flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path.icon className={`h-6 w-6 ${path.color}`} />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {path.description}
                  </p>

                  {/* Arrow with slide animation */}
                  <div className="flex items-center gap-1 text-sm text-white/40 group-hover:text-gold transition-all">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  
                  {/* Subtle glow on hover */}
                  <div className={`absolute inset-0 rounded-xl ${path.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl -z-10`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* How It Works Mini */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4 text-center">How NESA Works</h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-center">
            {[
              { step: "1", label: "Browse", desc: "Explore nominees" },
              { step: "2", label: "Nominate", desc: "Submit a champion" },
              { step: "3", label: "Vote", desc: "Support with AGC" },
              { step: "4", label: "Celebrate", desc: "Watch the gala" },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold font-bold">{item.step}</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  <p className="text-white/50 text-xs">{item.desc}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="h-4 w-4 text-white/20 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
