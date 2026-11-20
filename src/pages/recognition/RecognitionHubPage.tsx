import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MASTER_COUNTS } from "@/config/awardMaster2026";
import { PUBLIC_RECOGNITION_TIERS, RECOGNITION_NON_FACTORS } from "@/config/recognition2026/publicFramework";

const CANONICAL = "https://nesa.africa/recognition";

export default function RecognitionHubPage() {
  return (
    <>
      <Helmet>
        <title>NESA-Africa Recognition | Four Tiers and 22 Awards</title>
        <meta name="description" content="Explore the four NESA-Africa recognition tiers, 22 main awards and 90 subcategories." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="NESA-Africa Recognition | Four Tiers and 22 Awards" />
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
            <p className="mt-3 max-w-3xl text-sm text-white/75 md:text-base">Principal 2026 focus: recognition of up to nine Africa Education Icons.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Button asChild className="bg-gold text-charcoal hover:bg-gold/90"><Link to="/nominate">Submit a Nomination</Link></Button><Button asChild variant="outline" className="border-gold/40 text-gold"><Link to="/nominees">Browse Nominees</Link></Button></div>
          </header>

          <section aria-labelledby="totals-heading" className="mb-12">
            <h2 id="totals-heading" className="font-display text-2xl text-gold md:text-3xl">Recognition totals</h2>
            <div className="mt-5 overflow-x-auto rounded-xl border border-gold/20">
              <table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-gold/10 text-gold"><tr><th scope="col" className="p-4">Tier</th><th scope="col" className="p-4">Main awards / pathways</th><th scope="col" className="p-4">Counted subcategories</th></tr></thead><tbody>{PUBLIC_RECOGNITION_TIERS.map((tier) => <tr key={tier.slug} className="border-t border-gold/10"><th scope="row" className="p-4 font-semibold text-white">{tier.name}</th><td className="p-4 text-white/70">{tier.awardsLabel}</td><td className="p-4 text-white/70">{tier.subcategories}</td></tr>)}<tr className="border-t border-gold/30 bg-gold/5 font-bold"><th scope="row" className="p-4 text-gold">Total</th><td className="p-4">{MASTER_COUNTS.categories}</td><td className="p-4">{MASTER_COUNTS.subcategories}</td></tr></tbody></table>
            </div>
            <p className="mt-3 text-sm text-white/65">Icon and Influencer awards are pathways and are not counted within the 90 subcategories.</p>
          </section>

          <section aria-labelledby="tier-heading" className="mb-12">
            <h2 id="tier-heading" className="font-display text-2xl text-gold md:text-3xl">The four tiers</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {PUBLIC_RECOGNITION_TIERS.map((tier) => (
                <article key={tier.slug} className="flex flex-col rounded-xl border border-gold/20 bg-black/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Tier {tier.order}</p>
                  <h3 className="mt-2 font-display text-2xl text-white">{tier.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{tier.description}</p>
                  <p className="mt-4 text-sm font-semibold text-gold/85">{tier.awardsLabel} · {tier.subcategories} subcategories</p>
                  <p className="mt-2 text-sm text-white/65">{tier.selection}</p>
                  <p className="mt-2 text-sm font-semibold text-white/80">No public voting in 2026.</p>
                  <ul className="mt-4 space-y-2">{tier.awards.map((award) => <li key={award} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">{award}</li>)}</ul>
                  <div className="mt-auto pt-5"><Link to={tier.href} className="font-semibold text-gold hover:underline">Explore tier →</Link></div>
                </article>
              ))}
            </div>
            <Link to="/nominate/help-me-choose" className="mt-5 inline-block text-sm font-semibold text-gold hover:underline">Help me choose a recognition field</Link>
          </section>

          <section className="mb-10 rounded-2xl border border-gold/30 bg-gold/5 p-6" aria-labelledby="certificates-heading">
            <h2 id="certificates-heading" className="font-display text-xl text-gold">Certificates of Recognition</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">Certificates are distinct from competitively assessed awards and must not be described as awards won.</p>
            <Link to="/recognition/certificates" className="mt-4 inline-block text-sm font-semibold text-gold hover:underline">Explore Certificates of Recognition</Link>
          </section>

          <section className="rounded-2xl border border-gold/30 bg-black/40 p-6" aria-labelledby="firewall-heading">
            <ShieldCheck className="h-6 w-6 text-gold" aria-hidden />
            <h2 id="firewall-heading" className="mt-3 font-display text-xl text-gold">What does not determine recognition</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{RECOGNITION_NON_FACTORS.map((item) => <li key={item} className="text-sm capitalize text-white/70">• {item}</li>)}</ul>
            <Button asChild className="mt-6 bg-gold text-charcoal hover:bg-gold/90"><Link to="/nominate">Submit a Nomination</Link></Button>
          </section>
        </main>
      </div>
    </>
  );
}
