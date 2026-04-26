import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Ticket,
  ArrowRight,
  Check,
  Star,
  Sparkles,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TICKET_TIERS, type TicketTierType } from "@/config/galaConfig";

interface MerchItem {
  name: string;
  price: string;
  image: string;
  tag?: string;
}

const FEATURED_MERCH: MerchItem[] = [
  {
    name: "Legacy Sponsor Jacket",
    price: "$180",
    image: "/merch/legacy-sponsor-jacket.svg",
    tag: "Premium",
  },
  {
    name: "Hoodie Sweatshirt",
    price: "$65",
    image: "/merch/hoodie-sweatshirt.svg",
    tag: "Bestseller",
  },
  {
    name: "Classic T-Shirt",
    price: "$30",
    image: "/merch/classic-tshirt.svg",
  },
  {
    name: "Polo Shirt",
    price: "$45",
    image: "/merch/polo-shirt.svg",
  },
  {
    name: "Branded Cap",
    price: "$25",
    image: "/merch/branded-cap.svg",
  },
  {
    name: "Eco Tote Bag",
    price: "$20",
    image: "/merch/eco-tote-bag.svg",
    tag: "Eco",
  },
  {
    name: "Lapel Pin Badge",
    price: "$10",
    image: "/merch/lapel-pin-badge.svg",
  },
  {
    name: "Impact Wristband",
    price: "$5",
    image: "/merch/impact-wristband.svg",
  },
];

const TIER_ICONS: Record<TicketTierType, typeof Ticket> = {
  GENERAL: Ticket,
  PREMIUM: Star,
  VIP: Sparkles,
  VVIP: Gift,
};

export function MerchAndTicketsSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/20 to-charcoal" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold tracking-wider uppercase mb-4">
            Wear The Movement • Attend The Gala
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Official Merchandise &{" "}
            <span className="text-gold">Gala Tickets</span>
          </h2>
          <p className="text-white/65 text-base md:text-lg leading-relaxed">
            Every purchase fuels Africa&apos;s education legacy. Reserve your seat
            at the Blue Garnet Awards Gala or wear the brand that&apos;s
            redefining recognition across the continent.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* ═══ MERCHANDISE PANEL ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-gold/15 bg-charcoal-light/40 backdrop-blur-sm p-6 md:p-8 overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 blur-2xl" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-widest uppercase text-gold/70 font-semibold">
                        Official Store
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                        NESA Merchandise
                      </h3>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Apparel, accessories &amp; collectibles. Every order supports{" "}
                    <span className="text-gold/90">Rebuild My School Africa</span>.
                  </p>
                </div>
              </div>

              {/* Merch grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {FEATURED_MERCH.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="group relative rounded-xl border border-gold/10 bg-charcoal/60 overflow-hidden hover:border-gold/40 transition-colors"
                  >
                    {item.tag && (
                      <Badge className="absolute top-2 left-2 z-10 bg-gold/90 text-charcoal text-[10px] font-bold px-1.5 py-0">
                        {item.tag}
                      </Badge>
                    )}
                    <div className="aspect-square bg-charcoal flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-white text-[11px] font-medium leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-gold text-xs font-bold mt-0.5">
                        {item.price}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <Link to="/shop" className="block">
                <Button
                  size="lg"
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full gap-2 group/btn"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Visit the Official Shop
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-center text-[11px] text-white/40 mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-gold/60" />
                Secure checkout • Worldwide shipping • Bulk orders welcome
              </p>
            </div>
          </motion.div>

          {/* ═══ TICKETS PANEL ═══ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-gold/15 bg-charcoal-light/40 backdrop-blur-sm p-6 md:p-8 overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 blur-2xl" />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-widest uppercase text-gold/70 font-semibold">
                        Awards Gala 2026
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                        Buy Your Ticket
                      </h3>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    An unforgettable night honoring Africa&apos;s education
                    changemakers. Choose your tier &amp; receive an instant QR
                    e-ticket.
                  </p>
                </div>
              </div>

              {/* Tier list */}
              <div className="space-y-3 mb-6">
                {TICKET_TIERS.map((tier, i) => {
                  const Icon = TIER_ICONS[tier.id] || Ticket;
                  const isPopular = tier.id === "VIP";
                  return (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                        isPopular
                          ? "border-gold/50 bg-gold/[0.04]"
                          : "border-gold/10 bg-charcoal/60 hover:border-gold/30"
                      }`}
                    >
                      {isPopular && (
                        <Badge className="absolute -top-2.5 right-4 bg-gold text-charcoal text-[10px] font-bold px-2 py-0">
                          Popular
                        </Badge>
                      )}
                      <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-white font-semibold text-sm md:text-base truncate">
                            {tier.name}
                          </h4>
                          <p className="text-gold font-bold text-base md:text-lg whitespace-nowrap">
                            ${tier.price}
                            <span className="text-[10px] text-gold/60 font-normal ml-0.5">
                              {tier.currency}
                            </span>
                          </p>
                        </div>
                        <p className="text-white/50 text-xs mt-0.5 truncate flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-gold/60 shrink-0" />
                          {tier.seatingNote}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <Link to="/buy-your-ticket" className="block">
                <Button
                  size="lg"
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full gap-2 group/btn"
                >
                  <Ticket className="h-4 w-4" />
                  Reserve Your Seat
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-center text-[11px] text-white/40 mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-gold/60" />
                Instant QR e-ticket • Secure payment • Earn AGC rewards
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default MerchAndTicketsSection;
