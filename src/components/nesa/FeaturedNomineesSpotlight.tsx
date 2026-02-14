import { ArrowRight, Award, Star, Trophy, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const TIER_TABS = [
  { id: "all", label: "All Nominees", icon: Trophy, color: "text-gold", bg: "bg-gold/15", border: "border-gold/30" },
  { id: "platinum", label: "Platinum", icon: Shield, color: "text-slate-300", bg: "bg-slate-500/15", border: "border-slate-500/30" },
  { id: "verified", label: "Verified", icon: Award, color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
  { id: "rising", label: "Rising Stars", icon: Star, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
] as const;

interface NomineeCard {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  country: string | null;
  region: string | null;
  photo_url: string | null;
  is_platinum: boolean | null;
  nrc_verified: boolean | null;
}

/**
 * FeaturedNomineesSpotlight — Grammy-style editorial showcase
 */
export function FeaturedNomineesSpotlight() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: nominees = [] } = useQuery({
    queryKey: ["featured-nominees-spotlight"],
    queryFn: async () => {
      const { data } = await supabase
        .from("public_nominees")
        .select("id, name, slug, title, organization, country, region, photo_url, is_platinum, nrc_verified")
        .not("photo_url", "is", null)
        .limit(24);
      return (data || []) as NomineeCard[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const filteredNominees = nominees.filter(n => {
    if (activeTab === "platinum") return n.is_platinum;
    if (activeTab === "verified") return n.nrc_verified;
    if (activeTab === "rising") return !n.is_platinum && !n.nrc_verified;
    return true;
  }).slice(0, 6);

  const displayNominees = filteredNominees.length > 0 ? filteredNominees : nominees.slice(0, 6);
  const activeTier = TIER_TABS.find(t => t.id === activeTab) || TIER_TABS[0];

  return (
    <section className="bg-charcoal py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Meet the{" "}
            <span className="text-gradient-gold">Nominees</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Discover the educators, institutions, and innovators shaping the future of education across Africa.
          </p>
        </motion.div>

        {/* Tier tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/4 rounded-2xl p-1.5 border border-white/8">
            {TIER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? `${tab.bg} ${tab.color} ${tab.border} border shadow-lg`
                    : "text-white/50 hover:text-white/80 border border-transparent"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nominee Cards */}
        {displayNominees.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 mb-12">
            {displayNominees.map((nominee, index) => (
              <motion.div
                key={nominee.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <Link to={`/nominees/${nominee.slug}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/8 group-hover:border-gold/30 transition-all duration-300">
                    {nominee.photo_url ? (
                      <img
                        src={nominee.photo_url}
                        alt={nominee.name || "Nominee"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-white/10 to-white/5 flex items-center justify-center">
                        <span className="text-3xl font-display text-white/20">
                          {nominee.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                    
                    {/* Tier badge */}
                    {nominee.is_platinum && (
                      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-500/20 backdrop-blur-sm">
                        <Shield className="h-3 w-3 text-slate-300" />
                      </div>
                    )}
                    {nominee.nrc_verified && !nominee.is_platinum && (
                      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-blue-500/20 backdrop-blur-sm">
                        <Award className="h-3 w-3 text-blue-400" />
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-semibold text-sm leading-tight mb-0.5 group-hover:text-gold transition-colors line-clamp-2">
                        {nominee.name}
                      </h3>
                      {nominee.country && (
                        <p className="text-white/50 text-xs line-clamp-1">{nominee.country}</p>
                      )}
                      {nominee.region && (
                        <p className="text-gold/60 text-[10px] mt-1 line-clamp-1">{nominee.region}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-12">
            <activeTier.icon className={`h-12 w-12 ${activeTier.color} mx-auto mb-4 opacity-40`} />
            <p className="text-white/40 text-lg">Nominees coming soon</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/nominees">
            <Button
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10 hover:border-gold rounded-full px-10 gap-2 h-13 text-base"
            >
              Browse All Nominees
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
