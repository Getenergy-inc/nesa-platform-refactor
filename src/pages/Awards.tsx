// /awards — NESA-Africa Recognition Framework gateway.
//
// Goal: explain HOW recognition works before exposing categories.
// Removes featured nominee carousel (was surfacing supermarkets/hotels).
// Composes existing trusted sections + new framework explainers.

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TierExplorer from "@/components/recognition/TierExplorer";
import ImpactJourney from "@/components/recognition/ImpactJourney";
import {
  ArrowRight,
  Award,
  Crown,
  Gem,
  Medal,
  Trophy,
  Users,
  Building2,
  HeartHandshake,
  Landmark,
  Globe2,
  Sparkles,
  Newspaper,
  Briefcase,
  GraduationCap,
  Handshake,
  ClipboardCheck,
  Search,
  ScaleIcon,
  Eye,
  Coins,
  Wrench,
  Star,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import africanSchoolImage from "@/assets/african-school-classroom.jpg";
import { trackEvent } from "@/lib/analytics";
import { PILLARS } from "@/data/pillars";

import { TenRegionsBannerSection } from "@/components/nesa/TenRegionsBannerSection";
import { AwardTiersSummarySection } from "@/components/nesa/AwardTiersSummarySection";
import { GovernanceFirewallSection } from "@/components/nesa/GovernanceFirewallSection";
import { PageFAQSection } from "@/components/nesa/PageFAQ";

const SITE = "https://nesaafrica.lovable.app";

const HERO_STATS = [
  { value: "4", label: "Award Tiers" },
  { value: "18", label: "Categories" },
  { value: "96", label: "Recognition Pathways" },
  { value: "10", label: "Education Regions" },
];

const RECOGNITION_FLOW = [
  { icon: ClipboardCheck, label: "Nomination" },
  { icon: Search, label: "Verification" },
  { icon: ScaleIcon, label: "Evaluation" },
  { icon: Trophy, label: "Recognition" },
  { icon: Eye, label: "Visibility" },
  { icon: Handshake, label: "Partnerships" },
  { icon: Coins, label: "Funding" },
  { icon: Wrench, label: "Intervention" },
  { icon: Sparkles, label: "Legacy" },
];

const PATHWAYS = [
  {
    id: "blue-garnet",
    icon: Gem,
    title: "Blue Garnet Award",
    subtitle: "Competitive Excellence",
    stats: ["9 Categories", "63 Subcategories", "Jury + Public Vote"],
    description: "Recognising measurable excellence in education across Africa.",
    href: "/awards/blue-garnet-categories",
    cta: "Explore Blue Garnet",
    accent: "from-blue-500/30 via-indigo-500/15 to-transparent",
    border: "border-blue-400/30 hover:border-blue-400/60",
    pill: "bg-blue-500/15 text-blue-200 border-blue-500/30",
  },
  {
    id: "platinum",
    icon: Medal,
    title: "Platinum Recognition",
    subtitle: "Institutional Leadership",
    stats: ["7 Categories", "27 Subcategories", "NRC Verified"],
    description: "Recognising institutional contribution and governance-grade impact.",
    href: "/awards/platinum-certificate-categories",
    cta: "Explore Platinum",
    accent: "from-slate-300/25 via-slate-400/10 to-transparent",
    border: "border-slate-300/30 hover:border-slate-300/60",
    pill: "bg-slate-300/15 text-slate-100 border-slate-300/30",
  },
  {
    id: "icon",
    icon: Crown,
    title: "Africa Education Icon Award",
    subtitle: "Lifetime Achievement · 2006–2026",
    stats: ["3 Icon Pathways", "Jury Selection", "Continental Honour"],
    description: "Recognising transformational educational leaders with sustained 10+ year impact.",
    href: "/awards/icon",
    cta: "Explore Icon Award",
    accent: "from-amber-500/30 via-yellow-500/15 to-transparent",
    border: "border-amber-400/30 hover:border-amber-400/60",
    pill: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  },
  {
    id: "influencers",
    icon: Sparkles,
    title: "Influencers Education Impact Award",
    subtitle: "Public Impact · 2026 Edition",
    stats: ["Sports", "Music", "Social Media"],
    description: "Recognising education advocacy through cultural influence.",
    href: "/awards/influencers-education-impact",
    cta: "Explore Influencer Awards",
    accent: "from-pink-500/30 via-rose-500/15 to-transparent",
    border: "border-pink-400/30 hover:border-pink-400/60",
    pill: "bg-pink-500/15 text-pink-200 border-pink-500/30",
  },
];

const TIER_ARCHITECTURE = [
  { tier: "Tier 1", name: "Blue Garnet Award", a: "9 Categories", b: "63 Subcategories", icon: Gem },
  { tier: "Tier 2", name: "Platinum Recognition", a: "7 Categories", b: "27 Subcategories", icon: Medal },
  { tier: "Tier 3", name: "Africa Education Icon", a: "3 Icon Pathways", b: "Lifetime Honour", icon: Crown },
  { tier: "Tier 4", name: "Influencers Education Impact", a: "3 Public Categories", b: "Editorial Selection", icon: Sparkles },
];

const NOMINEE_TYPES = [
  { icon: Users, label: "Individuals" },
  { icon: Building2, label: "Institutions" },
  { icon: HeartHandshake, label: "NGOs" },
  { icon: Landmark, label: "Foundations" },
  { icon: ShieldCheck, label: "Governments" },
  { icon: GraduationCap, label: "Education Innovators" },
  { icon: Newspaper, label: "Media Organisations" },
  { icon: Briefcase, label: "Corporate CSR Programmes" },
  { icon: Globe2, label: "International Partners" },
];

const SELECTION_FLOW = [
  { label: "Eligibility Review", icon: ClipboardCheck },
  { label: "Verification", icon: Search },
  { label: "EDI Assessment", icon: ScaleIcon },
  { label: "Judge Review", icon: Users },
  { label: "Moderation", icon: ShieldCheck },
  { label: "Final Validation", icon: Star },
];

const SELECTION_PILLARS = [
  "Independent Governance",
  "Conflict Screening",
  "Published Criteria",
  "Evidence-Based Evaluation",
];

function track(section: string, label: string, destination: string) {
  trackEvent("awards_cta_click", {
    section,
    cta_label: label,
    destination,
    page: "/awards",
  });
}

export default function AwardsPage() {
  return (
    <>
      <Helmet>
        <title>The NESA-Africa Recognition Framework | Awards 2026</title>
        <meta
          name="description"
          content="Four Recognition Pathways. One Continent. One Mission. NESA-Africa recognises educational excellence, leadership, innovation, advocacy, philanthropy, and lifelong contribution across Africa, the diaspora, and Friends of Africa."
        />
        <link rel="canonical" href={`${SITE}/awards`} />
        <meta property="og:title" content="The NESA-Africa Recognition Framework | Awards 2026" />
        <meta property="og:url" content={`${SITE}/awards`} />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        {/* ─── 1. HERO ───────────────────────────────────── */}
        <section className="relative min-h-[75vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={africanSchoolImage}
              alt="African educators, students, and institutions"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
          </div>

          <div className="container relative z-10 mx-auto px-4 py-20 lg:py-28">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
                <Trophy className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-gold">
                  The Recognition Framework · 2026
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-4"
              >
                Every Force Building African Education{" "}
                <span className="text-gold">Deserves a Stage.</span>
              </motion.h1>

              <p className="text-xl md:text-2xl text-ivory/90 font-medium mb-5">
                NESA-Africa Award Categories — organised into 7 Recognition Pillars.
              </p>

              <p className="text-base md:text-lg text-ivory/75 leading-relaxed max-w-2xl mb-8">
                NESA-Africa recognises the people and organisations enabling Education
                for All across Africa — from lifetime icons and corporate CSR leaders
                to diaspora champions, EdTech innovators, funders, institutions, media
                voices, and social advocates.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mb-8">
                {HERO_STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gold/20 bg-charcoal/60 backdrop-blur p-4 text-center"
                  >
                    <p className="text-2xl md:text-3xl font-bold text-gold">{s.value}</p>
                    <p className="text-xs text-ivory/70 leading-tight mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8"
                >
                  <a
                    href="#pillars"
                    onClick={() => track("hero", "Explore the Recognition Pillars", "#pillars")}
                  >
                    Explore the Recognition Pillars
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-8"
                >
                  <Link
                    to="/nominate"
                    onClick={() => track("hero", "Start a Nomination", "/nominate")}
                  >
                    Start a Nomination
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 1A. CANONICAL TIER EXPLORER + IMPACT JOURNEY ── */}
        <section className="border-y border-gold/10 bg-charcoal/95 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <TierExplorer className="mb-16" />
            <ImpactJourney variant="section" />
          </div>
        </section>

        {/* ─── 1B. THE 7 RECOGNITION PILLARS ─────────────── */}
        <section id="pillars" className="py-16 md:py-24 scroll-mt-20 border-b border-gold/10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                The 7 Recognition Pillars
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory">
                Find Where Your Nominee <span className="text-gold">Belongs</span>
              </h2>
              <p className="mt-3 text-ivory/70 text-sm md:text-base">
                Every nominee, sponsor, partner, and supporter can quickly find their
                pathway. Pick the pillar that fits the work.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p, i) => {
                const PIcon = p.icon;
                return (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <Link
                      to={`/awards/pillars/${p.slug}`}
                      onClick={() => track("pillars", p.shortTitle, `/awards/pillars/${p.slug}`)}
                      className={`group h-full flex flex-col rounded-2xl border border-gold/20 hover:border-gold/60 bg-gradient-to-br ${p.accent} bg-charcoal-light/40 p-5 md:p-6 transition-all`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
                          <PIcon className="h-5 w-5" />
                        </span>
                        <span className="text-gold/45 font-display text-lg font-bold">
                          {String(p.number).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-display text-base md:text-lg font-bold text-ivory mb-2 leading-snug">
                        {p.shortTitle}
                      </h3>
                      <p className="text-ivory/70 text-sm leading-relaxed mb-4 flex-1">
                        {p.bannerSummary}
                      </p>
                      <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold">
                        {p.bannerCta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 2. HOW RECOGNITION WORKS ──────────────────── */}
        <section className="py-16 md:py-24 bg-charcoal-light/20 border-y border-gold/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                How Recognition Works
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory">
                Recognition Without Impact Is{" "}
                <span className="text-gold">Incomplete</span>
              </h2>
              <p className="mt-3 text-ivory/70 text-sm md:text-base">
                NESA-Africa is not simply an award ceremony — it is an
                education-impact ecosystem that turns recognition into measurable
                outcomes.
              </p>
            </div>

            <ol className="grid grid-cols-3 md:grid-cols-9 gap-2 md:gap-3 max-w-6xl mx-auto">
              {RECOGNITION_FLOW.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="relative rounded-xl border border-gold/20 bg-charcoal/60 p-3 md:p-4 flex flex-col items-center gap-2"
                >
                  <span className="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-gold" />
                  <span className="text-ivory text-[11px] md:text-xs font-semibold text-center leading-tight">
                    {s.label}
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── 3. CHOOSE A RECOGNITION PATHWAY ───────────── */}
        <section
          id="pathways"
          aria-labelledby="pathways-heading"
          className="py-16 md:py-24 scroll-mt-20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                Step 1
              </span>
              <h2
                id="pathways-heading"
                className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory"
              >
                Choose a Recognition Pathway
              </h2>
              <p className="mt-3 text-ivory/70 text-sm md:text-base">
                Each pathway honours a different kind of educational impact. Pick
                the one that fits your nominee.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 max-w-6xl mx-auto">
              {PATHWAYS.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Link
                    to={p.href}
                    onClick={() => track("pathways", p.title, p.href)}
                    className={`group h-full flex flex-col rounded-2xl border bg-gradient-to-br ${p.accent} ${p.border} bg-charcoal/40 p-6 md:p-7 transition-all relative overflow-hidden`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
                        <p.icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold border ${p.pill}`}
                      >
                        {p.subtitle}
                      </span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-ivory leading-snug mb-2">
                      {p.title}
                    </h3>
                    <p className="text-ivory/75 text-sm leading-relaxed mb-4 flex-1">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {p.stats.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md bg-charcoal/70 border border-gold/15 text-ivory/80 text-[11px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold">
                      {p.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. TEN EDUCATION REGIONS ──────────────────── */}
        <TenRegionsBannerSection />

        {/* ─── 5. THE 2026 AWARD ARCHITECTURE ────────────── */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-charcoal to-charcoal-light/20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                The 2026 Award Architecture
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory">
                How Recognition Is <span className="text-gold">Structured</span>
              </h2>
              <p className="mt-3 text-ivory/70 text-sm md:text-base">
                18 Categories · 96 Recognition Pathways · One Continental Mission
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {TIER_ARCHITECTURE.map((t, i) => (
                <motion.div
                  key={t.tier}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-2xl border border-gold/20 bg-charcoal/60 p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 border border-gold/30 text-gold">
                      <t.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-gold/70 font-semibold">
                      {t.tier}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ivory mb-2">
                    {t.name}
                  </h3>
                  <p className="text-ivory/70 text-sm">{t.a}</p>
                  <p className="text-ivory/60 text-xs mt-1">{t.b}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 6. DISCOVER BY CATEGORY (progressive disclosure) ─── */}
        <AwardTiersSummarySection />

        {/* ─── 7. WHO CAN BE NOMINATED ───────────────────── */}
        <section className="py-16 md:py-24 bg-charcoal border-t border-gold/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                Who Can Be Nominated?
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory">
                Recognition Is <span className="text-gold">For Everyone</span>{" "}
                Driving Education Forward
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 max-w-6xl mx-auto">
              {NOMINEE_TYPES.map((n) => (
                <div
                  key={n.label}
                  className="rounded-xl border border-gold/15 bg-charcoal-light/30 p-4 text-center hover:border-gold/40 transition-colors"
                >
                  <n.icon className="h-6 w-6 text-gold mx-auto mb-2" />
                  <p className="text-ivory text-sm font-medium leading-tight">
                    {n.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 8. HOW WINNERS ARE SELECTED ───────────────── */}
        <section className="py-16 md:py-24 bg-charcoal-light/20 border-y border-gold/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
                How Winners Are Selected
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory">
                Evidence-Based · <span className="text-gold">Independently Judged</span>
              </h2>
            </div>

            <ol className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-5xl mx-auto mb-10">
              {SELECTION_FLOW.map((s, i) => (
                <li
                  key={s.label}
                  className="relative rounded-xl border border-gold/20 bg-charcoal/60 p-4 flex flex-col items-center gap-2"
                >
                  <span className="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-gold" />
                  <span className="text-ivory text-xs font-semibold text-center leading-tight">
                    {s.label}
                  </span>
                </li>
              ))}
            </ol>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {SELECTION_PILLARS.map((p) => (
                <div
                  key={p}
                  className="rounded-lg border border-gold/15 bg-charcoal/60 px-3 py-3 text-center text-ivory/85 text-xs md:text-sm font-medium"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 9. BUILT FOR TRUST ────────────────────────── */}
        <GovernanceFirewallSection />

        {/* ─── 10. FAQ ───────────────────────────────────── */}
        <PageFAQSection />

        {/* ─── 11. READY TO PARTICIPATE ──────────────────── */}
        <section className="bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28 border-t border-gold/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl text-center"
            >
              <h2 className="mb-4 font-display text-3xl lg:text-4xl font-bold text-ivory">
                Help Recognise Africa's{" "}
                <span className="text-gold">Education Changemakers</span>
              </h2>
              <p className="mb-10 text-lg text-ivory/75 max-w-2xl mx-auto">
                Three ways to participate in the 2026 Recognition Framework.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8"
                >
                  <Link
                    to="/nominate"
                    onClick={() =>
                      track("final_action", "Nominate for 2026", "/nominate")
                    }
                  >
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
                  <Link
                    to="/nominees"
                    onClick={() =>
                      track("final_action", "Explore Existing Nominees", "/nominees")
                    }
                  >
                    Explore Existing Nominees
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="text-ivory/80 hover:text-ivory hover:bg-gold/10 rounded-full px-8"
                >
                  <Link
                    to="/sponsors"
                    onClick={() =>
                      track("final_action", "Become a Sponsor", "/sponsors")
                    }
                  >
                    <Handshake className="mr-2 h-5 w-5" />
                    Become a Sponsor
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
