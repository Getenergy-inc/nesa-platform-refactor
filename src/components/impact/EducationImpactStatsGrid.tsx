// Live impact statistics grid — reuses the sitewide null="—" contract.
import { useEducationImpactStats, formatImpactStat } from "@/hooks/useEducationImpactStats";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** Subset of stats to show; defaults to the full set. */
  only?: string[];
}

export default function EducationImpactStatsGrid({ className, only }: Props) {
  const s = useEducationImpactStats();

  const all: { id: string; label: string; value: number | null }[] = [
    { id: "schools", label: "Schools Supported", value: s.schoolsSupported },
    { id: "learners", label: "Learners Reached", value: s.learnersReached },
    { id: "teachers", label: "Teachers Supported", value: s.teachersSupported },
    { id: "communities", label: "Communities Reached", value: s.communitiesReached },
    { id: "countries", label: "Countries Reached", value: s.countries },
    { id: "regions", label: "Regions Reached", value: s.regions },
    { id: "completed", label: "Projects Completed", value: s.projectsCompleted },
    { id: "in-progress", label: "Projects in Progress", value: s.projectsInProgress },
    { id: "friends", label: "Friends of EduAid-Africa", value: s.friendsOfEduAid },
  ];

  const items = only ? all.filter((i) => only.includes(i.id)) : all;

  const allZeroOrUnknown = items.every((i) => i.value === null || i.value === 0);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
        aria-busy={s.loading || undefined}
      >
        {items.map((i) => (
          <div
            key={i.id}
            className="rounded-xl border border-gold/20 bg-white/[0.03] px-4 py-5 text-center"
          >
            <div className="font-playfair text-2xl md:text-3xl font-bold text-gold tabular-nums">
              {formatImpactStat(i.value)}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-white/65">
              {i.label}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-white/55 max-w-3xl">
        {s.error
          ? "Impact figures are temporarily unavailable. Values shown as “—” could not be read from the programme database."
          : allZeroOrUnknown
            ? "Verified intervention reporting for the 2026–2027 cycle is being prepared. Figures publish automatically as interventions are verified — no estimates are displayed."
            : "All figures are read directly from verified programme records. “—” means the figure is not yet captured or could not be loaded; it never means zero."}
      </p>
    </div>
  );
}
