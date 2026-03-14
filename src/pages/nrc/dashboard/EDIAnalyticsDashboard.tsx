/**
 * NESA Africa — EDI Analytics Dashboard
 * Category benchmarks, regional benchmarks, nominee rankings, visual charts
 */

import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  BarChart3, Globe2, Trophy, TrendingUp, Search, Award,
} from "lucide-react";
import {
  getAllMasterNominees, getMasterCategories, getMasterRegions,
} from "@/lib/nomineeMasterData";
import {
  calculateEDIScorecard, computeCategoryBenchmarks, computeRegionalBenchmarks,
  getGradeColor, getGradeBg, getPillarColor, PILLAR_KEYS, PILLAR_CONFIG,
  type EDIGrade,
} from "@/lib/ediScoring";

const CHART_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899", "#84cc16"];

function EDIContent() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  const nominees = useMemo(() => getAllMasterNominees(), []);

  const nomineeScores = useMemo(() => {
    return nominees.map(n => ({
      ...n,
      scorecard: calculateEDIScorecard(n.id, n.achievement, n.category),
    }));
  }, [nominees]);

  const categoryBenchmarks = useMemo(() =>
    computeCategoryBenchmarks(nominees.map(n => ({ id: n.id, name: n.name, category: n.category, achievement: n.achievement }))),
    [nominees]
  );

  const regionalBenchmarks = useMemo(() =>
    computeRegionalBenchmarks(nominees.map(n => ({ id: n.id, name: n.name, category: n.category, achievement: n.achievement, region: n.region }))),
    [nominees]
  );

  const overallAvg = useMemo(() => {
    const total = nomineeScores.reduce((s, n) => s + n.scorecard.overallScore, 0);
    return Math.round(total / nomineeScores.length);
  }, [nomineeScores]);

  const gradeDistribution = useMemo(() => {
    const dist: Record<EDIGrade, number> = { "A+": 0, "A": 0, "B+": 0, "B": 0, "C+": 0, "C": 0, "D": 0 };
    nomineeScores.forEach(n => dist[n.scorecard.grade]++);
    return Object.entries(dist).map(([grade, count]) => ({ grade, count }));
  }, [nomineeScores]);

  const filteredRanking = useMemo(() => {
    let list = [...nomineeScores];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n => n.name.toLowerCase().includes(q) || n.category.toLowerCase().includes(q));
    }
    if (sortBy === "score") list.sort((a, b) => b.scorecard.overallScore - a.scorecard.overallScore);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list.slice(0, 50);
  }, [nomineeScores, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Trophy className="w-5 h-5 text-gold" />} label="Total Nominees Scored" value={nomineeScores.length} />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} label="Platform Average" value={`${overallAvg} / 100`} />
        <StatCard icon={<Award className="w-5 h-5 text-blue-400" />} label="Categories" value={categoryBenchmarks.length} />
        <StatCard icon={<Globe2 className="w-5 h-5 text-cyan-400" />} label="Regions" value={regionalBenchmarks.length} />
      </div>

      {/* Grade Distribution */}
      <Card className="bg-charcoal-light/50 border-gold/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-ivory/70 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gold" /> Grade Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <XAxis dataKey="grade" tick={{ fill: "hsl(var(--ivory) / 0.5)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--ivory) / 0.3)", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--charcoal))", border: "1px solid hsl(var(--gold) / 0.2)", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--ivory))" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {gradeDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Benchmarks */}
      <Card className="bg-charcoal-light/50 border-gold/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-ivory/70 flex items-center gap-2">
            <Award className="w-4 h-4 text-gold" /> Category Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBenchmarks.slice(0, 12)} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--ivory) / 0.3)", fontSize: 10 }} />
                <YAxis dataKey="category" type="category" width={180} tick={{ fill: "hsl(var(--ivory) / 0.5)", fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--charcoal))", border: "1px solid hsl(var(--gold) / 0.2)", borderRadius: "8px", fontSize: "11px", color: "hsl(var(--ivory))" }} />
                <Bar dataKey="avgScore" fill="hsl(var(--gold))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
            {categoryBenchmarks.map(cb => (
              <div key={cb.category} className="bg-charcoal/50 rounded-lg p-2 border border-gold/5">
                <div className="text-[10px] text-ivory/40 truncate">{cb.category}</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-sm font-bold text-gold">{cb.avgScore}</span>
                  <span className="text-[9px] text-ivory/30">avg · {cb.count} nominees</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Benchmarks */}
      <Card className="bg-charcoal-light/50 border-gold/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-ivory/70 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-gold" /> Regional Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalBenchmarks}>
                  <XAxis dataKey="region" tick={{ fill: "hsl(var(--ivory) / 0.5)", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--ivory) / 0.3)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--charcoal))", border: "1px solid hsl(var(--gold) / 0.2)", borderRadius: "8px", fontSize: "11px", color: "hsl(var(--ivory))" }} />
                  <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                    {regionalBenchmarks.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {regionalBenchmarks.map((rb, i) => (
                <div key={rb.region} className="flex items-center gap-3 bg-charcoal/50 rounded-lg p-2.5 border border-gold/5">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-ivory/70 font-medium">{rb.region}</div>
                    <div className="text-[10px] text-ivory/30">{rb.count} nominees</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gold">{rb.avgScore}</div>
                    <div className="text-[9px] text-ivory/30">avg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nominee Ranking Table */}
      <Card className="bg-charcoal-light/50 border-gold/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-sm font-display text-ivory/70 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold" /> Nominee EDI Ranking
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ivory/30" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search nominees..."
                  className="pl-7 h-8 text-xs bg-charcoal border-gold/10 text-ivory w-48"
                />
              </div>
              <Select value={sortBy} onValueChange={(v: "score" | "name") => setSortBy(v)}>
                <SelectTrigger className="h-8 text-xs bg-charcoal border-gold/10 text-ivory w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">By Score</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gold/10 text-ivory/40">
                  <th className="text-left py-2 px-2">#</th>
                  <th className="text-left py-2 px-2">Nominee</th>
                  <th className="text-left py-2 px-2 hidden md:table-cell">Category</th>
                  <th className="text-center py-2 px-1">Access</th>
                  <th className="text-center py-2 px-1">Quality</th>
                  <th className="text-center py-2 px-1">Instit.</th>
                  <th className="text-center py-2 px-1">Innov.</th>
                  <th className="text-center py-2 px-1">Sustain.</th>
                  <th className="text-center py-2 px-2">Total</th>
                  <th className="text-center py-2 px-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {filteredRanking.map((n, i) => (
                  <tr key={n.id} className="border-b border-gold/5 hover:bg-gold/5 transition-colors">
                    <td className="py-2 px-2 text-ivory/30 font-mono">{i + 1}</td>
                    <td className="py-2 px-2 text-ivory/80 font-medium truncate max-w-[160px]">{n.name}</td>
                    <td className="py-2 px-2 text-ivory/40 truncate max-w-[140px] hidden md:table-cell">{n.category}</td>
                    {n.scorecard.pillars.map(p => (
                      <td key={p.key} className="py-2 px-1 text-center">
                        <span className="text-ivory/60">{p.score}</span>
                        <span className="text-ivory/20 text-[9px]">/{p.maxScore}</span>
                      </td>
                    ))}
                    <td className="py-2 px-2 text-center font-bold text-gold">{n.scorecard.overallScore}</td>
                    <td className="py-2 px-2 text-center">
                      <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getGradeColor(n.scorecard.grade)} border-current`}>
                        {n.scorecard.grade}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card className="bg-charcoal-light/50 border-gold/10">
      <CardContent className="p-4 flex items-center gap-3">
        {icon}
        <div>
          <div className="text-lg font-display font-bold text-ivory">{value}</div>
          <div className="text-[10px] text-ivory/40">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EDIAnalyticsDashboard() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'nrc']}>
      <Helmet>
        <title>EDI Analytics — NESA Africa NRC</title>
      </Helmet>
      <NRCDashboardLayout>
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-xl font-display font-bold text-ivory">EDI Impact Analytics</h1>
            <p className="text-xs text-ivory/40 mt-1">Education Development Index — Continental scoring & benchmarking</p>
          </div>
          <EDIContent />
        </div>
      </NRCDashboardLayout>
    </ProtectedRoute>
  );
}
