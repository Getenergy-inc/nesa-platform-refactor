import { ShieldCheck, Lock, Users2 } from "lucide-react";
import { SPONSOR_SLOT_GROUPS, SPONSOR_SLOT_POLICY } from "@/config/sponsorSlotLimits";

/**
 * SponsorSlotMatrix
 * ------------------------------------------------------------------
 * Displays the NESA-Africa 2026 governance rule for how many sponsors
 * and partners are allowed per category. Protects sponsor value,
 * brand visibility and award integrity.
 */
export function SponsorSlotMatrix() {
  return (
    <section
      id="sponsor-slot-matrix"
      className="bg-charcoal py-14 md:py-20 border-t border-gold/10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-3">
            <Lock className="h-3.5 w-3.5" /> Sponsor Slot Governance
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
            How many sponsors are allowed per category
          </h2>
          <p className="text-ivory/65 text-sm md:text-base">
            A clear, governance-approved limit on sponsorship rights — so the
            structure stays valuable, exclusive and never confusing for sponsors,
            partners, donors or the public.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {SPONSOR_SLOT_GROUPS.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-gold/20 bg-charcoal/60 p-5 md:p-6"
            >
              <header className="mb-4">
                <h3 className="font-display text-lg font-semibold text-ivory leading-tight mb-1.5">
                  {group.title}
                </h3>
                <p className="text-ivory/60 text-sm">{group.summary}</p>
              </header>

              <div className="overflow-hidden rounded-xl border border-gold/15">
                <table className="w-full text-sm">
                  <thead className="bg-gold/10 text-gold">
                    <tr>
                      <th className="text-left font-semibold px-3 py-2">Sponsor Type</th>
                      <th className="text-left font-semibold px-3 py-2 whitespace-nowrap">Allowed</th>
                      <th className="text-left font-semibold px-3 py-2 whitespace-nowrap">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row, i) => (
                      <tr
                        key={row.area}
                        className={i % 2 ? "bg-charcoal/40" : "bg-transparent"}
                      >
                        <td className="px-3 py-2 text-ivory/85">
                          {row.area}
                          {row.notes && (
                            <div className="text-ivory/50 text-xs mt-0.5">{row.notes}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-ivory/85 whitespace-nowrap">{row.mainSlots}</td>
                        <td className="px-3 py-2 text-gold/90 whitespace-nowrap">
                          {row.mainAmount ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>

        {/* Policy statement */}
        <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/5 p-6 md:p-7">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-1.5">
                Sponsor Slot Policy
              </div>
              <p className="text-ivory/80 text-sm md:text-base leading-relaxed">
                {SPONSOR_SLOT_POLICY}
              </p>
              <p className="text-ivory/55 text-xs mt-3 flex items-center gap-1.5">
                <Users2 className="h-3.5 w-3.5 text-gold" />
                Endorsements remain unlimited but are grouped separately and
                never imply sponsor control or influence over award outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
