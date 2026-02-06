import { awards } from "@/data/awards";
import { validateAwards } from "@/lib/validate";
import { AwardsList } from "@/components/AwardsList";

export default function AwardsPage() {
  const validatedAwards = validateAwards(awards);
  return <AwardsList awards={validatedAwards} />;
}
