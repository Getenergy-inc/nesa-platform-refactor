/**
 * Lightweight Category Explorer for Landing Page
 * Replaces heavy LandingNomineeShowcase — no nominee data loaded.
 * Links users to category pages where full nominee listings live.
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, Trophy, Crown, Shield, Star, GraduationCap, Users, ArrowRight,
} from "lucide-react";
import {
  getCategoriesGrouped,
  type CategoryDefinition,
} from "@/config/nesaCategories";
import { categoryIconMap } from "@/config/categoryIconMap";
import { getCategoryImage } from "@/config/categoryImages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch aggregate nominee counts per category slug — single lightweight query
function useNomineeCounts() {
  return useQuery({
    queryKey: ["nominee-counts-by-category"],
    queryFn: async () => {
      const { data } = await supabase
        .from("public_nominees")
        .select("id, subcategory_id")
        .in("status", ["approved", "platinum", "pending"]);

      if (!data) return new Map<string, number>();

      // We count total nominees — category pages will break down by subcategory
      const counts = new Map<string, number>();
      // We don't have category slug directly, so count total as a general metric
      counts.set("__total", data.length);
      return counts;
    },
    staleTime: 5 * 60 * 1000,
  });
}

const groups = getCategoriesGrouped();

const tierConfig = [
  {
    key: "lifetime" as const,
    icon: Crown,
    title: "Lifetime Achievement",
    subtitle: "Africa Education Icon · Jury Selection",
    color: "bg-purple-600",
    borderColor: "border-purple-500/30",
  },
  {
    key: "blueGarnet" as const,
    icon: Trophy,
    title: "Blue Garnet — Competitive Excellence",
    subtitle: "Public Voting + Jury Evaluation",
    color: "bg-blue-600",
    borderColor: "border-blue-500/30",
  },
  {
    key: "platinum" as const,
    icon: Shield,
    title: "Platinum — Institutional Leadership",
    subtitle: "NRC Verification · Governance Criteria",
    color: "bg-slate-500",
    borderColor: "border-slate-400/30",
  },
  {
    key: "goldSpecial" as const,
    icon: Star,
    title: "Gold Special Recognition — 2025",
    subtitle: "Cultural Impact Recognition",
    color: "bg-yellow-600",
    borderColor: "border-yellow-500/30",
  },
];

function CategoryLink({ cat }: { cat: CategoryDefinition }) {
  const Icon = categoryIconMap[cat.iconName] || GraduationCap;
  const catImage = getCategoryImage(cat.slug);

  return (
    <Link
      to={`/categories/${cat.slug}`}
      className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-gold/40 hover:bg-white/[0.06] transition-all duration-300"
    >
      {catImage ? (
        <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
          <img src={catImage} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="h-12 w-12 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-gold/70" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors truncate">
          {cat.shortName}
        </h4>
        <p className="text-xs text-white/40">
          {cat.subcategories.length} subcategories
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}

export function LandingCategoryExplorer() {
  const { data: counts } = useNomineeCounts();
  const totalNominees = counts?.get("__total") || 0;

  return (
    <section id="nominees" className="bg-charcoal py-16 md:py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
            Explore Nominees
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Discover Africa's Education Leaders
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-3">
            Browse nominees by award category. Each category page shows all nominees with their subcategories — nominate, re-nominate, or vote.
          </p>
          {totalNominees > 0 && (
            <div className="inline-flex items-center gap-2 text-gold text-sm font-medium">
              <Users className="h-4 w-4" />
              {totalNominees.toLocaleString()} nominees across all categories
            </div>
          )}
        </motion.div>

        {/* Tier Groups */}
        <div className="space-y-10">
          {tierConfig.map((tier) => {
            const cats = groups[tier.key];
            if (!cats || cats.length === 0) return null;
            const TierIcon = tier.icon;

            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Tier Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-9 w-9 rounded-lg ${tier.color} flex items-center justify-center`}>
                    <TierIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{tier.title}</h3>
                    <p className="text-white/40 text-xs">{tier.subtitle} · {cats.length} categories</p>
                  </div>
                </div>

                {/* Category Links Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {cats.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      viewport={{ once: true }}
                    >
                      <CategoryLink cat={cat} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTAs */}
        <motion.div
          className="mt-14 text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/nominees">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-8 gap-2 w-full sm:w-auto">
                <Users className="h-4 w-4" />
                Browse All Nominees
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/nominate">
              <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-8 gap-2 w-full sm:w-auto">
                <Trophy className="h-4 w-4" />
                Nominate Someone
              </Button>
            </Link>
          </div>
          <p className="text-xs text-white/40">
            You can begin a nomination now — final confirmation requires sign-up or sign-in.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
