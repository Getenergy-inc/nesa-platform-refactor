import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Award,
  FileBadge,
  Calendar,
  Building2,
  Tv,
  Mail,
  ArrowRight,
  AlertCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  ImageOff,
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
import {
  INTL_SUBCATEGORIES,
  EDI_ROWS,
  TIMELINE_ROWS,
  WHO_QUALIFIES,
  FAQS_SPECIFIC,
  PRIMARY_NOMINATE_HREF,
  type IntlNominee,
  type MediaType,
} from "./internationalEducationData";

const CANONICAL = "https://nesa.africa/categories/international-bilateral-education";

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

const NomineeCard = ({ n }: { n: IntlNominee }) => {
  const documented = n.verification_status === "documented";
  return (
    <Card className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full">
      <CardContent className="p-5 space-y-3 h-full flex flex-col">
        {/* Media placeholder — institutional icon variant */}
        <div className="aspect-[16/9] rounded-lg bg-charcoal/60 border border-gold/10 flex items-center justify-center">
          {n.media_type === "photo" ? (
            <ImageIcon className="h-8 w-8 text-gold/60" />
          ) : n.media_type === "video" ? (
            <VideoIcon className="h-8 w-8 text-gold/60" />
          ) : (
            <Building2 className="h-8 w-8 text-gold/50" />
          )}
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {documented ? (
            <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/15">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Documented
            </Badge>
          ) : (
            <Badge className="bg-amber-500/15 text-amber-300 border border-amber-400/30 hover:bg-amber-500/15">
              <AlertCircle className="w-3 h-3 mr-1" /> Pending Verification
            </Badge>
          )}
          {typeof n.edi_score === "number" && (
            <Badge className="bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15">
              EDI {n.edi_score}/100
            </Badge>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-ivory text-base leading-snug">{n.name}</h4>
          <p className="text-ivory/70 text-sm mt-1">{n.initiative}</p>
        </div>
        {n.focus && <p className="text-ivory/65 text-sm leading-relaxed">{n.focus}</p>}
        {n.impact && (
          <p className="text-[12px] text-ivory/55 pt-2 border-t border-gold/10 mt-auto">
            <span className="text-gold/80">Impact:</span> {n.impact}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

type MediaFilter = "all" | "photo" | "video" | "none";

const MEDIA_FILTERS: Array<{ key: MediaFilter; label: string; icon: React.ElementType }> = [
  { key: "all", label: "All", icon: Globe2 },
  { key: "photo", label: "Has Photo", icon: ImageIcon },
  { key: "video", label: "Has Video", icon: VideoIcon },
  { key: "none", label: "No Media Yet", icon: ImageOff },
];

export default function InternationalEducationPage() {
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");

  const filteredTabs = useMemo(() => {
    return INTL_SUBCATEGORIES.map((sub) => ({
      ...sub,
      filtered:
        mediaFilter === "all"
          ? sub.nominees
          : sub.nominees.filter((n) => n.media_type === (mediaFilter as MediaType)),
    }));
  }, [mediaFilter]);

  return (
    <div className="bg-charcoal text-ivory">
      <Helmet>
        <title>International Partnership for Education (Africa) 2026 | NESA-Africa</title>
        <meta
          name="description"
          content="Recognising embassies, bilateral agencies, multilateral institutions, UN bodies, foundations, corporations and international NGOs advancing education across Africa. 2026 Platinum nominations open."
        />
        <link rel="canonical" href={CANONICAL} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          {
            name: "International Partnership for Education (Africa)",
            path: "/categories/international-bilateral-education",
          },
        ]}
      />

      {/* ════════════ SECTION 1 — HERO ════════════ */}
      <section className="relative overflow-hidden border-b border-gold/10 px-4 py-16 md:py-24">
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" aria-hidden />
        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/15 mb-5">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 2026 Nominations Open
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Excellence in International{" "}
            <span className="text-gold">Partnership for Education</span> (Africa)
          </h1>
          <p className="mt-5 text-ivory/70 text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
            Celebrating international partners advancing education across Africa.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
              <Link to={PRIMARY_NOMINATE_HREF}>
                <Award className="mr-2 h-4 w-4" /> Nominate Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-ivory hover:bg-gold/10"
            >
              <Link to="/nominees?category=international-bilateral-education">
                Explore Nominees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-ivory hover:bg-gold/10"
            >
              <Link to="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════ SECTION 2 — OVERVIEW ════════════ */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-5">
          <SectionTitle kicker="Overview" title="Continental partnership for African education" />
          <p className="text-ivory/75 leading-relaxed">
            Africa's education systems are strengthened daily by partners beyond its borders — embassies,
            development agencies, multilateral institutions, and global corporations investing in
            classrooms, teachers, and learners across the continent.
          </p>
          <p className="text-ivory/75 leading-relaxed">
            Excellence in International Partnership for Education (Africa) recognises embassies, bilateral
            aid agencies, multilateral and international NGOs, global grant foundations, multinational
            corporations, UN agencies, and international NGOs whose sustained programmes advance education
            outcomes continent-wide. Institutional recognition is evaluated under governance and leadership
            criteria, aligned with SDG 4, SDG 17, and Africa Agenda 2063 Goal 1.
          </p>
          <p className="text-ivory/75 leading-relaxed">
            This recognition is continental in scope: a partner's contribution is assessed by its impact
            across Africa as a whole, not by region of origin or delivery.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["SDG 4", "SDG 5", "SDG 17", "Agenda 2063 Goal 1"].map((p) => (
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

      {/* ════════════ SECTION 3 — WHO QUALIFIES + EDI SCORING ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="Eligibility & Scoring" title="Who qualifies & how nominees are scored" />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          <Card className="bg-charcoal-light/50 border-gold/15">
            <CardContent className="p-6">
              <h3 className="font-display text-lg text-ivory font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gold" /> Who qualifies
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
                <FileBadge className="h-5 w-5 text-gold" /> EDI Matrix
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
                        <td className="py-2 pr-2 text-ivory/90 font-medium">{r.area}</td>
                        <td className="py-2 pr-2 text-gold">{r.score}</td>
                        <td className="py-2 text-ivory/70">{r.measured}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Threshold strip */}
        <div className="max-w-6xl mx-auto mt-6 flex flex-wrap gap-2 justify-center">
          {[
            "90–100 Platinum Recognition of Distinction",
            "80–89 Platinum Recognition",
            "70–79 Platinum Watchlist",
            "Below 70 Not Yet Published",
          ].map((b) => (
            <Badge
              key={b}
              className="bg-gold/10 text-gold border border-gold/30 hover:bg-gold/10 px-3 py-1.5"
            >
              {b}
            </Badge>
          ))}
        </div>
        <p className="text-center text-ivory/60 italic text-sm mt-4 max-w-3xl mx-auto">
          Recognition is evidence-based and does not imply ranking, endorsement, or public voting.
        </p>
      </section>

      {/* ════════════ SECTION 4 — SUB-CATEGORIES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle
          kicker="Tracks"
          title="Sub-categories"
          sub="Seven partner-type tracks recognising international institutions supporting education across Africa."
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTL_SUBCATEGORIES.map((c, i) => (
            <Card
              key={c.key}
              className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full"
            >
              <CardContent className="p-5 h-full flex flex-col">
                <Badge className="bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15 self-start mb-2">
                  Track {i + 1}
                </Badge>
                <h3 className="font-display text-lg text-ivory font-semibold mb-2">{c.title}</h3>
                <p className="text-ivory/70 text-sm leading-relaxed flex-1">{c.desc}</p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-4 border-gold/30 text-gold hover:bg-gold/10 self-start"
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

      {/* ════════════ SECTION 5 — NOMINATE CTA ════════════ */}
      <section className="px-4 py-12">
        <Card className="max-w-5xl mx-auto bg-gradient-to-br from-gold/10 via-charcoal-light to-charcoal border-gold/30">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl text-ivory font-bold">
                Know an international partner making a difference?
              </h3>
              <p className="text-ivory/70 mt-2">
                Nominate an embassy, agency, foundation, corporation, or NGO for Platinum recognition.
                2026 nominations are open.
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

      {/* ════════════ SECTION 6 — TIMELINE ════════════ */}
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

      {/* ════════════ SECTION 7 — NOMINEES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle
          kicker="Nominees"
          title="2026 nominees"
          sub="Nominees are organised by partner type — embassies, agencies, foundations, corporations, UN bodies, and NGOs — reflecting programmes delivered across Africa as a whole. Each entry below is drawn from a documented, publicly cited source and scored against the EDI Matrix."
        />
        <div className="max-w-6xl mx-auto text-center mb-8">
          <Link
            to="/nominees?category=international-bilateral-education"
            className="text-gold hover:underline text-sm"
          >
            View all nominees →
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Media filter bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MEDIA_FILTERS.map((f) => {
              const active = mediaFilter === f.key;
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
                  <f.icon className="h-3.5 w-3.5 mr-1.5" />
                  {f.label}
                </Button>
              );
            })}
          </div>

          <Tabs defaultValue={INTL_SUBCATEGORIES[0].key} className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-charcoal-light/60 border border-gold/20 p-1 mb-8 gap-1">
              {INTL_SUBCATEGORIES.map((s) => (
                <TabsTrigger
                  key={s.key}
                  value={s.key}
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70 text-xs md:text-sm"
                >
                  {s.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {filteredTabs.map((s) => (
              <TabsContent key={s.key} value={s.key}>
                {s.filtered.length === 0 ? (
                  <Card className="bg-charcoal-light/40 border-gold/15">
                    <CardContent className="p-8 text-center text-ivory/60 text-sm">
                      No nominees in this tab match the current media filter.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {s.filtered.map((n, i) => (
                      <NomineeCard key={`${s.key}-${i}`} n={n} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Media submission CTA */}
          <Card className="bg-gradient-to-br from-gold/10 via-charcoal-light to-charcoal border-gold/30 mt-10">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
              <div>
                <h3 className="font-display text-xl md:text-2xl text-ivory font-bold">
                  Add a photo or video to a partner nomination
                </h3>
                <p className="text-ivory/70 mt-2 text-sm">
                  Embassies, agencies, and organisations may submit supporting visuals — programme
                  photos, MoU signing footage, or a short video.
                </p>
              </div>
              <div className="shrink-0">
                <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
                  <a href="mailto:info@nesa.africa">
                    <Mail className="mr-2 h-4 w-4" /> Submit Media
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-ivory/65 italic text-sm mt-4 max-w-4xl mx-auto text-center">
            To move a nominee from Pending Verification to Documented, submit at least 3 of: an official
            programme page or annual report, government/school partner confirmation, beneficiary numbers,
            photos/video of delivery, a signed MoU, a beneficiary testimonial, independent media coverage,
            or evidence of continuity beyond a one-off donation.
          </p>
        </div>
      </section>

      {/* ════════════ SECTION 8 — RECOGNITION PACKAGE ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="Recognition" title="What recipients receive" />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { i: FileBadge, t: "Platinum Digital Certificate", d: "Issued via GFA Wallet." },
            { i: Award, t: "Letter of Recognition", d: "From SCEF / NESA-Africa." },
            { i: Tv, t: "Feature spotlight on NESA TV", d: "Programme story shared on the broadcast channel." },
            {
              i: Building2,
              t: "International Education Partners (IEP) listing",
              d: "Inclusion in the IEP database under SCEF.",
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

      {/* ════════════ SECTION 9 — TRUST & ACCOUNTABILITY ════════════ */}
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

      {/* ════════════ SECTION 10 — FAQ ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="FAQ" title="Frequently asked questions" />
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS_SPECIFIC.map((f, i) => (
              <AccordionItem
                key={i}
                value={`f-${i}`}
                className="border border-gold/15 rounded-lg bg-charcoal-light/40 px-4"
              >
                <AccordionTrigger className="text-ivory hover:text-gold text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-ivory/70 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-center text-ivory/65 italic text-sm mt-6">
            The remaining platform-wide questions relate to the overall NESA-Africa award structure rather
            than this category specifically.{" "}
            <Link to="/faq" className="text-gold hover:underline">
              See the full FAQ →
            </Link>
          </p>
        </div>
      </section>

      {/* ════════════ SECTION 11 — EXPLORE NOMINEES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle kicker="Explore" title="Explore Existing Nominees" />
        <div className="max-w-3xl mx-auto text-center">
          <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
            <Link to="/nominees">
              See All Nominees <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <CategorySubcategoriesPanel
        formSlug="excellence-in-international-partnership-for-education-africa"
        categoryTitle="International & Bilateral Education Partnership"
      />
    </div>
  );
}
