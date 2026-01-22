import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { getActivePhase, CURRENT_SEASON, getTimeUntilCeremony, formatCountdown } from "@/config/nesaSeasonConfig";
import { EventCountdown } from "@/components/ui/event-countdown";
import { Award, Clock, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface StageBannerProps {
  variant?: "full" | "compact" | "minimal";
}

export function StageBanner({ variant = "full" }: StageBannerProps) {
  const { currentEdition, getOpenStage } = useSeason();
  const activePhase = getActivePhase();
  const openStage = getOpenStage();
  const [ceremonyCountdown, setCeremonyCountdown] = useState(getTimeUntilCeremony());

  useEffect(() => {
    const timer = setInterval(() => {
      setCeremonyCountdown(getTimeUntilCeremony());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStageColor = () => {
    switch (openStage) {
      case "nominations":
        return "from-primary/20 to-primary/5 border-primary/30";
      case "public_voting":
        return "from-success/20 to-success/5 border-success/30";
      case "jury_scoring":
        return "from-accent/20 to-accent/5 border-accent/30";
      default:
        return "from-muted to-muted/50 border-border";
    }
  };

  const getStageIcon = () => {
    switch (openStage) {
      case "nominations":
        return <Award className="h-5 w-5 text-primary" />;
      case "public_voting":
        return <Award className="h-5 w-5 text-success" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
        {getStageIcon()}
        <span className="text-sm font-medium">{activePhase.shortName}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center justify-between rounded-lg border bg-gradient-to-r p-4 ${getStageColor()}`}>
        <div className="flex items-center gap-3">
          {getStageIcon()}
          <div>
            <p className="font-semibold">{activePhase.name}</p>
            <p className="text-xs text-muted-foreground">{currentEdition.name}</p>
          </div>
        </div>
        <Button size="sm" asChild>
          <Link to={activePhase.ctaLink}>
            {activePhase.ctaText}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border bg-gradient-to-r p-6 ${getStageColor()}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card/80">
            {getStageIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold">{activePhase.name}</h3>
              <span className="animate-pulse rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
                LIVE
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{activePhase.description}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Ends: {activePhase.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="hidden text-center md:block">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Ceremony In</p>
            <p className="font-mono text-lg font-bold text-primary">
              {formatCountdown(ceremonyCountdown)}
            </p>
          </div>
          <Button size="lg" className="bg-primary" asChild>
            <Link to={activePhase.ctaLink}>
              {activePhase.ctaText}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PhaseTimeline() {
  const phases = [
    { id: "nominations", label: "Nominations", status: "active" },
    { id: "nrc-review", label: "NRC Review", status: "upcoming" },
    { id: "voting", label: "Public Voting", status: "upcoming" },
    { id: "jury", label: "Jury Scoring", status: "upcoming" },
    { id: "ceremony", label: "Ceremony", status: "upcoming" },
  ];

  return (
    <div className="flex items-center justify-between">
      {phases.map((phase, index) => (
        <div key={phase.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                phase.status === "active"
                  ? "bg-primary text-primary-foreground"
                  : phase.status === "completed"
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-1 text-xs text-muted-foreground">{phase.label}</span>
          </div>
          {index < phases.length - 1 && (
            <div
              className={`mx-2 h-0.5 w-8 sm:w-12 md:w-16 ${
                phase.status === "completed" ? "bg-success" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
