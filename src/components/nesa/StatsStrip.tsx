import { motion } from "framer-motion";

const stats = [
  { value: "15+", label: "Years Running", emoji: "🎉", color: "from-gold to-yellow-400" },
  { value: "54", label: "African Countries", emoji: "🌍", color: "from-green-400 to-emerald-500" },
  { value: "17", label: "Award Categories", emoji: "🏆", color: "from-purple-400 to-pink-500" },
  { value: "141+", label: "Sub-Categories", emoji: "⭐", color: "from-cyan-400 to-blue-500" },
];

export function StatsStrip() {
  return (
    <section className="bg-charcoal border-y border-gold/20 py-12 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
              className="group text-center p-4 md:p-6 rounded-2xl glass-dark border-2 border-transparent hover:border-gold/50 transition-all cursor-default"
            >
              <div className="text-3xl md:text-4xl mb-2 animate-bounce-fun" style={{ animationDelay: `${index * 0.2}s` }}>
                {stat.emoji}
              </div>
              <p className={`text-3xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </p>
              <p className="text-sm text-white/70 group-hover:text-white transition-colors">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
