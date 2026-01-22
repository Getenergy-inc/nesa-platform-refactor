import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSeason } from "@/contexts/SeasonContext";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Award, ArrowLeft, RefreshCw } from "lucide-react";
import { NRCStatsCards } from "@/components/nrc/NRCStatsCards";
import { NRCFilters } from "@/components/nrc/NRCFilters";
import { NominationReviewCard, NominationData } from "@/components/nrc/NominationReviewCard";

interface Category {
  id: string;
  name: string;
}

function NRCDashboardContent() {
  const { user } = useAuth();
  const { currentEdition } = useSeason();
  const [nominations, setNominations] = useState<NominationData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);

      // Load categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("display_order");

      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load nominations with related data
      const { data: nominationsData, error } = await supabase
        .from("nominations")
        .select(`
          id,
          nominee_name,
          nominee_title,
          nominee_organization,
          nominee_bio,
          nominee_photo_url,
          evidence_urls,
          justification,
          status,
          created_at,
          reviewed_at,
          review_notes,
          nominator_id,
          subcategories (
            name,
            categories (
              id,
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading nominations:", error);
        toast.error("Failed to load nominations");
        return;
      }

      if (nominationsData) {
        // Fetch nominator profiles separately
        const nominatorIds = [...new Set(nominationsData.map((n) => n.nominator_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, email, full_name")
          .in("user_id", nominatorIds);

        const profilesMap = new Map(
          profilesData?.map((p) => [p.user_id, { email: p.email, full_name: p.full_name }]) || []
        );

        const mapped = nominationsData.map((n) => ({
          ...n,
          subcategory: n.subcategories
            ? {
                name: n.subcategories.name,
                category: n.subcategories.categories
                  ? {
                      id: n.subcategories.categories.id,
                      name: n.subcategories.categories.name,
                    }
                  : { id: "", name: "Unknown" },
              }
            : null,
          nominator: profilesMap.get(n.nominator_id) || null,
        }));
        setNominations(mapped as NominationData[]);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (
    nominationId: string,
    newStatus: "approved" | "rejected" | "platinum" | "under_review",
    notes?: string
  ) => {
    if (!user) return;

    try {
      setUpdating(nominationId);

      const updateData: Record<string, unknown> = {
        status: newStatus,
        nrc_reviewer_id: user.id,
        reviewed_at: new Date().toISOString(),
      };

      if (notes) {
        updateData.review_notes = notes;
      }

      const { error } = await supabase
        .from("nominations")
        .update(updateData)
        .eq("id", nominationId);

      if (error) {
        console.error("Update error:", error);
        toast.error("Failed to update nomination status");
        return;
      }

      // Update local state
      setNominations((prev) =>
        prev.map((n) =>
          n.id === nominationId
            ? {
                ...n,
                status: newStatus,
                reviewed_at: new Date().toISOString(),
                review_notes: notes || n.review_notes,
              }
            : n
        )
      );

      const statusLabels = {
        approved: "approved",
        rejected: "rejected",
        platinum: "awarded Platinum status",
        under_review: "marked as under review",
      };

      toast.success(`Nomination ${statusLabels[newStatus]}`);
    } catch (error) {
      console.error("Failed to update nomination:", error);
      toast.error("Failed to update nomination");
    } finally {
      setUpdating(null);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      pending: nominations.filter((n) => n.status === "pending").length,
      underReview: nominations.filter((n) => n.status === "under_review").length,
      approved: nominations.filter((n) => n.status === "approved").length,
      rejected: nominations.filter((n) => n.status === "rejected").length,
      platinum: nominations.filter((n) => n.status === "platinum").length,
    };
  }, [nominations]);

  // Filter nominations
  const filteredNominations = useMemo(() => {
    return nominations.filter((n) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          n.nominee_name.toLowerCase().includes(query) ||
          n.nominee_organization?.toLowerCase().includes(query) ||
          n.nominee_title?.toLowerCase().includes(query) ||
          n.justification?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && n.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "all") {
        const categoryId = (n.subcategory?.category as { id?: string })?.id;
        if (categoryId !== categoryFilter) {
          return false;
        }
      }

      return true;
    });
  }, [nominations, searchQuery, statusFilter, categoryFilter]);

  // Group by status for tabs
  const pendingNominations = filteredNominations.filter(
    (n) => n.status === "pending" || n.status === "under_review"
  );
  const reviewedNominations = filteredNominations.filter(
    (n) => n.status === "approved" || n.status === "rejected" || n.status === "platinum"
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading NRC Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
            >
              <Award className="h-5 w-5 text-primary" />
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold">NRC Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Nominee Research Corps • {currentEdition.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8">
          <NRCStatsCards {...stats} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <NRCFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending Review ({pendingNominations.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed ({reviewedNominations.length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({filteredNominations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingNominations.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-display text-xl font-semibold">No Pending Nominations</h3>
                <p className="text-muted-foreground">
                  All nominations have been reviewed. Great work!
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pendingNominations.map((nomination) => (
                  <NominationReviewCard
                    key={nomination.id}
                    nomination={nomination}
                    onStatusChange={handleStatusChange}
                    isUpdating={updating === nomination.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed">
            {reviewedNominations.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-display text-xl font-semibold">No Reviewed Nominations</h3>
                <p className="text-muted-foreground">
                  Reviewed nominations will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {reviewedNominations.map((nomination) => (
                  <NominationReviewCard
                    key={nomination.id}
                    nomination={nomination}
                    onStatusChange={handleStatusChange}
                    isUpdating={updating === nomination.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            {filteredNominations.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-display text-xl font-semibold">No Nominations Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredNominations.map((nomination) => (
                  <NominationReviewCard
                    key={nomination.id}
                    nomination={nomination}
                    onStatusChange={handleStatusChange}
                    isUpdating={updating === nomination.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function NRCDashboard() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <NRCDashboardContent />
    </ProtectedRoute>
  );
}
