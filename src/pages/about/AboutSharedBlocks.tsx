// AboutSharedBlocks — shared institutional-register components for the
// four About NESA-Africa pages. Design register blends Nobel Prize
// (process transparency, "facts in numbers"), Academy Awards (season
// gravitas, spotlight for the flagship), and AU/UN (formal declaration,
// seal-anchored hero, continental scope). All styling uses existing
// design tokens (gold, charcoal, ivory) — no new visual identity.

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, Download, Trophy, Award, Users, Globe2, Calendar, FileText, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import governanceDisclaimerAsset from "@/assets/docs/nesa-africa-governance-non-influence-disclaimer.pdf.asset.json";

export const GOVERNANCE_DISCLAIMER_PDF_URL = governanceDisclaimerAsset.url;
export const GOVERNANCE_DISCLAIMER_PDF_FILENAME = governanceDisclaimerAsset.original_filename;

/* ─────────────────────────────────────────────────────────────
   1. SEAL-ANCHORED HERO (AU/UN register)
   ───────────────────────────────────────────────────────────── */
export interface AboutSealHeroProps {
  eyebrow: string;
  title: ReactNode;
  positioning: string;
  cyclePhase: string;
  primaryCta: { label: string; href: string; icon?: "nominate" | "notify" | "read" };
  secondaryCta?: { label: string; href: string };
}

const CTA_ICON = { nominate: Award, notify: Calendar, read: FileText } as const;

export function AboutSealHero({ eyebrow, title, positioning, cyclePhase, primaryCta, secondaryCta }: AboutSealHeroProps) {
  const Icon = CTA_ICON[primaryCta.icon ?? "read"];
  return (
    <header className="relative bg-charcoal border-b border-gold/20 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 30%, hsl(var(--gold)) 0, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--gold)) 0, transparent 40%)" }} />
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl relative">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Seal */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-gold/60 flex items-center justify-center bg-charcoal-light/40 shadow-lg shadow-gold/10">
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-gold" aria-hidden />
              </div>
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] text-gold/70 uppercase whitespace-nowrap bg-charcoal px-2">NESA · Africa</span>
          </div>
          <div className="space-y-3 mt-4">
            <p className="text-[11px] tracking-[0.28em] uppercase text-gold/80 font-semibold">{eyebrow}</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory leading-tight">{title}</h1>
            <p className="text-ivory/70 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">{positioning}</p>
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5 font-medium tracking-wide">
            {cyclePhase}
          </Badge>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
              <Link to={primaryCta.href}>
                <Icon className="mr-2 h-5 w-5" />
                {primaryCta.label}
              </Link>
            </Button>
            {secondaryCta && (
              <Button asChild size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8">
                <a href={secondaryCta.href}>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  {secondaryCta.label}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. STAT STRIP (Nobel "Prize in Numbers" register)
   ───────────────────────────────────────────────────────────── */
export interface AboutStat {
  value: string;
  label: string;
  sub?: string;
}

export function AboutStatStrip({ stats, title = "The Cycle in Numbers" }: { stats: AboutStat[]; title?: string }) {
  return (
    <section aria-label={title} className="bg-charcoal-light/20 border-y border-gold/15 py-10 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gold/70 text-center mb-6">{title}</p>
        <dl className={cn("grid gap-6 text-center", stats.length <= 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6")}>
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-gold/30 pl-4 text-left first:border-l-0 md:border-l-2 md:first:border-l-2">
              <dt className="font-display text-3xl md:text-4xl font-bold text-gold leading-none">{s.value}</dt>
              <dd className="text-ivory/85 text-sm font-semibold mt-2">{s.label}</dd>
              {s.sub && <p className="text-ivory/55 text-xs mt-1">{s.sub}</p>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. RECOGNITION TIERS (Oscar-style, flagship dominant)
   ───────────────────────────────────────────────────────────── */
export interface RecognitionTier {
  key: string;
  name: string;
  positioning: string;
  forms: string;
  governancePath: string;
  flagship?: boolean;
}

export function AboutRecognitionTiers({ tiers, footerCta }: { tiers: RecognitionTier[]; footerCta?: { label: string; href: string } }) {
  const flagship = tiers.find((t) => t.flagship);
  const rest = tiers.filter((t) => !t.flagship);
  return (
    <section aria-label="Recognition tiers" className="bg-charcoal py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gold/70">Recognition Framework</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory">Four Tiers · Eighteen Forms</h2>
          <p className="text-ivory/70 text-sm md:text-base">One flagship award; three supporting Certificate of Recognition tiers.</p>
        </div>

        {flagship && (
          <article className="relative rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 via-charcoal-light/40 to-charcoal-light/20 p-6 md:p-8 shadow-xl shadow-gold/5">
            <Badge className="absolute -top-3 left-6 bg-gold text-charcoal font-bold tracking-wider">FLAGSHIP</Badge>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7 text-gold" />
              </div>
              <div className="flex-1 min-w-[240px] space-y-2">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory">{flagship.name}</h3>
                <p className="text-ivory/85 text-base leading-relaxed">{flagship.positioning}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm">
                  <span className="text-gold"><strong>Forms:</strong> <span className="text-ivory/85">{flagship.forms}</span></span>
                  <span className="text-gold"><strong>Governance:</strong> <span className="text-ivory/85">{flagship.governancePath}</span></span>
                </div>
              </div>
            </div>
          </article>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {rest.map((t) => (
            <article key={t.key} className="rounded-xl border border-gold/20 bg-charcoal-light/25 p-5 hover:border-gold/40 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-gold" />
                <h3 className="font-display text-lg font-bold text-ivory">{t.name}</h3>
              </div>
              <p className="text-ivory/75 text-sm leading-relaxed mb-3">{t.positioning}</p>
              <div className="text-xs space-y-1 pt-3 border-t border-gold/10">
                <p className="text-gold"><strong>Forms:</strong> <span className="text-ivory/80">{t.forms}</span></p>
                <p className="text-gold"><strong>Governance:</strong> <span className="text-ivory/80">{t.governancePath}</span></p>
              </div>
            </article>
          ))}
        </div>

        {footerCta && (
          <div className="text-center pt-2">
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
              <Link to={footerCta.href}>
                {footerCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. PROCESS PIPELINE (Nobel + AU register)
   ───────────────────────────────────────────────────────────── */
export interface PipelineStage {
  step: string;
  title: string;
  detail: string;
  iconOnly?: boolean;
}

export function AboutProcessPipeline({ stages, note }: { stages: PipelineStage[]; note?: string }) {
  return (
    <section aria-label="Recognition pipeline" className="bg-charcoal-light/15 border-y border-gold/15 py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 space-y-2">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gold/70">Process & Governance</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory">How Recognition Advances</h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {stages.map((s, i) => (
            <li key={s.step} className="relative">
              <div className="rounded-lg border border-gold/25 bg-charcoal p-4 h-full">
                <span className="text-[10px] tracking-[0.2em] text-gold/70 uppercase">Stage {i + 1}</span>
                <p className="font-display text-gold font-bold text-sm mt-1">{s.step}</p>
                <p className="text-ivory font-semibold text-sm mt-2">{s.title}</p>
                <p className="text-ivory/65 text-xs mt-1 leading-relaxed">{s.detail}</p>
              </div>
              {i < stages.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" aria-hidden />
              )}
            </li>
          ))}
        </ol>
        {note && <p className="text-center text-ivory/60 text-xs italic mt-6 max-w-3xl mx-auto">{note}</p>}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. CYCLE TIMELINE (Awards-season + Nobel-calendar hybrid)
   ───────────────────────────────────────────────────────────── */
export interface TimelinePhase {
  phaseName: string;
  window: string;
  events: Array<{ date: string; title: string; detail?: string }>;
  status: "past" | "active" | "upcoming" | "unconfirmed";
  spotlight?: boolean;
}

const STATUS_STYLES = {
  past: "border-ivory/20 bg-ivory/[0.02] text-ivory/50",
  active: "border-gold/60 bg-gold/10 text-ivory",
  upcoming: "border-gold/25 bg-charcoal-light/30 text-ivory/90",
  unconfirmed: "border-dashed border-ivory/20 bg-ivory/[0.02] text-ivory/50",
} as const;

export function AboutCycleTimeline({ phases, title, subtitle, footerCta }: {
  phases: TimelinePhase[];
  title: string;
  subtitle?: string;
  footerCta?: { label: string; href: string };
}) {
  return (
    <section aria-label={title} className="bg-charcoal py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10 space-y-2">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gold/70">The Road to the Gala</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory">{title}</h2>
          {subtitle && <p className="text-ivory/70 text-sm md:text-base max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        <ol className="relative border-l-2 border-gold/25 pl-6 md:pl-8 space-y-6">
          {phases.map((p, i) => (
            <li key={i} className="relative">
              <span className={cn(
                "absolute -left-[35px] md:-left-[41px] top-1 h-4 w-4 rounded-full border-2 border-charcoal",
                p.status === "active" ? "bg-gold shadow-lg shadow-gold/40" : p.status === "past" ? "bg-ivory/30" : p.status === "unconfirmed" ? "bg-charcoal border-ivory/40" : "bg-gold/50",
              )} />
              <div className={cn("rounded-xl border p-5", STATUS_STYLES[p.status], p.spotlight && "ring-1 ring-gold/40")}>
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <p className="font-display text-lg md:text-xl font-bold">{p.phaseName}</p>
                    <p className="text-xs text-gold/80 mt-0.5">{p.window}</p>
                  </div>
                  {p.spotlight && <Badge className="bg-gold text-charcoal">Spotlight</Badge>}
                  {p.status === "active" && <Badge variant="outline" className="border-gold/60 text-gold">Now</Badge>}
                  {p.status === "unconfirmed" && <Badge variant="outline" className="border-ivory/30 text-ivory/60">To be confirmed</Badge>}
                </div>
                {p.events.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {p.events.map((e, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="text-gold/80 font-semibold whitespace-nowrap min-w-[9rem]">{e.date}</span>
                        <span>
                          <span className="font-medium">{e.title}</span>
                          {e.detail && <span className="text-ivory/60"> — {e.detail}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
        {footerCta && (
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
              <Link to={footerCta.href}>
                {footerCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. GOVERNANCE / NON-INFLUENCE PROTOCOL (AU declaration block)
   ───────────────────────────────────────────────────────────── */
export function AboutGovernanceProtocol({ downloadHref = "/governance" }: { downloadHref?: string }) {
  return (
    <section id="non-influence-protocol" aria-labelledby="protocol-heading" className="bg-charcoal-light/25 py-16 md:py-20 border-y border-gold/20">
      <div className="container mx-auto px-4 max-w-4xl">
        <article className="relative rounded-2xl border border-gold/40 bg-charcoal p-8 md:p-10">
          <div className="absolute -top-4 left-8 flex items-center gap-2 bg-charcoal px-3">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-gold font-bold">Protocol · Declaration</span>
          </div>
          <h2 id="protocol-heading" className="font-display text-2xl md:text-3xl font-bold text-ivory mb-4 mt-2">
            Non-Influence & Integrity Declaration
          </h2>
          <div className="space-y-4 text-ivory/85 text-sm md:text-base leading-relaxed">
            <p>
              Sponsorship, donations, ticket purchases, and gala attendance do not influence nominee
              approval, judging, or Governance decisions at any tier — through the 2026 and 2027
              cycles.
            </p>
            <p>
              From 2028, the Gold-Blue Garnet Regional Certificates tier alone introduces a{" "}
              <strong className="text-gold">capped, non-monetary public engagement element</strong>,
              disclosed here in advance. The Africa Education Icon Award and Platinum Certificates of
              Recognition remain fully verification-based, with no public voting, indefinitely.
            </p>
            <p>
              Every submission passes through eligibility review, evidence review, duplicate checks,
              verification, and governance/judging review before any recognition is granted. No
              submission automatically becomes a finalist, winner, or honouree.
            </p>
            <p className="text-ivory/70 text-xs italic pt-2 border-t border-gold/15">
              This declaration is co-published on this page and on the Governance & Integrity page.
              Board members serve under SCEF's Conflict of Interest Policy with signed declarations
              on file.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full">
              <a
                href={GOVERNANCE_DISCLAIMER_PDF_URL}
                download={GOVERNANCE_DISCLAIMER_PDF_FILENAME}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Governance & Non-Influence Disclaimer as PDF"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Download Disclaimer (PDF)
              </a>
            </Button>
            <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full">
              <Link to={downloadHref}>
                <Download className="mr-2 h-4 w-4" />
                View full Governance & Integrity
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. CONTACT / PARTICIPATION CTA BLOCK
   ───────────────────────────────────────────────────────────── */
export function AboutContactBlock({
  primaryCta,
  secondaryCta,
  headline = "Engage with the Cycle",
  intro,
}: {
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  headline?: string;
  intro?: string;
}) {
  return (
    <section aria-labelledby="contact-heading" className="bg-charcoal py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gold/70">Participate</p>
          <h2 id="contact-heading" className="font-display text-3xl md:text-4xl font-bold text-ivory">{headline}</h2>
          {intro && <p className="text-ivory/70 max-w-2xl mx-auto">{intro}</p>}
        </div>
        <div className="grid gap-3 md:grid-cols-3 max-w-3xl mx-auto text-sm text-ivory/75">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-gold/20 bg-charcoal-light/25 p-3">
            <Users className="w-4 h-4 text-gold" /> Nominate · Judge · Volunteer
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-gold/20 bg-charcoal-light/25 p-3">
            <Globe2 className="w-4 h-4 text-gold" /> 15 Regions · 8 Africa + 7 Global
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-gold/20 bg-charcoal-light/25 p-3">
            <Calendar className="w-4 h-4 text-gold" /> Gala · 14 Dec 2026 · Lagos
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
            <Link to={primaryCta.href}>{primaryCta.label}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          {secondaryCta && (
            <Button asChild size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8">
              <a href={secondaryCta.href}>{secondaryCta.label}</a>
            </Button>
          )}
        </div>
        <p className="text-ivory/60 text-xs pt-6 border-t border-gold/10 max-w-2xl mx-auto">
          19 Godwin Okigbo Street, Marsha, Surulere, Lagos, Nigeria · +234 805 667 7770 ·{" "}
          <a href="mailto:info@nesa.africa" className="text-gold underline">info@nesa.africa</a>
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shared canonical data — reused across cycle pages
   ───────────────────────────────────────────────────────────── */
export const CANONICAL_TIERS: RecognitionTier[] = [
  {
    key: "icon",
    name: "Africa Education Icon Award",
    positioning: "Competitive, judge-reviewed lifetime achievement recognition. Nine Laureates per cycle, drawn from 27 Grand Jury finalists across three lifetime pathways and three classifications. Rolling 20-year window; can be won only once in a lifetime.",
    forms: "1 (3 pathways × 3 classifications)",
    governancePath: "NRC → EDI → Judges → Grand Jury → Governance",
    flagship: true,
  },
  {
    key: "influencer",
    name: "Influencer Education Impact",
    positioning: "Non-competitive recognition across sport, music, and social media.",
    forms: "1 (3 pathways)",
    governancePath: "NRC → EDI → Governance",
  },
  {
    key: "platinum",
    name: "Platinum Certificates of Recognition",
    positioning: "Non-competitive recognition across seven institutional forms.",
    forms: "7",
    governancePath: "NRC → EDI → Governance",
  },
  {
    key: "gold",
    name: "Gold-Blue Garnet Regional Certificates",
    positioning: "Non-competitive recognition across nine corporate, NGO, and regional forms.",
    forms: "9",
    governancePath: "NRC → EDI → Governance (no voting until 2028)",
  },
];

export const CANONICAL_PIPELINE: PipelineStage[] = [
  { step: "Submission", title: "Public Nomination", detail: "Any tier · self-check gate · non-influence disclaimer" },
  { step: "NRC", title: "Verification", detail: "Data Entry → Automated Review → Human Review" },
  { step: "EDI Matrix", title: "Weighted Scoring", detail: "Category-specific standard across 10 dimensions" },
  { step: "Judges Arena", title: "Panel + Grand Jury", detail: "Icon Award only · 27 judges · 9 panels" },
  { step: "Finalists", title: "TV Show Reveals", detail: "Two online shows · Certificate + Icon finalists" },
  { step: "Ratification", title: "Gala Recognition", detail: "Governance-ratified Laureates + Certificates presented" },
];
