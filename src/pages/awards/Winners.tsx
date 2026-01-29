import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Award, Calendar, Search, Trophy, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

// Placeholder data - will be replaced with CMS/DB data
const placeholderWinners = [
  { name: "Coming Soon", category: "Blue Garnet winners will be announced at the Gala", year: 2025, tier: "blue_garnet" },
];

export default function Winners() {
  return (
    <>
      <Helmet>
        <title>Past Winners | NESA-Africa Hall of Fame</title>
        <meta
          name="description"
          content="Explore NESA-Africa's Hall of Fame featuring past Blue Garnet, Gold, and Icon award winners across all categories."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <Link
              to="/categories"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Link>
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Hall of Fame
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Past Winners
              </h1>
              <p className="text-lg text-white/70">
                Celebrating the individuals and organizations who have been recognized for their
                outstanding contributions to education across Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="bg-charcoal/95 py-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Search winners..."
                  className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer border-white/20 text-white hover:bg-white/10">
                  2025
                </Badge>
                <Badge variant="outline" className="cursor-pointer border-white/20 text-white hover:bg-white/10">
                  2024
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Winners by Tier */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="blue_garnet" className="mx-auto max-w-4xl">
              <TabsList className="mb-8 grid w-full grid-cols-4 bg-white/5">
                <TabsTrigger value="blue_garnet" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                  Blue Garnet
                </TabsTrigger>
                <TabsTrigger value="gold" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                  Gold
                </TabsTrigger>
                <TabsTrigger value="icon" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  Icon
                </TabsTrigger>
                <TabsTrigger value="platinum" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
                  Platinum
                </TabsTrigger>
              </TabsList>

              <TabsContent value="blue_garnet">
                <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                  <Trophy className="mx-auto mb-4 h-12 w-12 text-purple-400" />
                  <h3 className="mb-2 text-xl font-semibold text-white">Coming Soon</h3>
                  <p className="mb-6 text-white/60">
                    Blue Garnet Award winners will be announced at the NESA-Africa 2025 Gala in June 2026.
                  </p>
                  <Button asChild className="bg-primary text-primary-foreground">
                    <Link to="/media/gala">Learn About the Gala</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="gold">
                <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                  <Award className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
                  <h3 className="mb-2 text-xl font-semibold text-white">Voting in Progress</h3>
                  <p className="mb-6 text-white/60">
                    Gold Certificate winners are determined through public voting. Results will be announced soon.
                  </p>
                  <Button asChild className="bg-primary text-primary-foreground">
                    <Link to="/vote">Cast Your Vote</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="icon">
                <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-blue-400" />
                  <h3 className="mb-2 text-xl font-semibold text-white">Icon Selection in Progress</h3>
                  <p className="mb-6 text-white/60">
                    Africa Education Icon recipients are being selected for the 2025 season.
                  </p>
                  <Button asChild className="bg-primary text-primary-foreground">
                    <Link to="/awards/icon">Learn About Icon Awards</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="platinum">
                <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
                  <Award className="mx-auto mb-4 h-12 w-12 text-amber-400" />
                  <h3 className="mb-2 text-xl font-semibold text-white">Platinum Recipients</h3>
                  <p className="mb-6 text-white/60">
                    Platinum Certificate recipients are validated continuously throughout the season.
                  </p>
                  <Button asChild className="bg-primary text-primary-foreground">
                    <Link to="/nominees">View Current Nominees</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Want to Be Recognized?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Nominate yourself or someone making a difference in African education.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link to="/nominate">Submit a Nomination</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
