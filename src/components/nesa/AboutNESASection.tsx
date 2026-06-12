/**
 * About NESA-Africa 2026 — compact accordion landing section.
 * All long-form content is collapsed by default into 8 expandable panels.
 * Mobile-first (single-open), desktop allows multi-open.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Compass,
  ArrowRight,
  Trophy,
  Route,
  Target,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExistingNomineesInline } from "@/components/nominees/ExistingNomineesInline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EDI_PILLARS = [
  { n: "01", icon: GraduationCap, title: "Access to Education", desc: "Expanding learning opportunities across underserved, rural, informal, and special needs education communities." },
  { n: "02", icon: BookOpen, title: "Quality Learning", desc: "Improving teaching, curriculum, STEM, digital learning, research, libraries, and learning outcomes." },
  { n: "03", icon: Users, title: "Equity & Inclusion", desc: "Advancing girls' education, special needs, marginalised communities, diaspora, and inclusive participation." },
  { n: "04", icon: Sparkles, title: "Innovation & Technology", desc: "Recognising EduTech, AI, digital learning, media advocacy, STEM, and technology-enabled education solutions." },
  { n: "05", icon: HeartHandshake, title: "Community & Social Impact", desc: "Mobilising public nominations, local chapters, re-nominations, AGC voting, and regional participation." },
  { n: "06", icon: Building2, title: "Infrastructure & School Support", desc: "Connecting recognition to school grants, infrastructure, learning materials, and Rebuild My School Africa." },
  { n: "07", icon: ShieldCheck, title: "Governance & Accountability", desc: "Strengthening trust via evidence review, jury onboarding, transparent voting, verification, and audit trails." },
  { n: "08", icon: Handshake, title: "Partnerships & Resource Mobilisation", desc: "Engaging CSR leaders, sponsors, donors, institutions, diaspora, and development partners for impact." },
];

const SDGS = [
  { code: "SDG 4", label: "Quality Education", primary: true },
  { code: "SDG 5", label: "Gender Equality" },
  { code: "SDG 8", label: "Decent Work & Growth" },
  { code: "SDG 9", label: "Innovation & Infrastructure" },
  { code: "SDG 10", label: "Reduced Inequalities" },
  { code: "SDG 17", label: "Partnerships for the Goals" },
];

const AU_TAGS = [
  "Education recognition",
  "Youth empowerment",
  "Innovation",
  "Cultural identity",
  "Regional collaboration",
  "Diaspora engagement",
  "Citizen-led participation",
];

type Panel = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  preview: string;
  render: () => React.ReactNode;
};

const PANELS: Panel[] = [
  {
    id: "what",
    icon: Trophy,
    title: "What NESA-Africa 2026 Is",
    preview: "More than a continental award — a public recognition and education-impact ecosystem.",
    render: () => (
      <p>
        NESA-Africa identifies, celebrates, and amplifies changemakers advancing
        education across Africa and the diaspora.
      </p>
    ),
  },
  {
    id: "journey",
    icon: Route,
    title: "The 2026 Award Journey",
    preview: "From public nominations to verification, voting, gala recognition, and post-award impact.",
    render: () => (
      <p>
        Public nominations → NRC verification → jury onboarding → Gold
        Certificate public voting → Blue Garnet final voting → Awards Gala →
        post-award impact.
      </p>
    ),
  },
  {
    id: "efa",
    icon: Target,
    title: "How NESA-Africa Advances Education for All",
    preview: "Spotlighting changemakers advancing access, quality, equity, innovation, infrastructure, governance, and partnerships.",
    render: () => (
      <p>
        NESA-Africa spotlights individuals, organisations, institutions,
        communities, diaspora supporters, and Friends of Africa supporting
        Education for All across Africa.
      </p>
    ),
  },
  {
    id: "edi",
    icon: Compass,
    title: "NESA-Africa 2026 EDI Matrix",
    preview: "An 8-pillar framework for measuring education-development value.",
    render: () => (
      <div>
        <p className="mb-4">
          The Education Development Index Matrix helps classify and communicate
          the education-development value of nominees, categories, partners, and
          post-award impact projects.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EDI_PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.n}
                className="rounded-xl border border-white/10 bg-charcoal/60 p-3 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-semibold text-accent/80">
                    {p.n}
                  </span>
                </div>
                <h4 className="text-white text-sm font-semibold mb-1">{p.title}</h4>
                <p className="text-white/65 text-xs leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <Button asChild size="sm" variant="outline" className="border-accent/40 text-accent hover:bg-accent/10">
            <Link to="/about">
              Learn More About EDI <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    ),
  },
  {
    id: "sdg",
    icon: Globe2,
    title: "Aligned With Global Education Goals",
    preview: "Aligned with SDG 4 and wider development goals.",
    render: () => (
      <div>
        <p className="mb-3">
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
    ),
  },
  {
    id: "au",
    icon: ShieldCheck,
    title: "Aligned With AU Agenda 2063",
    preview: "Supporting Africa's vision for education, youth, innovation, and citizen-led development.",
    render: () => (
      <div>
        <p className="mb-3">
          NESA-Africa supports the African Union vision of an integrated,
          prosperous, and peaceful Africa driven by its citizens through
          education, youth empowerment, innovation, cultural identity, regional
          collaboration, diaspora engagement, and citizen-led participation.
        </p>
        <div className="flex flex-wrap gap-2">
          {AU_TAGS.map((t) => (
            <Badge key={t} variant="outline" className="border-white/20 text-white/80">
              {t}
            </Badge>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "impact",
    icon: HeartHandshake,
    title: "From Recognition to Real Impact",
    preview: "The journey continues through EduAid Africa and Rebuild My School Africa.",
    render: () => (
      <p>
        The NESA-Africa 2026 journey does not end at the Blue Garnet Awards
        Gala. After the gala, the campaign transitions into post-award social
        impact through <strong className="text-accent">EduAid Africa</strong>{" "}
        and <strong className="text-accent">Rebuild My School Africa</strong>,
        supporting school interventions, scholarships, infrastructure, learning
        access, and accessibility across formal, informal, and special needs
        schools.
      </p>
    ),
  },
  {
    id: "participation",
    icon: Workflow,
    title: "How Participation Connects",
    preview: "How nominations, AGC voting, jury review, and gala recognition work together.",
    render: () => (
      <p>
        Public nominations identify changemakers. NRC verification and jury
        review strengthen credibility. AGC voting drives public participation.
        The gala celebrates recognised impact. Post-award programs connect
        recognition to measurable education support.
      </p>
    ),
  },
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);
  return isDesktop;
}

export function AboutNESASection() {
  const isDesktop = useIsDesktop();

  const accordionProps = isDesktop
    ? ({ type: "multiple" as const, defaultValue: [] as string[] })
    : ({ type: "single" as const, collapsible: true });

  return (
    <section
      id="about-nesa-2026"
      aria-labelledby="about-nesa-2026-title"
      className="bg-charcoal py-14 md:py-20"
    >
      <div className="container mx-auto max-w-5xl px-4">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <Badge variant="outline" className="border-accent/40 text-accent mb-4">
            About NESA-Africa
          </Badge>
          <h2
            id="about-nesa-2026-title"
            className="font-playfair text-3xl md:text-5xl font-bold text-white mb-3"
          >
            About <span className="text-accent">NESA-Africa 2026</span>
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-sm md:text-base">
            Everything you need to know about the continental award, its 2026
            journey, and how it supports Education for All across Africa.
          </p>
        </div>

        {/* Accordion */}
        <Accordion
          {...accordionProps}
          className="space-y-2 md:space-y-3 rounded-2xl"
        >
          {PANELS.map((p) => {
            const Icon = p.icon;
            return (
              <AccordionItem
                key={p.id}
                value={p.id}
                className="border border-white/10 bg-charcoal-light/50 rounded-xl px-3 md:px-4 shadow-[0_0_0_1px_rgba(212,175,55,0.04)] hover:border-accent/30 transition-colors"
              >
                <AccordionTrigger className="min-h-[56px] py-3 hover:no-underline text-left">
                  <div className="flex items-start gap-3 pr-2">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-playfair text-base md:text-lg text-white leading-snug">
                        {p.title}
                      </div>
                      <div className="text-white/60 text-xs md:text-sm mt-0.5 leading-snug">
                        {p.preview}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/75 text-sm leading-relaxed pl-12 pr-1">
                  {p.render()}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Existing nominees inline */}
        <div className="mt-8 md:mt-10">
          <ExistingNomineesInline
            limit={9}
            title="Explore Existing Nominees"
            subtitle="Education changemakers already recognised on the NESA-Africa platform."
          />
        </div>

        {/* CTAs */}
        <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-accent text-charcoal hover:bg-accent/90">
            <Link to="/nominate">Nominate for 2026</Link>
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
