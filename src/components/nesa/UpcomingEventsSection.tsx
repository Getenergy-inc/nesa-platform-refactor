import { Tv, Vote, Trophy, Coins, CheckCircle2, Radio, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CountdownTimer } from "./CountdownTimer";
import { useSeason } from "@/contexts/SeasonContext";
import { buildScheduledEvents, DEFAULT_SCHEDULE_TEMPLATE, type ScheduledEvent } from "@/config/schedule";
import countdownTvImg from "@/assets/cards/countdown-tv-show.jpg";
import countdownVotingImg from "@/assets/cards/countdown-voting.jpg";
import countdownGalaImg from "@/assets/cards/countdown-gala.jpg";

type EventStatus = "upcoming" | "live" | "completed" | "closed";

interface DisplayEvent extends ScheduledEvent {
  /** Optional end date for ranges (e.g., voting windows) */
  endDate?: Date;
  /** Display label override */
  displayLabel?: string;
  /** Behaviour when event end has passed */
  closedLabel?: string;
}

function getStatus(event: DisplayEvent): EventStatus {
  const now = new Date();
  const start = event.date;
  const end = event.endDate ?? event.date;
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return event.endDate ? "closed" : "completed";
}

function StatusBadge({ status }: { status: EventStatus }) {
  if (status === "live") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/40 px-3 py-1">
        <Radio className="h-3 w-3 text-red-400 animate-pulse" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">Now Live</span>
      </div>
    );
  }
  if (status === "completed") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Completed</span>
      </div>
    );
  }
  if (status === "closed") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/20 px-3 py-1">
        <XCircle className="h-3 w-3 text-white/50" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Closed</span>
      </div>
    );
  }
  return null;
}

function EventCard({ event }: { event: DisplayEvent }) {
  const status = getStatus(event);
  const target = status === "live" && event.endDate ? event.endDate : event.date;
  const label = event.displayLabel ?? event.name;

  return (
    <div className="bg-charcoal-light rounded-xl p-4 border border-gold/20">
      {status === "upcoming" ? (
        <CountdownTimer targetDate={target} label={label} />
      ) : (
        <div className="flex flex-col items-center gap-3 py-2">
          <StatusBadge status={status} />
          <p className="text-sm text-white/80 text-center font-medium">{label}</p>
          <p className="text-[11px] text-white/40">
            {event.date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      )}
    </div>
  );
}

function EventGroup({
  icon: Icon,
  title,
  events,
  note,
  image,
}: {
  icon: React.ElementType;
  title: string;
  events: DisplayEvent[];
  note?: string;
  image: string;
}) {
  return (
    <div className="space-y-4">
      <div className="relative h-40 w-full overflow-hidden rounded-xl">
        <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <Icon className="h-5 w-5 text-gold" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {note && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/5 border border-gold/20">
          <Coins className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/70">{note}</p>
        </div>
      )}
    </div>
  );
}

export function UpcomingEventsSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();

  const events = buildScheduledEvents(currentEdition.displayYear, DEFAULT_SCHEDULE_TEMPLATE);

  // ── LIVE TV SHOWS (3) ──
  const tvShows: DisplayEvent[] = [
    {
      ...events.tvShows.find((e) => e.id === "platinum-show")!,
      displayLabel: "Platinum Recognition Show",
    },
    {
      ...events.tvShows.find((e) => e.id === "icon-show")!,
      displayLabel: "Africa Education Icon Show",
    },
    {
      ...events.tvShows.find((e) => e.id === "gold-show")!,
      displayLabel: "Gold Certificate Winners Show",
    },
  ];

  // ── PUBLIC VOTING WINDOWS (2) ──
  const goldOpen = events.votingWindows.find((e) => e.id === "gold-voting")!;
  const blueOpen = events.votingWindows.find((e) => e.id === "blue-garnet-voting")!;
  const votingWindows: DisplayEvent[] = [
    {
      ...goldOpen,
      displayLabel: "Gold Certificate Voting Opens",
      endDate: new Date(`${currentEdition.displayYear}-09-15T23:59:59`),
    },
    {
      ...blueOpen,
      displayLabel: "Blue Garnet Voting Opens",
      endDate: new Date(`${currentEdition.displayYear}-10-22T23:59:59`),
    },
  ];

  // ── GALA & LEGACY (2) ──
  const galaAndLegacy: DisplayEvent[] = [
    {
      ...events.galas.find((e) => e.id === "blue-garnet-gala")!,
      displayLabel: "Blue Garnet Awards Gala",
      // Show "Now Live" on the gala day itself (until end of day)
      endDate: new Date(`${currentEdition.displayYear}-12-14T23:59:59`),
    },
    {
      ...events.legacy.find((e) => e.id === "rmsa-launch")!,
      displayLabel: "Rebuild My School Africa Launch",
    },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.upcomingEvents.title", { defaultValue: "Upcoming TV Shows, Voting & Events" })}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("landing.upcomingEvents.description", {
              defaultValue:
                "Live countdown to NESA-Africa 2026's major milestones, public voting windows, and broadcast events.",
            })}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <EventGroup
            icon={Tv}
            title={t("landing.upcomingEvents.tvShows", { defaultValue: "Live TV Shows" })}
            events={tvShows}
            image={countdownTvImg}
          />
          <EventGroup
            icon={Vote}
            title={t("landing.upcomingEvents.votingWindows", { defaultValue: "Public Voting Windows" })}
            events={votingWindows}
            note={t("landing.upcomingEvents.votingNote", {
              defaultValue:
                "Public participation happens during official nomination windows on the platform.",
            })}
            image={countdownVotingImg}
          />
          <EventGroup
            icon={Trophy}
            title={t("landing.upcomingEvents.galaEvents", { defaultValue: "Gala & Legacy Events" })}
            events={galaAndLegacy}
            image={countdownGalaImg}
          />
        </div>
      </div>
    </section>
  );
}
