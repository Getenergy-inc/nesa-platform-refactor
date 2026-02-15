import { Shield, Vote, Scale, Users, AlertTriangle, Lock, Eye, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import firewallImg from "@/assets/cards/firewall-governance.jpg";
import goldAuditImg from "@/assets/cards/gold-public-voting.jpg";
import antifraudImg from "@/assets/cards/firewall-antifraud.jpg";
import sponsorsImg from "@/assets/cards/firewall-sponsors.jpg";

export function IntegritySection() {
  const firewalls = [
    {
      icon: Shield,
      title: "Platinum",
      description: "Non-competitive. Verification + governance checks.",
      iconColor: "text-ivory/60",
      image: firewallImg,
    },
    {
      icon: Vote,
      title: "Gold",
      description: "Public participation only. Transparent audit trail.",
      iconColor: "text-primary",
      image: goldAuditImg,
    },
    {
      icon: Scale,
      title: "Blue Garnet",
      description: "Jury + public participation balance. Anti-fraud controls.",
      iconColor: "text-accent",
      image: antifraudImg,
    },
    {
      icon: Users,
      title: "Sponsors",
      description: "Sponsors and endorsers cannot influence winners.",
      iconColor: "text-primary/70",
      image: sponsorsImg,
    },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20 border-y border-white/5">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Lock className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-white/80">Governance & Integrity</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Firewalls & Transparency
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Merit-based integrity controls protect every stage of the awards process.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {firewalls.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bg-white/3 rounded-xl border border-white/8 hover:border-gold/20 transition-colors group overflow-hidden"
            >
              <div className="relative h-28 w-full overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
                <div className="absolute bottom-3 left-4 h-9 w-9 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <item.icon className={`h-4 w-4 ${item.iconColor} group-hover:text-gold transition-colors`} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {[
            { icon: Eye, label: "Full Audit Trail" },
            { icon: FileCheck, label: "Verified Credentials" },
            { icon: Lock, label: "Secure Voting" },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center gap-2 text-white/50 text-sm">
              <feature.icon className="h-4 w-4 text-gold/60" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-warning/5 border border-warning/15">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
            <p className="text-xs text-warning/80">
              <span className="font-semibold">AGC is non-tradeable</span>—no withdrawals, no cash-out, no payouts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
