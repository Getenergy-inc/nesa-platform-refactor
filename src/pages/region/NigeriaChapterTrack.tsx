import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Play, Ticket, ArrowRight, Globe, Users, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useSeason } from "@/contexts/SeasonContext";

export default function NigeriaChapterTrack() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>Nigeria Host Chapter | NESA-Africa — West Africa Region</title>
        <meta
          name="description"
          content="Nigeria Chapter for NESA-Africa 2026: national participation, chapter announcements and the online recognition programme."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-emerald-900/30 via-charcoal to-charcoal">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  🇳🇬 Host Chapter
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/60">
                  West Africa Region
                </Badge>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                NESA-Africa — <span className="text-emerald-400">Nigeria</span>
              </h1>
              <p className="text-white/70 text-lg mb-2">
                Nigeria Chapter · West Africa
              </p>
              <p className="text-white/60 text-base max-w-2xl">
                Access national participation, chapter announcements and the online recognition programme while staying connected to the continental recognition framework.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/programme/2026">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 rounded-full">
                    <Globe className="h-4 w-4" />
                    View Online Programme
                  </Button>
                </Link>
                <Link to="/media/tv">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 rounded-full">
                    <Play className="h-4 w-4" />
                    Watch Livestream
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-12">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white/5 border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                    2026 Online Recognition Programme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 text-sm mb-4">
                    Monday 28 December 2026 · online only. Public viewing information follows approval and technical testing.
                  </p>
                  <Link to="/programme/2026" className="text-sm font-semibold text-emerald-400 hover:underline">Programme details →</Link>
                </CardContent>
              </Card>

              {/* Host Announcements */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gold" />
                    Host Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 text-sm mb-4">
                    Official announcements from the Nigeria Host Chapter.
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sm text-white/80">Venue confirmation pending</p>
                      <p className="text-xs text-white/40 mt-1">Check back for updates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* National Participation */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    National Participation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 text-sm mb-4">
                    Nigeria leads continental participation with the highest nominee count.
                  </p>
                  <div className="flex gap-3">
                    <Link to="/nominate" className="flex-1">
                      <Button size="sm" className="w-full bg-gold hover:bg-gold-dark text-charcoal gap-1">
                        <Trophy className="h-3 w-3" />
                        Nominate
                      </Button>
                    </Link>
                    <Link to="/nominees" className="flex-1">
                      <Button size="sm" variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 gap-1">
                        View Nominees
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-white/40 text-xs mt-8">
              Nigeria Host Chapter is part of the West Africa Region. All nominees compete on the 
              continental award ladder — Platinum → Icon → Gold → Blue Garnet.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
