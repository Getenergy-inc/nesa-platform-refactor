/**
 * Nominee Duplicate Detection Component
 * Live search that checks if a nominee already exists as user types
 */

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, RotateCcw, ArrowRight, User, CheckCircle } from "lucide-react";
import { detectDuplicates, type DuplicateMatch } from "@/lib/nominationEngine";

interface NomineeDuplicateDetectorProps {
  nomineeName: string;
  country?: string;
  category?: string;
  onReNominate?: (nomineeId: number, nomineeName: string) => void;
  onContinueAsNew?: () => void;
}

export function NomineeDuplicateDetector({
  nomineeName,
  country,
  category,
  onReNominate,
  onContinueAsNew,
}: NomineeDuplicateDetectorProps) {
  const [dismissed, setDismissed] = useState(false);

  const matches = useMemo(() => {
    if (!nomineeName || nomineeName.trim().length < 3) return [];
    return detectDuplicates(nomineeName, country, category);
  }, [nomineeName, country, category]);

  // Reset dismissed when name changes significantly
  useEffect(() => {
    setDismissed(false);
  }, [nomineeName]);

  if (dismissed || matches.length === 0) return null;

  const hasExact = matches.some(m => m.matchType === "exact");

  return (
    <Card className={`border ${hasExact ? "border-amber-500/30 bg-amber-500/5" : "border-blue-500/20 bg-blue-500/5"}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {hasExact ? (
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          ) : (
            <User className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${hasExact ? "text-amber-400" : "text-blue-400"}`}>
              {hasExact
                ? "This nominee already exists in the NESA system."
                : "Similar nominees found in the NESA system."}
            </p>
            <p className="text-xs text-white/50 mt-1">
              {hasExact
                ? "You can re-nominate them or continue if this is a different person."
                : "Review the matches below to avoid duplicate entries."}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {matches.slice(0, 3).map((m, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{m.nominee.name}</p>
                <p className="text-xs text-white/40">
                  {m.nominee.country} — {m.nominee.category}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <Badge className={`text-xs border-0 ${
                  m.confidence >= 90 ? "bg-red-500/20 text-red-400" :
                  m.confidence >= 75 ? "bg-amber-500/20 text-amber-400" :
                  "bg-white/10 text-white/50"
                }`}>
                  {m.confidence}%
                </Badge>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-white/50" asChild>
                  <Link to={`/nominees/${m.nominee.slug}`} target="_blank">
                    <Eye className="h-3 w-3" />
                  </Link>
                </Button>
                {onReNominate && (
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-gold"
                    onClick={() => onReNominate(m.nominee.id, m.nominee.name)}>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Re-Nominate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-1">
          <Button size="sm" variant="ghost" className="text-xs text-white/30"
            onClick={() => setDismissed(true)}>
            Dismiss
          </Button>
          {onContinueAsNew && (
            <Button size="sm" variant="ghost" className="text-xs text-gold gap-1"
              onClick={onContinueAsNew}>
              Continue as New Nominee
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
