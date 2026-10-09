import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, MapPin, Building } from "lucide-react";
import type { NomineeEntry } from "./types";

const PATHWAY_LABEL: Record<string, string> = {
  icon: "Africa Education Icon",
  "gold-bluegarnet": "Gold-Blue Garnet",
  platinum: "Platinum Recognition",
  influencer: "Influencer Education Impact",
  "special-needs-school": "Special Needs School",
};

export function NomineeReviewCard({
  entry,
  index,
  onEdit,
  onRemove,
}: {
  entry: NomineeEntry;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-charcoal/60 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-gold/70">#{index + 1}</span>
            <Badge variant="outline" className="border-gold/30 text-gold bg-gold/10 text-[10px]">
              {PATHWAY_LABEL[entry.pathway] ?? entry.pathway}
            </Badge>
            <Badge variant="outline" className="border-white/15 text-white/70 text-[10px]">
              {entry.nomineeType}
            </Badge>
          </div>
          <h3 className="font-display text-lg font-semibold text-white truncate">
            {entry.nomineeName}
          </h3>
          <p className="text-xs text-white/60">
            {entry.category}
            {entry.subcategory ? ` · ${entry.subcategory}` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-white/65">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3 text-gold/70" />
          {entry.region}
          {entry.country ? `, ${entry.country}` : ""}
        </span>
        {entry.organization && (
          <span className="inline-flex items-center gap-1">
            <Building className="h-3 w-3 text-gold/70" />
            {entry.organization}
          </span>
        )}
      </div>

      <p className="text-sm text-white/75 leading-relaxed line-clamp-3">{entry.impactSummary}</p>

      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-1.5"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="rounded-full text-red-300 hover:text-red-200 hover:bg-red-500/10 gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </Button>
      </div>
    </article>
  );
}
