import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Globe2,
  ShieldCheck,
  Sparkles,
  Users,
  GraduationCap,
  HandCoins,
  CheckCircle2,
  Award,
  FileBadge,
  Trophy,
  Calendar,
  Building2,
  Tv,
  Mail,
  Download,
  Star,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  NOMINEES_BY_REGION,
  CHAMPIONS_BY_REGION,
  VERIFIED_CHAMPIONS,
  SUBCATEGORIES,
  PRIMARY_NOMINATE_HREF,
  type DiasporaNominee,
} from "./diasporaData";

/* ────────────────────────────────────────────────────────────────────── */
/* Atoms                                                                   */
/* ────────────────────────────────────────────────────────────────────── */

const SectionTitle = ({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-10">
    {kicker && (
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80 mb-2 font-semibold">{kicker}</p>
    )}
    <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory">{title}</h2>
    {sub && <p className="mt-3 text-ivory/65 text-base md:text-lg leading-relaxed">{sub}</p>}
  </div>
);

const NomineeCard = ({ n, variant = "awaiting" }: { n: DiasporaNominee; variant?: "awaiting" | "verified" }) => (
  <Card className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full">
    <CardContent className="p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        {variant === "verified" ? (
          <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/15">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Example
          </Badge>
        ) : (
          <Badge className="bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15">
            <Sparkles className="w-3 h-3 mr-1" /> Awaiting Consent
          </Badge>
        )}
        <span className="text-[10px] uppercase tracking-wider text-ivory/40">Proof: Pending</span>
      </div>
      <div>
        <h4 className="font-semibold text-ivory text-base leading-snug">{n.role}</h4>
        <p className="text-ivory/60 text-sm mt-1">{n.org}</p>
      </div>
      <p className="text-ivory/75 text-sm leading-relaxed">{n.focus}</p>
      <p className="text-[12px] text-ivory/50 pt-2 border-t border-gold/10">
        <span className="text-gold/80">Contact:</span> {n.contact}
      </p>
    </CardContent>
  </Card>
);

/* ────────────────────────────────────────────────────────────────────── */
/* Timeline data                                                          */
/* ────────────────────────────────────────────────────────────────────── */

const PHASE_1 = [
  { n: 1, title: "Public Pre-Nomination Activation", date: "20 May 2026", body: "Launches the early public engagement phase through pre-nomination forms, graphics, and a weekly storytelling calendar. Invites the general public, especially Gen Z audiences across Africa, the African diaspora, and friends of Africa, to identify public figures and changemakers supporting education before the official nomination and voting portal opens.", tags: ["Pre-Nomination", "Gen Z Engagement", "Public Database", "Social Media Activation"], agc: false },
  { n: 2, title: "Africa Education Icon Nominations Open & Close", date: "12 July – 12 September 2026", body: "Two-month nomination window for lifetime achievement entries. Opens on 12 July and closes on 12 September 2026. Scope: Africa Education Icon — Lifetime Achievement (2006–2026).", tags: ["Lifetime Achievement", "Nomination Window", "Legacy Pipeline"], agc: false },
  { n: 3, title: "Jury Onboarding", date: "29 June – 10 July 2026", body: "Selected jury members complete orientation, governance review, conflict-of-interest guidance, and scoring calibration.", tags: ["Integrity", "Governance", "Scoring Calibration"], agc: false },
  { n: 4, title: "Platinum Recognition Show", date: "5 July 2026", body: "Launches the public season with baseline recognition of institutional and leadership impact across education. This is the recognition event for the Diaspora Education Impact (Platinum) category — including all Africa-Regional nominees listed on this page.", tags: ["Credibility", "Visibility", "Campaign Opening", "Platinum"], agc: false },
  { n: 5, title: "Gold Certificate Nominations Close", date: "10 July 2026", body: "Final deadline for Influencers Education Impact Award entries before voting and category review.", tags: ["Pipeline Lock-In", "Category Review", "Voting Readiness"], agc: true },
  { n: 6, title: "Africa Education Icon Show", date: "12 July 2026", body: "Honours transformational leaders whose work has shaped African education over the past two decades.", tags: ["Authority", "Continental Positioning", "Lifetime Recognition"], agc: false },
  { n: 7, title: "Gold Certificate Voting", date: "15 August – 15 September 2026", body: "Mass public voting phase across eligible categories using AGC participation credits, with regional activation and audience growth.", tags: ["Participation", "Audience Growth", "Regional Activation"], agc: true },
  { n: 8, title: "Gold Certificate Winners Show", date: "16 September 2026", body: "Official announcement of Influencers Education Impact Award 2026 Edition winners — broadcast live as the kick-off of the Blue Garnet voting window.", tags: ["Amplification", "Media Assets", "Winner Visibility"], agc: true },
  { n: 9, title: "Momentum Phase", date: "16 September – 15 October 2026", body: "A focused storytelling, media, partnership, and audience-building phase running alongside Blue Garnet voting — carrying visibility from the Gold Winners Show into the final stretch before the Gala.", tags: ["Momentum", "Storytelling", "Media Build-Up", "Partnership Visibility"], agc: false },
  { n: 10, title: "Blue Garnet Voting", date: "16 September – 22 October 2026", body: "Final competitive voting window leading directly into the gala. Voting closes on gala day for transparency and suspense.", tags: ["Prestige", "Suspense", "Public + Jury"], agc: true },
  { n: 11, title: "Blue Garnet Awards Gala", date: "22 October 2026", body: "The peak event of the season — a live continental recognition ceremony and media moment celebrating Africa's education changemakers.", tags: ["Continental Spotlight", "Live Broadcast", "Main Gala"], agc: true, featured: true },
];

const PHASE_2 = [
  { n: 1, title: "Rebuild My School Africa Launch", date: "23 October 2026", body: "Official transition from awards visibility into school-focused intervention and social impact across African regions.", tags: ["Legacy", "Social Impact", "Regional Schools"] },
  { n: 2, title: "Regional School Nomination & Verification", date: "November – December 2026", body: "Communities, chapters, partners, and the public nominate formal, informal, and special needs schools for possible intervention. Schools are reviewed based on need, evidence, location, and impact potential.", tags: ["School Nomination", "Verification", "Regional Mapping"] },
  { n: 3, title: "EduAid Africa Scholarship & Learning Access Planning", date: "December 2026 – January 2027", body: "EduAid Africa structures scholarship support, learning access services, student support pathways, and education aid planning for selected communities and school categories.", tags: ["Scholarships", "Learning Access", "Education Aid"] },
  { n: 4, title: "Infrastructure & Special Needs School Support Planning", date: "January – March 2027", body: "Rebuild My School Africa prepares intervention plans for infrastructure improvement, special needs school support, classroom needs, learning materials, accessibility, and regional project costing.", tags: ["Infrastructure", "Special Needs Schools", "Accessibility"] },
  { n: 5, title: "CSR, Donations & Fundraising Activation", date: "March – June 2027", body: "SCEF activates CSR for Education, donor engagement, public fundraising, and partner support to fund approved school interventions and EduAid Africa services.", tags: ["CSR", "Donations", "Fundraising", "Partnerships"] },
  { n: 6, title: "Regional School Interventions", date: "June – September 2027", body: "Implementation phase for selected school support projects across African regions, including formal, informal, and special needs education environments.", tags: ["Implementation", "Regional Impact", "School Support"] },
  { n: 7, title: "Impact Reporting & Legacy Review", date: "October 2027", body: "SCEF publishes impact updates, partner reports, school intervention outcomes, scholarship summaries, and lessons for the next NESA-Africa cycle.", tags: ["Impact Report", "Transparency", "Legacy Review"] },
];

const REGIONS = ["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"] as const;

const FAQS = [
  { q: "How are NESA-Africa categories organised?", a: "NESA-Africa 2026 operates across 8 competitive Blue Garnet Award categories and a Platinum Certificate tier. Within each Blue Garnet category, multiple sub-categories award Gold Certificates, with top performers competing for the Blue Garnet Award. Platinum is non-competitive and documentation-based — no public vote, no ranking." },
  { q: "What is the difference between Blue Garnet and Platinum Certificate categories?", a: "Blue Garnet and Gold are competitive — nominees are scored, ranked, and supported by the public using AGC voting points. Platinum is an honorary recognition validated by SCEF regional panels based solely on documentation of verified impact. There is no fee for either tier." },
  { q: "Can one nominee enter more than one category?", a: "Yes. A nominee may be listed across relevant categories and sub-categories. Platinum recipients meeting higher measurable thresholds may also advance to competitive Blue Garnet / Gold categories at the September 2026 gala." },
  { q: "Are there regional, national and continental categories?", a: "Yes. NESA-Africa 2026 covers all five African regions (North, West, East, Central, Southern Africa) and diaspora tracks. Some awards are pan-continental or regional; others target specific countries or communities." },
  { q: "What documents or evidence may be required?", a: "At least one public proof link is required per nomination — an organisation page, press article, impact report, or video. Receipts, validated testimonials, and ministry or embassy endorsements strengthen nominations. Sensitive unpublished evidence is marked \"on file\" and not published publicly." },
  { q: "What makes a nomination strong?", a: "Clear evidence of measurable impact (learners, institutions, or teachers reached), sustainability of programming beyond the initial grant, alignment with SDG 4/17 and Agenda 2063, and transparent governance. Contributions in cash, kind, or expertise are all equally valid." },
  { q: "Can organisations nominate themselves?", a: "Yes. Self-nominations are accepted and treated identically to external nominations — both are subject to the same evidence and verification requirements by regional SCEF panels." },
  { q: "Can sponsors support a category?", a: "Yes. Category sponsorship is available. However, sponsorship has no bearing on nominations, judging, scoring, or winner selection — all commercial relationships are firewalled from the awards process by the independent Awards Council." },
  { q: "Can category sponsors influence winners?", a: "No. Sponsorship, partnership, and donations never affect any stage of the awards process. This is a published commitment enforced by the independent Awards Council and subject to public reporting." },
  { q: "How do I choose the right category?", a: "Review the six sub-category tracks on this page and select the one that best matches your organisation's base location and primary contribution type. If uncertain, email info@nesa.africa for guidance before submitting." },
];

/* ────────────────────────────────────────────────────────────────────── */
/* Page                                                                    */
/* ────────────────────────────────────────────────────────────────────── */

export default function DiasporaEducationPage() {
  const [championRegion, setChampionRegion] = useState<typeof REGIONS[number]>("West Africa");

  return (
    <div className="bg-charcoal text-ivory">
      <Helmet>
        <title>Diaspora Education Impact 2026 | NESA-Africa</title>
        <meta
          name="description"
          content="Honouring African diaspora associations, individuals, and innovators funding scholarships, building schools, and powering Education for All across the continent. 2026 nominations open."
        />
        <link rel="canonical" href="https://nesa.africa/categories/diaspora-education-impact" />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: "Diaspora Education Impact", path: "/categories/diaspora-education-impact" },
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
          </div>
        </div>
      </section>

      {/* ════════════ SECTION 2 — STAT BAR ════════════ */}
      <section className="border-b border-gold/10 px-4 py-8 bg-charcoal-light/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { v: "100", l: "Nominees — 5 regions" },
            { v: "6", l: "Sub-categories" },
            { v: "$95B+", l: "Annual diaspora remittances" },
            { v: "SDG 4", l: "Quality Education aligned" },
            { v: "Non-comp.", l: "Documentation-based" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-2xl md:text-3xl text-gold font-bold">{s.v}</div>
              <div className="text-[12px] md:text-sm text-ivory/60 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ SECTION 3 — OVERVIEW ════════════ */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-5">
            <SectionTitle kicker="Overview" title="A continental bridge for education" sub="Despite contributing over $95 billion annually in remittances, less than 5% of diaspora funds reach structured education programs." />
            <p className="text-ivory/75 leading-relaxed">
              Many diaspora projects remain undocumented, fragmented, or short-lived, failing to connect with national education systems or sustainable development plans. This recognition builds visibility and credibility for diaspora education efforts that truly change lives, sustain schools, and institutionalise excellence.
            </p>
            <Card className="bg-gold/5 border-gold/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Globe2 className="h-6 w-6 text-gold shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display text-lg text-ivory font-semibold mb-2">Vision &amp; Purpose</h3>
                    <p className="text-ivory/75 text-sm leading-relaxed italic">
                      "To connect global Africans to the continental education agenda by celebrating proven acts of commitment that build resilient education ecosystems, strengthen Africa's human-capital development, and encourage transparent and measurable diaspora participation in SDG 4 outcomes."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-2 pt-2">
              {["SDG 4 — Quality Education", "SDG 5 — Gender Equality", "SDG 17 — Partnerships", "Agenda 2063 Goal 1"].map((p) => (
                <Badge key={p} className="bg-charcoal-light/60 text-ivory/80 border border-gold/20 hover:bg-charcoal-light/60">{p}</Badge>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="bg-charcoal-light/50 border-gold/15">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-lg text-ivory font-semibold">Who qualifies?</h3>
                </div>
                <ul className="space-y-2 text-sm text-ivory/75">
                  {[
                    "Registered diaspora associations or national unions (e.g. NIDO chapters, alumni groups)",
                    "Individual Africans abroad — financial, professional, or technical contributors",
                    "Professional networks in academia, health, ICT, or engineering",
                    "Private diaspora-owned businesses or CSR foundations",
                    "Digital innovators building platforms for remote learning or teacher support",
                    "Contributions must span 2021–2025 with verifiable evidence",
                    "Non-monetary contributions qualify equally — expertise, devices, mentorship",
                  ].map((q) => (
                    <li key={q} className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0 mt-1" /><span>{q}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-charcoal-light/50 border-gold/15">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <HandCoins className="h-5 w-5 text-gold" />
                  <h3 className="font-display text-lg text-ivory font-semibold">Benefit for Africa</h3>
                </div>
                <ul className="space-y-2 text-sm text-ivory/75">
                  {[
                    "Encourages structured diaspora investment into public education systems",
                    "Builds a continental database of diaspora education interventions",
                    "Reinforces global collaboration between African governments and diaspora communities",
                    "Inspires younger diaspora generations to view education philanthropy as legacy work",
                    "Creates a verified network of Diaspora Education Partners (DEP) under SCEF",
                    "Increases awardee access to collaborations, grants, and partnerships with governments, multilateral bodies, and investors",
                  ].map((b) => (
                    <li key={b} className="flex gap-2"><Star className="h-3.5 w-3.5 text-gold shrink-0 mt-1" /><span>{b}</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* ════════════ SECTION 4 — TIMELINE ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="2026 Season" title="Programme Timeline" sub={`A continental journey from public pre-nomination activation on 20 May 2026 to the live Blue Garnet Awards Gala on 22 October 2026, followed by a 12-month social impact phase through Rebuild My School Africa and EduAid Africa services from 23 October 2026 to October 2027.`} />

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { l: "Award Campaign Period", v: "20 May → 22 Oct 2026" },
            { l: "Main Gala", v: "22 October 2026" },
            { l: "Impact Phase", v: "23 Oct 2026 → Oct 2027" },
            { l: "Continuous Engine", v: "Always-On" },
          ].map((b) => (
            <Card key={b.l} className="bg-charcoal-light/50 border-gold/20">
              <CardContent className="p-4 text-center">
                <div className="text-[11px] uppercase tracking-wider text-gold/80">{b.l}</div>
                <div className="text-ivory font-semibold mt-1 text-sm md:text-base">{b.v}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 justify-center mb-12">
          <Button asChild size="sm" className="bg-gold text-charcoal hover:bg-gold-dark"><Link to="/nominate">Nominate Now</Link></Button>
          <Button asChild size="sm" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10"><Link to="/categories">View Categories</Link></Button>
          <Button asChild size="sm" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10"><Link to="/partners">Partner With Us</Link></Button>
          <Button asChild size="sm" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10"><Link to="/nesa-tv"><Tv className="mr-1.5 h-3.5 w-3.5" /> Watch NESA TV</Link></Button>
        </div>

        {/* Phase 1 */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-gold text-charcoal hover:bg-gold">Phase 1 · Season 1</Badge>
            <span className="text-ivory/60 text-sm">20 May 2026 → 22 October 2026</span>
          </div>
          <p className="text-ivory/70 italic mb-6 max-w-4xl">"The 2026 award season runs as a phased continental campaign designed to build credibility, public participation, Gen Z engagement, visibility, partnerships, voting suspense, momentum, and final recognition at the Blue Garnet Awards Gala."</p>
          <ol className="space-y-3">
            {PHASE_1.map((s) => (
              <li key={s.n}>
                <Card className={`bg-charcoal-light/50 ${s.featured ? "border-gold ring-2 ring-gold/40 shadow-[0_0_30px_-10px_hsl(var(--gold))]" : "border-gold/15"}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold/80">Step {s.n}</span>
                      <Badge variant="outline" className="border-ivory/30 text-ivory/70 text-[10px]">Upcoming</Badge>
                      {s.agc && <Badge className="bg-amber-500/15 text-amber-300 border border-amber-400/30 hover:bg-amber-500/15 text-[10px]">AGC</Badge>}
                      {s.featured && <Badge className="bg-gold text-charcoal text-[10px] hover:bg-gold"><Trophy className="w-3 h-3 mr-1" /> Featured</Badge>}
                      <span className="text-ivory/50 text-xs ml-auto"><Calendar className="inline h-3 w-3 mr-1" />{s.date}</span>
                    </div>
                    <h3 className={`font-display ${s.featured ? "text-xl text-gold" : "text-lg text-ivory"} font-semibold mb-1.5`}>{s.title}</h3>
                    <p className="text-ivory/70 text-sm leading-relaxed">{s.body}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold/80 border border-gold/15">{t}</span>)}
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
          <Card className="bg-gold/5 border-gold/30 mt-6">
            <CardContent className="p-5 text-ivory/80 italic text-sm">"The Blue Garnet Gala closes Phase 1. From 23 October 2026, the campaign transitions into the Rebuild My School Africa and EduAid Africa social impact phase."</CardContent>
          </Card>
        </div>

        {/* Phase divider */}
        <div className="max-w-6xl mx-auto my-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-gold/30" />
          <Badge className="bg-charcoal-light text-gold border border-gold/40 hover:bg-charcoal-light px-4 py-1.5"><Sparkles className="w-3.5 h-3.5 mr-1.5" /> Transition</Badge>
          <div className="flex-1 h-px bg-gold/30" />
        </div>

        {/* Phase 2 */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/15">Phase 2 · Social Impact</Badge>
            <span className="text-ivory/60 text-sm">23 October 2026 → October 2027</span>
          </div>
          <p className="text-ivory/70 italic mb-6 max-w-4xl">"After the Blue Garnet Awards Gala, the campaign transitions from recognition into measurable education impact. Through Rebuild My School Africa and EduAid Africa, SCEF will support school-focused interventions, scholarships, education infrastructure, learning access, and regional education services across formal, informal, and special needs schools."</p>
          <ol className="space-y-3">
            {PHASE_2.map((s) => (
              <li key={s.n}>
                <Card className="bg-charcoal-light/50 border-gold/15">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">Step {s.n}</span>
                      <Badge variant="outline" className="border-ivory/30 text-ivory/70 text-[10px]">Upcoming</Badge>
                      <span className="text-ivory/50 text-xs ml-auto"><Calendar className="inline h-3 w-3 mr-1" />{s.date}</span>
                    </div>
                    <h3 className="font-display text-lg text-ivory font-semibold mb-1.5">{s.title}</h3>
                    <p className="text-ivory/70 text-sm leading-relaxed">{s.body}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300/80 border border-emerald-400/15">{t}</span>)}
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>

        {/* Award Pathways callout */}
        <div className="max-w-6xl mx-auto mt-12">
          <Card className="bg-charcoal-light/50 border-gold/20">
            <CardContent className="p-6">
              <h3 className="font-display text-xl text-ivory font-semibold mb-1">Award Pathways — How NESA-Africa Awards Are Organized</h3>
              <p className="text-ivory/65 italic text-sm mb-4">Understand the four recognition pathways, how nominees are grouped, and how each award category moves through the season.</p>
              <p className="text-ivory/75 text-sm mb-5">"NESA-Africa uses different recognition pathways to celebrate lifetime education icons, institutions, social-impact influencers, and competitive excellence across Africa and the diaspora."</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { p: "Africa Education Icon Award", s: "Lifetime Achievement" },
                  { p: "Platinum Award", s: "Institutional Leadership" },
                  { p: "Influencers Education Impact Award", s: "2026 Edition" },
                  { p: "Blue Garnet Award", s: "Competitive Excellence" },
                ].map((p) => (
                  <div key={p.p} className="rounded-lg border border-gold/15 bg-charcoal/40 p-3 flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-gold" />
                    <div>
                      <div className="text-ivory text-sm font-semibold">{p.p}</div>
                      <div className="text-ivory/55 text-xs">{p.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ════════════ SECTION 5 — SUB-CATEGORIES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle kicker="Tracks" title="Sub-categories" sub="Six recognition tracks aligned with the 2026 Diaspora Education Impact pathway." />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBCATEGORIES.map((c) => (
            <Card key={c.slug} className="bg-charcoal-light/50 border-gold/15 hover:border-gold/40 transition-all h-full">
              <CardContent className="p-5 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gold/15 text-gold border border-gold/30 hover:bg-gold/15">Track {c.track}</Badge>
                </div>
                <h3 className="font-display text-lg text-ivory font-semibold mb-2">{c.title}</h3>
                <p className="text-ivory/70 text-sm leading-relaxed flex-1">{c.desc}</p>
                <Button asChild size="sm" variant="outline" className="mt-4 border-gold/30 text-gold hover:bg-gold/10 self-start">
                  <Link to={`/nominate?subcategory=${c.slug}`}>Nominate <ArrowRight className="ml-1.5 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ SECTION 6 — MID CTA ════════════ */}
      <section className="px-4 py-12">
        <Card className="max-w-5xl mx-auto bg-gradient-to-br from-gold/10 via-charcoal-light to-charcoal border-gold/30">
          <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl text-ivory font-bold">Nominate in this category</h3>
              <p className="text-ivory/70 mt-2">Know someone making a difference? Submit a nomination today. 2026 nominations are open.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
                <Link to={PRIMARY_NOMINATE_HREF}><Award className="mr-2 h-4 w-4" /> Nominate Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10">
                <Link to="/categories">View All Categories</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ════════════ SECTION 7 — ELIGIBILITY ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="Eligibility" title="Platinum recognition thresholds" />
        <div className="max-w-4xl mx-auto">
          <Card className="bg-charcoal-light/50 border-gold/15 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-gold/10">
                {[
                  ["Contribution type", "Cash, kind, or expertise toward education, 2021–2025"],
                  ["Verification", "Receipts, impact reports, or validated testimonials; at least 1 public proof link required"],
                  ["Scale", "≥ 5 institutions or ≥ 5,000 beneficiaries"],
                  ["Regional spread", "At least 1 country in each participating region"],
                  ["Sustainability", "Evidence of follow-up programming or ongoing mentorship"],
                  ["Governance", "Transparent, auditable, or community-endorsed operations"],
                  ["Alignment", "Supports SDG 4, SDG 5, SDG 17, and Agenda 2063 Goal 1"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                    <div className="text-gold/80 font-semibold text-sm uppercase tracking-wider">{k}</div>
                    <div className="md:col-span-2 text-ivory/80 text-sm">{v}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ════════════ SECTION 8 — NOMINEES ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle kicker="Nominees" title="2026 Africa-Regional nominees" sub="100 nominees across five African regions, plus an Outstanding Individual Diaspora Education Champions track. All profiles are pending consent confirmation before full publication. Names and contact details will be published only after explicit written consent is received from each nominee or their organisation." />

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="North Africa" className="w-full">
            <TabsList className="flex flex-wrap h-auto bg-charcoal-light/60 border border-gold/20 p-1 mb-8 gap-1">
              {REGIONS.map((r) => (
                <TabsTrigger key={r} value={r} className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70 text-xs md:text-sm">{r}</TabsTrigger>
              ))}
              <TabsTrigger value="Individual Champions" className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-ivory/70 text-xs md:text-sm">Individual Champions</TabsTrigger>
            </TabsList>

            {REGIONS.map((r) => (
              <TabsContent key={r} value={r}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {NOMINEES_BY_REGION[r].map((n, i) => <NomineeCard key={`${r}-${i}`} n={n} />)}
                </div>
              </TabsContent>
            ))}

            <TabsContent value="Individual Champions" className="space-y-8">
              <Card className="bg-gold/5 border-gold/30">
                <CardContent className="p-5 text-sm text-ivory/80 italic">"This track honours individual Africans abroad whose personal leadership — in cash, kind, or expertise — advanced Education for All in their home country or region between 2021 and 2025. Profiles are published only after explicit written consent. Names are withheld until consent is confirmed."</CardContent>
              </Card>

              <Card className="bg-amber-500/5 border-amber-400/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-ivory/80">
                      <strong className="text-amber-300">Consent notice:</strong> All individual champion profiles are pending consent. Once a nominee or their organisation submits the consent form, their full name, role, organisation, and public contact channel will be published here. To submit or confirm consent:&nbsp;
                      <a href="mailto:info@nesa.africa" className="text-gold underline">info@nesa.africa</a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-charcoal-light/50 border-gold/15">
                <CardContent className="p-5">
                  <h4 className="font-display text-ivory font-semibold mb-3 flex items-center gap-2"><FileBadge className="h-4 w-4 text-gold" /> Publishing gate</h4>
                  <p className="text-sm text-ivory/70 mb-3">Profiles display only after confirmation of:</p>
                  <ul className="grid md:grid-cols-2 gap-2 text-sm text-ivory/75">
                    {[
                      "Full name (confirmed by nominee or organisation)",
                      "Role / Title",
                      "Organisation / Association",
                      "Short contribution summary (≤60 words, 2021–2025)",
                      "Preferred public contact channel (org page, org email, or professional social — no private emails)",
                      "At least 1–2 public proof links",
                      "Signed consent via NESA-Africa Google Form or written email reply",
                    ].map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0 mt-1" />{x}</li>)}
                  </ul>
                </CardContent>
              </Card>

              {/* Verified examples */}
              <div>
                <h3 className="font-display text-xl text-ivory font-semibold mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> Verified Examples</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {VERIFIED_CHAMPIONS.map((v, i) => (
                    <Card key={i} className="bg-charcoal-light/50 border-emerald-400/25">
                      <CardContent className="p-5 space-y-3">
                        <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/15">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Example
                        </Badge>
                        <div>
                          <h4 className="font-semibold text-ivory">{v.name}</h4>
                          <p className="text-ivory/60 text-sm mt-1">{v.org}</p>
                        </div>
                        <p className="text-ivory/75 text-sm">{v.focus}</p>
                        <p className="text-[12px] text-ivory/50 pt-2 border-t border-gold/10">
                          <span className="text-gold/80">Contact:</span> {v.contact}
                        </p>
                        {v.note && <p className="text-[11px] text-amber-300/70 italic">{v.note}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Regional secondary filter for champions */}
              <div>
                <h3 className="font-display text-xl text-ivory font-semibold mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-gold" /> Awaiting-Consent Champions by Region</h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {REGIONS.map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={championRegion === r ? "default" : "outline"}
                      onClick={() => setChampionRegion(r)}
                      className={championRegion === r ? "bg-gold text-charcoal hover:bg-gold-dark" : "border-gold/30 text-ivory/80 hover:bg-gold/10"}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CHAMPIONS_BY_REGION[championRegion].map((n, i) => <NomineeCard key={`${championRegion}-${i}`} n={n} />)}
                </div>
              </div>

              {/* Consent CTA */}
              <Card className="bg-gradient-to-br from-gold/10 via-charcoal-light to-charcoal border-gold/30">
                <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-ivory font-bold">Are you a nominee or do you represent one?</h3>
                    <p className="text-ivory/70 mt-2 text-sm">Submit your consent and profile details to be published on this page.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold-dark">
                      <a href="mailto:info@nesa.africa"><Mail className="mr-2 h-4 w-4" /> Submit Consent Form</a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-gold/40 text-ivory hover:bg-gold/10">
                      <Link to="/consent-guide"><Download className="mr-2 h-4 w-4" /> Download consent guide</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ════════════ SECTION 9 — RECOGNITION PACKAGE ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="Recognition" title="Recognition package" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { i: FileBadge, t: "Platinum Digital Certificate", d: "Downloadable via GFA Wallet." },
            { i: Award, t: "Letter of Recognition", d: "Endorsed by SCEF / NESA-Africa Secretariat." },
            { i: Tv, t: "Feature spotlight", d: "NESA TV & EduAid-Africa Expo." },
            { i: FileBadge, t: "Optional printed certificate", d: "For embassies, events, or association archives." },
            { i: Users, t: "Diaspora Ambassadors Roundtable 2026", d: "Personal invitation." },
            { i: Building2, t: "Verified DEP listing", d: "Diaspora Education Partners database under SCEF." },
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

      {/* ════════════ SECTION 10 — TRUST & ACCOUNTABILITY ════════════ */}
      <section className="px-4 py-16">
        <SectionTitle kicker="Trust" title="Trust & Accountability" />
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            { t: "Independent Governance", d: "Awards Council governs all stages.", href: "https://nesa.africa/governance", icon: ShieldCheck },
            { t: "Sponsors Do Not Influence Results", d: "Commercial relationships are firewalled.", icon: Award },
            { t: "Public Reporting", d: "All outcomes published transparently.", href: "https://nesa.africa/impact", icon: FileBadge },
          ].map((c) => (
            <Card key={c.t} className="bg-charcoal-light/50 border-gold/15">
              <CardContent className="p-5">
                <c.icon className="h-6 w-6 text-gold mb-3" />
                <h4 className="font-display text-ivory font-semibold mb-1">{c.t}</h4>
                <p className="text-ivory/65 text-sm mb-3">{c.d}</p>
                {c.href && <a href={c.href} className="text-gold text-sm hover:underline">Learn more →</a>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ SECTION 11 — FAQ ════════════ */}
      <section className="px-4 py-16 border-y border-gold/10 bg-charcoal-light/20">
        <SectionTitle kicker="FAQ" title="Frequently asked questions" />
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`f-${i}`} className="border border-gold/15 rounded-lg bg-charcoal-light/40 px-4">
                <AccordionTrigger className="text-ivory hover:text-gold text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-ivory/70 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-6 text-sm text-ivory/60">
            <a href="https://nesa.africa/faq" className="text-gold hover:underline">View Full FAQ</a> · Contact us at <a href="mailto:info@nesa.africa" className="text-gold hover:underline">info@nesa.africa</a>
          </div>
        </div>
      </section>
    </div>
  );
}
