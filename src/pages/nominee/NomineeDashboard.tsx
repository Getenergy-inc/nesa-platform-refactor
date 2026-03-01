import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import {
  NominationDashboardItem,
  NomineeDashboardData,
} from "@/types/nominee_dashboard";
import { NominationSelector } from "@/components/nominees/NominationSelector";
import { NominationCertificateGrid } from "@/components/nominee-dashboard/NominationCertificateGrid";
import { NomineeDashboardHeader } from "@/components/nominee-dashboard/NomineeDashboardHeader";
import { NominationOverviewCard } from "@/components/nominee-dashboard/NominationOverview";
import { NominationEditForm } from "@/components/nominee-dashboard/NominationEditForm"; // Import the edit form
import { nominationApi, updateNomination } from "@/api/nomination";
import { useAuth } from "@/contexts/AuthContext";
import { NomineeStatsGrid } from "@/components/nominee-dashboard";

export default function NomineeDashboard() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nominee, setNominee] = useState<NomineeDashboardData | null>(null);
  const [selectedNominationId, setSelectedNominationId] = useState<
    string | null
  >(null);
  const [selectNominationDetails, setSelectedNominationDetails] =
    useState<updateNomination | null>(null);

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
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, accessToken]);

  useEffect(() => {
    async function fetchNominationDetails() {
      if (!selectedNominationId || !accessToken) return;

      setLoading(true);
      try {
        const details = await nominationApi.fetchNominationDetails(
          accessToken,
          selectedNominationId,
        );
        // convert to updateNomination interface
        const nominationDetail: updateNomination = {
          id: details.id,
          phone: details.phone,
          country: details.country,
          stateRegion: details.stateRegion,
          impactSummary: details.impactSummary,
          achievementDescription: details.achievementDescription,
          linkedInProfile: details.linkedInProfile,
          website: details.website,
          profileImage: details.profileImage,
          evidenceUrl: details.evidenceUrl,
          accountType: details.accountType,
        };
        setSelectedNominationDetails(nominationDetail);
      } catch (err) {
        setError("Failed to load nomination details");
      } finally {
        setLoading(false);
      }
    }

    fetchNominationDetails();
  }, [selectedNominationId, accessToken]);

  // Handler for updating a nomination after edit
  const handleNominationUpdated = (updatedNomination: updateNomination) => {
    setSelectedNominationDetails(updatedNomination);
  };

  if (loading) {
    return (
      <div className="container py-12 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full text-center shadow-xl border-0">
          <CardContent className="p-10 space-y-6">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <p className="text-muted-foreground">{error}</p>
            <Button asChild>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NomineeDashboardHeader
        nomineeName={nominee.name}
        acceptanceStatus="ACCEPTED"
      />

      <main className="container py-10 space-y-10">
        {/* Welcome Block */}
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Welcome back, {user.firstName}
          </h1>
          <p className="text-muted-foreground text-base">
            Manage your nominations, track progress, and access your
            certificates.
          </p>
        </div>

        {/* Nomination Selector */}
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Your Nominations</h2>
              <p className="text-sm text-muted-foreground">
                Select a nomination to view its details and certificates.
              </p>
            </div>

            <NominationSelector
              nominations={nominee.nominations}
              selectedId={selectedNominationId}
              onSelect={setSelectedNominationId}
            />
          </CardContent>
        </Card>

        {/* Nomination Content */}
        {selectedNomination && (
          <Card className="rounded-2xl border shadow-sm">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">
                  {selectedNomination.category}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedNomination.subcategory}
                </p>
              </div>

              {/* Stats Section */}
              <Card className="rounded-2xl border bg-card shadow-sm">
                <CardContent className="p-6">
                  <NomineeStatsGrid
                    endorsementCount={selectedNomination.endorsement_count}
                    endorsementGoal={200}
                    publicVotes={selectedNomination.public_votes}
                  />
                </CardContent>
              </Card>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/40 p-1 rounded-xl">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                  <TabsTrigger value="edit">Edit Nomination</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <NominationOverviewCard nomination={selectedNomination} />
                </TabsContent>

                <TabsContent value="certificates">
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

                <TabsContent value="edit">
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
  );
}
