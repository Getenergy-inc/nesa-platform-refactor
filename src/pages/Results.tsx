import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Search, 
  Filter, 
  Crown,
  Award,
  Medal,
  Star,
  Building2,
  ChevronRight,
  Loader2,
  AlertCircle,
  BadgeCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StageGate } from "@/components/StageGate";
import { useSeason } from "@/contexts/SeasonContext";
import { supabase } from "@/integrations/supabase/client";

interface Winner {
  id: string;
  name: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  slug: string;
  public_votes: number;
  jury_score: number;
  final_score: number;
  is_platinum: boolean;
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

// Award tier configuration
const TIER_CONFIG = {
  "blue-garnet": { 
    label: "Blue Garnet", 
    icon: Crown, 
    gradient: "from-blue-600 to-indigo-700",
    description: "Highest Honor - Top 9 Winners"
  },
  "gold": { 
    label: "Gold Certificate", 
    icon: Award, 
    gradient: "from-yellow-500 to-amber-600",
    description: "Regional Excellence Winners"
  },
  "icon": { 
    label: "Africa Education Icon", 
    icon: Star, 
    gradient: "from-purple-600 to-pink-600",
    description: "Lifetime Achievement Recognition"
  },
  "platinum": { 
    label: "Platinum Verified", 
    icon: BadgeCheck, 
    gradient: "from-slate-300 to-slate-500",
    description: "NRC Verified Excellence"
  },
};

export default function Results() {
  const { currentEdition } = useSeason();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");

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

  // Fetch winners (approved nominees with high scores)
  const { data: winners = [], isLoading } = useQuery<Winner[]>({
    queryKey: ["award-winners"],
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
          jury_score,
          final_score,
          is_platinum,
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
        .in("status", ["approved", "platinum"])
        .order("final_score", { ascending: false });
      
      if (error) throw error;
      return (data || []) as unknown as Winner[];
    },
  });

  // Determine tier for each winner
  const getWinnerTier = (winner: Winner, index: number, categoryWinners: Winner[]) => {
    // Top 9 overall are Blue Garnet
    if (index < 9) return "blue-garnet";
    // Platinum verified
    if (winner.is_platinum) return "platinum";
    // Top in their subcategory = Gold
    const subcatWinners = categoryWinners.filter(
      w => w.subcategories.id === winner.subcategories.id
    );
    if (subcatWinners[0]?.id === winner.id) return "gold";
    return "platinum";
  };

  // Filter winners
  const filteredWinners = useMemo(() => {
    return winners.filter(winner => {
      const matchesSearch = searchQuery === "" || 
        winner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        winner.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        winner.subcategories.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || 
        winner.subcategories.categories.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [winners, searchQuery, selectedCategory]);

  // Group by category
  const winnersByCategory = useMemo(() => {
    const grouped: Record<string, Winner[]> = {};
    filteredWinners.forEach(winner => {
      const catSlug = winner.subcategories.categories.slug;
      if (!grouped[catSlug]) {
        grouped[catSlug] = [];
      }
      grouped[catSlug].push(winner);
    });
    return grouped;
  }, [filteredWinners]);

  // Stats
  const stats = useMemo(() => {
    const blueGarnet = Math.min(9, winners.length);
    const platinum = winners.filter(w => w.is_platinum).length;
    const totalVotes = winners.reduce((sum, w) => sum + (w.public_votes || 0), 0);
    return { blueGarnet, platinum, totalVotes, total: winners.length };
  }, [winners]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Helmet>
        <title>{`Award Results | ${currentEdition?.name || 'NESA-Africa 2025'}`}</title>
        <meta 
          name="description" 
          content={`View the official award winners and results for ${currentEdition.name}. Celebrating Africa's outstanding education changemakers.`}
        />
      </Helmet>

      <main className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Trophy className="mr-2 h-3 w-3" />
                Official Results
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                {currentEdition.name}{" "}
                <span className="text-gold">Award Winners</span>
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Celebrating the outstanding individuals and organizations recognized for their 
                exceptional contributions to education across Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content - Stage Gated */}
        <section className="py-12 md:py-16">
          <div className="container">
            <StageGate action="results">
              {/* Filters */}
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search winners..."
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

                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger className="w-[180px]">
                      <Award className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Award Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="blue-garnet">Blue Garnet</SelectItem>
                      <SelectItem value="gold">Gold Certificate</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-600/10 to-indigo-700/10 border-blue-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-500/20">
                      <Crown className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.blueGarnet}</p>
                      <p className="text-sm text-muted-foreground">Blue Garnet</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gold/5 border-gold/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gold/10">
                      <Trophy className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Total Winners</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-500/5 border-slate-500/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-slate-500/10">
                      <BadgeCheck className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.platinum}</p>
                      <p className="text-sm text-muted-foreground">Platinum Verified</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Medal className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalVotes.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Public Votes</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading results...</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredWinners.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      {searchQuery || selectedCategory !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "Award results will be announced soon."}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Winners Display */}
              {!isLoading && filteredWinners.length > 0 && (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-6 flex-wrap h-auto gap-2">
                    <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-charcoal">
                      All Winners ({filteredWinners.length})
                    </TabsTrigger>
                    {Object.entries(winnersByCategory).map(([catSlug, catWinners]) => {
                      const category = categories.find(c => c.slug === catSlug);
                      return (
                        <TabsTrigger 
                          key={catSlug} 
                          value={catSlug}
                          className="data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                        >
                          {category?.name || catSlug} ({catWinners.length})
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <TabsContent value="all">
                    <WinnersGrid 
                      winners={filteredWinners}
                      allWinners={winners}
                      getInitials={getInitials}
                      getWinnerTier={getWinnerTier}
                    />
                  </TabsContent>

                  {Object.entries(winnersByCategory).map(([catSlug, catWinners]) => (
                    <TabsContent key={catSlug} value={catSlug}>
                      <WinnersGrid 
                        winners={catWinners}
                        allWinners={winners}
                        getInitials={getInitials}
                        getWinnerTier={getWinnerTier}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </StageGate>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-charcoal to-charcoal/90 py-16">
          <div className="container text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Verify Award Certificates
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Authenticate any NESA Africa certificate using our verification portal. 
              Enter the certificate code to confirm its validity.
            </p>
            <Link
              to="/certificates/verify"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-charcoal font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Verify Certificate
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

// Winners Grid Component
interface WinnersGridProps {
  winners: Winner[];
  allWinners: Winner[];
  getInitials: (name: string) => string;
  getWinnerTier: (winner: Winner, index: number, categoryWinners: Winner[]) => string;
}

function WinnersGrid({ winners, allWinners, getInitials, getWinnerTier }: WinnersGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {winners.map((winner, index) => {
        const globalIndex = allWinners.findIndex(w => w.id === winner.id);
        const tier = getWinnerTier(winner, globalIndex, allWinners);
        const tierConfig = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
        const TierIcon = tierConfig?.icon || Trophy;

        return (
          <Card 
            key={winner.id} 
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-gold/30"
          >
            {/* Tier Banner */}
            <div className={`bg-gradient-to-r ${tierConfig?.gradient || 'from-gold to-amber-600'} px-4 py-2 flex items-center gap-2`}>
              <TierIcon className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">{tierConfig?.label || 'Winner'}</span>
              {globalIndex < 9 && (
                <Badge className="ml-auto bg-white/20 text-white border-white/30 text-xs">
                  #{globalIndex + 1}
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-gold/20">
                  <AvatarImage src={winner.photo_url || ""} alt={winner.name} />
                  <AvatarFallback className="bg-gold/10 text-gold font-semibold">
                    {getInitials(winner.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/nominees/${encodeURIComponent(winner.slug)}`}
                    className="font-semibold text-foreground hover:text-gold transition-colors line-clamp-1"
                  >
                    {winner.name}
                  </Link>
                  
                  {winner.title && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{winner.title}</p>
                  )}

                  {winner.organization && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span className="line-clamp-1">{winner.organization}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category & Stats */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="secondary" className="font-normal">
                    {winner.subcategories.categories.name}
                  </Badge>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-gold" />
                      {winner.public_votes}
                    </span>
                    {winner.jury_score > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-blue-400" />
                        {winner.jury_score.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {winner.subcategories.chapters && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {winner.subcategories.chapters.region || winner.subcategories.chapters.country}
                  </p>
                )}
              </div>

              {/* View Profile Link */}
              <Link
                to={`/nominees/${encodeURIComponent(winner.slug)}`}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-gold hover:text-gold-dark transition-colors"
              >
                View Profile
                <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
