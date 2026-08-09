import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Gavel,
  ShieldCheck,
  Star,
  MapPin,
  Users,
  Globe2,
  Scale,
  Lock,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Award,
  Eye,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { listPublicJudges, type PublicJudge } from "@/lib/api/judges.api";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";
import { trackEvent } from "@/lib/analytics";

const REGIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "Horn of Africa",
  "Sahel Region",
  "Indian Ocean Islands",
  "Africans in Diaspora",
  "Friends of Africa",
];

const EXPERTISE_MATRIX = [
  "Education Policy",
  "Curriculum Development",
  "Educational Technology",
  "Research & Development",
  "STEM Education",
  "Governance",
  "Leadership",
  "Social Impact",
  "Higher Education",
  "Basic Education",
  "Inclusion & Special Needs",
  "International Development",
];

const INTEGRITY_PILLARS = [
  { icon: Users, title: "Judge Selection", desc: "Merit-based recruitment from across the continent." },
  { icon: ShieldAlert, title: "Conflict Screening", desc: "Mandatory disclosure and recusal protocols." },
  { icon: ClipboardCheck, title: "Evaluation Rubrics", desc: "Published EDI scoring matrices per tier." },
  { icon: Scale, title: "Independent Scoring", desc: "Firewalled from sponsors and operators." },
  { icon: FileSearch, title: "Verification Review", desc: "Evidence cross-checked by the NRC." },
  { icon: Lock, title: "Governance Oversight", desc: "Final validation by the SCEF board." },
];

const PROCESS_STEPS = [
  { n: 1, title: "Nomination Verification", icon: CheckCircle2 },
  { n: 2, title: "Eligibility Review", icon: ClipboardCheck },
  { n: 3, title: "Evidence Assessment", icon: FileSearch },
  { n: 4, title: "EDI Matrix Scoring", icon: Scale },
  { n: 5, title: "Moderation Review", icon: Eye },
  { n: 6, title: "Final Validation", icon: Award },
];

const COI_DISCLOSURES = [
  "Financial interests",
  "Sponsorship relationships",
  "Family relationships",
  "Organisational affiliations",
  "Prior nominee relationships",
];

const FIREWALL_ITEMS = [
  "Nominee Approval",
  "Verification Outcomes",
  "Judge Scoring",
  "Finalist Selection",
  "Winner Selection",
];

export default function JudgesDirectory() {
  const [judges, setJudges] = useState<PublicJudge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<string>("");
  const [expertise, setExpertise] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listPublicJudges()
      .then((d) => mounted && setJudges(d))
      .catch(() => mounted && setJudges([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const countries = useMemo(
    () => Array.from(new Set(judges.map((j) => j.country_residence).filter(Boolean))).sort() as string[],
    [judges],
  );
  const expertises = useMemo(
    () =>
      Array.from(new Set([...EXPERTISE_MATRIX, ...judges.flatMap((j) => j.expertise_areas || [])])).sort(),
    [judges],
  );

  const filtered = useMemo(() => {
    return judges.filter((j) => {
      if (region && j.region !== region) return false;
      if (country && j.country_residence !== country) return false;
      if (expertise && !(j.expertise_areas || []).includes(expertise)) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${j.full_name} ${j.organization ?? ""} ${j.professional_title ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [judges, region, country, expertise, search]);

  const handleFilter = (kind: string, value: string) => {
    trackEvent("judges_filter_used", { filter: kind, value });
  };

  return (
    <>
      <Helmet>
        <title>Judges & Integrity Framework | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Independent experts evaluating NESA-Africa 2026 nominees under published rubrics, conflict-of-interest controls, and continental governance oversight."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/judges/directory" />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        {/* ─────────── HERO ─────────── */}
        <section className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-b from-black via-charcoal to-charcoal">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, hsl(42 85% 52% / 0.25), transparent 50%), radial-gradient(circle at 80% 60%, hsl(42 85% 52% / 0.15), transparent 50%)",
            }}
          />
          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <Badge className="mb-5 bg-gold/15 text-gold border border-gold/30">
                <ShieldCheck className="mr-1 h-3 w-3" /> NESA-Africa Integrity Framework
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
                Independent Experts.{" "}
                <span className="text-gold">Trusted Evaluation.</span>{" "}
                Continental Integrity.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed">
                NESA-Africa judges are selected based on expertise, integrity, independence, and
                demonstrated contributions to education, leadership, innovation, research, policy,
                governance, and social impact.
              </p>
              <p className="mt-4 text-base text-white/60 italic border-l-2 border-gold/40 pl-4">
                Every judge is subject to conflict-of-interest screening, governance policies, and
                published evaluation standards.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90 font-semibold">
                  <a href="#how-judging-works">
                    Learn About the Judging Process <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10"
                >
                  <Link to="/judgeapply">Apply to be a Judge</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─────────── TRUST METRICS ─────────── */}
        <section className="border-b border-white/10 bg-black/40 py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { v: "27+", l: "Expert Judges", i: Users },
                { v: "10", l: "Education Regions", i: Globe2 },
                { v: "12+", l: "Disciplines", i: Award },
                { v: "100%", l: "COI Screening", i: ShieldAlert },
                { v: "Independent", l: "Evaluation", i: Scale },
                { v: "Board", l: "Oversight", i: Lock },
              ].map((m) => (
                <div
                  key={m.l}
                  className="rounded-xl border border-gold/15 bg-charcoal-light/40 p-4 text-center hover:border-gold/40 transition-colors"
                >
                  <m.i className="mx-auto h-5 w-5 text-gold mb-2" />
                  <div className="text-xl md:text-2xl font-bold text-gold">{m.v}</div>
                  <div className="text-xs text-white/60 mt-1">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── INTEGRITY FRAMEWORK ─────────── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-10">
              <Badge className="mb-3 bg-gold/15 text-gold border border-gold/30">Integrity Framework</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                Built for <span className="text-gold">Fairness and Independence</span>
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INTEGRITY_PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-gold/40 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-lg bg-gold/15 p-2">
                      <p.icon className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-white">{p.title}</h3>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Flow strip */}
            <div className="mt-10 overflow-x-auto">
              <ol className="flex min-w-max items-center gap-2 rounded-xl border border-gold/20 bg-black/40 p-4">
                {[
                  "Judge Selection",
                  "Verification",
                  "Evaluation",
                  "Moderation",
                  "Governance Review",
                  "Final Approval",
                ].map((s, i, arr) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-gold whitespace-nowrap">
                      {s}
                    </span>
                    {i < arr.length - 1 && <ChevronRight className="h-4 w-4 text-gold/50" />}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ─────────── CONTINENTAL REPRESENTATION ─────────── */}
        <section className="border-y border-white/10 bg-black/40 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-8">
              <Badge className="mb-3 bg-gold/15 text-gold border border-gold/30">
                <Globe2 className="mr-1 h-3 w-3" /> Continental Representation
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                One Continent. <span className="text-gold">Ten Education Regions.</span> Diverse Perspectives.
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {REGIONS.map((r) => {
                const count = judges.filter((j) => j.region === r).length;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRegion(r);
                      handleFilter("region", r);
                      document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:border-gold/40 hover:bg-gold/5 transition-all"
                    aria-label={`Filter by ${r}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <MapPin className="h-4 w-4 text-gold/70 group-hover:text-gold" />
                      <span className="text-xs text-gold">{count}</span>
                    </div>
                    <div className="text-sm font-medium text-white group-hover:text-gold">{r}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────── DIRECTORY + FILTERS ─────────── */}
        <section id="directory" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-8">
              <Badge className="mb-3 bg-gold/15 text-gold border border-gold/30">Judge Directory</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                Meet the <span className="text-gold">Independent Jury</span>
              </h2>
              <p className="mt-3 text-white/70">
                Filter by region, country, or expertise. Each profile lists professional background and
                evaluation focus.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search name, organization…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-charcoal border-white/15 text-white placeholder:text-white/40"
                  aria-label="Search judges"
                />
              </div>
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  handleFilter("region", e.target.value);
                }}
                className="rounded-md border border-white/15 bg-charcoal px-3 py-2 text-sm text-white"
                aria-label="Filter by region"
              >
                <option value="">All regions</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  handleFilter("country", e.target.value);
                }}
                className="rounded-md border border-white/15 bg-charcoal px-3 py-2 text-sm text-white"
                aria-label="Filter by country"
              >
                <option value="">All countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={expertise}
                onChange={(e) => {
                  setExpertise(e.target.value);
                  handleFilter("expertise", e.target.value);
                }}
                className="rounded-md border border-white/15 bg-charcoal px-3 py-2 text-sm text-white"
                aria-label="Filter by expertise"
              >
                <option value="">All expertise</option>
                {expertises.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-xl bg-white/5" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-16 text-center">
                  <Gavel className="mx-auto mb-4 h-10 w-10 text-gold/70" />
                  <h3 className="font-serif text-2xl text-white">No judges match these filters</h3>
                  <p className="mt-2 text-white/70">
                    Approved jury profiles will appear here as the 2026 panel is finalized.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Button
                      variant="outline"
                      className="border-gold/40 text-gold hover:bg-gold/10"
                      onClick={() => {
                        setRegion("");
                        setCountry("");
                        setExpertise("");
                        setSearch("");
                      }}
                    >
                      Clear filters
                    </Button>
                    <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                      <Link to="/judgeapply">Apply to be a Judge</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((j) => (
                  <Link
                    key={j.id}
                    to={`/judges/directory/${j.slug}`}
                    className="group"
                    onClick={() => trackEvent("judge_profile_view", { judge_slug: j.slug })}
                  >
                    <Card className="h-full bg-white/5 border-white/10 transition-all group-hover:border-gold/40 group-hover:bg-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16 ring-2 ring-gold/30">
                            <AvatarImage src={j.photo_url ?? undefined} alt={j.full_name} />
                            <AvatarFallback className="bg-gold/20 text-gold">
                              {j.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-serif text-lg font-semibold text-white group-hover:text-gold">
                              {j.full_name}
                            </h3>
                            {j.professional_title && (
                              <p className="truncate text-sm text-white/70">{j.professional_title}</p>
                            )}
                            {j.organization && (
                              <p className="truncate text-xs text-white/50">{j.organization}</p>
                            )}
                          </div>
                          {j.featured && (
                            <Badge className="bg-gold/20 text-gold border border-gold/40 shrink-0">
                              <Star className="mr-1 h-3 w-3" /> Featured
                            </Badge>
                          )}
                        </div>

                        {j.bio && (
                          <p className="mt-4 text-sm text-white/70 line-clamp-3">{j.bio}</p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {(j.expertise_areas || []).slice(0, 3).map((e) => (
                            <Badge
                              key={e}
                              variant="outline"
                              className="border-gold/30 text-gold/90 text-xs"
                            >
                              {e}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                          {(j.country_residence || j.region) && (
                            <div className="flex items-center gap-1 text-xs text-white/50">
                              <MapPin className="h-3 w-3" />
                              {[j.country_residence, j.region].filter(Boolean).join(" • ")}
                            </div>
                          )}
                          <span className="text-xs text-gold/80 group-hover:text-gold flex items-center gap-1">
                            View profile <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─────────── EXPERTISE MATRIX ─────────── */}
        <section className="border-y border-white/10 bg-black/40 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-8">
              <Badge className="mb-3 bg-gold/15 text-gold border border-gold/30">Expertise Matrix</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                Disciplines Represented Across the <span className="text-gold">Panel</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_MATRIX.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    setExpertise(e);
                    handleFilter("expertise", e);
                    document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-sm text-white/90 hover:bg-gold/15 hover:border-gold transition-colors"
                  aria-label={`Filter by ${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── CONFLICT OF INTEREST ─────────── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge className="mb-3 bg-gold/15 text-gold border border-gold/30">
                  <ShieldAlert className="mr-1 h-3 w-3" /> Conflict of Interest Policy
                </Badge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                  Independence Is <span className="text-gold">Non-Negotiable</span>
                </h2>
                <p className="mt-4 text-white/70">
                  All judges complete mandatory disclosures before reviewing any nomination. Any
                  judge with a declared or detected conflict is recused from the affected category,
                  nominee, or tier.
                </p>
              </div>
              <Card className="bg-white/5 border-gold/20">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold text-gold mb-4">Judges must disclose:</p>
                  <ul className="space-y-3">
                    {COI_DISCLOSURES.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-sm text-white/85">
                        <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-white/90">
                    Judges with conflicts are <strong className="text-gold">recused</strong> from
                    affected evaluations.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ─────────── HOW JUDGING WORKS ─────────── */}
        <section id="how-judging-works" className="border-y border-white/10 bg-black/40 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-10">
              <Badge className="mb-3 bg-gold/15 text-gold border border-gold/30">Judging Process</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                How <span className="text-gold">Judging Works</span>
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PROCESS_STEPS.map((s) => (
                <div
                  key={s.n}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-charcoal font-bold">
                      {s.n}
                    </div>
                    <s.icon className="h-5 w-5 text-gold/70" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">{s.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── GOVERNANCE FIREWALL ─────────── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Card className="border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal to-black">
              <CardContent className="p-8 md:p-12">
                <Badge className="mb-4 bg-gold text-charcoal border-0">
                  <Lock className="mr-1 h-3 w-3" /> Governance Firewall
                </Badge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                  Sponsors Do Not <span className="text-gold">Influence Results</span>
                </h2>
                <p className="mt-4 text-white/80 max-w-3xl">
                  Sponsorships, donations, partnerships, media support, AGC participation, or
                  commercial relationships do not affect:
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {FIREWALL_ITEMS.map((f) => (
                    <div
                      key={f}
                      className="rounded-lg border border-gold/30 bg-black/40 px-4 py-3 text-center text-sm font-medium text-white"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─────────── FINAL CTA ─────────── */}
        <section className="border-t border-gold/20 bg-gradient-to-b from-black to-charcoal py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-gold/15 text-gold border border-gold/30">
              <ShieldCheck className="mr-1 h-3 w-3" /> Trust Through Transparency
            </Badge>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white max-w-3xl mx-auto">
              Trust Through <span className="text-gold">Transparency</span>
            </h2>
            <p className="mt-5 text-lg text-white/75 max-w-2xl mx-auto">
              NESA-Africa is committed to fair, independent, evidence-based recognition of
              educational excellence across Africa and the diaspora.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90 font-semibold">
                <Link to="/awards/categories">Explore Award Categories</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10"
              >
                <Link to="/nominees">View Nominees</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Link to="/about/governance">Learn About Governance</Link>
              </Button>
            </div>

            <div className="mt-14">
              <ExploreNomineesCTA
                title="The nominees our jury evaluates"
                description="Meet the approved education changemakers whose work the jury is reviewing for NESA-Africa 2026."
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
