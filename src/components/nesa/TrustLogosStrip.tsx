import { Award, Shield, ChevronRight, Users, Globe, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import csacefa from "@/assets/endorsements/csacefa.png";
import faweKenya from "@/assets/endorsements/fawe-kenya.png";
import { GOVERNANCE_STATS } from "@/lib/regions";

// CMS-ready endorsement data structure
export interface Endorser {
  id: string;
  name: string;
  logo: string;
  country?: string;
  website?: string;
  endorsementDate?: string;
  isActive: boolean;
}

// Current endorsers - ready for CMS integration
const endorsers: Endorser[] = [
  { id: "csacefa", name: "Civil Society Action Coalition on Education for All", logo: csacefa, country: "Nigeria", isActive: true },
  { id: "fawe-kenya", name: "Forum for African Women Educationalists - Kenya", logo: faweKenya, country: "Kenya", isActive: true },
];

// Quick stats for trust building
const quickStats = [
  { icon: Globe, value: "7", label: "Regions" },
  { icon: Users, value: `${GOVERNANCE_STATS.judges}`, label: "Judges" },
  { icon: Calendar, value: "15+", label: "Years" },
];

export function TrustLogosStrip() {
  const activeEndorsers = endorsers.filter((e) => e.isActive);

  return (
    <section className="bg-charcoal border-b border-white/5 py-5 overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Endorsements */}
          <div className="flex items-center gap-4 sm:gap-6">
            <motion.span 
              className="text-xs text-white/40 uppercase tracking-wider shrink-0 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-3.5 w-3.5 text-gold/60" />
              Endorsed by
            </motion.span>
            <div className="flex items-center gap-6">
              {activeEndorsers.map((endorser, index) => (
                <motion.img
                  key={endorser.id}
                  src={endorser.logo}
                  alt={endorser.name}
                  className="h-9 sm:h-11 w-auto object-contain opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ opacity: 1 }}
                />
              ))}
            </div>
          </div>

          {/* Quick Stats - Desktop only */}
          <div className="hidden md:flex items-center gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-2 text-white/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <stat.icon className="h-4 w-4 text-gold/70" />
                <span className="text-gold font-bold">{stat.value}</span>
                <span className="text-xs">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
