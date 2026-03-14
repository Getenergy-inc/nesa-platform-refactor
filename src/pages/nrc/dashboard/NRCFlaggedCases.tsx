/**
 * NRC Flagged Cases — Manage flagged, duplicate, and weak-evidence nominees
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Flag, AlertTriangle, Copy, Image, FileX, Eye, CheckCircle, XCircle,
} from "lucide-react";
import { getAllMasterNominees } from "@/lib/nomineeMasterData";

type FlagType = "duplicate" | "weak_evidence" | "category_mismatch" | "image_mismatch" | "missing_docs";

interface FlaggedCase {
  nomineeId: number;
  nomineeName: string;
  country: string;
  category: string;
  flagType: FlagType;
  description: string;
  severity: "high" | "medium" | "low";
  createdAt: string;
}

const FLAG_CONFIG: Record<FlagType, { label: string; icon: typeof Flag; color: string }> = {
  duplicate: { label: "Duplicate", icon: Copy, color: "text-purple-400" },
  weak_evidence: { label: "Weak Evidence", icon: FileX, color: "text-amber-400" },
  category_mismatch: { label: "Category Mismatch", icon: AlertTriangle, color: "text-orange-400" },
  image_mismatch: { label: "Image Mismatch", icon: Image, color: "text-blue-400" },
  missing_docs: { label: "Missing Docs", icon: FileX, color: "text-red-400" },
};

function FlaggedContent() {
  const nominees = useMemo(() => getAllMasterNominees(), []);
  const [activeTab, setActiveTab] = useState("all");

  // Generate realistic flagged cases from nominees
  const flaggedCases: FlaggedCase[] = useMemo(() => {
    const flags: FlaggedCase[] = [];
    const types: FlagType[] = ["duplicate", "weak_evidence", "category_mismatch", "image_mismatch", "missing_docs"];
    const severities: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];
    const descs: Record<FlagType, string> = {
      duplicate: "Potential duplicate entry detected with similar name and country",
      weak_evidence: "Submitted evidence does not adequately support impact claims",
      category_mismatch: "Nominee's work may better fit a different award category",
      image_mismatch: "Profile image does not match nominee identity or is generic",
      missing_docs: "Required documentation is missing from submission package",
    };

    // Pick ~5% of nominees as flagged
    nominees.filter((_, i) => i % 20 === 0).forEach((n, i) => {
      const flagType = types[i % types.length];
      flags.push({
        nomineeId: n.id,
        nomineeName: n.name,
        country: n.country,
        category: n.category,
        flagType,
        description: descs[flagType],
        severity: severities[i % 3],
        createdAt: `${Math.floor(Math.random() * 12) + 1}h ago`,
      });
    });
    return flags;
  }, [nominees]);

  const filteredCases = activeTab === "all"
    ? flaggedCases
    : flaggedCases.filter(c => c.flagType === activeTab);

  const severityColor = (s: string) =>
    s === "high" ? "border-red-500/30 text-red-400" :
    s === "medium" ? "border-amber-500/30 text-amber-400" :
    "border-muted text-muted-foreground";

  return (
    <NRCDashboardLayout>
      <Helmet>
        <title>Flagged Cases | NRC Dashboard</title>
      </Helmet>

      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold font-display flex items-center gap-2">
            <Flag className="h-5 w-5 text-orange-400" />
            Flagged Cases
          </h1>
          <p className="text-xs text-muted-foreground">{flaggedCases.length} cases requiring attention</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Object.entries(FLAG_CONFIG).map(([key, config]) => {
            const count = flaggedCases.filter(c => c.flagType === key).length;
            return (
              <Card
                key={key}
                className={`cursor-pointer border-[hsl(var(--gold)/0.08)] transition-all hover:border-primary/20 ${activeTab === key ? "border-primary/30" : ""}`}
                onClick={() => setActiveTab(activeTab === key ? "all" : key)}
              >
                <CardContent className="p-3 text-center">
                  <config.icon className={`mx-auto mb-1 h-4 w-4 ${config.color}`} />
                  <div className="text-lg font-bold font-display">{count}</div>
                  <p className="text-[10px] text-muted-foreground">{config.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cases List */}
        <div className="space-y-2">
          {filteredCases.map((flagCase, i) => {
            const config = FLAG_CONFIG[flagCase.flagType];
            return (
              <Card key={i} className="border-[hsl(var(--gold)/0.06)]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/30">
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium truncate">{flagCase.nomineeName}</h3>
                        <Badge variant="outline" className={`text-[10px] ${severityColor(flagCase.severity)}`}>
                          {flagCase.severity}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${config.color} border-current/20`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{flagCase.country} · {flagCase.category}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{flagCase.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-muted-foreground/50 mr-2">{flagCase.createdAt}</span>
                      <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                        <Link to={`/nrc/dashboard/review/${flagCase.nomineeId}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400">
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </NRCDashboardLayout>
  );
}

export default function NRCFlaggedCases() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <FlaggedContent />
    </ProtectedRoute>
  );
}
