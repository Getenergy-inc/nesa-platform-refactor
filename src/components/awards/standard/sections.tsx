// Shared premium award-page section library.
// Visual standard: Africa Education Icon Award 2006–2026 (/awards/africa-education-icon).
// Used by every Tier / Pillar / Category page so the system feels unified.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  Award,
  Users,
  FileCheck,
  Eye,
  Scale,
  Gavel,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

// ─────────────────────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────────────────────

export type AwardCta = { label: string; href: string };
export type AwardStat = { label: string; value: string | number };

export type Subcategory = {
  slug: string;
  title: string;
  blurb: string;
  recognises?: string;
  viewHref?: string;
  nominateHref: string;
  /** Geographic scope label e.g. "Africa Regional" / "Nigeria" / "International". */
  scope?: string;
  /** Number of subcategories within this category. */
  subcategoryCount?: number;
  /** Vote split label e.g. "60% jury / 40% public". */
  voteSplit?: string;
};

export type HallNominee = {
  id: string | number;
  name: string;
  href: string;
  country?: string;
  region?: string;
  classification?: string;
  subcategory?: string;
  summary?: string;
  image?: string;
  verified?: boolean;
  isOrganisation?: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO
// ─────────────────────────────────────────────────────────────────────────────

export function AwardHeroStandard({
  pageSlug,
  badge,
  title,
  titleAccent,
  subhead,
  lead,
  stats,
  primaryCta,
  secondaryCta,
  trustLine,
}: {
  pageSlug: string;
  badge: string;
  title: string;
  titleAccent?: string;
  subhead?: string;
  lead?: string;
  stats?: AwardStat[];
  primaryCta?: AwardCta;
  secondaryCta?: AwardCta;
  trustLine?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-black via-charcoal to-charcoal-light">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, hsl(42 85% 52%) 0, transparent 45%), radial-gradient(circle at 85% 80%, hsl(42 85% 52%) 0, transparent 45%)",
        }}
      />
      <div className="container relative mx-auto px-4 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <Badge
            variant="outline"
            className="mb-5 border-gold/40 bg-gold/5 px-3 py-1 text-gold inline-flex items-center gap-1.5"
          >
            <Sparkles className="h-3 w-3" />
            {badge}
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            {title}
            {titleAccent && <> <span className="text-gold">{titleAccent}</span></>}
          </h1>
          {subhead && (
            <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-white/80">
              {subhead}
            </p>
          )}
          {lead && (
            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-white/65">
              {lead}
            </p>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {stats.slice(0, 4).map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-gold/20 bg-white/[0.03] px-3 py-3"
                >
                  <div className="font-display text-2xl font-bold text-gold">{m.value}</div>
                  <div className="text-[11px] text-white/60 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {primaryCta && (
                <Button
                  asChild
                  size="lg"
                  className="bg-gold text-charcoal hover:bg-gold/90"
                  onClick={() =>
                    trackEvent("award_page_cta_click", {
                      page: pageSlug,
                      section: "hero",
                      cta_label: primaryCta.label,
                      destination: primaryCta.href,
                    })
                  }
                >
                  <Link to={primaryCta.href}>
                    {primaryCta.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {secondaryCta && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-white hover:bg-gold/10"
                  onClick={() =>
                    trackEvent("award_page_cta_click", {
                      page: pageSlug,
                      section: "hero",
                      cta_label: secondaryCta.label,
                      destination: secondaryCta.href,
                    })
                  }
                >
                  <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          )}

          {trustLine && (
            <p className="mt-6 text-xs text-white/55 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              {trustLine}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. WHAT THIS RECOGNISES
// ─────────────────────────────────────────────────────────────────────────────

export function WhatThisRecognises({
  heading = "What This Award Recognises",
  body,
}: {
  heading?: string;
  body: string;
}) {
  return (
    <section className="py-14 lg:py-20">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
          For first-time visitors
        </span>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
          {heading}
        </h2>
        <p className="mt-5 text-base md:text-lg text-white/75 leading-relaxed">
          {body}
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. WHO THIS IS FOR
// ─────────────────────────────────────────────────────────────────────────────

export function WhoIsThisFor({
  canBeNominated,
  shouldNotBeNominated,
  evidence,
  region,
  pathway,
}: {
  canBeNominated: string[];
  shouldNotBeNominated: string[];
  evidence?: string[];
  region?: string;
  pathway?: string;
}) {
  return (
    <section className="border-y border-gold/10 bg-black/30 py-14 lg:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
            Eligibility
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
            Who This Category Is For
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="font-display text-lg font-semibold text-white">
                Who can be nominated
              </h3>
            </div>
            <ul className="space-y-2">
              {canBeNominated.map((e) => (
                <li key={e} className="text-white/80 text-sm flex gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.04] p-6">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-rose-400" />
              <h3 className="font-display text-lg font-semibold text-white">
                Who should not be nominated
              </h3>
            </div>
            <ul className="space-y-2">
              {shouldNotBeNominated.map((e) => (
                <li key={e} className="text-white/80 text-sm flex gap-2">
                  <span className="text-rose-400 mt-0.5">•</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {(evidence || region || pathway) && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {evidence && (
              <div className="rounded-xl border border-gold/15 bg-charcoal-light p-5">
                <div className="text-[11px] uppercase tracking-wider text-gold font-semibold mb-2">
                  Evidence required
                </div>
                <ul className="space-y-1.5">
                  {evidence.map((e) => (
                    <li key={e} className="text-white/75 text-xs flex gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {region && (
              <div className="rounded-xl border border-gold/15 bg-charcoal-light p-5">
                <div className="text-[11px] uppercase tracking-wider text-gold font-semibold mb-2">
                  Region / Classification
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{region}</p>
              </div>
            )}
            {pathway && (
              <div className="rounded-xl border border-gold/15 bg-charcoal-light p-5">
                <div className="text-[11px] uppercase tracking-wider text-gold font-semibold mb-2">
                  Category pathway
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{pathway}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HALL OF FAME PREVIEW
// ─────────────────────────────────────────────────────────────────────────────

export function HallOfFamePreview({
  pageSlug,
  nominees,
  exploreAllHref = "/nominees",
  nominateHref = "/nominate",
  emptyMessage = "Nominee profiles for this category are being verified. You can still submit a nomination or check back soon.",
}: {
  pageSlug: string;
  nominees: HallNominee[];
  exploreAllHref?: string;
  nominateHref?: string;
  emptyMessage?: string;
}) {
  const hasNominees = nominees.length > 0;

  return (
    <section className="border-t border-gold/10 bg-black/40 py-14 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
              Hall of Fame · Preview
            </span>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
              Existing Nominees in This Category
            </h2>
            <p className="mt-3 text-white/65">
              Explore verified candidates already recognised in this category before
              submitting a nomination.
            </p>
          </div>
          {hasNominees && (
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-white hover:bg-gold/10"
              onClick={() =>
                trackEvent("award_page_cta_click", {
                  page: pageSlug,
                  section: "hall_of_fame",
                  cta_label: "Open Full Directory",
                  destination: exploreAllHref,
                })
              }
            >
              <Link to={exploreAllHref}>
                Open Full Directory <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {hasNominees ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {nominees.slice(0, 8).map((n) => (
              <Link
                key={n.id}
                to={n.href}
                onClick={() =>
                  trackEvent("hall_of_fame_card_click", {
                    page: pageSlug,
                    nominee: n.name,
                    destination: n.href,
                  })
                }
                className="group flex flex-col overflow-hidden rounded-xl border border-gold/15 bg-charcoal-light transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40 flex items-center justify-center">
                  {n.image ? (
                    <img
                      src={n.image}
                      alt={n.name}
                      loading="lazy"
                      className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
                        n.isOrganisation ? "object-contain p-4" : "object-cover"
                      }`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/images/africaicons/placeholder-icon.svg";
                      }}
                    />
                  ) : (
                    <div className="text-gold/40 font-display text-3xl">
                      {n.name
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </div>
                  )}
                  {n.verified && (
                    <Badge className="absolute top-3 right-3 bg-gold/90 text-charcoal text-[10px]">
                      <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                    </Badge>
                  )}
                  {n.classification && (
                    <Badge className="absolute top-3 left-3 bg-black/70 text-gold border border-gold/30 text-[10px]">
                      {n.classification}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display text-base font-semibold text-white group-hover:text-gold transition-colors line-clamp-2">
                    {n.name}
                  </h3>
                  {(n.country || n.region) && (
                    <div className="mt-1 text-xs text-white/55">
                      {[n.country, n.region].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  {n.summary && (
                    <p className="mt-2 text-xs text-white/65 leading-relaxed line-clamp-3 flex-1">
                      {n.summary}
                    </p>
                  )}
                  {n.subcategory && (
                    <Badge
                      variant="outline"
                      className="mt-3 self-start text-[10px] border-gold/25 text-gold/90"
                    >
                      {n.subcategory}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gold/20 bg-charcoal-light p-10 text-center">
            <Eye className="h-8 w-8 text-gold/60 mx-auto mb-3" />
            <p className="text-white/75 max-w-xl mx-auto">{emptyMessage}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to={nominateHref}>Nominate in This Category</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold/40 text-white hover:bg-gold/10"
              >
                <Link to={exploreAllHref}>Explore All Nominees</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SUBCATEGORY PATHWAYS
// ─────────────────────────────────────────────────────────────────────────────

export function SubcategoryPathways({
  pageSlug,
  subcategories,
  heading = "Subcategories & Subcategories",
  sub = "Pick the subcategory that best fits the changemaker you want to nominate.",
}: {
  pageSlug: string;
  subcategories: Subcategory[];
  heading?: string;
  sub?: string;
}) {
  if (!subcategories.length) return null;
  return (
    <section className="py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
            Category pathways
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
            {heading}
          </h2>
          <p className="mt-3 text-white/65">{sub}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-gold/20 bg-gradient-to-b from-charcoal-light to-charcoal p-6 flex flex-col hover:border-gold/45 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <Award className="h-5 w-5 text-gold" />
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {s.scope && (
                    <Badge variant="outline" className="border-gold/30 text-gold/90 text-[10px]">
                      {s.scope}
                    </Badge>
                  )}
                  {typeof s.subcategoryCount === "number" && (
                    <Badge className="bg-gold/15 text-gold border border-gold/30 text-[10px]">
                      {s.subcategoryCount} sub{s.subcategoryCount === 1 ? "" : "s"}
                    </Badge>
                  )}
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-white leading-snug">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{s.blurb}</p>
              {s.recognises && (
                <p className="mt-3 text-xs text-gold/80 italic border-l-2 border-gold/30 pl-3">
                  Recognises: {s.recognises}
                </p>
              )}
              {s.voteSplit && (
                <p className="mt-2 text-[11px] text-white/55">
                  Vote split: <span className="text-white/75">{s.voteSplit}</span>
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gold/10">
                {s.viewHref && (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-gold/30 text-white hover:bg-gold/10 h-8"
                    onClick={() =>
                      trackEvent("subcategory_card_click", {
                        page: pageSlug,
                        subcategory: s.slug,
                        action: "view",
                      })
                    }
                  >
                    <Link to={s.viewHref}>View</Link>
                  </Button>
                )}
                <Button
                  asChild
                  size="sm"
                  className="bg-gold text-charcoal hover:bg-gold/90 h-8"
                  onClick={() =>
                    trackEvent("subcategory_card_click", {
                      page: pageSlug,
                      subcategory: s.slug,
                      action: "nominate",
                    })
                  }
                >
                  <Link to={s.nominateHref}>Nominate Here</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. HOW NOMINATION WORKS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STEPS = [
  { icon: FileCheck, title: "Nominate", body: "Submit a nomination through the official form." },
  { icon: ShieldCheck, title: "Evidence Review", body: "NRC verifies records, references, and supporting evidence." },
  { icon: CheckCircle2, title: "Category Verification", body: "Nominee is classified, sorted, and confirmed against eligibility." },
  { icon: Eye, title: "Shortlist / Hall of Fame", body: "Verified nominees appear in the public Hall of Fame preview." },
  { icon: Gavel, title: "Jury & Public Participation", body: "Where applicable, jury reviews and public participation contribute to the outcome." },
  { icon: Trophy, title: "Recognition", body: "Honourees receive certificates, awards, or continental laureate status." },
];

export function HowNominationWorks({
  steps = DEFAULT_STEPS,
}: {
  steps?: { icon: typeof FileCheck; title: string; body: string }[];
}) {
  return (
    <section className="border-y border-gold/10 bg-black/30 py-14 lg:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-2xl mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
            Process
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-white">
            How Nomination Works
          </h2>
          <p className="mt-3 text-white/65">
            Six transparent stages — from nomination to recognition.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-gold/15 bg-charcoal-light p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-charcoal font-display font-bold text-sm">
                    {i + 1}
                  </div>
                  <Icon className="h-4 w-4 text-gold/70" />
                  <h3 className="font-display text-base font-semibold text-white">
                    {s.title}
                  </h3>
                </div>
                <p className="text-sm text-white/65 leading-relaxed">{s.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. INTEGRITY FIREWALL
// ─────────────────────────────────────────────────────────────────────────────

export function IntegrityFirewallBlock() {
  return (
    <section className="py-14">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 via-transparent to-transparent p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="h-5 w-5 text-gold" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
              Integrity firewall
            </span>
          </div>
          <p className="text-white/85 text-base md:text-lg leading-relaxed">
            NESA-Africa operates a strict integrity firewall. Sponsors, partners, donors,
            volunteers, judges, media teams, and contributors cannot influence nominations,
            shortlisting, judging, voting, finalists, or winners.
          </p>
          <div className="mt-5">
            <Link
              to="/about/governance"
              className="inline-flex items-center text-gold text-sm font-semibold hover:underline"
            >
              Read Governance Framework <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. FINAL CTA
// ─────────────────────────────────────────────────────────────────────────────

export function FinalAwardCTA({
  pageSlug,
  heading = "Know someone who belongs in this category?",
  body = "Nominate an education changemaker whose work deserves continental recognition.",
  primaryCta,
  secondaryCta,
}: {
  pageSlug: string;
  heading?: string;
  body?: string;
  primaryCta: AwardCta;
  secondaryCta: AwardCta;
}) {
  return (
    <section className="bg-gradient-to-b from-charcoal to-black py-16 lg:py-20">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <Users className="h-8 w-8 text-gold mx-auto mb-3" />
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
          {heading}
        </h2>
        <p className="mt-4 text-white/75 text-base md:text-lg">{body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-gold text-charcoal hover:bg-gold/90"
            onClick={() =>
              trackEvent("award_page_cta_click", {
                page: pageSlug,
                section: "final_cta",
                cta_label: primaryCta.label,
                destination: primaryCta.href,
              })
            }
          >
            <Link to={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gold/40 text-white hover:bg-gold/10"
            onClick={() =>
              trackEvent("award_page_cta_click", {
                page: pageSlug,
                section: "final_cta",
                cta_label: secondaryCta.label,
                destination: secondaryCta.href,
              })
            }
          >
            <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
