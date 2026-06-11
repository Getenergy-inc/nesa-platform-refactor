import { Link } from "react-router-dom";
import { Users, Trophy, Play, Award, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import browseImg from "@/assets/cards/browse-nominees.jpg";
import exploreImg from "@/assets/cards/explore-awards.jpg";
import tvImg from "@/assets/cards/nesa-tv-live.jpg";
import nominateImg from "@/assets/cards/nominate-someone.jpg";

const paths = [
  {
    icon: Users,
    title: "Browse Nominees",
    description: "Discover 1,760+ education champions across 5 regions",
    href: "/nominees",
    color: "text-gold",
    borderColor: "border-gold/30",
    image: browseImg,
  },
  {
    icon: Trophy,
    title: "Explore Awards",
    description: "Learn about Platinum, Gold, Blue Garnet & Icon recognition tiers",
    href: "/categories",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    image: exploreImg,
  },
  {
    icon: Play,
    title: "Watch NESA TV",
    description: "Live shows, webinars, and award ceremonies",
    href: "/media/tv",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    image: tvImg,
  },
  {
    icon: Award,
    title: "Nominate Someone",
    description: "Recognize an education champion making a difference",
    href: "/nominate",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    image: nominateImg,
  },
];

export function StartHereSection() {
  return (
    <section className="bg-charcoal py-12 md:py-16 border-y border-gold/10">
      <div className="container">
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
                <div className={`group relative h-full bg-white/5 rounded-xl border ${path.borderColor} hover:bg-white/10 hover:shadow-lg transition-all duration-300 overflow-hidden`}>
                  {/* Card Image */}
                  <div className="relative h-36 w-full overflow-hidden">
                    <img src={path.image} alt={path.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <motion.div 
                        className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path.icon className={`h-5 w-5 ${path.color}`} />
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      {path.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-white/40 group-hover:text-gold transition-all">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
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
