// SupportDonateBand — landing-page Support & Donate CTA.
// Two paths: /donate (existing Providus Bank block untouched) and /shop
// (or /merch coming-soon). Copy carries the non-influence disclaimer.

import { Link } from "react-router-dom";
import { HeartHandshake, ShoppingBag } from "lucide-react";

export function SupportDonateBand() {
  return (
    <section aria-label="Support and donate" className="bg-charcoal-light/40 py-14 md:py-16">
      <div className="container">
        <div className="text-center mb-8">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold/70">Post-Recognition Impact</p>
          <h2 className="font-display text-2xl md:text-3xl text-white font-bold mt-1">
            Support a Special Needs School
          </h2>
          <p className="text-white/70 mt-2 max-w-2xl mx-auto">
            One school per region, eight across Africa. Donate directly or shop our merchandise —
            every purchase funds a classroom.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <Link
            to="/donate"
            className="rounded-2xl border border-gold/30 bg-charcoal p-6 hover:border-gold/60 transition-colors group"
          >
            <HeartHandshake className="h-6 w-6 text-gold mb-3" />
            <h3 className="font-display text-lg text-white font-bold mb-1">Donate Directly</h3>
            <p className="text-white/70 text-sm">Providus Bank accounts (NGN, USD, GBP, EUR) on the Donate page.</p>
            <span className="mt-3 inline-flex text-gold font-semibold text-sm group-hover:underline">Give now →</span>
          </Link>
          <Link
            to="/merch"
            className="rounded-2xl border border-gold/30 bg-charcoal p-6 hover:border-gold/60 transition-colors group"
          >
            <ShoppingBag className="h-6 w-6 text-gold mb-3" />
            <h3 className="font-display text-lg text-white font-bold mb-1">Buy Merchandise</h3>
            <p className="text-white/70 text-sm">Every purchase funds a classroom. Waitlist open while shop launches.</p>
            <span className="mt-3 inline-flex text-gold font-semibold text-sm group-hover:underline">Shop / Join waitlist →</span>
          </Link>
        </div>
        <p className="text-center text-gold/60 text-xs mt-6 max-w-2xl mx-auto">
          Donations and merchandise purchases do not influence nominee approval, judging, or award outcomes.
        </p>
      </div>
    </section>
  );
}

export default SupportDonateBand;
