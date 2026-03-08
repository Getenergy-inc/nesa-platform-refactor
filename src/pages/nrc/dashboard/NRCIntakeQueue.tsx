/**
 * NRC Intake Queue — Automated Nomination Processing Dashboard
 * Shows all incoming nominations with auto-classification, duplicate detection, and routing
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, CheckCircle2, Clock, XCircle, FileCheck, AlertTriangle,
  Search, Eye, Flag, RotateCcw, Merge, UserCheck, FileWarning,
  Inbox, ArrowRight, Copy, TrendingUp, Filter,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  generateIntakeRecords,
  computeIntakeStats,
  INTAKE_STATUS_CONFIG,
  NOMINATION_TYPE_CONFIG,
  type IntakeRecord,
  type IntakeStatus,
  type NominationType,
} from "@/lib/nominationEngine";

const PIE_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#f97316"];

function IntakeQueueContent() {
  const records = useMemo(() => generateIntakeRecords(), []);
  const stats = useMemo(() => computeIntakeStats(records), [records]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const filtered = useMemo(() => {
    let result = records;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.nomineeName.toLowerCase().includes(q) ||
        r.nominatorName.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter(r => r.intakeStatus === statusFilter);
    if (typeFilter !== "all") result = result.filter(r => r.nominationType === typeFilter);
    return result;
  }, [records, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const typeChartData = [
    { name: "New", value: stats.newNominees },
    { name: "Existing", value: stats.existingNominees },
    { name: "Re-Nom", value: stats.reNominations },
    { name: "Duplicate", value: stats.duplicates },
    { name: "Incomplete", value: stats.incomplete },
  ].filter(d => d.value > 0);

  const statusChartData = [
    { name: "Screening", value: stats.pendingScreening },
    { name: "Dup Check", value: stats.pendingDuplicateCheck },
    { name: "Doc Review", value: stats.pendingDocReview },
    { name: "NRC Review", value: stats.pendingNRCReview },
    { name: "Cleared", value: stats.cleared },
    { name: "Declined", value: stats.declined },
  ].filter(d => d.value > 0);

  const clearanceRate = stats.total > 0 ? Math.round((stats.cleared / stats.total) * 100) : 0;

  return (
    <>
      <Helmet><title>Intake Queue — NRC Dashboard</title></Helmet>
      <NRCDashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Nomination Intake Queue</h1>
              <p className="text-sm text-white/50">Automated processing of incoming nominations</p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 self-start">
              <Inbox className="mr-1 h-3 w-3" />
              {stats.total} Total Nominations
            </Badge>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {[
              { label: "New Nominees", value: stats.newNominees, icon: UserCheck, color: "text-emerald-400" },
              { label: "Existing", value: stats.existingNominees, icon: Users, color: "text-blue-400" },
              { label: "Re-Nominations", value: stats.reNominations, icon: RotateCcw, color: "text-purple-400" },
              { label: "Duplicates", value: stats.duplicates, icon: Copy, color: "text-amber-400" },
              { label: "Incomplete", value: stats.incomplete, icon: FileWarning, color: "text-red-400" },
              { label: "Flagged", value: stats.flagged, icon: Flag, color: "text-orange-400" },
            ].map(c => (
              <Card key={c.label} className="bg-[hsl(30,5%,12%)] border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <c.icon className={`h-4 w-4 ${c.color}`} />
                    <span className="text-2xl font-bold text-white">{c.value}</span>
                  </div>
                  <p className="text-xs text-white/40">{c.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pipeline Progress */}
          <Card className="bg-[hsl(30,5%,12%)] border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/70 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gold" />
                Processing Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Pending Screening", value: stats.pendingScreening, total: stats.total, color: "bg-blue-500" },
                  { label: "Duplicate Check", value: stats.pendingDuplicateCheck, total: stats.total, color: "bg-amber-500" },
                  { label: "Under NRC Review", value: stats.pendingNRCReview, total: stats.total, color: "bg-purple-500" },
                  { label: "Clearance Rate", value: clearanceRate, total: 100, color: "bg-emerald-500", suffix: "%" },
                ].map(p => (
                  <div key={p.label} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/50">{p.label}</span>
                      <span className="text-white font-medium">{p.value}{p.suffix || ""}</span>
                    </div>
                    <Progress
                      value={p.total > 0 ? (p.value / p.total) * 100 : 0}
                      className="h-2 bg-white/5"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-[hsl(30,5%,12%)] border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70">Nomination Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={typeChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                        {typeChartData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[hsl(30,5%,12%)] border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70">Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusChartData} layout="vertical">
                      <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                      <Bar dataKey="value" fill="hsl(43, 74%, 49%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-[hsl(30,5%,12%)] border-white/5">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    placeholder="Search nominees, nominators, countries..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                    <Filter className="mr-2 h-3 w-3" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.entries(INTAKE_STATUS_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                    <Filter className="mr-2 h-3 w-3" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(NOMINATION_TYPE_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="bg-[hsl(30,5%,12%)] border-white/5">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white/50">Nominee</TableHead>
                      <TableHead className="text-white/50">Country</TableHead>
                      <TableHead className="text-white/50">Type</TableHead>
                      <TableHead className="text-white/50">Status</TableHead>
                      <TableHead className="text-white/50">Nominator</TableHead>
                      <TableHead className="text-white/50">Reviewer</TableHead>
                      <TableHead className="text-white/50">Flags</TableHead>
                      <TableHead className="text-white/50 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map(r => {
                      const statusCfg = INTAKE_STATUS_CONFIG[r.intakeStatus];
                      const typeCfg = NOMINATION_TYPE_CONFIG[r.nominationType];
                      return (
                        <TableRow key={r.id} className="border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div>
                              <p className="font-medium text-white text-sm">{r.nomineeName}</p>
                              <p className="text-xs text-white/40 truncate max-w-[180px]">{r.category}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/60 text-sm">{r.country}</TableCell>
                          <TableCell>
                            <Badge className={`${typeCfg.color} border-0 text-xs`}>{typeCfg.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusCfg.color} border-0 text-xs`}>
                              {statusCfg.icon} {statusCfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-white/60">{r.nominatorName}</p>
                          </TableCell>
                          <TableCell className="text-sm text-white/50">
                            {r.assignedReviewer || <span className="text-white/20">Unassigned</span>}
                          </TableCell>
                          <TableCell>
                            {r.flags.length > 0 ? (
                              <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-xs">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                {r.flags.length}
                              </Badge>
                            ) : (
                              <span className="text-white/20 text-xs">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-white/50 hover:text-white" asChild>
                                <Link to={`/nrc/dashboard/intake/${r.id}`}>
                                  <Eye className="h-3 w-3" />
                                </Link>
                              </Button>
                              {r.nominationType === "duplicate_submission" && (
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-amber-400 hover:text-amber-300">
                                  <Merge className="h-3 w-3" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-emerald-400 hover:text-emerald-300">
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
                  <p className="text-xs text-white/40">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-white/50">
                      Previous
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-white/50">
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </NRCDashboardLayout>
    </>
  );
}

export default function NRCIntakeQueue() {
  return (
    <ProtectedRoute>
      <IntakeQueueContent />
    </ProtectedRoute>
  );
}
