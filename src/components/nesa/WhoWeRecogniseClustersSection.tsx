import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Building2, Landmark, ArrowRight, type LucideIcon } from "lucide-react";
import { WHO_WE_RECOGNISE_CLUSTERS } from "@/config/platformCopy";
import { trackEvent } from "@/lib/analytics";

const ICONS: Record<string, LucideIcon> = {
  individuals: Users,
  organisations: Building2,
  governments: Landmark,
};

export function WhoWeRecogniseClustersSection() {
  return (
    <section
      className="relative py-20 md:py-24 bg-charcoal-light/10"
      aria-labelledby="who-we-recognise-clusters-heading"
    >
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-gold/80 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Who NESA-Africa Recognises
          </p>
          <h2
            id="who-we-recognise-clusters-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            The Enablers of <span className="text-gold">Education for All</span>
          </h2>
          <p className="text-white/75 text-base md:text-lg">
            Three clusters. One mission. Every nominee is an enabler of Education for All —
            never a student grade, exam score or school ranking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {WHO_WE_RECOGNISE_CLUSTERS.map((cluster, i) => {
            const Icon = ICONS[cluster.id] ?? Users;
            return (
              <motion.div
                key={cluster.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <Link
                  to={cluster.href}
                  onClick={() =>
                    trackEvent("home_cta_click", {
                      cta: "recognise_cluster",
                      label: cluster.title,
                      to: cluster.href,
                      section: "who_we_recognise_clusters",
                    })
                  }
                  className="group block h-full rounded-2xl border border-gold/20 bg-charcoal/60 p-6 hover:border-gold/60 hover:bg-charcoal/80 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-gold transition">
                    {cluster.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{cluster.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-gold text-sm font-semibold">
                    See recognition subcategories <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhoWeRecogniseClustersSection;
