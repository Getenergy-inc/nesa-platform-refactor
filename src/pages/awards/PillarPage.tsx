// Dynamic page for /awards/pillars/:slug
// Reads pillar data from src/data/pillars.ts and renders shared template.

import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPillar, PILLARS } from "@/data/pillars";
import { PillarFooterNote } from "@/components/awards/pillars/PillarFooterNote";
import { trackEvent } from "@/lib/analytics";

const SITE = "https://nesaafrica.lovable.app";

function track(slug: string, section: string, label: string, destination: string) {
  trackEvent("pillar_cta_click", {
    pillar: slug,
    section,
    cta_label: label,
    destination,
  });
}

export default function PillarPage() {
  const { slug = "" } = useParams();
  const pillar = getPillar(slug);

  if (!pillar) return <Navigate to="/awards/pillars" replace />;

  const Icon = pillar.icon;
  const url = `${SITE}/awards/pillars/${pillar.slug}`;

  return (
    <>
      <Helmet>
        <title>{`${pillar.pageTitle} | NESA-Africa 2026`}</title>
        <meta name="description" content={pillar.heroHeadline + " " + pillar.sellLine} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${pillar.pageTitle} | NESA-Africa 2026`} />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE },
              { "@type": "ListItem", position: 2, name: "Awards", item: `${SITE}/awards` },
              { "@type": "ListItem", position: 3, name: "Recognition Pillars", item: `${SITE}/awards/pillars` },
              { "@type": "ListItem", position: 4, name: pillar.pageTitle, item: url },
            ],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-gold/15">
          <div className={`absolute inset-0 bg-gradient-to-br ${pillar.accent} pointer-events-none`} />
          <div className="container relative z-10 mx-auto px-4 py-16 md:py-24 max-w-5xl">
            <nav className="text-xs text-ivory/55 mb-6">
              <Link to="/awards" className="hover:text-gold">Awards</Link>
              <span className="mx-2">/</span>
              <Link to="/awards/pillars" className="hover:text-gold">Pillars</Link>
              <span className="mx-2">/</span>
              <span className="text-ivory/80">Pillar {pillar.number}</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-5">
              <Icon className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold text-gold uppercase tracking-[0.18em]">
                Pillar {pillar.number} of 7
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-3xl md:text-5xl font-bold text-ivory leading-tight mb-4"
            >
              {pillar.heroHeadline}
            </motion.h1>

            <p className="text-gold/90 text-base md:text-lg italic mb-6">{pillar.sellLine}</p>

            <div className="space-y-3 text-ivory/80 text-sm md:text-base leading-relaxed max-w-3xl">
              {pillar.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full"
                onClick={() =>
                  track(pillar.slug, "hero", pillar.nominationCta.label, pillar.nominationCta.href)
                }
              >
                <Link to={pillar.nominationCta.href}>
                  {pillar.nominationCta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 rounded-full"
                onClick={() => track(pillar.slug, "hero", pillar.sponsorCta.label, pillar.sponsorCta.href)}
              >
                <Link to={pillar.sponsorCta.href}>{pillar.sponsorCta.label}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ELIGIBILITY */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h2 className="font-display text-xl font-bold text-ivory">Who Is Eligible?</h2>
                </div>
                <ul className="space-y-2">
                  {pillar.eligible.map((e) => (
                    <li key={e} className="text-ivory/80 text-sm flex gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-rose-400" />
                  <h2 className="font-display text-xl font-bold text-ivory">Who Is Not Eligible?</h2>
                </div>
                <ul className="space-y-2">
                  {pillar.notEligible.map((e) => (
                    <li key={e} className="text-ivory/80 text-sm flex gap-2">
                      <span className="text-rose-400">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHY THIS PILLAR EXISTS */}
        <section className="py-14 md:py-20 bg-charcoal-light/20 border-y border-gold/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
              Why this pillar exists
            </span>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-ivory mb-5">
              The case for recognition.
            </h2>
            <div className="space-y-4 text-ivory/80 text-base md:text-lg leading-relaxed">
              {pillar.whyExists.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* SUBCATEGORIES */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-10 text-center">
              <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
                Recognition pathways
              </span>
              <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-ivory">
                Subcategories within this pillar
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pillar.subcategories.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rounded-2xl border border-gold/20 hover:border-gold/60 bg-charcoal-light/40 p-5 md:p-6 transition-all flex flex-col"
                >
                  <Award className="h-5 w-5 text-gold mb-3" />
                  <h3 className="font-display text-lg font-bold text-ivory mb-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-ivory/70 text-sm leading-relaxed mb-4 flex-1">
                    {s.description}
                  </p>
                  {s.certificateTagline && (
                    <p className="text-gold/80 text-xs italic mb-4 border-l-2 border-gold/40 pl-3">
                      {s.certificateTagline}
                    </p>
                  )}
                  <Link
                    to={s.href}
                    onClick={() => track(pillar.slug, "subcategory", s.cta, s.href)}
                    className="inline-flex items-center gap-2 text-gold text-sm font-semibold hover:underline"
                  >
                    {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* RECIPIENT BENEFITS (only when present) */}
        {pillar.recipientBenefits && (
          <section className="py-14 md:py-20 bg-charcoal-light/20 border-y border-gold/10">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center mb-8">
                <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
                  What recipients receive
                </span>
                <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-ivory">
                  Recognition you can carry.
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pillar.recipientBenefits.map((b) => (
                  <div
                    key={b}
                    className="rounded-xl border border-gold/20 bg-charcoal/60 px-4 py-3 text-center text-ivory/85 text-sm"
                  >
                    {b}
                  </div>
                ))}
              </div>
              {pillar.extraNote && (
                <p className="mt-6 text-center text-ivory/70 text-sm italic max-w-2xl mx-auto">
                  {pillar.extraNote}
                </p>
              )}
            </div>
          </section>
        )}

        {/* SPONSORSHIP POSITIONING */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-transparent to-transparent p-6 md:p-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-gold" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
                  Sponsorship positioning
                </span>
              </div>
              <p className="text-ivory text-lg md:text-xl font-display leading-snug mb-6">
                {pillar.sponsorPositioning}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full"
                  onClick={() => track(pillar.slug, "sponsor", pillar.sponsorCta.label, pillar.sponsorCta.href)}
                >
                  <Link to={pillar.sponsorCta.href}>{pillar.sponsorCta.label}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 rounded-full"
                  onClick={() =>
                    track(pillar.slug, "sponsor", pillar.nominationCta.label, pillar.nominationCta.href)
                  }
                >
                  <Link to={pillar.nominationCta.href}>{pillar.nominationCta.label}</Link>
                </Button>
              </div>
              <p className="mt-5 text-ivory/55 text-xs leading-relaxed">
                Sponsorship does not influence nominations, voting, judging, shortlisting,
                finalists or winners.
              </p>
            </div>
          </div>
        </section>

        {/* HASHTAGS */}
        <section className="py-10 border-t border-gold/10">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <span className="text-[10px] uppercase tracking-[0.22em] text-gold/80 font-semibold">
              Share this pillar
            </span>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {pillar.hashtags.map((h) => (
                <span
                  key={h}
                  className="px-3 py-1 rounded-full bg-white/5 border border-gold/20 text-ivory/85 text-xs"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </section>

        <PillarFooterNote />
      </div>
    </>
  );
}
