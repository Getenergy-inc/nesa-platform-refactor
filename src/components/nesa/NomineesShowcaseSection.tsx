import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Youtube, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Play, 
  ChevronRight,
  Users,
  Award
} from "lucide-react";
import { NESALogo } from "@/components/nesa/NESALogo";

// Social media links for NESA Africa TV
const socialLinks = [
  { icon: Youtube, href: "https://youtube.com/@nesaafricatv", label: "YouTube", color: "hover:text-red-500" },
  { icon: Linkedin, href: "https://linkedin.com/company/nesa-africa", label: "LinkedIn", color: "hover:text-blue-500" },
  { icon: Twitter, href: "https://twitter.com/nesaafrica", label: "Twitter", color: "hover:text-sky-400" },
  { icon: Instagram, href: "https://instagram.com/nesaafrica", label: "Instagram", color: "hover:text-pink-500" },
];

interface Nominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  logo_url: string | null;
  country: string | null;
  region: string | null;
  public_votes: number | null;
  subcategory_id: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export function NomineesShowcaseSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch approved nominees
  const { data: nominees, isLoading: loadingNominees } = useQuery({
    queryKey: ["showcase-nominees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select("*")
        .in("status", ["approved", "platinum"])
        .order("public_votes", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as Nominee[];
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["showcase-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch subcategories
  const { data: subcategories } = useQuery({
    queryKey: ["showcase-subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data as Subcategory[];
    },
  });

  // Create lookup maps
  const subcategoryMap = useMemo(() => {
    if (!subcategories) return {};
    return subcategories.reduce((acc, sub) => {
      acc[sub.id] = sub;
      return acc;
    }, {} as Record<string, Subcategory>);
  }, [subcategories]);

  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<string, Category>);
  }, [categories]);

  // Filter nominees by selected category
  const filteredNominees = useMemo(() => {
    if (!nominees) return [];
    if (selectedCategory === "all") return nominees;
    
    return nominees.filter((nominee) => {
      const sub = subcategoryMap[nominee.subcategory_id];
      return sub && sub.category_id === selectedCategory;
    });
  }, [nominees, selectedCategory, subcategoryMap]);

  // Group nominees by subcategory
  const groupedNominees = useMemo(() => {
    const groups: Record<string, { subcategory: Subcategory; category: Category; nominees: Nominee[] }> = {};
    
    filteredNominees.forEach((nominee) => {
      const sub = subcategoryMap[nominee.subcategory_id];
      if (!sub) return;
      
      const cat = categoryMap[sub.category_id];
      if (!cat) return;
      
      if (!groups[sub.id]) {
        groups[sub.id] = { subcategory: sub, category: cat, nominees: [] };
      }
      groups[sub.id].nominees.push(nominee);
    });
    
    return Object.values(groups);
  }, [filteredNominees, subcategoryMap, categoryMap]);

  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold/50 to-gold" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
            <Users className="w-3 h-3 mr-1" />
            Digital Nominees Board
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Meet Our <span className="text-gold">Changemakers</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-6">
            Celebrating Africa's education champions making extraordinary impact across the continent.
          </p>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-white/50 text-sm">Watch on NESA Africa TV:</span>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 ${social.color} transition-all border border-white/10 hover:border-gold/30 hover:bg-gold/10`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Filter Tabs */}
        {categories && categories.length > 0 && (
          <div className="mb-8 overflow-x-auto scrollbar-hide">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="inline-flex h-auto p-1 bg-white/5 rounded-full mx-auto">
                <TabsTrigger 
                  value="all" 
                  className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                >
                  All Categories
                </TabsTrigger>
                {categories.slice(0, 6).map((cat) => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-gold data-[state=active]:text-charcoal"
                  >
                    {cat.name.length > 20 ? cat.name.substring(0, 20) + "..." : cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Nominees Grid */}
        {loadingNominees ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredNominees.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-gold/20">
            <Award className="h-16 w-16 text-gold/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Nominees Yet</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Be the first to nominate a changemaker and help recognize Africa's education heroes!
            </p>
            <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8">
              <Link to="/nominate">
                Be the First to Nominate
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {groupedNominees.length > 0 ? (
                <div className="space-y-10">
                  {groupedNominees.map((group) => (
                    <div key={group.subcategory.id}>
                      {/* Subcategory Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-1 bg-gold rounded-full" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{group.subcategory.name}</h3>
                          <p className="text-sm text-gold/70">{group.category.name}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto text-white/60 border-white/20">
                          {group.nominees.length} Nominees
                        </Badge>
                      </div>

                      {/* Nominees Row */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {group.nominees.map((nominee, index) => (
                          <NomineeCard key={nominee.id} nominee={nominee} index={index} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredNominees.map((nominee, index) => (
                    <NomineeCard key={nominee.id} nominee={nominee} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* View All Button */}
        {filteredNominees.length > 0 && (
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button asChild variant="outline" size="lg" className="border-gold text-gold hover:bg-gold/10 rounded-full">
              <Link to="/nominees">
                View All Nominees
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Individual Nominee Card
function NomineeCard({ nominee, index }: { nominee: Nominee; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/nominees/${nominee.slug}`}
        className="group block bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-gold/40 transition-all duration-300 hover:bg-white/10"
      >
        {/* NESA Badge */}
        <div className="absolute top-2 left-2 z-10">
          <NESALogo variant="icon" size="sm" className="h-6 w-6 opacity-70" />
        </div>

        {/* Photo/Logo */}
        <div className="relative mb-3">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gold/10 border-2 border-gold/30 group-hover:border-gold transition-colors">
            {nominee.photo_url || nominee.logo_url ? (
              <img 
                src={nominee.photo_url || nominee.logo_url || ""} 
                alt={nominee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gold text-xl font-bold">
                {nominee.name.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Play Icon for video link */}
          <a
            href="https://youtube.com/@nesaafricatv"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute -bottom-1 right-1/2 translate-x-1/2 h-6 w-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <Play className="h-3 w-3 text-white fill-white" />
          </a>
        </div>

        {/* Name */}
        <h4 className="text-sm font-semibold text-white text-center truncate group-hover:text-gold transition-colors">
          {nominee.name}
        </h4>

        {/* Title/Organization */}
        <p className="text-xs text-white/50 text-center truncate mt-1">
          {nominee.title || nominee.organization || "Education Champion"}
        </p>

        {/* Short Bio */}
        {nominee.bio && (
          <p className="text-xs text-white/40 text-center line-clamp-2 mt-2">
            {nominee.bio.substring(0, 80)}...
          </p>
        )}

        {/* Country Badge */}
        {nominee.country && (
          <div className="mt-3 flex justify-center">
            <Badge variant="outline" className="text-[10px] text-white/50 border-white/20">
              {nominee.country}
            </Badge>
          </div>
        )}

        {/* Vote Count */}
        {nominee.public_votes && nominee.public_votes > 0 && (
          <div className="mt-2 text-center">
            <span className="text-xs text-gold">{nominee.public_votes} votes</span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default NomineesShowcaseSection;
