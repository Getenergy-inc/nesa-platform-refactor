/**
 * NESA Africa — Impact Storytelling Guide
 * Public guide for nominees, nominators, editors and ambassadors describing the
 * recommended templates for telling a compelling Education Impact Story.
 */

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  AlertTriangle,
  Rocket,
  TrendingUp,
  Compass,
  Users,
  BarChart3,
  Star,
  Sparkles,
  Quote,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Mic,
  CheckCircle2,
} from "lucide-react";

const CORE_STEPS = [
  {
    title: "The Challenge",
    blurb: "Name the specific education barrier — be vivid but respectful. Ground it in place, people and data.",
    icon: AlertTriangle,
    color: "text-amber-400",
    ring: "ring-amber-400/20",
  },
  {
    title: "The Intervention",
    blurb: "Show the bold, sustained action taken. Highlight leadership, inclusion and innovation choices.",
    icon: Rocket,
    color: "text-gold",
    ring: "ring-gold/25",
  },
  {
    title: "The Transformation",
    blurb: "Use verifiable metrics tied to Education for All — pair every number with a human story.",
    icon: TrendingUp,
    color: "text-emerald-400",
    ring: "ring-emerald-400/20",
  },
  {
    title: "The Vision",
    blurb: "End with the future: how does this scale, inspire systemic change, and serve Africa beyond today?",
    icon: Compass,
    color: "text-sky-300",
    ring: "ring-sky-300/20",
  },
];

const TEMPLATES = [
  {
    code: "A",
    name: "Beneficiary-Centered Story",
    tag: "Most emotional",
    summary: "Center one learner, teacher or community. Trace their before → turning point → measurable transformation → ripple effect.",
    prompt:
      "Tell us about one person or community whose life changed because of your work. What was their reality before? What changed, and why does it matter for Africa's education future?",
    icon: Users,
  },
  {
    code: "B",
    name: "EDI-Aligned Story",
    tag: "Data + narrative",
    summary: "Write one tight paragraph per EDI dimension — Impact, Leadership, Innovation, Inclusion, Sustainability, Community Reach — then weave them together.",
    prompt:
      "For each EDI pillar, share one concrete sentence: who was reached, what changed, and the verifiable proof point.",
    icon: BarChart3,
  },
  {
    code: "C",
    name: "STAR Method",
    tag: "Evidence-led",
    summary: "Situation → Task → Action → Result. Excellent for awards juries who scan for specificity and accountability.",
    prompt:
      "Describe the situation, the task you set yourself, the actions you led, and the result — in numbers and in lives.",
    icon: Star,
  },
  {
    code: "D",
    name: "Before → After",
    tag: "Simple & visual",
    summary: "Anchor in two snapshots — the world before, the world after — and show the nominee as the bridge between them.",
    prompt:
      "Paint the before picture with one statistic and one personal story. Paint the after picture the same way. Then describe the bridge you built.",
    icon: Sparkles,
  },
];

const EDI_BULLETS = [
  { label: "Education Impact", example: "Reached 12,000 learners across 48 schools, improving completion rates by 23%." },
  { label: "Leadership", example: "Influenced national policy on inclusive education and trained 500 school leaders." },
  { label: "Innovation", example: "Developed a low-cost solar-powered digital learning kit now used in 3 countries." },
  { label: "Inclusion", example: "Ensured 65% of beneficiaries are girls and children with disabilities." },
  { label: "Sustainability", example: "Built community-owned school management committees that continue operations independently." },
  { label: "Community Reach", example: "Engaged 50+ local partners and reached remote villages in 4 regions." },
];

const DESIGN_TIPS = [
  { icon: Quote, text: "One powerful hero headline — a single sentence that captures the breakthrough." },
  { icon: BookOpen, text: "Story body of 300–600 words, broken into short paragraphs with clear subheadings." },
  { icon: ImageIcon, text: "Before/after photos or a simple timeline — anchor the change visually." },
  { icon: BarChart3, text: "Impact counters and the EDI radar chart sitting side by side." },
  { icon: Video, text: "A short embedded video or testimonial quote from a beneficiary." },
  { icon: Mic, text: "Authentic African voices — make nominees and beneficiaries the heroes, not the institution." },
];

const PRINCIPLES = [
  "Center African voices and agency — beneficiaries lead the narrative.",
  "Balance data + emotion — numbers prove scale, stories create connection.",
  "Stay authentic and jargon-free — write the way people speak.",
  "End with inspiration — show how this advances Education for All.",
  "Optimize for mobile — short paragraphs, clear subheads, swipeable images.",
];

export default function ImpactStorytelling() {
  return (
    <main className="min-h-screen bg-charcoal text-ivory">
      <Helmet>
        <title>Impact Storytelling Guide | NESA-Africa</title>
        <meta
          name="description"
          content="Templates and best practices for telling compelling education impact stories on NESA-Africa nominee profiles — Problem, Intervention, Results, Vision."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/guidelines/impact-storytelling" />
      </Helmet>

      {/* HERO */}
      <section className="border-b border-gold/10 bg-gradient-to-b from-charcoal-light/40 to-charcoal">
        <div className="container mx-auto px-4 py-14 md:py-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-gold/15 text-gold border-gold/30 mb-4">
              Storytelling Guide
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl text-ivory leading-tight mb-4">
              Tell an Education Impact Story Africa will remember.
            </h1>
            <p className="text-ivory/70 text-base md:text-lg leading-relaxed max-w-3xl">
              Every NESA-Africa nominee profile is built around a story arc — Challenge,
              Intervention, Transformation, Vision. Use these proven templates to make
              your nomination unforgettable to judges, voters and communities.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
                <Link to="/nominate">Start a Nomination</Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <Link to="/guidelines/edi-matrix">View EDI Matrix Methodology</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE STRUCTURE */}
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <div className="mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            The Core Story Arc
          </h2>
          <p className="text-ivory/60 text-sm md:text-base max-w-3xl">
            Use this as the default structure for every Education Impact Story. It is the
            same arc rendered on every approved nominee profile.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CORE_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`rounded-xl bg-charcoal-light/50 border border-gold/10 p-5 ring-1 ${s.ring}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                  <h3 className="font-display text-ivory text-lg">{s.title}</h3>
                </div>
                <p className="text-ivory/70 text-sm leading-relaxed">{s.blurb}</p>
              </div>
            );
          })}
        </div>

        <Card className="bg-charcoal-light/40 border-gold/15 mt-6">
          <CardContent className="p-5 flex items-start gap-3">
            <Quote className="w-6 h-6 text-gold/40 flex-shrink-0 mt-1" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold/70 mb-1">
                Example one-liner headline
              </p>
              <p className="text-ivory/90 text-base md:text-lg italic">
                "Turning remote villages into STEM hubs: how Amara Okoye brought quality
                education to 12,000 underserved children across East Africa."
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TEMPLATES */}
      <section className="border-t border-gold/10 bg-charcoal-light/20">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            Four Rubric-Ready Templates
          </h2>
          <p className="text-ivory/60 text-sm md:text-base max-w-3xl mb-8">
            Pick the template that fits the story you're telling. Each one is judge-friendly
            and pairs cleanly with the EDI Matrix scoring framework.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map((t) => {
              const Icon = t.icon;
              return (
                <Card key={t.code} className="bg-charcoal-light/50 border-gold/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <CardTitle className="text-ivory text-base">
                            Template {t.code} — {t.name}
                          </CardTitle>
                          <p className="text-[11px] text-gold/70 uppercase tracking-wider mt-0.5">
                            {t.tag}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-ivory/75 text-sm leading-relaxed">{t.summary}</p>
                    <div className="rounded-lg bg-charcoal/40 border border-gold/10 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gold/70 mb-1">
                        Prompt for nominees / editors
                      </p>
                      <p className="text-ivory/70 text-xs italic leading-relaxed">
                        "{t.prompt}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* EDI BULLETS EXAMPLES */}
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <h2 className="font-display text-2xl md:text-3xl text-ivory mb-2">
          EDI Dimension Story Bullets
        </h2>
        <p className="text-ivory/60 text-sm md:text-base max-w-3xl mb-6">
          Use one specific, evidence-backed line per EDI pillar. These are the exact
          dimensions used on every nominee profile radar chart.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EDI_BULLETS.map((b) => (
            <div
              key={b.label}
              className="rounded-lg bg-charcoal-light/40 border border-gold/10 p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-ivory">{b.label}</span>
              </div>
              <p className="text-ivory/70 text-sm leading-relaxed">{b.example}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESIGN TIPS */}
      <section className="border-t border-gold/10 bg-charcoal-light/20">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl text-ivory mb-2">
            Profile Design Recommendations
          </h2>
          <p className="text-ivory/60 text-sm md:text-base max-w-3xl mb-6">
            How to present the story on a nominee profile so it earns attention on mobile
            and on big screens alike.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DESIGN_TIPS.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={i}
                  className="rounded-lg bg-charcoal-light/40 border border-gold/10 p-4 flex items-start gap-3"
                >
                  <Icon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-ivory/75 text-sm leading-relaxed">{t.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <h2 className="font-display text-2xl md:text-3xl text-ivory mb-2">
          Five Principles for African Education Stories
        </h2>
        <ul className="space-y-2.5 mt-5">
          {PRINCIPLES.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <ChevronRight className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
              <span className="text-ivory/80 text-sm md:text-base leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-6 md:p-8 text-center">
          <h3 className="font-display text-ivory text-xl md:text-2xl mb-2">
            Ready to tell your story?
          </h3>
          <p className="text-ivory/70 text-sm md:text-base max-w-2xl mx-auto mb-5">
            Start a nomination or explore stories already shaping Africa's education future.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark font-semibold">
              <Link to="/nominate">Submit a Nomination</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
              <Link to="/nominees">Explore Existing Nominees</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
