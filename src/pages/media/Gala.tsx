import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Award,
  Clock,
  Globe,
  MapPin,
  Medal,
  Mic,
  Play,
  Radio,
  Star,
  Ticket,
  Trophy,
  Tv,
  Users,
} from "lucide-react";

import galaHeroImage from "@/assets/events/award-gala.jpeg";

const galaSegments = [
  { time: "18:00", title: "Red Carpet & Arrivals", duration: "1 hr", icon: Star },
  { time: "19:00", title: "Opening Ceremony", duration: "30 min", icon: Trophy },
  { time: "19:30", title: "Platinum Certificate Ceremony", duration: "1 hr", icon: Medal },
  { time: "20:30", title: "Gold Winners Announcement", duration: "1.5 hrs", icon: Award },
  { time: "22:00", title: "Africa Education Icon Induction", duration: "1 hr", icon: Star },
  { time: "23:00", title: "Blue Garnet Grand Finale", duration: "1 hr", icon: Trophy },
];

const highlights = [
  { icon: Clock, label: "6 Hours", description: "Live broadcast" },
  { icon: Trophy, label: "9 Blue Garnet", description: "Winners announced" },
  { icon: Globe, label: "54 Countries", description: "Live viewing" },
  { icon: Users, label: "1M+", description: "Expected viewers" },
];

export default function Gala() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>{`Awards Gala | NESA-Africa ${currentEdition?.displayYear || ''} Live Ceremony`}</title>
        <meta
          name="description"
          content={`Watch the NESA-Africa ${currentEdition?.displayYear || ''} Awards Gala — a spectacular 6-hour live ceremony announcing Blue Garnet winners.`}
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero with Gala Image */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={galaHeroImage}
              alt="NESA-Africa Awards Gala"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-4 py-20 lg:py-28">
            <Link
              to="/media"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media Hub
            </Link>
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <Trophy className="h-6 w-6 text-primary" />
                <Badge className="bg-purple-500/20 text-purple-400">June 2026</Badge>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                NESA-Africa <span className="text-primary">Awards Gala</span>
              </h1>
              <p className="mb-8 text-lg text-white/80 md:text-xl">
                A spectacular 6-hour live ceremony celebrating Africa's education champions.
                The Blue Garnet winners are revealed in the grand finale.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link to="/tickets">
                    <Ticket className="mr-2 h-5 w-5" />
                    Get Tickets
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Radio className="mr-2 h-4 w-4" />
                  Watch Live
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Info */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
              {highlights.map((item) => (
                <Card key={item.label} className="border-white/10 bg-white/5 text-center">
                  <CardContent className="pt-6">
                    <item.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold text-white">{item.label}</div>
                    <div className="text-sm text-white/60">{item.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
              {/* Schedule */}
              <div>
                <h2 className="mb-6 font-display text-2xl font-bold text-white">
                  Gala Schedule
                </h2>
                <div className="space-y-3">
                  {galaSegments.map((segment) => {
                    const Icon = segment.icon;
                    return (
                      <div
                        key={segment.time}
                        className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white">{segment.title}</h3>
                            <span className="font-mono text-sm text-primary">{segment.time}</span>
                          </div>
                          <p className="text-sm text-white/60">{segment.duration}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Venue & Watch */}
              <div className="space-y-8">
                <Card className="border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MapPin className="h-5 w-5 text-primary" />
                      Venue
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-white/70">
                    <p className="text-lg font-semibold text-white">International Conference Centre</p>
                    <p>Abuja, Nigeria</p>
                    <p className="text-sm">June 2026 • 18:00 WAT</p>
                    <Button asChild className="mt-4 w-full bg-primary text-primary-foreground">
                      <Link to="/tickets">Reserve Your Seat</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Tv className="h-5 w-5 text-primary" />
                      Watch From Home
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-white/70">
                    <p>
                      Can't attend in person? The entire 6-hour ceremony will be broadcast
                      live on NESA Africa TV in 5 languages.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-white/20">English</Badge>
                      <Badge variant="outline" className="border-white/20">French</Badge>
                      <Badge variant="outline" className="border-white/20">Arabic</Badge>
                      <Badge variant="outline" className="border-white/20">Portuguese</Badge>
                      <Badge variant="outline" className="border-white/20">Swahili</Badge>
                    </div>
                    <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      <Link to="/media/tv">
                        <Play className="mr-2 h-4 w-4" />
                        Go to NESA TV
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Presenter/Anchor CTA */}
        <section className="bg-gradient-to-b from-charcoal to-purple-950/30 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Mic className="mx-auto mb-6 h-12 w-12 text-primary" />
              <h2 className="mb-4 font-display text-3xl font-bold text-white">
                Be Part of the Show
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70">
                We're looking for talented presenters and anchors to host segments of the 
                NESA-Africa Awards Gala. Join us in celebrating Africa's education champions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link to="/contact?subject=presenter">
                    <Mic className="mr-2 h-5 w-5" />
                    Apply as Presenter
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/volunteer">
                    <Users className="mr-2 h-5 w-5" />
                    Volunteer at Gala
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Past Gala */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Watch Past Galas
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Relive the magic of previous NESA-Africa Awards ceremonies.
            </p>
            <div className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-white/5 p-12">
              <Play className="mx-auto mb-4 h-16 w-16 text-primary" />
              <h3 className="mb-2 text-xl font-semibold text-white">NESA-Africa 2024 Gala Highlights</h3>
              <p className="mb-6 text-white/60">45 minutes of unforgettable moments</p>
              <Button className="bg-primary text-primary-foreground">
                <Play className="mr-2 h-4 w-4" />
                Watch Highlights
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
