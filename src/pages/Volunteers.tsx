import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, Search, MapPin, Trophy, Sparkles, ArrowRight, Heart,
  Globe2, BadgeCheck, Share2, Crown, Quote, ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVolunteers } from "@/hooks/useVolunteers";
import { TEAM_LABELS, type TeamSlug, tierFor, TIER_LABEL } from "@/lib/volunteersData";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function CounterCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Users }) {
  return (
    <motion.div {...fadeUp}>
      <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-5 text-center hover:border-gold/50 transition">
        <Icon className="h-6 w-6 text-gold mx-auto mb-2" />
        <div className="font-playfair text-3xl text-gold font-bold">{value}</div>
        <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">{label}</div>
      </Card>
    </motion.div>
  );
}

export default function Volunteers() {
  const { volunteers, loading } = useVolunteers();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [team, setTeam] = useState<string>("all");
  const [status, setStatus] = useState<"all" | "public" | "alumni">("all");

  const countries = useMemo(
    () => Array.from(new Set(volunteers.map((v) => v.country).filter(Boolean))).sort() as string[],
    [volunteers]
  );

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      if (status !== "all" && v.visibility !== status) return false;
      if (country !== "all" && v.country !== country) return false;
      if (team !== "all" && v.teamSlug !== team) return false;
      if (q) {
        const needle = q.toLowerCase();
        if (!`${v.fullName} ${v.role ?? ""} ${v.country ?? ""} ${v.headline ?? ""}`.toLowerCase().includes(needle))
          return false;
      }
      return true;
    });
  }, [volunteers, q, country, team, status]);

  const stats = useMemo(() => ({
    total: volunteers.length,
    countries: countries.length,
    chapters: 10, // hub regions
    tasks: volunteers.reduce((s, v) => s + v.tasksCompleted, 0),
    referrals: volunteers.reduce((s, v) => s + v.referralCount, 0),
    hours: volunteers.length * 12,
  }), [volunteers, countries.length]);

  const featured = useMemo(
    () => volunteers.filter((v) => v.isFeatured || v.contributionScore > 800).slice(0, 6),
    [volunteers]
  );

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet>
        <title>Meet Our Volunteers — NESA-Africa</title>
        <meta name="description" content="Celebrating the volunteers, ambassadors, technologists, designers, and storytellers powering NESA-Africa across the continent and the diaspora." />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gold/20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-charcoal to-black" />
        <div className="absolute inset-0 opacity-30"
             style={{ backgroundImage: "radial-gradient(circle at 20% 30%, hsl(42 85% 52% / 0.25), transparent 50%), radial-gradient(circle at 80% 70%, hsl(42 85% 52% / 0.15), transparent 50%)" }} />
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <motion.div {...fadeUp}>
            <Badge className="bg-gold/20 text-gold border-gold/40 mb-6">
              <Heart className="h-3 w-3 mr-1" /> Volunteer Ecosystem
            </Badge>
            <h1 className="font-playfair text-4xl md:text-6xl text-gold font-bold mb-5 leading-tight">
              Meet Our Volunteers
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              Celebrating the contributors building Africa's education movement through technology,
              storytelling, data, media, partnerships, design, and community action.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
                <Link to="/volunteer">Become a Volunteer <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                <Link to="/chapters">Join a Local Chapter</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white/80 hover:text-gold">
                <Link to="/volunteer-leaderboard"><Trophy className="mr-1 h-4 w-4" /> Leaderboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <CounterCard label="Volunteers" value={stats.total} icon={Users} />
          <CounterCard label="Countries" value={stats.countries} icon={Globe2} />
          <CounterCard label="Chapters" value={stats.chapters} icon={MapPin} />
          <CounterCard label="Tasks Done" value={stats.tasks} icon={BadgeCheck} />
          <CounterCard label="Referrals" value={stats.referrals} icon={Share2} />
          <CounterCard label="Hours" value={`${stats.hours}+`} icon={Sparkles} />
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 mt-16">
          <motion.div {...fadeUp} className="flex items-center gap-2 mb-5">
            <Crown className="h-5 w-5 text-gold" />
            <h2 className="font-playfair text-2xl md:text-3xl text-gold">Featured Contributors</h2>
          </motion.div>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
            {featured.map((v) => (
              <Link
                key={v.id}
                to={`/volunteers/${v.slug}`}
                className="snap-start shrink-0 w-44 md:w-52 rounded-xl border border-gold/30 bg-gradient-to-br from-charcoal to-black p-3 hover:border-gold transition"
              >
                <div className="aspect-square rounded-lg bg-gold/10 overflow-hidden mb-2">
                  {v.photoUrl ? (
                    <img src={v.photoUrl} alt={v.fullName} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gold/40">
                      <Users className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-white truncate">{v.fullName}</div>
                <div className="text-[10px] text-gold/80 uppercase tracking-wider truncate">
                  {v.teamSlug ? TEAM_LABELS[v.teamSlug] : v.role}
                </div>
                <div className="mt-1.5 text-[10px] text-white/50">{TIER_LABEL[tierFor(v.contributionScore)]}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FILTERS + DIRECTORY */}
      <section className="container mx-auto px-4 mt-16">
        <motion.div {...fadeUp}>
          <h2 className="font-playfair text-2xl md:text-3xl text-gold mb-4">Volunteer Directory</h2>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
              <Input
                placeholder="Search name, role, country…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9 bg-black/40 border-gold/30 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-full md:w-44 bg-black/40 border-gold/30 text-white">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger className="w-full md:w-44 bg-black/40 border-gold/30 text-white">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All teams</SelectItem>
                {(Object.keys(TEAM_LABELS) as TeamSlug[]).map((t) => (
                  <SelectItem key={t} value={t}>{TEAM_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <TabsList className="bg-black/40 border border-gold/30">
                <TabsTrigger value="all" className="text-xs data-[state=active]:bg-gold data-[state=active]:text-black">All</TabsTrigger>
                <TabsTrigger value="public" className="text-xs data-[state=active]:bg-gold data-[state=active]:text-black">Active</TabsTrigger>
                <TabsTrigger value="alumni" className="text-xs data-[state=active]:bg-gold data-[state=active]:text-black">Alumni</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="text-white/60 text-sm py-12 text-center">Loading volunteers…</div>
          ) : filtered.length === 0 ? (
            <div className="text-white/60 text-sm py-12 text-center">No volunteers match these filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((v) => {
                const tier = tierFor(v.contributionScore);
                return (
                  <motion.div key={v.id} {...fadeUp}>
                    <Link to={`/volunteers/${v.slug}`}>
                      <Card className="group h-full border-gold/20 bg-gradient-to-br from-charcoal to-black overflow-hidden hover:border-gold/60 hover:shadow-[0_8px_30px_rgb(212,175,55,0.15)] transition">
                        <div className="aspect-[4/3] bg-gold/10 overflow-hidden">
                          {v.photoUrl ? (
                            <img src={v.photoUrl} alt={v.fullName}
                                 className="h-full w-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gold/30">
                              <Users className="h-16 w-16" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-medium text-white truncate">{v.fullName}</div>
                              <div className="text-[11px] text-gold/80 uppercase tracking-wider truncate">
                                {v.teamSlug ? TEAM_LABELS[v.teamSlug] : v.role}
                              </div>
                            </div>
                            {v.badges.includes("verified") && (
                              <BadgeCheck className="h-4 w-4 text-gold shrink-0" />
                            )}
                          </div>
                          {v.country && (
                            <div className="flex items-center gap-1 text-xs text-white/50 mt-1.5">
                              <MapPin className="h-3 w-3" /> {v.country}
                            </div>
                          )}
                          <div className="mt-3 flex items-center justify-between border-t border-gold/10 pt-2.5">
                            <span className="text-[10px] text-white/60">{TIER_LABEL[tier]}</span>
                            <span className="text-xs font-mono text-gold">{v.contributionScore}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </section>

      {/* TEAM GROUPING — Powered By Contribution Teams */}
      <section className="container mx-auto px-4 mt-20">
        <motion.div {...fadeUp} className="text-center mb-8">
          <Badge className="bg-gold/15 text-gold border-gold/40 mb-3">Teams</Badge>
          <h2 className="font-playfair text-2xl md:text-3xl text-gold">Powered By Contribution Teams</h2>
          <p className="text-white/65 text-sm mt-2 max-w-2xl mx-auto">
            Ten cross-functional teams power NESA-Africa across technology, media, data, design,
            partnerships, chapters and beyond.
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(TEAM_LABELS) as TeamSlug[]).map((t) => {
            const list = volunteers.filter((v) => v.teamSlug === t);
            return (
              <Card key={t} className="border-gold/15 bg-gradient-to-br from-charcoal to-black hover:border-gold/40 transition">
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-playfair text-lg text-ivory">{TEAM_LABELS[t]}</h3>
                    <Badge className="border-gold/30 bg-gold/10 text-gold">{list.length}</Badge>
                  </div>
                  <div className="flex -space-x-2">
                    {list.slice(0, 6).map((v) => (
                      <Avatar key={v.id} className="h-9 w-9 border-2 border-charcoal">
                        {v.photoUrl && <AvatarImage src={v.photoUrl} alt={v.fullName} />}
                        <AvatarFallback className="bg-gold/15 text-xs text-gold">
                          {v.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {list.length > 6 && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-charcoal bg-gold/10 text-xs text-gold">
                        +{list.length - 6}
                      </div>
                    )}
                    {list.length === 0 && (
                      <span className="text-xs text-white/40">Recruiting now</span>
                    )}
                  </div>
                  <button
                    onClick={() => { setTeam(t); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="mt-4 inline-flex items-center gap-1 text-xs text-gold hover:underline"
                  >
                    View team <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* STORIES — Why We Volunteer */}
      <section className="container mx-auto px-4 mt-20">
        <motion.div {...fadeUp} className="text-center mb-8">
          <Badge className="bg-gold/15 text-gold border-gold/40 mb-3">Stories</Badge>
          <h2 className="font-playfair text-2xl md:text-3xl text-gold">Why We Volunteer</h2>
          <p className="text-white/65 text-sm mt-2">In their own words — the heart behind NESA-Africa.</p>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { name: "Adaeze N.", country: "Nigeria", role: "Content Volunteer",
              quote: "NESA-Africa gave me a stage to use storytelling for education impact. I found purpose here." },
            { name: "Kwame O.", country: "Ghana", role: "Local Chapter Lead",
              quote: "Coordinating my chapter taught me that recognition is one of the most powerful tools for change." },
            { name: "Amina S.", country: "Kenya", role: "Data & Research",
              quote: "Every dataset we clean becomes a fairer chance for an African educator to be seen." },
          ].map((s, i) => (
            <motion.div key={s.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
              <Card className="h-full border-gold/15 bg-gradient-to-br from-charcoal to-black p-6">
                <Quote className="mb-3 h-6 w-6 text-gold/70" />
                <p className="mb-4 text-sm leading-relaxed text-white/85">"{s.quote}"</p>
                <div className="border-t border-gold/10 pt-3 text-sm">
                  <div className="font-semibold text-ivory">{s.name}</div>
                  <div className="text-white/60">{s.role} · {s.country}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GOVERNANCE NOTE */}
      <section className="container mx-auto px-4 mt-16">
        <motion.div {...fadeUp}>
          <Card className="mx-auto max-w-3xl border-gold/15 bg-gradient-to-br from-charcoal to-black p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
              <ShieldCheck className="h-9 w-9 flex-shrink-0 text-gold" />
              <div className="flex-1">
                <h3 className="mb-1 font-playfair text-lg text-ivory">
                  Privacy, Consent & Code of Conduct
                </h3>
                <p className="text-sm text-white/70">
                  Only volunteers who have approved public display appear on this page.
                  Private contact details are never shown. All volunteers sign a Code of Conduct
                  and disclose conflicts of interest before nomination or jury-adjacent work.
                </p>
              </div>
              <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <Link to="/about/governance">Governance</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mt-20">
        <motion.div {...fadeUp}>
          <Card className="border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal to-black p-8 md:p-12 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl text-gold mb-3">Want to contribute to NESA-Africa 2026?</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-6">
              Become part of a continent-wide movement. Join a team, lead a chapter, or amplify the cause.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
                <Link to="/volunteer">Become a Volunteer</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                <Link to="/ambassadors">Apply as Ambassador</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white/80 hover:text-gold">
                <Link to="/chapters">Join a Local Chapter</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
