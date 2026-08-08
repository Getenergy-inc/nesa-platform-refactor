// NominationFormPagesIndex — visual index of the 22 tailored nomination-form
// landing pages (Icon 3 · Influencer 3 · Platinum 7 · Gold-Blue Garnet 9).
// URL: /nominate/pages — each card deep-links to that page's #nominate form.

import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, FileCheck, ShieldCheck } from "lucide-react";
import { SUBPAGES_2026 } from "@/config/awards/subpages2026";

const TIERS: { slug: string; label: string; blurb: string }[] = [
  {
    slug: "africa-education-icon",
    label: "Africa Education Icon",
    blurb: "Lifetime recognition — three nomination pathways.",
  },
  {
    slug: "influencer-education-impact",
    label: "Influencer Education Impact",
    blurb: "Platforms turned into measurable education impact.",
  },
  {
    slug: "platinum",
    label: "Platinum Recognition",
    blurb: "Institutional contribution, jury-verified.",
  },
  {
    slug: "gold-blue-garnet",
    label: "Gold-Blue Garnet Recognition",
    blurb: "Category recognition for verified Education Enablers.",
  },
];

export default function NominationFormPagesIndex() {
  const [active, setActive] = useState<string>("all");

  const visible = useMemo(
    () => (active === "all" ? SUBPAGES_2026 : SUBPAGES_2026.filter((s) => s.tier === active)),
    [active],
  );

  return (
    <>
      <Helmet>
        <title>All 22 Nomination Forms · NESA-Africa 2026</title>
        <meta
          name="description"
          content="Open any of the 22 NESA-Africa 2026 nomination forms — one tailored form per award category, free to submit, verified by the Nominee Review Committee."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/nominate/pages" />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <header className="mb-8">
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              <FileCheck className="h-3.5 w-3.5" aria-hidden />
              Nominations Open · NESA-Africa 2026
            </p>
            <h1 className="font-playfair text-3xl text-white md:text-5xl">
              The 22 Nomination Forms
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-white/75 md:text-base">
              Enablers of Education for All Across Africa. One tailored form per category —
              free to submit, about eight minutes, your account is created at submission.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                {SUBPAGES_2026.length} forms · 4 tiers
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden />
                Every claim NRC-verified
              </span>
            </div>
          </header>

          <nav aria-label="Filter nomination forms by tier" className="mb-8 flex flex-wrap gap-2">
            {[{ slug: "all", label: `All ${SUBPAGES_2026.length}` }, ...TIERS].map((t) => {
              const count =
                t.slug === "all"
                  ? SUBPAGES_2026.length
                  : SUBPAGES_2026.filter((s) => s.tier === t.slug).length;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setActive(t.slug)}
                  aria-pressed={active === t.slug}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active === t.slug
                      ? "bg-gold text-charcoal"
                      : "border border-white/15 text-white/80 hover:border-gold/60"
                  }`}
                >
                  {t.slug === "all" ? t.label : `${t.label} · ${count}`}
                </button>
              );
            })}
          </nav>

          {TIERS.filter((t) => active === "all" || t.slug === active).map((tier) => {
            const items = visible.filter((s) => s.tier === tier.slug);
            if (items.length === 0) return null;
            return (
              <section key={tier.slug} className="mb-12" aria-label={`${tier.label} nomination forms`}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-gold/20 pb-3">
                  <div>
                    <h2 className="font-playfair text-xl text-white md:text-2xl">{tier.label}</h2>
                    <p className="text-sm text-white/60">{tier.blurb}</p>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-gold">
                    {items.length} forms
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((page) => (
                    <Link
                      key={page.slug}
                      to={`/recognition/subpage/${page.slug}#nominate`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-black/40 transition hover:border-gold hover:bg-black/60"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                        {page.hero.imageSrc && (
                          <img
                            src={page.hero.imageSrc}
                            alt={page.hero.imageAlt ?? page.hero.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        )}
                        <span className="absolute left-3 top-3 rounded-full border border-gold/50 bg-black/70 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold">
                          Nomination form
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-playfair text-lg text-white group-hover:text-gold">
                          {page.hero.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm text-white/65">
                          {page.hero.lede}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                          Open the form
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </>
  );
}
