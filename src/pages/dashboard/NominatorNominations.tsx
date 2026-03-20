import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Loader2,
  FileText,
  Calendar,
  MapPin,
  Trophy,
  Search,
  Filter,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  ApprovalState,
  nominationApi,
  NominatorNomination,
} from "@/api/nomination";
import { NominationEditForm } from "@/components/nominee-dashboard/NominationEditForm";
import { format } from "date-fns";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Helper to get status badge
function getStatusBadge(status: ApprovalState) {
  switch (status) {
    case "APPROVED":
      return {
        label: "Approved",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        icon: <XCircle className="w-3 h-3 mr-1" />,
        className: "bg-red-500/20 text-red-400 border-red-500/30",
      };
    case "PENDING":
    default:
      return {
        label: "Pending Review",
        icon: <Clock className="w-3 h-3 mr-1" />,
        className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      };
  }
}

// Helper to get tier badge
function getTierBadge(awardType: string) {
  switch (awardType) {
    case "PLATINUM_CERTIFICATE":
      return {
        label: "Platinum",
        className: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      };
    case "BLUE_GARNET_AND_GOLD_CERTIFICATE":
    case "GOLD_CERTIFICATE":
      return {
        label: "Blue Garnet",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    case "GOLD_SPECIAL":
      return {
        label: "Gold Special",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      };
    case "AFRICA_ICON_BLUE_GARNET":
      return {
        label: "Lifetime",
        className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      };
    default:
      return {
        label: "Unknown",
        className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      };
  }
}

function NominationCardSkeleton() {
  return (
    <Card className="bg-white/5 border-gold/20">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2 md:space-y-3">
            <Skeleton className="h-4 md:h-5 w-32 md:w-48 bg-white/10" />
            <Skeleton className="h-3 md:h-4 w-24 md:w-32 bg-white/10" />
            <div className="flex gap-2">
              <Skeleton className="h-5 md:h-6 w-16 md:w-20 bg-white/10" />
              <Skeleton className="h-5 md:h-6 w-16 md:w-20 bg-white/10" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NominationCard({
  nomination,
  onEdit,
}: {
  nomination: NominatorNomination;
  onEdit: (nomination: NominatorNomination) => void;
}) {
  const status = getStatusBadge(nomination.approved);
  const tier = getTierBadge(nomination.categoryAwardType);
  const canEdit = nomination.approved === "PENDING";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card className="bg-white/5 border-gold/20 hover:border-gold/40 transition-all group">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-gold/30">
                <AvatarImage src={nomination.profileImage || ""} />
                <AvatarFallback className="bg-gold/20 text-gold text-lg md:text-xl">
                  {getInitials(nomination.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div className="space-y-2 w-full lg:w-auto">
                  <h3 className="font-display text-base md:text-lg lg:text-xl font-bold text-white break-words">
                    {nomination.fullName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={`${status.className} text-xs md:text-sm px-2 py-0.5`}
                    >
                      <span className="flex items-center">
                        {status.icon}
                        {status.label}
                      </span>
                    </Badge>
                    <Badge
                      className={`${tier.className} text-xs md:text-sm px-2 py-0.5`}
                    >
                      {tier.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-gold/20 text-gold/80 text-xs md:text-sm px-2 py-0.5"
                    >
                      {nomination.accountType === "ORGANIZATION"
                        ? "Org"
                        : "Ind"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-2 mt-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-white/60">
                      <Trophy className="w-3 h-3 md:w-4 md:h-4 text-gold/60 shrink-0" />
                      <span className="truncate">
                        {nomination.categoryName}
                      </span>
                    </div>
                    {nomination.subCategoryName && (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/60">
                        <Award className="w-3 h-3 md:w-4 md:h-4 text-gold/60 shrink-0" />
                        <span className="truncate">
                          {nomination.subCategoryName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs md:text-sm text-white/60">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gold/60 shrink-0" />
                      <span className="truncate">
                        {nomination.country}
                        {nomination.stateRegion &&
                          `, ${nomination.stateRegion}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-white/60">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gold/60 shrink-0" />
                      <span className="whitespace-nowrap">
                        {format(new Date(nomination.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions - Only show Edit button for pending nominations */}
                {canEdit && (
                  <div className="flex lg:flex-col gap-2 mt-2 lg:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(nomination)}
                      className="border-gold/30 text-gold hover:bg-gold/10 text-xs md:text-sm w-full lg:w-auto"
                    >
                      <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MyNominations() {
  const { accessToken } = useAuth();
  const [nominations, setNominations] = useState<NominatorNomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNomination, setEditingNomination] =
    useState<NominatorNomination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch nominations
  const fetchNominations = async (showRefresh = false) => {
    if (!accessToken) return;

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await nominationApi.fetchNominatorNominations(accessToken);
      setNominations(data || []);
    } catch (error) {
      console.error("Failed to fetch nominations:", error);
      toast.error("Failed to load nominations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNominations();
  }, [accessToken]);

  // Filter nominations
  const filteredNominations = useMemo(() => {
    return nominations.filter((nom) => {
      const matchesSearch =
        searchQuery === "" ||
        nom.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nom.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nom.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || nom.categoryId === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || nom.approved === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [nominations, searchQuery, selectedCategory, selectedStatus]);

  // Group by status
  const approvedNominations = useMemo(() => {
    return filteredNominations.filter((n) => n.approved === "APPROVED");
  }, [filteredNominations]);

  const pendingNominations = useMemo(() => {
    return filteredNominations.filter((n) => n.approved === "PENDING");
  }, [filteredNominations]);

  const rejectedNominations = useMemo(() => {
    return filteredNominations.filter((n) => n.approved === "REJECTED");
  }, [filteredNominations]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const unique = new Map();
    nominations.forEach((n) => {
      if (!unique.has(n.categoryId)) {
        unique.set(n.categoryId, n.categoryName);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [nominations]);

  const handleEditSuccess = (updated: NominatorNomination) => {
    setNominations((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n)),
    );
    setEditingNomination(null);
    toast.success("Nomination updated successfully");
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>My Nominations | NESA-Africa</title>
        </Helmet>
        <InstitutionalDashboardLayout>
          <div className="min-h-screen bg-charcoal">
            <div className="container px-4 py-4 md:py-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <Skeleton className="h-6 md:h-8 w-32 md:w-48 bg-white/10" />
                <Skeleton className="h-8 md:h-10 w-24 md:w-32 bg-white/10" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <NominationCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </InstitutionalDashboardLayout>
      </>
    );
  }

  return (
    <ProtectedRoute>
      <InstitutionalDashboardLayout>
        <Helmet>
          <title>My Nominations | NESA-Africa</title>
          <meta
            name="description"
            content="View and manage your nominations for the NESA-Africa Awards."
          />
        </Helmet>

        <div className="min-h-screen bg-charcoal">
          <div className="container px-4 py-4 md:py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2">
                  My Nominations
                </h1>
                <p className="text-white/60 text-xs md:text-sm lg:text-base">
                  Track and manage all your submitted nominations
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchNominations(true)}
                  disabled={refreshing}
                  className="border-gold/30 text-gold hover:bg-gold/10 text-xs md:text-sm px-2 md:px-3"
                >
                  <RefreshCw
                    className={`h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span className="hidden xs:inline">Refresh</span>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gold hover:bg-gold-dark text-charcoal text-xs md:text-sm px-2 md:px-3"
                >
                  <Link to="/nominate">
                    <PlusCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    <span className="hidden xs:inline">New</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 mb-6">
              <Card className="bg-gold/5 border-gold/20">
                <CardContent className="p-3 md:p-4">
                  <p className="text-lg md:text-2xl font-bold text-white">
                    {nominations.length}
                  </p>
                  <p className="text-[10px] md:text-xs text-white/60">Total</p>
                </CardContent>
              </Card>
              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="p-3 md:p-4">
                  <p className="text-lg md:text-2xl font-bold text-green-400">
                    {approvedNominations.length}
                  </p>
                  <p className="text-[10px] md:text-xs text-white/60">
                    Approved
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="p-3 md:p-4">
                  <p className="text-lg md:text-2xl font-bold text-amber-400">
                    {pendingNominations.length}
                  </p>
                  <p className="text-[10px] md:text-xs text-white/60">
                    Pending
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="p-3 md:p-4">
                  <p className="text-lg md:text-2xl font-bold text-red-400">
                    {rejectedNominations.length}
                  </p>
                  <p className="text-[10px] md:text-xs text-white/60">
                    Rejected
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters - Responsive Stack */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-white/40" />
                <Input
                  placeholder="Search by name, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 md:pl-10 bg-white/5 border-gold/20 text-white placeholder:text-white/40 text-xs md:text-sm h-8 md:h-10"
                />
              </div>
              <div className="flex flex-col xs:flex-row gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full xs:w-[140px] md:w-[200px] bg-white/5 border-gold/20 text-white text-xs md:text-sm h-8 md:h-10">
                    <Filter className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-gold" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal-light border-gold/20">
                    <SelectItem
                      value="all"
                      className="text-white hover:bg-gold/10 text-xs md:text-sm"
                    >
                      All Categories
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="text-white hover:bg-gold/10 text-xs md:text-sm"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full xs:w-[120px] md:w-[180px] bg-white/5 border-gold/20 text-white text-xs md:text-sm h-8 md:h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal-light border-gold/20">
                    <SelectItem
                      value="all"
                      className="text-white hover:bg-gold/10 text-xs md:text-sm"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value={"APPROVED"}
                      className="text-green-400 hover:bg-gold/10 text-xs md:text-sm"
                    >
                      Approved
                    </SelectItem>
                    <SelectItem
                      value={"PENDING"}
                      className="text-amber-400 hover:bg-gold/10 text-xs md:text-sm"
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      value={"REJECTED"}
                      className="text-red-400 hover:bg-gold/10 text-xs md:text-sm"
                    >
                      Rejected
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs - Responsive */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 md:mb-6 bg-white/5 border border-gold/20 p-1 flex flex-wrap h-auto">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
                >
                  All ({filteredNominations.length})
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
                >
                  Approved ({approvedNominations.length})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
                >
                  Pending ({pendingNominations.length})
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5"
                >
                  Rejected ({rejectedNominations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {filteredNominations.length === 0 ? (
                  <EmptyState
                    onClear={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedStatus("all");
                    }}
                  />
                ) : (
                  <AnimatePresence>
                    <div className="space-y-3 md:space-y-4">
                      {filteredNominations.map((nom) => (
                        <NominationCard
                          key={nom.id}
                          nomination={nom}
                          onEdit={setEditingNomination}
                        />
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </TabsContent>

              <TabsContent value="approved">
                {approvedNominations.length === 0 ? (
                  <EmptyState message="No approved nominations yet" />
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {approvedNominations.map((nom) => (
                      <NominationCard
                        key={nom.id}
                        nomination={nom}
                        onEdit={setEditingNomination}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending">
                {pendingNominations.length === 0 ? (
                  <EmptyState message="No pending nominations" />
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {pendingNominations.map((nom) => (
                      <NominationCard
                        key={nom.id}
                        nomination={nom}
                        onEdit={setEditingNomination}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected">
                {rejectedNominations.length === 0 ? (
                  <EmptyState message="No rejected nominations" />
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {rejectedNominations.map((nom) => (
                      <NominationCard
                        key={nom.id}
                        nomination={nom}
                        onEdit={setEditingNomination}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Edit Modal */}
        <Dialog
          open={!!editingNomination}
          onOpenChange={() => setEditingNomination(null)}
        >
          <DialogContent className="bg-charcoal-light border-gold/20 max-w-3xl max-h-[90vh] overflow-y-auto w-[95%] sm:w-full mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                <Edit className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                Edit Nomination
              </DialogTitle>
              <DialogDescription className="text-white/60 text-xs md:text-sm">
                Update the details for {editingNomination?.fullName}
              </DialogDescription>
            </DialogHeader>
            {editingNomination && (
              <NominationEditForm
                nomination={editingNomination}
                onUpdated={handleEditSuccess}
              />
            )}
          </DialogContent>
        </Dialog>
      </InstitutionalDashboardLayout>
    </ProtectedRoute>
  );
}

// Empty State Component
function EmptyState({
  message = "No nominations found",
  onClear,
}: {
  message?: string;
  onClear?: () => void;
}) {
  return (
    <Card className="border-dashed border-gold/20 bg-white/5">
      <CardContent className="flex flex-col items-center justify-center py-8 md:py-16 px-4">
        <FileText className="h-8 w-8 md:h-12 md:w-12 text-gold/30 mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2 text-center">
          {message}
        </h3>
        <p className="text-white/60 text-xs md:text-sm text-center max-w-md mb-4 md:mb-6">
          {onClear
            ? "Try adjusting your filters to see more results."
            : "Your nominations will appear here once you've submitted them."}
        </p>
        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="border-gold/30 text-gold hover:bg-gold/10 text-xs md:text-sm"
          >
            Clear Filters
          </Button>
        )}
        {!onClear && (
          <Button
            asChild
            size="sm"
            className="bg-gold hover:bg-gold-dark text-charcoal text-xs md:text-sm"
          >
            <Link to="/nominate">
              <PlusCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Create Nomination
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
