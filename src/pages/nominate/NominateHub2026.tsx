import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Building2,
  Landmark,
  Crown,
  BadgeCheck,
  Search,
  ScrollText,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TIERS_META,
  NOMINATION_FORMS,
  getFormsByTier,
  type TierSlug,
  type NominationFormMeta,
} from "@/config/nominate2026/forms";
import { EDI_MATRIX_GENERIC } from "@/config/nominate2026/ediMatrix";
import { getCategoryContent } from "@/config/nominate2026/categoryContent";
import { supabase } from "@/integrations/supabase/client";

/* ────────────────────────────────────────────────────────────────────────── */
/* Tier presentation (spec Part A — Tier Selector)                            */
/* ────────────────────────────────────────────────────────────────────────── */

type TierPresentation = {
  icon: typeof Trophy;
  eyebrow: string;
  title: string;
  description: string;
  badges: string[];
  cta: string;
  ctaHref: string;
};

const TIER_PRESENTATION: Record<TierSlug, TierPresentation> = {
  "africa-education-icon": {
    icon: Trophy,
    eyebrow: "Tier 1 · Flagship",
    title: "Africa Education Icon Award",
    description:
      "Africa's Highest Lifetime Recognition. The only competitive, judge-reviewed tier. Recognises individuals whose lifetime contributions (rolling 20-year window) have transformed education across Africa.",
    badges: [
      "Only Judged Tier",
      "3 Pathways",
      "9 Laureates per Cycle",
      "Once-in-a-Lifetime",
    ],
    cta: "Nominate an Africa Education Icon",
    ctaHref: "/nominate/africa-education-icon",
  },
  "influencer-education-impact": {
    icon: Users,
    eyebrow: "Tier 2",
    title: "Influencer Education Impact",
    description:
      "Public figures whose verified campaigns, platforms, or programmes have advanced education. No judges, no voting, no ranking.",
    badges: [
      "Certificate of Recognition",
      "NRC-Verified",
      "Multiple Recipients Possible",
    ],
    cta: "Nominate an Influencer Enabler",
    ctaHref: "/nominate/influencer-education-impact",
  },
  platinum: {
    icon: Landmark,
    eyebrow: "Tier 3",
    title: "Platinum Certificates of Recognition",
    description:
      "Institutions, leaders, and international partners strengthening education systems. Non-competitive, evidence-based.",
    badges: [
      "Certificate of Recognition",
      "7 Categories",
      "NRC-Verified",
    ],
    cta: "Explore Platinum Categories",
    ctaHref: "#directory",
  },
  "gold-blue-garnet": {
    icon: Building2,
    eyebrow: "Tier 4",
    title: "Gold-Blue Garnet Regional Recognition",
    description:
      "Organisations, businesses, and states enabling education across regions and sectors. Non-competitive, evidence-based.",
    badges: [
      "Certificate of Recognition",
      "9 Categories",
      "NRC-Verified",
    ],
    cta: "Explore Gold-Blue Garnet Categories",
    ctaHref: "#directory",
  },
};

/* ────────────────────────────────────────────────────────────────────────── */
/* Tier cards                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function TierCard({
  slug,
  variant = "standard",
}: {
  slug: TierSlug;
  variant?: "flagship" | "standard";
}) {
  const p = TIER_PRESENTATION[slug];
  const Icon = p.icon;
  const isFlagship = variant === "flagship";
  const isInternalAnchor = p.ctaHref.startsWith("#");

  return (
    <div
      className={[
        "flex flex-col rounded-2xl p-6 md:p-8 h-full",
        isFlagship
          ? "border-2 border-gold bg-gradient-to-br from-[#1a1608] to-[#15181f] shadow-[0_0_60px_-15px_rgba(212,175,55,0.35)]"
          : "border border-[#2b3140] bg-[#15181f] hover:border-gold/50 transition",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isFlagship ? "bg-gold text-charcoal" : "bg-gold/10 text-gold",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-gold/80">
          {p.eyebrow}
        </span>
      </div>
      <h3
        className={[
          "font-playfair text-gold leading-tight",
          isFlagship ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
        ].join(" ")}
      >
        {p.title}
      </h3>
      <p className="mt-3 text-sm text-foreground/80 md:text-base">
        {p.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.badges.map((b) => (
          <Badge
            key={b}
            variant="outline"
            className="border-gold/40 text-[10px] text-gold/90"
          >
            {b}
          </Badge>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gold/10">
        {isInternalAnchor ? (
          <a
            href={p.ctaHref}
            className={[
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
              isFlagship
                ? "bg-gold text-charcoal hover:bg-gold/90"
                : "border border-gold/50 text-gold hover:bg-gold/10",
            ].join(" ")}
          >
            {p.cta} <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <Link
            to={p.ctaHref}
            className={[
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
              isFlagship
                ? "bg-gold text-charcoal hover:bg-gold/90"
                : "border border-gold/50 text-gold hover:bg-gold/10",
            ].join(" ")}
          >
            {p.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* 18-Form Directory                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

const NOMINEE_TYPES = [
  { value: "all", label: "All nominee types" },
  { value: "individual", label: "Individual" },
  { value: "organisation", label: "Organisation" },
  { value: "institution", label: "Institution" },
  { value: "programme", label: "Programme" },
  { value: "government", label: "Government" },
  { value: "public-figure", label: "Public figure" },
];

const REGION_SCOPES = [
  { value: "all", label: "All regions" },
  { value: "africa", label: "Africa-wide / 8 regions" },
  { value: "nigeria", label: "Nigeria (zones & states)" },
  { value: "none", label: "Not region-scoped" },
];

const TIER_FILTERS: { value: TierSlug | "all"; label: string }[] = [
  { value: "all", label: "All tiers" },
  { value: "africa-education-icon", label: "Africa Education Icon" },
  { value: "influencer-education-impact", label: "Influencer Education Impact" },
  { value: "platinum", label: "Platinum" },
  { value: "gold-blue-garnet", label: "Gold-Blue Garnet" },
];

function DirectoryCard({ form }: { form: NominationFormMeta }) {
  const content = getCategoryContent(form.category);
  const title = content?.hero.h1 ?? form.title;
  return (
    <div className="group flex h-full flex-col rounded-xl border border-[#2b3140] bg-[#15181f] p-5 transition hover:border-gold/60">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wide text-gold/70">
          {form.tier === "africa-education-icon"
            ? "Africa Education Icon"
            : form.tier === "influencer-education-impact"
              ? "Influencer"
              : form.tier === "platinum"
                ? "Platinum"
                : "Gold-Blue Garnet"}
        </span>
        <Badge
          variant="outline"
          className={[
            "text-[10px]",
            form.judged
              ? "border-gold text-gold"
              : "border-emerald-500/50 text-emerald-300",
          ].join(" ")}
        >
          {form.judged ? "Judged" : "NRC-Verified"}
        </Badge>
      </div>
      <h4 className="font-playfair text-base leading-snug text-foreground group-hover:text-gold">
        {title}
      </h4>
      <p className="mt-2 text-xs text-foreground/65">{form.purpose}</p>
      <p className="mt-2 text-[11px] text-foreground/50">
        {form.selectorLabel}
      </p>
      <div className="mt-auto flex items-center gap-3 pt-4">
        <Link
          to={form.route}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-charcoal hover:bg-gold/90"
        >
          Start Nomination <ArrowRight className="h-3 w-3" />
        </Link>
        <Link
          to="/nominees"
          className="text-xs text-gold/80 hover:text-gold underline-offset-2 hover:underline"
        >
          Explore nominees
        </Link>
      </div>
    </div>
  );
}

function FormDirectory() {
  const [tier, setTier] = useState<TierSlug | "all">("all");
  const [nomineeType, setNomineeType] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return NOMINATION_FORMS.filter((f) => {
      if (tier !== "all" && f.tier !== tier) return false;
      if (nomineeType !== "all" && f.nomineeType !== nomineeType) return false;
      if (region !== "all") {
        if (region === "none" && f.regionScope) return false;
        if (region !== "none" && f.regionScope !== region) return false;
      }
      if (q.trim()) {
        const needle = q.toLowerCase();
        const hay = `${f.title} ${f.purpose} ${f.selectorLabel} ${(f.tags ?? []).join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [tier, nomineeType, region, q]);

  return (
    <section id="directory" className="border-b border-gold/10 py-14 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-3xl">
          <h2 className="font-playfair text-2xl text-gold sm:text-3xl md:text-4xl">
            18-Form Directory
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Every recognition category has its own dedicated form. Filter by
            tier, nominee type, or region — or search by keyword.
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={tier} onValueChange={(v) => setTier(v as TierSlug | "all")}>
            <SelectTrigger className="bg-[#15181f] border-[#2b3140]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              {TIER_FILTERS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={nomineeType} onValueChange={setNomineeType}>
            <SelectTrigger className="bg-[#15181f] border-[#2b3140]">
              <SelectValue placeholder="Nominee type" />
            </SelectTrigger>
            <SelectContent>
              {NOMINEE_TYPES.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="bg-[#15181f] border-[#2b3140]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {REGION_SCOPES.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search categories…"
              className="pl-9 bg-[#15181f] border-[#2b3140]"
            />
          </div>
        </div>

        <p className="mb-4 text-xs text-foreground/60">
          Showing {filtered.length} of {NOMINATION_FORMS.length} forms
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <DirectoryCard key={f.id} form={f} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-gold/20 bg-black/30 p-10 text-center text-sm text-foreground/70">
            No forms match those filters. Try clearing them to see all 18.
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* How Recognition Works                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

function ProcessDiagram() {
  const iconSteps = [
    "Nomination",
    "Acceptance",
    "NRC (EDI Matrix)",
    "Judges Arena (ICON_SCORING_CRITERIA)",
    "Grand Jury",
    "Governance Ratification",
    "9 Laureates",
  ];
  const certSteps = [
    "Nomination",
    "Acceptance",
    "NRC (EDI Matrix)",
    "Governance Approval",
    "Certificate of Recognition",
  ];

  return (
    <section
      id="how-it-works"
      className="border-b border-gold/10 bg-black/30 py-14 md:py-20"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="font-playfair text-2xl text-gold sm:text-3xl md:text-4xl">
          How Recognition Works
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-foreground/70">
          NRC verifies all four tiers using the EDI Matrix. Only the Africa
          Education Icon Award proceeds to the Judges Arena, where judges apply
          a separate lifetime-achievement scoring framework after NRC
          verification is complete.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Icon track */}
          <div className="rounded-2xl border-2 border-gold/60 bg-gradient-to-br from-[#1a1608] to-[#15181f] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              <h3 className="font-playfair text-lg text-gold">
                Africa Education Icon (Judged)
              </h3>
            </div>
            <ol className="space-y-2">
              {iconSteps.map((s, i) => (
                <li
                  key={s}
                  className="flex items-start gap-3 text-sm text-foreground/85"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-charcoal">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
          {/* Certificate track */}
          <div className="rounded-2xl border border-emerald-500/40 bg-[#15181f] p-6">
            <div className="mb-4 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-emerald-300" />
              <h3 className="font-playfair text-lg text-emerald-200">
                Certificate Tiers (NRC-Verified)
              </h3>
            </div>
            <p className="mb-3 text-xs uppercase tracking-wide text-emerald-300/80">
              Influencer · Platinum · Gold-Blue Garnet
            </p>
            <ol className="space-y-2">
              {certSteps.map((s, i) => (
                <li
                  key={s}
                  className="flex items-start gap-3 text-sm text-foreground/85"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-200">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Existing nominees count (live from Supabase)                                */
/* ────────────────────────────────────────────────────────────────────────── */

function ExistingNomineesBand() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { count: c } = await supabase
        .from("nominees")
        .select("id", { count: "exact", head: true });
      if (!cancelled) setCount(typeof c === "number" ? c : 0);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="border-b border-gold/10 py-10">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        {count === null ? (
          <p className="text-sm text-foreground/60">Loading verified nominees…</p>
        ) : count === 0 ? (
          <p className="text-base text-foreground/80">
            No nominees have been verified yet for the 2026 cycle —{" "}
            <Link to="#directory" className="text-gold underline-offset-2 hover:underline">
              be the first to nominate
            </Link>
            .
          </p>
        ) : (
          <p className="text-base text-foreground/80">
            <span className="font-playfair text-2xl text-gold">{count}</span>{" "}
            verified nominees across 18 categories.{" "}
            <Link to="/nominees" className="text-gold underline-offset-2 hover:underline">
              Browse the directory →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* FAQs                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "What counts as evidence of impact?",
    a: "Anything that independently corroborates what the nominee has done: audited reports, press coverage, official policy documents, programme evaluations, beneficiary testimonials, photographs, video, or verifiable statistics. Self-reported claims without corroboration are not sufficient — the Nominee Research Corps assesses evidence against the category's EDI Matrix.",
  },
  {
    q: "Can I nominate myself?",
    a: "Individuals may not self-nominate for the Africa Education Icon Award. For all other tiers, organisations may submit their own institution or programme, but a third-party reference is expected during NRC verification.",
  },
  {
    q: "What happens after I submit?",
    a: "You'll receive an acknowledgement immediately. Your nomination then moves through duplicate review, NRC evidence verification, EDI Matrix scoring, and — for the Africa Education Icon Award only — independent judging and Grand Jury deliberation, before Governance ratification.",
  },
  {
    q: "Does sponsoring or donating affect my nominee's chances?",
    a: "No. Sponsorship, partnership, donations, ticket purchases, endorsements, and visibility opportunities do not influence NRC verification, judging, or Governance decisions. Recognition is evidence-based only.",
  },
  {
    q: "Can the same nominee win more than once?",
    a: "The Africa Education Icon Award is once-in-a-lifetime — a laureate cannot win it again in any future cycle. Certificate of Recognition tiers (Influencer, Platinum, Gold-Blue Garnet) may be awarded to the same nominee across cycles if their verified impact continues.",
  },
];

function FAQSection() {
  return (
    <section className="border-b border-gold/10 py-14 md:py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="font-playfair text-2xl text-gold sm:text-3xl md:text-4xl">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-6">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-b border-gold/15"
            >
              <AccordionTrigger className="text-left text-sm text-foreground/90 hover:text-gold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/75">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Page                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

export default function NominateHub2026() {
  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>Nominate an Enabler of Education for All | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Nominate an individual, organisation, institution, government, programme or public figure advancing Education for All across Africa, the Diaspora and Friends of Africa. One flagship award, three Certificate of Recognition tiers, eighteen forms."
        />
      </Helmet>

      {/* Announcement bar */}
      <div className="border-b border-gold/20 bg-black/40">
        <div className="container mx-auto px-4 py-2 text-center text-xs sm:text-sm text-gold">
          Public Nominations Open · 30 August 2026 — NESA-Africa 2026
        </div>
      </div>

      {/* HERO */}
      <section className="border-b border-gold/15 bg-gradient-to-b from-black/60 to-charcoal">
        <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            NESA-Africa 2026
          </div>
          <h1 className="font-playfair text-3xl leading-tight text-gold sm:text-5xl md:text-6xl">
            Nominate an Enabler of Education for All Across Africa
          </h1>
          <p className="mt-5 max-w-3xl text-base text-foreground/85 sm:text-lg">
            Identify an individual, organisation, institution, government,
            programme, or public figure making a verified contribution to
            education across Africa, the Diaspora, and among Friends of Africa.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-gold/85 sm:text-base">
            One Flagship Award · Three Certificate of Recognition Tiers ·
            Eighteen Recognition Forms · One Verified Standard
          </p>

          {/* Integrity Notice (persistent, above the fold) */}
          <div className="mt-8 rounded-xl border border-gold/30 bg-black/40 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <p className="text-xs text-foreground/85 sm:text-sm">
                Recognition is based on verified educational impact, evaluated
                through the Education Development Index (EDI) Matrix — not
                popularity, sponsorship, or public vote. Sponsorship,
                donations, ticket purchases, endorsements, and visibility
                opportunities do not influence nominee approval, judging, or
                Governance decisions.
              </p>
            </div>
          </div>

          {/* Nomination Notice */}
          <div className="mt-4 rounded-xl border border-gold/15 bg-[#15181f] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <ScrollText className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <p className="text-xs text-foreground/80 sm:text-sm">
                No account is required to begin. You'll create or confirm your
                free account only when submitting your nomination. Your draft
                is saved to your session and email — not this device — so you
                can resume from anywhere.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <a href="#tier-selector">
                Choose a tier
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <a href="#directory">
                Browse 18 forms
                <ChevronDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* TIER SELECTOR */}
      <section id="tier-selector" className="border-b border-gold/10 py-14 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-playfair text-2xl text-gold sm:text-3xl md:text-4xl">
              Four Recognition Tiers
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              One flagship judged award. Three non-competitive Certificate of
              Recognition tiers.
            </p>
          </div>

          {/* Row 1 — Flagship alone */}
          <div className="mx-auto mb-6 max-w-3xl">
            <TierCard slug="africa-education-icon" variant="flagship" />
          </div>

          {/* Row 2 — Three Certificate of Recognition tiers */}
          <div className="grid gap-5 md:grid-cols-3">
            <TierCard slug="influencer-education-impact" />
            <TierCard slug="platinum" />
            <TierCard slug="gold-blue-garnet" />
          </div>
        </div>
      </section>

      {/* 18-FORM DIRECTORY */}
      <FormDirectory />

      {/* HOW RECOGNITION WORKS */}
      <ProcessDiagram />

      {/* EDI Matrix Overview */}
      <section id="edi-standards" className="border-b border-gold/10 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="font-playfair text-2xl text-gold sm:text-3xl md:text-4xl">
            Education Development Index (EDI) Matrix
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground/70">
            Every category is assessed against ten evidence-driven indicators.
            Each category page carries its own weighted version — the standard
            below is the shared foundation.{" "}
            <Link to="/governance/edi-matrix" className="text-gold underline-offset-2 hover:underline">
              Read the full methodology →
            </Link>
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {EDI_MATRIX_GENERIC.map((i, idx) => (
              <div
                key={i.id}
                className="rounded-lg border border-gold/20 bg-[#15181f] p-4"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-gold/80">
                  <span className="font-mono">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="font-semibold">{i.label}</span>
                </div>
                <p className="text-xs text-foreground/70">{i.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXISTING NOMINEES (live count) */}
      <ExistingNomineesBand />

      {/* FAQ */}
      <FAQSection />

      {/* FINAL CTA BANNER */}
      <section className="bg-gradient-to-b from-[#1a1608] to-charcoal py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-playfair text-3xl text-gold sm:text-4xl">
            Ready to Recognise an Education Enabler?
          </h2>
          <p className="mt-4 text-sm text-foreground/80 sm:text-base">
            Nominate a teacher, founder, mentor, organisation, institution,
            programme, or public figure whose verified work is advancing
            Education for All across Africa.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <a href="#tier-selector">
                Start a Nomination
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
