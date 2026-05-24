/**
 * About NESA Africa 2026 — landing-page section
 * Explains the award, the 2026 journey, the EDI Matrix, SDG 4 & AU Agenda 2063
 * alignment, and how recognition becomes post-award impact.
 * Mobile-first, compact, uses accordions + cards + badges.
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Users,
  Sparkles,
  HeartHandshake,
  Building2,
  ShieldCheck,
  Handshake,
  Globe2,
  ArrowRight,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EDI_PILLARS = [
  { icon: GraduationCap, title: "Access to Education", desc: "Expanding learning opportunities across underserved, rural, informal, and special needs education communities." },
  { icon: BookOpen, title: "Quality Learning", desc: "Improving teaching, curriculum, STEM, digital learning, research, libraries, and learning outcomes." },
  { icon: Users, title: "Equity & Inclusion", desc: "Advancing girls' education, special needs, marginalised communities, diaspora, and inclusive participation." },
  { icon: Sparkles, title: "Innovation & Technology", desc: "Recognising EduTech, AI, digital learning, media advocacy, STEM, and technology-enabled education solutions." },
  { icon: HeartHandshake, title: "Community & Social Impact", desc: "Mobilising public nominations, local chapters, re-nominations, AGC voting, and regional participation." },
  { icon: Building2, title: "Infrastructure & School Support", desc: "Connecting recognition to school grants, infrastructure, learning materials, and Rebuild My School Africa." },
  { icon: ShieldCheck, title: "Governance & Accountability", desc: "Strengthening trust via evidence review, jury onboarding, transparent voting, verification, and audit trails." },
  { icon: Handshake, title: "Partnerships & Resource Mobilisation", desc: "Engaging CSR leaders, sponsors, donors, institutions, diaspora, and development partners for impact." },
];

const SDGS = [
  { code: "SDG 4", label: "Quality Education", primary: true },
  { code: "SDG 5", label: "Gender Equality" },
  { code: "SDG 8", label: "Decent Work & Growth" },
  { code: "SDG 9", label: "Innovation & Infrastructure" },
  { code: "SDG 10", label: "Reduced Inequalities" },
  { code: "SDG 17", label: "Partnerships for the Goals" },
];

const AU_PILLARS = [
  "Education recognition",
  "Youth empowerment",
  "Innovation",
  "Cultural identity",
  "Regional collaboration",
  "Diaspora engagement",
  "Citizen-led participation",
];

export function AboutNESASection() {
  return (
    <section
      id="about-nesa-2026"
      aria-labelledby="about-nesa-2026-title"
      className="bg-charcoal py-16 md:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <Badge variant="outline" className="border-accent/40 text-accent mb-4">
            About NESA-Africa
          </Badge>
          <h2
            id="about-nesa-2026-title"
            className="font-playfair text-3xl md:text-5xl font-bold text-white mb-4"
          >
            About <span className="text-accent">NESA-Africa 2026</span>
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base md:text-lg">
            Everything you need to know about the continental award, its 2026
            journey, and how it supports Education for All across Africa.
          </p>
        </div>

        {/* Intro copy */}
        <div className="grid md:grid-cols-3 gap-6 mb-10 md:mb-14">
          {[
            {
              title: "What NESA-Africa 2026 Is",
              body: "More than a continental award — a public recognition and education-impact ecosystem identifying, celebrating, and amplifying changemakers advancing education across Africa and the diaspora.",
            },
            {
              title: "The 2026 Award Journey",
              body: "Public nominations → NRC verification → jury onboarding → Gold Certificate public voting → Blue Garnet final voting → the June Awards Gala → post-award impact.",
            },
            {
              title: "Education for All",
              body: "Spotlighting individuals, organisations, institutions, communities, diaspora supporters, and Friends of Africa advancing access, quality, equity, innovation, infrastructure, governance, and partnerships.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-charcoal-light/60 p-5 md:p-6"
            >
              <h3 className="font-playfair text-lg md:text-xl text-accent mb-2">
                {c.title}
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        {/* EDI Matrix */}
        <div className="mb-10 md:mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div>
              <Badge className="bg-accent/15 text-accent border border-accent/30 mb-3">
                <Compass className="h-3.5 w-3.5 mr-1" /> EDI Matrix
              </Badge>
              <h3 className="font-playfair text-2xl md:text-3xl text-white">
                NESA-Africa 2026 Education Development Index
              </h3>
              <p className="text-white/70 mt-2 max-w-3xl text-sm md:text-base">
                The EDI Matrix helps NESA-Africa classify and communicate the
                education-development value of nominees, categories, partners,
                and post-award impact projects across 8 pillars.
              </p>
            </div>
            <Button asChild variant="outline" className="border-accent/40 text-accent hover:bg-accent/10 self-start md:self-auto">
              <Link to="/about">
                Learn More About EDI <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {EDI_PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group rounded-xl border border-white/10 bg-charcoal-light/50 p-4 hover:border-accent/40 hover:bg-charcoal-light transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold text-accent/80">
                      0{i + 1}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold text-sm md:text-base mb-1">
                    {p.title}
                  </h4>
                  <p className="text-white/65 text-xs leading-relaxed">
                    {p.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SDG + AU alignment */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-10 md:mb-14">
          <div className="rounded-2xl border border-white/10 bg-charcoal-light/60 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Globe2 className="h-5 w-5 text-accent" />
              <h3 className="font-playfair text-xl text-white">
                Aligned With Global Education Goals
              </h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              NESA-Africa 2026 supports the UN Sustainable Development Goals,
              especially <strong className="text-accent">SDG 4 — Quality Education</strong>,
              promoting inclusive, equitable quality learning for all.
            </p>
            <div className="flex flex-wrap gap-2">
              {SDGS.map((s) => (
                <Badge
                  key={s.code}
                  variant="outline"
                  className={
                    s.primary
                      ? "border-accent text-accent bg-accent/10"
                      : "border-white/20 text-white/80"
                  }
                >
                  {s.code} · {s.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-charcoal-light/60 p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <h3 className="font-playfair text-xl text-white">
                Aligned With AU Agenda 2063
              </h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Supporting the African Union vision of an integrated, prosperous,
              and peaceful Africa driven by its citizens — through education,
              youth, innovation, and continental collaboration.
            </p>
            <div className="flex flex-wrap gap-2">
              {AU_PILLARS.map((p) => (
                <Badge
                  key={p}
                  variant="outline"
                  className="border-white/20 text-white/80"
                >
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Recognition to Impact + Accordion deep dive */}
        <Accordion type="single" collapsible className="rounded-2xl border border-white/10 bg-charcoal-light/40 px-4 md:px-6">
          <AccordionItem value="impact" className="border-white/10">
            <AccordionTrigger className="text-white hover:no-underline">
              <span className="font-playfair text-lg text-left">
                From Recognition to Real Impact
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/75 text-sm leading-relaxed">
              The NESA-Africa 2026 journey does not end at the Blue Garnet
              Awards Gala. After the gala, the campaign transitions into
              post-award social impact through{" "}
              <strong className="text-accent">EduAid Africa</strong> and{" "}
              <strong className="text-accent">Rebuild My School Africa</strong>
              , supporting school interventions, scholarships, infrastructure,
              learning access, and accessibility across formal, informal, and
              special needs schools.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="journey" className="border-white/10">
            <AccordionTrigger className="text-white hover:no-underline">
              <span className="font-playfair text-lg text-left">
                How nominations, AGC voting, jury & gala connect
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/75 text-sm leading-relaxed">
              Public nominations open the journey, NRC verifies evidence,
              independent jurors score with the EDI rubric, the public votes
              with AGC during open windows, and the Blue Garnet Awards Gala
              celebrates winners across all tiers — broadcast on NESA TV.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="efa" className="border-b-0">
            <AccordionTrigger className="text-white hover:no-underline">
              <span className="font-playfair text-lg text-left">
                How NESA-Africa advances Education for All
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/75 text-sm leading-relaxed">
              By recognising and amplifying changemakers across the 8 EDI
              pillars and channelling visibility into post-award programs,
              NESA-Africa turns recognition into measurable education
              development — aligned with SDG 4 and AU Agenda 2063.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-accent text-charcoal hover:bg-accent/90">
            <Link to="/nominate">Nominate for 2026</Link>
          </Button>
          <Button asChild variant="outline" className="border-accent/40 text-accent hover:bg-accent/10">
            <Link to="/nominees">Explore Existing Nominees</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="/about">View the 2026 Journey</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="/sponsors">Partner for Impact</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default AboutNESASection;
