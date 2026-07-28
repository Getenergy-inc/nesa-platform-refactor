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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TIERS_META,
  getFormsByTier,
  type TierSlug,
  type NominationFormMeta,
  type TierMeta,
} from "@/config/nominate2026/forms";
import { EDI_MATRIX_GENERIC } from "@/config/nominate2026/ediMatrix";
import { getCategoryContent } from "@/config/nominate2026/categoryContent";

/* ────────────────────────────────────────────────────────────────────────── */
/* Per-tier presentation (icon + verification description + governance badge) */
/* Copy is drawn verbatim from the master hub prompt, Sections 2 & 6.        */
/* ────────────────────────────────────────────────────────────────────────── */

interface TierPresentation {
  icon: typeof Trophy;
  verificationDescription: string;
  governanceBadge: string;
  governanceIcon: typeof Crown;
}

const TIER_PRESENTATION: Record<TierSlug, TierPresentation> = {
  "africa-education-icon": {
    icon: Trophy,
    verificationDescription:
      "The only tier reviewed by the 27-member Judges Arena and Grand Jury — lifetime recognition (2006–2026) for Enablers of Education for All Across Africa. Judged, not voted.",
    governanceBadge: "27 Judges · 9 Laureates",
    governanceIcon: Crown,
  },
  "influencer-education-impact": {
    icon: Users,
    verificationDescription:
      "Not a competition. No judges, no public voting. Verified entirely by the Nominee Research Corps against the category EDI Matrix, with Governance approval.",
    governanceBadge: "NRC-Verified Only",
    governanceIcon: BadgeCheck,
  },
  platinum: {
    icon: Landmark,
    verificationDescription:
      "Institutional recognition. No judges, no voting, no competition. Multiple organisations may be recognised in the same category after Nominee Research Corps verification and Governance approval.",
    governanceBadge: "NRC-Verified Only",
    governanceIcon: BadgeCheck,
  },
  "gold-blue-garnet": {
    icon: Building2,
    verificationDescription:
      "Entirely evidence-based. No judges, no voting, no ranking. Multiple organisations may be recognised per category, region, or sector.",
    governanceBadge: "NRC-Verified Only",
    governanceIcon: BadgeCheck,
  },
};

/* ────────────────────────────────────────────────────────────────────────── */

function CategoryCard({ form }: { form: NominationFormMeta }) {
  const content = getCategoryContent(form.category);
  const title = content?.hero.h1 ?? form.title;
  return (
    <Link
      to={form.route}
      className="group flex h-full flex-col rounded-xl border border-[#2b3140] bg-[#15181f] p-5 transition hover:border-gold/60 hover:bg-[#1a1e28]"
    >
      <div className="mb-2 text-xs uppercase tracking-wide text-gold/70">
        {form.selectorLabel}
      </div>
      <div className="font-playfair text-lg leading-snug text-foreground group-hover:text-gold">
        {title}
      </div>
      <p className="mt-2 text-xs text-foreground/65">{form.purpose}</p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
        Start Nomination
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function TierSection({ tier }: { tier: TierMeta }) {
  const forms = getFormsByTier(tier.slug);
  const pres = TIER_PRESENTATION[tier.slug];
  const Icon = pres.icon;
  const GovIcon = pres.governanceIcon;
  return (
    <section
      id={`tier-${tier.order}`}
      className="border-b border-gold/10 py-14 md:py-20"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold/80">
              <Icon className="h-4 w-4" />
              Tier {tier.order}
            </div>
            <h2 className="font-playfair text-2xl leading-tight text-gold sm:text-3xl md:text-4xl">
              {tier.name}
            </h2>
            <p className="mt-3 text-sm text-foreground/80 md:text-base">
              {pres.verificationDescription}
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-fit shrink-0 gap-1.5 border-gold/50 px-3 py-1.5 text-xs text-gold"
          >
            <GovIcon className="h-3.5 w-3.5" />
            {pres.governanceBadge}
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((f) => (
            <CategoryCard key={f.id} form={f} />
          ))}
        </div>

        {tier.slug === "africa-education-icon" && (
          <p className="mt-5 text-xs text-foreground/60">
            Africa Education Icon nomination is already live — this card links straight to the existing form.
          </p>
        )}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

export default function NominateHub2026() {
  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>Public Nomination | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Choose the recognition tier and category that matches who or what you're nominating. Four tiers, eighteen dedicated forms, category-specific EDI Matrices — no account required to begin."
        />
      </Helmet>

      {/* Announcement (spec §2) */}
      <div className="border-b border-gold/20 bg-black/40">
        <div className="container mx-auto px-4 py-2 text-center text-xs sm:text-sm text-gold">
          Public Nominations Open · 30 August 2026 — NESA-Africa 2026
        </div>
      </div>

      {/* Policy bar (spec §2 — retained verbatim) */}
      <div className="border-b border-gold/10 bg-[#0f1116]">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 px-4 py-2 text-center text-[11px] text-foreground/70 sm:text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" />
          <span>
            Sponsorship, partnership, donations, endorsements, and visibility
            opportunities do not influence nominees, judges, finalists,
            laureate selection, or winners.
          </span>
          <Link to="/policy" className="text-gold underline-offset-2 hover:underline">
            Read policy
          </Link>
        </div>
      </div>

      {/* Intro block (spec §2 verbatim) */}
      <section className="border-b border-gold/15 bg-gradient-to-b from-black/60 to-charcoal">
        <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            NESA-Africa 2026
          </div>
          <h1 className="font-playfair text-3xl leading-tight text-gold sm:text-4xl md:text-5xl">
            Public Nomination
          </h1>
          <p className="mt-4 max-w-3xl text-base text-foreground/80 sm:text-lg">
            Choose the recognition tier and category that matches who or what
            you're nominating. Each of the 18 award categories below has its own
            dedicated nomination form, with its own subcategory pathways,
            evidence requirements, and Education Development Index (EDI)
            Matrix — built specifically for that category rather than one
            generic form for everything.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-foreground/65">
            4 Recognition Tiers · 18 Main Categories · 1 judged tier — Africa
            Education Icon only · No account required to begin any form
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <a href="#tier-1">
                Choose a category
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/nominees">Explore existing nominees</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-gold hover:bg-gold/10"
            >
              <a href="#edi-standards">View EDI Matrix standards</a>
            </Button>
          </div>

          <div className="mt-8 flex gap-3 rounded-lg border border-gold/20 bg-black/30 p-3 text-xs text-foreground/75 sm:max-w-xl">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>
              No account is required to begin. You'll create or confirm your
              free account only when submitting your nomination.
            </span>
          </div>
        </div>
      </section>

      {/* Four inline tier sections (spec §2) */}
      {TIERS_META.map((tier) => (
        <TierSection key={tier.slug} tier={tier} />
      ))}

      {/* EDI standards */}
      <section id="edi-standards" className="border-b border-gold/10 bg-black/30 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
            Education Development Index (EDI) Matrix
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground/70">
            Every category is assessed against ten evidence-driven indicators.
            Category-specific matrices adapt the emphasis, but the standard
            below is the shared foundation.
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

      {/* Final CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
            Ready to nominate?
          </h2>
          <p className="mt-3 text-sm text-foreground/75">
            The New Education Standard Award Africa recognises Enablers of
            Education for All Across Africa through verified educational
            impact — not popularity. Only the Africa Education Icon Award
            involves independent judges.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <a href="#tier-1">
                Choose a category
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/nominees">Browse existing nominees</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
