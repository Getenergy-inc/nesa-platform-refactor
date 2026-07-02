// Award integrity firewall + transparency pillars.
// Reinforces that sponsors/judges/donors cannot influence outcomes.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Eye,
  Lock,
  FileText,
  AlertTriangle,
  Scale,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PILLARS = [
  { icon: Eye, label: "Transparency", href: "/governance#transparency" },
  { icon: ShieldCheck, label: "Safeguarding", href: "/governance#safeguarding" },
  { icon: Lock, label: "Data Protection", href: "/governance#data" },
  { icon: Scale, label: "Conflict of Interest", href: "/governance#coi" },
  { icon: AlertTriangle, label: "Anti-Bribery", href: "/governance#anti-bribery" },
  { icon: FileText, label: "Reporting", href: "/governance#reporting" },
];

const CANNOT_INFLUENCE = [
  "Nominations",
  "Voting",
  "Judging",
  "Finalists",
  "Winners",
];

export function GovernanceFirewallSection() {
  return (
    <section
      aria-labelledby="governance-heading"
      className="bg-charcoal py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Left: Firewall callout */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className={cn(
              "relative rounded-2xl border border-gold/30 p-6 md:p-8",
              "bg-gradient-to-br from-gold/10 via-charcoal-light/30 to-charcoal",
            )}
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 border border-gold/40 text-gold mb-4">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2">
              Award Integrity
            </p>
            <h2
              id="governance-heading"
              className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4"
            >
              A Firewall You Can <span className="text-gold">Trust.</span>
            </h2>
            <p className="text-gold text-sm md:text-base font-semibold mb-3">
              Sponsorship does not influence winners.
            </p>
            <p className="text-white/75 text-sm md:text-base leading-relaxed mb-5">
              Sponsors, partners, donors, volunteers, judges, and contributors
              <span className="text-gold font-semibold"> cannot influence</span>:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {CANNOT_INFLUENCE.map((item) => (
                <li
                  key={item}
                  className="px-3 py-2 rounded-lg bg-charcoal/70 border border-gold/15 text-white/85 text-xs md:text-sm text-center"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/55 text-xs leading-relaxed">
              Outcomes are governed by the NRC review engine, EDI scoring matrix,
              independent jury panels, and audited AGC voting — every decision
              logged and verifiable.
            </p>
          </motion.div>

          {/* Right: pillars grid */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2">
              Governance Pillars
            </p>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-5">
              Six Public Commitments
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {PILLARS.map((p, idx) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <Link
                    to={p.href}
                    className="group flex items-start gap-3 p-3 md:p-4 rounded-xl border border-gold/15 bg-charcoal/60 hover:border-gold/40 hover:bg-charcoal-light/40 transition-all"
                  >
                    <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                      <p.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-white/90 text-sm font-medium leading-tight pt-1.5">
                      {p.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link
              to="/governance"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-colors"
            >
              Read Full Governance Framework
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GovernanceFirewallSection;
