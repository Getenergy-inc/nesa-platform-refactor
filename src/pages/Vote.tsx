import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Vote as VoteIcon, 
  Search, 
  Filter, 
  Trophy, 
  Users, 
  ThumbsUp,
  Loader2,
  AlertCircle,
  Wallet,
  Sparkles,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StageGate } from "@/components/StageGate";
import { NomineeCard, NomineeCardSkeleton, type NomineeCardData } from "@/components/nesa/NomineeCard";
import { useSeason } from "@/contexts/SeasonContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Nominee {
  id: string;
  name: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  slug: string;
  public_votes: number;
  subcategory_id: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    categories: {
      id: string;
      name: string;
      slug: string;
    };
    chapters: {
      id: string;
      name: string;
      region: string | null;
      country: string;
    } | null;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// African regions for filtering
const REGIONS = [
  { value: "all", label: "All Regions" },
  { value: "West Africa", label: "West Africa" },
  { value: "East Africa", label: "East Africa" },
  { value: "Southern Africa", label: "Southern Africa" },
  { value: "North Africa", label: "North Africa" },
  { value: "Central Africa", label: "Central Africa" },
];

export default function Vote() {
  const { currentEdition } = useSeason();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [votingNomineeId, setVotingNomineeId] = useState<string | null>(null);

  // Fetch categories for filter
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch approved nominees
  const { data: nominees = [], isLoading, refetch } = useQuery<Nominee[]>({
    queryKey: ["nominees-for-voting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select(`
          id,
          name,
          title,
          organization,
          bio,
          photo_url,
          slug,
          public_votes,
          subcategory_id,
          subcategories!inner(
            id,
            name,
            slug,
            categories!inner(id, name, slug),
            chapters(id, name, region, country)
          ),
          seasons!inner(is_active)
        `)
        .eq("seasons.is_active", true)
        .eq("status", "approved")
        .order("public_votes", { ascending: false });
      
      if (error) throw error;
      return (data || []) as unknown as Nominee[];
    },
  });

  // Fetch user's votes to prevent double voting
  const { data: userVotes = [] } = useQuery({
    queryKey: ["user-votes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("votes")
        .select("nominee_id")
        .eq("voter_id", user.id)
        .eq("vote_type", "public");
      
      if (error) throw error;
      return data?.map(v => v.nominee_id) || [];
    },
    enabled: !!user,
  });

  // Filter nominees
  const filteredNominees = useMemo(() => {
    return nominees.filter(nominee => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        nominee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.subcategories.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === "all" || 
        nominee.subcategories.categories.slug === selectedCategory;

      // Region filter
      const matchesRegion = selectedRegion === "all" || 
        nominee.subcategories.chapters?.region === selectedRegion;

      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [nominees, searchQuery, selectedCategory, selectedRegion]);

  // Group by category for tabbed view
  const nomineesByCategory = useMemo(() => {
    const grouped: Record<string, Nominee[]> = {};
    filteredNominees.forEach(nominee => {
      const catSlug = nominee.subcategories.categories.slug;
      if (!grouped[catSlug]) {
        grouped[catSlug] = [];
      }
      grouped[catSlug].push(nominee);
    });
    return grouped;
  }, [filteredNominees]);

  // Handle vote
  const handleVote = async (nomineeId: string) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }

    if (userVotes.includes(nomineeId)) {
      toast.error("You have already voted for this nominee");
      return;
    }

    setVotingNomineeId(nomineeId);

    try {
      // Get active season
      const { data: seasonData } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (!seasonData) {
        toast.error("No active season found");
        return;
      }

      // Insert vote
      const { error: voteError } = await supabase.from("votes").insert({
        voter_id: user.id,
        nominee_id: nomineeId,
        season_id: seasonData.id,
        vote_type: "public",
      });

      if (voteError) {
        if (voteError.message.includes("stage")) {
          toast.error("Voting is currently closed");
        } else {
          throw voteError;
        }
        return;
      }

      // Increment vote count
      await supabase.rpc("increment_public_votes", { nominee_id: nomineeId });

      toast.success("Vote cast successfully!");
      refetch();
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setVotingNomineeId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Vote for Nominees | {currentEdition.name}</title>
        <meta 
          name="description" 
          content={`Cast your vote for outstanding education changemakers in the ${currentEdition.name} awards. Support nominees making a difference across Africa.`}
        />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.1),transparent_50%)]" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <VoteIcon className="mr-2 h-3 w-3" />
                Public Voting
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Vote for Africa's{" "}
                <span className="text-gold">Education Champions</span>
              </h1>
              <p className="text-white/70 text-lg mb-4">
                Voting uses AGC voting credits. <span className="font-semibold text-gold">1 vote = 1 AGC</span>
              </p>
              <p className="text-white/60 text-sm mb-6">
                AGC is non-tradeable: no cash-out, no withdrawals, no payouts.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/wallet">
                    <Wallet className="mr-2 h-4 w-4" />
                    View My Wallet
                  </Link>
                </Button>
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                  <Link to="/earn-voting-credits">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Earn Voting Credits
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  <Link to="/claim-voting-credits">
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Sponsor Credits
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Stage Gated */}
        <section className="py-12 md:py-16">
          <div className="container">
            <StageGate action="public_voting">
              {/* Filters */}
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search nominees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{nominees.length}</p>
                      <p className="text-sm text-muted-foreground">Total Nominees</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gold/5 border-gold/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gold/10">
                      <Trophy className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{categories.length}</p>
                      <p className="text-sm text-muted-foreground">Categories</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10">
                      <ThumbsUp className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {nominees.reduce((sum, n) => sum + (n.public_votes || 0), 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Votes</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/50 border-secondary">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-secondary">
                      <VoteIcon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userVotes.length}</p>
                      <p className="text-sm text-muted-foreground">Your Votes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading nominees...</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredNominees.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Nominees Found</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-4">
                      {searchQuery || selectedCategory !== "all" || selectedRegion !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "No approved nominees are available for voting at this time."}
                    </p>
                    {(searchQuery || selectedCategory !== "all" || selectedRegion !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedRegion("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Nominees Grid */}
              {!isLoading && filteredNominees.length > 0 && (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-6 flex-wrap h-auto gap-2">
                    <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-charcoal">
                      All ({filteredNominees.length})
                    </TabsTrigger>
                    {Object.entries(nomineesByCategory).map(([catSlug, catNominees]) => {
                      const category = categories.find(c => c.slug === catSlug);
                      return (
                        <TabsTrigger 
                          key={catSlug} 
                          value={catSlug}
                          className="data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                        >
                          {category?.name || catSlug} ({catNominees.length})
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <TabsContent value="all">
                    <NomineeVoteGrid 
                      nominees={filteredNominees}
                      userVotes={userVotes}
                      votingNomineeId={votingNomineeId}
                      onVote={handleVote}
                      user={user}
                    />
                  </TabsContent>

                  {Object.entries(nomineesByCategory).map(([catSlug, catNominees]) => (
                    <TabsContent key={catSlug} value={catSlug}>
                      <NomineeVoteGrid 
                        nominees={catNominees}
                        userVotes={userVotes}
                        votingNomineeId={votingNomineeId}
                        onVote={handleVote}
                        user={user}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </StageGate>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-charcoal to-charcoal/90 py-16">
          <div className="container text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Know Someone Making a Difference?
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Nominations are the first step in recognizing Africa's education changemakers. 
              Submit a nomination to help honor their contributions.
            </p>
            <Link to="/nominate">
              <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                <Trophy className="mr-2 h-4 w-4" />
                Nominate a Changemaker
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

// Separate component for the nominee grid using shared NomineeCard
interface NomineeVoteGridProps {
  nominees: Nominee[];
  userVotes: string[];
  votingNomineeId: string | null;
  onVote: (nomineeId: string) => void;
  user: { id: string } | null;
}

function NomineeVoteGrid({ 
  nominees, 
  userVotes, 
  votingNomineeId, 
  onVote,
  user 
}: NomineeVoteGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {nominees.map((nominee) => {
        const hasVoted = userVotes.includes(nominee.id);
        const isVoting = votingNomineeId === nominee.id;

        const cardData: NomineeCardData = {
          id: nominee.id,
          name: nominee.name,
          slug: nominee.slug,
          title: nominee.title,
          organization: nominee.organization,
          photoUrl: nominee.photo_url,
          publicVotes: nominee.public_votes,
          categoryName: nominee.subcategories?.categories?.name,
          country: nominee.subcategories?.chapters?.country,
          region: nominee.subcategories?.chapters?.region || undefined,
        };

        return (
          <NomineeCard
            key={nominee.id}
            nominee={cardData}
            variant="voting"
            hasVoted={hasVoted}
            isVoting={isVoting}
            onVote={() => onVote(nominee.id)}
            showLoginToVote={!user}
          />
        );
      })}
    </div>
  );
}
