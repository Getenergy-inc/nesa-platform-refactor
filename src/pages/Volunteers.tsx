import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  MapPin,
  Users,
  Globe,
  ArrowRight,
  Award,
  Sparkles,
  Languages,
  Megaphone,
  Camera,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

interface VolunteerTeam {
  name: string;
  department: string;
  region: string;
  countries: string[];
  members: number;
  contribution: string;
  icon: typeof Heart;
}

const TEAMS: VolunteerTeam[] = [
  {
    name: "Nomination Review Corps",
    department: "Nominations & Eligibility",
    region: "Pan-African",
    countries: ["Nigeria", "Kenya", "Ghana", "South Africa", "Egypt"],
    members: 480,
    contribution: "Verify nominee evidence, eligibility & EDI scoring inputs.",
    icon: ClipboardCheck,
  },
  {
    name: "Storytellers & Media Team",
    department: "Content & Media",
    region: "West & East Africa",
    countries: ["Nigeria", "Ghana", "Kenya", "Uganda"],
    members: 220,
    contribution: "Produce nominee features, interviews and video stories.",
    icon: Camera,
  },
  {
    name: "Regional Outreach Volunteers",
    department: "Community Outreach",
    region: "All 10 Regions",
    countries: ["54 African countries + Diaspora"],
    members: 760,
    contribution: "Engage schools, universities and community partners.",
    icon: Megaphone,
  },
  {
    name: "Translation Guild",
    department: "Localization",
    region: "Continental + Diaspora",
    countries: ["Senegal", "Morocco", "Mozambique", "Tanzania", "Ethiopia"],
    members: 140,
    contribution: "Translate content into 11 official platform languages.",
    icon: Languages,
  },
  {
    name: "Event Operations Crew",
    department: "Events & Gala",
    region: "Hosting Cities",
    countries: ["Nigeria", "Kenya", "Rwanda", "South Africa"],
    members: 310,
    contribution: "On-the-ground support for ceremonies, summits & chapter events.",
    icon: Sparkles,
  },
  {
    name: "Chapter Coordinators",
    department: "Local Chapters (OLC)",
    region: "All Regions",
    countries: ["Multi-country chapter network"],
    members: 190,
    contribution: "Lead local chapter activities, recruitment and recognition.",
    icon: Users,
  },
];

const STATS = [
  { value: "2,000+", label: "Active Volunteers" },
  { value: "30+", label: "Countries Represented" },
  { value: "50,000+", label: "Volunteer Hours" },
  { value: "10", label: "Regional Teams" },
];

export default function Volunteers() {
  return (
    <>
      <Helmet>
        <title>Meet Our Volunteers | NESA-Africa</title>
        <meta
          name="description"
          content="Meet the volunteers and teams powering NESA-Africa across departments, countries and regions. Join our movement to recognise Africa's education champions."
        />
        <link rel="canonical" href="https://www.nesa.africa/volunteers" />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-gold" />
                <span className="text-sm font-medium uppercase tracking-wider text-gold">
                  The People Behind the Movement
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-ivory md:text-5xl">
                Meet Our <span className="text-gold">Volunteers</span>
              </h1>
              <p className="mb-8 text-lg text-ivory/80">
                NESA-Africa is powered by a continent-wide network of volunteers — reviewers,
                storytellers, translators, event crews and chapter coordinators — working across
                30+ countries to recognise Africa's education champions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                  <Link to="/volunteer">
                    <Heart className="mr-2 h-5 w-5" /> Become a Volunteer
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to="/contributors">View Hall of Contributors</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal/95 py-12 border-y border-gold/10">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-3xl gap-8 text-center md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="mb-2 text-3xl font-bold text-gold">{s.value}</div>
                  <div className="text-sm text-ivory/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Teams Grid */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/40">Our Teams</Badge>
              <h2 className="font-display text-3xl font-bold text-ivory md:text-4xl">
                Departments & Contribution Areas
              </h2>
              <p className="mt-3 text-ivory/70">
                Volunteers are organised into specialist teams aligned to the 2026 season
                across nominations, media, outreach, localisation, events and chapters.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {TEAMS.map((team, i) => (
                <motion.div
                  key={team.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full border-gold/10 bg-charcoal-light/60 hover:border-gold/30 transition-all">
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/15 text-gold">
                          <team.icon className="h-6 w-6" />
                        </div>
                        <Badge className="bg-gold/10 text-gold border-gold/30">
                          {team.members}+ members
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-ivory">{team.name}</CardTitle>
                      <p className="text-sm text-gold/80">{team.department}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-ivory/75">{team.contribution}</p>
                      <div className="flex items-center gap-2 text-sm text-ivory/70">
                        <Globe className="h-4 w-4 text-gold/70" />
                        <span>{team.region}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-ivory/60">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold/60" />
                        <span>{team.countries.join(" · ")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Governance note */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-3xl border-gold/10 bg-charcoal-light/60">
              <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:gap-6">
                <ShieldCheck className="h-10 w-10 flex-shrink-0 text-gold" />
                <div className="flex-1">
                  <h3 className="mb-1 font-display text-lg font-semibold text-ivory">
                    Volunteer Governance & Code of Conduct
                  </h3>
                  <p className="text-sm text-ivory/70">
                    All NESA-Africa volunteers sign a Code of Conduct, complete safeguarding
                    onboarding and disclose any conflicts of interest before participating in
                    nomination review or jury-adjacent activities.
                  </p>
                </div>
                <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to="/about/governance">View Governance</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-gold" />
            <h2 className="mb-4 font-display text-2xl font-bold text-ivory md:text-3xl">
              Add Your Name to the Movement
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-ivory/70">
              Join thousands of volunteers powering Africa's largest education recognition
              platform. Choose a role that fits your skills and schedule.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to="/volunteer">
                  Become a Volunteer <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <Link to="/chapters">Join a Local Chapter</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
