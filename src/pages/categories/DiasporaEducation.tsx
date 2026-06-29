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
  Users,
  Image as ImageIcon,
  Video as VideoIcon,
  ImageOff,
  Play,
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CategorySubcategoriesPanel } from "@/components/awards/CategorySubcategoriesPanel";
import {
  NOMINEES_BY_REGION,
  SUBCATEGORIES,
  WHO_QUALIFIES,
  THRESHOLD_ROWS,
  TIMELINE_ROWS,
  FAQS_SPECIFIC,
  DIASPORA_REGIONS,
  PRIMARY_NOMINATE_HREF,
  type DiasporaNominee,
  type DiasporaRegion,
  type MediaType,
} from "./diasporaData";

const CANONICAL = "https://nesa.africa/categories/diaspora-education-impact";

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

const MEDIA_FILTERS: Array<{ key: "all" | MediaType; label: string; icon: React.ElementType }> = [
  { key: "all", label: "All", icon: Globe2 },
  { key: "photo", label: "Has Photo", icon: ImageIcon },
  { key: "video", label: "Has Video", icon: VideoIcon },
  { key: "none", label: "No Media Yet", icon: ImageOff },
];

const NomineeMediaThumb = ({
  n,
  onOpen,
}: {
  n: DiasporaNominee;
  onOpen: () => void;
}) => {
  const consented = n.media_consent === "confirmed";

  if (n.media_type === "photo" && consented && n.media_url) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="relative aspect-square w-full rounded-lg overflow-hidden bg-charcoal/60 border border-gold/15 group/thumb"
      >
        <img
          src={n.media_url}
          alt={`${n.role} — ${n.org}`}
          className="w-full h-full object-cover transition-transform group-hover/thumb:scale-105"
          loading="lazy"
        />
        <Badge className="absolute top-2 right-2 bg-charcoal/80 text-gold border border-gold/30 hover:bg-charcoal/80">
          <ImageIcon className="h-3 w-3 mr-1" /> Photo
        </Badge>
      </button>
    );
  }

  if (n.media_type === "video" && consented && n.media_url) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="relative aspect-square w-full rounded-lg overflow-hidden bg-charcoal/60 border border-gold/15 group/thumb"
      >
        <video
          src={n.media_url}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30">
          <div className="h-12 w-12 rounded-full bg-gold/90 text-charcoal flex items-center justify-center">
            <Play className="h-5 w-5 ml-0.5" />
          </div>
        </div>
        <Badge className="absolute top-2 right-2 bg-charcoal/80 text-gold border border-gold/30 hover:bg-charcoal/80">
          <VideoIcon className="h-3 w-3 mr-1" /> Video
        </Badge>
        {n.duration && (
          <span className="absolute bottom-2 right-2 text-[11px] px-1.5 py-0.5 rounded bg-charcoal/80 text-ivory">
            {n.duration}
          </span>
        )}
      </button>
    );
  }

  // Variant C — neutral placeholder
  return (
    <div className="aspect-square w-full rounded-lg bg-charcoal/60 border border-gold/15 flex items-center justify-center">
      <Building2 className="h-10 w-10 text-gold/50" />
    </div>
  );
};

const NomineeCard = ({
  n,
  onOpenMedia,
}: {
  n: DiasporaNominee;
  onOpenMedia: (n: DiasporaNominee) => void;
}) => (
  <Card className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full">
    <CardContent className="p-5 space-y-3 h-full flex flex-col">
      <NomineeMediaThumb n={n} onOpen={() => onOpenMedia(n)} />
      <div>
        <h4 className="font-semibold text-ivory text-base leading-snug">{n.role}</h4>
        <p className="text-ivory/70 text-sm mt-1">{n.org}</p>
      </div>
      <p className="text-ivory/65 text-sm leading-relaxed flex-1">{n.impact}</p>
      <div className="pt-2 border-t border-gold/10">
        {n.identity_status === "confirmed" ? (
          <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/15">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Identity Confirmed
          </Badge>
        ) : (
          <Badge className="bg-amber-500/15 text-amber-300 border border-amber-400/30 hover:bg-amber-500/15">
            <ShieldCheck className="w-3 h-3 mr-1" /> Awaiting Consent
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

// Media-type sort weight: photo → video → none
const MEDIA_ORDER: Record<MediaType, number> = { photo: 0, video: 1, none: 2 };

export default function DiasporaEducationPage() {
  const [mediaFilter, setMediaFilter] = useState<"all" | MediaType>("all");
  const [openMedia, setOpenMedia] = useState<DiasporaNominee | null>(null);

  // Filter + sort each region
  const filteredByRegion = useMemo(() => {
    const out = {} as Record<DiasporaRegion, DiasporaNominee[]>;
    for (const r of DIASPORA_REGIONS) {
      const list = NOMINEES_BY_REGION[r] ?? [];
      const filtered =
        mediaFilter === "all"
          ? list
          : list.filter((n) => n.media_type === mediaFilter);
      out[r] = [...filtered].sort(
        (a, b) => MEDIA_ORDER[a.media_type] - MEDIA_ORDER[b.media_type],
      );
    }
    return out;
  }, [mediaFilter]);

  // Live counts across all regions for the media filter bar
  const mediaCounts = useMemo(() => {
    let photo = 0, video = 0, none = 0;
    for (const r of DIASPORA_REGIONS) {
      for (const n of NOMINEES_BY_REGION[r] ?? []) {
        if (n.media_type === "photo") photo++;
        else if (n.media_type === "video") video++;
        else none++;
      }
    }
    return { all: photo + video + none, photo, video, none };
  }, []);

  return (
    <div className="bg-charcoal text-ivory">
      <Helmet>
        <title>Diaspora Education Impact 2026 | NESA-Africa</title>
        <meta
          name="description"
          content="Platinum recognition for diaspora associations, individuals, professional networks, and innovators bridging learning gaps across Africa. 2026 nominations open."
        />
        <link rel="canonical" href={CANONICAL} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: "Diaspora Education Impact", path: "/categories/diaspora-education-impact" },
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
            Diaspora Education <span className="text-gold">Impact</span>
          </h1>
          <p className="mt-5 text-ivory/70 text-base md:text-xl leading-relaxed max-w-3xl mx-auto">
            From scholarship funds to school construction and mentorship pipelines, African diaspora associations and individuals across the globe are channelling remittances, expertise, and love into education back home.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
              <Link to={PRIMARY_NOMINATE_HREF}>
                <Award className="mr-2 h-4 w-4" /> Nominate Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10">
              <Link to="/nominees?category=diaspora-education-impact">
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
          <SectionTitle kicker="Overview" title="A continental bridge for education" />
          <p className="text-ivory/75 leading-relaxed">
            Across continents, millions of Africans abroad are rewriting the story of education at home — sending resources, technology, mentorship, and hope across borders.
          </p>
          <p className="text-ivory/75 leading-relaxed">
            The African Diaspora Education Impact & Partnership Recognition celebrates diaspora associations, professional networks, philanthropic individuals, and technical experts whose sustained contributions — in cash, kind, or expertise — are bridging learning gaps across Africa. It operates under the Platinum Certificate of Recognition Awards: a non-competitive honour bestowed after documentation and validation, aligned with SDG 4, SDG 17, and Africa Agenda 2063 Goal 1.
          </p>
          <p className="text-ivory/75 leading-relaxed">
            Diaspora communities contribute over $95 billion annually in remittances, yet less than 5% reaches structured education programs. This recognition builds visibility and credibility for the efforts that do.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["SDG 4", "SDG 5", "SDG 17", "Agenda 2063 Goal 1"].map((p) => (
              <Badge key={p} className="bg-charcoal-light/60 text-ivory/80 border border-gold/20 hover:bg-charcoal-light/60">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 3 — WHO QUALIFIES + THRESHOLD ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="Eligibility" title="Who qualifies & how nominees are verified" />
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
                <FileBadge className="h-5 w-5 text-gold" /> Recognition threshold
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gold/80 border-b border-gold/20">
                      <th className="py-2 pr-2 font-semibold">Criterion</th>
                      <th className="py-2 font-semibold">Threshold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {THRESHOLD_ROWS.map((r) => (
                      <tr key={r.criterion}>
                        <td className="py-2 pr-2 text-ivory/90 font-medium">{r.criterion}</td>
                        <td className="py-2 text-ivory/70">{r.threshold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ════════════ 4 — SUB-CATEGORIES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle
          kicker="Tracks"
          title="Sub-categories"
          sub="Six recognition tracks aligned with the 2026 Diaspora Education Impact pathway."
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBCATEGORIES.map((c) => (
            <Card key={c.slug} className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full">
              <CardContent className="p-5 h-full flex flex-col">
                <Badge className="bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15 self-start mb-2">
                  Track {c.track}
                </Badge>
                <h3 className="font-display text-lg text-ivory font-semibold mb-2">{c.title}</h3>
                <p className="text-ivory/70 text-sm leading-relaxed flex-1">{c.desc}</p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-4 border-gold/30 text-gold hover:bg-gold/10 self-start"
                >
                  <Link to={`/nominate?subcategory=${c.slug}`}>
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
                Know someone making a difference?
              </h3>
              <p className="text-ivory/70 mt-2">
                Nominate a diaspora champion, association, or innovator for Platinum recognition. 2026 nominations are open.
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
            One Continent, Eight Regions. Discover the education champions, cultural heritage, and edu-tourism opportunities across Africa's diverse regions. Each region connects to the 2026–2027 NESA-Africa Legacy Impact pathway — EduAid-Africa Edu-Tourism Conferences, Special Needs School nominations, regional voting, GFA Wallet regional wallets, and Rebuild My School Africa interventions.{" "}
            <Link to="/continental-impact" className="text-gold hover:underline">
              Explore the full Continental Impact Ecosystem →
            </Link>
          </p>
          <p className="text-ivory/65 text-sm leading-relaxed">
            Nominees are organised by region. Where available, photos and videos showcase the projects and people behind each nomination — names remain private until consent is confirmed, even where supporting media has already been shared.{" "}
            <Link to="/nominees?category=diaspora-education-impact" className="text-gold hover:underline">
              View all 100 nominees →
            </Link>
          </p>
        </div>

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

          <Tabs defaultValue="North Africa" className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-charcoal-light/60 border border-gold/20 p-1 mb-8 gap-1">
              {DIASPORA_REGIONS.map((r) => (
                <TabsTrigger
                  key={r}
                  value={r}
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70 text-xs md:text-sm"
                >
                  {r}
                </TabsTrigger>
              ))}
            </TabsList>

            {DIASPORA_REGIONS.map((r) => {
              const list = filteredByRegion[r];
              const totalForRegion = NOMINEES_BY_REGION[r]?.length ?? 0;
              return (
                <TabsContent key={r} value={r}>
                  {totalForRegion === 0 ? (
                    <Card className="bg-charcoal-light/40 border-gold/20">
                      <CardContent className="p-8 text-center space-y-3">
                        <p className="text-ivory/75">
                          Nominations for this region open soon.
                        </p>
                        <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark">
                          <Link to={PRIMARY_NOMINATE_HREF}>
                            Nominate the first champion
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : list.length === 0 ? (
                    <Card className="bg-charcoal-light/40 border-gold/20">
                      <CardContent className="p-8 text-center space-y-3">
                        <p className="text-ivory/75">
                          No {mediaFilter === "video" ? "video" : mediaFilter === "photo" ? "photo" : "media"} submissions yet for this region.
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
                        <NomineeCard key={`${r}-${i}`} n={n} onOpenMedia={setOpenMedia} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Media submission CTA */}
          <Card className="mt-10 bg-gradient-to-br from-gold/10 via-charcoal-light to-charcoal border-gold/30">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
              <div>
                <h3 className="font-display text-xl md:text-2xl text-ivory font-bold">
                  Add a photo or video to your nomination
                </h3>
                <p className="text-ivory/70 mt-2 text-sm">
                  Organisations may submit supporting visuals — project photos, classroom footage, or a short video — even before individual consent is finalised.
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
            { i: Building2, t: "DEP database listing", d: "Diaspora Education Partners." },
          ].map((r) => (
            <Card key={r.t} className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all">
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
            { t: "Independent Governance", d: "Awards Council governs all stages.", href: "/governance", icon: ShieldCheck },
            { t: "Sponsors Do Not Influence Results", d: "Commercial relationships are firewalled.", icon: Award },
            { t: "Public Reporting", d: "All outcomes published transparently.", href: "/impact", icon: FileBadge },
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
            {FAQS_SPECIFIC.map((f, i) => (
              <AccordionItem
                key={i}
                value={`f-${i}`}
                className="border border-gold/15 rounded-lg bg-charcoal-light/40 px-4"
              >
                <AccordionTrigger className="text-ivory hover:text-gold text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-ivory/70 leading-relaxed">{f.a}</AccordionContent>
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

      {/* Media lightbox */}
      <Dialog open={!!openMedia} onOpenChange={(o) => !o && setOpenMedia(null)}>
        <DialogContent className="max-w-3xl bg-charcoal border-gold/30">
          <DialogTitle className="text-ivory font-display">
            {openMedia?.role}
          </DialogTitle>
          <DialogDescription className="text-ivory/65">
            {openMedia?.org}
          </DialogDescription>
          {openMedia?.media_type === "photo" && openMedia.media_url && (
            <img
              src={openMedia.media_url}
              alt={`${openMedia.role} — ${openMedia.org}`}
              className="w-full rounded-lg"
            />
          )}
          {openMedia?.media_type === "video" && openMedia.media_url && (
            <video
              src={openMedia.media_url}
              controls
              autoPlay
              muted
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      <CategorySubcategoriesPanel
        formSlug="excellence-in-diaspora-educational-impact-international"
        categoryTitle="Diaspora Education Impact"
      />
    </div>
  );
}
