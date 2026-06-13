/**
 * NESA Africa — EDI-Aligned Story Bullets
 * Renders a compact narrative line per EDI dimension, designed to sit beside
 * the radar chart on nominee profiles. Lines are derived from the deterministic
 * EDI scorecard so they always reflect the displayed scores.
 */

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import {
  calculateEDIScorecard,
  getPillarColor,
  getScoreBandColor,
  PILLAR_CONFIG,
  type EDIPillarKey,
} from "@/lib/ediScoring";

interface EDIStoryBulletsProps {
  nomineeId: number;
  achievement: string;
  category: string;
  nomineeName: string;
}

function lineFor(
  key: EDIPillarKey,
  score: number,
  name: string,
): string {
  const cfg = PILLAR_CONFIG[key];
  const measure = cfg.measures.replace(/\.$/, "").toLowerCase();
  if (score >= 80) {
    return `Outstanding ${cfg.label.toLowerCase()}: ${name} demonstrates ${measure} at a continental scale.`;
  }
  if (score >= 65) {
    return `Strong ${cfg.label.toLowerCase()}: visible ${measure}, with momentum to scale further.`;
  }
  if (score >= 50) {
    return `Emerging ${cfg.label.toLowerCase()}: meaningful traction in ${measure}.`;
  }
  return `Developing ${cfg.label.toLowerCase()}: foundations being laid in ${measure}.`;
}

export function EDIStoryBullets({
  nomineeId,
  achievement,
  category,
  nomineeName,
}: EDIStoryBulletsProps) {
  const scorecard = useMemo(
    () => calculateEDIScorecard(nomineeId, achievement, category),
    [nomineeId, achievement, category],
  );

  return (
    <Card className="bg-charcoal-light/50 border-gold/10">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-display text-ivory/70 font-medium">
            EDI-Aligned Story Bullets
          </h3>
        </div>
        <ul className="space-y-2.5">
          {scorecard.pillars.map((p) => {
            const band = getScoreBandColor(p.score);
            return (
              <li key={p.key} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getPillarColor(p.key) }}
                />
                <p className="text-xs leading-relaxed text-ivory/70">
                  <span className={`font-semibold ${band.text}`}>
                    {Math.round(p.score)}
                  </span>
                  <span className="text-ivory/40"> / 100 — </span>
                  {lineFor(p.key, p.score, nomineeName)}
                </p>
              </li>
            );
          })}
        </ul>
        <p className="text-[10px] text-ivory/35 pt-1">
          Sentences are auto-generated from EDI scores; editors may replace them with
          verified beneficiary stories.
        </p>
      </CardContent>
    </Card>
  );
}

export default EDIStoryBullets;
