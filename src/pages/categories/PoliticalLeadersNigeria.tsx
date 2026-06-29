import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  FileBadge,
  Calendar,
  Building2,
  Tv,
  ArrowRight,
  Users,
  Image as ImageIcon,
  Video as VideoIcon,
  ImageOff,
  Globe2,
  Scale,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CategorySubcategoriesPanel } from "@/components/awards/CategorySubcategoriesPanel";

const CANONICAL = "https://nesa.africa/categories/political-leaders-education-nigeria";

const PRIMARY_NOMINATE_HREF =
  "/nominate?subcategory=316d2796-bd9f-41cc-9299-e42b4f51b1d3";

// ─── Zone tabs (fixed order — do not reorder/alphabetize/rank) ───
const ZONES = [
  "North Central",
  "North East",
  "North West",
  "South East",
  "South South",
  "South West",
  "FCT",
] as const;
type Zone = (typeof ZONES)[number];

// ─── Sub-categories ───
const SUBCATEGORIES: { title: string; subcategoryId: string }[] = [
  { title: "Governors Educational Impact", subcategoryId: "316d2796-bd9f-41cc-9299-e42b4f51b1d3" },
  { title: "National Assembly Education Support", subcategoryId: "a87adfeb-4e32-418d-8901-3128e0df4071" },
  { title: "Ministers / Commissioners / Advisers", subcategoryId: "9e06ae92-2225-460b-8cf9-73c82851ea4c" },
  { title: "House of Representatives", subcategoryId: "6f47bbd7-5940-4932-9551-329abf5e5028" },
  { title: "Senators", subcategoryId: "88d367b9-e304-41a5-b9ee-50bc03671884" },
  { title: "State Legislators", subcategoryId: "e748223f-c7d7-4a67-9589-34ceca029834" },
  { title: "Local Government Chairmen", subcategoryId: "0b6c53b7-5de7-4ac3-ac97-fa6d8612a42b" },
];

const WHO_QUALIFIES = [
  "Current or former Governors, Senators, House of Representatives members, Ministers, Commissioners, Special Advisers, State Legislators, or Local Government Chairmen",
  "Must have personally founded, funded, or championed a specific education initiative — a foundation, scholarship scheme, school, or comparable contribution",
  "The initiative must have launched within the last 20 years (2006–2026); ongoing/active status today is not required if the launch falls in this window",
  "Does not include state or federal budget allocations, sectoral policy, or institutional spending made in the ordinary course of holding office",
  "The sitting President and Vice President are not eligible",
];

const EDI_ROWS: { area: string; score: string; measured: string }[] = [
  { area: "Evidence Quality", score: "20", measured: "Foundation/programme records, verified news coverage, official documentation tying the initiative to the individual" },
  { area: "Education Access", score: "15", measured: "Learners reached, scholarships awarded, schools built or funded" },
  { area: "Learning Quality", score: "15", measured: "Curriculum support, teacher training, learning materials funding" },
  { area: "Equity & Inclusion", score: "15", measured: "Girls' education focus, rural access, low-income or out-of-school learners" },
  { area: "Scale & Reach", score: "10", measured: "Number of beneficiaries, states, or institutions involved" },
  { area: "Sustainability", score: "10", measured: "Multi-year operation, institutional structure (e.g. a registered foundation), continuity beyond a single donation" },
  { area: "Innovation", score: "10", measured: "Novel funding models, partnerships, or delivery mechanisms" },
  { area: "Story / Documentary Value", score: "5", measured: "Independently reported impact, verifiable testimonials" },
];

const THRESHOLDS = [
  "90–100 Platinum Recognition of Distinction",
  "80–89 Platinum Recognition",
  "70–79 Platinum Watchlist",
  "Below 70 Not Yet Published",
];

const TIMELINE_ROWS = [
  { step: "Nominations open", date: "Now – 31 March 2026", what: "Submit nominations and supporting evidence via the online portal" },
  { step: "EDI Verification", date: "April 2026", what: "SCEF panels score submissions against the EDI Matrix, with cross-party review" },
  { step: "Platinum Recognition Show", date: "5 July 2026", what: "Certificates awarded; feature spotlight on NESA TV" },
];

type VerificationStatus = "documented" | "pending_verification";
type CitationStrength = "primary_document" | "general_reporting";
type ContributionType = "foundation" | "scholarship" | "school" | "infrastructure" | "other";
type MediaType = "photo" | "video" | "none";

interface PoliticalNominee {
  name: string;
  role_at_contribution: string;
  state: string;
  zone: Zone;
  party: string;
  contribution: string;
  contribution_type: ContributionType;
  launch_year: string;
  source_citation: string;
  citation_strength: CitationStrength;
  verification_status: VerificationStatus;
  edi_score: number | null;
  media_type: MediaType;
  incumbent: boolean;
}

const NOMINEES: PoliticalNominee[] = [
  {
    name: "General T.Y. Danjuma",
    role_at_contribution: "Former Minister of Defence (1999–2003)",
    state: "Taraba",
    zone: "North East",
    party: "PDP",
    contribution:
      "Founded the TY Danjuma Foundation (2008) and personally established the TY Danjuma MBA Scholarship (2011), which has funded 68 African students at top-10 globally ranked MBA programmes to date. The Foundation has also commissioned the TY Danjuma Academy, a school in Takum, Taraba State.",
    contribution_type: "foundation",
    launch_year: "2008 (Foundation) / 2011 (Scholarship)",
    source_citation:
      "TY Danjuma Foundation official site; consistent independent reporting (Scholarship Region, CrispNG, Edugist)",
    citation_strength: "primary_document",
    verification_status: "pending_verification",
    edi_score: null,
    media_type: "none",
    incumbent: false,
  },
  {
    name: "Monday Okpebholo",
    role_at_contribution:
      "Governor, Edo State (incumbent since November 2024; previously Senator for Edo Central, 2023–2024)",
    state: "Edo",
    zone: "South South",
    party: "APC",
    contribution:
      "Launched the Sen. Monday Okpebholo Education Talent Hunt (March 2026), a personally funded, fully-funded-scholarship programme identifying academically talented SS3 students for state-owned tertiary institutions. Separately approved a ₦1 billion bursary scheme for indigent Edo students in tertiary institutions nationwide (July 2025), intended as an annual programme.",
    contribution_type: "scholarship",
    launch_year: "2025 (bursary) / 2026 (Talent Hunt)",
    source_citation: "Daily Post Nigeria, July 2025; Nigeria Startup Act, March 2026",
    citation_strength: "primary_document",
    verification_status: "pending_verification",
    edi_score: null,
    media_type: "none",
    incumbent: true,
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is this category politically affiliated?",
    a: "No. NESA-Africa is non-partisan. Nominees are assessed solely on documented individual education contributions using the EDI Matrix, regardless of party, zone, or state.",
  },
  {
    q: "What counts as a qualifying contribution?",
    a: "A foundation, scholarship scheme, school, or comparable initiative personally founded, funded, or championed by the individual — not a state budget allocation or routine policy decision made in office.",
  },
  {
    q: "Why isn't the President or Vice President eligible?",
    a: "Given the heightened political-neutrality stakes of including a sitting head of state or deputy head of state, NESA-Africa has excluded these two offices from this category entirely.",
  },
  {
    q: "How far back can a contribution date?",
    a: "Up to 20 years (2006–2026). The contribution does not need to still be active today, but it must have launched within this window.",
  },
  {
    q: "How are nominees verified?",
    a: "Through the EDI Matrix, validated by regional SCEF panels with cross-party and cross-zone review.",
  },
  {
    q: "Can a Platinum recipient also compete for Blue Garnet?",
    a: "Yes, if their documented work meets the higher competitive thresholds.",
  },
  {
    q: "Does recognition imply NESA-Africa's endorsement of this leader or their party?",
    a: "No. Recognition reflects a specific, documented personal contribution only and does not constitute endorsement of the individual, their broader record, or their political party.",
  },
];

const MEDIA_FILTERS: { key: "all" | MediaType; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: Globe2 },
  { key: "photo", label: "Has Photo", icon: ImageIcon },
  { key: "video", label: "Has Video", icon: VideoIcon },
  { key: "none", label: "No Media Yet", icon: ImageOff },
];

const SectionTitle = ({
  kicker,
  title,
  sub,
}: {
  kicker?: string;
  title: string;
  sub?: string;
}) => (
  <div className="text-center max-w-3xl mx-auto mb-10">
    {kicker && (
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80 mb-2 font-semibold">
        {kicker}
      </p>
    )}
    <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory">{title}</h2>
    {sub && <p className="mt-3 text-ivory/65 text-base md:text-lg leading-relaxed">{sub}</p>}
  </div>
);

const sortNominees = (list: PoliticalNominee[]) => {
  const lastName = (n: PoliticalNominee) => {
    const parts = n.name.trim().split(/\s+/);
    return parts[parts.length - 1].toLowerCase();
  };
  return [...list].sort((a, b) => {
    if (a.incumbent !== b.incumbent) return a.incumbent ? -1 : 1;
    return lastName(a).localeCompare(lastName(b));
  });
};

const NomineeCard = ({ n }: { n: PoliticalNominee }) => (
  <Card className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full">
    <CardContent className="p-5 space-y-3 h-full flex flex-col">
      <div>
        <h4 className="font-semibold text-ivory text-base leading-snug">{n.name}</h4>
        <p className="text-ivory/70 text-sm mt-1">
          {n.role_at_contribution} · {n.state}
        </p>
      </div>
      <p className="text-ivory/75 text-sm leading-relaxed flex-1">{n.contribution}</p>
      <div className="text-xs text-ivory/65 flex items-center gap-1.5">
        <Calendar className="h-3 w-3 text-gold/80" />
        <span>Launched: {n.launch_year}</span>
      </div>
      <div className="border-t border-gold/10 pt-3 space-y-2">
        <p className="text-xs text-ivory/65 leading-relaxed">
          <span className="text-gold/80 font-semibold">Source: </span>
          {n.source_citation}
        </p>
        <Badge
          className={
            n.citation_strength === "primary_document"
              ? "bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15"
              : "bg-charcoal-light/60 text-ivory/80 border border-gold/20 hover:bg-charcoal-light/60"
          }
        >
          {n.citation_strength === "primary_document" ? "Primary Source" : "General Reporting"}
        </Badge>
      </div>
      <div className="flex items-center justify-between pt-2">
        {n.verification_status === "documented" ? (
          <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/15">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Documented
          </Badge>
        ) : (
          <Badge className="bg-amber-500/15 text-amber-300 border border-amber-400/30 hover:bg-amber-500/15">
            <ShieldCheck className="w-3 h-3 mr-1" /> Pending Verification
          </Badge>
        )}
        <span className="text-[10px] text-ivory/45 uppercase tracking-wider">
          Party: {n.party}
        </span>
      </div>
    </CardContent>
  </Card>
);

export default function PoliticalLeadersNigeriaPage() {
  const [mediaFilter, setMediaFilter] = useState<"all" | MediaType>("all");

  const filteredByZone = useMemo(() => {
    const out = {} as Record<Zone, PoliticalNominee[]>;
    for (const z of ZONES) {
      const list = NOMINEES.filter((n) => n.zone === z);
      const filtered =
        mediaFilter === "all" ? list : list.filter((n) => n.media_type === mediaFilter);
      out[z] = sortNominees(filtered);
    }
    return out;
  }, [mediaFilter]);

  const mediaCounts = useMemo(() => {
    let photo = 0, video = 0, none = 0;
    for (const n of NOMINEES) {
      if (n.media_type === "photo") photo++;
      else if (n.media_type === "video") video++;
      else none++;
    }
    return { all: photo + video + none, photo, video, none };
  }, []);

  return (
    <div className="bg-charcoal text-ivory">
      <Helmet>
        <title>Political Leaders' Education Impact (Nigeria) 2026 | NESA-Africa</title>
        <meta
          name="description"
          content="Platinum recognition for Nigerian political leaders — current or former — for documented, individually attributed education contributions. 2026 nominations open."
        />
        <link rel="canonical" href={CANONICAL} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          {
            name: "Political Leaders' Education Impact (Nigeria)",
            path: "/categories/political-leaders-education-nigeria",
          },
        ]}
      />

      {/* ════════════ 1 — HERO ════════════ */}
      <section className="relative overflow-hidden border-b border-gold/10 px-4 py-16 md:py-24">
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" aria-hidden />
        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/15 mb-5">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 2026 Nominations Open
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Political Leaders' <span className="text-gold">Education Impact</span>
          </h1>
          <p className="mt-5 text-ivory/70 text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
            Recognising Nigerian political leaders — current or former — for documented, individually attributed contributions to education through their own foundations, scholarships, and personally championed initiatives.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
              <Link to={PRIMARY_NOMINATE_HREF}>
                <Award className="mr-2 h-4 w-4" /> Nominate Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10">
              <Link to="/nominees?category=political-leaders-education-nigeria">
                Explore Nominees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10">
              <Link to="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════ 2 — OVERVIEW ════════════ */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-5">
          <SectionTitle kicker="Overview" title="Recognising personal contribution, not public office" />
          <p className="text-ivory/75 leading-relaxed">
            Beyond the policies and budgets that come with public office, some of Nigeria's political leaders have personally championed education through their own foundations, scholarships, and initiatives — often continuing this work long after leaving office.
          </p>
          <p className="text-ivory/75 leading-relaxed">
            Excellence in Political Leadership for Education (Nigeria) recognises current and former governors, federal and state lawmakers, ministers, commissioners, advisers, and local government chairmen for documented, individually attributed education contributions — a scholarship fund they personally established, a school they personally built or funded, or an initiative they personally championed. This category does not credit state budget allocations or institutional policy made in the ordinary course of office; it recognises what the individual personally created or funded, evaluated under governance and leadership criteria aligned with SDG 4 and Africa Agenda 2063 Goal 1.
          </p>
          <p className="text-ivory/75 leading-relaxed">
            This recognition is non-partisan and evidence-based. Inclusion on this page does not constitute a political endorsement by NESA-Africa, SCEF, or any affiliated body — nominees are assessed solely against the EDI Matrix, regardless of party, zone, state, or political affiliation. The sitting President and Vice President are not eligible for this category.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["SDG 4", "SDG 16 (Strong Institutions)", "Agenda 2063 Goal 1"].map((p) => (
              <Badge
                key={p}
                className="bg-charcoal-light/60 text-ivory/80 border border-gold/20 hover:bg-charcoal-light/60"
              >
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 3 — WHO QUALIFIES + EDI ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="Eligibility" title="Who qualifies & how nominees are scored" />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          <Card className="bg-charcoal-light/50 border-gold/15">
            <CardContent className="p-6">
              <h3 className="font-display text-lg text-ivory font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" /> Who qualifies
              </h3>
              <ul className="space-y-2 text-sm text-ivory/75">
                {WHO_QUALIFIES.map((q) => (
                  <li key={q} className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0 mt-1" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-charcoal-light/50 border-gold/15">
            <CardContent className="p-6">
              <h3 className="font-display text-lg text-ivory font-semibold mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-gold" /> EDI Matrix scoring
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gold/80 border-b border-gold/20">
                      <th className="py-2 pr-2 font-semibold">EDI Area</th>
                      <th className="py-2 pr-2 font-semibold">Score</th>
                      <th className="py-2 font-semibold">What's measured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {EDI_ROWS.map((r) => (
                      <tr key={r.area}>
                        <td className="py-2 pr-2 text-ivory/90 font-medium align-top">{r.area}</td>
                        <td className="py-2 pr-2 text-gold align-top">{r.score}</td>
                        <td className="py-2 text-ivory/70">{r.measured}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto mt-6 flex flex-wrap gap-2 justify-center">
          {THRESHOLDS.map((t) => (
            <Badge
              key={t}
              className="bg-charcoal-light/60 text-ivory/80 border border-gold/20 hover:bg-charcoal-light/60"
            >
              {t}
            </Badge>
          ))}
        </div>
        <p className="max-w-3xl mx-auto text-center text-ivory/65 italic text-sm mt-6">
          "Recognition is evidence-based and does not imply ranking, endorsement, or public voting. NESA-Africa does not support, oppose, or campaign for any political party, candidate, or office-holder."
        </p>
      </section>

      {/* ════════════ 4 — SUB-CATEGORIES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle
          kicker="Tracks"
          title="Sub-categories"
          sub="Seven nomination intake tracks. A nominee's role-at-time-of-office is recorded via these tiles, but the achievement being recognised is the personal contribution — not anything tied to that office's ordinary budget or policy output."
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBCATEGORIES.map((c, i) => (
            <Card
              key={c.subcategoryId}
              className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full"
            >
              <CardContent className="p-5 h-full flex flex-col">
                <Badge className="bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15 self-start mb-2">
                  Track {i + 1}
                </Badge>
                <h3 className="font-display text-lg text-ivory font-semibold mb-3 flex-1">
                  {c.title}
                </h3>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-gold/30 text-gold hover:bg-gold/10 self-start"
                >
                  <Link to={`/nominate?subcategory=${c.subcategoryId}`}>
                    Nominate <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ 5 — NOMINATE CTA ════════════ */}
      <section className="px-4 py-12">
        <Card className="max-w-5xl mx-auto bg-gradient-to-br from-gold/10 via-charcoal-light to-charcoal border-gold/30">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl text-ivory font-bold">
                Know a political leader who personally championed education?
              </h3>
              <p className="text-ivory/70 mt-2">
                Nominate a current or former governor, lawmaker, minister, or local government chairman for a personally founded scholarship, school, or education initiative. 2026 nominations are open.
              </p>
            </div>
            <div className="shrink-0">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
                <Link to={PRIMARY_NOMINATE_HREF}>
                  <Award className="mr-2 h-4 w-4" /> Nominate Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ════════════ 6 — TIMELINE ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="2026 Season" title="Platinum recognition timeline" />
        <div className="max-w-4xl mx-auto">
          <Card className="bg-charcoal-light/50 border-gold/15 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-gold/10">
                {TIMELINE_ROWS.map((r) => (
                  <div key={r.step} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                    <div className="text-gold font-semibold text-sm flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" /> {r.step}
                    </div>
                    <div className="text-ivory/90 text-sm">{r.date}</div>
                    <div className="text-ivory/70 text-sm">{r.what}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-ivory/65 italic text-sm mt-4">
            Platinum recipients may later qualify for competitive Blue Garnet recognition.{" "}
            <Link to="/timeline" className="text-gold hover:underline">
              See the full 2026 season calendar →
            </Link>
          </p>
        </div>
      </section>

      {/* ════════════ 7 — NOMINEES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle kicker="Nominees" title="2026 nominees" />
        <div className="max-w-5xl mx-auto text-center mb-6 space-y-4">
          <p className="text-ivory/70 leading-relaxed">
            Nominees are organised by Nigeria's six geopolitical zones plus the Federal Capital Territory. Each entry recognises a specific, personally attributed education contribution — not a state budget or institutional policy.{" "}
            <Link
              to="/nominees?category=political-leaders-education-nigeria"
              className="text-gold hover:underline"
            >
              View all nominees →
            </Link>
          </p>
        </div>

        {/* Non-partisanship banner */}
        <Card className="max-w-5xl mx-auto mb-6 bg-charcoal-light/40 border-gold/30">
          <CardContent className="p-5 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <p className="text-ivory/80 text-sm leading-relaxed">
              NESA-Africa is a non-partisan, non-political platform. This category recognises documented individual education contributions across all parties, zones, and levels of government — current or former. Nominees from every zone and party are equally eligible, and EDI scoring is applied identically regardless of geography or political affiliation. The sitting President and Vice President are not eligible for this category.
            </p>
          </CardContent>
        </Card>

        {/* Zone balance disclosure */}
        <Card className="max-w-5xl mx-auto mb-8 bg-charcoal-light/30 border-gold/15">
          <CardContent className="p-5 flex gap-3">
            <AlertCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <p className="text-ivory/75 text-sm leading-relaxed">
              NESA-Africa actively seeks nominations from all seven zones shown here. Two nominees are currently published, reflecting the order nominations have been sourced and verified — not the educational leadership present in any zone. If your zone shows no nominees yet, this is a sourcing gap, not an assessment of that zone.
            </p>
          </CardContent>
        </Card>

        <div className="max-w-7xl mx-auto">
          {/* Media filter bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MEDIA_FILTERS.map((f) => {
              const active = mediaFilter === f.key;
              const count =
                f.key === "all"
                  ? mediaCounts.all
                  : f.key === "photo"
                    ? mediaCounts.photo
                    : f.key === "video"
                      ? mediaCounts.video
                      : mediaCounts.none;
              return (
                <Button
                  key={f.key}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setMediaFilter(f.key)}
                  className={
                    active
                      ? "bg-gold text-charcoal hover:bg-gold-dark"
                      : "border-gold/30 text-ivory/80 hover:bg-gold/10"
                  }
                >
                  <f.icon className="h-3.5 w-3.5 mr-1.5" /> {f.label}
                  <Badge
                    className={`ml-2 ${active ? "bg-charcoal/20 text-charcoal" : "bg-gold/15 text-gold border-gold/30"} hover:bg-transparent`}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          <Tabs defaultValue="North Central" className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-charcoal-light/60 border border-gold/20 p-1 mb-8 gap-1">
              {ZONES.map((z) => (
                <TabsTrigger
                  key={z}
                  value={z}
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70 text-xs md:text-sm"
                >
                  {z}
                </TabsTrigger>
              ))}
            </TabsList>

            {ZONES.map((z) => {
              const list = filteredByZone[z];
              const totalForZone = NOMINEES.filter((n) => n.zone === z).length;
              return (
                <TabsContent key={z} value={z}>
                  {totalForZone === 0 ? (
                    <Card className="bg-charcoal-light/40 border-gold/20">
                      <CardContent className="p-8 text-center space-y-3">
                        <p className="text-ivory/75">
                          No nominees published yet for this zone.
                        </p>
                        <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark">
                          <Link to={PRIMARY_NOMINATE_HREF}>Nominate a leader →</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : list.length === 0 ? (
                    <Card className="bg-charcoal-light/40 border-gold/20">
                      <CardContent className="p-8 text-center space-y-3">
                        <p className="text-ivory/75">
                          No{" "}
                          {mediaFilter === "video"
                            ? "video"
                            : mediaFilter === "photo"
                              ? "photo"
                              : "media"}{" "}
                          submissions yet for this zone.
                        </p>
                        <Button
                          variant="outline"
                          className="border-gold/40 text-ivory hover:bg-gold/10"
                          onClick={() => setMediaFilter("all")}
                        >
                          Switch to All →
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {list.map((n, i) => (
                        <NomineeCard key={`${z}-${i}`} n={n} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Evidence submission note */}
          <p className="max-w-4xl mx-auto text-ivory/65 italic text-sm mt-8 text-center leading-relaxed">
            Every nominee published on this page carries a verifiable source tying a specific education initiative directly to the individual — a foundation record, programme launch announcement, or independently reported news coverage. State budget allocations and routine policy decisions made in office are not eligible contributions. Each entry is labeled Primary Source or General Reporting to indicate the strength of the underlying evidence.
          </p>
        </div>
      </section>

      {/* ════════════ 8 — RECOGNITION PACKAGE ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="Recognition" title="What recipients receive" />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: FileBadge, t: "Platinum Digital Certificate", d: "Issued via GFA Wallet." },
            { i: Award, t: "Letter of Recognition", d: "From SCEF / NESA-Africa." },
            { i: Tv, t: "Feature spotlight", d: "On NESA TV." },
            {
              i: Building2,
              t: "Database listing",
              d: "Political Leadership for Education database under SCEF.",
            },
          ].map((r) => (
            <Card
              key={r.t}
              className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all"
            >
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center mb-3">
                  <r.i className="h-5 w-5" />
                </div>
                <h4 className="font-display text-ivory font-semibold mb-1">{r.t}</h4>
                <p className="text-ivory/65 text-sm">{r.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ 9 — TRUST & ACCOUNTABILITY ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle kicker="Trust" title="Trust & Accountability" />
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            {
              t: "Independent Governance",
              d: "Awards Council governs all stages.",
              href: "/governance",
              icon: ShieldCheck,
            },
            {
              t: "Sponsors Do Not Influence Results",
              d: "Commercial relationships are firewalled.",
              icon: Award,
            },
            {
              t: "Public Reporting",
              d: "All outcomes published transparently.",
              href: "/impact",
              icon: FileBadge,
            },
          ].map((c) => (
            <Card key={c.t} className="bg-charcoal-light/50 border-gold/15">
              <CardContent className="p-5">
                <c.icon className="h-6 w-6 text-gold mb-3" />
                <h4 className="font-display text-ivory font-semibold mb-1">{c.t}</h4>
                <p className="text-ivory/65 text-sm mb-3">{c.d}</p>
                {c.href && (
                  <Link to={c.href} className="text-gold text-sm hover:underline">
                    Learn more →
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ 10 — FAQ ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="FAQ" title="Frequently asked questions" />
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`f-${i}`}
                className="border border-gold/15 rounded-lg bg-charcoal-light/40 px-4"
              >
                <AccordionTrigger className="text-ivory hover:text-gold text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-ivory/70 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-center text-ivory/65 italic text-sm mt-6">
            These relate to the overall NESA-Africa award structure rather than this category specifically.{" "}
            <Link to="/faq" className="text-gold hover:underline">
              See the full FAQ →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
