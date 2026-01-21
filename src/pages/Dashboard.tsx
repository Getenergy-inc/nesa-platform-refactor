import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSeason } from "@/contexts/SeasonContext";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Plus, Clock, CheckCircle, XCircle, Vote, FileText, User } from "lucide-react";

interface Nomination {
  id: string;
  nominee_name: string;
  nominee_title: string | null;
  nominee_organization: string | null;
  status: string;
  created_at: string;
  subcategory: {
    name: string;
    category: {
      name: string;
    };
  } | null;
}

interface VoteRecord {
  id: string;
  vote_type: string;
  score: number | null;
  created_at: string;
  nominee: {
    name: string;
    title: string | null;
  } | null;
}

function DashboardContent() {
  const { user } = useAuth();
  const { currentEdition } = useSeason();
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        // Load user's nominations
        const { data: nominationsData } = await supabase
          .from("nominations")
          .select(`
            id,
            nominee_name,
            nominee_title,
            nominee_organization,
            status,
            created_at,
            subcategories (
              name,
              categories (
                name
              )
            )
          `)
          .eq("nominator_id", user.id)
          .order("created_at", { ascending: false });

        if (nominationsData) {
          setNominations(nominationsData.map(n => ({
            ...n,
            subcategory: n.subcategories ? {
              name: n.subcategories.name,
              category: n.subcategories.categories ? {
                name: n.subcategories.categories.name
              } : { name: "Unknown" }
            } : null
          })));
        }

        // Load user's votes
        const { data: votesData } = await supabase
          .from("votes")
          .select(`
            id,
            vote_type,
            score,
            created_at,
            nominees (
              name,
              title
            )
          `)
          .eq("voter_id", user.id)
          .order("created_at", { ascending: false });

        if (votesData) {
          setVotes(votesData.map(v => ({
            ...v,
            nominee: v.nominees ? {
              name: v.nominees.name,
              title: v.nominees.title
            } : null
          })));
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      case "platinum":
        return <Badge className="bg-primary text-primary-foreground"><Award className="mr-1 h-3 w-3" />Platinum</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold">My Dashboard</h1>
              <p className="text-xs text-muted-foreground">{currentEdition.name}</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/nominate">
              <Plus className="mr-2 h-4 w-4" />
              New Nomination
            </Link>
          </Button>
        </div>
      </header>

      <main className="container px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{nominations.length}</p>
                <p className="text-sm text-muted-foreground">Nominations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Vote className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{votes.length}</p>
                <p className="text-sm text-muted-foreground">Votes Cast</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {nominations.filter((n) => n.status === "approved" || n.status === "platinum").length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="nominations">
          <TabsList className="mb-6">
            <TabsTrigger value="nominations">My Nominations</TabsTrigger>
            <TabsTrigger value="votes">My Votes</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="nominations">
            {nominations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-display text-xl font-semibold">No Nominations Yet</h3>
                  <p className="mb-6 text-muted-foreground">
                    You haven't submitted any nominations. Start recognizing African excellence!
                  </p>
                  <Button asChild>
                    <Link to="/nominate">
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Nomination
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {nominations.map((nomination) => (
                  <Card key={nomination.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{nomination.nominee_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {nomination.subcategory?.category?.name} → {nomination.subcategory?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted {new Date(nomination.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(nomination.status)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="votes">
            {votes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Vote className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-display text-xl font-semibold">No Votes Yet</h3>
                  <p className="mb-6 text-muted-foreground">
                    You haven't cast any votes yet. Check back when voting opens!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {votes.map((vote) => (
                  <Card key={vote.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <h4 className="font-semibold">{vote.nominee?.name || "Unknown Nominee"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {vote.vote_type === "public" ? "Public Vote" : `Jury Score: ${vote.score}/10`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(vote.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {vote.vote_type === "public" ? "Public" : "Jury"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Profile settings coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
