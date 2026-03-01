import { Button } from "@/components/ui/button";
import { NominationDashboardItem } from "@/types/nominee_dashboard";

interface Props {
  nominations: NominationDashboardItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function NominationSelector({
  nominations,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {nominations.map((nom) => (
        <Button
          key={nom.id}
          variant={selectedId === nom.id ? "default" : "outline"}
          onClick={() => onSelect(nom.id)}
        >
          {nom.category} — {nom.subcategory}
        </Button>
      ))}
    </div>
  );
}
