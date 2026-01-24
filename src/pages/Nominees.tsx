import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSeason } from "@/contexts/SeasonContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Award,
  Building,
  ExternalLink,
  Filter,
  Grid3X3,
  List
} from "lucide-react";

interface Nominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  is_platinum: boolean;
  public_votes: number;
  status: string;
  subcategory: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export default function Nominees() {
  const { currentEdition } = useSeason();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch approved nominees
  const { data: nominees = [], isLoading } = useQuery({
    queryKey: ["nominees", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select(`
          id,
          name,
          slug,
          title,
          organization,
          bio,
          photo_url,
          is_platinum,
          public_votes,
          status,
          subcategory:subcategories (
            id,
            name,
            category:categories (
              id,
              name,
              slug
            )
          )
        `)
        .in("status", ["approved", "platinum"])
        .order("public_votes", { ascending: false });

      if (error) throw error;

      return (data || []).map((n: any) => ({
        ...n,
        subcategory: {
          ...n.subcategory,
          category: n.subcategory?.category || { id: "", name: "Uncategorized", slug: "" }
        }
      })) as Nominee[];
    },
  });

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "active"],
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

  // Filter nominees
  const filteredNominees = useMemo(() => {
    return nominees.filter((nominee) => {
      const matchesSearch = searchQuery === "" ||
        nominee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (nominee.organization?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === "all" ||
        nominee.subcategory?.category?.id === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [nominees, searchQuery, categoryFilter]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Helmet>
        <title>Nominees Directory | {currentEdition.name}</title>
        <meta
          name="description"
          content={`Browse all approved nominees for ${currentEdition.name}. Discover Africa's changemakers in education.`}
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal py-16 sm:py-20">
          <div className="container">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Categories</span>
            </Link>

            <div className="max-w-3xl">
              <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                <Users className="h-3 w-3 mr-1" />
                {currentEdition.displayYear} Nominees
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Nominee <span className="text-gold">Directory</span>
              </h1>
              <p className="text-white/70 text-lg">
                Explore the verified nominees shaping the future of African education. 
                Each individual and organization has been validated by our Nominee Review Committee.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              <Card className="bg-charcoal-light border-gold/10">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-gold">{nominees.length}</p>
                  <p className="text-white/60 text-sm">Total Nominees</p>
                </CardContent>
              </Card>
              <Card className="bg-charcoal-light border-gold/10">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-gold">
                    {nominees.filter(n => n.is_platinum).length}
                  </p>
                  <p className="text-white/60 text-sm">Platinum Certified</p>
                </CardContent>
              </Card>
              <Card className="bg-charcoal-light border-gold/10">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-gold">{categories.length}</p>
                  <p className="text-white/60 text-sm">Categories</p>
                </CardContent>
              </Card>
              <Card className="bg-charcoal-light border-gold/10">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-gold">
                    {nominees.reduce((sum, n) => sum + (n.public_votes || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-white/60 text-sm">Total Votes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-6 border-b border-gold/10">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search nominees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-charcoal-light border-gold/20 text-white placeholder:text-white/40"
                  />
                </div>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 bg-charcoal-light border-gold/20 text-white">
                    <Filter className="h-4 w-4 mr-2 text-gold" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-gold/20">
                    <SelectItem value="all" className="text-white hover:bg-gold/10">
                      All Categories
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="text-white hover:bg-gold/10"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-gold text-charcoal" : "border-gold/30 text-gold"}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-gold text-charcoal" : "border-gold/30 text-gold"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Nominees Grid/List */}
        <section className="py-12 sm:py-16">
          <div className="container">
            {isLoading ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="bg-charcoal-light border-gold/10">
                    <CardContent className="p-6">
                      <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNominees.length === 0 ? (
              <Card className="bg-charcoal-light border-gold/10 max-w-md mx-auto">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-gold/30 mx-auto mb-4" />
                  <p className="text-white/70">No nominees found matching your criteria.</p>
                  <Button
                    variant="link"
                    className="text-gold mt-2"
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNominees.map((nominee) => (
                  <Link key={nominee.id} to={`/nominees/${nominee.slug}`}>
                    <Card className="bg-charcoal-light border-gold/10 hover:border-gold/30 transition-all duration-300 group h-full">
                      <CardContent className="p-6 text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-gold/20 group-hover:border-gold/50 transition-colors">
                          <AvatarImage src={nominee.photo_url || undefined} alt={nominee.name} />
                          <AvatarFallback className="bg-gold/20 text-gold text-lg font-bold">
                            {getInitials(nominee.name)}
                          </AvatarFallback>
                        </Avatar>

                        {nominee.is_platinum && (
                          <Badge className="mb-3 bg-gradient-to-r from-slate-400 to-slate-300 text-slate-800 border-0">
                            <Award className="h-3 w-3 mr-1" />
                            Platinum
                          </Badge>
                        )}

                        <h3 className="font-display text-lg font-semibold text-white group-hover:text-gold transition-colors mb-1">
                          {nominee.name}
                        </h3>

                        {nominee.title && (
                          <p className="text-white/60 text-sm mb-2">{nominee.title}</p>
                        )}

                        {nominee.organization && (
                          <div className="flex items-center justify-center gap-1 text-white/50 text-xs mb-3">
                            <Building className="h-3 w-3" />
                            <span>{nominee.organization}</span>
                          </div>
                        )}

                        <Badge variant="outline" className="text-xs border-gold/20 text-gold/80">
                          {nominee.subcategory?.category?.name || "Uncategorized"}
                        </Badge>

                        <div className="mt-4 pt-4 border-t border-gold/10">
                          <p className="text-gold font-semibold">
                            {nominee.public_votes?.toLocaleString() || 0} votes
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNominees.map((nominee) => (
                  <Link key={nominee.id} to={`/nominees/${nominee.slug}`}>
                    <Card className="bg-charcoal-light border-gold/10 hover:border-gold/30 transition-all duration-300 group">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-gold/20 group-hover:border-gold/50 transition-colors shrink-0">
                          <AvatarImage src={nominee.photo_url || undefined} alt={nominee.name} />
                          <AvatarFallback className="bg-gold/20 text-gold font-bold">
                            {getInitials(nominee.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-semibold text-white group-hover:text-gold transition-colors truncate">
                              {nominee.name}
                            </h3>
                            {nominee.is_platinum && (
                              <Badge className="bg-gradient-to-r from-slate-400 to-slate-300 text-slate-800 border-0 shrink-0">
                                <Award className="h-3 w-3 mr-1" />
                                Platinum
                              </Badge>
                            )}
                          </div>
                          <p className="text-white/60 text-sm truncate">
                            {nominee.title}
                            {nominee.organization && ` at ${nominee.organization}`}
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs border-gold/20 text-gold/80">
                            {nominee.subcategory?.category?.name || "Uncategorized"}
                          </Badge>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-gold font-semibold text-lg">
                            {nominee.public_votes?.toLocaleString() || 0}
                          </p>
                          <p className="text-white/50 text-xs">votes</p>
                        </div>

                        <ExternalLink className="h-4 w-4 text-gold/50 group-hover:text-gold transition-colors shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            <p className="text-white/50 text-sm mt-8 text-center">
              Showing {filteredNominees.length} of {nominees.length} nominees
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 border-t border-gold/10">
          <div className="container text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              Know Someone Making a Difference?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Nominate an individual or organization that's transforming African education.
            </p>
            <Link to="/nominate">
              <Button size="lg" className="bg-gold hover:bg-gold-light text-charcoal font-semibold">
                <Award className="h-4 w-4 mr-2" />
                Submit a Nomination
              </Button>
            </Link>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
