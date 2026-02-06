import rawImpact from "@/data/impact.json";
import { validateImpact } from "@/lib/validate";
import { ImpactList } from "@/components/ImpactList";

export default function ImpactPage() {
  const items = validateImpact(rawImpact);
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Social Impact</h1>
      <ImpactList items={items} />
    </div>
  );
}
