import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Award,
  Globe,
  GraduationCap,
  Lightbulb,
  Trophy,
  Users,
  Handshake,
  ArrowRight,
} from "lucide-react";
import africanSchoolImage from "@/assets/african-school-classroom.jpg";

import { WhyNESAExistsSection } from "@/components/nesa/WhyNESAExistsSection";
import { AboutChooseJourneySection } from "@/pages/about/AboutChooseJourneySection";
import { TenRegionsBannerSection } from "@/components/nesa/TenRegionsBannerSection";
import { VisionMissionObjectivesSection } from "@/components/nesa/VisionMissionObjectivesSection";
import { AwardTiersSummarySection } from "@/components/nesa/AwardTiersSummarySection";
import { AboutSCEFEcosystemSection } from "@/pages/about/AboutSCEFEcosystemSection";
import { CVOMessageSection } from "@/components/nesa/CVOMessageSection";
import { GovernanceFirewallSection } from "@/components/nesa/GovernanceFirewallSection";
import { ImpactProgramsSection } from "@/components/nesa/ImpactProgramsSection";
import { EndorsedBySection } from "@/components/nesa/EndorsedBySection";
import { PageFAQSection } from "@/components/nesa/PageFAQ";

const HERO_STATS = [
  { value: "20", label: "Years of Vision (2006–2026)", icon: Lightbulb },
  { value: "10", label: "Education Regions", icon: Globe },
  { value: "27+", label: "Expert Judges", icon: Users },
  { value: "18", label: "Categories", icon: Award },
  { value: "96", label: "Recognition Pathways", icon: Trophy },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About NESA-Africa | The African Blue-Garnet Awards for Education</title>
        <meta
          name="description"
          content="NESA-Africa is a continental education recognition and impact platform honouring Africa's changemakers across 10 regions, the diaspora, and Friends of Africa. More than awards — a Trust Gateway for the future of African education."
        />
      </Helmet>

      {/* ─── 1. HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={africanSchoolImage}
            alt="African students learning in a classroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
                <GraduationCap className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-gold">
                  Since 2006 · Vision 2035
                </span>
              </div>

              <h1 className="mb-3 font-display text-4xl font-bold text-ivory md:text-5xl lg:text-6xl leading-tight">
                New Education Standard Award{" "}
                <span className="text-gold">Africa</span>
              </h1>
              <p className="mb-6 text-lg md:text-xl italic text-gold/90">
                The African Blue-Garnet Awards for Education
              </p>

              <p className="mb-4 text-xl text-ivory/90 font-medium">
                More than awards. A continental education recognition and impact
                platform.
              </p>

              <p className="mb-8 text-base md:text-lg text-ivory/75 leading-relaxed max-w-xl">
                NESA-Africa celebrates, documents, amplifies, and supports
                education changemakers across Africa, the diaspora, and Friends
                of Africa communities.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8"
                >
                  <a href="#choose-journey-heading">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Explore NESA-Africa
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-charcoal/80 backdrop-blur-xl rounded-3xl border border-gold/15 p-8 shadow-2xl">
                <h2 className="text-gold font-display text-xl font-semibold mb-6 text-center">
                  Our Reach
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {HERO_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-4 rounded-xl bg-white/5 border border-white/5"
                    >
                      <stat.icon className="h-5 w-5 text-gold mx-auto mb-2" />
                      <p className="text-2xl font-bold text-ivory">
                        {stat.value}
                      </p>
                      <p className="text-xs text-ivory/70 leading-tight mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile stats strip */}
      <section className="lg:hidden bg-charcoal border-y border-gold/10 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-5 gap-2">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold text-gold">{stat.value}</p>
                <p className="text-[10px] text-ivory/70 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. WHY NESA-AFRICA EXISTS ───────────────────── */}
      <WhyNESAExistsSection />

      {/* ─── 3. CHOOSE YOUR JOURNEY ──────────────────────── */}
      <AboutChooseJourneySection />

      {/* ─── 4. TEN EDUCATION REGIONS ────────────────────── */}
      <TenRegionsBannerSection />

      {/* ─── 5. VISION, MISSION & OBJECTIVES ─────────────── */}
      <section id="mission" className="scroll-mt-20">
        <VisionMissionObjectivesSection />
      </section>

      {/* ─── 6. RECOGNITION FRAMEWORK ────────────────────── */}
      <AwardTiersSummarySection />

      {/* ─── 7. SCEF ECOSYSTEM ───────────────────────────── */}
      <AboutSCEFEcosystemSection />

      {/* ─── 8. CVO MESSAGE ──────────────────────────────── */}
      <CVOMessageSection />

      {/* ─── 9. GOVERNANCE & INTEGRITY FIREWALL ──────────── */}
      <GovernanceFirewallSection />

      {/* ─── 10. IMPACT IN ACTION ────────────────────────── */}
      <ImpactProgramsSection />

      {/* ─── 11. ENDORSED & SUPPORTED BY ─────────────────── */}
      <EndorsedBySection />

      {/* ─── 12. FAQ ─────────────────────────────────────── */}
      <PageFAQSection />

      {/* ─── 13. FINAL ACTION BLOCK ──────────────────────── */}
      <section className="bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28 border-t border-gold/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-6 font-display text-3xl lg:text-4xl font-bold text-ivory">
              Building Africa's Education{" "}
              <span className="text-gold">Future Together</span>
            </h2>
            <p className="mb-10 text-lg text-ivory/75 max-w-2xl mx-auto">
              Three ways to power the movement. Pick one — every action
              strengthens the continent's education story.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8"
              >
                <Link to="/participate/nominate">
                  <Award className="mr-2 h-5 w-5" />
                  Nominate for 2026
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8"
              >
                <Link to="/sponsors">
                  <Handshake className="mr-2 h-5 w-5" />
                  Become a Sponsor
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-ivory/80 hover:text-ivory hover:bg-gold/10 rounded-full px-8"
              >
                <Link to="/community">
                  <Users className="mr-2 h-5 w-5" />
                  Join the Movement
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
