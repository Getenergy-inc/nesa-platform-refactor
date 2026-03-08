/**
 * CategoryNomineesDirectory
 * Fetches and displays all approved nominees for a given category,
 * grouped by subcategory with tabs/accordion/scroll views.
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users, Award, ExternalLink, ThumbsUp, UserPlus, Trophy,
  ChevronDown, ChevronUp, Vote,
} from "lucide-react";
import { NomineeActions } from "@/components/nominees";
import { cn } from "@/lib/utils";

interface CategoryNominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  photo_url: string | null;
  is_platinum: boolean;
  public_votes: number;
  renomination_count: number;
  country: string | null;
  subcategory_id: string | null;
}

interface SubcategoryInfo {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categoryTitle: string;
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function CategoryNomineesDirectory({ categoryTitle }: Props) {
  const [activeSubcat, setActiveSubcat] = useState<string>("all");
  const [expandedSubcats, setExpandedSubcats] = useState<Set<string>>(new Set());

  // 1. Find the DB category by name match
  const { data: dbCategory } = useQuery({
    queryKey: ["db-category", categoryTitle],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug")
        .ilike("name", `%${categoryTitle}%`)
        .limit(1)
        .maybeSingle();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // 2. Get subcategories for this category
  const { data: subcategories } = useQuery({
    queryKey: ["db-subcategories", dbCategory?.id],
    queryFn: async () => {
      if (!dbCategory?.id) return [];
      const { data } = await supabase
        .from("subcategories")
        .select("id, name, slug")
        .eq("category_id", dbCategory.id)
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      return (data || []) as SubcategoryInfo[];
    },
    enabled: !!dbCategory?.id,
    staleTime: 10 * 60 * 1000,
  });

  // 3. Fetch nominees for all subcategories at once
  const { data: nominees, isLoading } = useQuery({
    queryKey: ["category-nominees", dbCategory?.id],
    queryFn: async () => {
      if (!subcategories || subcategories.length === 0) return [];
      const subcatIds = subcategories.map(s => s.id);
      const { data } = await supabase
        .from("nominees")
        .select("id, name, slug, title, organization, photo_url, is_platinum, public_votes, renomination_count, country, subcategory_id")
        .in("subcategory_id", subcatIds)
        .in("status", ["approved", "platinum"])
        .order("public_votes", { ascending: false });
      return (data || []) as CategoryNominee[];
    },
    enabled: !!subcategories && subcategories.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  // Build subcategory → nominees map
  const subcatMap = useMemo(() => {
    const map = new Map<string, CategoryNominee[]>();
    if (!nominees) return map;
    nominees.forEach(n => {
      const key = n.subcategory_id || "uncategorized";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(n);
    });
    return map;
  }, [nominees]);

  const subcatLookup = useMemo(() => {
    const map = new Map<string, SubcategoryInfo>();
    subcategories?.forEach(s => map.set(s.id, s));
    return map;
  }, [subcategories]);

  const totalNominees = nominees?.length || 0;

  // Filter by active tab
  const displayNominees = useMemo(() => {
    if (activeSubcat === "all") return nominees || [];
    return subcatMap.get(activeSubcat) || [];
  }, [activeSubcat, nominees, subcatMap]);

  const toggleExpand = (subcatId: string) => {
    setExpandedSubcats(prev => {
      const next = new Set(prev);
      next.has(subcatId) ? next.delete(subcatId) : next.add(subcatId);
      return next;
    });
  };

  if (!dbCategory || isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (totalNominees === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Users className="h-12 w-12 mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Nominees Yet</h3>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Be the first to nominate someone in this category.
          </p>
          <Button asChild className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full gap-2">
            <Link to="/nominate">
              <Trophy className="h-4 w-4" />
              Nominate Now
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
              Nominees in This Category
            </h2>
            <p className="text-white/50 text-sm">
              <Users className="h-4 w-4 inline mr-1" />
              {totalNominees} approved nominees across {subcategories?.length || 0} subcategories
            </p>
          </div>
          <Link to={`/nominees?category=${dbCategory.slug}`}>
            <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10 rounded-full gap-1">
              View Full Directory
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Subcategory Tabs */}
        {subcategories && subcategories.length > 1 && (
          <div className="mb-8 overflow-x-auto scrollbar-hide">
            <Tabs value={activeSubcat} onValueChange={setActiveSubcat}>
              <TabsList className="bg-white/[0.04] border border-white/[0.08] h-auto flex-wrap gap-1 p-1">
                <TabsTrigger
                  value="all"
                  className="text-xs rounded-full data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
                >
                  All ({totalNominees})
                </TabsTrigger>
                {subcategories.map(s => {
                  const count = subcatMap.get(s.id)?.length || 0;
                  return (
                    <TabsTrigger
                      key={s.id}
                      value={s.id}
                      className="text-xs rounded-full data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
                    >
                      {s.name.length > 35 ? s.name.slice(0, 35) + "…" : s.name}
                      {count > 0 && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0 h-4">
                          {count}
                        </Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Nominees: Grouped by Subcategory when "All" is active */}
        {activeSubcat === "all" ? (
          <div className="space-y-10">
            {subcategories?.map(subcat => {
              const subcatNominees = subcatMap.get(subcat.id);
              if (!subcatNominees || subcatNominees.length === 0) return null;

              const isExpanded = expandedSubcats.has(subcat.id);
              const shown = isExpanded ? subcatNominees : subcatNominees.slice(0, 6);

              return (
                <div key={subcat.id}>
                  {/* Subcategory header */}
                  <div className="flex items-center gap-3 mb-4 border-b border-white/[0.06] pb-3">
                    <Award className="h-4 w-4 text-gold shrink-0" />
                    <h3 className="font-semibold text-white text-base">{subcat.name}</h3>
                    <Badge variant="outline" className="text-[10px] border-white/20 text-white/50">
                      {subcatNominees.length} nominees
                    </Badge>
                  </div>

                  {/* Nominee Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {shown.map((nominee, i) => (
                      <NomineeRow
                        key={nominee.id}
                        nominee={nominee}
                        categoryName={categoryTitle}
                        subcategoryName={subcat.name}
                        index={i}
                      />
                    ))}
                  </div>

                  {subcatNominees.length > 6 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 text-xs text-white/40 hover:text-gold"
                      onClick={() => toggleExpand(subcat.id)}
                    >
                      {isExpanded ? (
                        <><ChevronUp className="h-3 w-3 mr-1" /> Show Less</>
                      ) : (
                        <><ChevronDown className="h-3 w-3 mr-1" /> Show All {subcatNominees.length}</>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Single subcategory view */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayNominees.map((nominee, i) => {
              const subcat = subcatLookup.get(nominee.subcategory_id || "");
              return (
                <NomineeRow
                  key={nominee.id}
                  nominee={nominee}
                  categoryName={categoryTitle}
                  subcategoryName={subcat?.name}
                  index={i}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Individual Nominee Row Card ─── */

function NomineeRow({
  nominee, categoryName, subcategoryName, index,
}: {
  nominee: CategoryNominee;
  categoryName?: string;
  subcategoryName?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/nominees/${encodeURIComponent(nominee.slug)}`}
        className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-gold/30 hover:bg-white/[0.06] transition-all"
      >
        <Avatar className="h-11 w-11 border border-white/10 shrink-0">
          <AvatarImage src={nominee.photo_url || undefined} alt={nominee.name} />
          <AvatarFallback className="bg-gold/10 text-gold text-sm">
            {getInitials(nominee.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm text-white group-hover:text-gold transition-colors truncate">
              {nominee.name}
            </span>
            {nominee.is_platinum && (
              <Award className="h-3 w-3 text-amber-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
            {nominee.country && <span className="truncate">{nominee.country}</span>}
            <span className="shrink-0 flex items-center gap-0.5">
              <ThumbsUp className="h-3 w-3" />
              {nominee.public_votes}
            </span>
            {nominee.renomination_count > 0 && (
              <span className="shrink-0 flex items-center gap-0.5">
                <UserPlus className="h-3 w-3" />
                {nominee.renomination_count}
              </span>
            )}
          </div>
        </div>

        <ExternalLink className="h-3.5 w-3.5 text-white/20 group-hover:text-gold shrink-0 transition-colors" />
      </Link>
    </motion.div>
  );
}
