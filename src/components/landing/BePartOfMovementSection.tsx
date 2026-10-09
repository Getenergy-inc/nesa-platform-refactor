import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Handshake, Globe2, GraduationCap } from "lucide-react";

const ROLES = [
  { icon: Users, label: "Volunteer", href: "/volunteer", color: "from-gold/20 to-transparent" },
  { icon: Handshake, label: "Become a Partner", href: "/sponsors", color: "from-ivory/15 to-transparent" },
  { icon: Globe2, label: "Ambassador Program", href: "/ambassadors", color: "from-gold/20 to-transparent" },
  { icon: GraduationCap, label: "Judge / Reviewer", href: "/judges", color: "from-ivory/15 to-transparent" },
];

export function BePartOfMovementSection() {
  return (
    <section className="py-14 md:py-20 bg-charcoal">
      <div className="container mx-auto px-4 text-center">
        <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
          Join the movement
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2 mb-3">
          Be Part of NESA-Africa
        </h2>
        <p className="text-ivory/65 max-w-2xl mx-auto mb-10 text-sm md:text-base">
          The New Education Standard is built by a continent-wide coalition.
          Pick the role that fits you.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {ROLES.map((r, i) => (
            <motion.div
              key={r.href}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={r.href}
                className={`group block rounded-2xl border border-gold/20 hover:border-gold/60 bg-gradient-to-br ${r.color} p-6 transition-all hover:-translate-y-1`}
              >
                <r.icon className="w-7 h-7 text-gold mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-ivory text-sm">{r.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BePartOfMovementSection;
