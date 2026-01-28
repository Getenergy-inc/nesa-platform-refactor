import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Award,
  Clock,
  Medal,
  Play,
  Star,
  Trophy,
  Video,
} from "lucide-react";

const shows = [
  {
    id: "platinum",
    title: "The Platinum Show",
    description: "Celebrating Platinum Certificate recipients and their contributions to education across Africa.",
    duration: "3 hours",
    episodes: 12,
    icon: Medal,
    color: "amber",
    features: ["NRC-verified nominees", "Impact stories", "Certificate ceremonies"],
  },
  {
    id: "icon",
    title: "The Icon Show",
    description: "Profiles of Africa Education Icons — lifetime achievers who shaped the continent's education landscape.",
    duration: "3 hours",
    episodes: 9,
    icon: Star,
    color: "blue",
    features: ["Lifetime achievements", "Legacy interviews", "Documentary segments"],
  },
  {
    id: "gold",
    title: "The Gold Show",
    description: "Public voting updates, regional competitions, and Gold Certificate winner announcements.",
    duration: "3 hours",
    episodes: 15,
    icon: Award,
    color: "yellow",
    features: ["Live voting updates", "Regional spotlights", "Winner announcements"],
  },
  {
    id: "blue-garnet",
    title: "The Blue Garnet Show",
    description: "Behind the scenes of the highest honour — jury deliberations, finalist profiles, and Gala previews.",
    duration: "3 hours",
    episodes: 6,
    icon: Trophy,
    color: "purple",
    features: ["Finalist profiles", "Jury insights", "Gala countdown"],
  },
];

const colorClasses = {
  amber: "from-amber-500/20 to-transparent border-amber-500/30 text-amber-400",
  blue: "from-blue-500/20 to-transparent border-blue-500/30 text-blue-400",
  yellow: "from-yellow-500/20 to-transparent border-yellow-500/30 text-yellow-400",
  purple: "from-purple-500/20 to-transparent border-purple-500/30 text-purple-400",
};

export default function Shows() {
  return (
    <>
      <Helmet>
        <title>Online Shows | NESA-Africa TV Programming</title>
        <meta
          name="description"
          content="Watch NESA-Africa's flagship TV shows — The Platinum Show, Icon Show, Gold Show, and Blue Garnet Show. 3 hours each."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <Link
              to="/media"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media Hub
            </Link>
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  TV Programming
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Online <span className="text-primary">Shows</span>
              </h1>
              <p className="text-lg text-white/70">
                Four flagship TV shows celebrating Africa's education champions — each a 3-hour
                deep dive into recognition, impact, and transformation.
              </p>
            </div>
          </div>
        </section>

        {/* Shows Grid */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              {shows.map((show) => {
                const Icon = show.icon;
                const colors = colorClasses[show.color as keyof typeof colorClasses];
                
                return (
                  <Card
                    key={show.id}
                    className={`overflow-hidden border bg-gradient-to-br ${colors}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="border-white/20 text-white/70">
                            <Clock className="mr-1 h-3 w-3" />
                            {show.duration}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/70">
                            {show.episodes} episodes
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="mt-4 text-xl text-white">{show.title}</CardTitle>
                      <CardDescription className="text-white/60">{show.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {show.features.map((feature) => (
                          <span
                            key={feature}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <Button className="w-full bg-white/10 text-white hover:bg-white/20">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Episodes
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-3xl gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">4</div>
                <div className="text-sm text-white/60">Shows</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">12 hrs</div>
                <div className="text-sm text-white/60">Total Content</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">42</div>
                <div className="text-sm text-white/60">Episodes</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">5</div>
                <div className="text-sm text-white/60">Languages</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Want to Be Featured?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Get nominated for NESA-Africa recognition and your story could be told on our shows.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link to="/nominate">Submit Nomination</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
