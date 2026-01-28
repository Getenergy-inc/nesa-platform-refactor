import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  Globe,
  GraduationCap,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const milestones = [
  { year: "2025", title: "Foundation Year", description: "Launch of continental awards with 17 categories and region-first approach." },
  { year: "2027", title: "Expansion", description: "12 competitive categories, local chapters host up to 4 categories each." },
  { year: "2030", title: "Consolidation", description: "Full continental coverage with sustainable funding model." },
  { year: "2035", title: "Vision Realized", description: "Education for All achieved across participating regions." },
];

const pillars = [
  { icon: GraduationCap, title: "Access", description: "Universal access to quality education across Africa." },
  { icon: Users, title: "Inclusion", description: "No child left behind regardless of location or circumstance." },
  { icon: TrendingUp, title: "Quality", description: "Standardized excellence in teaching and learning outcomes." },
  { icon: Globe, title: "Relevance", description: "Education aligned with Africa's development needs." },
];

export default function Vision2035() {
  return (
    <>
      <Helmet>
        <title>Vision 2035 | NESA-Africa Strategic Roadmap</title>
        <meta
          name="description"
          content="NESA-Africa's Vision 2035 outlines the strategic roadmap for achieving Education for All across Africa through recognition and accountability."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <Link
              to="/about"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to About
            </Link>
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Strategic Roadmap
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Vision 2035
              </h1>
              <p className="mb-8 text-lg text-white/70">
                A decade-long commitment to transform education recognition into measurable impact —
                driving Africa towards universal quality education.
              </p>
              <Button className="bg-primary text-primary-foreground">
                <Download className="mr-2 h-4 w-4" />
                Download Vision Document
              </Button>
            </div>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Four Pillars of Vision 2035
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar) => (
                <Card key={pillar.title} className="border-white/10 bg-white/5 text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <pillar.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-white">{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60">{pillar.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Milestones
            </h2>
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-white/10 md:left-1/2 md:-translate-x-1/2" />
              <div className="space-y-12">
                {milestones.map((milestone, i) => (
                  <div
                    key={milestone.year}
                    className={`relative flex items-start gap-6 md:gap-12 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-4 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-charcoal md:left-1/2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="ml-12 flex-1 md:ml-0 md:text-right">
                      <span className="mb-1 block text-2xl font-bold text-primary">{milestone.year}</span>
                      <h3 className="mb-2 text-xl font-semibold text-white">{milestone.title}</h3>
                      <p className="text-white/60">{milestone.description}</p>
                    </div>
                    <div className="hidden flex-1 md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Be Part of the Vision
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Join thousands of education champions driving Africa's education transformation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-primary text-primary-foreground">
                <Link to="/nominate">Nominate a Champion</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/partners">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
