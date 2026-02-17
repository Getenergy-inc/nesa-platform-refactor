import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { 
  Vote as VoteIcon, 
  Search, 
  Filter, 
  Trophy, 
  Users, 
  ThumbsUp,
  Loader2,
  AlertCircle,
  Coins,
  Calendar,
  UserPlus,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StageGate } from "@/components/StageGate";
import { NomineeCard, NomineeCardSkeleton, type NomineeCardData } from "@/components/nesa/NomineeCard";
import { useSeason } from "@/contexts/SeasonContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AGCWalletCard,
  VotingCalendarCard,
  EarningMethodsGrid,
  AGCRulesCard,
  AGCConversionCard,
  AGCFAQAccordion,
} from "@/components/agc";
import {
  GALA_WEEKEND,
  AGC_PRIMARY_ACTIONS,
  getCurrentVotingPhase,
  isVotingOpen,
} from "@/config/agcConfig";

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

export default function VoteWithAGC() {
  const { currentEdition } = useSeason();
  const { user } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [votingNomineeId, setVotingNomineeId] = useState<string | null>(null);
  const [voteQuantity, setVoteQuantity] = useState<Record<string, number>>({});

  const currentPhase = getCurrentVotingPhase();
  const votingOpen = isVotingOpen();

  // Fetch wallet balance from API
  const { data: walletData, isLoading: walletLoading, refetch: refetchWallet } = useQuery({
    queryKey: ["voting-balance", user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voting/balance`,
        {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch balance");
      return response.json();
    },
    enabled: !!user,
  });

  const agccBalance = walletData?.balanceAgcc || 0;
  const agcBalance = walletData?.balanceAgc || 0;

  // Scroll to section if hash is present
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

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
  const { data: userVotes = [], refetch: refetchUserVotes } = useQuery({
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
      const matchesSearch = searchQuery === "" || 
        nominee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.subcategories.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || 
        nominee.subcategories.categories.slug === selectedCategory;

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

  // Handle vote using edge function
  const handleVote = async (nomineeId: string) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }

    if (!votingOpen) {
      toast.error("Voting is currently closed");
      return;
    }

    const qty = voteQuantity[nomineeId] || 1;
    const cost = qty; // 1 AGC per vote

    if (agcBalance < cost) {
      toast.error(`Insufficient AGC. You need ${cost} AGC to cast ${qty} vote(s).`);
      return;
    }

    if (userVotes.includes(nomineeId)) {
      toast.error("You have already voted for this nominee");
      return;
    }

    setVotingNomineeId(nomineeId);

    try {
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voting/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data.session?.access_token}`,
          },
          body: JSON.stringify({
            nomineeId,
            voteType: "public",
            voteCount: qty,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Insufficient AGC balance") {
          toast.error(`Insufficient AGC. You need ${result.required} AGC, but only have ${result.available}.`);
        } else if (result.error?.includes("stage")) {
          toast.error("Voting is currently closed");
        } else {
          toast.error(result.error || "Failed to cast vote");
        }
        return;
      }

      toast.success(`Vote cast successfully! (${result.agcSpent} AGC spent)`);
      
      // Refresh data
      refetch();
      refetchUserVotes();
      refetchWallet();
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setVotingNomineeId(null);
    }
  };

  const handleConvert = async () => {
    toast.info("Converting AGCc to AGC...");
    // TODO: Implement actual conversion API call via wallet edge function
  };

  return (
    <>
      <Helmet>
        <title>{`Vote with Afri Gold Coin (AGC) | ${currentEdition?.name || 'NESA-Africa 2025'}`}</title>
        <meta 
          name="description" 
          content="Vote fairly. Vote transparently. Vote with purpose. Use AGC to vote for Africa's education champions."
        />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.15),transparent_50%)]" />
          <div className="container relative">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Coins className="mr-2 h-3 w-3" />
                AGC Voting System
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                Vote with{" "}
                <span className="text-gold">Afri Gold Coin (AGC)</span>
              </h1>
              <p className="text-xl text-white/80 mb-2">
                Vote fairly. Vote transparently. Vote with purpose.
              </p>
              <p className="text-white/60 text-lg mb-4 max-w-2xl mx-auto">
                Afri Gold Coin (AGC) is NESA-Africa's official non-cash voting credit, 
                designed to reward participation and protect the integrity of public voting 
                across all award phases.
              </p>
              <div className="flex items-center justify-center gap-2 text-gold mb-8">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">NESA-Africa Gala Weekend: {GALA_WEEKEND}</span>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap justify-center gap-3">
                {AGC_PRIMARY_ACTIONS.map((action) => (
                  <Link key={action.href} to={action.href}>
                    <Button 
                      variant={action.variant}
                      size="lg"
                      className={action.variant === "default" 
                        ? "bg-gold hover:bg-gold-dark text-charcoal font-semibold" 
                        : "border-gold/50 text-gold hover:bg-gold/10"
                      }
                    >
                      {action.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          {/* What is AGC */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-gold" />
                  What Is Afri Gold Coin (AGC)?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Afri Gold Coin (AGC) is a digital voting credit used exclusively on the NESA-Africa platform to:
                </p>
                <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                  {[
                    "Vote for nominees",
                    "Participate in public voting phases",
                    "Engage with NESA Africa TV and campaigns",
                    "Support education impact initiatives",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Rules + Wallet Row */}
          <div className="grid gap-6 lg:grid-cols-2 mb-12">
            <AGCRulesCard />
            {user ? (
              <AGCWalletCard
                agccBalance={agccBalance}
                agcBalance={agcBalance}
                loading={walletLoading}
                onConvert={handleConvert}
                canConvert={agccBalance >= 10}
              />
            ) : (
              <Card className="flex items-center justify-center">
                <CardContent className="p-8 text-center">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sign In to View Wallet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an account or sign in to earn and spend AGC.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/register">
                      <Button className="bg-gold hover:bg-gold-dark text-charcoal">
                        Create Account
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Conversion Explanation */}
          <AGCConversionCard className="mb-12" />

          {/* Voting Calendar */}
          <VotingCalendarCard className="mb-12" />

          {/* How Voting Works */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VoteIcon className="h-5 w-5 text-primary" />
                  How Voting Works with AGC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { step: 1, title: "Sign up", description: "Sign up and verify your account" },
                    { step: 2, title: "Earn AGC", description: "Earn or acquire AGC through activities" },
                    { step: 3, title: "Vote", description: "Use AGC to vote during active phases" },
                    { step: 4, title: "Track", description: "Track votes and balances in your dashboard" },
                  ].map(({ step, title, description }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal font-bold">
                        {step}
                      </div>
                      <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg bg-muted/50 p-4 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Integrity Rule:</span>{" "}
                    <span className="text-muted-foreground">
                      Sponsors, partners, and advertisers do not influence winners.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Earning Methods */}
          <EarningMethodsGrid className="mb-12" />

          {/* Voting Section */}
          <section className="mb-12" id="vote">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <VoteIcon className="h-6 w-6 text-primary" />
                Vote for Nominees
              </h2>
              {votingOpen && currentPhase && (
                <Badge className="bg-green-600">
                  {currentPhase.name} Open
                </Badge>
              )}
            </div>

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
                      voteQuantity={voteQuantity}
                      setVoteQuantity={setVoteQuantity}
                      agcBalance={walletData.agcBalance}
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
                        voteQuantity={voteQuantity}
                        setVoteQuantity={setVoteQuantity}
                        agcBalance={walletData.agcBalance}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </StageGate>
          </section>

          {/* FAQs */}
          <AGCFAQAccordion className="mb-12" />

          {/* Compliance Notice */}
          <section className="mb-12">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Compliance & Integrity Notice</h3>
                    <p className="text-sm text-muted-foreground">
                      All AGC activities are logged, verified, and monitored. Abuse, duplication, 
                      or manipulation results in disqualification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-charcoal to-charcoal/90 py-16">
          <div className="container text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Vote?
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Attend. Celebrate. Rebuild. Sponsor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
              <Link to="/nominate">
                <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  <Trophy className="mr-2 h-4 w-4" />
                  Nominate & Earn
                </Button>
              </Link>
              <Link to="/about-agc">
                <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  <Coins className="mr-2 h-4 w-4" />
                  Get AGC
                </Button>
              </Link>
              <a href="#vote">
                <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                  Vote Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Nominee Grid Component with AGC voting
interface NomineeVoteGridProps {
  nominees: Nominee[];
  userVotes: string[];
  votingNomineeId: string | null;
  onVote: (nomineeId: string) => void;
  user: unknown;
  voteQuantity: Record<string, number>;
  setVoteQuantity: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  agcBalance: number;
}

function NomineeVoteGrid({
  nominees,
  userVotes,
  votingNomineeId,
  onVote,
  user,
  voteQuantity,
  setVoteQuantity,
  agcBalance,
}: NomineeVoteGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {nominees.map((nominee) => {
        const hasVoted = userVotes.includes(nominee.id);
        const isVoting = votingNomineeId === nominee.id;
        const qty = voteQuantity[nominee.id] || 1;
        const cost = qty;

        const nomineeData: NomineeCardData = {
          id: nominee.id,
          name: nominee.name,
          title: nominee.title || undefined,
          organization: nominee.organization || undefined,
          photoUrl: nominee.photo_url || undefined,
          slug: nominee.slug,
          publicVotes: nominee.public_votes,
          subcategoryName: nominee.subcategories.name,
          categoryName: nominee.subcategories.categories.name,
        };

        return (
          <Card key={nominee.id} className="overflow-hidden">
            <NomineeCard nominee={nomineeData} variant="compact" />
            <CardContent className="border-t pt-4">
              {hasVoted ? (
                <Badge variant="secondary" className="w-full justify-center py-2">
                  ✓ Voted
                </Badge>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={qty.toString()}
                      onValueChange={(v) => 
                        setVoteQuantity(prev => ({ ...prev, [nominee.id]: parseInt(v) }))
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 5, 10, 25, 50].map((n) => (
                          <SelectItem 
                            key={n} 
                            value={n.toString()}
                            disabled={n > agcBalance}
                          >
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground flex-1">
                      = {cost} AGC
                    </span>
                  </div>
                  <Button
                    className="w-full bg-gold hover:bg-gold-dark text-charcoal"
                    onClick={() => onVote(nominee.id)}
                    disabled={!user || isVoting || cost > agcBalance}
                  >
                    {isVoting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <VoteIcon className="h-4 w-4 mr-2" />
                    )}
                    {!user ? "Sign in to Vote" : isVoting ? "Voting..." : "Vote"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
