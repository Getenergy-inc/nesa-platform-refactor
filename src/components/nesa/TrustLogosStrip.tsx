import { Shield, Users, Globe, Calendar, Handshake, Star, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import csacefa from "@/assets/endorsements/csacefa.png";
import faweKenya from "@/assets/endorsements/fawe-kenya.png";
import { GOVERNANCE_STATS } from "@/lib/regions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Endorser {
  id: string;
  name: string;
  logo: string;
  country?: string;
  website?: string;
  isActive: boolean;
}

const endorsers: Endorser[] = [
  { id: "csacefa", name: "Civil Society Action Coalition on Education for All", logo: csacefa, country: "Nigeria", isActive: true },
  { id: "fawe-kenya", name: "Forum for African Women Educationalists - Kenya", logo: faweKenya, country: "Kenya", isActive: true },
];

interface SponsorLogo {
  id: string;
  name: string;
  tier: "platinum" | "gold" | "silver" | "bronze" | "media" | "strategic";
  isActive: boolean;
}

const sponsors: SponsorLogo[] = [
  { id: "scef", name: "Santos Creations Educational Foundation", tier: "platinum", isActive: true },
  { id: "gfa-wzip", name: "GFA Wzip", tier: "gold", isActive: true },
  { id: "getenergy", name: "GetEnergy.ng", tier: "silver", isActive: true },
  { id: "pancokrato", name: "PancoKrato Integrated Services", tier: "bronze", isActive: true },
];

const quickStats = [
  { icon: Globe, value: "10", label: "Regions" },
  { icon: Users, value: `${GOVERNANCE_STATS.judges}`, label: "Judges" },
  { icon: Star, value: "1,760+", label: "Nominees" },
  { icon: Calendar, value: "15+", label: "Years" },
];

const tierColors: Record<string, string> = {
  platinum: "border-slate-400/40 text-slate-300",
  gold: "border-gold/40 text-gold",
  silver: "border-slate-400/40 text-slate-400",
  bronze: "border-amber-700/40 text-amber-700",
};

/**
 * TrustLogosStrip — Credibility bar directly under hero
 * 
 * Warm, scannable design with endorsers + partners + stats.
 * Grayscale → color on hover for premium feel.
 */
export function TrustLogosStrip() {
  const activeEndorsers = endorsers.filter((e) => e.isActive);
  const activeSponsors = sponsors.filter((s) => s.isActive);

  return (
    <TooltipProvider>
      <section className="relative bg-gradient-to-b from-charcoal to-charcoal-light/30 border-b border-white/5 py-6 overflow-hidden" data-event="endorsement-strip-view">
        {/* Subtle gold accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <div className="container">
          {/* Header Label */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Shield className="h-3.5 w-3.5 text-gold/60" />
            <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">
              Trusted by Endorsers, Institutions &amp; Strategic Partners
            </span>
          </motion.div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mb-5">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
              >
                <stat.icon className="h-3.5 w-3.5 text-gold/60" />
                <span className="text-gold font-bold text-sm">{stat.value}</span>
                <span className="text-white/40 text-xs hidden sm:inline">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Endorsers + Sponsors Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Endorser Logos */}
            {activeEndorsers.map((endorser, index) => (
              <Tooltip key={endorser.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/4 border border-white/8 hover:border-gold/30 hover:bg-white/8 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.08 }}
                  >
                    <img
                      src={endorser.logo}
                      alt={endorser.name}
                      className="h-8 sm:h-9 w-auto object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                    />
                    <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors hidden sm:inline">
                      {endorser.name.split(' ').slice(0, 3).join(' ')}...
                    </span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-charcoal border-gold/30">
                  <p className="text-sm font-medium text-white">{endorser.name}</p>
                  {endorser.country && <p className="text-xs text-gold">{endorser.country} • Endorser</p>}
                </TooltipContent>
              </Tooltip>
            ))}
            
            {/* Separator */}
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            
            {/* Sponsor Pills */}
            {activeSponsors.map((sponsor, index) => (
              <Tooltip key={sponsor.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-105 ${tierColors[sponsor.tier] || "border-white/20 text-white/50"}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.06 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                  >
                    {sponsor.name}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-charcoal border-gold/30">
                  <p className="text-sm font-medium text-white">{sponsor.name}</p>
                  <p className="text-xs text-gold capitalize">{sponsor.tier} Partner</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
