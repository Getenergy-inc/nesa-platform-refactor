/**
 * Admin EDX Analytics Dashboard
 * 
 * Centralized view of Education Development Index metrics:
 * - Nomination counts by region/category
 * - Voting participation
 * - Legacy interventions
 * - Referral audit
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useEDXOverview,
  useEDXCategoryEngagement,
  useEDXRegionMetrics,
} from "@/hooks/useEDXMetrics";
import { useRegionNomineeCounts } from "@/hooks/useRegionNomineeCounts";
import {
  BarChart3,
  Globe,
  Users,
  Vote,
  TrendingUp,
  School,
  Award,
  MapPin,
} from "lucide-react";

function OverviewCards() {
  const { data, isLoading } = useEDXOverview();

  const stats = [
    { label: "Total Nominations", value: data?.totalNominations ?? 0, icon: Award, color: "text-gold" },
    { label: "Total Nominees", value: data?.totalNominees ?? 0, icon: Users, color: "text-primary" },
    { label: "Total Votes Cast", value: data?.totalVotes ?? 0, icon: Vote, color: "text-primary" },
    { label: "Active Regions", value: data?.totalRegionsActive ?? 0, icon: Globe, color: "text-primary" },
    { label: "Categories Engaged", value: data?.totalCategoriesEngaged ?? 0, icon: BarChart3, color: "text-gold" },
    { label: "Rebuild Nominations", value: data?.rebuildSchoolNominations ?? 0, icon: School, color: "text-gold" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-2xl font-display font-bold">{s.value.toLocaleString()}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CategoryEngagementTable() {
  const { data, isLoading } = useEDXCategoryEngagement();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...(data ?? [])].sort((a, b) => b.participationScore - a.participationScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4 text-gold" />
          Engagement by Award Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.map((cat) => (
            <div key={cat.categoryId} className="flex items-center gap-3">
              <div className="w-48 truncate text-sm font-medium">{cat.categoryName}</div>
              <div className="flex-1">
                <Progress value={cat.participationScore} className="h-2" />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground min-w-[140px] justify-end">
                <span>{cat.nominationCount} nom.</span>
                <span>{cat.voteCount} votes</span>
                <Badge variant="secondary" className="text-xs">
                  {cat.participationScore}%
                </Badge>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No category engagement data yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RegionMetricsTable() {
  const { data: regionCounts } = useRegionNomineeCounts();
  const { data: edxRegions, isLoading } = useEDXRegionMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const regions = edxRegions ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-primary" />
          Engagement by Region
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground text-xs uppercase">
                <th className="text-left py-2 pr-4">Region</th>
                <th className="text-right py-2 px-2">Nominees</th>
                <th className="text-right py-2 px-2">Votes</th>
                <th className="text-right py-2 pl-2">Rebuild</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((r) => (
                <tr key={r.regionSlug} className="border-b border-muted/30 hover:bg-muted/20">
                  <td className="py-2 pr-4 font-medium">{r.regionName}</td>
                  <td className="py-2 px-2 text-right">
                    <Badge variant="secondary">{r.nomineeCount}</Badge>
                  </td>
                  <td className="py-2 px-2 text-right">{r.voteCount}</td>
                  <td className="py-2 pl-2 text-right">{r.rebuildNominationCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ReferralAuditCard() {
  const { data: overview, isLoading } = useEDXOverview();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-gold" />
          Referral & AGC Audit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">AGC in Circulation</p>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <p className="text-lg font-bold">{overview?.agcInCirculation?.toLocaleString() ?? 0} AGC</p>
            )}
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Volunteer BOD Applications</p>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <p className="text-lg font-bold">{overview?.volunteerBodApplications ?? 0}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          All AGCc accruals and conversions are tracked in the append-only wallet ledger. 
          Duplicate detection and verification checks are enforced server-side.
        </p>
      </CardContent>
    </Card>
  );
}

export default function AdminEDXAnalytics() {
  const { user, hasRole, loading: authLoading } = useAuth();

  if (!authLoading && !user) return <Navigate to="/login" replace />;
  if (!authLoading && !hasRole("admin")) return <Navigate to="/unauthorized" replace />;

  return (
    <DashboardLayout
      title="EDX Analytics"
      breadcrumbs={[{ label: "Admin" }, { label: "EDX Analytics" }]}
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="audit">Referral & AGC</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewCards />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryEngagementTable />
        </TabsContent>

        <TabsContent value="regions">
          <RegionMetricsTable />
        </TabsContent>

        <TabsContent value="audit">
          <ReferralAuditCard />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
