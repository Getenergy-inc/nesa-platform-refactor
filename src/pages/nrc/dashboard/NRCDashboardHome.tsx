/**
 * NRC Dashboard Home — Overview with stats, charts, activity feed
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users, CheckCircle2, Clock, XCircle, FileCheck, Shield,
  Flag, ArrowRight, BarChart3, AlertTriangle, TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  getAllMasterNominees, getMasterCategories, getMasterRegions,
  type MasterNominee,
} from "@/lib/nomineeMasterData";

const STATUS_COLORS: Record<string, string> = {
  nomination_submitted: "#3b82f6",
  eligibility_screening: "#f59e0b",
  documentation_verification: "#f97316",
  nrc_review: "#8b5cf6",
  nomination_cleared: "#10b981",
  rejected: "#ef4444",
};

function DashboardContent() {
  const nominees = useMemo(() => getAllMasterNominees(), []);
  const categories = useMemo(() => getMasterCategories(), []);
  const regions = useMemo(() => getMasterRegions(), []);

  const stats = useMemo(() => {
    const s = {
      total: nominees.length,
      submitted: 0, screening: 0, verification: 0,
      review: 0, cleared: 0, declined: 0, flagged: 0,
    };
    nominees.forEach(n => {
      if (n.workflowStatus === "nomination_submitted") s.submitted++;
      else if (n.workflowStatus === "eligibility_screening") s.screening++;
      else if (n.workflowStatus === "documentation_verification") s.verification++;
      else if (n.workflowStatus === "nrc_review") s.review++;
      else if (n.workflowStatus === "nomination_cleared") s.cleared++;
      else if (n.workflowStatus === "rejected") s.declined++;
    });
    // Flagged = simulated ~5%
    s.flagged = Math.round(s.total * 0.05);
    return s;
  }, [nominees]);

  const categoryChartData = categories.slice(0, 8).map(c => ({
    name: c.name.length > 25 ? c.name.slice(0, 22) + "…" : c.name,
    count: c.count,
  }));

  const statusPieData = [
    { name: "Submitted", value: stats.submitted, color: "#3b82f6" },
    { name: "Screening", value: stats.screening, color: "#f59e0b" },
    { name: "Verification", value: stats.verification, color: "#f97316" },
    { name: "NRC Review", value: stats.review, color: "#8b5cf6" },
    { name: "Cleared", value: stats.cleared, color: "#10b981" },
    { name: "Declined", value: stats.declined, color: "#ef4444" },
  ];

  const recentActivity = [
    { action: "Nomination reviewed", nominee: nominees[0]?.name || "N/A", time: "2 min ago", icon: CheckCircle2 },
    { action: "Document uploaded", nominee: nominees[1]?.name || "N/A", time: "15 min ago", icon: FileCheck },
    { action: "Status changed to NRC Review", nominee: nominees[2]?.name || "N/A", time: "1 hr ago", icon: Shield },
    { action: "Case flagged", nominee: nominees[5]?.name || "N/A", time: "2 hrs ago", icon: Flag },
    { action: "Nominee cleared", nominee: nominees[3]?.name || "N/A", time: "3 hrs ago", icon: CheckCircle2 },
    { action: "Clarification requested", nominee: nominees[4]?.name || "N/A", time: "5 hrs ago", icon: AlertTriangle },
  ];

  const summaryCards = [
    { label: "Total Nominees", value: stats.total, icon: Users, color: "text-primary" },
    { label: "Pending Review", value: stats.submitted + stats.screening, icon: Clock, color: "text-blue-400" },
    { label: "Under Verification", value: stats.verification + stats.review, icon: FileCheck, color: "text-amber-400" },
    { label: "Cleared", value: stats.cleared, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Declined", value: stats.declined, icon: XCircle, color: "text-red-400" },
    { label: "Flagged Cases", value: stats.flagged, icon: Flag, color: "text-orange-400" },
  ];

  const clearanceRate = stats.total > 0 ? Math.round((stats.cleared / stats.total) * 100) : 0;

  return (
    <NRCDashboardLayout>
      <Helmet>
        <title>NRC Dashboard | NESA Africa</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">
              NESA Africa 2025 — Nomination Review Committee
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/nrc/dashboard/reports">
                <BarChart3 className="mr-2 h-4 w-4" /> Reports
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/nrc/dashboard/nominees">
                Review Nominees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {summaryCards.map(card => (
            <Card key={card.label} className="border-[hsl(var(--gold)/0.08)]">
              <CardContent className="p-4 text-center">
                <card.icon className={`mx-auto mb-2 h-5 w-5 ${card.color}`} />
                <div className={`text-2xl font-display font-bold ${card.color}`}>{card.value}</div>
                <p className="mt-1 text-[11px] text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Review Progress / Status Breakdown */}
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Review Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="hsl(var(--card))"
                      >
                        {statusPieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--gold) / 0.15)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {statusPieData.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-xs text-muted-foreground flex-1">{s.name}</span>
                      <span className="text-xs font-medium">{s.value}</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-muted">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Clearance Rate</span>
                      <span className="font-bold text-emerald-400">{clearanceRate}%</span>
                    </div>
                    <Progress value={clearanceRate} className="mt-1.5 h-1.5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--gold) / 0.15)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--gold))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: Regional + Activity */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Regional Summary */}
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">Regional Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {regions.slice(0, 8).map(region => {
                  const count = nominees.filter(n => n.region === region).length;
                  const pct = Math.round((count / nominees.length) * 100);
                  return (
                    <div key={region} className="flex items-center gap-3">
                      <span className="w-32 truncate text-xs text-muted-foreground">{region}</span>
                      <div className="flex-1">
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/30">
                          <div
                            className="h-full rounded-full bg-primary/60"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-8 text-right text-xs font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/30">
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{item.action}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.nominee}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground/60">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NRCDashboardLayout>
  );
}

export default function NRCDashboardHome() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
