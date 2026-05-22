import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

/**
 * Wear the Movement — merchandise teaser placed below primary conversion sections.
 */
export function WearTheMovementSection() {
  return (
    <section className="bg-charcoal py-14 sm:py-20 border-t border-gold/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-charcoal-light/70 via-charcoal/60 to-charcoal-light/40 px-6 py-10 sm:px-10 sm:py-14 flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
          <div className="flex-1">
            <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-gold">
              <ShoppingBag className="h-3.5 w-3.5" /> Official Shop
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl text-white">
              Wear the Movement
            </h2>
            <p className="mt-3 text-white/75 max-w-xl text-sm sm:text-base mx-auto lg:mx-0">
              Every purchase supports the NESA-Africa education impact ecosystem
              and helps amplify the movement across Africa and the diaspora.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal hover:brightness-110 transition shadow-[0_8px_22px_-8px_hsl(var(--gold)/0.7)]"
          >
            Visit Official Shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WearTheMovementSection;
