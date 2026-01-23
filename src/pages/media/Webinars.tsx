import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mic,
  Play,
  Search,
  Users,
  Video,
} from "lucide-react";

const upcomingWebinars = [
  {
    id: 1,
    title: "Education for All: 2025 Roadmap",
    speaker: "Dr. Amina Okonkwo",
    date: "March 15, 2025",
    time: "14:00 WAT",
    duration: "75 min",
    registrations: 1250,
    category: "Strategy",
  },
  {
    id: 2,
    title: "STEM Education Innovation in Africa",
    speaker: "Prof. Kwame Asante",
    date: "March 22, 2025",
    time: "10:00 WAT",
    duration: "75 min",
    registrations: 890,
    category: "STEM",
  },
  {
    id: 3,
    title: "Building Effective School Libraries",
    speaker: "Ms. Fatima Hassan",
    date: "March 29, 2025",
    time: "15:00 WAT",
    duration: "75 min",
    registrations: 675,
    category: "Infrastructure",
  },
];

const pastWebinars = [
  { title: "NRC Review Process Explained", views: "4.2K", duration: "75 min" },
  { title: "Gold Category Nomination Tips", views: "3.8K", duration: "75 min" },
  { title: "Education Policy in West Africa", views: "2.9K", duration: "75 min" },
  { title: "Digital Learning Best Practices", views: "5.1K", duration: "75 min" },
];

const categories = ["All", "Strategy", "STEM", "Infrastructure", "Policy", "Innovation"];

export default function Webinars() {
  return (
    <>
      <Helmet>
        <title>Webinar Hub | NESA-Africa Educational Webinars</title>
        <meta
          name="description"
          content="Join NESA-Africa webinars — 15-25 educational sessions on education policy, STEM, infrastructure, and more. 75 minutes each."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

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
                <Mic className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Educational Sessions
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Webinar <span className="text-primary">Hub</span>
              </h1>
              <p className="mb-8 text-lg text-white/70">
                15-25 expert-led webinars per season covering education policy, innovation,
                and best practices across Africa. Each session is 75 minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  <Calendar className="mr-2 h-5 w-5" />
                  Register for Next
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Archive
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="bg-charcoal/95 py-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Search webinars..."
                  className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className={`cursor-pointer ${
                      cat === "All"
                        ? "border-primary/50 bg-primary/20 text-primary"
                        : "border-white/20 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 font-display text-2xl font-bold text-white">
              Upcoming Webinars
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingWebinars.map((webinar) => (
                <Card key={webinar.id} className="border-white/10 bg-white/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/20 text-primary">{webinar.category}</Badge>
                      <Badge variant="outline" className="border-white/20 text-white/60">
                        <Clock className="mr-1 h-3 w-3" />
                        {webinar.duration}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg text-white">{webinar.title}</CardTitle>
                    <CardDescription className="text-white/60">
                      {webinar.speaker}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="h-4 w-4" />
                        {webinar.date}
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Users className="h-4 w-4" />
                        {webinar.registrations.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-primary">{webinar.time}</div>
                    <Button className="w-full bg-primary text-primary-foreground">
                      Register Free
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Past Webinars */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 font-display text-2xl font-bold text-white">
              Watch Past Webinars
            </h2>
            <div className="mx-auto grid max-w-4xl gap-4">
              {pastWebinars.map((webinar) => (
                <div
                  key={webinar.title}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{webinar.title}</h3>
                      <p className="text-sm text-white/60">{webinar.views} views • {webinar.duration}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Play className="mr-2 h-4 w-4" />
                    Watch
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-3xl gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">25</div>
                <div className="text-sm text-white/60">Webinars/Season</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">75 min</div>
                <div className="text-sm text-white/60">Each Session</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-white/60">Expert Speakers</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold text-primary">Free</div>
                <div className="text-sm text-white/60">Registration</div>
              </div>
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
