import rawAwards from "@/data/awards.json";
import { validateAwards } from "@/lib/validate";
import { AwardsList } from "@/components/AwardsList";

export default function AwardsPage() {
  const awards = validateAwards(rawAwards);
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Awards & Recognition</h1>
      <AwardsList awards={awards} />
    </div>
  );
}
