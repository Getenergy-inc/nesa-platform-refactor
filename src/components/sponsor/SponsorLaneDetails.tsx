// SponsorLaneDetails — Developer-ready, config-driven copy blocks for every
// NESA-Africa 2026 sponsorship lane. Reads from src/config/sponsorLaneCopy.ts
// so the page content is CMS/config-driven and stays in sync with the
// pricing table and slot matrix.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SPONSOR_LANE_COPY_LIST } from "@/config/sponsorLaneCopy";
import { trackEvent } from "@/lib/analytics";

export function SponsorLaneDetails() {
  return (
    <section
      id="lane-details"
      className="bg-charcoal py-14 md:py-20 border-t border-gold/10 scroll-mt-24"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-3">
            <BookOpen className="h-3.5 w-3.5" /> Lane-by-Lane Copy Blocks
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
            Developer-ready copy for every sponsorship lane
          </h2>
          <p className="text-ivory/65 text-sm md:text-base">
            Every lane below ships with a governance-approved headline, purpose,
            sponsor benefits, sponsor limit and sponsor-safe language — managed
            in one config file and reused across the Pricing Table, Slot Matrix
            and Partnership Lane components.
          </p>
        </div>

        <Accordion
          type="multiple"
          className="rounded-2xl border border-gold/20 bg-charcoal/60 divide-y divide-gold/10"
        >
          {SPONSOR_LANE_COPY_LIST.map((lane, i) => (
            <AccordionItem
              key={lane.slug}
              value={lane.slug}
              className="border-0 px-4 md:px-6"
            >
              <AccordionTrigger className="py-4 md:py-5 hover:no-underline">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02, duration: 0.25 }}
                  className="flex flex-1 flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-4 text-left"
                >
                  <div>
                    <h3 className="font-display text-base md:text-lg font-semibold text-ivory leading-tight">
                      {lane.headline}
                    </h3>
                    <p className="text-ivory/55 text-xs md:text-sm mt-0.5">
                      {lane.subheadline}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.16em] font-semibold shrink-0">
                    <span className="text-gold">{lane.amount}</span>
                    <span className="text-ivory/45">·</span>
                    <span className="text-ivory/70">Limit · {lane.sponsorLimit}</span>
                  </div>
                </motion.div>
              </AccordionTrigger>

              <AccordionContent className="pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                  {/* Purpose */}
                  <div className="md:col-span-1">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80 font-semibold mb-1.5">
                      Purpose
                    </div>
                    <p className="text-ivory/75 text-sm leading-relaxed">
                      {lane.purpose}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="md:col-span-2">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80 font-semibold mb-1.5">
                      Sponsor Benefits
                    </div>
                    <ul className="space-y-1.5">
                      {lane.benefits.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-ivory/80 text-sm leading-relaxed"
                        >
                          <Check className="h-3.5 w-3.5 mt-1 text-gold shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sponsor-safe language */}
                <div className="mt-5 rounded-xl border border-gold/25 bg-gold/5 p-3 md:p-4 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-semibold mb-1">
                      Sponsor-safe language
                    </div>
                    <p className="text-ivory/75 text-xs md:text-sm leading-relaxed">
                      {lane.sponsorSafeLanguage}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-5">
                  <Link
                    to={lane.href}
                    onClick={() =>
                      trackEvent("sponsor_lane_click", {
                        slug: lane.slug,
                        from: "lane_details",
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-gold font-semibold hover:underline"
                  >
                    {lane.ctaLabel}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-6 text-ivory/55 text-xs md:text-sm max-w-3xl">
          All lane copy is managed in <code className="text-gold/80">src/config/sponsorLaneCopy.ts</code>{" "}
          and reused across the Pricing Table, Partnership Lanes, Slot Matrix and downstream sponsor pages.
          Update once — propagates everywhere.
        </p>
      </div>
    </section>
  );
}

export default SponsorLaneDetails;
