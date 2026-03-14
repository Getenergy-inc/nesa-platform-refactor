/**
 * NRC Scoring Dashboard — Internal reviewer interface
 * Allows NRC reviewers to evaluate nominees with EDI scores and workflow decisions
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { NomineeEDIScores } from "@/components/nominees/NomineeEDIScores";
import { NomineeWorkflowStatusBadge } from "@/components/nominees/NomineeWorkflowStatus";
import {
  Search, Filter, Users, CheckCircle2, Clock, XCircle,
  ChevronRight, BarChart3, Shield, FileCheck, Eye,
} from "lucide-react";
import {
  getAllMasterNominees, getMasterCategories,
  type MasterNominee, WORKFLOW_STATUS_CONFIG,
} from "@/lib/nomineeMasterData";
import { calculateEDIScorecard } from "@/lib/ediScoring";

const ITEMS_PER_PAGE = 20;

function NRCScoringContent() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pathwayFilter, setPathwayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedNominee, setSelectedNominee] = useState<MasterNominee | null>(null);

  const categories = useMemo(() => getMasterCategories(), []);
  const allNominees = useMemo(() => getAllMasterNominees(), []);

  const filtered = useMemo(() => {
    let result = allNominees;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(n =>
        n.name.toLowerCase().includes(q) ||
        n.country.toLowerCase().includes(q) ||
        n.subcategory.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") result = result.filter(n => n.categorySlug === categoryFilter);
    if (pathwayFilter !== "all") result = result.filter(n => n.pathway === pathwayFilter);
    if (statusFilter !== "all") result = result.filter(n => n.workflowStatus === statusFilter);
    return result;
  }, [allNominees, search, categoryFilter, pathwayFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Pipeline stats
  const stats = useMemo(() => {
    const s = { submitted: 0, screening: 0, verification: 0, review: 0, cleared: 0, rejected: 0 };
    allNominees.forEach(n => {
      if (n.workflowStatus === "nomination_submitted") s.submitted++;
      else if (n.workflowStatus === "eligibility_screening") s.screening++;
      else if (n.workflowStatus === "documentation_verification") s.verification++;
      else if (n.workflowStatus === "nrc_review") s.review++;
      else if (n.workflowStatus === "nomination_cleared") s.cleared++;
      else if (n.workflowStatus === "rejected") s.rejected++;
    });
    return s;
  }, [allNominees]);

  return (
    <NRCLayout>
      <Helmet>
        <title>NRC Scoring Dashboard | NESA Africa</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Nominee Evaluation Dashboard</h2>
          <p className="text-muted-foreground text-sm">Review, score, and process 2025 nominee evaluations</p>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: "Submitted", count: stats.submitted, color: "text-blue-400", icon: Clock },
            { label: "Screening", count: stats.screening, color: "text-amber-400", icon: Filter },
            { label: "Verification", count: stats.verification, color: "text-orange-400", icon: FileCheck },
            { label: "NRC Review", count: stats.review, color: "text-purple-400", icon: Users },
            { label: "Cleared", count: stats.cleared, color: "text-emerald-400", icon: CheckCircle2 },
            { label: "Rejected", count: stats.rejected, color: "text-red-400", icon: XCircle },
          ].map(s => (
            <Card key={s.label} className="cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => {
                const statusMap: Record<string, string> = {
                  Submitted: "nomination_submitted",
                  Screening: "eligibility_screening",
                  Verification: "documentation_verification",
                  "NRC Review": "nrc_review",
                  Cleared: "nomination_cleared",
                  Rejected: "rejected",
                };
                setStatusFilter(statusMap[s.label] || "all");
                setPage(1);
              }}
            >
              <CardContent className="p-3 text-center">
                <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
                <div className={`text-xl font-display font-bold ${s.color}`}>{s.count}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search nominees..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.slug} value={c.slug}>{c.name.slice(0, 50)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={pathwayFilter} onValueChange={v => { setPathwayFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Pathway" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pathways</SelectItem>
              <SelectItem value="Africans in Africa">Africa</SelectItem>
              <SelectItem value="Nigeria">Nigeria</SelectItem>
              <SelectItem value="Africans in Diaspora">Diaspora</SelectItem>
              <SelectItem value="Friends of Africa">Friends</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(WORKFLOW_STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Content: List + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Nominee List */}
          <div className="lg:col-span-3 space-y-2">
            <p className="text-xs text-muted-foreground">
              {filtered.length} nominees • Page {page} of {totalPages || 1}
            </p>
            {paginated.map(nominee => {
              const edi = calculateEDIScorecard(nominee.id, nominee.achievement, nominee.category);
              return (
                <Card
                  key={nominee.id}
                  className={`cursor-pointer transition-all hover:border-primary/30 ${selectedNominee?.id === nominee.id ? "border-primary/50 bg-accent/5" : ""}`}
                  onClick={() => setSelectedNominee(nominee)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          #{String(nominee.id).padStart(4, "0")}
                        </span>
                        <h4 className="text-sm font-medium truncate">{nominee.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{nominee.country}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {nominee.subcategory}
                        </span>
                      </div>
                    </div>
                    <NomineeEDIScores nomineeId={nominee.id} achievement={nominee.achievement} category={nominee.category} compact />
                    <NomineeWorkflowStatusBadge status={nominee.workflowStatus} compact />
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="text-sm text-muted-foreground px-3 py-1.5">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedNominee ? (
              <div className="space-y-4 sticky top-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{selectedNominee.name}</CardTitle>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/directory/${encodeURIComponent(selectedNominee.slug)}`}>
                          <Eye className="w-4 h-4 mr-1" /> Profile
                        </Link>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedNominee.country} • {selectedNominee.pathway}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Category</span>
                      <p className="text-sm">{selectedNominee.category}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Subcategory</span>
                      <p className="text-sm">{selectedNominee.subcategory}</p>
                    </div>
                    <Separator />
                    <div>
                      <span className="text-xs text-muted-foreground">Achievement</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedNominee.achievement}</p>
                    </div>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">NRC Status</span>
                      </div>
                      <NomineeWorkflowStatusBadge status={selectedNominee.workflowStatus} showSteps />
                    </div>
                  </CardContent>
                </Card>

                <NomineeEDIScores
                  nomineeId={selectedNominee.id}
                  achievement={selectedNominee.achievement}
                  category={selectedNominee.category}
                />
              </div>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a nominee to view EDI scores</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </NRCLayout>
  );
}

export default function NRCScoringDashboard() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <NRCScoringContent />
    </ProtectedRoute>
  );
}
