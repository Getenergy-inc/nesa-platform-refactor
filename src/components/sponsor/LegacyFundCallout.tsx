// LegacyFundCallout — every sponsorship contributes 5% to the Rebuild My School
// Africa Legacy Fund. Renders the Recognition → Impact flow.

import { Recycle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FLOW = [
  "Recognition",
  "Sponsorship",
  "Legacy Fund",
  "School Intervention",
  "Impact Report",
];

const PURPOSES = [
  "Special needs schools",
  "Inclusive education",
  "School infrastructure",
  "Accessibility improvements",
  "Community-led school projects",
];

export function LegacyFundCallout() {
  return (
    <section className="bg-charcoal py-14 md:py-20 border-t border-gold/10">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent p-6 md:p-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center shrink-0">
              <Recycle className="h-6 w-6 text-gold" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
                Every sponsorship creates impact
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mt-1">
                5% RMSA Legacy Fund Allocation
              </h2>
            </div>
          </div>

          <p className="text-ivory/75 text-sm md:text-base leading-relaxed mb-4 max-w-3xl">
            NESA-Africa 2026 will allocate{" "}
            <span className="text-gold font-semibold">5% of eligible sponsorship income</span> to the
            Rebuild My School Africa Legacy Fund, supporting post-award education infrastructure,
            Special Needs Education interventions, accessibility upgrades, digital learning spaces,
            and community-led school improvement from{" "}
            <span className="text-ivory">October 2026 to October 2027</span>.
          </p>
          <p className="text-ivory/55 text-xs md:text-sm leading-relaxed mb-6 max-w-3xl">
            Subject to Board, Finance, and Compliance approval, allocations may be distributed across
            the approved 8 African regional GFA Wzip wallet accounts with monthly reconciliation and
            reporting.
          </p>

          {/* Flow */}
          <div className="overflow-x-auto -mx-2 px-2 mb-6">
            <div className="flex items-center gap-2 min-w-max">
              {FLOW.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="rounded-lg border border-gold/30 bg-charcoal-light/60 px-3 py-2 text-xs md:text-sm text-ivory font-medium whitespace-nowrap">
                    {step}
                  </div>
                  {i < FLOW.length - 1 && <ArrowRight className="h-4 w-4 text-gold shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80 font-semibold mb-2">
                Fund purpose
              </div>
              <ul className="space-y-1.5">
                {PURPOSES.map((p) => (
                  <li key={p} className="text-ivory/75 text-sm flex gap-2">
                    <span className="text-gold">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-ivory/65 text-xs leading-relaxed mb-4">
                Allocations, schools served and outcomes are published in the public RMSA Legacy
                Fund Impact Report. Sponsors receive a per-project acknowledgement.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/rebuild"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gold text-charcoal hover:bg-gold/90 px-4 py-2 text-sm font-semibold"
                >
                  Explore RMSA <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/governance#independent-verification"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 px-4 py-2 text-sm font-semibold"
                >
                  Reporting policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LegacyFundCallout;
