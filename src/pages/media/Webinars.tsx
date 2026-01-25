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
  ExternalLink,
  Mic,
  Play,
  Search,
  Users,
  Video,
} from "lucide-react";
import eduaidLogo from "@/assets/partners/eduaid-africa-logo.jpeg";

// EduAid-Africa brand colors
const eduaidColors = {
  green: "#4a7c23",
  brown: "#8b6914",
  lightGreen: "#6ba32d",
};

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
        <title>EduAid-Africa Webinar Series | NESA-Africa Educational Webinars</title>
        <meta
          name="description"
          content="Join the EduAid-Africa Webinar Series — 15-25 educational sessions on education funding, policy, STEM, and partnerships across Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* EduAid Hero - branded section */}
        <section 
          className="relative py-20 lg:py-28 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${eduaidColors.green}15 0%, ${eduaidColors.brown}10 50%, transparent 100%)` 
          }}
        >
          {/* Decorative elements */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: eduaidColors.green }}
          />
          <div 
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: eduaidColors.brown }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <Link
              to="/media"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media Hub
            </Link>
            
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* EduAid Logo */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div 
                    className="absolute -inset-4 rounded-2xl blur-xl opacity-30"
                    style={{ backgroundColor: eduaidColors.green }}
                  />
                  <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
                    <img 
                      src={eduaidLogo} 
                      alt="EduAid-Africa" 
                      className="w-48 h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4 flex items-center justify-center lg:justify-start gap-2">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${eduaidColors.green}20` }}
                  >
                    <Mic className="h-5 w-5" style={{ color: eduaidColors.green }} />
                  </div>
                  <span 
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{ color: eduaidColors.green }}
                  >
                    ...funding through partnerships
                  </span>
                </div>
                
                <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
                  <span style={{ color: eduaidColors.green }}>EduAid-Africa</span>{" "}
                  <span className="text-white">Webinar Series</span>
                </h1>
                
                <p className="mb-8 text-lg text-white/70 max-w-2xl">
                  15-25 expert-led webinars per season covering education funding, partnerships, 
                  policy innovation, and best practices across Africa. Each session is 75 minutes.
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button 
                    size="lg" 
                    className="text-white border-0 shadow-lg"
                    style={{ backgroundColor: eduaidColors.green }}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Register for Next Webinar
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-white hover:bg-white/10"
                    style={{ borderColor: eduaidColors.brown }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit EduAid-Africa
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom border gradient */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${eduaidColors.green}, ${eduaidColors.brown}, transparent)` 
            }}
          />
        </section>

        {/* Search & Filters - EduAid themed */}
        <section className="bg-charcoal/95 py-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Search EduAid webinars..."
                  className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
                  style={{ 
                    borderColor: `${eduaidColors.green}30`,
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, index) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="cursor-pointer transition-colors"
                    style={{
                      borderColor: index === 0 ? eduaidColors.green : 'rgba(255,255,255,0.2)',
                      backgroundColor: index === 0 ? `${eduaidColors.green}20` : 'transparent',
                      color: index === 0 ? eduaidColors.lightGreen : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Webinars - EduAid branded */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <img src={eduaidLogo} alt="" className="h-8 w-auto rounded" />
              <h2 className="font-display text-2xl font-bold text-white">
                Upcoming Webinars
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingWebinars.map((webinar) => (
                <Card 
                  key={webinar.id} 
                  className="border-white/10 bg-white/5 overflow-hidden group hover:border-opacity-30 transition-colors"
                  style={{ borderColor: `${eduaidColors.green}20` }}
                >
                  {/* Top accent bar */}
                  <div 
                    className="h-1 w-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${eduaidColors.green}, ${eduaidColors.brown})` 
                    }}
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge 
                        style={{ 
                          backgroundColor: `${eduaidColors.green}20`,
                          color: eduaidColors.lightGreen,
                        }}
                      >
                        {webinar.category}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/60">
                        <Clock className="mr-1 h-3 w-3" />
                        {webinar.duration}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg text-white group-hover:text-opacity-90">
                      {webinar.title}
                    </CardTitle>
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
                    <div className="text-sm" style={{ color: eduaidColors.lightGreen }}>
                      {webinar.time}
                    </div>
                    <Button 
                      className="w-full text-white"
                      style={{ backgroundColor: eduaidColors.green }}
                    >
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
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${eduaidColors.brown}20` }}
              >
                <Video className="h-5 w-5" style={{ color: eduaidColors.brown }} />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                Watch Past Webinars
              </h2>
            </div>
            <div className="mx-auto grid max-w-4xl gap-4">
              {pastWebinars.map((webinar) => (
                <div
                  key={webinar.title}
                  className="flex items-center justify-between rounded-lg border bg-white/5 p-4 hover:bg-white/10 transition-colors"
                  style={{ borderColor: `${eduaidColors.green}20` }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${eduaidColors.green}15` }}
                    >
                      <Video className="h-5 w-5" style={{ color: eduaidColors.green }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{webinar.title}</h3>
                      <p className="text-sm text-white/60">{webinar.views} views • {webinar.duration}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-white hover:bg-white/10"
                    style={{ borderColor: `${eduaidColors.green}40` }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats - EduAid branded */}
        <section 
          className="py-12"
          style={{ 
            background: `linear-gradient(135deg, ${eduaidColors.green}10 0%, transparent 50%, ${eduaidColors.brown}10 100%)` 
          }}
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-3xl gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-3xl font-bold" style={{ color: eduaidColors.lightGreen }}>
                  25
                </div>
                <div className="text-sm text-white/60">Webinars/Season</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold" style={{ color: eduaidColors.lightGreen }}>
                  75 min
                </div>
                <div className="text-sm text-white/60">Each Session</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold" style={{ color: eduaidColors.lightGreen }}>
                  50+
                </div>
                <div className="text-sm text-white/60">Expert Speakers</div>
              </div>
              <div>
                <div className="mb-2 text-3xl font-bold" style={{ color: eduaidColors.lightGreen }}>
                  Free
                </div>
                <div className="text-sm text-white/60">Registration</div>
              </div>
            </div>
          </div>
        </section>

        {/* EduAid Partnership Banner */}
        <section className="bg-charcoal py-12">
          <div className="container mx-auto px-4">
            <div 
              className="max-w-4xl mx-auto rounded-2xl p-8 text-center"
              style={{ 
                background: `linear-gradient(135deg, ${eduaidColors.green}15, ${eduaidColors.brown}10)`,
                border: `1px solid ${eduaidColors.green}30`,
              }}
            >
              <img 
                src={eduaidLogo} 
                alt="EduAid-Africa" 
                className="h-16 w-auto mx-auto mb-4 rounded-lg bg-white p-2"
              />
              <h3 className="text-xl font-display font-bold text-white mb-2">
                Powered by EduAid-Africa
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                EduAid-Africa is the funding and partnerships arm of SCEF, dedicated to mobilizing 
                resources for educational development across the continent.
              </p>
              <Button 
                className="text-white"
                style={{ backgroundColor: eduaidColors.green }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Learn More About EduAid-Africa
              </Button>
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
