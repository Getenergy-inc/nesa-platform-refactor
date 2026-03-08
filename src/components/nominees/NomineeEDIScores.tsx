/**
 * NESA Africa — EDI Score Visualization Component
 * Displays 5-pillar radar chart, progress bars, and grade card
 */

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip,
} from "recharts";
import {
  calculateEDIScorecard, getGradeColor, getGradeBg, getPillarColor,
  type EDIScorecard, PILLAR_KEYS, PILLAR_CONFIG,
} from "@/lib/ediScoring";

interface NomineeEDIScoresProps {
  nomineeId: number;
  achievement: string;
  category: string;
  compact?: boolean;
}

export function NomineeEDIScores({ nomineeId, achievement, category, compact = false }: NomineeEDIScoresProps) {
  const scorecard = useMemo(
    () => calculateEDIScorecard(nomineeId, achievement, category),
    [nomineeId, achievement, category]
  );

  const radarData = scorecard.pillars.map(p => ({
    pillar: p.pillar.replace("& ", "&\n"),
    shortLabel: p.pillar.split(" ")[0],
    score: p.score,
    fullMark: 100,
  }));

  if (compact) {
    return <CompactEDI scorecard={scorecard} />;
  }

  return (
    <div className="space-y-4">
      {/* Overall Grade Card */}
      <Card className={`border ${getGradeBg(scorecard.grade)}`}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`text-4xl font-display font-bold ${getGradeColor(scorecard.grade)}`}>
            {scorecard.grade}
          </div>
          <div className="flex-1">
            <p className="text-ivory/80 text-sm font-medium">EDI Composite Score</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-display font-bold text-ivory">
                {scorecard.overallScore}
              </span>
              <span className="text-ivory/40 text-xs">/ 100</span>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-ivory/20" />
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card className="bg-charcoal-light/50 border-gold/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-display text-ivory/70 font-medium">5-Pillar Analysis</h3>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="hsl(var(--gold) / 0.1)" />
                <PolarAngleAxis
                  dataKey="shortLabel"
                  tick={{ fill: "hsl(var(--ivory) / 0.5)", fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--ivory) / 0.3)", fontSize: 9 }}
                />
                <Radar
                  name="EDI Score"
                  dataKey="score"
                  stroke="hsl(var(--gold))"
                  fill="hsl(var(--gold) / 0.2)"
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--charcoal))",
                    border: "1px solid hsl(var(--gold) / 0.2)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--ivory))",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pillar Progress Bars */}
      <Card className="bg-charcoal-light/50 border-gold/10">
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-display text-ivory/70 font-medium">Pillar Scores</h3>
          {scorecard.pillars.map(p => (
            <div key={p.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ivory/60">{p.pillar}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] border-ivory/10 text-ivory/40 px-1.5 py-0">
                    {Math.round(p.weight * 100)}%
                  </Badge>
                  <span className="text-xs font-medium text-ivory/80">{p.score}</span>
                </div>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-charcoal">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${p.score}%`,
                    backgroundColor: getPillarColor(p.key),
                  }}
                />
              </div>
              <p className="text-[10px] text-ivory/30 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CompactEDI({ scorecard }: { scorecard: EDIScorecard }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`px-2.5 py-1 rounded-lg border ${getGradeBg(scorecard.grade)}`}>
        <span className={`text-lg font-display font-bold ${getGradeColor(scorecard.grade)}`}>
          {scorecard.grade}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-medium text-ivory/80">{scorecard.overallScore}</span>
          <span className="text-[10px] text-ivory/40">EDI</span>
        </div>
        <div className="flex gap-0.5 mt-1">
          {scorecard.pillars.map(p => (
            <div
              key={p.key}
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: getPillarColor(p.key), opacity: p.score / 100 }}
              title={`${p.pillar}: ${p.score}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NomineeEDIScores;
