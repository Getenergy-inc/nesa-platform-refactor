// /awards/pillars — overview of the 7 NESA-Africa recognition pillars.

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PILLARS } from "@/data/pillars";
import { PillarFooterNote } from "@/components/awards/pillars/PillarFooterNote";
import { trackEvent } from "@/lib/analytics";

const SITE = "https://nesaafrica.lovable.app";

export default function PillarsHub() {
  return (
    <>
      <Helmet>
        <title>The 7 Recognition Pillars | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Every force building African education deserves a stage. Explore the 7 NESA-Africa Recognition Pillars — from Africa Education Icons to Social Media Education Champions."
        />
        <link rel="canonical" href={`${SITE}/awards/pillars`} />
        <meta property="og:title" content="The 7 Recognition Pillars | NESA-Africa 2026" />
        <meta property="og:url" content={`${SITE}/awards/pillars`} />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        {/* HERO */}
        <section className="relative py-20 md:py-28 border-b border-gold/15 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-blue-900/20 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-5">
              <Trophy className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold text-gold uppercase tracking-[0.18em]">
                NESA-Africa Award Categories
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-4"
            >
              Every Force Building African Education{" "}
              <span className="text-gold">Deserves a Stage.</span>
            </motion.h1>
            <p className="text-ivory/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-4">
              The NESA-Africa Awards recognise the people and organisations enabling
              Education for All across Africa — from lifetime icons and corporate CSR
              leaders to diaspora champions, EdTech innovators, funders, institutions,
              media voices, and social advocates.
            </p>
            <p className="text-ivory/65 text-sm md:text-base max-w-3xl mx-auto mb-8">
              Rather than overwhelming visitors with long category lists, the awards are
              organised into <span className="text-gold font-semibold">seven recognition pillars</span>{" "}
              so every nominee, sponsor, partner, and supporter can quickly find where
              they belong.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full"
              >
                <a href="#pillars">Explore the Recognition Pillars</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 rounded-full"
              >
                <Link to="/nominate">Start a Nomination</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 7 PILLAR CARDS */}
        <section id="pillars" className="py-14 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                  >
                    <Link
                      to={`/awards/pillars/${p.slug}`}
                      onClick={() =>
                        trackEvent("pillar_cta_click", {
                          pillar: p.slug,
                          section: "hub",
                          cta_label: p.bannerCta,
                          destination: `/awards/pillars/${p.slug}`,
                        })
                      }
                      className={`group h-full flex flex-col rounded-2xl border border-gold/20 hover:border-gold/60 bg-gradient-to-br ${p.accent} bg-charcoal-light/40 p-6 transition-all relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-gold/50 font-display text-xl font-bold">
                          {String(p.number).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-display text-lg md:text-xl font-bold text-ivory mb-2 leading-snug">
                        {p.shortTitle}
                      </h3>
                      <p className="text-ivory/70 text-sm leading-relaxed mb-5 flex-1">
                        {p.bannerSummary}
                      </p>
                      <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold">
                        {p.bannerCta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MID CTA */}
        <section className="py-14 md:py-16 bg-charcoal-light/30 border-y border-gold/10">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
              Know someone making education possible?
            </h2>
            <p className="text-ivory/75 text-sm md:text-base leading-relaxed mb-6">
              Nominate them under the pillar that best fits their contribution. If you
              are unsure where they belong, start with the nomination form and the
              NESA-Africa team will guide the classification.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full"
            >
              <Link to="/nominate">Start Nomination</Link>
            </Button>
          </div>
        </section>

        <PillarFooterNote />
      </div>
    </>
  );
}
