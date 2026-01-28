import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Gavel,
  GraduationCap,
  Scale,
  Shield,
  Star,
  Trophy,
  Users,
} from "lucide-react";

const requirements = [
  { icon: GraduationCap, title: "Academic Excellence", description: "Minimum of PhD or equivalent professional experience in education or related field." },
  { icon: Clock, title: "15+ Years Experience", description: "Documented track record in education leadership, policy, or research." },
  { icon: Award, title: "Regional Recognition", description: "Known contributor to education development within Africa or globally." },
  { icon: Shield, title: "Integrity", description: "No conflicts of interest; commitment to COI disclosure requirements." },
];

const responsibilities = [
  "Evaluate Blue Garnet finalists using standardized scoring rubrics",
  "Participate in sealed deliberation sessions",
  "Maintain strict confidentiality throughout the process",
  "Attend virtual or in-person jury sessions",
  "Provide written justification for scores",
  "Recuse from categories with potential conflicts",
];

const timeline = [
  { phase: "Application", date: "Jan - Mar", status: "open" },
  { phase: "Review & Selection", date: "Apr - May", status: "upcoming" },
  { phase: "Onboarding", date: "Jun - Jul", status: "upcoming" },
  { phase: "Scoring Period", date: "Nov - Dec", status: "upcoming" },
  { phase: "Gala Attendance", date: "Jun 2026", status: "upcoming" },
];

export default function Judges() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>Become a Judge | NESA-Africa Jury Panel</title>
        <meta
          name="description"
          content="Join the NESA-Africa expert jury panel. Help select Blue Garnet Award winners through rigorous, transparent evaluation."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Gavel className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Join the Jury
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Become a <span className="text-primary">Judge</span>
              </h1>
              <p className="mb-8 text-lg text-white/70">
                Shape the future of African education recognition. Join our distinguished
                panel of experts who evaluate and select Blue Garnet Award winners.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground">
                <FileText className="mr-2 h-5 w-5" />
                Apply Now
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-3xl gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">25+</div>
                <div className="text-sm text-white/60">Jury Members</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">9</div>
                <div className="text-sm text-white/60">Categories Scored</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">60%</div>
                <div className="text-sm text-white/60">Weight in Final Score</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-white/60">Countries Represented</div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Eligibility Requirements
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {requirements.map((req) => (
                <Card key={req.title} className="border-white/10 bg-white/5 text-center">
                  <CardHeader>
                    <req.icon className="mx-auto mb-2 h-10 w-10 text-primary" />
                    <CardTitle className="text-lg text-white">{req.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/60">{req.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Responsibilities */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center font-display text-3xl font-bold text-white">
                Jury Responsibilities
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {responsibilities.map((resp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-white/80">{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-2xl font-bold text-white">
              Jury Selection Timeline
            </h2>
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
              {timeline.map((item) => (
                <div
                  key={item.phase}
                  className={`rounded-lg border p-4 text-center ${
                    item.status === "open"
                      ? "border-primary bg-primary/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className={`text-lg font-semibold ${item.status === "open" ? "text-primary" : "text-white"}`}>
                    {item.phase}
                  </div>
                  <div className="text-sm text-white/60">{item.date}</div>
                  {item.status === "open" && (
                    <Badge className="mt-2 bg-primary/20 text-primary">Now Open</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Governance */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-3xl border-white/10 bg-white/5">
              <CardHeader className="text-center">
                <Scale className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle className="text-2xl text-white">Governance & Integrity</CardTitle>
                <CardDescription className="text-white/60">
                  Our jury process is protected by multiple governance firewalls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  NESA-Africa maintains the highest standards of integrity in our jury selection
                  and scoring processes. All jury members must:
                </p>
                <ul className="space-y-2">
                  {[
                    "Complete mandatory conflict of interest disclosure",
                    "Sign confidentiality and ethics agreements",
                    "Participate in standardized scoring calibration",
                    "Submit to audit review of all scoring decisions",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/70">
                      <Shield className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 text-center">
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/about/governance">View Governance Framework</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Ready to Shape African Education Recognition?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Join our distinguished panel of education experts and help identify
              Africa's most impactful education champions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground">
                <FileText className="mr-2 h-5 w-5" />
                Submit Application
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
