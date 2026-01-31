import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DollarSign, Target, ShoppingBag, TrendingUp } from "lucide-react";
import { IMPACT_DESTINATIONS } from "@/types/shop";

interface ImpactSummary {
  total_raised_usd: number;
  total_fx_markup_usd: number;
  total_orders: number;
  by_destination: Record<string, { total_usd: number; count: number }>;
}

export default function AdminImpact() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user && hasRole("admin")) {
      loadImpactSummary();
    }
  }, [authLoading, user]);

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!authLoading && !hasRole("admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  const loadImpactSummary = async () => {
    setLoading(true);
    try {
      const { data: orders } = await supabase
        .from("orders")
        .select("total_usd, fx_markup_amount, impact_destination, status")
        .eq("status", "PAID");

      const result: ImpactSummary = {
        total_raised_usd: 0,
        total_fx_markup_usd: 0,
        total_orders: orders?.length || 0,
        by_destination: {},
      };

      orders?.forEach((order) => {
        result.total_raised_usd += order.total_usd || 0;
        result.total_fx_markup_usd += order.fx_markup_amount || 0;
        
        const dest = order.impact_destination || "EDUAID_AFRICA";
        if (!result.by_destination[dest]) {
          result.by_destination[dest] = { total_usd: 0, count: 0 };
        }
        result.by_destination[dest].total_usd += order.total_usd || 0;
        result.by_destination[dest].count += 1;
      });

      setSummary(result);
    } catch (error) {
      console.error("Failed to load impact summary:", error);
      toast.error("Failed to load impact summary");
    } finally {
      setLoading(false);
    }
  };

  const getDestinationLabel = (key: string) => {
    const dest = IMPACT_DESTINATIONS.find(d => d.value === key);
    return dest?.label || key.replace(/_/g, " ");
  };

  if (authLoading) {
    return (
      <DashboardLayout title="Impact">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Impact Allocation"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Impact" }]}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold">
              ${loading ? "..." : (summary?.total_raised_usd || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">USD from merchandise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">FX Markup</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${loading ? "..." : (summary?.total_fx_markup_usd || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Fundraising from FX</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : summary?.total_orders || 0}
            </div>
            <p className="text-xs text-muted-foreground">Paid orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${loading || !summary?.total_orders ? "0.00" : (summary.total_raised_usd / summary.total_orders).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Impact by Destination */}
      <Card>
        <CardHeader>
          <CardTitle>Impact by Destination</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !summary || Object.keys(summary.by_destination).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No impact data yet</div>
          ) : (
            <div className="space-y-4">
              {IMPACT_DESTINATIONS.map((dest) => {
                const data = summary.by_destination[dest.value];
                const percentage = summary.total_raised_usd > 0 
                  ? ((data?.total_usd || 0) / summary.total_raised_usd) * 100 
                  : 0;
                
                return (
                  <div key={dest.value} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dest.label}</span>
                      <span className="text-muted-foreground">
                        ${(data?.total_usd || 0).toFixed(2)} ({data?.count || 0} orders)
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-gold transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 0)}%` }}
                      />
                    </div>
                    <div className="text-xs text-right text-muted-foreground">
                      {percentage.toFixed(1)}% of total
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
