/**
 * Education Champions Directory – Landing Page Section
 * 
 * Premium, celebratory showcase of Africa's education nominees.
 * Mobile-first, 10-second comprehension, clear hierarchy.
 * Now uses LIVE nominee counts from database.
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Search, Users, Award, ChevronRight, Globe, Plane, Heart,
  Crown, Star, Shield, CheckCircle, Trophy, Sparkles,
  MapPin, Clock, Vote, ExternalLink
} from "lucide-react";
import { 
  getAllNominees, handleImageError, type Nominee
} from "@/lib/nesaData";
import { TIER_INFO, type AwardTier } from "@/config/nesaCategories";
import { useRegionNomineeCounts } from "@/hooks/useRegionNomineeCounts";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FILTER_CHIPS = [
  { id: "all", label: "All", icon: Users },
  { id: "africa", label: "Africa", icon: Globe },
  { id: "diaspora", label: "Diaspora", icon: Plane },
  { id: "icon", label: "Icon", icon: Crown },
  { id: "voting", label: "Voting", icon: Vote },
  { id: "expert", label: "Expert", icon: Shield },
];

const SORT_OPTIONS = [
  { id: "az", label: "A–Z" },
  { id: "views", label: "Popular" },
  { id: "recent", label: "Recent" },
];

const SPECIAL_RECOGNITION = [
  {
    id: "icon",
    title: "Lifetime Achievement",
    subtitle: "Africa Education Icon (2005–2025)",
    description: "10+ years of sustained impact. Expert-selected.",
    tier: "icon" as AwardTier,
    icon: Crown,
    href: "/awards/icon",
    variant: "icon" as const,
    cta: "Nominate Icon",
    ctaSecondary: { label: "Past Icons", href: "/past-winners?tier=icon" }
  },
  {
    id: "voting",
    title: "Public Voting",
    subtitle: "Blue Garnet & Gold Awards",
    description: "9 categories. 135 subcategories. Public + Jury weighted.",
    icon: Star,
    href: "/awards/gold",
    variant: "voting" as const,
    cta: "Nominate",
    ctaSecondary: { label: "How It Works", href: "/how-it-works#voting" }
  },
  {
    id: "expert",
    title: "Expert Selection",
    subtitle: "Platinum Certificate of Merit",
    description: "17 categories. No voting. Expert evaluation only.",
    tier: "platinum" as AwardTier,
    icon: Shield,
    href: "/awards/platinum",
    variant: "expert" as const,
    cta: "Learn More",
  },
];

const BADGE_HIERARCHY = [
  { tier: "icon" as AwardTier, label: "Icon", short: "Lifetime" },
  { tier: "blue-garnet" as AwardTier, label: "Blue Garnet", short: "Jury+Public" },
  { tier: "gold" as AwardTier, label: "Gold", short: "Public" },
  { tier: "platinum" as AwardTier, label: "Platinum", short: "Expert" },
];

const TRUST_SIGNALS = [
  { icon: Shield, label: "Transparent", sublabel: "Open process" },
  { icon: Users, label: "Expert Review", sublabel: "27 Judges" },
  { icon: CheckCircle, label: "Fair Voting", sublabel: "Verified" },
  { icon: Clock, label: "20 Years", sublabel: "Since 2005" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : n.toLocaleString();
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function EducationChampionsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("az");

  const { data: countsData } = useRegionNomineeCounts();

  const allNominees = useMemo(() => getAllNominees(), []);

  // Derive live stats
  const liveStats = useMemo(() => {
    if (!countsData) return null;
    const { regionCounts, totalCount } = countsData;

    const africaCount = regionCounts
      .filter(r => !r.region_slug.includes("diaspora") && !r.region_slug.includes("friends"))
      .reduce((s, r) => s + r.nominee_count, 0);
    const diasporaCount = regionCounts.find(r => r.region_slug.includes("diaspora"))?.nominee_count || 0;
    const friendsCount = regionCounts.find(r => r.region_slug.includes("friends"))?.nominee_count || 0;

    return { total: totalCount, africa: africaCount, diaspora: diasporaCount, friends: friendsCount };
  }, [countsData]);

  const stats = [
    { value: liveStats ? formatCount(liveStats.total) : "—", label: "Total", sublabel: "Education Champions", icon: Trophy, color: "text-gold" },
    { value: liveStats ? formatCount(liveStats.africa) : "—", label: "Africa", sublabel: "5 Regions", icon: Globe, color: "text-emerald-400" },
    { value: liveStats ? formatCount(liveStats.diaspora) : "—", label: "Diaspora", sublabel: "Global Advocates", icon: Plane, color: "text-blue-400" },
    { value: liveStats ? formatCount(liveStats.friends) : "—", label: "Friends", sublabel: "International Allies", icon: Heart, color: "text-rose-400" },
  ];

  const tracks = [
    { id: "all", title: "All Nominees", count: liveStats ? formatCount(liveStats.total) : "—", icon: Users, href: "/nominees", color: "from-gold/15 border-gold/30" },
    { id: "africa", title: "Africa Regional", count: liveStats ? formatCount(liveStats.africa) : "—", icon: Globe, href: "/nominees?region=africa", color: "from-emerald-500/15 border-emerald-500/30" },
    { id: "diaspora", title: "Diaspora", count: liveStats ? formatCount(liveStats.diaspora) : "—", icon: Plane, href: "/nominees?region=diaspora", color: "from-blue-500/15 border-blue-500/30" },
    { id: "friends", title: "Friends of Africa", count: liveStats ? formatCount(liveStats.friends) : "—", icon: Heart, href: "/nominees?region=friends", color: "from-rose-500/15 border-rose-500/30" },
  ];

  const filteredNominees = useMemo(() => {
    let results = allNominees;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(n => 
        n.name.toLowerCase().includes(q) ||
        n.country?.toLowerCase().includes(q) ||
        n.achievement?.toLowerCase().includes(q) ||
        n.awardTitle?.toLowerCase().includes(q)
      );
    }

    switch (activeFilter) {
      case "africa":
        results = results.filter(n => 
          !n.regionName?.toLowerCase().includes("diaspora") && 
          !n.regionName?.toLowerCase().includes("friends")
        );
        break;
      case "diaspora":
        results = results.filter(n => n.regionName?.toLowerCase().includes("diaspora"));
        break;
    }

    if (activeSort === "az") {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    }

    return results.slice(0, 12);
  }, [allNominees, searchQuery, activeFilter, activeSort]);

  return (
    <section id="champions-directory" className="bg-charcoal py-12 md:py-20 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-20 -left-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-10 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        
        {/* 1. HERO */}
        <motion.header 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-3 bg-gold/10 text-gold border-gold/30 px-3 py-1 text-[11px]">
            <Trophy className="w-3 h-3 mr-1" />
            Education Champions Directory
          </Badge>
          
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Celebrating Africa's <span className="text-gold">Education Heroes</span>
          </h2>
          
          <p className="text-white/60 max-w-lg mx-auto text-sm md:text-base mb-5">
            Discover the remarkable educators, innovators, and institutions transforming education across Africa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button 
              asChild 
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 h-11 w-full sm:w-auto"
            >
              <Link to="/nominees">
                <Search className="mr-2 h-4 w-4" />
                Explore Directory
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 h-11 w-full sm:w-auto"
            >
              <Link to="/nominate">
                <Sparkles className="mr-2 h-4 w-4" />
                Nominate
              </Link>
            </Button>
          </div>
        </motion.header>

        {/* 2. LIVE SNAPSHOT METRICS */}
        <motion.div 
          className="grid grid-cols-4 gap-2 md:gap-3 mb-8 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-lg p-2.5 md:p-4 text-center hover:border-gold/20 transition-colors"
            >
              <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color} mx-auto mb-1.5 opacity-70`} />
              <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-white/70 font-medium">{stat.label}</p>
              <p className="text-[9px] md:text-[10px] text-white/40 hidden sm:block">{stat.sublabel}</p>
            </div>
          ))}
        </motion.div>

        {/* 3. SEARCH & FILTERS */}
        <motion.div 
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search by name, country, or achievement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 bg-white/5 border-white/15 text-white text-sm placeholder:text-white/40 rounded-xl focus:border-gold/40"
            />
          </div>

          <ScrollArea className="w-full mb-3">
            <div className="flex gap-1.5 pb-2">
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setActiveFilter(chip.id)}
                  className={`
                    inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                    ${activeFilter === chip.id 
                      ? "bg-gold text-charcoal shadow-sm" 
                      : "bg-white/5 text-white/60 border border-white/10 hover:border-gold/30 hover:text-gold active:scale-95"
                    }
                  `}
                >
                  <chip.icon className="h-3 w-3" />
                  {chip.label}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-1" />
          </ScrollArea>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-white/40">Sort:</span>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveSort(option.id)}
                className={`px-2 py-1 rounded transition-colors ${
                  activeSort === option.id 
                    ? "bg-gold/20 text-gold" 
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 4. AWARD TRACKS (live counts) */}
        <motion.div 
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-gold" />
            <h3 className="text-xs font-medium text-white/70">Browse by Track</h3>
            {liveStats && (
              <Badge variant="outline" className="ml-auto text-[9px] border-emerald-500/30 text-emerald-400 px-1.5 py-0">
                Live
              </Badge>
            )}
          </div>

          <ScrollArea className="w-full md:hidden">
            <div className="flex gap-2.5 pb-2">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} compact />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="h-1" />
          </ScrollArea>
          
          <div className="hidden md:grid grid-cols-4 gap-3">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </motion.div>

        {/* 5. FEATURED NOMINEES */}
        <motion.div 
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" />
              <h3 className="text-xs font-medium text-white/70">Featured Champions</h3>
            </div>
            <Link 
              to="/nominees" 
              className="text-[11px] text-gold hover:text-gold-light flex items-center gap-0.5 group"
            >
              View All
              <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {filteredNominees.length === 0 ? (
              <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3"
              >
                {filteredNominees.map((nominee, i) => (
                  <NomineeCard key={nominee.id} nominee={nominee} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 6. SPECIAL RECOGNITION */}
        <motion.div 
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-gold" />
            <h3 className="text-xs font-medium text-white/70">Recognition Tracks</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {SPECIAL_RECOGNITION.map((track) => (
              <RecognitionCard key={track.id} track={track} />
            ))}
          </div>
        </motion.div>

        {/* 7. BADGE LEGEND */}
        <motion.div 
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-gold" />
            <h3 className="text-xs font-medium text-white/70">Badge Hierarchy</h3>
            <span className="text-[9px] text-white/30">Highest → Lowest</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {BADGE_HIERARCHY.map((badge) => {
              const info = TIER_INFO[badge.tier];
              return (
                <div 
                  key={badge.tier}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border ${info.borderColor} bg-white/5`}
                >
                  <Badge className={`${info.bgColor} ${info.color} border-transparent text-[9px] px-1.5 py-0`}>
                    {badge.label}
                  </Badge>
                  <span className="text-[10px] text-white/50">{badge.short}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 8. TRUST SIGNALS */}
        <motion.div 
          className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/15 rounded-xl p-4 md:p-6 mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="font-display text-base md:text-lg font-bold text-white text-center mb-4">
            Why This Directory Matters
          </h3>
          
          <p className="text-white/50 text-center text-xs md:text-sm max-w-md mx-auto mb-5">
            A living archive of Africa's education journey — spotlighting those who teach, build, innovate & lead.
          </p>

          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4">
            {TRUST_SIGNALS.map((signal) => (
              <div key={signal.label} className="text-center">
                <div className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-1.5 rounded-full bg-gold/10 flex items-center justify-center">
                  <signal.icon className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                </div>
                <p className="text-[10px] md:text-xs font-medium text-white">{signal.label}</p>
                <p className="text-[9px] md:text-[10px] text-white/40">{signal.sublabel}</p>
              </div>
            ))}
          </div>

          <div className="text-center border-t border-gold/15 pt-4">
            <p className="text-gold text-xs md:text-sm font-medium">Every name represents impact.</p>
            <p className="text-white/40 text-[10px] md:text-xs">Every story represents progress.</p>
          </div>
        </motion.div>

        {/* 9. FINAL CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button 
              asChild 
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 h-11 w-full sm:w-auto"
            >
              <Link to="/nominees">
                Explore Directory
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="ghost" 
              className="text-white/60 hover:text-gold hover:bg-gold/5 rounded-full px-6 h-11"
            >
              <Link to="/nominate">
                Nominate Someone
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function TrackCard({ track, compact = false }: { 
  track: { id: string; title: string; count: string; icon: any; href: string; color: string }; 
  compact?: boolean;
}) {
  return (
    <Link
      to={track.href}
      className={`
        group block rounded-lg border bg-gradient-to-br to-transparent transition-all active:scale-[0.98]
        ${track.color}
        ${compact ? "p-3 min-w-[140px] flex-shrink-0" : "p-4 hover:scale-[1.02]"}
      `}
    >
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className={`${compact ? "h-7 w-7" : "h-8 w-8"} rounded-lg bg-white/10 flex items-center justify-center`}>
          <track.icon className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} text-white/70`} />
        </div>
        <span className={`${compact ? "text-base" : "text-lg"} font-bold text-gold`}>{track.count}</span>
      </div>
      <h4 className={`font-medium text-white ${compact ? "text-xs" : "text-sm"} leading-tight`}>{track.title}</h4>
      <div className="flex items-center justify-end mt-2 text-gold/60 group-hover:text-gold">
        <span className="text-[9px] font-medium">Explore</span>
        <ChevronRight className="h-2.5 w-2.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}

function RecognitionCard({ track }: { track: typeof SPECIAL_RECOGNITION[0] }) {
  const styles = {
    icon: "border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-transparent",
    voting: "border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-transparent",
    expert: "border-slate-400/25 bg-gradient-to-br from-slate-400/10 to-transparent",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[track.variant]}`}>
      <div className="flex items-start gap-3 mb-2.5">
        <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <track.icon className="h-4 w-4 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="font-semibold text-white text-sm">{track.title}</h4>
            {track.tier && (
              <Badge className={`${TIER_INFO[track.tier].bgColor} ${TIER_INFO[track.tier].color} text-[8px] px-1.5 py-0 border-transparent`}>
                {TIER_INFO[track.tier].shortName}
              </Badge>
            )}
          </div>
          <p className="text-gold/70 text-[10px]">{track.subtitle}</p>
        </div>
      </div>
      
      <p className="text-white/50 text-[11px] leading-relaxed mb-3">{track.description}</p>

      <div className="flex flex-wrap gap-1.5">
        <Button 
          asChild 
          size="sm" 
          className="bg-gold hover:bg-gold-dark text-charcoal text-[11px] rounded-full h-7 px-3"
        >
          <Link to={track.href}>{track.cta}</Link>
        </Button>
        {track.ctaSecondary && (
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="text-white/50 hover:text-gold text-[11px] h-7 px-2"
          >
            <Link to={track.ctaSecondary.href}>
              {track.ctaSecondary.label}
              <ChevronRight className="ml-0.5 h-2.5 w-2.5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function NomineeCard({ nominee, index }: { 
  nominee: Nominee & { awardTitle?: string; regionName?: string }; 
  index: number;
}) {
  const isLogo = nominee.imageType === "logo";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/nominees/${encodeURIComponent(nominee.slug)}`}
        className="group block bg-white/5 rounded-lg p-2.5 border border-white/10 hover:border-gold/30 transition-all active:scale-[0.97]"
      >
        <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full overflow-hidden border border-white/20 group-hover:border-gold/40 mb-2 flex items-center justify-center ${isLogo ? "bg-white/90 p-1" : "bg-gold/10"}`}>
          {nominee.imageUrl ? (
            <img 
              src={nominee.imageUrl} 
              alt={nominee.name}
              className={isLogo ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full"}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <span className="text-gold text-sm font-bold">{nominee.name.charAt(0)}</span>
          )}
        </div>
        <h4 className="text-[10px] md:text-xs font-medium text-white text-center truncate group-hover:text-gold transition-colors">
          {nominee.name}
        </h4>
        {nominee.country && (
          <div className="flex items-center justify-center gap-0.5 mt-1">
            <MapPin className="h-2 w-2 text-white/30" />
            <span className="text-[8px] md:text-[9px] text-white/40 truncate">{nominee.country}</span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

function EmptyState({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8 bg-white/5 rounded-xl border border-white/10"
    >
      <Search className="h-8 w-8 text-white/20 mx-auto mb-2" />
      <h3 className="text-sm font-semibold text-white mb-1">No Results</h3>
      <p className="text-white/50 text-xs mb-3 max-w-xs mx-auto px-4">
        {searchQuery 
          ? `No matches for "${searchQuery}". Try a different search.`
          : "No nominees match your filters."
        }
      </p>
      <Button 
        onClick={onClear} 
        variant="outline" 
        size="sm" 
        className="border-gold/30 text-gold hover:bg-gold/10 rounded-full text-xs h-7"
      >
        Clear Search
      </Button>
    </motion.div>
  );
}

export default EducationChampionsDirectory;
