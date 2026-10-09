import { Card, CardContent } from "@/components/ui/card";
import { Users, School, GraduationCap, BookOpen, Globe2, HandCoins } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ImpactMetrics {
  learnersReached?: number | string | null;
  schoolsSupported?: number | string | null;
  teachersTrained?: number | string | null;
  scholarshipsFunded?: number | string | null;
  communitiesImpacted?: number | string | null;
  countriesActive?: number | string | null;
}

interface Props {
  metrics?: ImpactMetrics;
  nomineeName: string;
}

const ITEMS = [
  { key: "learnersReached", label: "Learners Reached", icon: Users },
  { key: "schoolsSupported", label: "Schools Supported", icon: School },
  { key: "teachersTrained", label: "Teachers Trained", icon: GraduationCap },
  { key: "scholarshipsFunded", label: "Scholarships Funded", icon: HandCoins },
  { key: "communitiesImpacted", label: "Communities Impacted", icon: BookOpen },
  { key: "countriesActive", label: "Countries Active", icon: Globe2 },
] as const;

function fmt(v: unknown): string | null {
  if (v == null || v === "") return null;
  if (typeof v === "number") return v.toLocaleString();
  return String(v);
}

/**
 * Education for All metrics block. Renders verified metrics when present;
 * shows "Pending verification" placeholders otherwise.
 */
export function EducationForAllMetrics({ metrics, nomineeName }: Props) {
  const m = metrics ?? {};
  const hasAny = ITEMS.some((it) => fmt((m as any)[it.key]));

  return (
    <Card className="bg-charcoal-light/50 border-gold/10">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-display text-ivory font-semibold">
              How {nomineeName.split(" ")[0]} Advances Education for All
            </h2>
            <p className="text-[11px] text-ivory/55 mt-0.5">
              Measurable contributions aligned with SDG 4 and the AU Agenda 2063.
            </p>
          </div>
        </div>

        {!hasAny && (
          <Badge variant="outline" className="border-gold/25 text-gold/80 text-[10px] mt-2 mb-4">
            Metrics pending NRC verification
          </Badge>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            const value = fmt((m as any)[it.key]);
            return (
              <div
                key={it.key}
                className="rounded-xl border border-gold/10 bg-charcoal/40 p-3 sm:p-4"
              >
                <Icon className="w-4 h-4 text-gold mb-2" />
                <p className="font-display text-lg sm:text-xl font-bold text-ivory leading-none">
                  {value ?? "—"}
                </p>
                <p className="text-[10px] sm:text-xs text-ivory/60 mt-1.5 leading-tight">
                  {it.label}
                </p>
                {!value && (
                  <p className="text-[9px] text-ivory/35 mt-0.5 italic">Pending verification</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default EducationForAllMetrics;
