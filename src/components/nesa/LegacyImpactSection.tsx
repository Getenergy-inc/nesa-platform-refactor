import { Trophy, Vote, Heart, ArrowRight, MapPin, School } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import legacyRebuildImg from "@/assets/nesa-legacy-rebuild.jpg";
import africaMapImg from "@/assets/africa-map-silhouette.png";

// African textile patterns
import kenteImg from "@/assets/patterns/kente-west-africa.jpg";
import ethiopianImg from "@/assets/patterns/ethiopian-east-africa.jpg";
import ndebeleImg from "@/assets/patterns/ndebele-southern-africa.jpg";
import eyoImg from "@/assets/patterns/eyo-lagos-nigeria.jpg";
import kubaImg from "@/assets/patterns/kuba-central-africa.jpg";
import zelligeImg from "@/assets/patterns/zellige-north-africa.jpg";

const schools = [
  {
    name: "Hope Academy",
    type: "Special Needs School",
    region: "West Africa",
    country: "Nigeria",
    pattern: kenteImg,
    patternName: "Kente",
    status: "Priority Project",
    statusColor: "bg-amber-500",
    accent: "border-amber-500/40",
    textAccent: "text-amber-400",
  },
  {
    name: "Sunrise Inclusive School",
    type: "Special Needs School",
    region: "East Africa",
    country: "Kenya",
    pattern: ethiopianImg,
    patternName: "Ethiopian Weave",
    status: "In Progress",
    statusColor: "bg-blue-500",
    accent: "border-blue-500/40",
    textAccent: "text-blue-400",
  },
  {
    name: "Rainbow Learning Centre",
    type: "Special Needs School",
    region: "Southern Africa",
    country: "South Africa",
    pattern: ndebeleImg,
    patternName: "Ndebele Art",
    status: "Fundraising",
    statusColor: "bg-emerald-500",
    accent: "border-emerald-500/40",
    textAccent: "text-emerald-400",
  },
  {
    name: "Unity Special Education",
    type: "Special Needs School",
    region: "Central Africa",
    country: "Cameroon",
    pattern: kubaImg,
    patternName: "Kuba Cloth",
    status: "Planning",
    statusColor: "bg-orange-500",
    accent: "border-orange-500/40",
    textAccent: "text-orange-400",
  },
  {
    name: "Al-Noor Academy",
    type: "Special Needs School",
    region: "North Africa",
    country: "Morocco",
    pattern: zelligeImg,
    patternName: "Zellige Mosaic",
    status: "Fundraising",
    statusColor: "bg-purple-500",
    accent: "border-purple-500/40",
    textAccent: "text-purple-400",
  },
];

const actionPaths = [
  {
    icon: Trophy,
    title: "Nominate",
    description: "Recognize educators transforming special needs education in your region",
    cta: "Submit Nomination",
    link: "/nominate",
    accent: "gold",
  },
  {
    icon: Vote,
    title: "Vote",
    description: "Support nominees with AGC votes to help them win recognition",
    cta: "Vote Now",
    link: "/vote",
    accent: "blue",
  },
  {
    icon: Heart,
    title: "Support a School",
    description: "Fund inclusive education facilities in your Africa region",
    cta: "Donate to EduAid",
    link: "/donate",
    accent: "emerald",
  },
];

const accentStyles: Record<string, { border: string; iconBg: string; iconColor: string; button: string }> = {
  gold: {
    border: "border-gold/25 hover:border-gold/50",
    iconBg: "bg-gold/15",
    iconColor: "text-gold",
    button: "bg-gold hover:bg-gold-dark text-charcoal",
  },
  blue: {
    border: "border-blue-500/25 hover:border-blue-500/50",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    button: "bg-blue-500 hover:bg-blue-600 text-white",
  },
  emerald: {
    border: "border-emerald-500/25 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    button: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
};

export function LegacyImpactSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={legacyRebuildImg}
          alt="Community school rebuild project in Africa"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/92 via-charcoal/88 to-charcoal/95" />
      </div>

      {/* Africa Map watermark */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <img
          src={africaMapImg}
          alt=""
          className="w-[500px] h-auto opacity-[0.08]"
          aria-hidden="true"
        />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium mb-4">
            Post-Award Legacy
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Rebuild My School{" "}
            <span className="text-emerald-400">Africa</span>
          </h2>
          <p className="text-white/75 text-lg leading-relaxed">
            One special needs school per region — five schools, five cultures, one mission.
            Every nomination, vote, and donation upgrades inclusive education facilities.
          </p>
        </motion.div>

        {/* 5 School Cards with African textile patterns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto mb-14">
          {schools.map((school, index) => (
            <motion.div
              key={school.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`group relative rounded-2xl overflow-hidden border ${school.accent} bg-white/5 backdrop-blur-sm`}
            >
              {/* Pattern Header */}
              <div className="relative h-28 overflow-hidden">
                <img
                  src={school.pattern}
                  alt={`${school.patternName} pattern — ${school.region}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                {/* Status badge */}
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${school.statusColor}`}>
                  {school.status}
                </span>
                {/* Region pin */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1">
                  <MapPin className={`h-3 w-3 ${school.textAccent}`} />
                  <span className="text-white text-xs font-medium">{school.region}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <School className={`h-4 w-4 ${school.textAccent}`} />
                  <h3 className="text-sm font-display font-bold text-white truncate">
                    {school.name}
                  </h3>
                </div>
                <p className="text-white/50 text-xs mb-3">
                  {school.type} • {school.country}
                </p>
                <p className="text-white/40 text-[10px] italic mb-3">
                  Inspired by {school.patternName}
                </p>
                <Link to={`/donate?school=${encodeURIComponent(school.name)}`}>
                  <Button
                    size="sm"
                    className="w-full rounded-full text-xs gap-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Heart className="h-3 w-3" />
                    Support This School
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Three Action Paths */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {actionPaths.map((path, index) => {
            const styles = accentStyles[path.accent];
            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border ${styles.border} transition-all duration-300`}
              >
                <div className={`w-13 h-13 rounded-xl flex items-center justify-center mb-4 ${styles.iconBg}`}>
                  <path.icon className={`h-6 w-6 ${styles.iconColor}`} />
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {path.title}
                </h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  {path.description}
                </p>

                <Link to={path.link}>
                  <Button className={`w-full rounded-full gap-2 font-semibold ${styles.button}`}>
                    {path.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-white/40 text-sm mt-10"
        >
          Implemented via Santos Creations Educational Foundation • EduAid Programme
        </motion.p>
      </div>
    </section>
  );
}
