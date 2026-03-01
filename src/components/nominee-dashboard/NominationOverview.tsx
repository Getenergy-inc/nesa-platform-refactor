import { Card, CardContent } from "@/components/ui/card";
import { NominationDashboardItem } from "@/types/nominee_dashboard";

export function NominationOverviewCard({
  nomination,
}: {
  nomination: NominationDashboardItem;
}) {
  return (
    <Card>
      <CardContent className="p-6 space-y-2">
        <p>
          <strong>Category:</strong> {nomination.category}
        </p>
        <p>
          <strong>Subcategory:</strong> {nomination.subcategory}
        </p>
        <p>
          <strong>Tier:</strong> {nomination.tier}
        </p>
      </CardContent>
    </Card>
  );
}
