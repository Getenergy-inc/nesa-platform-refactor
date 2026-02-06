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
  ExternalLink,
  Globe,
  Languages,
  Play,
  Radio,
  Tv,
  Video,
  Youtube,
} from "lucide-react";

// NESA Africa TV YouTube Channel ID
const YOUTUBE_CHANNEL_ID = "Nesa.africaTV";
const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/@${YOUTUBE_CHANNEL_ID}`;
const YOUTUBE_EMBED_BASE = "https://www.youtube-nocookie.com/embed";

// Featured video (main player)
const FEATURED_VIDEO_ID = "MrErQY7qWRs";

// Recent/Archived videos from the channel
const channelVideos = [
  { 
    videoId: "MrErQY7qWRs",
    title: "The Platinum Show - Special Edition", 
    views: "2.5K views", 
    duration: "1:45:00",
    date: "Feb 2025"
  },
  { 
    videoId: "Hdu_qlFLfrQ",
    title: "Education for All Summit 2025", 
    views: "3.8K views", 
    duration: "2:30:00",
    date: "Jan 2025"
  },
  { 
    videoId: "VDVRZrPwNRA",
    title: "NESA Africa 2025 Nominations Announcement", 
    views: "5.2K views", 
    duration: "45:00",
    date: "Jan 2025"
  },
  { 
    videoId: "aP0SskrfioI",
    title: "Meet the Judges - Season 2025", 
    views: "4.1K views", 
    duration: "1:00:00",
    date: "Jan 2025"
  },
  { 
    videoId: "DDREAU_bmRk",
    title: "Rebuild My School Africa Documentary", 
    views: "8.7K views", 
    duration: "35:00",
    date: "Dec 2024"
  },
  { 
    videoId: "nQCXDX_X3rs",
    title: "NESA Africa Awards 2025 Gala Highlights", 
    views: "15K views", 
    duration: "1:20:00",
    date: "Nov 2024"
  },
];

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
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                    <Youtube className="h-5 w-5" />
                    Subscribe on YouTube
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>

              {/* Main Video Player - YouTube Embed */}
              <div className="w-full lg:w-[560px]">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <iframe
                    src={`${YOUTUBE_EMBED_BASE}/${FEATURED_VIDEO_ID}?rel=0&modestbranding=1`}
                    title="NESA Africa TV"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="mt-2 text-center text-sm text-white/50">
                  Powered by YouTube • @{YOUTUBE_CHANNEL_ID}
                </p>
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

        {/* Video Gallery */}
        <section className="bg-charcoal py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                Latest Videos
              </h2>
              <a
                href={`${YOUTUBE_CHANNEL_URL}/videos`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
                  View All on YouTube
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>

            {/* Video Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {channelVideos.map((video) => (
                <div key={video.videoId} className="group">
                  <Card className="h-full border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all overflow-hidden">
                    <CardContent className="p-0">
                      {/* Embedded Video Player */}
                      <div className="aspect-video bg-black">
                        <iframe
                          src={`${YOUTUBE_EMBED_BASE}/${video.videoId}?rel=0&modestbranding=1`}
                          title={video.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white line-clamp-2 mb-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-white/50">
                          <span>{video.views}</span>
                          <span>{video.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="schedule" className="mx-auto max-w-4xl">
              <TabsList className="mb-8 grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger value="schedule" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="streams" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Radio className="mr-2 h-4 w-4" />
                  Live Streams
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

              <TabsContent value="streams">
                <Card className="border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-500" />
                      Live Streams & Archives
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Watch live and archived streams from our YouTube channel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Embedded Streams Player */}
                    <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-black">
                      <iframe
                        src={`${YOUTUBE_EMBED_BASE}/${FEATURED_VIDEO_ID}?rel=0&modestbranding=1`}
                        title="NESA Africa TV Streams"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="text-center">
                      <a
                        href={`${YOUTUBE_CHANNEL_URL}/streams`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                          <Youtube className="h-5 w-5" />
                          View All Streams on YouTube
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
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
                    
                    {/* Subscribe CTA */}
                    <div className="pt-6 text-center border-t border-white/10 mt-6">
                      <p className="mb-4 text-white/80">
                        Subscribe to NESA Africa TV on YouTube for the latest content!
                      </p>
                      <a
                        href={YOUTUBE_CHANNEL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                          <Youtube className="h-5 w-5" />
                          Subscribe Now
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
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
