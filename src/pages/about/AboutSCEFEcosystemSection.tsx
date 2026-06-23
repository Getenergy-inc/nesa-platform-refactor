// AboutSCEFEcosystemSection — One Stewardship • Four Impact Platforms.

import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";
import { Award, GraduationCap, Wrench, Tv, ArrowRight } from "lucide-react";

const PLATFORMS = [
  {
    icon: Award,
    name: "NESA-Africa",
    role: "Recognition",
    description:
      "Continental awards recognising educators, innovators, institutions, and changemakers.",
    href: "/awards",
    accent: "from-gold/30 to-gold/5",
  },
  {
    icon: GraduationCap,
    name: "EduAid-Africa",
    role: "Scholarships & Educational Access",
    description:
      "Send-a-Child-to-School, regional conferences, teacher training, and learning materials.",
    href: "/eduaid",
    accent: "from-emerald-500/30 to-emerald-500/5",
  },
  {
    icon: Wrench,
    name: "Rebuild My School Africa",
    role: "Educational Infrastructure & Special Needs Support",
    description:
      "Reviving formal, informal, vocational, and special-needs schools across the continent.",
    href: "/eduaid-africa/rebuild-my-school",
    accent: "from-rose-500/30 to-rose-500/5",
  },
  {
    icon: Tv,
    name: "NESA-Africa TV",
    role: "Media & Educational Storytelling",
    description:
      "Amplifying the voices, stories, and lessons of Africa's education changemakers.",
    href: "/media",
    accent: "from-blue-500/30 to-blue-500/5",
  },
];

export function AboutSCEFEcosystemSection() {
  return (
    <section
      aria-labelledby="scef-ecosystem-heading"
      className="bg-gradient-to-b from-charcoal to-charcoal-light/20 py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
            The SCEF Ecosystem
          </span>
          <h2
            id="scef-ecosystem-heading"
            className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory"
          >
            One Stewardship · <span className="text-gold">Four Impact Platforms</span>
          </h2>
          <p className="mt-3 text-ivory/70 max-w-2xl mx-auto text-sm md:text-base">
            Under the stewardship of Santos Creations Educational Foundation (SCEF),
            four platforms work together to recognise, fund, rebuild, and amplify
            African education.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 max-w-5xl mx-auto">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                to={p.href}
                onClick={() =>
                  trackEvent("about_cta_click", {
                    section: "scef_ecosystem",
                    cta_label: "Learn more",
                    cta_title: p.name,
                    destination: p.href,
                    page: "/about",
                  })
                }
                className="group h-full flex flex-col rounded-2xl border border-gold/15 bg-charcoal/60 p-6 hover:border-gold/40 transition-all overflow-hidden relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity`}
                  aria-hidden="true"
                />
                <div className="relative">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold mb-4">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-bold text-ivory">
                    {p.name}
                  </h3>
                  <p className="text-gold/80 text-xs font-semibold uppercase tracking-wider mt-1 mb-3">
                    {p.role}
                  </p>
                  <p className="text-ivory/75 text-sm leading-relaxed mb-4">
                    {p.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSCEFEcosystemSection;
