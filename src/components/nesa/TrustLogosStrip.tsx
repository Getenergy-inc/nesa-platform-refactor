import { Shield, Users, Globe, Calendar, Handshake } from "lucide-react";
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
  { icon: Globe, value: "7", label: "Regions" },
  { icon: Users, value: `${GOVERNANCE_STATS.judges}`, label: "Judges" },
  { icon: Calendar, value: "15+", label: "Years" },
];

const tierColors: Record<string, string> = {
  platinum: "border-slate-300 text-slate-300",
  gold: "border-gold text-gold",
  silver: "border-slate-400 text-slate-400",
  bronze: "border-amber-700 text-amber-700",
};

export function TrustLogosStrip() {
  const activeEndorsers = endorsers.filter((e) => e.isActive);
  const activeSponsors = sponsors.filter((s) => s.isActive);

  return (
    <TooltipProvider>
      <section className="bg-charcoal border-b border-white/5 py-5 overflow-hidden" data-event="endorsement-strip-view">
        <div className="container">
          <div className="flex flex-col gap-5">
            {/* Top Row: Endorsers + Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <motion.span
                  className="text-xs text-white/40 uppercase tracking-wider shrink-0 flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Shield className="h-3.5 w-3.5 text-gold/60" />
                  Endorsed &amp; Trusted By
                </motion.span>
                <div className="flex items-center gap-6">
                  {activeEndorsers.map((endorser, index) => (
                    <Tooltip key={endorser.id}>
                      <TooltipTrigger asChild>
                        <motion.img
                          src={endorser.logo}
                          alt={endorser.name}
                          className="h-9 sm:h-11 w-auto object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 0.7, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ opacity: 1 }}
                          data-event="endorsement-logo-hover"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-charcoal border-gold/30">
                        <p className="text-sm font-medium text-white">{endorser.name}</p>
                        {endorser.country && <p className="text-xs text-white/60">{endorser.country}</p>}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

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

            {/* Bottom Row: Sponsors & Partners */}
            {activeSponsors.length > 0 && (
              <div className="flex items-center gap-4 sm:gap-6 pt-3 border-t border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-wider shrink-0 flex items-center gap-2">
                  <Handshake className="h-3.5 w-3.5 text-gold/60" />
                  Our Partners
                </span>
                <div className="flex items-center gap-4 flex-wrap">
                  {activeSponsors.map((sponsor) => (
                    <Tooltip key={sponsor.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer ${tierColors[sponsor.tier] || "border-white/30 text-white/60"}`}
                          data-event="endorsement-logo-hover"
                        >
                          {sponsor.name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-charcoal border-gold/30">
                        <p className="text-sm font-medium text-white">{sponsor.name}</p>
                        <p className="text-xs text-gold capitalize">{sponsor.tier} Partner</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
