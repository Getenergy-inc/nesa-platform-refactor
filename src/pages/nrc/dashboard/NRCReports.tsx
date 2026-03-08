/**
 * NRC Reports Dashboard — Charts, metrics, flagged cases
 */

import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";
import {
  BarChart3, TrendingUp, Flag, Clock, CheckCircle, Users,
} from "lucide-react";
import {
  getAllMasterNominees, getMasterCategories, getMasterRegions,
} from "@/lib/nomineeMasterData";

const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--gold) / 0.15)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(var(--foreground))",
  },
};

function ReportsContent() {
  const nominees = useMemo(() => getAllMasterNominees(), []);
  const categories = useMemo(() => getMasterCategories(), []);
  const regions = useMemo(() => getMasterRegions(), []);

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    nominees.forEach(n => { map[n.workflowStatus] = (map[n.workflowStatus] || 0) + 1; });
    return map;
  }, [nominees]);

  const pathwayCounts = useMemo(() => {
    const map: Record<string, number> = {};
    nominees.forEach(n => { map[n.pathway] = (map[n.pathway] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [nominees]);

  const pathwayColors = ["#d4a017", "#10b981", "#3b82f6", "#8b5cf6"];

  const cleared = statusCounts["nomination_cleared"] || 0;
  const declined = statusCounts["rejected"] || 0;
  const clearanceRate = nominees.length > 0 ? Math.round((cleared / nominees.length) * 100) : 0;
  const declineRate = nominees.length > 0 ? Math.round((declined / nominees.length) * 100) : 0;

  // Simulated trend data
  const trendData = [
    { week: "W1", reviewed: 45, cleared: 12 },
    { week: "W2", reviewed: 78, cleared: 28 },
    { week: "W3", reviewed: 120, cleared: 52 },
    { week: "W4", reviewed: 160, cleared: 80 },
    { week: "W5", reviewed: 200, cleared: 110 },
    { week: "W6", reviewed: nominees.length, cleared },
  ];

  const regionData = regions.slice(0, 10).map(r => ({
    name: r.length > 18 ? r.slice(0, 15) + "…" : r,
    count: nominees.filter(n => n.region === r).length,
  }));

  const summaryStats = [
    { label: "Total Nominees", value: nominees.length, icon: Users, color: "text-primary" },
    { label: "Clearance Rate", value: `${clearanceRate}%`, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Decline Rate", value: `${declineRate}%`, icon: TrendingUp, color: "text-red-400" },
    { label: "Avg Review Time", value: "3.5 days", icon: Clock, color: "text-amber-400" },
    { label: "Flagged Cases", value: Math.round(nominees.length * 0.05), icon: Flag, color: "text-orange-400" },
    { label: "Categories", value: categories.length, icon: BarChart3, color: "text-blue-400" },
  ];

  return (
    <NRCDashboardLayout>
      <Helmet>
        <title>Reports | NRC Dashboard</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold font-display">Review Reports</h1>
          <p className="text-xs text-muted-foreground">NESA Africa 2025 — Aggregated review metrics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {summaryStats.map(s => (
            <Card key={s.label} className="border-[hsl(var(--gold)/0.08)]">
              <CardContent className="p-3 text-center">
                <s.icon className={`mx-auto mb-1.5 h-4 w-4 ${s.color}`} />
                <div className={`text-xl font-display font-bold ${s.color}`}>{s.value}</div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Review Progress Trend */}
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">Review Progress Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gold) / 0.06)" />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip {...CHART_TOOLTIP} />
                    <Line type="monotone" dataKey="reviewed" stroke="hsl(var(--gold))" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="cleared" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pathway Breakdown */}
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">Pathway Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pathwayCounts}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="hsl(var(--card))"
                      >
                        {pathwayCounts.map((_, i) => (
                          <Cell key={i} fill={pathwayColors[i % pathwayColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip {...CHART_TOOLTIP} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {pathwayCounts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pathwayColors[i % pathwayColors.length] }} />
                      <span className="text-xs text-muted-foreground flex-1 truncate">{p.name}</span>
                      <span className="text-xs font-medium">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Summary */}
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">Regional Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip {...CHART_TOOLTIP} />
                    <Bar dataKey="count" fill="hsl(var(--gold))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Summary */}
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">Category Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {categories.map(c => {
                  const pct = Math.round((c.count / nominees.length) * 100);
                  return (
                    <div key={c.slug} className="flex items-center gap-3">
                      <span className="w-40 truncate text-[11px] text-muted-foreground">{c.name}</span>
                      <div className="flex-1">
                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted/20">
                          <div className="h-full rounded-full bg-primary/50" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="w-8 text-right text-[11px] font-medium">{c.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NRCDashboardLayout>
  );
}

export default function NRCReports() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <ReportsContent />
    </ProtectedRoute>
  );
}
