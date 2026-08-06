import { lazy, Suspense, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Crown,
  Download,
  FileCheck2,
  Gavel,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ICON_NOMINEES, ICON_SUBCATEGORIES } from "@/data/iconAward";
import { trackEvent } from "@/lib/analytics";

const IconNominationWizard = lazy(() =>
  import("@/components/awards/IconNominationWizard").then((m) => ({ default: m.IconNominationWizard })),
);

const PAGE_URL = "https://nesaafrica.lovable.app/awards/africa-education-icon";
const EDI_PDF = "/downloads/nesa-africa-2026-edi-matrix.pdf";

const PATHWAY_CARDS = [
  {
    icon: Award,
    title: "Africa Education Philanthropy Icon",
    body: "Funding, endowments, scholarships, and long-term investment in education across Africa.",
  },
  {
    icon: BookOpen,
    title: "Literary & New Curriculum Advocate Icon",
    body: "Authorship, literacy campaigns, and curriculum reform that reshape how Africa learns.",
  },
  {
    icon: Wrench,
    title: "Africa Technical Education Icon",
    body: "TVET, STEM, engineering, and digital-skills education that prepare Africa's workforce.",
  },
];

const CLASSIFICATION_CARDS = [
  { title: "African in Africa", body: "Africans resident on the continent whose work has advanced Education for All." },
  { title: "Diaspora African", body: "Africans in the diaspora sustaining education impact back on the continent." },
  { title: "Friend of Africa", body: "Non-Africans whose lifetime contribution has advanced African education." },
];

const EDI_DIMENSIONS = [
  "Lifetime education impact",
  "Scale and reach",
  "Inclusion and equity",
  "Innovation and knowledge contribution",
  "Sustainability and legacy",
  "Leadership and integrity",
  "Evidence quality",
  "Continental relevance",
];

const TIMELINE = [
  { date: "1 Aug 2026", label: "Public Nominations Open" },
  { date: "30 Aug 2026", label: "Nominations Close" },
  { date: "1–13 Sept 2026", label: "NRC Verification & Dossiers" },
  { date: "14–30 Sept 2026", label: "Judges Arena — Panel Screening" },
  { date: "1–7 Oct 2026", label: "Grand Jury Ranked-Choice Voting" },
  { date: "8–15 Oct 2026", label: "Governance Ratification" },
  { date: "13 Dec 2026", label: "Recognition Gala · Lagos, Nigeria" },
];

const FAQ = [
  {
    q: "Is there any fee to nominate?",
    a: "No. All nominations for the Africa Education Icon Award are free and open to the public.",
  },
  {
    q: "Does public voting decide the Icon Award?",
    a: "No. The Africa Education Icon Award is the only competitive NESA-Africa tier decided by an independent judging system. There is no public vote, no endorsement count, and no AGC-based unlock.",
  },
  {
    q: "How many laureates are recognised?",
    a: "Nine laureates — three per pathway, one per classification (African in Africa, Diaspora African, Friend of Africa).",
  },
  {
    q: "Do I need an account to nominate?",
    a: "No. Complete the form first. You'll only be asked to create or confirm your account at the final submission step.",
  },
  {
    q: "Can I re-nominate an existing nominee?",
    a: "Yes. Use the 'Re-Nominate an Existing Nominee' entry on the nominees preview to submit additional verified evidence.",
  },
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function AfricaEducationIcon() {
  useEffect(() => {
    trackEvent("page_view", { page: "africa-education-icon" });
  }, []);

  const featuredNominees = ICON_NOMINEES.slice(0, 6);
  const pathwayLabel = (slug: string) =>
    ICON_SUBCATEGORIES.find((s) => s.slug === slug)?.title ?? slug;

  return (
    <div className="bg-charcoal min-h-screen">
      <Helmet>
        <title>Africa Education Icon Award 2026 · NESA-Africa Lifetime Recognition</title>
        <meta
          name="description"
          content="Nominate an Africa Education Icon (2006–2026). Three lifetime pathways, three classifications, nine laureates. Public nominations open 30 August 2026."
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content="Africa Education Icon Award 2026 · NESA-Africa" />
        <meta property="og:description" content="Recognising the Enablers of Education for All Across Africa. Public nominations open 30 August 2026." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* 1. Announcement bar */}
      <div className="bg-gold text-charcoal">
        <div className="container mx-auto px-4 py-2 text-center text-xs sm:text-sm font-semibold">
          Public Nominations Open · 30 August 2026 — NESA-Africa 2026
        </div>
      </div>

      {/* 2. Hero (compact) */}
      <section className="border-b border-gold/10">
        <div className="container mx-auto px-4 py-10 md:py-14 text-center">
          <Badge className="bg-gold/15 text-gold border border-gold/40 hover:bg-gold/20">
            <Crown className="h-3.5 w-3.5 mr-1" /> Lifetime Achievement · 2006–2026
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mt-4">
            Africa Education Icon Award
          </h1>
          <p className="mt-2 text-gold text-lg font-medium">2006–2026</p>
          <p className="mt-3 text-white/85 max-w-2xl mx-auto italic">
            Recognising the Enablers of Education for All Across Africa
          </p>
          <p className="mt-4 text-white/70 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Three Lifetime Pathways · Three Classifications · Nine Laureates. The Africa Education
            Icon Award is the highest lifetime recognition under NESA-Africa, honouring individuals
            whose verified contributions have advanced Education for All across Africa between
            2006 and 2026.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-gold text-charcoal hover:bg-gold/90 rounded-full"
              onClick={() => {
                trackEvent("icon_hero_cta", { target: "nominate" });
                scrollTo("nominate");
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Start Nomination
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gold/50 text-gold hover:bg-gold/10 rounded-full"
              onClick={() => {
                trackEvent("icon_hero_cta", { target: "nominees" });
                scrollTo("nominees");
              }}
            >
              Explore Existing Nominees
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gold/50 text-gold hover:bg-gold/10 rounded-full"
              onClick={() => {
                trackEvent("icon_hero_cta", { target: "edi" });
                scrollTo("edi-matrix");
              }}
            >
              <Download className="mr-2 h-4 w-4" /> Download the EDI Matrix
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Nomination form */}
      <section id="nominate" className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
              Nominate an Africa Education Icon
            </h2>
            <p className="mt-2 text-white/70">
              Help preserve the legacy of an outstanding Enabler of Education for All Across Africa.
            </p>
          </div>
          <div className="rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 mb-6 text-sm text-white/85 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
            <span>
              Complete the form first. You'll only be asked to create or confirm your account when
              submitting the nomination. Your draft auto-saves on this device.
            </span>
          </div>
          <Suspense
            fallback={
              <div className="rounded-2xl border border-gold/20 bg-charcoal-light/40 p-8 text-center text-white/60">
                Loading nomination wizard…
              </div>
            }
          >
            <IconNominationWizard ediDownloadHref={EDI_PDF} ediViewHref="#edi-matrix" />
          </Suspense>
        </div>
      </section>

      {/* 4. Existing Nominees preview */}
      <section id="nominees" className="py-12 md:py-16 border-t border-gold/10 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Explore Existing Africa Education Icon Nominees
              </h2>
              <p className="text-white/65 mt-1 text-sm">
                Verified lifetime Enablers of Education for All Across Africa.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "All Pathways",
                "Philanthropy",
                "Literary & Curriculum",
                "Technical Education",
                "African in Africa",
                "Diaspora African",
                "Friend of Africa",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-[11px] text-white/85"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredNominees.map((n) => (
              <Link
                key={n.id}
                to={`/nominees/africa-education-icon-award/${n.slug}`}
                className="group rounded-xl border border-gold/20 bg-charcoal-light/50 overflow-hidden hover:border-gold/50 transition-colors"
              >
                <div className="aspect-[4/3] bg-charcoal overflow-hidden">
                  {n.image_url ? (
                    <img
                      src={n.image_url}
                      alt={n.name}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-white/30">
                      <Users className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="border-gold/40 text-gold text-[10px]">
                      NRC Verified
                    </Badge>
                    <span className="text-[10px] text-white/50">{n.country}</span>
                  </div>
                  <div className="font-semibold text-white truncate">{n.name}</div>
                  <div className="text-xs text-gold/80 mt-0.5 truncate">
                    {pathwayLabel(n.award_subcategory_slug)}
                  </div>
                  <p className="text-xs text-white/65 mt-2 line-clamp-2">{n.impact_summary}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/nominees/africa-education-icon-award">View All Nominees</Link>
            </Button>
            <Button
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
              onClick={() => scrollTo("nominate")}
            >
              Add Supporting Evidence
            </Button>
            <Button
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
              onClick={() => scrollTo("nominate")}
            >
              Re-Nominate an Existing Nominee
            </Button>
          </div>
        </div>
      </section>

      {/* 5. About the Award */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            About the Africa Education Icon Award
          </h2>
          <div className="prose prose-invert max-w-none text-white/75">
            <p>
              The Africa Education Icon Award is the highest lifetime recognition under the
              New Education Standard Award Africa (NESA-Africa). Established as a 20-year retrospective
              (2006–2026), it honours Enablers of Education for All Across Africa — individuals
              whose sustained, verified contributions have shaped how the continent teaches, learns,
              and invests in its next generations.
            </p>
            <p>
              It is the only competitive NESA-Africa tier decided by an independent judging system.
              Recognition is earned through verified impact — not popularity, endorsements, or votes.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Recognition Framework (classifications) */}
      <section className="py-12 md:py-16 border-t border-gold/10 bg-black/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Recognition Framework — Three Classifications
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {CLASSIFICATION_CARDS.map((c) => (
              <Card key={c.title} className="p-5 border-gold/20 bg-charcoal-light/50">
                <div className="font-display text-lg text-gold">{c.title}</div>
                <p className="text-sm text-white/70 mt-2">{c.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Three Lifetime Recognition Pathways */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Three Lifetime Recognition Pathways
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PATHWAY_CARDS.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className="p-6 border-gold/20 bg-charcoal-light/50">
                  <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/30 grid place-items-center mb-3">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="font-display text-lg text-white">{p.title}</div>
                  <p className="text-sm text-white/70 mt-2">{p.body}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. EDI Matrix */}
      <section id="edi-matrix" className="py-12 md:py-16 border-t border-gold/10 bg-black/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Education Development Index (EDI) Matrix
              </h2>
              <p className="text-white/65 mt-1 text-sm">
                The eight dimensions used to assess every Icon nominee.
              </p>
            </div>
            <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
              <a href={EDI_PDF} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download EDI Matrix PDF
              </a>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {EDI_DIMENSIONS.map((d, i) => (
              <div key={d} className="rounded-xl border border-gold/20 bg-charcoal-light/50 p-4">
                <div className="text-gold text-xs font-bold">EDI · {String(i + 1).padStart(2, "0")}</div>
                <div className="text-white font-semibold mt-1 text-sm">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NRC verification */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 grid place-items-center shrink-0">
              <FileCheck2 className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Nominee Research Corps (NRC) Verification
              </h2>
              <p className="text-white/75 mt-3">
                Every nomination is independently verified by the Nominee Research Corps. The NRC checks
                identity, duplicates, evidence integrity, and continental relevance before a nominee
                enters the Judges Arena. This layer is what makes the Africa Education Icon Award a
                recognition of verified lifetime impact — not visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Judges Arena */}
      <section className="py-12 md:py-16 border-t border-gold/10 bg-black/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 grid place-items-center shrink-0">
              <Gavel className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Judges Arena — 27 Independent Judges, 9 Specialist Panels
              </h2>
              <p className="text-white/75 mt-3">
                The Judges Arena is a secure, jury-only chamber. 27 Independent Judges are assigned
                across 9 Specialist Panels (three per pathway, one per classification). Panels screen
                and shortlist. The Grand Jury then confirms the 9 laureates through ranked-choice voting.
              </p>
              <Button asChild variant="outline" className="mt-4 border-gold/40 text-gold hover:bg-gold/10">
                <Link to="/judges">
                  Learn about the Judges Arena <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. 2026 season timeline */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
            2026 Season Timeline
          </h2>
          <ol className="relative border-l border-gold/25 pl-5 space-y-4">
            {TIMELINE.map((t) => (
              <li key={t.date}>
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-gold" />
                <div className="text-gold text-xs font-semibold flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" /> {t.date}
                </div>
                <div className="text-white text-sm mt-0.5">{t.label}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 12. Governance and Integrity */}
      <section className="py-12 md:py-16 border-t border-gold/10 bg-black/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 grid place-items-center shrink-0">
              <ScrollText className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Governance and Integrity
              </h2>
              <ul className="mt-3 space-y-2 text-white/75 text-sm">
                {[
                  "Judges declare conflicts of interest and recuse where needed.",
                  "All ballots are locked, hashed, and audit-logged.",
                  "Results require Governance Board ratification before laureates are announced.",
                  "Every decision is traceable through an immutable audit trail.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="border-gold/15">
                <AccordionTrigger className="text-white hover:text-gold text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/75">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 14. Final CTA */}
      <section className="py-12 md:py-16 border-t border-gold/10 bg-black/30">
        <motion.div
          className="container mx-auto px-4 max-w-3xl text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Know an Education Enabler whose lifetime impact should be preserved?
          </h2>
          <p className="text-white/75 mt-3">
            Nominate them today and help preserve their legacy for future generations.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              size="lg"
              className="bg-gold text-charcoal hover:bg-gold/90 rounded-full"
              onClick={() => {
                trackEvent("icon_final_cta", { target: "nominate" });
                scrollTo("nominate");
              }}
            >
              Start the Nomination <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
              <Link to="/nominate?category=africa-education-icon-award">Recommend a Candidate</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
              <Link to="/judges">Become an Independent Judge</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
              <Link to="/nominees/africa-education-icon-award">Explore Existing Nominees</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
              <a href={EDI_PDF} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download the EDI Matrix
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 15. Footer integrity statement */}
      <section className="py-8 border-t border-gold/15 bg-charcoal">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
            The Africa Education Icon Award is the only competitive recognition tier under the New
            Education Standard Award Africa (NESA-Africa). Every nominee is independently verified by
            the Nominee Research Corps, assessed using the Education Development Index Matrix,
            reviewed by independent judges, and approved through a transparent governance process.
            Recognition is based on verified educational impact — not popularity.
          </p>
        </div>
      </section>
    </div>
  );
}
