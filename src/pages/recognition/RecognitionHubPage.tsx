import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MASTER_AWARDS, MASTER_COUNTS } from "@/config/awardMaster2026";
import { TIERS, type TierSlug } from "@/config/recognition2026/tiers";

const CANONICAL = "https://nesa.africa/recognition";

/** Presentation-only registry: legacy categories, nomination keys and records stay authoritative. */
export default function RecognitionHubPage() {
  const [activeTier, setActiveTier] = useState<TierSlug>(TIERS[0].slug);
  const selectedTier = TIERS.find((tier) => tier.slug === activeTier) ?? TIERS[0];
  const awards = useMemo(() => MASTER_AWARDS.filter((award) => award.tier === activeTier), [activeTier]);

  return (
    <>
      <Helmet>
        <title>Recognition | NESA-Africa 2026</title>
        <meta name="description" content="Explore four recognition tiers, 22 main awards and 90 subcategories within NESA-Africa's evidence-led recognition framework." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Recognition | NESA-Africa 2026" />
        <meta property="og:description" content="Four recognition tiers, 22 main awards and 90 subcategories, with no public voting in 2026." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-white">
        <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <header className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">NESA-Africa 2026</p>
            <h1 className="font-display text-3xl text-white md:text-5xl">Four Recognition Tiers, 22 Main Awards and 90 Subcategories</h1>
            <p className="mt-3 max-w-3xl text-sm text-white/75 md:text-base">NESA-Africa recognises different forms and levels of verified education contribution through an evidence-led framework.</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
              {MASTER_COUNTS.tiers} tiers · {MASTER_COUNTS.categories} main awards · {MASTER_COUNTS.subcategories} subcategories
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gold/30 bg-black/40 p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-gold" aria-hidden />
              <p className="min-w-0 flex-1 text-sm text-white/80">Nomination is free. Recognition depends on evidence, verification and the applicable review route — never sponsorship, donations or public voting.</p>
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90"><Link to="/nominate">Submit a Nomination</Link></Button>
            </div>
          </header>

          <section aria-labelledby="tier-heading" className="mb-12">
            <h2 id="tier-heading" className="font-display text-2xl text-gold md:text-3xl">Choose a recognition tier</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {TIERS.map((tier) => {
                const tierAwards = MASTER_AWARDS.filter((award) => award.tier === tier.slug);
                const subcategories = tierAwards.reduce((sum, award) => sum + award.subcategories.length, 0);
                return (
                  <article key={tier.slug} className="flex flex-col rounded-xl border border-gold/20 bg-black/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Tier {tier.order}</p>
                    <h3 className="mt-2 font-display text-xl text-white">{tier.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{tier.summary}</p>
                    <p className="mt-4 text-xs text-gold/85">{tierAwards.length} main awards · {subcategories} subcategories</p>
                    <p className="mt-2 text-xs text-white/60">{tier.decisionMethod2026}</p>
                    <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                      <Link to={tier.href} className="text-gold hover:underline">Explore tier →</Link>
                      <Link to={`/nominate?tier=${tier.slug}`} className="text-white/75 hover:text-gold">Nominate →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="awards-heading">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 id="awards-heading" className="font-display text-2xl text-white md:text-3xl">Main awards</h2>
                <p className="mt-2 text-sm text-white/65">Open a tier to view its approved presentation categories. Existing nomination routes remain unchanged.</p>
              </div>
              <Link to="/nominate/help-me-choose" className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline">Help me choose <ChevronRight className="h-4 w-4" /></Link>
            </div>
            <nav aria-label="Filter main awards by tier" className="mb-8 flex flex-wrap gap-2">
              {TIERS.map((tier) => (
                <button key={tier.slug} type="button" aria-pressed={activeTier === tier.slug} onClick={() => setActiveTier(tier.slug)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTier === tier.slug ? "bg-gold text-charcoal" : "border border-white/15 text-white/80 hover:border-gold/60"}`}>
                  Tier {tier.order} · {tier.shortName}
                </button>
              ))}
            </nav>
            <div className="mb-6 max-w-3xl">
              <h3 className="font-display text-xl text-gold">{selectedTier.name}</h3>
              <p className="mt-2 text-sm text-white/70">{selectedTier.summary}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {awards.map((award) => (
                <article key={award.slug} className="flex flex-col rounded-xl border border-gold/20 bg-black/40 p-5">
                  <p className="text-xs font-semibold text-gold/80">Award {award.number}</p>
                  <h3 className="mt-2 font-display text-lg text-white">{award.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{award.overview}</p>
                  <p className="mt-3 text-xs text-white/55">{award.subcategories.length} {award.subcategories.length === 1 ? "subcategory" : "subcategories"}</p>
                  <footer className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                    <Link to={award.href} className="text-gold hover:underline">Category details →</Link>
                    <Link to={award.nominationHref} className="text-white/75 hover:text-gold">Nominate →</Link>
                  </footer>
                </article>
              ))}
            </div>
          </section>

          <aside className="mt-12 rounded-2xl border border-gold/30 bg-gold/5 p-6" aria-label="Recognition integrity notice">
            <h2 className="font-display text-xl text-gold">One framework, two recognition routes</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">Only the Africa Education Icon Award proceeds to independent Icon judging. Influencer, Platinum and Gold-Blue Garnet recognition follows NRRC research, due diligence where applicable and governance approval. Certificates of Recognition are not competitive awards won.</p>
          </aside>
        </main>
      </div>
    </>
  );
}
