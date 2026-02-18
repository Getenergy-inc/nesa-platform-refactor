// Rebuild My School Africa — Canonical Hub Page
// /eduaid-africa/rebuild-my-school

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Shield, ChevronRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  REBUILD_MILESTONES,
  REBUILD_REGIONS,
  REBUILD_FUND_FLOW,
  REBUILD_BADGES,
  REBUILD_STATUS_FLOW,
} from "@/config/rebuildConfig";
import { SPECIAL_NEEDS_TRACKS } from "@/config/specialNeedsCategories";
import africaMapImg from "@/assets/africa-map-silhouette.png";

export default function RebuildHubPage() {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>Rebuild My School Africa | EduAid-Africa Post-Award Legacy</title>
        <meta
          name="description"
          content="The official post-award legacy project of NESA-Africa 2025. Nominate special needs schools for EduAid-Africa intervention — governed by SCEF Regional BOD."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* ── Hero ── */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <img src={africaMapImg} alt="" className="w-[600px] h-auto opacity-[0.03]" aria-hidden="true" />
          </div>

          <div className="container relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Rebuild My School{" "}
              <span className="text-primary">Africa</span>
            </h1>

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

            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Nominations open {REBUILD_MILESTONES[0].displayDate}. Shortlisted schools go to public voting in{" "}
              {REBUILD_MILESTONES[1].displayDate}. Intervention begins {REBUILD_MILESTONES[2].displayDate}.
              Impact report published {REBUILD_MILESTONES[3].displayDate}.
            </p>
          </div>
        </section>

        {/* ── Governance Lifecycle ── */}
        <section id="governance" className="py-16 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-white/50 text-sm text-center mb-10 max-w-xl mx-auto">
              Every nomination passes through a transparent, governance-grade lifecycle.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {REBUILD_STATUS_FLOW.map((step, i) => (
                <div key={step.key} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <span className="inline-block w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold leading-6 mb-2">
                    {i + 1}
                  </span>
                  <p className="text-white text-[11px] font-semibold mb-0.5">{step.label}</p>
                  <p className="text-white/40 text-[10px] leading-snug">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline Band ── */}
        <section className="py-16 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Legacy <span className="text-primary">Timeline</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {REBUILD_MILESTONES.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative rounded-xl p-4 border border-primary/15 bg-primary/5 text-center"
                >
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-secondary text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <m.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-white text-xs font-semibold mb-0.5">{m.displayDate}</p>
                  <p className="text-white/50 text-[11px] leading-snug">{m.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5 Regional Portal Cards ── */}
        <section className="py-16 border-t border-primary/10">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Regional Nomination <span className="text-primary">Portals</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <p className="text-white/40 text-[10px] mb-2">{region.countries.length} countries</p>
                  <span className="inline-flex items-center gap-1 text-primary text-xs font-medium group-hover:underline">
                    Nominate a School <ChevronRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Special Needs Tracks ── */}
        <section className="py-16 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              Special Needs <span className="text-primary">Categories</span>
            </h2>
            <p className="text-white/50 text-sm text-center mb-10">
              5 Tracks · 20 Subcategories — select during nomination
            </p>

            <div className="space-y-3">
              {SPECIAL_NEEDS_TRACKS.map((track) => (
                <div key={track.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <button
                    onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                    className="flex items-center justify-between w-full p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <track.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-semibold">{track.name}</h4>
                        <p className="text-white/40 text-[11px]">{track.subcategories.length} subcategories</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-white/40 transition-transform", expandedTrack === track.id && "rotate-180")} />
                  </button>

                  <div className={cn("overflow-hidden transition-all duration-200", expandedTrack === track.id ? "max-h-[600px]" : "max-h-0")}>
                    <div className="px-4 pb-4 grid sm:grid-cols-2 gap-2">
                      {track.subcategories.map((sub) => (
                        <div key={sub.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/5">
                          <sub.icon className="h-4 w-4 text-primary/70 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white text-[11px] font-medium">{sub.name}</p>
                            <p className="text-white/40 text-[10px] leading-snug">{sub.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fund Flow ── */}
        <section className="py-16 border-t border-primary/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="rounded-xl border border-primary/15 bg-primary/5 p-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm font-medium">Fund Flow & Governance</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
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
          </div>
        </section>

        {/* ── Compliance Notice ── */}
        <section className="py-12 border-t border-primary/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <CheckCircle2 className="h-5 w-5 text-primary mx-auto mb-3" />
              <p className="text-white/60 text-xs leading-relaxed">
                No schools are pre-selected. All schools must be nominated and verified by SCEF Regional Boards
                before proceeding to public voting. This process ensures transparency, community ownership,
                and governance integrity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
