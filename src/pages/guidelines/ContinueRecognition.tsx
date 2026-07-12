/**
 * Continue Recognition — Update Impact for NESA-Africa 2026
 * (formerly "Re-Nomination Guidelines")
 *
 * Route: /guidelines/renomination (kept for backwards compatibility)
 * Visible language repositioned around impact updates, evidence,
 * and certificate eligibility for non–Blue Garnet recognition tracks.
 */

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExistingNomineesInline } from "@/components/nominees/ExistingNomineesInline";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RefreshCcw,
  ShieldCheck,
  Award,
  Search,
  FileText,
  CheckCircle2,
  ClipboardCheck,
  Sparkles,
  TrendingUp,
  Vote,
  Users,
  Link2,
  Video,
  Newspaper,
  Quote,
  Building2,
  HeartHandshake,
  ArrowRight,
  Download,
  Clock,
  AlertCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// Content data
// ─────────────────────────────────────────────────────────

const HERO_CTAS = [
  { label: "Update Impact", href: "/nominate?mode=renominate", primary: true, icon: RefreshCcw },
  { label: "Explore Existing Nominees", href: "/nominees", icon: Users },
  { label: "Check Certificate Eligibility", href: "/dashboard/nominations", icon: ShieldCheck },
];

const PATHWAYS = [
  {
    title: "Blue Garnet Categories",
    badge: "Voting-Driven",
    cta: { label: "Vote", href: "/vote" },
    icon: Vote,
    accent: "border-blue-500/30 bg-blue-500/5",
    badgeClass: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    points: [
      "Public voting decides finalists",
      "AGC participation rewards apply",
      "Competitive recognition route",
      "Two-stage Blue Garnet scoring",
    ],
  },
  {
    title: "Other Recognition Categories",
    badge: "Impact-Update Driven",
    cta: { label: "Update Impact", href: "/nominate?mode=renominate" },
    icon: RefreshCcw,
    accent: "border-gold/40 bg-gold/5",
    badgeClass: "border-gold/40 text-gold bg-gold/10",
    points: [
      "Updated evidence strengthens the record",
      "Category relevance reviewed by NRC",
      "Recognition threshold checked",
      "Certificate subcategory applies",
    ],
  },
];

const BENEFITS = [
  { icon: TrendingUp, title: "Keep profiles current", body: "Add new achievements as nominees grow." },
  { icon: FileText, title: "Improve evidence quality", body: "Stronger proof means stronger recognition." },
  { icon: ShieldCheck, title: "Confirm relevance", body: "Reaffirm category fit for 2026 review." },
  { icon: Award, title: "Support certificate eligibility", body: "Help nominees meet the recognition threshold." },
  { icon: HeartHandshake, title: "Strengthen public trust", body: "Transparent, evidence-based updates." },
  { icon: Sparkles, title: "Prepare future recognition", body: "Set the record up for next cycles." },
];

const STEPS = [
  {
    step: 1,
    title: "Find Existing Nominee",
    description: "Search or browse by category, region, country, or impact type.",
    icon: Search,
  },
  {
    step: 2,
    title: "Update Impact",
    description: "Add new contributions, achievements, projects, media links, or supporting documents.",
    icon: RefreshCcw,
  },
  {
    step: 3,
    title: "Submit Evidence",
    description: "Provide links, reports, media coverage, videos, project pages, or community validation.",
    icon: FileText,
  },
  {
    step: 4,
    title: "Review & Verification",
    description: "NESA-Africa reviews the update for accuracy, category fit, and evidence quality.",
    icon: ClipboardCheck,
  },
  {
    step: 5,
    title: "Recognition Status Updated",
    description: "The nominee profile is refreshed with verified impact information.",
    icon: CheckCircle2,
  },
  {
    step: 6,
    title: "Certificate Eligibility",
    description: "If the recognition threshold is met, certificate download is unlocked.",
    icon: Award,
  },
];

const CERTIFICATE_STAGES = [
  { label: "Certificate Pending", icon: Clock, tone: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
  { label: "Impact Update Needed", icon: AlertCircle, tone: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
  { label: "Recognition Under Review", icon: ClipboardCheck, tone: "text-sky-400 border-sky-400/30 bg-sky-400/10" },
  { label: "Certificate Eligible", icon: ShieldCheck, tone: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  { label: "Download Recognition Certificate", icon: Download, tone: "text-gold border-gold/40 bg-gold/10" },
];

const EVIDENCE_TYPES = [
  { icon: Link2, label: "Project & portfolio links" },
  { icon: Video, label: "Videos & recorded talks" },
  { icon: Newspaper, label: "Media articles & press coverage" },
  { icon: FileText, label: "Reports & impact briefs" },
  { icon: Quote, label: "Testimonials & endorsements" },
  { icon: Building2, label: "Organization pages" },
  { icon: HeartHandshake, label: "Community & social impact evidence" },
  { icon: Sparkles, label: "Approved photos & visuals" },
];

const FAQ = [
  {
    q: "Is this the same as nominating again?",
    a: "No. This process helps update an existing nominee's impact record, add new evidence, and support continued recognition for NESA-Africa 2026.",
  },
  {
    q: "Why do existing nominees need impact updates?",
    a: "Education impact evolves. Updates ensure profiles reflect the most recent achievements, projects, and community contributions.",
  },
  {
    q: "Does updating impact guarantee a certificate?",
    a: "No. Certificate eligibility depends on review, evidence quality, category relevance, and the required recognition threshold.",
  },
  {
    q: "Who can submit an update?",
    a: "Supporters, organizations, volunteers, partners, nominee representatives, or members of the public may submit updated evidence where relevant.",
  },
  {
    q: "What evidence is accepted?",
    a: "Verifiable proof such as project links, media coverage, reports, videos, testimonials, organization pages, and approved photos.",
  },
  {
    q: "What happens after submission?",
    a: "Your update enters a review queue. The NRC validates accuracy, category fit, and evidence quality before merging it into the nominee record.",
  },
  {
    q: "Can a nominee be updated more than once?",
    a: "Yes. Multiple updates are welcome — they strengthen the profile and improve the chance of meeting recognition thresholds.",
  },
  {
    q: "How does this affect voting?",
    a: "Updates do not replace votes. For Blue Garnet categories, voting still decides finalists. Other categories follow the impact-update subcategory.",
  },
  {
    q: "Why do Blue Garnet categories use Vote instead?",
    a: "Blue Garnet categories are competitive voting categories. Other recognition categories use impact updates and review to support certificate eligibility.",
  },
  {
    q: "When can certificates be downloaded?",
    a: "Once a nominee reaches the eligible status after review, the certificate becomes available from their profile and dashboard.",
  },
];

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────

export default function ContinueRecognition() {
  return (
    <>
      <Helmet>
        <title>Update Impact & Continue Recognition | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Learn how to update existing nominee impact records, support continued recognition, and help nominees progress toward certificate eligibility for NESA-Africa 2026."
        />
        <meta
          name="keywords"
          content="NESA-Africa recognition, update nominee impact, education changemakers Africa, certificate eligibility, NESA-Africa 2026, existing nominees, award recognition"
        />
        <link rel="canonical" href="/guidelines/renomination" />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-ivory">
        {/* ────────── HERO ────────── */}
        <section className="relative overflow-hidden border-b border-gold/15">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-charcoal to-charcoal" />
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="container relative mx-auto px-5 py-12 sm:py-16 md:py-20 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-gold/10 text-gold border border-gold/30 uppercase tracking-[0.18em] text-[10px]">
                NESA-Africa 2026 · Recognition Subcategory
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                Update Impact &{" "}
                <span className="text-gold">Continue Recognition</span>
              </h1>
              <p className="mx-auto max-w-2xl text-ivory/75 text-sm sm:text-base md:text-lg leading-relaxed">
                Support a nominee&apos;s continued recognition by updating their education impact,
                evidence, category relevance, and certificate eligibility for NESA-Africa 2026.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                {HERO_CTAS.map((cta) => (
                  <Button
                    key={cta.label}
                    asChild
                    size="lg"
                    className={
                      cta.primary
                        ? "bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 min-h-[48px]"
                        : "bg-charcoal-light/70 border border-gold/30 text-ivory hover:bg-gold/10 hover:text-gold rounded-full gap-2 min-h-[48px]"
                    }
                    variant={cta.primary ? "default" : "outline"}
                  >
                    <Link to={cta.href}>
                      <cta.icon className="h-4 w-4" />
                      {cta.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ────────── WHAT THIS MEANS ────────── */}
        <section className="container mx-auto px-5 py-12 max-w-4xl">
          <Card className="bg-charcoal-light/60 border-gold/15">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-gold/30 text-gold bg-gold/10 mb-1">
                What This Means
              </Badge>
              <CardTitle className="font-display text-2xl md:text-3xl text-ivory">
                This is <span className="text-gold">not</span> duplicate nomination.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-ivory/80 text-sm md:text-base leading-relaxed">
              <p>
                For NESA-Africa, not all categories are <strong className="text-ivory">Blue Garnet voting categories</strong>.
                Blue Garnet categories are voting-driven.
              </p>
              <p>
                Other recognition categories use the <strong className="text-gold">Update Impact / Continue Recognition</strong>{" "}
                pathway to confirm continued relevance, strengthen evidence, and help nominees meet the required
                recognition or certificate-eligibility threshold.
              </p>
              <p>
                You are not simply re-submitting the same nominee — you are helping{" "}
                <strong className="text-ivory">update and validate</strong> the nominee&apos;s education impact journey for 2026.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ────────── VOTING VS RECOGNITION ────────── */}
        <section className="container mx-auto px-5 py-12 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Voting vs Recognition Subcategories
            </h2>
            <p className="text-ivory/65 text-sm md:text-base max-w-2xl mx-auto">
              Two clear routes — choose the one that matches the nominee&apos;s category.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {PATHWAYS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className={`h-full border ${p.accent}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-11 w-11 rounded-xl bg-charcoal/50 border border-ivory/10 flex items-center justify-center">
                        <p.icon className="h-5 w-5 text-ivory" />
                      </div>
                      <Badge variant="outline" className={p.badgeClass}>
                        {p.badge}
                      </Badge>
                    </div>
                    <CardTitle className="font-display text-xl text-ivory">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-ivory/80">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full">
                      <Link to={p.cta.href}>
                        {p.cta.label} <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ────────── WHY UPDATE IMPACT ────────── */}
        <section className="container mx-auto px-5 py-12 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Why Update Impact?</h2>
            <p className="text-ivory/65 text-sm md:text-base">
              Every update strengthens the credibility of African education recognition.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <Card key={b.title} className="bg-charcoal-light/60 border-gold/15">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center mb-3">
                    <b.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-ivory mb-1">{b.title}</h3>
                  <p className="text-ivory/65 text-sm leading-relaxed">{b.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ────────── HOW IT WORKS ────────── */}
        <section className="container mx-auto px-5 py-12 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">How It Works</h2>
            <p className="text-ivory/65 text-sm md:text-base">A six-step journey from update to recognition.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full bg-charcoal-light/60 border-gold/15 hover:border-gold/40 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                        <s.icon className="h-5 w-5 text-gold" />
                      </div>
                      <span className="text-3xl font-display font-bold text-gold/40">
                        {s.step.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-ivory mb-1">{s.title}</h3>
                    <p className="text-ivory/65 text-sm leading-relaxed">{s.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ────────── CERTIFICATE PATHWAY ────────── */}
        <section className="container mx-auto px-5 py-12 max-w-4xl">
          <Card className="bg-gradient-to-br from-gold/10 via-charcoal-light/60 to-charcoal-light/60 border-gold/30">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-gold/40 text-gold bg-gold/10 mb-1">
                Certificate Eligibility Pathway
              </Badge>
              <CardTitle className="font-display text-2xl md:text-3xl text-ivory">
                From update to <span className="text-gold">download</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ivory/75 text-sm md:text-base mb-6 leading-relaxed">
                For non–Blue Garnet recognition categories, nominees may need updated impact evidence, public support,
                category relevance, and admin verification before certificate download is enabled.
              </p>
              <div className="space-y-2">
                {CERTIFICATE_STAGES.map((stage, i) => (
                  <div
                    key={stage.label}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${stage.tone}`}
                  >
                    <span className="text-xs font-bold opacity-70 w-6">{(i + 1).toString().padStart(2, "0")}</span>
                    <stage.icon className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-sm flex-1">{stage.label}</span>
                    {i < CERTIFICATE_STAGES.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 opacity-50 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ────────── EVIDENCE ────────── */}
        <section className="container mx-auto px-5 py-12 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              What Evidence Can Be Submitted?
            </h2>
            <p className="text-ivory/65 text-sm md:text-base">
              Strong, verifiable proof improves review outcomes.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {EVIDENCE_TYPES.map((e) => (
              <div
                key={e.label}
                className="rounded-xl border border-gold/15 bg-charcoal-light/60 p-4 flex flex-col items-start gap-2 hover:border-gold/40 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <e.icon className="h-4 w-4 text-gold" />
                </div>
                <p className="text-ivory/85 text-sm font-medium leading-snug">{e.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ────────── FAQ ────────── */}
        <section className="container mx-auto px-5 py-12 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Frequently Asked</h2>
            <p className="text-ivory/65 text-sm md:text-base">
              Clear answers about the impact-update and recognition process.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border border-gold/15 rounded-xl bg-charcoal-light/60 px-4"
              >
                <AccordionTrigger className="text-left text-ivory hover:text-gold font-medium text-sm md:text-base py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-ivory/75 text-sm leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ────────── FINAL CTA ────────── */}
        <section className="container mx-auto px-5 py-14 max-w-4xl">
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/15 via-charcoal-light to-charcoal-light p-8 md:p-10 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
              Help Keep Africa&apos;s Education Impact Records{" "}
              <span className="text-gold">Current</span>
            </h2>
            <p className="text-ivory/75 text-sm md:text-base max-w-2xl mx-auto mb-7">
              Every verified update strengthens transparency, supports certificate eligibility,
              and powers the recognition of education changemakers across Africa and the diaspora.
            </p>
            <div className="mb-7 text-left">
              <ExistingNomineesInline
                limit={9}
                title="Explore Existing Nominees"
                subtitle="Nominees already recognised — update their impact or recommend again."
              />
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                <Link to="/nominate?mode=renominate">
                  <RefreshCcw className="h-4 w-4" /> Update Impact Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-ivory/20 text-ivory hover:bg-ivory/5 rounded-full gap-2">
                <Link to="/categories">
                  <Award className="h-4 w-4" /> View Award Categories
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
