// Special School Impact (2026–2027)
// EduAid Africa × Rebuild My School Africa — regional intervention section
// Premium NESA-Africa style: deep emerald + gold + charcoal, warm and credible.

import { motion } from "framer-motion";
import {
  School,
  Building2,
  MapPin,
  HandCoins,
  Heart,
  Users,
  Vote,
  Wrench,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type RegionalSchool = {
  region: string;
  country: string;
  accent: string;
};

const regionalSchools: RegionalSchool[] = [
  {
    region: "West Africa",
    country: "Ghana",
    accent: "from-gold/30 to-gold/5",
  },
  {
    region: "East Africa",
    country: "Kenya",
    accent: "from-emerald-700/40 to-emerald-900/10",
  },
  {
    region: "North Africa",
    country: "Egypt",
    accent: "from-gold/25 to-orange-900/15",
  },
  {
    region: "Central Africa",
    country: "Cameroon",
    accent: "from-emerald-800/40 to-emerald-900/10",
  },
  {
    region: "Southern Africa",
    country: "South Africa",
    accent: "from-gold/20 to-emerald-900/15",
  },
];

const impactFocus = [
  { icon: School, label: "Special needs school support" },
  { icon: Wrench, label: "Education infrastructure improvement" },
  { icon: MapPin, label: "Regional school interventions" },
  { icon: Building2, label: "CSR for Education funding" },
  { icon: HandCoins, label: "Donations and fundraising" },
  { icon: Vote, label: "Community nominations & voting" },
];

export function SpecialSchoolImpactSection() {
  return (
    <section
      id="special-school-impact"
      aria-labelledby="special-school-impact-title"
      className="relative py-16 sm:py-20 md:py-24 bg-charcoal overflow-hidden"
    >
      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-charcoal to-charcoal" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-emerald-700/10 blur-3xl rounded-full" />

      <div className="relative container mx-auto px-4 max-w-7xl">
        {/* ── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold">
              EduAid Africa • Rebuild My School Africa
            </span>
          </div>

          <h2
            id="special-school-impact-title"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
          >
            Special School Impact{" "}
            <span className="text-gold">(2026–2027)</span>
          </h2>

          <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-3">
            Through <span className="text-gold font-semibold">EduAid Africa</span>,
            SCEF will advance{" "}
            <span className="text-gold font-semibold">Rebuild My School Africa</span>{" "}
            as an education social impact project focused on improving learning
            environments for special needs schools across Africa.
          </p>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            From <span className="text-white font-semibold">October 2026 to October 2027</span>,
            the project will support the selection and intervention of one special needs
            school in each African region — through regional nominations, public voting,
            fundraising, donations, and CSR for Education support.
          </p>
        </motion.div>

        {/* ── Placeholder Notice ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-8 flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-gold/25 backdrop-blur-sm"
        >
          <Info className="h-5 w-5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            <span className="text-gold font-semibold">Note:</span> These are placeholder
            regional school examples only. Final schools will be selected through
            nominations, verification, and voting.
          </p>
        </motion.div>

        {/* ── Regional Placeholder Cards ─────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-14">
          {regionalSchools.map((school, idx) => (
            <motion.div
              key={school.region}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className={`group relative overflow-hidden rounded-2xl border border-gold/25 hover:border-gold/60 bg-gradient-to-br ${school.accent} p-5 transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_hsl(var(--gold)/0.4)]`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center">
                  <School className="h-4 w-4 text-gold" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  {school.region}
                </span>
              </div>
              <p className="text-white font-semibold text-sm sm:text-base leading-snug mb-1">
                Special Needs School
              </p>
              <p className="text-white/60 text-xs uppercase tracking-wider mb-3">
                Placeholder
              </p>
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                <span>{school.country}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Impact Focus ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-gold/25 bg-gradient-to-br from-emerald-900/30 via-white/[0.02] to-charcoal p-6 sm:p-8 md:p-10 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
              <Heart className="h-5 w-5 text-charcoal" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-0.5">
                Impact Focus
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                Where the project goes to work
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {impactFocus.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-gold/20 backdrop-blur-sm hover:bg-white/10 hover:border-gold/40 transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                  <item.icon className="h-4.5 w-4.5 text-gold" />
                </div>
                <span className="text-white/90 text-sm font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTAs ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/nominate?type=school&track=special-needs" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-8 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.6)]"
            >
              Nominate a Special Needs School
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/programs/rebuild-my-school-africa" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-gold/50 text-gold hover:bg-gold/10 rounded-full gap-2 px-8"
            >
              <Users className="h-4 w-4" />
              Support Rebuild My School Africa
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default SpecialSchoolImpactSection;
