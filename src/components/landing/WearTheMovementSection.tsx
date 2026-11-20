import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Wear the Movement — premium movement-support showcase.
 * Positioned as identity/belonging, NOT as an e-commerce storefront.
 * Mobile-first horizontal snap carousel with cinematic black/gold styling.
 */

interface MovementItem {
  name: string;
  tagline: string;
  image: string;
}

const items: MovementItem[] = [
  {
    name: "Movement Hoodie",
    tagline: "Wrap yourself in the mission.",
    image: "/merch/hoodie-sweatshirt.svg",
  },
  {
    name: "Legacy Tee",
    tagline: "Worn by changemakers.",
    image: "/merch/classic-tshirt.svg",
  },
  {
    name: "Supporter Cap",
    tagline: "Stand tall for education.",
    image: "/merch/branded-cap.svg",
  },
  {
    name: "Identity Pin",
    tagline: "A small symbol. A big stand.",
    image: "/merch/lapel-pin-badge.svg",
  },
  {
    name: "Impact Wristband",
    tagline: "Carry the movement with you.",
    image: "/merch/impact-wristband.svg",
  },
  {
    name: "AGC Tote",
    tagline: "Everyday belonging.",
    image: "/merch/eco-tote-bag.svg",
  },
  {
    name: "Legacy Jacket",
    tagline: "For founding supporters.",
    image: "/merch/legacy-sponsor-jacket.svg",
  },
];

export function WearTheMovementSection() {
  return (
    <section className="relative bg-charcoal py-16 sm:py-24 overflow-hidden border-t border-gold/10">
      {/* Ambient luxury backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--gold)/0.08),_transparent_60%)]" />
      <div className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* Editorial header */}
        <motion.div
          className="max-w-2xl mx-auto text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 text-gold text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] uppercase">
            <Sparkles className="h-3 w-3" /> Movement Identity
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Wear the <span className="text-gold italic">Movement</span>
          </h2>
          <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            More than merchandise — a symbol of participation in Africa's
            education transformation movement.
          </p>
        </motion.div>

        {/* Mobile-first swipe carousel */}
        <div
          className="-mx-4 sm:-mx-6 px-4 sm:px-6 flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, i) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3) }}
              className="group relative shrink-0 snap-start w-[68%] xs:w-[60%] sm:w-[44%] md:w-[30%] lg:w-[22%] rounded-2xl border border-gold/15 bg-gradient-to-b from-charcoal-light/60 to-charcoal/40 overflow-hidden hover:border-gold/45 transition-colors"
            >
              <div className="aspect-[4/5] overflow-hidden bg-charcoal/60">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="text-white font-display text-base sm:text-lg leading-tight">
                  {item.name}
                </h3>
                <p className="mt-1 text-gold/85 text-xs sm:text-[13px] italic leading-snug">
                  {item.tagline}
                </p>
              </div>
              {/* Soft glow on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_0_1px_hsl(var(--gold)/0.35),_0_0_40px_-12px_hsl(var(--gold)/0.45)]" />
            </motion.article>
          ))}
        </div>

        {/* Editorial CTA cluster */}
        <motion.div
          className="mt-10 sm:mt-14 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/60 text-xs sm:text-sm max-w-md leading-relaxed">
            Every purchase supports the NESA-Africa education impact ecosystem
            and helps amplify the movement across Africa and the diaspora.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 sm:px-7 py-3 text-sm font-semibold text-charcoal hover:brightness-110 transition shadow-[0_10px_28px_-10px_hsl(var(--gold)/0.7)]"
            >
              Explore the Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 sm:px-7 py-3 text-sm font-semibold text-gold hover:bg-gold/10 transition"
            >
              Support the Mission
            </Link>
          </div>
          <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-white/40">
            Represent · Belong · Amplify
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default WearTheMovementSection;
