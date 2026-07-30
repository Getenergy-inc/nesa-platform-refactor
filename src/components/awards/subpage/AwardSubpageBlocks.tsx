// AwardSubpageBlocks — optional, additive content blocks for the award subpage
// template (Phase 1 of the Award Pages Module).
//
// Every block renders only when its content is supplied, so existing subpages are
// unaffected. Colour comes from the `--award-accent` custom property set by the
// page wrapper, falling back to gold.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  Handshake,
  PlayCircle,
  Quote,
  ScrollText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getYouTubeEmbedUrl, getThumbnailUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SubpageBenefit {
  title: string;
  body: string;
}

export interface SubpageGalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

/** Videos are referenced by YouTube ID only — never stored in the database. */
export interface SubpageVideo {
  videoId: string;
  title: string;
  description?: string;
}

export interface SubpageCountdown {
  heading?: string;
  /** ISO timestamp of the milestone this award counts down to. */
  targetIso: string;
  label: string;
  note?: string;
}

export interface SubpageOrg {
  name: string;
  logoSrc?: string;
  href?: string;
  tierLabel?: string;
}

export interface SubpageTestimonial {
  quote: string;
  author: string;
  role?: string;
  avatarSrc?: string;
}

export interface SubpageTimelineEntry {
  date: string;
  title: string;
  description?: string;
  status?: "done" | "active" | "upcoming";
}

export interface SubpageTerms {
  heading?: string;
  intro?: string;
  clauses: string[];
  documentHref?: string;
}

// ── Shared shells ────────────────────────────────────────────────────────────

const ACCENT = "hsl(var(--award-accent, 42 85% 52%))";

function BlockShell({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("border-b border-gold/10 bg-charcoal py-12 sm:py-16", className)}
    >
      <div className="container mx-auto max-w-6xl px-4">{children}</div>
    </section>
  );
}

function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-playfair text-2xl text-white sm:text-3xl lg:text-4xl">{children}</h2>
  );
}

// ── Benefits ─────────────────────────────────────────────────────────────────

export function AwardBenefitsBlock({
  heading = "What recognition unlocks",
  items,
}: {
  heading?: string;
  items: SubpageBenefit[];
}) {
  if (!items.length) return null;
  return (
    <BlockShell id="benefits">
      <BlockHeading>{heading}</BlockHeading>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <div key={b.title} className="rounded-xl border border-gold/15 bg-charcoal/60 p-5">
            <CheckCircle2 className="h-5 w-5" style={{ color: ACCENT }} aria-hidden />
            <h3 className="mt-3 font-playfair text-lg text-white">{b.title}</h3>
            <p className="mt-2 text-sm text-white/75">{b.body}</p>
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export function AwardGalleryBlock({
  heading = "Gallery",
  items,
}: {
  heading?: string;
  items: SubpageGalleryItem[];
}) {
  const [active, setActive] = useState<SubpageGalleryItem | null>(null);
  if (!items.length) return null;

  return (
    <BlockShell id="gallery">
      <BlockHeading>{heading}</BlockHeading>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((img) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(img)}
            className="group overflow-hidden rounded-xl border border-gold/15 bg-charcoal/60 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-black/30">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            {img.caption ? (
              <p className="p-3 text-xs text-white/70">{img.caption}</p>
            ) : null}
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl border-gold/30 bg-charcoal p-2">
          <DialogTitle className="sr-only">{active?.alt ?? "Gallery image"}</DialogTitle>
          {active ? (
            <img src={active.src} alt={active.alt} className="w-full rounded-lg" />
          ) : null}
        </DialogContent>
      </Dialog>
    </BlockShell>
  );
}

// ── Videos (YouTube links only) ──────────────────────────────────────────────

export function AwardVideosBlock({
  heading = "Watch",
  items,
}: {
  heading?: string;
  items: SubpageVideo[];
}) {
  const [active, setActive] = useState<SubpageVideo | null>(null);
  if (!items.length) return null;

  return (
    <BlockShell id="videos">
      <BlockHeading>{heading}</BlockHeading>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((v) => (
          <button
            key={v.videoId}
            type="button"
            onClick={() => setActive(v)}
            className="group overflow-hidden rounded-xl border border-gold/15 bg-charcoal/60 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black/40">
              <img
                src={getThumbnailUrl(v.videoId, "high")}
                alt={v.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <PlayCircle
                className="absolute inset-0 m-auto h-12 w-12 drop-shadow-lg"
                style={{ color: ACCENT }}
                aria-hidden
              />
            </div>
            <div className="p-4">
              <h3 className="font-playfair text-base text-white">{v.title}</h3>
              {v.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-white/70">{v.description}</p>
              ) : null}
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl border-gold/30 bg-charcoal p-2">
          <DialogTitle className="sr-only">{active?.title ?? "Video"}</DialogTitle>
          {active ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={getYouTubeEmbedUrl(active.videoId)}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </BlockShell>
  );
}

// ── Countdown ────────────────────────────────────────────────────────────────

function useTimeLeft(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  return {
    expired: diff === 0,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function AwardCountdownBlock({ countdown }: { countdown: SubpageCountdown }) {
  const t = useTimeLeft(countdown.targetIso);
  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <BlockShell id="countdown">
      <div
        className="rounded-2xl border p-6 sm:p-8"
        style={{
          borderColor: "hsl(var(--award-accent, 42 85% 52%) / 0.35)",
          background:
            "linear-gradient(135deg, hsl(var(--award-accent-soft, 42 70% 38%) / 0.15), transparent)",
        }}
      >
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" style={{ color: ACCENT }} aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
            {countdown.heading ?? "Key milestone"}
          </p>
        </div>
        <h2 className="mt-3 font-playfair text-2xl text-white sm:text-3xl">{countdown.label}</h2>
        {t.expired ? (
          <p className="mt-4 text-white/80">This milestone has passed.</p>
        ) : (
          <div className="mt-6 grid max-w-xl grid-cols-4 gap-3">
            {units.map((u) => (
              <div
                key={u.label}
                className="rounded-xl border border-gold/15 bg-charcoal/70 p-3 text-center"
              >
                <div
                  className="font-playfair text-2xl sm:text-3xl"
                  style={{ color: ACCENT }}
                >
                  {String(u.value).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-white/60">
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        )}
        {countdown.note ? <p className="mt-4 text-sm text-white/70">{countdown.note}</p> : null}
      </div>
    </BlockShell>
  );
}

// ── Timeline ─────────────────────────────────────────────────────────────────

export function AwardTimelineBlock({
  heading = "Timeline",
  entries,
}: {
  heading?: string;
  entries: SubpageTimelineEntry[];
}) {
  if (!entries.length) return null;
  return (
    <BlockShell id="timeline">
      <BlockHeading>{heading}</BlockHeading>
      <ol className="mt-6 space-y-4 border-l border-gold/20 pl-6">
        {entries.map((e) => (
          <li key={`${e.date}-${e.title}`} className="relative">
            <span
              className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full"
              style={{
                backgroundColor: e.status === "upcoming" ? "transparent" : ACCENT,
                border: `2px solid ${ACCENT}`,
              }}
              aria-hidden
            />
            <p className="text-xs uppercase tracking-wider text-white/60">{e.date}</p>
            <h3 className="font-playfair text-lg text-white">{e.title}</h3>
            {e.description ? (
              <p className="mt-1 text-sm text-white/75">{e.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </BlockShell>
  );
}

// ── Sponsors & partners ──────────────────────────────────────────────────────

export function AwardPartnersBlock({
  heading = "Sponsors & partners",
  note,
  items,
}: {
  heading?: string;
  note?: string;
  items: SubpageOrg[];
}) {
  if (!items.length) return null;
  return (
    <BlockShell id="partners">
      <div className="flex items-center gap-2">
        <Handshake className="h-5 w-5" style={{ color: ACCENT }} aria-hidden />
        <BlockHeading>{heading}</BlockHeading>
      </div>
      <p className="mt-3 max-w-3xl text-sm text-white/70">
        {note ??
          "Sponsors and partners fund the programme. They have no role in nominee verification, assessment, or recognition decisions."}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((o) => {
          const inner = (
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-gold/15 bg-charcoal/60 p-5 text-center">
              {o.logoSrc ? (
                <img
                  src={o.logoSrc}
                  alt={`${o.name} logo`}
                  loading="lazy"
                  className="h-12 w-auto object-contain"
                />
              ) : null}
              <p className="text-sm text-white/85">{o.name}</p>
              {o.tierLabel ? (
                <Badge variant="outline" className="border-gold/40 text-white/80">
                  {o.tierLabel}
                </Badge>
              ) : null}
            </div>
          );
          return o.href ? (
            <a key={o.name} href={o.href} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          ) : (
            <div key={o.name}>{inner}</div>
          );
        })}
      </div>
    </BlockShell>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export function AwardTestimonialsBlock({
  heading = "Voices from the programme",
  items,
}: {
  heading?: string;
  items: SubpageTestimonial[];
}) {
  if (!items.length) return null;
  return (
    <BlockShell id="testimonials">
      <BlockHeading>{heading}</BlockHeading>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <figure
            key={t.quote.slice(0, 40)}
            className="rounded-xl border border-gold/15 bg-charcoal/60 p-6"
          >
            <Quote className="h-6 w-6" style={{ color: ACCENT }} aria-hidden />
            <blockquote className="mt-3 text-white/85">{t.quote}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              {t.avatarSrc ? (
                <img
                  src={t.avatarSrc}
                  alt={t.author}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : null}
              <div>
                <p className="text-sm font-medium text-white">{t.author}</p>
                {t.role ? <p className="text-xs text-white/60">{t.role}</p> : null}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </BlockShell>
  );
}

// ── Terms ────────────────────────────────────────────────────────────────────

export function AwardTermsBlock({ terms }: { terms: SubpageTerms }) {
  if (!terms.clauses.length) return null;
  return (
    <BlockShell id="terms">
      <div className="flex items-center gap-2">
        <ScrollText className="h-5 w-5" style={{ color: ACCENT }} aria-hidden />
        <BlockHeading>{terms.heading ?? "Terms & conditions"}</BlockHeading>
      </div>
      {terms.intro ? <p className="mt-4 max-w-3xl text-white/80">{terms.intro}</p> : null}
      <ul className="mt-6 space-y-3">
        {terms.clauses.map((c) => (
          <li key={c} className="flex gap-2 text-sm text-white/80">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" style={{ color: ACCENT }} />
            <span>{c}</span>
          </li>
        ))}
      </ul>
      {terms.documentHref ? (
        <Link
          to={terms.documentHref}
          className="mt-6 inline-flex text-sm font-medium underline-offset-4 hover:underline"
          style={{ color: ACCENT }}
        >
          Read the full governance document
        </Link>
      ) : null}
    </BlockShell>
  );
}
