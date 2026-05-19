import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Globe2,
  Handshake,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/layout/PublicLayout";

const trustStats = [
  { label: "Pan-African Reach", value: "54", detail: "African countries targeted" },
  { label: "Recognition Focus", value: "2026", detail: "New Education Standard Awards" },
  { label: "Impact Mission", value: "SDG 4", detail: "Quality education alignment" },
];

const categories = [
  "Educators & Teachers",
  "Schools & Institutions",
  "NGOs & Foundations",
  "EdTech & Innovation",
  "Policy & Leadership",
  "Community Impact",
];

const steps = [
  {
    icon: UsersRound,
    title: "Nominate",
    text: "Submit an education champion, institution, project, or innovation creating measurable impact.",
  },
  {
    icon: ShieldCheck,
    title: "Review",
    text: "Entries are screened for eligibility, credibility, impact, and alignment with NESA standards.",
  },
  {
    icon: Trophy,
    title: "Recognise",
    text: "Outstanding changemakers are celebrated through visibility, awards, partnerships, and impact support.",
  },
];

const trustItems = [
  "Hosted by the Nigeria Local Chapter of Santos Creations Educational Foundation (SCEF)",
  "Designed around recognition, engagement, funding, and education impact",
  "Built to celebrate excellence across Africa's education ecosystem",
];

export default function LandingV2() {
  return (
    <>
      <Helmet>
        <title>NESA Africa 2026 | Recognising Africa's Education Changemakers</title>
        <meta
          name="description"
          content="NESA Africa 2026 celebrates educators, institutions, innovators, NGOs, and leaders transforming education across Africa."
        />
      </Helmet>

      <PublicLayout>
        <div className="text-white">

        <main className="pb-20 lg:pb-0">
          {/* HERO */}
          <section className="relative overflow-hidden border-b border-gold/10">
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light/40 to-charcoal" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--gold)/0.08),transparent_50%)]" />

            <div className="container relative z-10 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-medium mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  NESA Africa 2026 — Recognition to Real Impact
                </div>

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Recognising Africa's{" "}
                  <span className="text-gold">Education Changemakers</span>
                </h1>

                <p className="text-lg text-white/70 mb-8 max-w-xl leading-relaxed">
                  NESA Africa celebrates educators, institutions, innovators, NGOs, and leaders
                  transforming education across Africa through recognition, visibility, and impact support.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-12">
                  <Link to="/nominate">
                    <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-8 gap-2 w-full sm:w-auto">
                      Nominate a Champion <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/categories">
                    <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-8 w-full sm:w-auto">
                      Explore Award Categories
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {trustStats.map((item) => (
                    <div key={item.label} className="border-l-2 border-gold/40 pl-3">
                      <p className="font-display text-2xl md:text-3xl font-bold text-gold">{item.value}</p>
                      <p className="text-xs font-semibold text-white/90 mt-1">{item.label}</p>
                      <p className="text-xs text-white/50 mt-0.5">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-gold/20 via-gold/5 to-transparent border border-gold/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-24 w-24 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto mb-6">
                      <Trophy className="h-12 w-12 text-gold" />
                    </div>
                    <p className="font-display text-2xl font-bold text-white mb-1">Blue Garnet Award</p>
                    <p className="text-gold text-sm font-medium mb-6">NESA 2026</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal-light/60 border border-gold/20 text-sm text-white/80">
                      <Globe2 className="h-4 w-4 text-gold" />
                      Africa Education Impact
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section className="py-16 md:py-20 border-b border-gold/10">
            <div className="container max-w-3xl text-center">
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">What is NESA Africa?</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                A continental platform for education excellence.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                NESA Africa exists to spotlight the people, institutions, and initiatives advancing
                education outcomes across Africa. Understand the mission, trust the platform, and take action.
              </p>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="py-16 md:py-20 border-b border-gold/10 bg-charcoal-light/20">
            <div className="container">
              <div className="text-center mb-12">
                <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-white/65 max-w-xl mx-auto">
                  A clear three-step flow reduces confusion and improves conversion.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <Card key={step.title} className="bg-charcoal-light/40 border-gold/15 hover:border-gold/40 transition-colors">
                      <CardContent className="p-6 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 relative">
                          <Icon className="h-6 w-6 text-gold" />
                          <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold text-charcoal text-xs font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-2 text-white">{step.title}</h3>
                        <p className="text-white/65 text-sm leading-relaxed">{step.text}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CATEGORIES */}
          <section className="py-16 md:py-20 border-b border-gold/10">
            <div className="container">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div>
                  <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Award Categories</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold">Who NESA Recognises</h2>
                </div>
                <Link to="/categories">
                  <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2">
                    View All Categories <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-3 p-4 rounded-xl bg-charcoal-light/40 border border-gold/15 hover:border-gold/40 hover:bg-charcoal-light/60 transition-all"
                  >
                    <Award className="h-5 w-5 text-gold flex-shrink-0" />
                    <span className="text-white/90 font-medium text-sm md:text-base">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TRUST */}
          <section className="py-16 md:py-20 border-b border-gold/10 bg-charcoal-light/20">
            <div className="container">
              <div className="max-w-2xl mb-12">
                <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Trust & Reputation</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Make credibility visible before asking users to act.
                </h2>
                <p className="text-white/65 leading-relaxed">
                  Partner logos, judge visibility, testimonials, media mentions, and transparent award
                  methodology — all surfaced where they matter most.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {trustItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-charcoal-light/40 border border-gold/15">
                    <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-white/85 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-charcoal-light/40 border-gold/20">
                  <CardContent className="p-6">
                    <Globe2 className="h-6 w-6 text-gold mb-3" />
                    <h3 className="font-display text-lg font-bold mb-2 text-white">Pan-African Positioning</h3>
                    <p className="text-white/65 text-sm">Frame NESA as a continental education recognition movement.</p>
                  </CardContent>
                </Card>
                <Card className="bg-charcoal-light/40 border-gold/20">
                  <CardContent className="p-6">
                    <Handshake className="h-6 w-6 text-gold mb-3" />
                    <h3 className="font-display text-lg font-bold mb-2 text-white">Partner Confidence</h3>
                    <p className="text-white/65 text-sm">Surface institutional affiliations, sponsors, and media proof.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="py-20 md:py-28">
            <div className="container max-w-2xl text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">
                Ready to recognise an <span className="text-gold">education champion?</span>
              </h2>
              <p className="text-white/65 text-lg mb-8">
                Keep the action simple. Submit a nomination or partner with NESA today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/nominate">
                  <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-8 gap-2 w-full sm:w-auto">
                    Nominate a Champion <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/partners">
                  <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-8 w-full sm:w-auto">
                    Partner With NESA
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2 lg:hidden">
          <Link to="/nominate" className="block">
            <Button size="lg" className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full shadow-xl shadow-gold/30">
              Nominate a Champion
            </Button>
          </Link>
        </div>
        </div>
      </PublicLayout>
    </>
  );
}
