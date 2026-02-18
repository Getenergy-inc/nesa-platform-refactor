import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { ArrowRight, Award, GraduationCap, Users, Globe, Calendar, Sparkles, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { REBUILD_MILESTONES } from "@/config/rebuildConfig";
import { motion } from "framer-motion";

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
    href: "/",
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
    name: "EduAid Africa",
    shortName: "EduAid Africa",
    tagline: "Supporting Educational Access",
    description:
      "Providing scholarships, educational resources, and support to underprivileged students across Africa.",
    href: "/eduaid-africa",
    icon: <GraduationCap className="h-8 w-8" />,
    status: "active",
    highlights: [
      "Scholarship Fund",
      "Learning Materials",
      "Digital Education",
      "Teacher Training",
    ],
  },
  {
    id: "rebuild",
    name: "Rebuild My School Africa",
    shortName: "Rebuild My School",
    tagline: "Post-Award Legacy Project",
    description:
      "The official post-award legacy project of NESA-Africa. Nominate special needs schools for EduAid-Africa intervention — governed by SCEF Regional BOD.",
    href: "/eduaid-africa/rebuild-my-school",
    icon: <Heart className="h-8 w-8" />,
    status: "active",
    highlights: [
      "5 Regional Portals",
      "Special Needs Focus",
      "SCEF Governed",
      `Nominations ${REBUILD_MILESTONES[0].displayDate}`,
    ],
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

  return (
    <>
      <Helmet>
        <title>Programs | SCEF - Santos Creations Educational Foundation</title>
        <meta
          name="description"
          content="Explore SCEF's educational programs transforming Africa's future through recognition, support, and innovation."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-primary/10 pt-24 pb-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute right-1/4 bottom-10 h-48 w-48 rounded-full bg-primary/5 blur-[80px]" />
          </div>
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/10">
                <Calendar className="mr-1.5 h-3 w-3" />
                {currentEdition.displayYear} Season Active
              </Badge>
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Our <span className="text-primary">Programs</span>
              </h1>
              <p className="text-lg text-white/60">
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

              <div className="overflow-hidden rounded-xl border border-primary/20 bg-charcoal-light/30 shadow-xl">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {featuredProgram.icon}
                    </div>
                    <Badge className="mb-2 w-fit bg-primary/20 text-primary hover:bg-primary/30 border-0">
                      Now Open
                    </Badge>
                    <h3 className="mb-2 font-display text-3xl font-bold text-white lg:text-4xl">
                      {featuredProgram.shortName}
                    </h3>
                    <p className="mb-2 text-xl text-primary">{featuredProgram.tagline}</p>
                    <p className="text-base text-white/60">
                      {featuredProgram.description}
                    </p>

                    {featuredProgram.highlights && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {featuredProgram.highlights.map((highlight) => (
                          <Badge
                            key={highlight}
                            variant="outline"
                            className="border-white/10 bg-white/5 text-white/70"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link to={featuredProgram.href}>
                        <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-secondary">
                          Explore Program
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/nominate">
                        <Button size="lg" variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                          <Award className="h-4 w-4" />
                          Nominate Now
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-center bg-primary/5 p-8 lg:p-12">
                    {featuredProgram.stats && (
                      <div className="grid w-full grid-cols-3 gap-4">
                        {featuredProgram.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="flex flex-col items-center justify-center rounded-xl bg-charcoal/80 border border-primary/10 p-6 text-center"
                          >
                            <span className="text-3xl font-bold text-primary lg:text-4xl">
                              {stat.value}
                            </span>
                            <span className="mt-1 text-sm text-white/50">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Programs */}
        <section className="border-t border-primary/10 py-16">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-white">More Programs</h2>
              <p className="text-white/50">
                Discover our initiatives and expanding impact.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherPrograms.map((program, i) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`group relative overflow-hidden rounded-xl border border-primary/15 bg-charcoal-light/30 hover:border-primary/30 transition-all ${
                    program.status === "coming-soon" ? "opacity-70" : ""
                  }`}
                >
                  <div className="p-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      {program.icon}
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-xl font-display font-bold text-white">{program.shortName}</h3>
                      {program.status === "coming-soon" && (
                        <Badge className="shrink-0 text-[10px] bg-white/10 text-white/50 border-0">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-primary mb-3">{program.tagline}</p>
                    <p className="text-white/50 text-sm mb-4">{program.description}</p>

                    {program.highlights && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {program.highlights.map((h) => (
                          <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    {program.status === "active" ? (
                      <Link to={program.href}>
                        <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                          Learn More
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="border-white/10 text-white/30">
                        Notify Me
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 border-t border-primary/10">
          <div className="container">
            <div className="rounded-xl border border-primary/15 bg-primary/5 p-8 text-center lg:p-12">
              <h2 className="mb-2 font-display text-2xl font-bold text-white lg:text-3xl">
                Want to Partner With Us?
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-white/50">
                Join us in transforming education across Africa. Whether as a sponsor, partner, or
                volunteer, your contribution makes a lasting impact.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-secondary">
                  Become a Partner
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link to="/">
                  <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}
