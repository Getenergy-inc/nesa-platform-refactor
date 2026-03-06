/**
 * Admin Voting Governance Dashboard
 * Stage controls, fraud flags, results computation, and audit logs
 */

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Play,
  Pause,
  Calculator,
  Send,
  AlertTriangle,
  CheckCircle,
  Shield,
  BarChart3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Fraud Flag Card Component
function FraudFlagCard({ flag }: { flag: any }) {
  const severityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                className={
                  severityColors[
                    flag.severity as keyof typeof severityColors
                  ] || "bg-gray-100"
                }
              >
                {flag.severity}
              </Badge>
              <Badge variant="outline">{flag.flag_type}</Badge>
              <Badge
                variant={
                  flag.flag_status === "pending" ? "destructive" : "secondary"
                }
              >
                {flag.flag_status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{flag.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Votes: {flag.vote_count} | Device:{" "}
              {flag.device_hash?.substring(0, 8)}...
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(flag.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Results Card Component
function ResultsCard({ result }: { result: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-white font-bold">
              #{result.rank || "-"}
            </div>
            <div>
              <p className="font-medium">
                {result.nominees?.name || "Unknown Nominee"}
              </p>
              <p className="text-sm text-muted-foreground">
                {result.categories?.name ||
                  result.subcategories?.name ||
                  "Unknown Category"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {result.final_score?.toFixed(1) || 0}
            </p>
            <p className="text-xs text-muted-foreground">Final Score</p>
            {result.is_winner && (
              <Badge className="bg-gold text-black mt-1">Winner</Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
          <div>
            <p className="font-semibold">{result.public_votes || 0}</p>
            <p className="text-muted-foreground">Votes</p>
          </div>
          <div>
            <p className="font-semibold">
              {result.public_score?.toFixed(1) || 0}%
            </p>
            <p className="text-muted-foreground">Public</p>
          </div>
          <div>
            <p className="font-semibold">
              {result.jury_score?.toFixed(1) || 0}%
            </p>
            <p className="text-muted-foreground">Jury</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminVotingGovernance() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("stages");

  // Fetch stages
  const { data: stages = [], isLoading: stagesLoading } = useQuery({
    queryKey: ["admin-stage-config"],
    queryFn: async () => {
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();

      if (!season) return [];

      const { data, error } = await supabase
        .from("stage_config")
        .select("*")
        .eq("season_id", season.id)
        .order("action");

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch fraud flags
  const { data: fraudFlags = [], isLoading: fraudLoading } = useQuery({
    queryKey: ["admin-fraud-flags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fraud_flags")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch results
  const { data: results = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["admin-computed-results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("results")
        .select(
          `
          *,
          nominees(id, name, slug, photo_url),
          categories(id, name, slug),
          subcategories(id, name, slug)
        `,
        )
        .order("final_score", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
  });

  // Toggle stage mutation
  const toggleStageMutation = useMutation({
    mutationFn: async ({ id, isOpen }: { id: string; isOpen: boolean }) => {
      const { error } = await supabase
        .from("stage_config")
        .update({ is_open: isOpen })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Stage updated");
      queryClient.invalidateQueries({ queryKey: ["admin-stage-config"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update stage");
    },
  });

  // Compute Gold results
  const computeGoldMutation = useMutation({
    mutationFn: async () => {
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (!season) throw new Error("No active season");

      const { data, error } = await supabase.rpc("compute_gold_results", {
        p_season_id: season.id,
      });

      if (error) throw error;
      return data as {
        success: boolean;
        computation_id: string;
        results_count: number;
      } | null;
    },
    onSuccess: (data) => {
      toast.success(
        `Gold results computed: ${data?.results_count || 0} nominees`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin-computed-results"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to compute Gold results");
    },
  });

  // Compute Blue Garnet results
  const computeBlueGarnetMutation = useMutation({
    mutationFn: async () => {
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (!season) throw new Error("No active season");

      const { data, error } = await supabase.rpc(
        "compute_blue_garnet_results",
        {
          p_season_id: season.id,
        },
      );

      if (error) throw error;
      return data as {
        success: boolean;
        computation_id: string;
        results_count: number;
      } | null;
    },
    onSuccess: (data) => {
      toast.success(
        `Blue Garnet results computed: ${data?.results_count || 0} nominees`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin-computed-results"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to compute Blue Garnet results");
    },
  });

  // Publish results
  const publishResultsMutation = useMutation({
    mutationFn: async (contestType: string) => {
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (!season) throw new Error("No active season");

      const { data, error } = await supabase.rpc("publish_results", {
        p_season_id: season.id,
        p_contest_type: contestType,
      });

      if (error) throw error;
      return data as { success: boolean; published_count: number } | null;
    },
    onSuccess: (data) => {
      toast.success(
        `Results published: ${data?.published_count || 0} nominees`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin-computed-results"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish results");
    },
  });

  // Run fraud detection
  const detectFraudMutation = useMutation({
    mutationFn: async () => {
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (!season) throw new Error("No active season");

      const { data, error } = await supabase.rpc("detect_vote_fraud", {
        p_season_id: season.id,
      });

      if (error) throw error;
      return data as { success: boolean; flags_created: number } | null;
    },
    onSuccess: (data) => {
      const count = data?.flags_created || 0;
      if (count > 0) {
        toast.warning(`Fraud detection: ${count} new flags`);
      } else {
        toast.success("Fraud detection: No new flags");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-fraud-flags"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to run fraud detection");
    },
  });

  // Auth checks
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // if (!authLoading && !hasRole("admin")) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  const pendingFlags = fraudFlags.filter(
    (f: any) => f.flag_status === "pending",
  );
  const computedResults = results.filter(
    (r: any) => r.result_status === "COMPUTED",
  );
  const publishedResults = results.filter(
    (r: any) => r.result_status === "PUBLISHED",
  );

  return (
    <>
      <Helmet>
        <title>Voting Governance | Admin Dashboard</title>
      </Helmet>

      <>
        {/* <DashboardLayout
        title="Voting Governance"
        breadcrumbs={[{ label: "Admin" }, { label: "Voting Governance" }]}
      > */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="stages">
              <Play className="mr-2 h-4 w-4" />
              Stages
            </TabsTrigger>
            <TabsTrigger value="fraud">
              <Shield className="mr-2 h-4 w-4" />
              Fraud ({pendingFlags.length})
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart3 className="mr-2 h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="publish">
              <Send className="mr-2 h-4 w-4" />
              Publish
            </TabsTrigger>
          </TabsList>

          {/* Stages Tab */}
          <TabsContent value="stages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stage Controls</CardTitle>
                <CardDescription>
                  Open or close voting stages. Changes take effect immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stages.map((stage: any) => (
                      <div
                        key={stage.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium capitalize">
                            {stage.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stage.opens_at &&
                              `Opens: ${new Date(stage.opens_at).toLocaleDateString()}`}
                            {stage.closes_at &&
                              ` • Closes: ${new Date(stage.closes_at).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={stage.is_open ? "default" : "secondary"}
                          >
                            {stage.is_open ? "OPEN" : "CLOSED"}
                          </Badge>
                          <Switch
                            checked={stage.is_open}
                            onCheckedChange={(checked) =>
                              toggleStageMutation.mutate({
                                id: stage.id,
                                isOpen: checked,
                              })
                            }
                            disabled={toggleStageMutation.isPending}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fraud Tab */}
          <TabsContent value="fraud" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Fraud Flags</CardTitle>
                  <CardDescription>
                    Detected voting anomalies and suspicious patterns
                  </CardDescription>
                </div>
                <Button
                  onClick={() => detectFraudMutation.mutate()}
                  disabled={detectFraudMutation.isPending}
                >
                  {detectFraudMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="mr-2 h-4 w-4" />
                  )}
                  Run Detection
                </Button>
              </CardHeader>
              <CardContent>
                {fraudLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : fraudFlags.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No fraud flags detected</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fraudFlags.map((flag: any) => (
                      <FraudFlagCard key={flag.id} flag={flag} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compute Gold Results</CardTitle>
                  <CardDescription>
                    100% public voting - Compute winners per subcategory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => computeGoldMutation.mutate()}
                    disabled={computeGoldMutation.isPending}
                    className="w-full bg-amber-500 hover:bg-amber-600"
                  >
                    {computeGoldMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Calculator className="mr-2 h-4 w-4" />
                    )}
                    Compute Gold Results
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compute Blue Garnet Results</CardTitle>
                  <CardDescription>
                    40% public + 60% jury - Compute winners per category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => computeBlueGarnetMutation.mutate()}
                    disabled={computeBlueGarnetMutation.isPending}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {computeBlueGarnetMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Calculator className="mr-2 h-4 w-4" />
                    )}
                    Compute Blue Garnet Results
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Computed Results</CardTitle>
                <CardDescription>
                  {computedResults.length} pending • {publishedResults.length}{" "}
                  published
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resultsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No results computed yet</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.slice(0, 12).map((result: any) => (
                      <ResultsCard key={result.id} result={result} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Publish Tab */}
          <TabsContent value="publish" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Results</CardTitle>
                <CardDescription>
                  Make computed results publicly visible. This action is
                  irreversible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">
                      Gold Certificate Results
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {
                        computedResults.filter((r: any) =>
                          r.contest_id?.includes("GOLD"),
                        ).length
                      }{" "}
                      results ready to publish
                    </p>
                    <Button
                      onClick={() =>
                        publishResultsMutation.mutate("GOLD_PUBLIC")
                      }
                      disabled={publishResultsMutation.isPending}
                      variant="outline"
                      className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                    >
                      {publishResultsMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Publish Gold Results
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Blue Garnet Results</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {
                        computedResults.filter((r: any) =>
                          r.contest_id?.includes("BLUE"),
                        ).length
                      }{" "}
                      results ready to publish
                    </p>
                    <Button
                      onClick={() =>
                        publishResultsMutation.mutate("BLUE_PUBLIC")
                      }
                      disabled={publishResultsMutation.isPending}
                      variant="outline"
                      className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      {publishResultsMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Publish Blue Garnet Results
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">
                        Important
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Publishing results makes them visible to the public.
                        Ensure all computations are verified and stages are
                        closed before publishing.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* </DashboardLayout> */}
      </>
    </>
  );
}
