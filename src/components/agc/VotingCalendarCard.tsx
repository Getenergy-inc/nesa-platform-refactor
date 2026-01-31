import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trophy, Users, Scale } from "lucide-react";
import { VOTING_PHASES, GALA_WEEKEND, getCurrentVotingPhase, isVotingOpen } from "@/config/agcConfig";
import { useCountdown } from "@/hooks/useCountdown";

interface VotingCalendarCardProps {
  className?: string;
}

export function VotingCalendarCard({ className }: VotingCalendarCardProps) {
  const currentPhase = getCurrentVotingPhase();
  const votingOpen = isVotingOpen();
  
  // Find next phase or gala date
  const nextDate = currentPhase 
    ? currentPhase.dates.votingCloses 
    : VOTING_PHASES[0].dates.votingOpens;
  
  const countdown = useCountdown(nextDate);

  return (
    <Card className={className} id="calendar">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Voting Calendar (2026)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge 
            variant={votingOpen ? "default" : "secondary"}
            className={votingOpen ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {votingOpen ? "Voting Open" : "Voting Closed"}
          </Badge>
          {currentPhase && (
            <Badge variant="outline" className="text-gold border-gold">
              {currentPhase.name}
            </Badge>
          )}
        </div>

        {/* Countdown */}
        {!countdown.isExpired && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground mb-2">
              {currentPhase ? "Voting closes in:" : "Voting opens in:"}
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.minutes, label: "Mins" },
                { value: countdown.seconds, label: "Secs" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded bg-background p-2 border">
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phases */}
        <div className="space-y-4">
          {VOTING_PHASES.map((phase, index) => {
            const isActive = currentPhase?.id === phase.id;
            const isPast = new Date() > new Date(phase.dates.votingCloses);
            
            return (
              <div
                key={phase.id}
                className={`rounded-lg border p-4 transition-colors ${
                  isActive 
                    ? "border-gold bg-gold/5" 
                    : isPast 
                      ? "border-muted bg-muted/30 opacity-60" 
                      : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isActive ? "bg-gold text-charcoal" : "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{phase.name}</h4>
                      <p className="text-sm text-muted-foreground">{phase.description}</p>
                    </div>
                  </div>
                  {isActive && (
                    <Badge className="bg-gold text-charcoal">Active</Badge>
                  )}
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Voting: {new Date(phase.dates.votingOpens).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} – {new Date(phase.dates.votingCloses).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    <span>
                      Results: {new Date(phase.dates.resultsDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Scale className="h-4 w-4" />
                    <span>
                      Weight: {phase.votingWeight.public}% Public
                      {phase.votingWeight.jury > 0 && ` + ${phase.votingWeight.jury}% Jury`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gala Weekend */}
        <div className="rounded-lg bg-gradient-to-r from-gold/20 to-primary/20 p-4 border border-gold/30">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-gold" />
            <h4 className="font-semibold">NESA-Africa Gala Weekend</h4>
          </div>
          <p className="text-sm text-muted-foreground">{GALA_WEEKEND}</p>
        </div>
      </CardContent>
    </Card>
  );
}
