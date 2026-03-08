/**
 * NRC Nominee Table — Full list with filters, search, actions
 */

import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { NomineeWorkflowStatusBadge } from "@/components/nominees/NomineeWorkflowStatus";
import {
  Search, Eye, Flag, CheckCircle, RotateCcw, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import {
  getAllMasterNominees, getMasterCategories, getMasterRegions,
  WORKFLOW_STATUS_CONFIG, type MasterNominee, type NomineeWorkflowStatus as WFStatus,
} from "@/lib/nomineeMasterData";
import { calculateEDIScorecard, getGradeColor } from "@/lib/ediScoring";

const PAGE_SIZE = 15;

function NomineeTableContent() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [pathwayFilter, setPathwayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => getMasterCategories(), []);
  const regions = useMemo(() => getMasterRegions(), []);
  const allNominees = useMemo(() => getAllMasterNominees(), []);

  const filtered = useMemo(() => {
    let result = allNominees;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(n =>
        n.name.toLowerCase().includes(q) ||
        n.country.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") result = result.filter(n => n.categorySlug === categoryFilter);
    if (regionFilter !== "all") result = result.filter(n => n.region === regionFilter);
    if (pathwayFilter !== "all") result = result.filter(n => n.pathway === pathwayFilter);
    if (statusFilter !== "all") result = result.filter(n => n.workflowStatus === statusFilter);
    return result;
  }, [allNominees, search, categoryFilter, regionFilter, pathwayFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <NRCDashboardLayout>
      <Helmet>
        <title>All Nominees | NRC Dashboard</title>
      </Helmet>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold font-display">Nominee Registry</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} of {allNominees.length} nominees</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            setSearch(""); setCategoryFilter("all"); setRegionFilter("all");
            setPathwayFilter("all"); setStatusFilter("all"); setPage(1);
          }}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Filters
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-[hsl(var(--gold)/0.08)]">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or country..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="h-8 pl-8 text-xs bg-muted/20 border-muted"
                />
              </div>
              <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
                <SelectTrigger className="h-8 w-[180px] text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.slug} value={c.slug}>{c.name.slice(0, 40)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={v => { setRegionFilter(v); setPage(1); }}>
                <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue placeholder="Region" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={pathwayFilter} onValueChange={v => { setPathwayFilter(v); setPage(1); }}>
                <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue placeholder="Pathway" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pathways</SelectItem>
                  <SelectItem value="Africans in Africa">Africans in Africa</SelectItem>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Africans in Diaspora">Diaspora</SelectItem>
                  <SelectItem value="Friends of Africa">Friends of Africa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="h-8 w-[170px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(WORKFLOW_STATUS_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-[hsl(var(--gold)/0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[hsl(var(--gold)/0.08)] hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold text-muted-foreground/80 w-10">#</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground/80">Nominee</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground/80">Country</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground/80 hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground/80 hidden lg:table-cell">Pathway</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground/80 hidden lg:table-cell">EDI</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground/80">Status</TableHead>
                  <TableHead className="text-[11px] font-semibold text-muted-foreground/80 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(nominee => {
                  const edi = calculateEDIScorecard(nominee.id, nominee.achievement, nominee.category);
                  return (
                    <TableRow key={nominee.id} className="border-b border-[hsl(var(--gold)/0.05)] hover:bg-muted/10">
                      <TableCell className="text-[11px] text-muted-foreground font-mono">
                        {String(nominee.id).padStart(4, "0")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {nominee.name.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate max-w-[180px]">{nominee.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{nominee.subcategory}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{nominee.country}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-[11px] text-muted-foreground truncate block max-w-[140px]">
                          {nominee.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-[10px] border-muted text-muted-foreground">
                          {nominee.pathway === "Africans in Africa" ? "Africa" :
                           nominee.pathway === "Africans in Diaspora" ? "Diaspora" :
                           nominee.pathway === "Friends of Africa" ? "Friends" : "Nigeria"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className={`text-sm font-display font-bold ${getGradeColor(edi.grade)}`}>
                          {edi.grade}
                        </span>
                        <span className="ml-1 text-[10px] text-muted-foreground">{edi.overallScore}</span>
                      </TableCell>
                      <TableCell>
                        <NomineeWorkflowStatusBadge status={nominee.workflowStatus} compact />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                            <Link to={`/nrc/dashboard/review/${nominee.id}`} title="Review">
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Flag">
                            <Flag className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400" title="Approve">
                            <CheckCircle className="h-3.5 w-3.5" />
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
          <div className="flex items-center justify-between border-t border-[hsl(var(--gold)/0.08)] px-4 py-3">
            <p className="text-[11px] text-muted-foreground">
              Page {page} of {totalPages || 1} · {filtered.length} results
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p > totalPages) return null;
                return (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="h-7 w-7 text-xs p-0"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </NRCDashboardLayout>
  );
}

export default function NRCNomineeTable() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <NomineeTableContent />
    </ProtectedRoute>
  );
}
