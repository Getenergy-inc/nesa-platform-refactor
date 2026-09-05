// About NESA-Africa — the canonical source-of-truth page.
// Structure follows the approved 18-section hierarchy. Copy lives in
// src/data/aboutNesaAfrica.ts. Tone: evidence-first, integrity-focused.

import { AboutSeo } from "@/pages/about/AboutSeo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Award,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  ChevronRight,
  Compass,
  Database,
  Globe,
  GraduationCap,
  Handshake,
  Landmark,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import africanSchoolImage from "@/assets/african-school-classroom.jpg";
import { trackEvent } from "@/lib/analytics";
import { CVOMessageSection } from "@/components/nesa/CVOMessageSection";
import { PageFAQSection } from "@/components/nesa/PageFAQ";
import {
  ABOUT_BRAND,
  ABOUT_ECOSYSTEM,
  ABOUT_EDI_CRITERIA,
  ABOUT_ENABLER_TYPES,
  ABOUT_FIREWALL_ITEMS,
  ABOUT_NRC_QUESTIONS,
  ABOUT_PATHWAY_STEPS,
  ABOUT_PROCESS,
  ABOUT_PROMISE,
  ABOUT_PURPOSE_LINES,
  ABOUT_REACH,
  ABOUT_TAKE_PART,
  ABOUT_TIERS,
  ABOUT_WORK_ITEMS,
} from "@/data/aboutNesaAfrica";

/* ── Shared primitives ─────────────────────────────────────────── */

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  alt = false,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-28 border-t border-gold/10 ${alt ? "bg-charcoal-light" : "bg-charcoal"}`}
    >
      <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={`${id}-heading`}
          className="mt-3 font-display text-2xl font-bold leading-tight text-ivory md:text-4xl"
        >
          {title}
        </h2>
        {lede ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ivory/75 md:text-lg">
            {lede}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

function TickList({ items, columns = 2 }: { items: readonly string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-ivory/80 md:text-base">
          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FlowRail({ steps, label }: { steps: readonly string[]; label: string }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory/60">
        {label}
      </p>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs font-medium text-ivory md:text-sm">
              <span className="mr-1.5 text-gold">{i + 1}</span>
              {step}
            </span>
            {i < steps.length - 1 ? (
              <ChevronRight className="h-4 w-4 text-gold/50" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

const PATHWAY_LINE = ABOUT_BRAND.pathway.join(" → ");

/* ── Page ──────────────────────────────────────────────────────── */

export default function About() {
  return (
    <>
      <AboutSeo
        title="About NESA-Africa | Recognising Africa’s Education Enablers"
        description="NESA-Africa — The African Blue-Garnet Awards for Recognising Africa’s Education Enablers. A continental recognition, verification, storytelling and impact platform. Evidence-first, with a strict Integrity Firewall: recognition cannot be bought."
        path="/about"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      {/* ─── 1. HERO ──────────────────────────────────────── */}
      <section className="relative flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={africanSchoolImage}
            alt="African students learning in a classroom"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/70" />
        </div>

        <div className="container relative z-10 mx-auto max-w-5xl px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2">
              <GraduationCap className="h-4 w-4 text-gold" aria-hidden="true" />
              <span className="text-sm font-medium text-gold">Since 2006 · Vision 2035</span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-ivory md:text-5xl lg:text-6xl">
              About NESA-<span className="text-gold">Africa</span>
            </h1>
            <p className="mt-4 text-lg font-medium text-gold/90 md:text-xl">
              {ABOUT_BRAND.tagline}
            </p>

            <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-ivory/80 md:text-lg">
              <p>
                {ABOUT_BRAND.name} (NESA-Africa) is a continental education recognition,
                verification, storytelling and impact platform. We identify, document, celebrate
                and connect the individuals and institutions enabling Education for All across
                Africa.
              </p>
              <p>
                Known as <strong className="text-ivory">{ABOUT_BRAND.alias}</strong>, NESA-Africa
                goes beyond an annual ceremony. It creates a structured pathway:
              </p>
            </div>

            <p className="mt-5 rounded-xl border border-gold/25 bg-gold/5 px-5 py-4 font-display text-sm font-semibold tracking-wide text-gold md:text-base">
              {PATHWAY_LINE}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gold px-7 font-semibold text-charcoal hover:bg-gold-dark"
              >
                <Link
                  to="/nominate"
                  onClick={() =>
                    trackEvent("about_cta_click", {
                      section: "hero",
                      cta_label: "Nominate an Education Enabler",
                      destination: "/nominate",
                      page: "/about",
                    })
                  }
                >
                  <Award className="mr-2 h-5 w-5" aria-hidden="true" />
                  Nominate an Education Enabler
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-gold/50 px-7 text-gold hover:bg-gold/10"
              >
                <Link
                  to="/nominees"
                  onClick={() =>
                    trackEvent("about_cta_click", {
                      section: "hero",
                      cta_label: "Explore the Impact Directory",
                      destination: "/nominees",
                      page: "/about",
                    })
                  }
                >
                  <ArrowRight className="mr-2 h-5 w-5" aria-hidden="true" />
                  Explore the Impact Directory
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. OUR PURPOSE ───────────────────────────────── */}
      <Section
        id="purpose"
        eyebrow="Our Purpose"
        title="Why NESA-Africa Exists"
        lede="Across Africa, thousands of people and organisations quietly make education possible."
      >
        <div className="grid gap-10 md:grid-cols-2">
          <ul className="space-y-2 border-l-2 border-gold/30 pl-5">
            {ABOUT_PURPOSE_LINES.map((line) => (
              <li key={line} className="text-sm leading-relaxed text-ivory/75 md:text-base">
                {line}
              </li>
            ))}
          </ul>
          <div>
            <p className="text-base leading-relaxed text-ivory/80">
              Many of these <strong className="text-gold">Education Enablers</strong> operate for
              years without adequate continental recognition, documentation, visibility or
              connection to the partnerships that could scale their impact. NESA-Africa exists to
              change that.
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              Our work is to:
            </p>
            <div className="mt-4">
              <TickList items={ABOUT_WORK_ITEMS} columns={1} />
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 3 & 4. VISION / MISSION ──────────────────────── */}
      <section
        id="vision-mission"
        aria-labelledby="vision-mission-heading"
        className="scroll-mt-28 border-t border-gold/10 bg-charcoal-light"
      >
        <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
          <h2 id="vision-mission-heading" className="sr-only">
            Vision and Mission
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-gold/20 bg-charcoal p-7">
              <Compass className="h-6 w-6 text-gold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl font-bold text-ivory">Vision</h3>
              <p className="mt-4 text-base leading-relaxed text-ivory/80">
                An Africa where every genuine Education Enabler can be seen, verified and
                supported.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                We envision a continent where recognition strengthens credibility, visibility,
                partnerships, investment, collaboration and measurable Education for All outcomes.
              </p>
            </article>
            <article className="rounded-2xl border border-gold/20 bg-charcoal p-7">
              <Target className="h-6 w-6 text-gold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl font-bold text-ivory">Mission</h3>
              <p className="mt-4 text-base leading-relaxed text-ivory/80">
                To operate a credible, transparent and evidence-driven continental platform that
                identifies and verifies Education Enablers, celebrates outstanding contributions to
                education, amplifies their impact stories, and connects recognition to
                opportunities capable of expanding educational access and quality across Africa.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── 5. WHO IS AN EDUCATION ENABLER ───────────────── */}
      <Section
        id="education-enabler"
        eyebrow="Definition"
        title="Who Is an Education Enabler?"
        lede="An Education Enabler is any individual or institution whose actions create, expand, finance, improve, protect or sustain opportunities for people to learn. An Education Enabler does not have to be a teacher or education professional."
      >
        <div className="flex flex-wrap gap-2">
          {ABOUT_ENABLER_TYPES.map((type) => (
            <span
              key={type}
              className="rounded-full border border-gold/25 bg-gold/5 px-4 py-2 text-xs text-ivory/85 md:text-sm"
            >
              {type}
            </span>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            The defining question is simple
          </p>
          <p className="mt-3 font-display text-lg text-ivory md:text-xl">
            What has this person or institution actually done to enable Africans to access,
            receive, improve or benefit from education?
          </p>
          <p className="mt-3 text-sm text-ivory/70">
            Recognition is based on verified contribution and evidence — not popularity.
          </p>
        </div>
      </Section>

      {/* ─── 6. RECOGNITION FRAMEWORK ─────────────────────── */}
      <Section
        id="recognition-framework"
        eyebrow="NESA-Africa 2026"
        title="Recognition Framework — Four Tiers"
        alt
      >
        <div className="grid gap-5 md:grid-cols-2">
          {ABOUT_TIERS.map((tier) => (
            <article
              key={tier.id}
              className="flex flex-col rounded-2xl border border-gold/20 bg-charcoal p-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                {tier.tier}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-ivory">{tier.title}</h3>
              {tier.kicker ? (
                <p className="mt-1 text-sm italic text-gold/85">{tier.kicker}</p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-ivory/75">{tier.body}</p>

              {tier.pathways ? (
                <ul className="mt-4 space-y-3 border-t border-gold/10 pt-4">
                  {tier.pathways.map((p) => (
                    <li key={p.name} className="text-sm">
                      <span className="font-semibold text-ivory">{p.name}</span>
                      <span className="block text-ivory/65">{p.detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {tier.note ? (
                <p className="mt-4 rounded-lg border border-gold/15 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-ivory/75">
                  {tier.note}
                </p>
              ) : null}

              <Link
                to={tier.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
                onClick={() =>
                  trackEvent("about_cta_click", {
                    section: "recognition_framework",
                    cta_label: tier.title,
                    destination: tier.href,
                    page: "/about",
                  })
                }
              >
                View {tier.title} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* ─── 7. HOW RECOGNITION WORKS ─────────────────────── */}
      <Section
        id="how-recognition-works"
        eyebrow="Process"
        title="How Recognition Works — Evidence Before Recognition"
        lede="Every pathway begins with nomination and rigorous verification."
      >
        <div className="space-y-8">
          <FlowRail steps={ABOUT_PROCESS.shared} label="All four tiers" />
          <FlowRail steps={ABOUT_PROCESS.tier1} label="Africa Education Icon Award (Tier 1)" />
          <FlowRail steps={ABOUT_PROCESS.tiers234} label="Tiers 2, 3 & 4" />
        </div>
      </Section>

      {/* ─── 8. NRC ───────────────────────────────────────── */}
      <Section
        id="nrc"
        eyebrow="Verification"
        title="The Nominee Research Corps (NRC)"
        lede="Research. Verify. Protect Credibility. The NRC is NESA-Africa's research and verification system. Its role is not to create fame or manufacture candidates."
        alt
      >
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Its role is to establish:
        </p>
        <TickList items={ABOUT_NRC_QUESTIONS} />
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ivory/75 md:text-base">
          The NRC combines data entry, automated review (identity matching, duplicate detection,
          source analysis) and independent human review. Artificial intelligence may assist
          research, but final verification decisions remain subject to accountable human review.
        </p>
        <Link
          to="/nrc"
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
        >
          <Search className="h-4 w-4" aria-hidden="true" /> Inside the NRC
        </Link>
      </Section>

      {/* ─── 9. EDI ───────────────────────────────────────── */}
      <Section
        id="edi"
        eyebrow="Assessment"
        title="Education Development Index (EDI)"
        lede="The EDI provides the structured evidence framework used during NRC assessment. Depending on category, it evaluates:"
      >
        <TickList items={ABOUT_EDI_CRITERIA} />
        <p className="mt-6 text-sm leading-relaxed text-ivory/70 md:text-base">
          EDI supports consistent, evidence-based recognition rather than popularity-based
          selection.
        </p>
      </Section>

      {/* ─── 10. INTEGRITY FIREWALL ───────────────────────── */}
      <section
        id="integrity-firewall"
        aria-labelledby="integrity-firewall-heading"
        className="scroll-mt-28 border-y border-gold/30 bg-charcoal-light"
      >
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
          <div className="rounded-3xl border border-gold/40 bg-gold/5 p-7 md:p-10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-gold" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Our Integrity Firewall
              </p>
            </div>
            <h2
              id="integrity-firewall-heading"
              className="mt-4 font-display text-3xl font-bold text-ivory md:text-4xl"
            >
              Recognition Cannot Be Bought
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ivory/80">
              NESA-Africa maintains a strict institutional and technical separation between
              recognition decisions and commercial or fundraising relationships. Sponsorship,
              donations, partnerships, advertising, ticket purchases, merchandise or any other
              financial relationship do <strong className="text-gold">not</strong> influence:
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {ABOUT_FIREWALL_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-gold/20 bg-charcoal px-4 py-3 text-sm text-ivory/85"
                >
                  <Scale className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/governance"
              className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
            >
              Read the governance &amp; non-influence protocol{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 11. IMPACT DIRECTORY ─────────────────────────── */}
      <Section
        id="impact-directory"
        eyebrow="Documentation"
        title="The Africa Education Impact Directory"
        lede="NESA-Africa is building a structured, searchable record of verified Education Enablers across Africa."
      >
        <p className="max-w-3xl text-sm leading-relaxed text-ivory/75 md:text-base">
          The Directory preserves and makes discoverable evidence of contributions by individuals,
          organisations, NGOs, companies, schools, universities, governments, foundations,
          faith-based organisations, development partners, media, EdTech programmes, diaspora
          associations and Friends of Africa. It transforms recognition from a one-night event into
          lasting education-impact intelligence.
        </p>
        <Button
          asChild
          className="mt-6 rounded-full bg-gold font-semibold text-charcoal hover:bg-gold-dark"
        >
          <Link to="/nominees">
            <Database className="mr-2 h-4 w-4" aria-hidden="true" />
            Open the Impact Directory
          </Link>
        </Button>
      </Section>

      {/* ─── 12. RECOGNITION TO IMPACT ────────────────────── */}
      <Section
        id="recognition-to-impact"
        eyebrow="The Pathway"
        title="From Recognition to Impact"
        lede="Recognition is only the beginning."
        alt
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_PATHWAY_STEPS.map((step, i) => (
            <li key={step.step} className="rounded-2xl border border-gold/20 bg-charcoal p-5">
              <span className="font-display text-3xl font-bold text-gold/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-ivory">{step.step}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ivory/70">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── 13. SCEF ECOSYSTEM ───────────────────────────── */}
      <Section
        id="scef-ecosystem"
        eyebrow="Parent Ecosystem"
        title="The SCEF Ecosystem"
        lede="NESA-Africa operates within the broader education-impact ecosystem of Santos Creations Educational Foundation (SCEF)."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_ECOSYSTEM.map((item) => (
            <Link
              key={item.platform}
              to={item.href}
              className="group rounded-2xl border border-gold/20 bg-charcoal-light p-5 transition hover:border-gold/50"
            >
              <Landmark className="h-5 w-5 text-gold" aria-hidden="true" />
              <h3 className="mt-3 font-display text-base font-bold text-ivory group-hover:text-gold">
                {item.platform}
              </h3>
              <p className="mt-1 text-sm text-ivory/70">{item.focus}</p>
            </Link>
          ))}
        </div>
        <p className="mt-7 rounded-xl border border-gold/25 bg-gold/5 px-5 py-4 text-sm font-semibold tracking-wide text-gold md:text-base">
          Recognition → Knowledge → Advocacy → Resources → Intervention → Measurable Impact
        </p>
      </Section>

      {/* ─── 14. CONTINENTAL REACH ────────────────────────── */}
      <Section
        id="continental-reach"
        eyebrow="Coverage"
        title="Continental Reach"
        lede="NESA-Africa is designed as a continental and global-African recognition ecosystem covering:"
        alt
      >
        <TickList items={ABOUT_REACH} />
        <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-ivory/70 md:text-base">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
          Geographic representation never replaces evidence. Every candidate must demonstrate a
          genuine contribution to Education for All.
        </p>
      </Section>

      {/* ─── 15. NESA-AFRICA 2026 ─────────────────────────── */}
      <Section
        id="nesa-africa-2026"
        eyebrow="Current Cycle"
        title="NESA-Africa 2026"
        lede="The current recognition cycle culminates in the NESA-Africa Recognition Gala in Lagos, Nigeria on 13 December 2026."
      >
        <p className="max-w-3xl text-sm leading-relaxed text-ivory/75 md:text-base">
          The cycle combines public nomination, NRC verification, EDI assessment, Africa Education
          Icon judging, media storytelling, EduAid-Africa webinars, partnership mobilisation,
          continental documentation and post-recognition legacy programmes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-gold/50 text-gold hover:bg-gold/10"
          >
            <Link to="/about/timeline">
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              View the 2026 timeline
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full text-ivory/80 hover:bg-gold/10 hover:text-ivory"
          >
            <Link to="/about/2026">Cycle details</Link>
          </Button>
        </div>
      </Section>

      {/* ─── 16. GOVERNANCE & STRATEGIC ALIGNMENT ─────────── */}
      <Section
        id="governance-alignment"
        eyebrow="Accountability"
        title="Governance & Strategic Alignment"
        lede="NESA-Africa operates under published principles covering transparency, conflict of interest, safeguarding, data protection, anti-bribery, evidence integrity, independent verification, accountable judging, and strict separation of recognition from commercial influence."
        alt
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gold/20 bg-charcoal p-6">
            <BookOpenCheck className="h-5 w-5 text-gold" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg font-bold text-ivory">
              UN Sustainable Development Goal 4
            </h3>
            <p className="mt-1 text-sm text-ivory/70">Quality Education</p>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-charcoal p-6">
            <Globe className="h-5 w-5 text-gold" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg font-bold text-ivory">
              African Union Agenda 2063
            </h3>
            <p className="mt-1 text-sm text-ivory/70">Continental development framework</p>
          </div>
        </div>
        <Link
          to="/governance"
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
        >
          Governance &amp; Integrity <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Section>

      {/* ─── 17. OUR JOURNEY & PROMISE ────────────────────── */}
      <Section
        id="journey-promise"
        eyebrow="History"
        title="Our Journey & Promise"
        lede="NESA-Africa's vision developed from the long-standing education advocacy work of Santos Creations Educational Foundation. The 2006–2026 period represents 20 years of education-impact vision. NESA-Africa 2026 consolidates that history into a structured continental recognition and impact platform."
      >
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Our Promise — we will continue building an ecosystem where:
        </p>
        <TickList items={ABOUT_PROMISE} />
      </Section>

      {/* ─── CVO leadership message ───────────────────────── */}
      <CVOMessageSection />

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <PageFAQSection />

      {/* ─── 18. TAKE PART ────────────────────────────────── */}
      <section
        id="take-part"
        aria-labelledby="take-part-heading"
        className="scroll-mt-28 border-t border-gold/10 bg-charcoal"
      >
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
            Take Part
          </p>
          <h2
            id="take-part-heading"
            className="mt-3 font-display text-3xl font-bold text-ivory md:text-4xl"
          >
            Help Identify the People and Institutions Enabling Education Across Africa
          </h2>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {ABOUT_TAKE_PART.map((item, i) => (
              <Link
                key={item.title}
                to={item.href}
                onClick={() =>
                  trackEvent("about_cta_click", {
                    section: "take_part",
                    cta_label: item.title,
                    destination: item.href,
                    page: "/about",
                  })
                }
                className="group flex items-start gap-4 rounded-2xl border border-gold/20 bg-charcoal-light p-6 transition hover:border-gold/50"
              >
                {[Award, Database, Handshake, Users].map((Icon, idx) =>
                  idx === i ? (
                    <Icon key={idx} className="mt-0.5 h-6 w-6 shrink-0 text-gold" aria-hidden="true" />
                  ) : null,
                )}
                <span>
                  <span className="block font-display text-lg font-bold text-ivory group-hover:text-gold">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm text-ivory/70">{item.detail}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 border-t border-gold/15 pt-8 text-center">
            <p className="font-display text-lg font-bold text-ivory">{ABOUT_BRAND.name}</p>
            <p className="mt-1 text-sm italic text-gold/90">{ABOUT_BRAND.alias}</p>
            <p className="mt-1 text-sm text-ivory/70">{ABOUT_BRAND.tagline}</p>
            <p className="mt-4 text-xs font-semibold tracking-wide text-gold md:text-sm">
              {PATHWAY_LINE}
            </p>
            <p className="mt-4 text-xs text-ivory/55">{ABOUT_BRAND.ecosystemNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
