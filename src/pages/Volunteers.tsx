import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MapPin,
  Users,
  Globe,
  ArrowRight,
  Award,
  Sparkles,
  Search,
  Filter,
  Linkedin,
  Twitter,
  Globe2,
  Quote,
  Star,
  ShieldCheck,
} from "lucide-react";
import { CONTRIBUTORS, type Contributor } from "@/data/contributors";

// CMS-ready volunteer model — derived from approved Contributors with displayPermission ON.
type VolunteerStatus = "active" | "alumni";
interface Volunteer extends Contributor {
  team: string;
  status: VolunteerStatus;
  featured: boolean;
  displayPermission: true;
}

// Team mapping derived from contribution areas — single source of truth
const TEAMS = [
  "Technology Team",
  "Social Media Team",
  "Data & Research Team",
  "Media / TV Team",
  "Design & Creative Team",
  "Partnership Team",
  "Local Chapter Team",
  "Ambassador Team",
  "Event / Gala Team",
  "Admin & Coordination Team",
] as const;

function deriveTeam(c: Contributor): string {
  const a = c.contributions?.[0] ?? "";
  const r = c.role;
  if (r === "Ambassador" || r === "Regional Ambassador") return "Ambassador Team";
  if (r === "LCP") return "Local Chapter Team";
  if (["Data Engineer", "Data Scientist", "Data Analyst"].includes(r)) return "Data & Research Team";
  if (["TV Presenter", "Webinar Host"].includes(r)) return "Media / TV Team";
  if (["Web Development", "Mobile / PWA", "Technology & DevOps"].includes(a)) return "Technology Team";
  if (["UI/UX Design", "Graphic Design", "Logo & Brand Identity", "Photography"].includes(a)) return "Design & Creative Team";
  if (["Social Media", "Content Writing", "Public Relations"].includes(a)) return "Social Media Team";
  if (["Videography & Editing", "TV Production & Hosting", "Webinar Production"].includes(a)) return "Media / TV Team";
  if (["Partnerships", "Fundraising"].includes(a)) return "Partnership Team";
  if (["Chapter Coordination", "Regional Leadership", "Community Outreach"].includes(a)) return "Local Chapter Team";
  if (["Event Production"].includes(a)) return "Event / Gala Team";
  if (["Legal & Compliance", "Finance & Operations", "Mentorship"].includes(a)) return "Admin & Coordination Team";
  if (["Research & Nominee Vetting", "Data Analysis & Reporting"].includes(a)) return "Data & Research Team";
  return "Admin & Coordination Team";
}

// Build CMS-ready volunteer dataset
const VOLUNTEERS: Volunteer[] = CONTRIBUTORS.filter(
  (c) =>
    !["Judge", "BOA", "BOT", "BOD", "Partner"].includes(c.role)
).map((c, i) => ({
  ...c,
  team: deriveTeam(c),
  status: c.yearEnd && c.yearEnd < 2025 ? "alumni" : "active",
  featured: i < 8 || (c.role === "Regional Ambassador" || c.role === "LCP"),
  displayPermission: true as const,
}));

const STORIES = [
  {
    name: "Adaeze N.",
    country: "Nigeria",
    role: "Content Volunteer",
    quote:
      "NESA-Africa gave me a stage to use storytelling for education impact. I found purpose here.",
  },
  {
    name: "Kwame O.",
    country: "Ghana",
    role: "Local Chapter Lead",
    quote:
      "Coordinating my chapter taught me that recognition is one of the most powerful tools for change.",
  },
  {
    name: "Amina S.",
    country: "Kenya",
    role: "Data & Research",
    quote:
      "Every dataset we clean becomes a fairer chance for an African educator to be seen.",
  },
];

const FADE = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Volunteers() {
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const countries = useMemo(
    () => Array.from(new Set(VOLUNTEERS.map((v) => v.country).filter(Boolean))).sort() as string[],
    []
  );
  const regions = useMemo(
    () => Array.from(new Set(VOLUNTEERS.map((v) => v.region).filter(Boolean))).sort() as string[],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return VOLUNTEERS.filter((v) => {
      if (team !== "all" && v.team !== team) return false;
      if (country !== "all" && v.country !== country) return false;
      if (region !== "all" && v.region !== region) return false;
      if (status !== "all" && v.status !== status) return false;
      if (!q) return true;
      const hay = [
        v.name,
        v.country,
        v.region,
        v.role,
        v.team,
        v.highlight,
        ...(v.contributions ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [search, team, country, region, status]);

  const featured = useMemo(() => VOLUNTEERS.filter((v) => v.featured).slice(0, 8), []);

  const stats = useMemo(() => {
    const teamsActive = new Set(VOLUNTEERS.map((v) => v.team)).size;
    const countriesCount = new Set(VOLUNTEERS.map((v) => v.country).filter(Boolean)).size;
    return [
      { value: `${VOLUNTEERS.length}+`, label: "Volunteers Onboarded" },
      { value: `${countriesCount}+`, label: "Countries Represented" },
      { value: `${teamsActive}`, label: "Teams Active" },
      { value: "50,000+", label: "Hours Contributed" },
      { value: "120+", label: "Projects Supported" },
    ];
  }, []);

  const byTeam = useMemo(() => {
    const map = new Map<string, Volunteer[]>();
    for (const t of TEAMS) map.set(t, []);
    for (const v of VOLUNTEERS) {
      if (!map.has(v.team)) map.set(v.team, []);
      map.get(v.team)!.push(v);
    }
    return map;
  }, []);

  return (
    <>
      <Helmet>
        <title>Meet Our Volunteers | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Celebrating the people powering NESA-Africa — volunteers, ambassadors, chapter leads, designers, data and media teams across Africa and the diaspora."
        />
        <link rel="canonical" href="https://www.nesa.africa/volunteers" />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-gold/10 bg-gradient-to-b from-charcoal via-charcoal to-charcoal/95 py-20 lg:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, hsl(var(--gold)) 0, transparent 40%), radial-gradient(circle at 80% 60%, hsl(var(--gold)) 0, transparent 35%)",
            }}
          />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div {...FADE} className="mb-4 flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-gold" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  The People Behind the Movement
                </span>
              </motion.div>
              <motion.h1
                {...FADE}
                transition={{ ...FADE.transition, delay: 0.05 }}
                className="mb-5 font-display text-4xl font-bold leading-tight text-ivory md:text-6xl"
              >
                Meet Our <span className="text-gold">Volunteers</span>
              </motion.h1>
              <motion.p
                {...FADE}
                transition={{ ...FADE.transition, delay: 0.1 }}
                className="mb-8 text-base text-ivory/80 md:text-lg"
              >
                Celebrating the people contributing their time, skills, creativity and passion
                to build the <span className="text-gold/90">NESA-Africa 2026</span> movement —
                across Africa and the diaspora.
              </motion.p>
              <motion.div
                {...FADE}
                transition={{ ...FADE.transition, delay: 0.15 }}
                className="flex flex-wrap justify-center gap-3"
              >
                <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                  <Link to="/volunteer">
                    <Heart className="mr-2 h-5 w-5" /> Become a Volunteer
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to="/ambassadors">Apply as Ambassador</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to="/chapters">Join a Local Chapter</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-b border-gold/10 bg-charcoal/95 py-10">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center md:grid-cols-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-bold text-gold md:text-3xl">{s.value}</div>
                  <div className="mt-1 text-xs text-ivory/65 md:text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED — swipeable on mobile */}
        <section className="bg-charcoal py-14">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <Badge className="mb-2 border-gold/40 bg-gold/15 text-gold">Featured</Badge>
                <h2 className="font-display text-2xl font-bold text-ivory md:text-3xl">
                  Featured Volunteer Contributors
                </h2>
              </div>
              <Star className="hidden h-6 w-6 text-gold/70 md:block" />
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-4">
              {featured.map((v) => (
                <VolunteerCard key={v.id} v={v} compact />
              ))}
            </div>
          </div>
        </section>

        {/* FILTERS + DIRECTORY */}
        <section id="directory" className="border-t border-gold/10 bg-charcoal/95 py-14">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Badge className="mb-2 border-gold/40 bg-gold/15 text-gold">Directory</Badge>
              <h2 className="font-display text-2xl font-bold text-ivory md:text-3xl">
                Volunteer Directory
              </h2>
              <p className="mt-2 text-sm text-ivory/65">
                Search and filter volunteers across teams, countries and regions. Only volunteers
                with display permission appear publicly.
              </p>
            </div>

            {/* Filter bar */}
            <div className="sticky top-16 z-10 mb-6 rounded-xl border border-gold/15 bg-charcoal-light/80 p-3 backdrop-blur supports-[backdrop-filter]:bg-charcoal-light/60">
              <div className="grid gap-3 md:grid-cols-12">
                <div className="relative md:col-span-4">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/50" />
                  <Input
                    placeholder="Search name, country, role…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-gold/20 bg-charcoal pl-9 text-ivory placeholder:text-ivory/40"
                  />
                </div>
                <FilterSelect label="Team" value={team} onChange={setTeam} options={["all", ...TEAMS]} className="md:col-span-2" />
                <FilterSelect label="Country" value={country} onChange={setCountry} options={["all", ...countries]} className="md:col-span-2" />
                <FilterSelect label="Region" value={region} onChange={setRegion} options={["all", ...regions]} className="md:col-span-2" />
                <FilterSelect label="Status" value={status} onChange={setStatus} options={["all", "active", "alumni"]} className="md:col-span-2" />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-ivory/55">
                <span className="flex items-center gap-1"><Filter className="h-3.5 w-3.5" /> {filtered.length} of {VOLUNTEERS.length} volunteers</span>
                {(search || team !== "all" || country !== "all" || region !== "all" || status !== "all") && (
                  <button
                    onClick={() => { setSearch(""); setTeam("all"); setCountry("all"); setRegion("all"); setStatus("all"); }}
                    className="text-gold hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <Card className="border-gold/10 bg-charcoal-light/50 p-10 text-center">
                <p className="text-ivory/70">No volunteers match your filters yet.</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((v) => (
                  <VolunteerCard key={v.id} v={v} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STORIES */}
        <section className="bg-charcoal py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <Badge className="mb-2 border-gold/40 bg-gold/15 text-gold">Stories</Badge>
              <h2 className="font-display text-2xl font-bold text-ivory md:text-3xl">
                Why We Volunteer
              </h2>
              <p className="mt-2 text-sm text-ivory/65">
                In their own words — the heart behind NESA-Africa.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {STORIES.map((s, i) => (
                <motion.div key={s.name} {...FADE} transition={{ ...FADE.transition, delay: i * 0.05 }}>
                  <Card className="h-full border-gold/15 bg-charcoal-light/60">
                    <CardContent className="p-6">
                      <Quote className="mb-3 h-6 w-6 text-gold/70" />
                      <p className="mb-4 text-sm leading-relaxed text-ivory/85">"{s.quote}"</p>
                      <div className="border-t border-gold/10 pt-3 text-sm">
                        <div className="font-semibold text-ivory">{s.name}</div>
                        <div className="text-ivory/60">{s.role} · {s.country}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM GROUPING */}
        <section className="border-t border-gold/10 bg-charcoal/95 py-14">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <Badge className="mb-2 border-gold/40 bg-gold/15 text-gold">Teams</Badge>
              <h2 className="font-display text-2xl font-bold text-ivory md:text-3xl">
                Powered By Contribution Teams
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEAMS.map((t) => {
                const list = byTeam.get(t) ?? [];
                return (
                  <Card key={t} className="border-gold/10 bg-charcoal-light/50 transition-colors hover:border-gold/30">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-display text-lg text-ivory">{t}</h3>
                        <Badge className="border-gold/30 bg-gold/10 text-gold">{list.length}</Badge>
                      </div>
                      <div className="flex -space-x-2">
                        {list.slice(0, 6).map((v) => (
                          <Avatar key={v.id} className="h-9 w-9 border-2 border-charcoal-light">
                            {v.imageUrl && <AvatarImage src={v.imageUrl} alt={v.name} />}
                            <AvatarFallback className="bg-gold/15 text-xs text-gold">
                              {initials(v.name)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {list.length > 6 && (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-charcoal-light bg-gold/10 text-xs text-gold">
                            +{list.length - 6}
                          </div>
                        )}
                        {list.length === 0 && (
                          <span className="text-xs text-ivory/40">Recruiting now</span>
                        )}
                      </div>
                      <button
                        onClick={() => { setTeam(t); document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" }); }}
                        className="mt-4 inline-flex items-center gap-1 text-xs text-gold hover:underline"
                      >
                        View team <ArrowRight className="h-3 w-3" />
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* GOVERNANCE NOTE */}
        <section className="bg-charcoal py-10">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-3xl border-gold/15 bg-charcoal-light/60">
              <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:gap-5">
                <ShieldCheck className="h-9 w-9 flex-shrink-0 text-gold" />
                <div className="flex-1">
                  <h3 className="mb-1 font-display text-lg text-ivory">
                    Privacy, Consent & Code of Conduct
                  </h3>
                  <p className="text-sm text-ivory/70">
                    Only volunteers who have approved public display appear on this page.
                    Private contact details are never shown. All volunteers sign a Code of Conduct
                    and disclose conflicts of interest before nomination or jury-adjacent work.
                  </p>
                </div>
                <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to="/about/governance">Governance</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="bg-gradient-to-b from-charcoal to-charcoal/90 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-gold" />
            <h2 className="mb-3 font-display text-2xl font-bold text-ivory md:text-3xl">
              Want to contribute to NESA-Africa 2026?
            </h2>
            <p className="mx-auto mb-7 max-w-xl text-ivory/70">
              Join thousands powering Africa's largest education recognition movement.
              Choose the path that fits your skills and schedule.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to="/volunteer">
                  Become a Volunteer <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <Link to="/ambassadors">Apply as Ambassador</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <Link to="/chapters">Join a Local Chapter</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ivory/50">
              <Award className="h-4 w-4 text-gold/70" />
              Every contributor receives an appreciation certificate from NESA-Africa & SCEF.
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ──────────────────────────────── Subcomponents ──────────────────────────────── */

function FilterSelect({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-gold/20 bg-charcoal text-ivory">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="max-h-72 border-gold/20 bg-charcoal-light text-ivory">
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o === "all" ? `All ${label}` : o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function VolunteerCard({ v, compact = false }: { v: Volunteer; compact?: boolean }) {
  return (
    <Card
      className={`group border-gold/10 bg-charcoal-light/55 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_8px_30px_-12px_hsl(var(--gold)/0.35)] ${
        compact ? "min-w-[78%] flex-shrink-0 snap-start md:min-w-0" : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 border border-gold/30">
            {v.imageUrl && <AvatarImage src={v.imageUrl} alt={v.name} />}
            <AvatarFallback className="bg-gold/15 text-gold">{initials(v.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-base font-semibold text-ivory">{v.name}</h3>
            <p className="truncate text-xs text-gold/80">{v.title ?? v.role}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ivory/55">
              {v.country && (
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{v.country}</span>
              )}
              {v.region && (
                <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" />{v.region}</span>
              )}
            </div>
          </div>
        </div>

        {v.highlight && (
          <p className="mt-3 line-clamp-2 text-sm text-ivory/75">{v.highlight}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge className="border-gold/30 bg-gold/10 text-[10px] text-gold">{v.team}</Badge>
          {v.status === "alumni" && (
            <Badge className="border-ivory/20 bg-ivory/10 text-[10px] text-ivory/75">Alumni</Badge>
          )}
          {v.contributions?.slice(0, 2).map((c) => (
            <Badge key={c} variant="outline" className="border-gold/15 text-[10px] text-ivory/70">
              {c}
            </Badge>
          ))}
        </div>

        {v.socials && (
          <div className="mt-4 flex items-center gap-2 border-t border-gold/10 pt-3">
            {v.socials.linkedin && (
              <SocialIcon href={v.socials.linkedin} icon={<Linkedin className="h-3.5 w-3.5" />} />
            )}
            {v.socials.twitter && (
              <SocialIcon href={`https://twitter.com/${v.socials.twitter.replace(/^@/, "")}`} icon={<Twitter className="h-3.5 w-3.5" />} />
            )}
            {v.socials.website && (
              <SocialIcon href={v.socials.website} icon={<Globe2 className="h-3.5 w-3.5" />} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors hover:bg-gold hover:text-charcoal"
    >
      {icon}
    </a>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
