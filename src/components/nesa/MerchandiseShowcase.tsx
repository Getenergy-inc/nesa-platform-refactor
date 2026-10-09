import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MerchItem {
  name: string;
  price: string;
  image: string;
  badge?: string;
}

const items: MerchItem[] = [
  { name: "Classic NESA T-Shirt", price: "$25", image: "/merch/classic-tshirt.png", badge: "Bestseller" },
  { name: "Hoodie / Sweatshirt", price: "$45", image: "/merch/hoodie-sweatshirt.png" },
  { name: "Polo Shirt", price: "$35", image: "/merch/polo-shirt.png" },
  { name: "Branded Cap", price: "$15", image: "/merch/branded-cap.png" },
  { name: "Eco Tote Bag", price: "$20", image: "/merch/eco-tote-bag.png", badge: "Eco" },
  { name: "Lapel Pin / Badge", price: "$10", image: "/merch/lapel-pin-badge.png" },
  { name: "Impact Wristband", price: "$5", image: "/merch/impact-wristband.png" },
  { name: "Sticker Pack (5pcs)", price: "$7", image: "/merch/sticker-pack.png" },
  { name: "Desk Flag Stand", price: "$30", image: "/merch/desk-flag-stand.png" },
  { name: "Legacy Sponsor Jacket", price: "$120", image: "/merch/legacy-sponsor-jacket.png", badge: "Limited" },
];

export function MerchandiseShowcase() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/10 to-charcoal" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <div className="container relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Official NESA Store
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Wear the <span className="text-gold">Movement</span>
          </h2>
          <p className="text-white/65 text-base md:text-lg leading-relaxed">
            Every purchase fuels <span className="text-gold/90 font-semibold">Rebuild My School Africa</span> and education
            legacy projects across the continent.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-gold/15 bg-charcoal-light/40 backdrop-blur-sm overflow-hidden hover:border-gold/50 transition-all"
            >
              {item.badge && (
                <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-gold text-charcoal text-[10px] font-bold uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
              <div className="aspect-square overflow-hidden bg-charcoal/60">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-white text-sm md:text-base font-semibold leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gold font-bold text-base md:text-lg">{item.price}</span>
                  <ShoppingBag className="h-4 w-4 text-gold/60 group-hover:text-gold transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link to="/shop">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full gap-2 px-8 group"
            >
              Visit the Official Shop
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-white/50 text-xs mt-4">
            Earn <span className="text-gold font-semibold">5 AGC</span> for every $1 spent • Free shipping on orders over $50
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default MerchandiseShowcase;
