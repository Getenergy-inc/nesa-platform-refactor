// Impact Programmes Hub — overview page linking to 4 standalone programmes.
// Part of the 22-page canonical architecture.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Building2, HeartHandshake, Plane, ArrowRight } from "lucide-react";

const PROGRAMMES = [
  {
    slug: "/eduaid-africa",
    title: "EduAid-Africa",
    tagline: "Scholarships, training and capacity development",
    description:
      "Continental scholarships programme, teacher training pipelines, webinars and capacity-building for schools, communities and Education Enablers across Africa.",
    icon: GraduationCap,
    accent: "from-gold/20 to-gold/5",
  },
  {
    slug: "/rebuild-my-school",
    title: "Rebuild My School Africa",
    tagline: "School infrastructure rebuild",
    description:
      "Post-award legacy project restoring school infrastructure — classrooms, water, sanitation, libraries and learning resources — in under-served communities across every region.",
    icon: Building2,
    accent: "from-blue-400/20 to-blue-400/5",
  },
  {
    slug: "/special-needs",
    title: "Special Needs Education",
    tagline: "Inclusion, accessibility and support",
    description:
      "Inclusion programme supporting learners with special needs — accessibility upgrades, teacher training, assistive resources and recognition of inclusion champions.",
    icon: HeartHandshake,
    accent: "from-rose-400/20 to-rose-400/5",
  },
  {
    slug: "/afri-edutourism",
    title: "Afri-EduTourism",
    tagline: "Educational tourism across Africa",
    description:
      "Educational tourism programme connecting learners, educators and diaspora audiences with Africa's institutions, heritage and living classrooms in all 8 regions.",
    icon: Plane,
    accent: "from-emerald-400/20 to-emerald-400/5",
  },
];

export default function ImpactHub() {
  return (
    <>
      <Helmet>
        <title>Impact Programmes · NESA-Africa 2026</title>
        <meta
          name="description"
          content="NESA-Africa Impact Programmes — EduAid-Africa scholarships and training, Rebuild My School Africa, Special Needs Education, and Afri-EduTourism across the continent."
        />
      </Helmet>

      <section className="relative py-20 px-4 bg-charcoal text-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-gold text-sm uppercase tracking-widest mb-3">NESA-Africa 2026</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Impact Programmes</h1>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              Four flagship programmes deliver continent-wide impact between recognition seasons — turning celebration
              into tangible progress for learners, teachers, schools and communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
            {PROGRAMMES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    to={p.slug}
                    className={`block h-full rounded-2xl border border-gold/20 bg-gradient-to-br ${p.accent} p-6 hover:border-gold/60 transition-colors group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gold/10 border border-gold/30">
                        <Icon className="w-7 h-7 text-gold" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-white group-hover:text-gold transition-colors">
                          {p.title}
                        </h2>
                        <p className="text-gold text-sm mt-1">{p.tagline}</p>
                        <p className="text-white/75 text-sm mt-3">{p.description}</p>
                        <span className="inline-flex items-center gap-1 mt-4 text-gold text-sm font-medium">
                          Explore programme <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
