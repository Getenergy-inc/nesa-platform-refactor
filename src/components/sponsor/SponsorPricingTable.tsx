// SponsorPricingTable — desktop table + mobile stacked cards
// Renders the master sponsorship pricing matrix with sponsor limits.

import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, ShieldCheck } from "lucide-react";
import { SPONSOR_PRICING_ROWS } from "@/config/sponsorPricing";

export function SponsorPricingTable() {
  return (
    <section
      id="packages"
      className="bg-charcoal py-14 md:py-20 border-t border-gold/10 scroll-mt-24"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-3">
            <DollarSign className="h-3.5 w-3.5" /> Sponsorship Packages & Figures
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
            Complete sponsorship pricing & sponsor limits
          </h2>
          <p className="text-ivory/65 text-sm md:text-base">
            All approved sponsorship lanes, amounts and sponsor limits in one place — designed for
            CSR, ESG, foundation and development-partner review.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gold/20">
          <table className="w-full text-sm">
            <thead className="bg-gold/10 text-gold">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Sponsorship / Partnership Lane</th>
                <th className="text-right font-semibold px-4 py-3 whitespace-nowrap">Amount</th>
                <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">Sponsor Limit</th>
                <th className="text-left font-semibold px-4 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {SPONSOR_PRICING_ROWS.map((row, i) => (
                <tr
                  key={row.lane}
                  className={i % 2 ? "bg-charcoal/40" : "bg-transparent"}
                >
                  <td className="px-4 py-3 align-top text-ivory/90 font-medium">
                    {row.href ? (
                      <Link to={row.href} className="hover:text-gold transition">
                        {row.lane}
                      </Link>
                    ) : (
                      row.lane
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-right text-gold whitespace-nowrap font-semibold">
                    {row.amount}
                  </td>
                  <td className="px-4 py-3 align-top text-ivory/85 whitespace-nowrap">
                    {row.limit}
                  </td>
                  <td className="px-4 py-3 align-top text-ivory/65">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {SPONSOR_PRICING_ROWS.map((row) => (
            <article
              key={row.lane}
              className="rounded-2xl border border-gold/20 bg-charcoal/60 p-4"
            >
              <div className="text-gold font-semibold text-base mb-1">{row.amount}</div>
              <h3 className="font-display text-ivory text-base leading-snug mb-1.5">
                {row.lane}
              </h3>
              <div className="text-[11px] uppercase tracking-[0.16em] text-gold/80 font-semibold mb-2">
                Sponsor limit · {row.limit}
              </div>
              <p className="text-ivory/65 text-sm leading-relaxed mb-3">{row.purpose}</p>
              {row.href && (
                <Link
                  to={row.href}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-gold font-semibold"
                >
                  Discuss this lane <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </article>
          ))}
        </div>

        <p className="mt-6 text-ivory/55 text-xs md:text-sm flex items-start gap-2 max-w-3xl">
          <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
          Sponsorship amounts are governance-approved reference figures. Final packaging,
          multi-lane bundles and in-kind values are confirmed by term sheet or MoU. Sponsorship
          does not influence nominations, voting, judging, finalists or winners.
        </p>
      </div>
    </section>
  );
}

export default SponsorPricingTable;
