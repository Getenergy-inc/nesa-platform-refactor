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
   Gift,
   Award,
   Calendar,
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Card, CardContent } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { StageGate } from "@/components/StageGate";
 import { NomineeCard, type NomineeCardData } from "@/components/nesa/NomineeCard";
import { VoteModal } from "@/components/nominees/VoteModal";
import { VotingStatsStrip } from "@/components/voting/VotingStatsStrip";
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
 
 const REGIONS = [
   { value: "all", label: "All Regions" },
   { value: "West Africa", label: "West Africa" },
   { value: "East Africa", label: "East Africa" },
   { value: "Southern Africa", label: "Southern Africa" },
   { value: "North Africa", label: "North Africa" },
   { value: "Central Africa", label: "Central Africa" },
 ];
 
 export default function GoldVoting() {
   const { currentEdition } = useSeason();
   const { user } = useAuth();
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("all");
   const [selectedRegion, setSelectedRegion] = useState("all");
   const [voteModalOpen, setVoteModalOpen] = useState(false);
   const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
 
   // Fetch wallet balance
   const { data: walletData } = useQuery({
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
 
   const agcBalance = walletData?.balanceAgc || 0;
 
   // Fetch categories
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
     queryKey: ["nominees-for-gold-voting"],
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
 
   // Fetch user's votes
   const { data: userVotes = [] } = useQuery({
     queryKey: ["user-votes-gold", user?.id],
     queryFn: async () => {
       if (!user) return [];
       const { data, error } = await supabase
         .from("votes")
         .select("nominee_id")
         .eq("voter_id", user.id)
         .eq("vote_type", "public");
       if (error) throw error;
       return data?.map((v) => v.nominee_id) || [];
     },
     enabled: !!user,
   });
 
   // Filter nominees
   const filteredNominees = useMemo(() => {
     return nominees.filter((nominee) => {
       const matchesSearch =
         searchQuery === "" ||
         nominee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         nominee.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         nominee.subcategories.name.toLowerCase().includes(searchQuery.toLowerCase());
       const matchesCategory =
         selectedCategory === "all" || nominee.subcategories.categories.slug === selectedCategory;
       const matchesRegion =
         selectedRegion === "all" || nominee.subcategories.chapters?.region === selectedRegion;
       return matchesSearch && matchesCategory && matchesRegion;
     });
   }, [nominees, searchQuery, selectedCategory, selectedRegion]);
 
   // Group by category
   const nomineesByCategory = useMemo(() => {
     const grouped: Record<string, Nominee[]> = {};
     filteredNominees.forEach((nominee) => {
       const catSlug = nominee.subcategories.categories.slug;
       if (!grouped[catSlug]) grouped[catSlug] = [];
       grouped[catSlug].push(nominee);
     });
     return grouped;
   }, [filteredNominees]);
 
   const handleVoteClick = (nominee: Nominee) => {
     setSelectedNominee(nominee);
     setVoteModalOpen(true);
   };
 
   const handleVoteSuccess = () => {
     refetch();
     toast.success("Vote cast successfully!");
   };
 
   return (
     <>
       <Helmet>
         <title>{`Gold Certificate Voting | ${currentEdition?.name || 'NESA-Africa 2025'}`}</title>
         <meta
           name="description"
           content={`Vote for Gold Certificate nominees in ${currentEdition.name}. 100% public voting to recognize Africa's education champions.`}
         />
       </Helmet>
 
       <main className="min-h-screen bg-background">
         {/* Hero */}
         <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 py-16 md:py-24">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.2),transparent_50%)]" />
           <div className="container relative">
             <div className="mx-auto max-w-3xl text-center">
               <Badge className="mb-4 bg-amber-400/20 text-amber-200 border-amber-400/30">
                 <Award className="mr-2 h-3 w-3" />
                 Phase 4 • 100% Public Voting
               </Badge>
               <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                 <span className="text-amber-400">Gold Certificate</span> Voting
               </h1>
               <p className="text-amber-100/80 text-lg mb-2">
                 Recognize excellence through public acclaim
               </p>
               <p className="text-amber-100/60 text-sm mb-6">
                 <span className="font-semibold text-amber-300">1 vote = 1 AGC</span> • Your vote directly determines the winners
               </p>
 
               {/* Wallet & Actions */}
               <div className="flex flex-wrap justify-center gap-3 mb-6">
                 {user && (
                   <Badge variant="outline" className="px-4 py-2 border-amber-400/50 text-amber-200">
                     <Wallet className="mr-2 h-4 w-4" />
                     {agcBalance} AGC Available
                   </Badge>
                 )}
               </div>
               <div className="flex flex-wrap justify-center gap-3">
                 <Button asChild variant="outline" className="border-amber-400/30 text-amber-200 hover:bg-amber-400/10">
                   <Link to="/wallet">
                     <Wallet className="mr-2 h-4 w-4" />
                     View Wallet
                   </Link>
                 </Button>
                 <Button asChild className="bg-amber-400 hover:bg-amber-500 text-amber-950">
                   <Link to="/earn-voting-credits">
                     <Sparkles className="mr-2 h-4 w-4" />
                     Earn AGC
                   </Link>
                 </Button>
                 <Button asChild variant="outline" className="border-amber-400/30 text-amber-200 hover:bg-amber-400/10">
                   <Link to="/claim-voting-credits">
                     <Gift className="mr-2 h-4 w-4" />
                     Claim Credits
                   </Link>
                 </Button>
               </div>
             </div>
           </div>
         </section>
 
        {/* Info Banner with Live Counts */}
        <VotingStatsStrip variant="amber" />

        {/* Voting Section */}
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
                 <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30">
                   <CardContent className="p-4 flex items-center gap-3">
                     <div className="p-2 rounded-full bg-amber-200 dark:bg-amber-900/50">
                       <Users className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                     </div>
                     <div>
                       <p className="text-2xl font-bold">{nominees.length}</p>
                       <p className="text-sm text-muted-foreground">Nominees</p>
                     </div>
                   </CardContent>
                 </Card>
                 <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30">
                   <CardContent className="p-4 flex items-center gap-3">
                     <div className="p-2 rounded-full bg-amber-200 dark:bg-amber-900/50">
                       <Trophy className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                     </div>
                     <div>
                       <p className="text-2xl font-bold">{categories.length}</p>
                       <p className="text-sm text-muted-foreground">Categories</p>
                     </div>
                   </CardContent>
                 </Card>
                 <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30">
                   <CardContent className="p-4 flex items-center gap-3">
                     <div className="p-2 rounded-full bg-amber-200 dark:bg-amber-900/50">
                       <ThumbsUp className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                     </div>
                     <div>
                       <p className="text-2xl font-bold">
                         {nominees.reduce((sum, n) => sum + (n.public_votes || 0), 0)}
                       </p>
                       <p className="text-sm text-muted-foreground">Total Votes</p>
                     </div>
                   </CardContent>
                 </Card>
                 <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30">
                   <CardContent className="p-4 flex items-center gap-3">
                     <div className="p-2 rounded-full bg-amber-200 dark:bg-amber-900/50">
                       <VoteIcon className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                     </div>
                     <div>
                       <p className="text-2xl font-bold">{userVotes.length}</p>
                       <p className="text-sm text-muted-foreground">Your Votes</p>
                     </div>
                   </CardContent>
                 </Card>
               </div>
 
               {/* Loading */}
               {isLoading && (
                 <div className="flex flex-col items-center justify-center py-16">
                   <Loader2 className="h-8 w-8 animate-spin text-amber-600 mb-4" />
                   <p className="text-muted-foreground">Loading nominees...</p>
                 </div>
               )}
 
               {/* Empty */}
               {!isLoading && filteredNominees.length === 0 && (
                 <Card className="border-dashed">
                   <CardContent className="flex flex-col items-center justify-center py-16">
                     <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                     <h3 className="text-lg font-semibold mb-2">No Nominees Found</h3>
                     <p className="text-muted-foreground text-center max-w-md mb-4">
                       {searchQuery || selectedCategory !== "all" || selectedRegion !== "all"
                         ? "Try adjusting your filters."
                         : "No approved nominees available."}
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
                     <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                       All ({filteredNominees.length})
                     </TabsTrigger>
                     {Object.entries(nomineesByCategory).map(([catSlug, catNominees]) => {
                       const category = categories.find((c) => c.slug === catSlug);
                       return (
                         <TabsTrigger
                           key={catSlug}
                           value={catSlug}
                           className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                         >
                           {category?.name || catSlug} ({catNominees.length})
                         </TabsTrigger>
                       );
                     })}
                   </TabsList>
 
                   <TabsContent value="all">
                     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                       {filteredNominees.map((nominee) => {
                         const hasVoted = userVotes.includes(nominee.id);
                          const cardData: NomineeCardData = {
                            id: nominee.id,
                            name: nominee.name,
                            slug: nominee.slug,
                            title: nominee.title,
                            photoUrl: nominee.photo_url,
                            categoryName: nominee.subcategories.categories.name,
                            subcategoryName: nominee.subcategories.name,
                            publicVotes: nominee.public_votes || 0,
                            organization: nominee.organization,
                          };
                         return (
                           <div key={nominee.id} className="relative">
                             <NomineeCard nominee={cardData} variant="voting" />
                             <div className="mt-3">
                               <Button
                                 onClick={() => handleVoteClick(nominee)}
                                 disabled={hasVoted}
                                 className={hasVoted 
                                   ? "w-full bg-green-600 hover:bg-green-600 text-white"
                                   : "w-full bg-amber-500 hover:bg-amber-600 text-white"
                                 }
                               >
                                 {hasVoted ? "Voted ✓" : "Vote Now"}
                               </Button>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </TabsContent>
 
                   {Object.entries(nomineesByCategory).map(([catSlug, catNominees]) => (
                     <TabsContent key={catSlug} value={catSlug}>
                       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                         {catNominees.map((nominee) => {
                           const hasVoted = userVotes.includes(nominee.id);
                            const cardData: NomineeCardData = {
                              id: nominee.id,
                              name: nominee.name,
                              slug: nominee.slug,
                              title: nominee.title,
                              photoUrl: nominee.photo_url,
                              categoryName: nominee.subcategories.categories.name,
                              subcategoryName: nominee.subcategories.name,
                              publicVotes: nominee.public_votes || 0,
                              organization: nominee.organization,
                            };
                           return (
                             <div key={nominee.id} className="relative">
                               <NomineeCard nominee={cardData} variant="voting" />
                               <div className="mt-3">
                                 <Button
                                   onClick={() => handleVoteClick(nominee)}
                                   disabled={hasVoted}
                                   className={hasVoted 
                                     ? "w-full bg-green-600 hover:bg-green-600 text-white"
                                     : "w-full bg-amber-500 hover:bg-amber-600 text-white"
                                   }
                                 >
                                   {hasVoted ? "Voted ✓" : "Vote Now"}
                                 </Button>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     </TabsContent>
                   ))}
                 </Tabs>
               )}
             </StageGate>
           </div>
         </section>
 
         {/* Other voting option */}
         <section className="py-12 bg-muted/30">
           <div className="container text-center">
             <h2 className="text-2xl font-bold mb-4">Looking for Blue Garnet Voting?</h2>
             <p className="text-muted-foreground mb-6">
               Blue Garnet Award combines 40% public votes with 60% jury evaluation for the highest honor.
             </p>
             <Button asChild variant="outline" size="lg">
               <Link to="/vote/blue-garnet">
                 Go to Blue Garnet Voting
               </Link>
             </Button>
           </div>
         </section>
       </main>
 
       {/* Vote Modal */}
       {selectedNominee && (
         <VoteModal
           open={voteModalOpen}
           onOpenChange={setVoteModalOpen}
           nomineeId={selectedNominee.id}
           nomineeName={selectedNominee.name}
           nomineeSlug={selectedNominee.slug}
           awardTitle="Gold Certificate"
           subcategoryTitle={selectedNominee.subcategories.name}
           onVoteSuccess={handleVoteSuccess}
         />
       )}
     </>
   );
 }