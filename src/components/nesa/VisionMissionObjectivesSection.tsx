/**
 * VisionMissionObjectivesSection — homepage summary of NESA-Africa's Vision,
 * Mission, and 4 Strategic Objectives. Detail lives on /about.
 *
 * Copy is canonical per the 2026 Capability Statement — sourced from
 * src/content/capability2026.ts. Do not paraphrase.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Target, CheckCircle2, ChevronDown } from "lucide-react";
import {
  VISION,
  MISSION,
  STRATEGIC_OBJECTIVES,
} from "@/content/capability2026";

export function VisionMissionObjectivesSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-14 md:py-20 bg-charcoal-light/20 border-y border-gold/10">
      <div className="container mx-auto px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-4 text-left group"
        >
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
              What guides us
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mt-1 group-hover:text-gold transition-colors">
              Vision, Mission &amp; Strategic Objectives
            </h2>
          </div>
          <ChevronDown
            className={`h-6 w-6 text-gold shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`grid transition-all duration-500 ease-in-out ${open ? "grid-rows-[1fr] opacity-100 mt-8" : "grid-rows-[0fr] opacity-0 mt-0"}`}
        >
          <div className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-8">
              <div className="rounded-2xl border border-gold/25 bg-charcoal/60 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-lg font-bold text-ivory">{VISION.title}</h3>
                </div>
                <p className="text-ivory/80 text-sm leading-relaxed">{VISION.body}</p>
              </div>
              <div className="rounded-2xl border border-gold/25 bg-charcoal/60 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-lg font-bold text-ivory">{MISSION.title}</h3>
                </div>
                <p className="text-ivory/80 text-sm leading-relaxed">{MISSION.body}</p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              <h3 className="text-center text-ivory/80 text-sm uppercase tracking-wider mb-4">
                4 Strategic Objectives
              </h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {STRATEGIC_OBJECTIVES.map((o) => (
                  <li
                    key={o.number}
                    className="flex items-start gap-3 rounded-lg border border-gold/15 bg-charcoal/50 px-4 py-3 text-ivory/85 text-sm leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-1" />
                    <span>
                      <span className="text-gold/70 font-mono mr-2">{o.number}</span>
                      <span className="font-semibold text-ivory">{o.title}.</span>{" "}
                      <span className="text-ivory/80">{o.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="text-center mt-6">
              <Link to="/about#mission" className="text-gold text-sm hover:underline">
                Read the full Vision &amp; Mission →
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisionMissionObjectivesSection;
