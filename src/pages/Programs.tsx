import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { ArrowRight, Award, GraduationCap, Users, Globe, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Program {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  status: "active" | "coming-soon" | "archived";
  featured?: boolean;
  stats?: { label: string; value: string }[];
  highlights?: string[];
}

const programs: Program[] = [
  {
    id: "nesa-africa",
    name: "New Education Standard Award Africa",
    shortName: "NESA-Africa",
    tagline: "Honoring Africa's Changemakers",
    description:
      "A pan-African celebration of educational transformation, social impact, and legacy. We celebrate the real changemakers shaping the future of education across Africa.",
    href: "/programs/nesa-africa",
    icon: <Award className="h-8 w-8" />,
    status: "active",
    featured: true,
    stats: [
      { label: "Countries", value: "54" },
      { label: "Categories", value: "25+" },
      { label: "Nominees", value: "1000+" },
    ],
    highlights: [
      "Pan-African Recognition",
      "Multi-tier Awards System",
      "Live Gala Ceremony",
      "TV Show Series",
    ],
  },
  {
    id: "eduaid",
    name: "EduAid Initiative",
    shortName: "EduAid",
    tagline: "Supporting Educational Access",
    description:
      "Providing scholarships, educational resources, and support to underprivileged students across Africa.",
    href: "/programs/eduaid",
    icon: <GraduationCap className="h-8 w-8" />,
    status: "coming-soon",
  },
  {
    id: "teacher-exchange",
    name: "Pan-African Teacher Exchange",
    shortName: "Teacher Exchange",
    tagline: "Connecting Educators Across Borders",
    description:
      "A professional development program facilitating knowledge sharing between educators across African nations.",
    href: "/programs/teacher-exchange",
    icon: <Users className="h-8 w-8" />,
    status: "coming-soon",
  },
  {
    id: "digital-literacy",
    name: "Digital Literacy for Africa",
    shortName: "DigiLit Africa",
    tagline: "Bridging the Digital Divide",
    description:
      "Empowering communities with essential digital skills for the 21st century economy.",
    href: "/programs/digital-literacy",
    icon: <Globe className="h-8 w-8" />,
    status: "coming-soon",
  },
];

export default function Programs() {
  const { currentEdition } = useSeason();
  const featuredProgram = programs.find((p) => p.featured);
  const otherPrograms = programs.filter((p) => !p.featured);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>Programs | SCEF - Santos Creations Educational Foundation</title>
        <meta
          name="description"
          content="Explore SCEF's educational programs transforming Africa's future through recognition, support, and innovation."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-semibold text-lg">SCEF</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/categories">
                <Button variant="ghost" size="sm">
                  Categories
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-secondary/50 to-background py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute right-1/4 bottom-10 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
          </div>
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                <Calendar className="mr-1.5 h-3 w-3" />
                {currentEdition.displayYear} Season Active
              </Badge>
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Our <span className="text-primary">Programs</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Transforming education across Africa through recognition, support, and innovation.
                Explore our initiatives designed to celebrate excellence and drive lasting change.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Program */}
        {featuredProgram && (
          <section className="py-16">
            <div className="container">
              <div className="mb-8 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Featured Program
                </h2>
              </div>

              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-secondary/80 via-secondary/60 to-background shadow-xl">
                <div className="grid gap-8 lg:grid-cols-2">
                  <CardHeader className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {featuredProgram.icon}
                    </div>
                    <Badge className="mb-2 w-fit bg-primary/20 text-primary hover:bg-primary/30">
                      Now Open
                    </Badge>
                    <CardTitle className="mb-2 text-3xl font-bold lg:text-4xl">
                      {featuredProgram.shortName}
                    </CardTitle>
                    <p className="mb-2 text-xl text-primary">{featuredProgram.tagline}</p>
                    <CardDescription className="text-base text-muted-foreground">
                      {featuredProgram.description}
                    </CardDescription>

                    {featuredProgram.highlights && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {featuredProgram.highlights.map((highlight) => (
                          <Badge
                            key={highlight}
                            variant="outline"
                            className="border-border/60 bg-background/50"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link to={featuredProgram.href}>
                        <Button size="lg" className="gap-2">
                          Explore Program
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/nominate">
                        <Button size="lg" variant="outline" className="gap-2">
                          <Award className="h-4 w-4" />
                          Nominate Now
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>

                  <CardContent className="flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-8 lg:p-12">
                    {featuredProgram.stats && (
                      <div className="grid w-full grid-cols-3 gap-4">
                        {featuredProgram.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="flex flex-col items-center justify-center rounded-xl bg-background/80 p-6 text-center shadow-sm"
                          >
                            <span className="text-3xl font-bold text-primary lg:text-4xl">
                              {stat.value}
                            </span>
                            <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Other Programs */}
        <section className="border-t border-border/40 bg-muted/30 py-16">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">More Programs</h2>
              <p className="text-muted-foreground">
                Discover our upcoming initiatives and expanding impact.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherPrograms.map((program) => (
                <Card
                  key={program.id}
                  className={`group relative overflow-hidden transition-all hover:shadow-lg ${
                    program.status === "coming-soon" ? "opacity-80" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      {program.icon}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl">{program.shortName}</CardTitle>
                      {program.status === "coming-soon" && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-primary">{program.tagline}</p>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{program.description}</CardDescription>
                    {program.status === "active" ? (
                      <Link to={program.href}>
                        <Button variant="outline" size="sm" className="gap-2">
                          Learn More
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Notify Me
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <Card className="border-primary/20 bg-gradient-to-r from-secondary to-secondary/80 p-8 text-center lg:p-12">
              <h2 className="mb-2 text-2xl font-bold lg:text-3xl">
                Want to Partner With Us?
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
                Join us in transforming education across Africa. Whether as a sponsor, partner, or
                volunteer, your contribution makes a lasting impact.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  Become a Partner
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link to="/">
                  <Button size="lg" variant="outline">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-secondary/30 py-8">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© {currentYear} Santos Creations Educational Foundation. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
