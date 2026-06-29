// Shared page component for faith-based Africa Regional category pages.
// Renders the 11-section structure described in the 2026 refactor brief:
// Hero · Overview · Who Qualifies + EDI · Subcategories · Nominate CTA ·
// Timeline · Nominees (4 tabs × 30) with profile-state system · Recognition ·
// Trust links · FAQ · Hall-of-Fame link.
//
// Uses ONLY existing design tokens (charcoal / gold / ivory) and shadcn
// primitives — no custom CSS, no new component archetypes.

import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowRight, Award, Building2, Calendar, CheckCircle2,
  FileText, Mail, MapPin, ShieldCheck, Sparkles, Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CategorySubcategoriesPanel } from "@/components/awards/CategorySubcategoriesPanel";

import type {
  FaithCategoryConfig, FaithNominee, FaithSubcategory,
  NomineeWorkflowState,
} from "./faithCategoryTypes";
import { useFaithSubcategoryUuids } from "@/hooks/useFaithSubcategoryUuids";
import { logLockedNominateAttempt } from "./logLockedNominateAttempt";
import { toast } from "@/hooks/use-toast";

type EnrichedNominee = FaithNominee & {
  status: NomineeWorkflowState;
  mediaType: "photo" | "video" | "none";
};

function enrich(items: FaithNominee[]): EnrichedNominee[] {
  // All 120 entries launch in pending_verification with no media (per spec
  // section 7.1: NESA-Africa never pre-fills logos, media, years, beneficiaries).
  return items.map((n) => ({ ...n, status: "pending_verification", mediaType: "none" }));
}

function statusBadge(status: NomineeWorkflowState) {
  if (status === "profile_complete") {
    return { label: "Platinum Recognized", className: "bg-gold/15 text-gold border-gold/30" };
  }
  if (status === "accepted") {
    return { label: "Accepted — Profile Pending", className: "bg-ivory/10 text-ivory/80 border-ivory/20" };
  }
  return { label: "Pending Verification", className: "bg-charcoal text-ivory/60 border-ivory/15" };
}

function NomineeCard({ n }: { n: EnrichedNominee }) {
  const badge = statusBadge(n.status);
  return (
    <Card className="bg-charcoal-light/50 border-gold/10 hover:border-gold/30 transition-colors h-full">
      <CardContent className="p-4 flex flex-col gap-3 h-full">
        {/* Top zone — identity (logo zone, generic placeholder while pending) */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-md bg-charcoal flex-shrink-0 flex items-center justify-center border border-gold/15">
            <Building2 className="w-5 h-5 text-gold/40" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-ivory text-sm font-semibold leading-snug">
              {n.name}
            </h4>
            <Badge variant="outline" className={`mt-1 text-[10px] ${badge.className}`}>
              {badge.label}
            </Badge>
          </div>
        </div>

        {/* Generic description (work_description_source: generic) */}
        <p className="text-ivory/55 text-xs leading-relaxed flex-1">
          {n.desc}
        </p>

        {/* Body zone — media (Variant C: neutral placeholder while no media) */}
        <div className="aspect-[16/9] rounded-md bg-charcoal border border-gold/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-ivory/25" aria-hidden />
        </div>

        {/* Org-level contact only */}
        <a
          href={`mailto:${n.email}`}
          className="flex items-center gap-1.5 text-gold/70 hover:text-gold text-xs truncate"
        >
          <Mail className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{n.email}</span>
        </a>

        {n.status === "accepted" && (
          <p className="text-[11px] italic text-ivory/50">
            This organisation has been accepted for recognition. Their full profile is being prepared.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SectionHeading({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <div className="mb-8 text-center md:text-left max-w-3xl">
      {eyebrow && (
        <p className="text-gold/70 text-xs font-semibold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-ivory text-2xl md:text-3xl font-bold mb-2">{title}</h2>
      {lead && <p className="text-ivory/60 text-sm md:text-base">{lead}</p>}
    </div>
  );
}

export function FaithCategoryPage({ config }: { config: FaithCategoryConfig }) {
  const tabsData = useMemo(
    () => ({
      infrastructure: enrich(config.tabs.infrastructure),
      scholarship: enrich(config.tabs.scholarship),
      holistic: enrich(config.tabs.holistic),
      advocacy: enrich(config.tabs.advocacy),
    }),
    [config],
  );

  // Resolve live UUIDs for any subcategory that ships with a `slug`. This lets
  // tiles whose static UUID is null (e.g. Christian Advocacy & Awareness) auto-
  // enable once the backend row exists — no redeploy required.
  const slugs = useMemo(
    () => config.subcategories.map((s) => s.slug).filter((x): x is string => !!x),
    [config],
  );
  const { uuidBySlug } = useFaithSubcategoryUuids(slugs);

  const resolvedSubcategories = useMemo<FaithSubcategory[]>(
    () =>
      config.subcategories.map((s) => ({
        ...s,
        uuid: s.uuid ?? (s.slug ? uuidBySlug[s.slug] ?? null : null),
      })),
    [config, uuidBySlug],
  );

  const [mediaFilter, setMediaFilter] = useState<"all" | "photo" | "video" | "none">("all");
  const applyFilter = (items: EnrichedNominee[]) =>
    mediaFilter === "all" ? items : items.filter((i) => i.mediaType === mediaFilter);

  const totalNominees =
    tabsData.infrastructure.length + tabsData.scholarship.length +
    tabsData.holistic.length + tabsData.advocacy.length;

  const counts = {
    all: totalNominees,
    photo: 0, // no media pre-published per spec
    video: 0,
    none: totalNominees,
  };

  const subByTab: Record<string, FaithSubcategory | undefined> = {
    infrastructure: resolvedSubcategories.find((s) => s.tabKey === "infrastructure"),
    scholarship: resolvedSubcategories.find((s) => s.tabKey === "scholarship"),
    holistic: resolvedSubcategories.find((s) => s.tabKey === "holistic"),
    advocacy: resolvedSubcategories.find((s) => s.tabKey === "advocacy"),
  };

  return (
    <>
      <Helmet>
        <title>{`${config.pageTitle} | NESA-Africa 2026`}</title>
        <meta name="description" content={config.pageSubheading} />
        <link rel="canonical" href={`https://nesa.africa${config.routePath}`} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          { name: config.pageTitle, path: config.routePath },
        ]}
      />

      <div className="bg-charcoal min-h-screen pb-16">
        {/* 1. HERO */}
        <section className="relative border-b border-gold/10 bg-gradient-to-b from-charcoal-light/40 to-charcoal py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <Badge className="bg-gold/15 text-gold border-gold/30 mb-4">
              2026 Nominations Open
            </Badge>
            <h1 className="font-display text-ivory text-3xl md:text-5xl font-bold mb-3">
              {config.pageTitle}
            </h1>
            <p className="text-ivory/70 text-base md:text-lg max-w-2xl mx-auto mb-6">
              {config.pageSubheading}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to={`/nominate?subcategory=${config.primaryNominateUuid}`}>
                  Nominate Now <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                <Link to={`/nominees?category=${encodeURIComponent(config.pageTitle)}`}>
                  Explore Nominees
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-ivory/70 hover:text-gold">
                <Link to="/categories">View All Categories</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 2. OVERVIEW */}
        <section className="container mx-auto px-4 max-w-4xl py-12">
          <SectionHeading eyebrow="About this category" title="Overview" />
          <div className="space-y-4 text-ivory/75 text-sm md:text-base leading-relaxed">
            {config.overviewParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {["SDG 4", "SDG 5", "SDG 17", "Agenda 2063 Goal 1"].map((s) => (
              <Badge key={s} variant="outline" className="border-gold/30 text-gold/80">
                {s}
              </Badge>
            ))}
          </div>
        </section>

        {/* 3. WHO QUALIFIES + EDI */}
        <section className="container mx-auto px-4 max-w-6xl py-12 border-t border-gold/10">
          <SectionHeading
            eyebrow="Standards"
            title="Who qualifies & how nominees are scored"
            lead="Recognition is evidence-based and does not imply ranking, endorsement, or public voting."
          />
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-charcoal-light/40 border-gold/15">
              <CardContent className="p-5">
                <h3 className="font-display text-gold text-base font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Who qualifies
                </h3>
                <ul className="space-y-2">
                  {config.whoQualifies.map((q) => (
                    <li key={q} className="flex gap-2 text-ivory/75 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-gold/60 flex-shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-charcoal-light/40 border-gold/15">
              <CardContent className="p-5">
                <h3 className="font-display text-gold text-base font-semibold mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> EDI Matrix scoring
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-ivory/50 border-b border-gold/15">
                        <th className="text-left py-2 pr-2 font-medium">Area</th>
                        <th className="text-right py-2 px-2 font-medium">Score</th>
                        <th className="text-left py-2 pl-2 font-medium">What's measured</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.ediTable.map((row) => (
                        <tr key={row.area} className="border-b border-gold/5">
                          <td className="py-2 pr-2 text-ivory/80 font-medium">{row.area}</td>
                          <td className="py-2 px-2 text-gold text-right">{row.score}</td>
                          <td className="py-2 pl-2 text-ivory/60">{row.what}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {[
                    "90–100 Recognition of Distinction",
                    "80–89 Platinum Recognition",
                    "70–79 Platinum Watchlist",
                    "Below 70 Not Yet Published",
                  ].map((t) => (
                    <Badge key={t} variant="outline" className="border-gold/20 text-ivory/60 text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. SUBCATEGORIES */}
        <section className="container mx-auto px-4 max-w-6xl py-12 border-t border-gold/10">
          <SectionHeading eyebrow="Tracks" title="Sub-categories" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resolvedSubcategories.map((s) => {
              const open = !!s.uuid;
              return (
                <Card key={s.title} className="bg-charcoal-light/40 border-gold/15 hover:border-gold/40 transition-colors">
                  <CardContent className="p-4 flex flex-col h-full gap-3">
                    <Award className="w-5 h-5 text-gold" />
                    <h3 className="font-display text-ivory text-sm font-semibold leading-snug">{s.title}</h3>
                    <p className="text-ivory/55 text-xs leading-relaxed flex-1">{s.description}</p>
                    {open ? (
                      <Button asChild size="sm" className="bg-gold/15 text-gold hover:bg-gold/25 border border-gold/30">
                        <Link to={`/nominate?subcategory=${s.uuid}`}>Nominate</Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        type="button"
                        aria-disabled="true"
                        onClick={() => {
                          void logLockedNominateAttempt({
                            faith: config.faith,
                            tabKey: s.tabKey,
                            slug: s.slug ?? null,
                            tileTitle: s.title,
                            routePath: config.routePath,
                          });
                          toast({
                            title: "Nominations opening soon",
                            description:
                              "This recognition track will accept nominations as soon as the backend listing is published. We've logged your interest.",
                          });
                        }}
                        className="bg-charcoal text-ivory/40 border border-gold/15 hover:bg-charcoal hover:text-ivory/60"
                      >
                        Nominations opening soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 5. NOMINATE CTA */}
        <section className="container mx-auto px-4 max-w-4xl py-12">
          <Card className="bg-gradient-to-br from-gold/10 to-charcoal-light/40 border-gold/30">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-6 h-6 text-gold mx-auto mb-3" />
              <h3 className="font-display text-ivory text-xl md:text-2xl font-bold mb-2">
                {config.faith === "islamic"
                  ? "Know an Islamic education institution making a difference?"
                  : "Know a Christian education institution making a difference?"}
              </h3>
              <p className="text-ivory/70 text-sm md:text-base mb-5 max-w-xl mx-auto">
                Nominate a school, scholarship programme, or advocacy organisation for Platinum recognition. 2026 nominations are open.
              </p>
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to={`/nominate?subcategory=${config.primaryNominateUuid}`}>
                  Nominate Now <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* 6. TIMELINE */}
        <section className="container mx-auto px-4 max-w-4xl py-12 border-t border-gold/10">
          <SectionHeading eyebrow="2026 season" title="Platinum recognition timeline" />
          <div className="space-y-3">
            {[
              { step: "Nominations open", date: "Now – 31 March 2026", what: "Submit institution nominations and supporting evidence via the online portal." },
              { step: "EDI Verification", date: "April 2026", what: "SCEF panels score submissions against the EDI Matrix." },
              { step: "Platinum Recognition Show", date: "5 July 2026", what: "Certificates awarded; feature spotlight on NESA TV." },
            ].map((row) => (
              <Card key={row.step} className="bg-charcoal-light/40 border-gold/15">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <div className="flex items-center gap-2 md:w-56">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span className="font-display text-ivory text-sm font-semibold">{row.step}</span>
                  </div>
                  <div className="text-gold/80 text-xs md:w-48">{row.date}</div>
                  <div className="text-ivory/65 text-sm flex-1">{row.what}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-ivory/55 text-xs mt-4 italic">
            Platinum recipients may later qualify for competitive Blue Garnet recognition.{" "}
            <Link to="/timeline" className="text-gold hover:underline">See the full 2026 season calendar →</Link>
          </p>
        </section>

        {/* 7. NOMINEES */}
        <section className="container mx-auto px-4 max-w-7xl py-12 border-t border-gold/10">
          <SectionHeading
            eyebrow={`${totalNominees} institutions`}
            title="2026 nominees"
            lead="Nominees are organised by recognition track. Every entry begins with a generic description while EDI verification is underway. Once an organisation is accepted, they receive a private link to complete their own public profile (logo, self-reported description, years active, beneficiaries). Fields tagged 'Self-reported by organisation' have not been independently audited by NESA-Africa."
          />

          {/* Media filter bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", label: `All (${counts.all})` },
              { key: "photo", label: `📷 Has Photo (${counts.photo})` },
              { key: "video", label: `🎥 Has Video (${counts.video})` },
              { key: "none", label: `No Media Yet (${counts.none})` },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setMediaFilter(f.key as typeof mediaFilter)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  mediaFilter === f.key
                    ? "bg-gold/20 text-gold border-gold/40"
                    : "bg-charcoal-light/40 text-ivory/60 border-gold/15 hover:border-gold/30"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Tabs defaultValue="infrastructure" className="w-full">
            <TabsList className="bg-charcoal-light/40 border border-gold/15 flex-wrap h-auto p-1 gap-1 mb-6">
              {(["infrastructure", "scholarship", "holistic", "advocacy"] as const).map((k) => (
                <TabsTrigger
                  key={k}
                  value={k}
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70 text-xs md:text-sm"
                >
                  {subByTab[k]?.title.replace(/^Best /, "") ?? k}
                </TabsTrigger>
              ))}
            </TabsList>

            {(["infrastructure", "scholarship", "holistic", "advocacy"] as const).map((k) => (
              <TabsContent key={k} value={k}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {applyFilter(tabsData[k]).map((n) => (
                    <NomineeCard key={`${k}-${n.name}`} n={n} />
                  ))}
                </div>
                {applyFilter(tabsData[k]).length === 0 && (
                  <p className="text-ivory/50 text-sm text-center py-12">
                    No nominees match this media filter yet.
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Media submission CTA */}
          <Card className="mt-10 bg-charcoal-light/40 border-gold/20">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="font-display text-ivory text-base font-semibold mb-1">
                  Add a photo or video to an institution nomination
                </h4>
                <p className="text-ivory/60 text-sm">
                  Organisations may submit supporting visuals — facility photos or a short video.
                </p>
              </div>
              <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                <a href="mailto:info@nesa.africa">Submit Media</a>
              </Button>
            </CardContent>
          </Card>

          {/* Evidence submission note */}
          <p className="mt-6 text-ivory/55 text-xs leading-relaxed border-l-2 border-gold/30 pl-4 italic">
            {config.evidenceNote}
          </p>
        </section>

        {/* 8. RECOGNITION PACKAGE */}
        <section className="container mx-auto px-4 max-w-4xl py-12 border-t border-gold/10">
          <SectionHeading eyebrow="Award package" title="What recipients receive" />
          <ul className="grid sm:grid-cols-2 gap-3">
            {config.recognitionPackage.map((r) => (
              <li key={r} className="flex gap-2 bg-charcoal-light/40 border border-gold/15 rounded-md p-3">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-ivory/75 text-sm">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 9. TRUST & ACCOUNTABILITY */}
        <section className="container mx-auto px-4 max-w-4xl py-12 border-t border-gold/10">
          <SectionHeading eyebrow="Trust" title="Trust & accountability" />
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: "Independent Governance", href: "/governance", icon: ShieldCheck },
              { label: "Sponsors Do Not Influence Results", href: "/governance", icon: Award },
              { label: "Public Reporting", href: "/impact", icon: MapPin },
            ].map((t) => (
              <Link
                key={t.label}
                to={t.href}
                className="flex items-center gap-3 bg-charcoal-light/40 border border-gold/15 hover:border-gold/40 rounded-md p-4 transition-colors"
              >
                <t.icon className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-ivory/80 text-sm">{t.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="container mx-auto px-4 max-w-3xl py-12 border-t border-gold/10">
          <SectionHeading eyebrow="Questions" title="FAQ" />
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "What is the difference between Blue Garnet and Platinum?", a: "Blue Garnet is competitive and publicly voted. Platinum is honorary, EDI-scored, and documentation-based." },
              { q: "What documents or evidence may be required?", a: config.faqEvidence },
              { q: "How are nominees verified?", a: "Through the EDI Matrix, validated by regional SCEF panels." },
              { q: "Can a Platinum recipient also compete for Blue Garnet?", a: "Yes, if the institution meets the higher competitive thresholds." },
              { q: "How do years-active and beneficiary numbers get added to a nominee's profile?", a: "These figures are provided directly by the organisation after they are accepted for Platinum recognition, through a private profile link. NESA-Africa does not estimate or publish these figures on an organisation's behalf, and self-reported fields are clearly labeled as such." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-gold/15">
                <AccordionTrigger className="text-ivory text-sm font-semibold hover:text-gold text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-ivory/70 text-sm">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-ivory/55 text-xs mt-6 italic">
            Other questions relate to the overall NESA-Africa award structure rather than this category specifically.{" "}
            <Link to="/faq" className="text-gold hover:underline">See the full FAQ →</Link>
          </p>
        </section>

        {/* 11. EXPLORE / HALL OF FAME */}
        <section className="container mx-auto px-4 max-w-4xl py-12 border-t border-gold/10">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to={`/nominees?category=${encodeURIComponent(config.pageTitle)}`}>
                Explore Nominees
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/hall-of-fame">Visit Hall of Fame</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}

export default FaithCategoryPage;
