import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronRight,
  Mic,
  Play,
  Radio,
  Trophy,
  Tv,
  Video,
} from "lucide-react";

const mediaCategories = [
  {
    title: "NESA Africa TV",
    description: "Live and on-demand education content in multiple languages.",
    href: "/media/tv",
    icon: Tv,
    badge: "Live",
    badgeColor: "bg-red-500",
  },
  {
    title: "Online Shows",
    description: "4 flagship shows: Platinum, Icon, Gold & Blue Garnet (3 hrs each).",
    href: "/media/shows",
    icon: Video,
  },
  {
    title: "Webinar Hub",
    description: "15-25 educational webinars and workshops (75 mins each).",
    href: "/media/webinars",
    icon: Mic,
  },
  {
    title: "Awards Gala",
    description: "Live 6-hour ceremony announcing all winners.",
    href: "/media/gala",
    icon: Trophy,
    badge: "June 2026",
    badgeColor: "bg-primary",
  },
];

const featuredContent = [
  { title: "The Platinum Show", duration: "3 hrs", type: "Online Show" },
  { title: "Education for All Summit", duration: "75 min", type: "Webinar" },
  { title: "NESA Africa 2024 Gala Highlights", duration: "45 min", type: "Archive" },
];

export default function MediaHub() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>Media Hub | NESA-Africa TV, Shows & Webinars</title>
        <meta
          name="description"
          content="Watch NESA Africa TV, online shows, webinars, and the Awards Gala. Your hub for education content across Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <Radio className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  {currentEdition?.displayYear} Media
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Media <span className="text-primary">Hub</span>
              </h1>
              <p className="mb-8 text-lg text-white/70">
                Your gateway to NESA-Africa's rich media content — from live TV broadcasts
                to educational webinars and the annual Awards Gala.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link to="/media/tv">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Live
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/media/gala">View Gala</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Media Categories */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Explore Content
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {mediaCategories.map((category) => (
                <Link key={category.href} to={category.href} className="group">
                  <Card className="h-full border-white/10 bg-white/5 transition-all hover:border-primary/50 hover:bg-white/10">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <category.icon className="h-6 w-6 text-primary" />
                        </div>
                        {category.badge && (
                          <Badge className={`${category.badgeColor} text-white`}>
                            {category.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mt-4 flex items-center justify-between text-white">
                        {category.title}
                        <ChevronRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-white">
              Featured Content
            </h2>
            <div className="mx-auto grid max-w-4xl gap-4">
              {featuredContent.map((content) => (
                <div
                  key={content.title}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{content.title}</h3>
                      <p className="text-sm text-white/60">{content.type} • {content.duration}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Watch
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">4</div>
                <div className="text-sm text-white/60">Online Shows</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">25+</div>
                <div className="text-sm text-white/60">Webinars</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">6 hrs</div>
                <div className="text-sm text-white/60">Live Gala</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">5</div>
                <div className="text-sm text-white/60">Languages</div>
              </div>
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
