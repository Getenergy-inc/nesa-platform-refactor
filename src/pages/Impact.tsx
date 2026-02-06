import { impactItems } from "@/data/impact";
import { validateImpact } from "@/lib/validate";
import { ImpactList } from "@/components/ImpactList";

export default function ImpactPage() {
  const items = validateImpact(impactItems);
  return <ImpactList items={items} />;
}
