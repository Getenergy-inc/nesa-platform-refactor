// Lean Media page (owner brief Page 10 + master-draft filters and contextual CTAs).
import { useState } from "react";
import { Link } from "react-router-dom";
import { LeanHero, LeanSection, LeanList, LeanCtas } from "@/components/lean/LeanPage";
import { MEDIA_CARDS, MEDIA_FILTERS } from "./leanContent";

export default function LeanMediaPage() {
  const [filter, setFilter] = useState<(typeof MEDIA_FILTERS)[number]>("All");
  const cards = MEDIA_CARDS.filter((c) => filter === "All" || c.kind === filter);
  return (
    <main id="main-content">
      <LeanHero title="Education Impact in View" path="/media" seoTitle="NESA-Africa Media | Education Impact in View"
        description="NESA-Africa Media documents education contributions through responsible, evidence-based storytelling.">
        <p>NESA-Africa Media documents education contributions, challenges, ideas and learning through responsible, evidence-based storytelling. Media participation does not influence recognition.</p>
      </LeanHero>
      <LeanSection title="Channels">
        <div role="group" aria-label="Filter media" className="flex flex-wrap gap-2">
          {MEDIA_FILTERS.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${filter === f ? "border-gold bg-gold text-charcoal" : "border-gold/50 text-foreground hover:bg-gold/10"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          {cards.map((c) => (
            <article key={c.title} id={c.id} data-testid="media-card" className="scroll-mt-28 rounded-lg border border-gold/30 bg-card p-5">
              <p className="text-xs uppercase tracking-widest text-gold">{c.kind}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-foreground">{c.title}</h3>
              <p className="mt-2 text-foreground/80">{c.body}</p>
              {c.href
                ? <Link to={c.href} className="mt-3 inline-block font-semibold text-gold underline">{c.cta}</Link>
                : <span className="mt-3 inline-block rounded-full border border-gold/50 px-3 py-1 text-sm">{c.cta}</span>}
            </article>
          ))}
        </div>
      </LeanSection>
      <LeanSection title="Publication standards" tone="dark">
        <p>Every item shows: title · date · author or producer · consent status · fact-check status · captions or transcript · rights status · correction route · sponsorship disclosure where relevant.</p>
      </LeanSection>
      <LeanSection title="Media integrity">
        <p>We never:</p>
        <LeanList items={["Present interviews as awards", "Call prospects verified nominees", "Publish unconfirmed speakers or private evidence", "Claim a programme was completed without evidence", "Use popularity as a criterion"]} />
        <LeanCtas ctas={[
          { label: "Watch NESA-Africa TV", href: "/media/tv", primary: true },
          { label: "Register for a Webinar", href: "/media/webinars" },
          { label: "Listen to the Podcast", href: "/media/podcast" },
          { label: "Read Impact Stories", href: "/journal" },
          { label: "Media Enquiries", href: "/contact?subject=media" },
        ]} />
      </LeanSection>
    </main>
  );
}
