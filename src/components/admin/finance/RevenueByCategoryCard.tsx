import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCheck, Vote, Heart, Ticket } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FinanceOverview } from "@/types/admin";

interface RevenueByCategoryCardProps {
  data: FinanceOverview | null;
  loading?: boolean;
}

export function RevenueByCategoryCard({ data, loading }: RevenueByCategoryCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const categories = [
    {
      label: "Nominations",
      value: data?.revenue_by_category?.nomination ?? 0,
      icon: FileCheck,
      color: "bg-blue-500",
    },
    {
      label: "Votes",
      value: data?.revenue_by_category?.vote ?? 0,
      icon: Vote,
      color: "bg-amber-500",
    },
    {
      label: "Donations",
      value: data?.revenue_by_category?.donation ?? 0,
      icon: Heart,
      color: "bg-rose-500",
    },
    {
      label: "Tickets",
      value: data?.revenue_by_category?.ticket ?? 0,
      icon: Ticket,
      color: "bg-purple-500",
    },
  ];

  const total = categories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Revenue by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((cat) => {
          const percentage = total > 0 ? (cat.value / total) * 100 : 0;
          return (
            <div key={cat.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <cat.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
                <span className="text-sm font-semibold">
                  ${cat.value.toLocaleString()}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            <span className="text-lg font-bold">${total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
