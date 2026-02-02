import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Building,
  ExternalLink,
  GraduationCap,
  Heart,
  Library,
  School,
} from "lucide-react";

const programs = [
  {
    icon: Award,
    title: "NESA-Africa",
    description: "New Education Standard Award Africa — the flagship recognition platform.",
    href: "/",
  },
  {
    icon: Heart,
    title: "EduAid-Africa",
    description: "Direct student support programme providing scholarships and learning materials.",
    href: "/eduaid",
  },
  {
    icon: School,
    title: "Rebuild My School Africa",
    description: "Infrastructure development initiative rebuilding and equipping schools.",
    href: "/rebuild",
  },
  {
    icon: Library,
    title: "eLibrary Nigeria",
    description: "Digital library providing free access to educational resources.",
    href: "https://elibrarynigeria.org",
    external: true,
  },
];

export default function SCEF() {
  return (
    <>
      <Helmet>
        <title>SCEF Foundation | Santos Creations Educational Foundation</title>
        <meta
          name="description"
          content="Santos Creations Educational Foundation (SCEF) is the parent organization driving education transformation across Africa through multiple programmes."
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
                <Building className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Parent Organization
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Santos Creations Educational Foundation
              </h1>
              <p className="mb-8 text-lg text-white/70">
                SCEF is a registered non-profit driving education transformation across Africa
                through recognition, support, and infrastructure development programmes.
              </p>
              <Button asChild className="bg-primary text-primary-foreground">
                <a href="https://santoscreations.org" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit SCEF Website
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <GraduationCap className="mx-auto mb-6 h-12 w-12 text-primary" />
              <h2 className="mb-6 font-display text-3xl font-bold text-white">Our Mission</h2>
              <p className="text-lg leading-relaxed text-white/80">
                To create, implement, and sustain innovative educational programmes that provide
                access, improve quality, and celebrate excellence in education across Africa —
                ensuring no child is left behind in the journey towards Education for All.
              </p>
            </div>
          </div>
        </section>

        {/* Programmes */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Our Programmes
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {programs.map((program) => (
                <Card key={program.title} className="border-white/10 bg-white/5">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <program.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-white">{program.title}</CardTitle>
                    <CardDescription className="text-white/60">{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {program.external ? (
                      <a
                        href={program.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        Learn More <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        to={program.href}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        Learn More
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 text-center md:grid-cols-4">
              {[
                { value: "4", label: "Active Programmes" },
                { value: "5+2", label: "Regional Groups" },
                { value: "1M+", label: "Lives Impacted" },
                { value: "2005", label: "Vision Conceived" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
