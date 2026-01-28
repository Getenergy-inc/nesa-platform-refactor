import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Languages,
  Play,
  Radio,
  Tv,
  Video,
} from "lucide-react";

const channels = [
  { id: "english", name: "English", flag: "🇬🇧", live: true },
  { id: "french", name: "Français", flag: "🇫🇷", live: true },
  { id: "arabic", name: "العربية", flag: "🇸🇦", live: false },
  { id: "portuguese", name: "Português", flag: "🇵🇹", live: false },
  { id: "swahili", name: "Kiswahili", flag: "🇰🇪", live: false },
];

const schedule = [
  { time: "09:00", title: "Education Morning Show", type: "Live" },
  { time: "12:00", title: "NESA Africa News", type: "Live" },
  { time: "15:00", title: "The Platinum Hour", type: "Recorded" },
  { time: "18:00", title: "Education Champions", type: "Live" },
  { time: "21:00", title: "NESA Africa Tonight", type: "Live" },
];

const recentVideos = [
  { title: "Education Summit 2025 Highlights", views: "12K", duration: "45:00" },
  { title: "Interview: Africa's Education Icons", views: "8.5K", duration: "32:15" },
  { title: "Gold Category Nominees Revealed", views: "15K", duration: "28:00" },
  { title: "Behind the Scenes: NRC Review Process", views: "6.2K", duration: "18:45" },
];

export default function NESATV() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>NESA Africa TV | Live Education Broadcasting</title>
        <meta
          name="description"
          content="Watch NESA Africa TV live — multilingual education broadcasting across Africa. English, French, Arabic, Portuguese & Swahili channels."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Link
              to="/media"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media Hub
            </Link>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <Tv className="h-6 w-6 text-primary" />
                  <Badge className="bg-red-500 text-white">
                    <Radio className="mr-1 h-3 w-3 animate-pulse" />
                    Live Now
                  </Badge>
                </div>
                <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
                  NESA Africa <span className="text-primary">TV</span>
                </h1>
                <p className="mb-6 text-lg text-white/70">
                  24/7 multilingual education broadcasting. Watch live streams, on-demand content,
                  and exclusive NESA-Africa programming.
                </p>
              </div>

              {/* Live Player Placeholder */}
              <div className="w-full lg:w-[480px]">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Play className="mx-auto mb-4 h-16 w-16 text-primary" />
                      <p className="text-white/60">Live stream starting soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Channel Selector */}
        <section className="bg-charcoal/95 py-8">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-white/60">
              <Languages className="mr-2 inline h-4 w-4" />
              Select Language Channel
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-all ${
                    channel.id === "english"
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                >
                  <span>{channel.flag}</span>
                  <span>{channel.name}</span>
                  {channel.live && (
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="schedule" className="mx-auto max-w-4xl">
              <TabsList className="mb-8 grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger value="schedule" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Video className="mr-2 h-4 w-4" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="about" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Globe className="mr-2 h-4 w-4" />
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="schedule">
                <Card className="border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">Today's Schedule</CardTitle>
                    <CardDescription className="text-white/60">All times in WAT (West Africa Time)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {schedule.map((item) => (
                      <div
                        key={item.time}
                        className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-primary">{item.time}</span>
                          <span className="text-white">{item.title}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            item.type === "Live"
                              ? "border-red-500/50 text-red-400"
                              : "border-white/20 text-white/60"
                          }
                        >
                          {item.type}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recent">
                <div className="grid gap-4">
                  {recentVideos.map((video) => (
                    <div
                      key={video.title}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Play className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{video.title}</h3>
                          <p className="text-sm text-white/60">{video.views} views • {video.duration}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Watch
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about">
                <Card className="border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">About NESA Africa TV</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-white/70">
                    <p>
                      NESA Africa TV is a 24/7 multilingual education broadcasting network dedicated to
                      celebrating and promoting education excellence across Africa.
                    </p>
                    <p>
                      Broadcasting in 5 languages (English, French, Arabic, Portuguese, and Swahili),
                      we reach audiences across the entire continent and diaspora.
                    </p>
                    <div className="grid gap-4 pt-4 md:grid-cols-3">
                      <div className="text-center">
                        <div className="mb-2 text-2xl font-bold text-primary">5</div>
                        <div className="text-sm text-white/60">Languages</div>
                      </div>
                      <div className="text-center">
                        <div className="mb-2 text-2xl font-bold text-primary">24/7</div>
                        <div className="text-sm text-white/60">Broadcasting</div>
                      </div>
                      <div className="text-center">
                        <div className="mb-2 text-2xl font-bold text-primary">54</div>
                        <div className="text-sm text-white/60">Countries</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}
