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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StageGate } from "@/components/StageGate";
import {
  NomineeCard,
  NomineeCardSkeleton,
  type NomineeCardData,
} from "@/components/nesa/NomineeCard";
import { useSeason } from "@/contexts/SeasonContext";
import { useAuth } from "@/contexts/AuthContext";
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
} from "@/config/agcConfig";
import { useNomineesByTier } from "@/hooks/useBackendNominees";
import { useAllCategories } from "@/hooks/useCategories";
import type { DisplayNominee } from "@/hooks/useBackendNominees";

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
  const { currentEdition, isStageOpen } = useSeason();
  const { user } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [votingNomineeId, setVotingNomineeId] = useState<string | null>(null);
  const [voteQuantity, setVoteQuantity] = useState<Record<string, number>>({});

  const currentPhase = getCurrentVotingPhase();
  const votingOpen = isStageOpen("public_voting");

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
  const { data: categories = [] } = useAllCategories();

  // Fetch approved nominees from all tiers
  const { data: platinumNominees, isLoading: platinumLoading } =
    useNomineesByTier("platinum");
  const { data: blueGarnetNominees, isLoading: blueGarnetLoading } =
    useNomineesByTier("blue-garnet");
  const { data: goldSpecialNominees, isLoading: goldSpecialLoading } =
    useNomineesByTier("gold-special");
  const { data: iconNominees, isLoading: iconLoading } =
    useNomineesByTier("icon");

  const isLoading =
    platinumLoading || blueGarnetLoading || goldSpecialLoading || iconLoading;

  // Combine all nominees
  const allNominees = useMemo(() => {
    const combined: DisplayNominee[] = [
      ...(platinumNominees || []),
      ...(blueGarnetNominees || []),
      ...(goldSpecialNominees || []),
      ...(iconNominees || []),
    ];
    return combined;
  }, [platinumNominees, blueGarnetNominees, goldSpecialNominees, iconNominees]);

  // Fetch user's votes to prevent double voting
  const { data: userVotes = [] } = useQuery({
    queryKey: ["user-votes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Mock data for now - replace with actual API call when ready
      return [];
    },
    enabled: !!user,
  });

  // Filter nominees
  const filteredNominees = useMemo(() => {
    return allNominees.filter((nominee) => {
      const matchesSearch =
        searchQuery === "" ||
        nominee.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || nominee.categoryId === selectedCategory;

      // Region filtering - you might need to enhance this based on your data
      const matchesRegion =
        selectedRegion === "all" ||
        nominee.stateRegion?.includes(selectedRegion) ||
        nominee.country?.includes(selectedRegion);

      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [allNominees, searchQuery, selectedCategory, selectedRegion]);

  // Group by category for tabbed view
  const nomineesByCategory = useMemo(() => {
    const grouped: Record<string, DisplayNominee[]> = {};
    filteredNominees.forEach((nominee) => {
      const catId = nominee.categoryId;
      if (!grouped[catId]) {
        grouped[catId] = [];
      }
      grouped[catId].push(nominee);
    });
    return grouped;
  }, [filteredNominees]);

  // Handle vote using API
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

    if (userVotes.includes(nomineeId)) {
      toast.error("You have already voted for this nominee");
      return;
    }

    setVotingNomineeId(nomineeId);

    try {
      // Simulate successful vote for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Vote cast successfully! (${qty} AGC spent)`);

      // Update local state to reflect vote
      setVoteQuantity((prev) => ({ ...prev, [nomineeId]: 1 }));
    } catch (error: any) {
      console.error("Vote error:", error);
      toast.error(error.message || "Failed to cast vote. Please try again.");
    } finally {
      setVotingNomineeId(null);
    }
  };

  // Calculate total votes
  const totalVotes = useMemo(() => {
    return allNominees.reduce((sum, n) => sum + (n.nominationCount || 0), 0);
  }, [allNominees]);

  return (
    <>
      <Helmet>
        <title>{`Vote with Afri Gold Coin (AGC) | ${currentEdition?.name || "NESA-Africa 2025"}`}</title>
        <meta
          name="description"
          content="Vote fairly. Vote transparently. Vote with purpose. Use AGC to vote for Africa's education champions."
        />
      </Helmet>

      <main className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-12 md:py-16 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.15),transparent_50%)]" />
          <div className="container px-4 sm:px-6 relative">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Coins className="mr-2 h-3 w-3" />
                AGC Voting System
              </Badge>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
                Vote with{" "}
                <span className="text-gold block sm:inline">
                  Afri Gold Coin (AGC)
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-2">
                Vote fairly. Vote transparently. Vote with purpose.
              </p>
              <p className="text-sm sm:text-base text-white/60 mb-4 md:mb-6 max-w-2xl mx-auto px-4">
                Afri Gold Coin (AGC) is NESA-Africa's official non-cash voting
                credit, designed to reward participation and protect the
                integrity of public voting across all award phases.
              </p>
              <div className="flex items-center justify-center gap-2 text-gold mb-6 md:mb-8">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-sm md:text-base font-medium">
                  NESA-Africa Gala Weekend: {GALA_WEEKEND}
                </span>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
                {AGC_PRIMARY_ACTIONS.map((action) => (
                  <Link key={action.href} to={action.href}>
                    <Button
                      variant={action.variant}
                      size="sm"
                      className={
                        action.variant === "default"
                          ? "bg-gold hover:bg-gold-dark text-charcoal font-semibold text-xs sm:text-sm"
                          : "border-gold/50 text-gold hover:bg-gold/10 text-xs sm:text-sm"
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

        <div className="container px-4 sm:px-6 py-8 md:py-12">
          {/* What is AGC */}
          <section className="mb-8 md:mb-12">
            <Card className="bg-white/5 border-gold/20">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-white text-lg md:text-xl">
                  <Coins className="h-5 w-5 text-gold" />
                  What Is Afri Gold Coin (AGC)?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <p className="text-white/60 mb-4 text-sm md:text-base">
                  Afri Gold Coin (AGC) is a digital voting credit used
                  exclusively on the NESA-Africa platform to:
                </p>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    "Vote for nominees",
                    "Participate in public voting phases",
                    "Engage with NESA Africa TV and campaigns",
                    "Support education impact initiatives",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs sm:text-sm text-white/70"
                    >
                      <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Rules + Wallet Row */}
          {/* <div className="grid gap-4 md:gap-6 lg:grid-cols-2 mb-8 md:mb-12">
            <AGCRulesCard />
            <AGCWalletCard
              agccBalance={0}
              agcBalance={0}
              loading={false}
              onConvert={() => toast.info("Converting AGCc to AGC...")}
              canConvert={false}
            />
          </div> */}

          {/* Conversion Explanation */}
          <AGCConversionCard className="mb-8 md:mb-12" />

          {/* Voting Calendar */}
          <VotingCalendarCard className="mb-8 md:mb-12" />

          {/* How Voting Works */}
          <section className="mb-8 md:mb-12">
            <Card className="bg-white/5 border-gold/20">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-white text-lg md:text-xl">
                  <VoteIcon className="h-5 w-5 text-gold" />
                  How Voting Works with AGC
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      step: 1,
                      title: "Sign up",
                      description: "Sign up and verify your account",
                    },
                    {
                      step: 2,
                      title: "Earn AGC",
                      description: "Earn or acquire AGC through activities",
                    },
                    {
                      step: 3,
                      title: "Vote",
                      description: "Use AGC to vote during active phases",
                    },
                    {
                      step: 4,
                      title: "Track",
                      description: "Track votes and balances in your dashboard",
                    },
                  ].map(({ step, title, description }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal font-bold text-sm md:text-base">
                        {step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm md:text-base truncate">
                          {title}
                        </h4>
                        <p className="text-xs md:text-sm text-white/60">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg bg-gold/10 p-3 md:p-4 flex items-start md:items-center gap-3 border border-gold/20">
                  <Shield className="h-5 w-5 text-gold shrink-0 mt-0.5 md:mt-0" />
                  <p className="text-xs md:text-sm text-white/80">
                    <span className="font-medium text-gold">
                      Integrity Rule:
                    </span>{" "}
                    <span className="text-white/60">
                      Sponsors, partners, and advertisers do not influence
                      winners.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Earning Methods */}
          <EarningMethodsGrid className="mb-8 md:mb-12" />

          {/* Voting Section */}
          <section className="mb-8 md:mb-12" id="vote">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <VoteIcon className="h-5 w-5 md:h-6 md:w-6 text-gold" />
                Vote for Nominees
              </h2>
              {votingOpen && currentPhase && (
                <Badge className="bg-green-600 text-white self-start sm:self-auto">
                  {currentPhase.name} Open
                </Badge>
              )}
            </div>

            <StageGate action="public_voting">
              {/* Filters */}
              <div className="mb-6 md:mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:flex-1 md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search nominees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-gold/20 text-white placeholder:text-white/40 w-full"
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-gold/20 text-white">
                      <Filter className="mr-2 h-4 w-4 text-gold" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal-light border-gold/20">
                      <SelectItem
                        value="all"
                        className="text-white hover:bg-gold/10"
                      >
                        All Categories
                      </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="text-white hover:bg-gold/10"
                        >
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedRegion}
                    onValueChange={setSelectedRegion}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-gold/20 text-white">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal-light border-gold/20">
                      {REGIONS.map((region) => (
                        <SelectItem
                          key={region.value}
                          value={region.value}
                          className="text-white hover:bg-gold/10"
                        >
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 md:mb-8 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                <Card className="bg-gold/5 border-gold/20">
                  <CardContent className="p-2 md:p-4 flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-full bg-gold/10">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg md:text-2xl font-bold text-white">
                        {allNominees.length}
                      </p>
                      <p className="text-xs md:text-sm text-white/60 truncate">
                        Total Nominees
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gold/5 border-gold/20">
                  <CardContent className="p-2 md:p-4 flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-full bg-gold/10">
                      <Trophy className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg md:text-2xl font-bold text-white">
                        {categories.length}
                      </p>
                      <p className="text-xs md:text-sm text-white/60 truncate">
                        Categories
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gold/5 border-gold/20">
                  <CardContent className="p-2 md:p-4 flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-full bg-gold/10">
                      <ThumbsUp className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg md:text-2xl font-bold text-white">
                        {totalVotes}
                      </p>
                      <p className="text-xs md:text-sm text-white/60 truncate">
                        Total Votes
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gold/5 border-gold/20">
                  <CardContent className="p-2 md:p-4 flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-full bg-gold/10">
                      <VoteIcon className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg md:text-2xl font-bold text-white">
                        {userVotes.length}
                      </p>
                      <p className="text-xs md:text-sm text-white/60 truncate">
                        Your Votes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 md:py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-gold mb-4" />
                  <p className="text-white/60 text-sm md:text-base">
                    Loading nominees...
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredNominees.length === 0 && (
                <Card className="border-dashed border-gold/20 bg-white/5">
                  <CardContent className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
                    <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-gold/30 mb-4" />
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2 text-center">
                      No Nominees Found
                    </h3>
                    <p className="text-white/60 text-center text-xs md:text-sm max-w-md mb-4">
                      {searchQuery ||
                      selectedCategory !== "all" ||
                      selectedRegion !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "No approved nominees are available for voting at this time."}
                    </p>
                    {(searchQuery ||
                      selectedCategory !== "all" ||
                      selectedRegion !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedRegion("all");
                        }}
                        className="border-gold/30 text-gold hover:bg-gold/10 text-xs md:text-sm"
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
                  <TabsList className="mb-4 md:mb-6 flex-wrap h-auto gap-1 md:gap-2 bg-white/5 border border-gold/20 p-1">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-white text-xs md:text-sm px-2 md:px-3"
                    >
                      All ({filteredNominees.length})
                    </TabsTrigger>
                    {Object.entries(nomineesByCategory).map(
                      ([catId, catNominees]) => {
                        const category = categories.find((c) => c.id === catId);
                        return (
                          <TabsTrigger
                            key={catId}
                            value={catId}
                            className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-white text-xs md:text-sm px-2 md:px-3"
                          >
                            {category?.title
                              ?.split(" ")
                              .slice(0, 2)
                              .join(" ") || catId}{" "}
                            ({catNominees.length})
                          </TabsTrigger>
                        );
                      },
                    )}
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
                    />
                  </TabsContent>

                  {Object.entries(nomineesByCategory).map(
                    ([catId, catNominees]) => (
                      <TabsContent key={catId} value={catId}>
                        <NomineeVoteGrid
                          nominees={catNominees}
                          userVotes={userVotes}
                          votingNomineeId={votingNomineeId}
                          onVote={handleVote}
                          user={user}
                          voteQuantity={voteQuantity}
                          setVoteQuantity={setVoteQuantity}
                        />
                      </TabsContent>
                    ),
                  )}
                </Tabs>
              )}
            </StageGate>
          </section>

          {/* FAQs */}
          <AGCFAQAccordion className="mb-8 md:mb-12" />

          {/* Compliance Notice */}
          <section className="mb-8 md:mb-12">
            <Card className="border-gold/30 bg-gold/5">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-gold shrink-0 mt-0.5 md:mt-1" />
                  <div>
                    <h3 className="font-semibold text-white text-sm md:text-base mb-1 md:mb-2">
                      Compliance & Integrity Notice
                    </h3>
                    <p className="text-xs md:text-sm text-white/60">
                      All AGC activities are logged, verified, and monitored.
                      Abuse, duplication, or manipulation results in
                      disqualification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-charcoal to-charcoal/90 py-12 md:py-16">
          <div className="container px-4 sm:px-6 text-center">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Ready to Vote?
            </h2>
            <p className="text-white/70 mb-6 md:mb-8 max-w-lg mx-auto text-sm md:text-base">
              Attend. Celebrate. Rebuild. Sponsor.
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-xs sm:text-sm"
                >
                  <UserPlus className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Sign Up
                </Button>
              </Link>
              <Link to="/nominate">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold/50 text-gold hover:bg-gold/10 text-xs sm:text-sm"
                >
                  <Trophy className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Nominate & Earn
                </Button>
              </Link>
              <Link to="/about-agc">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold/50 text-gold hover:bg-gold/10 text-xs sm:text-sm"
                >
                  <Coins className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Get AGC
                </Button>
              </Link>
              <a href="#vote">
                <Button
                  size="sm"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-xs sm:text-sm"
                >
                  Vote Now
                  <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
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
  nominees: DisplayNominee[];
  userVotes: string[];
  votingNomineeId: string | null;
  onVote: (nomineeId: string) => void;
  user: unknown;
  voteQuantity: Record<string, number>;
  setVoteQuantity: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

function NomineeVoteGrid({
  nominees,
  userVotes,
  votingNomineeId,
  onVote,
  user,
  voteQuantity,
  setVoteQuantity,
}: NomineeVoteGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {nominees.map((nominee) => {
        const hasVoted = userVotes.includes(nominee.id);
        const isVoting = votingNomineeId === nominee.id;
        const qty = voteQuantity[nominee.id] || 1;
        const cost = qty;

        const nomineeData: NomineeCardData = {
          id: nominee.id,
          name: nominee.name,
          title: nominee.achievement?.substring(0, 100) || undefined,
          organization:
            nominee.accountType === "ORGANIZATION" ? nominee.name : undefined,
          photoUrl: nominee.profileImage || "/placeholder.svg",
          slug: nominee.id,
          publicVotes: nominee.nominationCount || 0,
          subcategoryName: nominee.subCategoryName,
          categoryName: nominee.categoryName,
        };

        return (
          <Card
            key={nominee.id}
            className="bg-white/5 border-gold/20 overflow-hidden"
          >
            <NomineeCard nominee={nomineeData} variant="compact" />
            <CardContent className="border-t border-gold/20 p-3 md:p-4">
              {hasVoted ? (
                <Badge
                  variant="secondary"
                  className="w-full justify-center py-1.5 md:py-2 bg-gold/10 text-gold border-gold/30 text-xs md:text-sm"
                >
                  ✓ Voted
                </Badge>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2">
                    <Select
                      value={qty.toString()}
                      onValueChange={(v) =>
                        setVoteQuantity((prev) => ({
                          ...prev,
                          [nominee.id]: parseInt(v),
                        }))
                      }
                    >
                      <SelectTrigger className="w-16 md:w-20 h-8 md:h-10 bg-white/5 border-gold/20 text-white text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-charcoal-light border-gold/20">
                        {[1, 2, 3, 5, 10].map((n) => (
                          <SelectItem
                            key={n}
                            value={n.toString()}
                            className="text-white hover:bg-gold/10 text-xs md:text-sm"
                          >
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs md:text-sm text-white/60 flex-1">
                      = {cost} AGC
                    </span>
                  </div>
                  <Button
                    className="w-full bg-gold hover:bg-gold-dark text-charcoal text-xs md:text-sm h-8 md:h-10"
                    onClick={() => onVote(nominee.id)}
                    disabled={!user || isVoting}
                  >
                    {isVoting ? (
                      <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin mr-1 md:mr-2" />
                    ) : (
                      <VoteIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    )}
                    {!user
                      ? "Sign in to Vote"
                      : isVoting
                        ? "Voting..."
                        : "Vote"}
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
