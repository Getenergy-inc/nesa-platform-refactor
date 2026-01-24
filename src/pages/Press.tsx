import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSeason } from "@/contexts/SeasonContext";
import { 
  ArrowLeft, 
  Newspaper, 
  Download, 
  Mail,
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface PressRelease {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: "announcement" | "event" | "partnership" | "results";
}

const pressReleases: PressRelease[] = [
  {
    id: "1",
    title: "NESA-Africa 2025 Nominations Now Open",
    date: "2025-01-15",
    excerpt: "The New Education Standard Award Africa opens nominations for its third edition, celebrating changemakers shaping African education.",
    category: "announcement",
  },
  {
    id: "2",
    title: "NESA-Africa Partners with African Union for Education Summit",
    date: "2025-02-01",
    excerpt: "Strategic partnership announced to promote educational excellence recognition across all 54 African nations.",
    category: "partnership",
  },
  {
    id: "3",
    title: "2024 Blue Garnet Award Winners Announced",
    date: "2024-11-30",
    excerpt: "Nine exceptional individuals and organizations receive the highest honor in African education recognition.",
    category: "results",
  },
  {
    id: "4",
    title: "NESA-Africa Awards Gala 2024: A Night of Excellence",
    date: "2024-11-15",
    excerpt: "Over 500 education leaders gather in Lagos for the prestigious NESA-Africa Awards ceremony.",
    category: "event",
  },
];

const mediaAssets = [
  { label: "NESA-Africa Logo Pack", type: "images", format: "ZIP", size: "2.4 MB" },
  { label: "Brand Guidelines", type: "document", format: "PDF", size: "1.8 MB" },
  { label: "Press Kit 2025", type: "document", format: "PDF", size: "5.2 MB" },
  { label: "Award Tier Graphics", type: "images", format: "ZIP", size: "3.1 MB" },
  { label: "B-Roll Footage", type: "video", format: "MP4", size: "120 MB" },
  { label: "Ceremony Photos 2024", type: "images", format: "ZIP", size: "45 MB" },
];

const categoryConfig = {
  announcement: { label: "Announcement", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  event: { label: "Event", color: "bg-green-500/10 text-green-400 border-green-500/30" },
  partnership: { label: "Partnership", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  results: { label: "Results", color: "bg-gold/10 text-gold border-gold/30" },
};

export default function Press() {
  const { currentEdition } = useSeason();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "images": return ImageIcon;
      case "video": return Video;
      default: return FileText;
    }
  };

  return (
    <>
      <Helmet>
        <title>Press & Media | {currentEdition.name}</title>
        <meta
          name="description"
          content="Access NESA-Africa press releases, media assets, and press contact information. Download logos, brand guidelines, and press kits."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal py-16 sm:py-20">
          <div className="container">
            <Link
              to="/media"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Media Hub</span>
            </Link>

            <div className="max-w-3xl">
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                <Newspaper className="h-3 w-3 mr-1" />
                Press Room
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Press & <span className="text-gold">Media</span>
              </h1>
              <p className="text-white/70 text-lg">
                Access official press releases, download media assets, and connect with our communications team.
              </p>
            </div>
          </div>
        </section>

        <div className="container py-12 sm:py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Press Releases */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-6">
                  Latest Press Releases
                </h2>
                
                <div className="space-y-4">
                  {pressReleases.map((release) => (
                    <Card 
                      key={release.id} 
                      className="bg-charcoal-light border-gold/10 hover:border-gold/30 transition-all duration-300 group cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className={categoryConfig[release.category].color}>
                                {categoryConfig[release.category].label}
                              </Badge>
                              <span className="text-white/50 text-sm flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(release.date)}
                              </span>
                            </div>
                            <h3 className="font-display text-lg font-semibold text-white group-hover:text-gold transition-colors mb-2">
                              {release.title}
                            </h3>
                            <p className="text-white/60 text-sm line-clamp-2">
                              {release.excerpt}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gold/50 group-hover:text-gold transition-colors shrink-0 mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-6 border-gold/30 text-gold hover:bg-gold/10">
                  View All Press Releases
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Press Contact */}
              <Card className="bg-charcoal-light border-gold/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Mail className="h-5 w-5 text-gold" />
                    Press Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70 text-sm">
                    For media inquiries, interview requests, and press credentials:
                  </p>
                  <div className="bg-charcoal/50 rounded-lg p-4">
                    <p className="text-white font-medium">Media Relations</p>
                    <a href="mailto:press@nesa.africa" className="text-gold hover:text-gold-light text-sm">
                      press@nesa.africa
                    </a>
                  </div>
                  <Button className="w-full bg-gold hover:bg-gold-light text-charcoal font-semibold">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Press Team
                  </Button>
                </CardContent>
              </Card>

              {/* Media Assets */}
              <Card className="bg-charcoal-light border-gold/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Download className="h-5 w-5 text-gold" />
                    Media Assets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mediaAssets.map((asset, index) => {
                    const Icon = getAssetIcon(asset.type);
                    return (
                      <button
                        key={index}
                        className="w-full flex items-center gap-3 p-3 bg-charcoal/50 rounded-lg border border-gold/10 hover:border-gold/30 transition-colors group text-left"
                      >
                        <div className="h-10 w-10 rounded bg-gold/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium group-hover:text-gold transition-colors truncate">
                            {asset.label}
                          </p>
                          <p className="text-white/50 text-xs">
                            {asset.format} • {asset.size}
                          </p>
                        </div>
                        <Download className="h-4 w-4 text-gold/50 group-hover:text-gold transition-colors shrink-0" />
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-charcoal-light border-gold/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "About NESA-Africa", href: "/about" },
                    { label: "Award Categories", href: "/categories" },
                    { label: "Past Winners", href: "/awards/winners" },
                    { label: "Media Hub", href: "/media" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gold/10 text-white/70 hover:text-gold transition-colors"
                    >
                      <span className="text-sm">{link.label}</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <NESAFooter />
      </div>
    </>
  );
}
