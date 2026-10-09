// AwardSubpageBrandStory — bold category branding, the category story,
// the subcategory / pathway grid and the sticky in-page section navigator
// shared by all 22 NESA-Africa 2026 award category pages.

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { splitLead } from "@/components/awards/standard/sections";
import type { AwardStory, PathwayCard } from "@/config/awards/subpageStory2026";

/**
 * Award-show density: one declarative line in view, the full copy one tap away.
 * Nothing is deleted or reworded — the remainder stays on-page behind a disclosure.
 */
function LeadCopy({
  text,
  className,
  label = "More",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [lead, rest] = splitLead(text);
  return (
    <div>
      <p className={className}>{open ? text : lead}</p>
      {rest ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-gold hover:text-gold/80"
        >
          {open ? "Show less" : label}
          <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
        </button>
      ) : null}
    </div>
  );
}


// ── 1. Bold brand band ───────────────────────────────────────────────────────

export function AwardBrandBand({
  tierLabel,
  tierHref,
  name,
  code,
  tagline,
}: {
  tierLabel: string;
  tierHref: string;
  name: string;
  code?: string;
  tagline?: string;
}) {
  return (
    <section
      id="brand"
      className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-b from-black via-charcoal to-charcoal"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--award-accent, #E5B94E) 0, transparent 55%)",
        }}
      />
      <div className="container relative mx-auto max-w-6xl px-4 py-10 text-center sm:py-14">
        <Link
          to={tierHref}
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold hover:bg-gold/10"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {tierLabel}
        </Link>
        <h2 className="mt-5 font-playfair text-3xl uppercase leading-[1.05] tracking-tight text-gold sm:text-5xl lg:text-6xl">
          {name}
        </h2>
        <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="mx-auto mt-5 max-w-3xl text-sm text-white/75 sm:text-base">
          {tagline ??
            "Enablers of Education for All Across Africa — verified, assessed and honoured without public voting."}
        </p>
        {code ? (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
            Reference series · NESA-2026-{code}
          </p>
        ) : null}
      </div>
    </section>
  );
}

// ── 2. Sticky section navigator ──────────────────────────────────────────────

export type SectionLink = { id: string; label: string };

export function AwardSectionNav({ links }: { links: SectionLink[] }) {
  if (!links.length) return null;
  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-30 border-b border-gold/15 bg-charcoal/95 backdrop-blur supports-[backdrop-filter]:bg-charcoal/80"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <ul className="flex snap-x gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((l) => (
            <li key={l.id} className="snap-start">
              <a
                href={`#${l.id}`}
                className={cn(
                  "inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  l.id === "nominate"
                    ? "border-gold bg-gold text-charcoal hover:bg-gold/90"
                    : "border-gold/25 text-white/80 hover:border-gold/60 hover:text-gold",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ── 3. Story block ───────────────────────────────────────────────────────────

export function AwardStoryBlock({ story }: { story: AwardStory }) {
  return (
    <section id="story" className="border-b border-gold/10 bg-charcoal py-12 sm:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
          {story.eyebrow}
        </p>
        <h2 className="mt-3 font-playfair text-2xl text-white sm:text-3xl lg:text-4xl">
          The story of {story.headline}
        </h2>
        <p className="mt-4 max-w-3xl text-base text-white/80 sm:text-lg">{story.standfirst}</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {story.chapters.map((c, i) => (
            <motion.article
              key={c.heading}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-gold/15 bg-gradient-to-br from-charcoal to-black/60 p-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-playfair text-lg text-white sm:text-xl">{c.heading}</h3>
              <LeadCopy text={c.body} className="mt-3 text-sm leading-relaxed text-white/75" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 4. Subcategory / pathway grid ────────────────────────────────────────────

export function AwardPathwaysGrid({
  heading,
  label,
  intro,
  items,
}: {
  heading: string;
  label: string;
  intro?: string;
  items: PathwayCard[];
}) {
  if (!items.length) return null;
  return (
    <section id="pathways" className="border-b border-gold/10 bg-charcoal py-12 sm:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-playfair text-2xl text-white sm:text-3xl lg:text-4xl">{heading}</h2>
            {intro ? <p className="mt-3 max-w-3xl text-white/75">{intro}</p> : null}
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold">
            {items.length} {label}
            {items.length === 1 ? "" : "s"}
          </Badge>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.article
              key={p.code}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gold/15 bg-charcoal/70"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <img
                  src={p.image}
                  alt={`${p.name} — ${label.toLowerCase()} of this recognition`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-gold/40 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  {label}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-playfair text-lg text-white">{p.name}</h3>
                <LeadCopy text={p.description} className="mt-2 flex-1 text-sm text-white/75" />
                {p.evidence ? (
                  <p className="mt-3 flex items-start gap-2 text-xs text-white/55">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none text-gold" aria-hidden />
                    {p.evidence}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={p.nominateHref}
                    className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-gold/90"
                  >
                    Nominate here
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    to={p.directoryHref}
                    className="text-xs font-medium text-gold/90 hover:text-gold hover:underline"
                  >
                    See nominees
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
