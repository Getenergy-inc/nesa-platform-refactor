// SponsorshipDefinitions — clear separation between Sponsorship, Partnership,
// Endorsement, Supporter Visibility Listing and Donation. Removes any implication
// that endorsements can be sold.

import { Banknote, Handshake, ShieldCheck, ListChecks, HeartHandshake } from "lucide-react";

type Def = {
  icon: typeof Banknote;
  title: string;
  body: string;
};

const DEFS: Def[] = [
  {
    icon: Banknote,
    title: "Sponsorship",
    body: "Paid visibility and programme support. Governed by an MoU and the NESA-Africa sponsor firewall policy.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    body: "Formal collaboration — joint programme delivery, MoUs, advisory representation. May be paid or in-kind.",
  },
  {
    icon: ShieldCheck,
    title: "Endorsement",
    body: "Non-financial institutional support. Endorsements are NEVER sold and do not grant any award influence.",
  },
  {
    icon: ListChecks,
    title: "Supporter Visibility Listing",
    body: "Public recognition of supporters, contributors and community backers. Listed for transparency only.",
  },
  {
    icon: HeartHandshake,
    title: "Donation",
    body: "Voluntary education contribution to EduAid-Africa, RMSA or general programme funds. Receipted and reported.",
  },
];

export function SponsorshipDefinitions() {
  return (
    <section className="bg-charcoal py-14 md:py-20 border-t border-gold/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-8">
          <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
            Clear governance terms
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mt-2 mb-2">
            How we define support
          </h2>
          <p className="text-ivory/65 text-sm">
            We separate financial sponsorship from non-financial endorsement to protect award
            integrity and donor trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {DEFS.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="rounded-xl border border-gold/20 bg-charcoal-light/40 p-5 hover:border-gold/40 transition"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <h3 className="font-display text-base font-bold text-ivory">{d.title}</h3>
                </div>
                <p className="text-ivory/70 text-sm leading-relaxed">{d.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SponsorshipDefinitions;
