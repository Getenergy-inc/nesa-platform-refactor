// The NESA-Africa Ecosystem — 10 continental education modules.
// Replaces award-centric homepage blocks. Charcoal/Gold tokens only.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy, GraduationCap, Wrench, Tv, Plane, BookOpen,
  Microscope, MapPin, Megaphone, Globe2, ArrowRight,
} from "lucide-react";

type Module = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
  href: string;
};

const MODULES: Module[] = [
  { icon: Trophy,        title: "NESA-Africa Awards",     blurb: "Continental recognition for Africa's education changemakers.",           href: "/awards" },
  { icon: GraduationCap, title: "EduAid-Africa",          blurb: "Scholarships, conferences and teacher training across the continent.",  href: "/eduaid" },
  { icon: Wrench,        title: "Rebuild My School Africa", blurb: "Rebuilding classrooms, libraries, WASH and digital labs.",            href: "/eduaid-africa/rebuild-my-school" },
  { icon: Tv,            title: "NESA TV",                blurb: "Africa's education storytelling and broadcast platform.",                href: "/media" },
  { icon: Plane,         title: "Afri-EduTourism",        blurb: "Learn · Serve · Tour · Transform with diaspora and global partners.",   href: "/programs/edu-tourism" },
  { icon: BookOpen,      title: "Scholarships",           blurb: "Send-A-Child-To-School and Pan-African scholarship pipelines.",         href: "/scholarships" },
  { icon: Microscope,    title: "Research",               blurb: "Evidence, EDI scoring and policy briefs on African education.",         href: "/research" },
  { icon: MapPin,        title: "Local Chapters",         blurb: "City and country chapters mobilising volunteers on the ground.",        href: "/local-chapters" },
  { icon: Megaphone,     title: "Regional Ambassadors",   blurb: "15 ambassador roles across 10 African education regions.",              href: "/ambassadors" },
  { icon: Globe2,        title: "Education Online Africa", blurb: "Digital learning, courses and online communities for educators.",       href: "/eoa" },
];

export function EcosystemModulesSection() {
  return (
    <section
      aria-labelledby="ecosystem-heading"
      className="bg-charcoal py-16 md:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
            The Ecosystem
          </p>
          <h2
            id="ecosystem-heading"
            className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3"
          >
            The <span className="text-gold">NESA-Africa</span> Ecosystem
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Ten interconnected initiatives — recognition, impact, media, mobility and
            scholarship — building Africa's largest education movement.
          </p>
        </div>

        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MODULES.map((m, idx) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (idx % 5) * 0.05 }}
            >
              <Link
                to={m.href}
                className="group h-full flex flex-col rounded-2xl border border-gold/20 bg-charcoal-light/40 p-5 hover:border-gold/55 hover:bg-charcoal-light/70 transition-all"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold mb-3">
                  <m.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-base md:text-lg font-bold text-white leading-tight mb-1.5">
                  {m.title}
                </h3>
                <p className="text-white/65 text-xs md:text-sm leading-relaxed mb-4">
                  {m.blurb}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 text-gold text-xs font-semibold">
                  Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EcosystemModulesSection;
