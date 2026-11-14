// GalaTicketBand — Gala ticket CTA for the landing page.

import { Link } from "react-router-dom";
import { Ticket, ArrowRight } from "lucide-react";

export function GalaTicketBand() {
  return (
    <section aria-label="Gala ticket" className="bg-charcoal py-12 md:py-16">
      <div className="container">
        <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-charcoal-light to-charcoal p-6 md:p-10 text-center md:text-left md:flex md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] tracking-[0.18em] uppercase mb-3">
              <Ticket className="h-3.5 w-3.5" /> NESA-Africa 2026 Recognition Gala
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-white font-bold mb-2">
              Buy Your Ticket · 13 December 2026 · Lagos, Nigeria
            </h2>
            <p className="text-white/70 text-sm md:text-base">
              Attending the Gala does not affect nominee selection or award outcomes.
            </p>
          </div>
          <Link
            to="/gala"
            className="mt-4 md:mt-0 inline-flex items-center justify-center gap-2 rounded-full bg-gold text-charcoal font-semibold px-6 py-3 hover:bg-gold/90 transition-colors"
          >
            Buy Your Ticket <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GalaTicketBand;
