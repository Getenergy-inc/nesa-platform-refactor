import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Home,
  Menu,
  X,
  ChevronDown,
  Link as LinkIcon,
  Check,
  Copy,
} from "lucide-react";
import {
  NominationDashboardItem,
  NomineeDashboardData,
} from "@/types/nominee_dashboard";
import { NominationSelector } from "@/components/nominees/NominationSelector";
import { NominationCertificateGrid } from "@/components/nominee-dashboard/NominationCertificateGrid";
import { NomineeDashboardHeader } from "@/components/nominee-dashboard/NomineeDashboardHeader";
import { NominationOverviewCard } from "@/components/nominee-dashboard/NominationOverview";
import { NominationEditForm } from "@/components/nominee-dashboard/NominationEditForm";
import { nominationApi, updateNomination } from "@/api/nomination";
import { useAuth } from "@/contexts/AuthContext";
import { NomineeStatsGrid } from "@/components/nominee-dashboard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home as HomeIcon,
  Award,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function NomineeDashboard() {
  const navigate = useNavigate();
  const { accessToken, user, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nominee, setNominee] = useState<NomineeDashboardData | null>(null);
  const [selectedNominationId, setSelectedNominationId] = useState<
    string | null
  >(null);
  const [selectNominationDetails, setSelectedNominationDetails] =
    useState<updateNomination | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const nominationItems =
          await nominationApi.fetchNomineeDashboardData(accessToken);

        setNominee({
          name: `${user.firstName} ${user.lastName}`,
          id: user.id,
          slug: user.email,
          acceptance_status: "ACCEPTED",
          nominations: nominationItems,
        });

        if (nominationItems.length > 0) {
          setSelectedNominationId(nominationItems[0].id);
        }
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    if (user && accessToken) {
      loadData();
    }
  }, [user, accessToken]);

  useEffect(() => {
    async function fetchNominationDetails() {
      if (!selectedNominationId || !accessToken) return;

      try {
        const details = await nominationApi.fetchNominationDetails(
          accessToken,
          selectedNominationId,
        );

        setSelectedNominationDetails({
          id: details.id,
          phone: details.phone,
          fullName: details.fullName,
          country: details.country,
          stateRegion: details.stateRegion,
          impactSummary: details.impactSummary,
          achievementDescription: details.achievementDescription,
          linkedInProfile: details.linkedInProfile,
          website: details.website,
          profileImage: details.profileImage,
          evidenceUrl: details.evidenceUrl,
          accountType: details.accountType,
        });
      } catch {
        setError("Failed to load nomination details");
      }
    }

    fetchNominationDetails();
  }, [selectedNominationId, accessToken]);

  const handleNominationUpdated = (updatedNomination: updateNomination) => {
    setSelectedNominationDetails(updatedNomination);
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleCopyLink = async (nominationId: string, category: string) => {
    const link = `${window.location.origin}/nominees/${nominationId}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(nominationId);
      toast.success(`Link to ${category} nomination copied to clipboard!`, {
        duration: 3000,
        icon: <LinkIcon className="h-4 w-4" />,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-8 max-w-6xl mx-auto space-y-5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <AlertCircle className="h-10 w-10 mx-auto text-destructive" />
            <p className="text-muted-foreground">
              {error || "Failed to load dashboard"}
            </p>
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedNomination = nominee.nominations.find(
    (n) => n.id === selectedNominationId,
  );

  // Get user initials for avatar
  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "NN";

  // Truncate long category names
  const truncateCategory = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header with mobile menu button */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              {/* Mobile menu trigger */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[280px] sm:w-[320px] p-0"
                >
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePic} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-5rem)]">
                    <div className="p-4 space-y-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="mb-2">
                          Nominee
                        </Badge>
                        <nav className="space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link to="/" onClick={() => setSidebarOpen(false)}>
                              <HomeIcon className="mr-2 h-4 w-4" />
                              Home
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link
                              to="/nominee/dashboard"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <HomeIcon className="mr-2 h-4 w-4" />
                              Dashboard
                            </Link>
                          </Button>
                        </nav>
                      </div>
                      <div className="pt-4 border-t">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            handleSignOut();
                            setSidebarOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Logo/Title */}
              <Link to="/" className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl">
                  NESA Africa
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.firstName}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>

            {/* Mobile user indicator */}
            <div className="flex lg:hidden items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your nominations and certificates.
            </p>
          </div>

          {/* Nominations Section - Improved for mobile */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-semibold">
                Your Nominations
              </h2>
              <Badge variant="outline" className="text-xs">
                {nominee.nominations.length} total
              </Badge>
            </div>

            {/* Mobile: Dropdown selector for nominations */}
            <div className="sm:hidden">
              <Select
                value={selectedNominationId || undefined}
                onValueChange={setSelectedNominationId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a nomination" />
                </SelectTrigger>
                <SelectContent>
                  {nominee.nominations.map((nom) => (
                    <SelectItem key={nom.id} value={nom.id} className="pr-8">
                      <div className="flex flex-col items-start py-1">
                        <span className="font-medium text-sm">
                          {truncateCategory(nom.category, 25)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {nom.subcategory}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop: Original selector */}
            <div className="hidden sm:block">
              <NominationSelector
                nominations={nominee.nominations}
                selectedId={selectedNominationId}
                onSelect={setSelectedNominationId}
              />
            </div>
          </div>

          {/* Content */}
          {selectedNomination && (
            <Card className="overflow-hidden">
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Title and Copy Link Button */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold leading-tight break-words">
                        {selectedNomination.category}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">
                        {selectedNomination.subcategory}
                      </p>
                    </div>

                    {/* Copy Link Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleCopyLink(
                              selectedNomination.id,
                              selectedNomination.category,
                            )
                          }
                          className="flex-shrink-0 gap-2"
                        >
                          {copiedId === selectedNomination.id ? (
                            <>
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Copied!</span>
                            </>
                          ) : (
                            <>
                              <LinkIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                Copy Link
                              </span>
                              <span className="sm:hidden">Share</span>
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy link to share this nomination profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Optional: Display the link preview on mobile? */}
                  {copiedId === selectedNomination.id && (
                    <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded-md sm:hidden">
                      ✓ Link copied to clipboard!
                    </div>
                  )}
                </div>

                {/* Stats - Responsive grid */}
                <Card className="overflow-hidden">
                  <CardContent className="p-3 sm:p-5">
                    <NomineeStatsGrid
                      endorsementCount={selectedNomination.endorsement_count}
                      endorsementGoal={200}
                      publicVotes={selectedNomination.public_votes}
                    />
                  </CardContent>
                </Card>

                {/* Tabs - Improved mobile scrolling */}
                <Tabs defaultValue="overview" className="space-y-4">
                  {/* Scrollable tabs on mobile with better UX */}
                  <div className="relative">
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
                    <div className="overflow-x-auto pb-1 scrollbar-hide">
                      <TabsList className="flex w-max min-w-full sm:w-auto gap-1">
                        <TabsTrigger value="overview" className="px-3 sm:px-4">
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="certificates"
                          className="px-3 sm:px-4"
                        >
                          Certificates
                          {selectedNomination.certificates?.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-2 text-[10px] px-1.5"
                            >
                              {selectedNomination.certificates.length}
                            </Badge>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="edit" className="px-3 sm:px-4">
                          Edit
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>

                  <TabsContent value="overview" className="mt-4">
                    <NominationOverviewCard nomination={selectedNomination} />
                  </TabsContent>

                  <TabsContent value="certificates" className="mt-4">
                    <NominationCertificateGrid
                      certificates={selectedNomination.certificates}
                      onCertificateUpdated={(updatedCert) => {
                        setNominee((prev) => {
                          if (!prev) return prev;

                          return {
                            ...prev,
                            nominations: prev.nominations.map((nom) =>
                              nom.id === selectedNomination.id
                                ? {
                                    ...nom,
                                    certificates: nom.certificates.map((c) =>
                                      c.id === updatedCert.id ? updatedCert : c,
                                    ),
                                  }
                                : nom,
                            ),
                          };
                        });
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="edit" className="mt-4">
                    <NominationEditForm
                      nomination={selectNominationDetails}
                      onUpdated={handleNominationUpdated}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
}
