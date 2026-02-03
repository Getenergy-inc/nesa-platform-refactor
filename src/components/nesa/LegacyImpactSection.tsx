import { Building, Heart, Users, Check, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LEGACY_REGIONS } from "@/config/schedule";
import specialNeedsSchool from "@/assets/special-needs-school-africa.jpg";

export function LegacyImpactSection() {
  const impactStats = [
    { value: "5+", label: "Regions Covered" },
    { value: "100+", label: "Schools Targeted" },
    { value: "50K+", label: "Students Impacted" },
  ];

  const focusAreas = [
    "Classroom Blocks",
    "STEM Labs",
    "Libraries",
    "Sanitation Facilities",
    "Special Needs Facilities",
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={specialNeedsSchool} 
          alt="Special needs school in Africa" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/95 via-charcoal/90 to-charcoal/95" />
      </div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <Building className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Post-Award Legacy</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Rebuild My School <span className="text-emerald-400">Africa</span>
            </h2>

            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              Recognition becomes real impact. Every nomination, every vote, every ticket 
              contributes to upgrading inclusive and special needs education facilities 
              across Africa's regions.
            </p>

            {/* Focus Areas */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {focusAreas.map((area) => (
                <div key={area} className="flex items-center gap-2 text-white/80 text-sm">
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/partners">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full gap-2">
                  <Building className="h-4 w-4" />
                  Sponsor a School
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-full gap-2">
                  <Heart className="h-4 w-4" />
                  Donate
                </Button>
              </Link>
              <Link to="/partners">
                <Button variant="outline" className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-full gap-2">
                  <Users className="h-4 w-4" />
                  Partner
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Visual Stats & Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 rounded-xl p-4 text-center border border-emerald-500/20"
                >
                  <div className="text-2xl font-display font-bold text-emerald-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Regions */}
            <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <h4 className="text-white font-semibold">Target Regions</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {LEGACY_REGIONS.map((region) => (
                  <span
                    key={region}
                    className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
