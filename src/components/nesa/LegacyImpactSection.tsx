// Landing page teaser for Rebuild My School Africa
// Config-driven, Gold/Black brand, no pre-named schools

import { ArrowRight, MapPin, Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { REBUILD_MILESTONES, REBUILD_REGIONS, REBUILD_FUND_FLOW, REBUILD_BADGES } from "@/config/rebuildConfig";
import africaMapImg from "@/assets/africa-map-silhouette.png";

export function LegacyImpactSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-charcoal">
      {/* Subtle Africa map backdrop */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <img src={africaMapImg} alt="" className="w-[600px] h-auto opacity-[0.03]" aria-hidden="true" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        {/* ── Header Block ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Rebuild My School{" "}
            <span className="text-primary">Africa</span>
          </h2>

          {/* Badge row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {REBUILD_BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-wider uppercase"
              >
                {badge}
              </span>
            ))}
          </div>

          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Nominations open {REBUILD_MILESTONES[0].displayDate}. Shortlisted schools go to public voting in{" "}
            {REBUILD_MILESTONES[1].displayDate}. Intervention begins {REBUILD_MILESTONES[2].displayDate}.
            Impact report published {REBUILD_MILESTONES[3].displayDate}.
          </p>
        </motion.div>

        {/* ── Timeline Band ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14 max-w-4xl mx-auto"
        >
          {REBUILD_MILESTONES.map((m, i) => (
            <div
              key={m.label}
              className="relative rounded-xl p-4 border border-primary/15 bg-primary/5 text-center"
            >
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-secondary text-[10px] font-bold">
                {i + 1}
              </span>
              <m.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-white text-xs font-semibold mb-0.5">{m.displayDate}</p>
              <p className="text-white/50 text-[11px] leading-snug">{m.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── 5 Regional Nomination Portal Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-14"
        >
          <h3 className="text-center text-white text-lg font-display font-bold mb-6">
            Regional Nomination Portals
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {REBUILD_REGIONS.map((region) => (
              <Link
                key={region.slug}
                to={`/eduaid-africa/rebuild-my-school/${region.slug}`}
                className="group rounded-xl border border-primary/20 bg-charcoal-light/30 hover:border-primary/40 hover:bg-primary/5 transition-all p-5 text-center"
              >
                <div className="w-10 h-10 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h4 className="text-sm font-display font-bold text-white mb-2">{region.name}</h4>
                <span className="inline-flex items-center gap-1 text-primary text-xs font-medium group-hover:underline">
                  Nominate a School <ChevronRight className="h-3 w-3" />
                </span>
                <Link
                  to={`/eduaid-africa/rebuild-my-school/${region.slug}#governance`}
                  onClick={(e) => e.stopPropagation()}
                  className="block text-white/40 text-[10px] mt-2 hover:text-primary/70 transition-colors"
                >
                  How selection works →
                </Link>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Governance Trust Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-start gap-3 mb-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm font-medium">Fund Flow & Governance</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {REBUILD_FUND_FLOW.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="text-white/70 text-xs">{step}</span>
                  {i < REBUILD_FUND_FLOW.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-primary/40" />
                  )}
                </span>
              ))}
            </div>
            <p className="text-white/40 text-[11px]">
              No funds are disbursed without formal board approval and audit logs.
            </p>
          </div>
        </motion.div>

        {/* ── Primary CTA ── */}
        <div className="text-center">
          <Button
            asChild
            className="rounded-full gap-2.5 font-semibold bg-primary hover:bg-primary/90 text-secondary px-8 py-3 text-base shadow-lg shadow-primary/20"
          >
            <Link to="/eduaid-africa/rebuild-my-school">
              Open Regional Nomination Portals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />
    </section>
  );
}
