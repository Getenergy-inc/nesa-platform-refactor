import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Crown, Radio, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentRequired } from "@/components/nesa/ContentRequired";
import { PROGRAMME_END_LABEL } from "@/config/programme";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "icons", label: "Africa Education Icons" },
  { id: "broadcast", label: "Broadcast" },
  { id: "faq", label: "FAQs" },
];

/** Online-only 2026 programme. No physical event, ticket, voting or venue content. */
export default function GalaConsolidated() {
  return (
    <>
      <Helmet>
        <title>NESA-Africa 2026 Online Awards Gala</title>
        <meta name="description" content="The NESA-Africa 2026 Online Awards Gala on 28 December 2026 honours Africa Education Icons 2006–2026. Online only; no ticket sales." />
      </Helmet>

      <nav aria-label="Online Awards Gala sections" className="sticky top-14 z-30 overflow-x-auto border-b border-gold/20 bg-charcoal/95 backdrop-blur sm:top-16">
        <ul className="flex gap-4 whitespace-nowrap px-4 py-3 text-sm">
          {SECTIONS.map((section) => (
            <li key={section.id}><a href={`#${section.id}`} className="text-white/80 transition-colors hover:text-gold">{section.label}</a></li>
          ))}
        </ul>
      </nav>

      <section id="overview" className="border-b border-gold/15 bg-charcoal py-16 text-white md:py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">28 December 2026 · Online only</p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">NESA-Africa 2026 <span className="text-gold">Online Awards Gala</span></h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            Honouring Africa Education Icons 2006–2026 — Africa's highest award for Africa's Education Enablers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/awards/africa-education-icon">Explore the Africa Education Icon Award <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/media">Explore Media & Broadcasts</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/60">No physical attendance · No ticket sales · No public voting</p>
        </div>
      </section>

      <section id="icons" className="bg-charcoal-light/20 py-16 text-white">
        <div className="container mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          <article className="rounded-2xl border border-gold/20 bg-charcoal/60 p-6">
            <Crown className="h-7 w-7 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">Africa Education Icons</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">Nine Icons recognised across three categories and three pathways: Africans in Africa, Africans in the Diaspora, and Friends of Africa.</p>
          </article>
          <article className="rounded-2xl border border-gold/20 bg-charcoal/60 p-6">
            <CalendarDays className="h-7 w-7 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">Programme date</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{PROGRAMME_END_LABEL}. The celebration is online only, with about 20–30 invited live participants.</p>
          </article>
          <article className="rounded-2xl border border-gold/20 bg-charcoal/60 p-6">
            <ShieldCheck className="h-7 w-7 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">Independent recognition</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">Research, verification and judging determine recognition. Sponsorship, donations and popularity do not influence outcomes.</p>
          </article>
        </div>
      </section>

      <section id="broadcast" className="bg-charcoal py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Radio className="mx-auto h-8 w-8 text-gold" aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-bold">Watch the online programme</h2>
          <p className="mt-3 text-white/70">The broadcast will be carried on authorised platforms.</p>
          <ContentRequired title="Authorised broadcast platform links" className="mx-auto mt-6 max-w-2xl">
            SCEF has not supplied the final viewing links. No unofficial stream or attendance link is published.
          </ContentRequired>
        </div>
      </section>

      <section id="faq" className="border-t border-gold/15 bg-charcoal-light/20 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl font-bold">Online Awards Gala FAQs</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gold/20 p-5"><h3 className="font-semibold text-gold">Do I need a ticket?</h3><p className="mt-2 text-sm text-white/70">No. There are no ticket sales or physical attendance.</p></div>
            <div className="rounded-xl border border-gold/20 p-5"><h3 className="font-semibold text-gold">Can I vote before the event?</h3><p className="mt-2 text-sm text-white/70">No. NESA-Africa 2026 has no public voting.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
