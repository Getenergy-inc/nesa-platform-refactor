import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { useSeason } from "@/contexts/SeasonContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  FileCheck,
  Play,
  Trophy,
  Users,
  Vote,
} from "lucide-react";

const phases = [
  {
    id: "nominations",
    title: "Nominations",
    icon: FileCheck,
    dates: "March – June 2025",
    status: "active",
    description: "Submit nominations for Platinum, Gold, and Icon categories.",
    actions: ["Submit nomination", "Gather evidence", "Track status"],
  },
  {
    id: "nrc_review",
    title: "NRC Review",
    icon: Users,
    dates: "June – August 2025",
    status: "upcoming",
    description: "Nominee Research Corps validates all submissions.",
    actions: ["Evidence verification", "Background checks", "Platinum issuance"],
  },
  {
    id: "public_voting",
    title: "Public Voting",
    icon: Vote,
    dates: "September – November 2025",
    status: "upcoming",
    description: "Public votes for Gold Certificate nominees.",
    actions: ["Cast votes", "Share nominees", "Track rankings"],
  },
  {
    id: "jury_scoring",
    title: "Jury Scoring",
    icon: Trophy,
    dates: "November – December 2025",
    status: "upcoming",
    description: "Jury panel scores Blue Garnet finalists (60% weight).",
    actions: ["Sealed scoring", "Jury deliberation", "Final ranking"],
  },
  {
    id: "gala",
    title: "Awards Gala",
    icon: Play,
    dates: "June 2026",
    status: "upcoming",
    description: "Live 6-hour ceremony announcing all winners.",
    actions: ["Live broadcast", "Winner announcements", "Certificate ceremony"],
  },
];

export default function Timeline() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>{`Programme Timeline | NESA-Africa ${currentEdition?.displayYear || ''}`}</title>
        <meta
          name="description"
          content={`Key dates and milestones for NESA-Africa ${currentEdition?.displayYear || ''} — from nominations through the live Awards Gala.`}
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

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
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  {currentEdition?.displayYear} Season
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Programme Timeline
              </h1>
              <p className="text-lg text-white/70">
                A 15-month journey from nominations to the live Awards Gala.
                Track key dates and know when to take action.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="relative mx-auto max-w-4xl">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-white/10 md:left-1/2 md:block md:-translate-x-1/2" />

              <div className="space-y-8">
                {phases.map((phase, i) => {
                  const Icon = phase.icon;
                  const isActive = phase.status === "active";
                  const isCompleted = phase.status === "completed";

                  return (
                    <div
                      key={phase.id}
                      className={`relative flex gap-6 md:gap-12 ${
                        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-0 z-10 hidden -translate-x-1/2 md:left-1/2 md:flex">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                            isActive
                              ? "border-primary bg-primary/20"
                              : isCompleted
                              ? "border-green-500 bg-green-500/20"
                              : "border-white/20 bg-charcoal"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-white/40"}`} />
                          )}
                        </div>
                      </div>

                      {/* Card */}
                      <Card
                        className={`flex-1 border-white/10 ${
                          isActive ? "bg-primary/5 ring-1 ring-primary/30" : "bg-white/5"
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3 text-white">
                              <Icon className={`h-5 w-5 md:hidden ${isActive ? "text-primary" : "text-white/60"}`} />
                              {phase.title}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={
                                isActive
                                  ? "border-primary/50 bg-primary/10 text-primary"
                                  : isCompleted
                                  ? "border-green-500/50 text-green-400"
                                  : "border-white/20 text-white/60"
                              }
                            >
                              {isActive ? "Active" : isCompleted ? "Completed" : "Upcoming"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Clock className="h-4 w-4" />
                            {phase.dates}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-white/70">{phase.description}</p>
                          <ul className="space-y-1">
                            {phase.actions.map((action) => (
                              <li key={action} className="flex items-center gap-2 text-sm text-white/60">
                                <Circle className="h-1.5 w-1.5 fill-current" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Spacer for alternating layout */}
                      <div className="hidden flex-1 md:block" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
