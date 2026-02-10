import { ShieldCheck, CalendarCheck, Vote, Building } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified Nominations",
    description: "Every nominee passes independent NRC screening.",
  },
  {
    icon: CalendarCheck,
    title: "Daily Engagement",
    description: "Consistent participation unlocks voting power.",
  },
  {
    icon: Vote,
    title: "Transparent Voting",
    description: "Public votes recorded with full audit trail.",
  },
  {
    icon: Building,
    title: "Real-World Legacy",
    description: "Awards fund school rebuilds across Africa.",
  },
];

export function WhyPeopleReturnStrip() {
  return (
    <section className="bg-charcoal-light/50 py-12 md:py-16 border-y border-white/5">
      <div className="container">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white text-center mb-10">
          Why People <span className="text-gold">Return</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center mb-3">
                <reason.icon className="h-6 w-6 text-gold" />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{reason.title}</h4>
              <p className="text-white/50 text-xs leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
