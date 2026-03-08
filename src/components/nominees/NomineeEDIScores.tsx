/**
 * NESA Africa — EDI Score Visualization Component
 * Displays radar chart, pillar bars with max scores, grade card, impact summary, and benchmarking
 */

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Sparkles, Info } from "lucide-react";
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
  categoryAvg?: number;
  regionAvg?: number;
}

export function NomineeEDIScores({ nomineeId, achievement, category, compact = false, categoryAvg, regionAvg }: NomineeEDIScoresProps) {
  const scorecard = useMemo(
    () => calculateEDIScorecard(nomineeId, achievement, category),
    [nomineeId, achievement, category]
  );

  // Radar data normalized to percentage for visual comparison
  const radarData = scorecard.pillars.map(p => ({
    pillar: p.pillar.replace("& ", "&\n"),
    shortLabel: p.pillar.split(" ")[0],
    score: p.percentage,
    fullMark: 100,
  }));

  if (compact) {
    return <CompactEDI scorecard={scorecard} />;
  }

  return (
    <div className="space-y-4">
      {/* Overall Score Hero */}
      <Card className={`border ${getGradeBg(scorecard.grade)}`}>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-5xl font-display font-bold ${getGradeColor(scorecard.grade)}`}>
                {scorecard.overallScore}
              </div>
              <div className="text-ivory/30 text-xs mt-1">/ 100</div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-ivory/80 text-sm font-medium">EDI Impact Score</span>
                <Badge variant="outline" className={`text-xs ${getGradeColor(scorecard.grade)} border-current`}>
                  Grade {scorecard.grade}
                </Badge>
              </div>
              {(categoryAvg || regionAvg) && (
                <div className="flex gap-3 text-[11px] text-ivory/40">
                  {categoryAvg && (
                    <span>Category avg: <span className={scorecard.overallScore >= categoryAvg ? "text-emerald-400" : "text-amber-400"}>{categoryAvg}</span></span>
                  )}
                  {regionAvg && (
                    <span>Region avg: <span className={scorecard.overallScore >= regionAvg ? "text-emerald-400" : "text-amber-400"}>{regionAvg}</span></span>
                  )}
                </div>
              )}
            </div>
            <TrendingUp className="w-5 h-5 text-ivory/20" />
          </div>
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
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pillar Score Bars */}
      <Card className="bg-charcoal-light/50 border-gold/10">
        <CardContent className="p-4 space-y-4">
          <h3 className="text-sm font-display text-ivory/70 font-medium">Pillar Breakdown</h3>
          {scorecard.pillars.map(p => (
            <div key={p.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ivory/60">{p.pillar}</span>
                <span className="text-xs font-semibold text-ivory/80">
                  {p.score} <span className="text-ivory/30">/ {p.maxScore}</span>
                </span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-charcoal">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${p.percentage}%`,
                    backgroundColor: getPillarColor(p.key),
                  }}
                />
              </div>
              <p className="text-[10px] text-ivory/30 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card className="bg-charcoal-light/50 border-gold/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-display text-ivory/70 font-medium">Impact Assessment</h3>
          </div>
          <p className="text-xs text-ivory/50 leading-relaxed">{scorecard.impactSummary}</p>
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
          {scorecard.overallScore}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-medium text-ivory/80">EDI</span>
          <span className="text-[10px] text-ivory/40">/ 100</span>
          <Badge variant="outline" className={`ml-1 text-[9px] px-1 py-0 ${getGradeColor(scorecard.grade)} border-current`}>
            {scorecard.grade}
          </Badge>
        </div>
        <div className="flex gap-0.5 mt-1">
          {scorecard.pillars.map(p => (
            <div
              key={p.key}
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: getPillarColor(p.key), opacity: 0.3 + (p.percentage / 100) * 0.7 }}
              title={`${p.pillar}: ${p.score}/${p.maxScore}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NomineeEDIScores;
