import { Trophy, Vote, Heart, ArrowRight, MapPin, GraduationCap, Calendar, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import legacyRebuildImg from "@/assets/nesa-legacy-rebuild.jpg";
import africaMapImg from "@/assets/africa-map-silhouette.png";

const regions = [
  { name: "West Africa", description: "Community-nominated special needs school to be selected" },
  { name: "East Africa", description: "Community-nominated special needs school to be selected" },
  { name: "Southern Africa", description: "Community-nominated special needs school to be selected" },
  { name: "Central Africa", description: "Community-nominated special needs school to be selected" },
  { name: "North Africa", description: "Community-nominated special needs school to be selected" },
];

const timeline = [
  { phase: "Nominate", period: "Post-Ceremony 2026", description: "Communities nominate deserving special needs schools in their region", icon: Trophy },
  { phase: "Vote", period: "Jul – Sep 2026", description: "Public voting determines the winning school per region via AGC points", icon: Vote },
  { phase: "Intervene", period: "Oct 2026 – Jun 2027", description: "EduAid-Africa delivers facility upgrades, resources, and teacher training", icon: Heart },
];

export function LegacyImpactSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={legacyRebuildImg} alt="Community school rebuild project in Africa" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/96 via-secondary/93 to-secondary/98" />
      </div>

      {/* Africa Map watermark */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <img src={africaMapImg} alt="" className="w-[420px] h-auto opacity-[0.04]" aria-hidden="true" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 tracking-wide">
            Post-Award Legacy • SCEF Social Impact
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ivory mb-4">
            Rebuild My School{" "}
            <span className="text-primary">Africa</span>
          </h2>
          <p className="text-ivory/60 text-lg leading-relaxed max-w-2xl mx-auto">
            One special needs school per region — nominated by communities, selected by public vote, 
            and upgraded through EduAid-Africa. Recognition becomes real impact.
          </p>
        </motion.div>

        {/* How It Works — 3 Phase Timeline */}
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-14">
          {timeline.map((step, index) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-ivory/8 hover:border-primary/20 transition-all duration-300"
            >
              {/* Step number */}
              <span className="absolute -top-3 left-5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary text-primary-foreground">
                Step {index + 1}
              </span>

              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-primary/10 border border-primary/15">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-display font-bold text-ivory mb-1">{step.phase}</h3>
              <p className="text-primary/70 text-xs font-medium mb-2">{step.period}</p>
              <p className="text-ivory/50 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* 5 Regions — awaiting nominations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-14"
        >
          <div className="text-center mb-6">
            <h3 className="font-display text-xl font-bold text-ivory mb-1">Five Regions, Five Schools</h3>
            <p className="text-ivory/45 text-sm">Schools will be nominated and voted on after the NESA-Africa 2025 ceremony</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {regions.map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.06 }}
                viewport={{ once: true }}
                className="rounded-xl border border-ivory/8 bg-secondary/40 p-4 text-center hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-4 w-4 text-primary/70" />
                </div>
                <h4 className="text-sm font-display font-bold text-ivory mb-1">{region.name}</h4>
                <p className="text-ivory/35 text-[11px] leading-snug">{region.description}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-ivory/5 text-ivory/40 border border-ivory/8">
                  Awaiting Nominations
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-14"
        >
          <div className="rounded-2xl border border-ivory/8 bg-secondary/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-ivory">EduAid-Africa Intervention Areas</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: Star, label: "Inclusive classroom facilities & assistive technology" },
                { icon: Users, label: "Special needs teacher training & support" },
                { icon: Heart, label: "Learning materials & curriculum development" },
                { icon: Calendar, label: "WASH infrastructure & accessibility upgrades" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5 text-sm text-ivory/60">
                  <item.icon className="h-4 w-4 text-primary/60 mt-0.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/eduaid">
            <Button className="rounded-full gap-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground px-6">
              <Heart className="h-4 w-4" />
              Learn More on EduAid-Africa
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/donate">
            <Button variant="outline" className="rounded-full gap-2 border-primary/25 text-primary hover:bg-primary/10 px-6">
              <GraduationCap className="h-4 w-4" />
              Support EduAid
            </Button>
          </Link>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-ivory/25 text-xs mt-10"
        >
          A post-award education social impact service of Santos Creations Educational Foundation • NESA-Africa 2025
        </motion.p>
      </div>
    </section>
  );
}
