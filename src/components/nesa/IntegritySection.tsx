import { Shield, Vote, Scale, Users, AlertTriangle, Lock, Eye, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

export function IntegritySection() {
  const firewalls = [
    {
      icon: Shield,
      title: "Platinum",
      description: "Non-competitive. Verification + governance checks.",
      color: "slate",
    },
    {
      icon: Vote,
      title: "Gold",
      description: "Public participation only. Transparent audit trail.",
      color: "amber",
    },
    {
      icon: Scale,
      title: "Blue Garnet",
      description: "Jury + public participation balance. Anti-fraud controls.",
      color: "blue",
    },
    {
      icon: Users,
      title: "Sponsors",
      description: "Sponsors and endorsers cannot influence winners.",
      color: "emerald",
    },
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case 'amber': return 'text-amber-400';
      case 'blue': return 'text-blue-400';
      case 'emerald': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <section className="bg-charcoal-light py-16 md:py-20 border-y border-gold/10">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Lock className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-white/80">Governance & Integrity</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Firewalls & Transparency
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Merit-based integrity controls protect every stage of the awards process.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {firewalls.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-charcoal rounded-xl p-5 border border-white/10 hover:border-gold/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                <item.icon className={`h-5 w-5 ${getIconColor(item.color)}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Verification Features */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {[
            { icon: Eye, label: "Full Audit Trail" },
            { icon: FileCheck, label: "Verified Credentials" },
            { icon: Lock, label: "Secure Voting" },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center gap-2 text-white/60 text-sm">
              <feature.icon className="h-4 w-4 text-gold" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* AGC Disclaimer */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning">
              <span className="font-semibold">AGC is non-tradeable</span>—no withdrawals, no cash-out, no payouts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
