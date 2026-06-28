import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Megaphone,
  Users,
  Crown,
  Star,
  Sparkles,
  Vote,
  Tv,
  Gem,
  Trophy,
  Heart,
  ChevronDown,
  ArrowRight,
  Clock,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  RECOGNITION_JOURNEY_2026,
  STATUS_LABELS,
  computeLiveStatus,
  phaseProgress,
  type JourneyPhase,
  type JourneyStatus,
} from "@/data/recognitionJourney2026";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone,
  Users,
  Crown,
  Star,
  Sparkles,
  Vote,
  Tv,
  Gem,
  Trophy,
  Heart,
};

const ACCENTS: Record<JourneyPhase["accent"], { ring: string; chip: string; dot: string; glow: string }> = {
  amber: { ring: "ring-amber-500/40", chip: "bg-amber-500/15 text-amber-200 border-amber-500/30", dot: "bg-amber-400", glow: "shadow-[0_0_30px_-10px_rgba(245,158,11,0.6)]" },
  blue: { ring: "ring-blue-500/40", chip: "bg-blue-500/15 text-blue-200 border-blue-500/30", dot: "bg-blue-400", glow: "shadow-[0_0_30px_-10px_rgba(59,130,246,0.6)]" },
  slate: { ring: "ring-slate-400/40", chip: "bg-slate-400/15 text-slate-200 border-slate-400/30", dot: "bg-slate-300", glow: "shadow-[0_0_30px_-10px_rgba(148,163,184,0.6)]" },
  yellow: { ring: "ring-yellow-500/40", chip: "bg-yellow-500/15 text-yellow-200 border-yellow-500/30", dot: "bg-yellow-400", glow: "shadow-[0_0_30px_-10px_rgba(234,179,8,0.6)]" },
  emerald: { ring: "ring-emerald-500/40", chip: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30", dot: "bg-emerald-400", glow: "shadow-[0_0_30px_-10px_rgba(16,185,129,0.6)]" },
  violet: { ring: "ring-violet-500/40", chip: "bg-violet-500/15 text-violet-200 border-violet-500/30", dot: "bg-violet-400", glow: "shadow-[0_0_30px_-10px_rgba(139,92,246,0.6)]" },
  rose: { ring: "ring-rose-500/40", chip: "bg-rose-500/15 text-rose-200 border-rose-500/30", dot: "bg-rose-400", glow: "shadow-[0_0_30px_-10px_rgba(244,63,94,0.6)]" },
};

const STATUS_TONE: Record<JourneyStatus, string> = {
  completed: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  current: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  upcoming: "bg-white/5 text-white/70 border-white/15",
  live: "bg-rose-500/20 text-rose-100 border-rose-500/40 animate-pulse",
  registration_open: "bg-rose-500/15 text-rose-200 border-rose-500/30",
  nomination_open: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  voting_open: "bg-blue-500/15 text-blue-200 border-blue-500/30",
  closing_soon: "bg-orange-500/20 text-orange-100 border-orange-500/40",
  closed: "bg-white/5 text-white/50 border-white/10",
};

function Countdown({ targetIso, label }: { targetIso: string; label: string }) {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
      <Clock className="h-3.5 w-3.5 text-amber-300" />
      <span>{label}:</span>
      <span className="font-mono text-white/90">{days}d {hours}h</span>
    </div>
  );
}

interface PhaseCardProps {
  phase: JourneyPhase;
  side: "left" | "right";
  expanded: boolean;
  onToggle: () => void;
}

function PhaseCard({ phase, side, expanded, onToggle }: PhaseCardProps) {
  const Icon = ICONS[phase.iconName] ?? Sparkles;
  const accent = ACCENTS[phase.accent];
  const liveStatus = computeLiveStatus(phase);
  const progress = phaseProgress(phase);
  const showCountdown = ["registration_open", "nomination_open", "voting_open", "current", "closing_soon", "upcoming"].includes(liveStatus);
  const countdownTarget = liveStatus === "upcoming" ? phase.startsAt : phase.endsAt;
  const countdownLabel = liveStatus === "upcoming" ? "Starts in" : "Ends in";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 backdrop-blur",
        "hover:border-white/20 transition-all duration-300",
        accent.glow,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl ring-1", accent.ring, accent.chip)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">Phase {phase.number}</div>
            <h3 className="font-serif text-lg leading-tight text-white sm:text-xl">{phase.name}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", STATUS_TONE[liveStatus])}>
            {STATUS_LABELS[liveStatus]}
          </Badge>
          {phase.tier && (
            <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", accent.chip)}>
              {phase.tier}
            </Badge>
          )}
        </div>
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
        <span className="font-medium text-white/90">{phase.dateRange}</span>
        {showCountdown && <Countdown targetIso={countdownTarget} label={countdownLabel} />}
      </div>

      {liveStatus !== "upcoming" && liveStatus !== "closed" && (
        <div className="mt-3">
          <Progress value={progress} className="h-1.5 bg-white/5" />
          <div className="mt-1 text-[10px] uppercase tracking-wider text-white/50">{progress}% complete</div>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-white/75">{phase.purpose}</p>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 hover:text-amber-200"
      >
        {expanded ? "Hide details" : "View details"}
        <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-4 border-t border-white/10 pt-4 text-sm text-white/75"
        >
          <p>{phase.description}</p>

          {phase.categories && (
            <DetailBlock title="Categories">
              <ul className="space-y-1">
                {phase.categories.map((c) => (
                  <li key={c} className="flex gap-2"><span className={cn("mt-2 h-1 w-1 rounded-full", accent.dot)} />{c}</li>
                ))}
              </ul>
            </DetailBlock>
          )}

          {phase.activities && (
            <DetailBlock title="Key Activities">
              <div className="flex flex-wrap gap-1.5">
                {phase.activities.map((a) => (
                  <span key={a} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs">{a}</span>
                ))}
              </div>
            </DetailBlock>
          )}

          {phase.participants && (
            <DetailBlock title="Participants">
              <div className="flex flex-wrap gap-1.5">
                {phase.participants.map((p) => (
                  <span key={p} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs">{p}</span>
                ))}
              </div>
            </DetailBlock>
          )}

          {phase.programmes && (
            <DetailBlock title="Impact Programmes">
              <div className="flex flex-wrap gap-1.5">
                {phase.programmes.map((p) => (
                  <span key={p} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-100">{p}</span>
                ))}
              </div>
            </DetailBlock>
          )}

          {(phase.selection || phase.votingModel) && (
            <DetailBlock title={phase.votingModel ? "Voting Model" : "Selection"}>
              <p className="text-white/85">{phase.votingModel ?? phase.selection}</p>
            </DetailBlock>
          )}

          {phase.outcomes && (
            <DetailBlock title="Expected Outcomes">
              <ul className="space-y-1">
                {phase.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </DetailBlock>
          )}

          {phase.ctas && phase.ctas.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {phase.ctas.map((cta, i) => (
                <Button
                  key={cta.to}
                  asChild
                  size="sm"
                  variant={i === 0 ? "default" : "outline"}
                  className={i === 0 ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-charcoal hover:from-amber-400 hover:to-yellow-500" : "border-white/20 text-white hover:bg-white/5"}
                >
                  <Link to={cta.to}>
                    {cta.label} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.article>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{title}</div>
      {children}
    </div>
  );
}

export interface RecognitionJourneyTimelineProps {
  /** Filter to a subset of phases (e.g. ["influencer-voting","blue-garnet-voting"] for voting-only sections). */
  phaseIds?: string[];
  /** "vertical" (default, alternating on desktop) or "compact" (single column). */
  variant?: "vertical" | "compact";
  /** Heading rendered above the timeline. Omit for embedded use. */
  heading?: string;
  /** Optional intro paragraph. */
  intro?: string;
}

export function RecognitionJourneyTimeline({
  phaseIds,
  variant = "vertical",
  heading,
  intro,
}: RecognitionJourneyTimelineProps) {
  const phases = useMemo(
    () =>
      phaseIds && phaseIds.length > 0
        ? RECOGNITION_JOURNEY_2026.filter((p) => phaseIds.includes(p.id))
        : RECOGNITION_JOURNEY_2026,
    [phaseIds],
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (variant === "compact") {
    return (
      <section className="space-y-6">
        {heading && <h2 className="font-serif text-2xl text-white sm:text-3xl">{heading}</h2>}
        {intro && <p className="text-white/70">{intro}</p>}
        <div className="space-y-4">
          {phases.map((p) => (
            <PhaseCard key={p.id} phase={p} side="left" expanded={expanded.has(p.id)} onToggle={() => toggle(p.id)} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      {heading && (
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl text-white sm:text-4xl md:text-5xl">{heading}</h2>
          {intro && <p className="mx-auto mt-3 max-w-3xl text-white/70">{intro}</p>}
        </div>
      )}

      <div className="relative">
        {/* Vertical spine */}
        <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-gradient-to-b from-amber-500/40 via-white/10 to-emerald-500/40 md:left-1/2 md:-translate-x-px" />

        <ol className="space-y-10">
          {phases.map((phase, idx) => {
            const side: "left" | "right" = idx % 2 === 0 ? "right" : "left";
            const accent = ACCENTS[phase.accent];
            return (
              <li key={phase.id} className="relative md:grid md:grid-cols-2 md:gap-10">
                {/* Node */}
                <div className="absolute left-4 top-6 z-10 -translate-x-1/2 md:left-1/2">
                  <div className={cn("flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-charcoal", accent.chip)}>
                    <CircleDot className={cn("h-3 w-3", `text-${phase.accent}-300`)} />
                  </div>
                </div>

                {side === "right" ? (
                  <>
                    <div className="hidden md:block" />
                    <div className="ml-10 md:ml-6">
                      <PhaseCard phase={phase} side="right" expanded={expanded.has(phase.id)} onToggle={() => toggle(phase.id)} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ml-10 md:ml-0 md:mr-6">
                      <PhaseCard phase={phase} side="left" expanded={expanded.has(phase.id)} onToggle={() => toggle(phase.id)} />
                    </div>
                    <div className="hidden md:block" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
