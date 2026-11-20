import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TIERS = [
  { number: "01", name: "Africa Education Icon", description: "Principal 2026 focus: up to nine Icons through NRRC research and independent judging.", count: "3 pathways", href: "/recognition/africa-education-icon" },
  { number: "02", name: "Influencers Education Impact", description: "Public figures whose verified work has expanded education opportunity.", count: "3 pathways", href: "/recognition/influencers" },
  { number: "03", name: "Platinum Certificate", description: "Evidence-led institutional and leadership recognition through research, review and governance.", count: "7 awards · 27 subcategories", href: "/recognition/platinum" },
  { number: "04", name: "Gold–Blue Garnet", description: "Regional and national education contributions assessed through evidence and governance.", count: "9 awards · 63 subcategories", href: "/recognition/gold-blue-garnet" },
];

export function RecognitionTiersHomeSection() {
  return (
    <section className="relative py-20 md:py-28 bg-charcoal" aria-labelledby="recognition-tiers-heading">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-gold/80 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">NESA-Africa 2026 Recognition</p>
          <h2 id="recognition-tiers-heading" className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Four Recognition <span className="text-gold">Tiers</span></h2>
          <p className="text-white/75 text-base md:text-lg">Four tiers · 22 main awards · 90 subcategories. No public voting in 2026.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier, i) => (
            <motion.article key={tier.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }} className="rounded-2xl border border-gold/20 bg-charcoal/60 p-6 flex flex-col">
              <p className="text-gold/70 text-xs font-bold tracking-[0.18em]">TIER {tier.number}</p>
              <h3 className="mt-3 font-display text-xl font-bold text-white">{tier.name}</h3>
              <p className="mt-3 text-sm text-gold font-semibold">{tier.count}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{tier.description}</p>
              <Link to={tier.href} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-gold hover:underline">Explore<ArrowRight className="h-4 w-4" /></Link>
            </motion.article>
          ))}
        </div>
        <div className="mt-10 text-center"><Link to="/recognition" className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 transition">Explore all recognition tiers<ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}

export default RecognitionTiersHomeSection;
