/**
 * Education Champions Directory – Landing Page Section
 * 
 * A premium, celebratory showcase of Africa's education nominees.
 * Designed for clarity, trust, and mobile-first UX.
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Search,
  Users,
  Award,
  ChevronRight,
  Globe,
  Plane,
  Heart,
  Crown,
  Star,
  Shield,
  CheckCircle,
  Trophy,
  Sparkles,
  Filter,
  ArrowUpDown,
  MapPin,
  Calendar
} from "lucide-react";
import { 
  getAllNominees, 
  handleImageError,
  type Nominee
} from "@/lib/nesaData";
import { TIER_INFO, type AwardTier } from "@/config/nesaCategories";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface DirectoryStat {
  value: string;
  label: string;
  sublabel?: string;
  icon: React.ElementType;
}

interface AwardTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  count?: string;
  icon: React.ElementType;
  tier?: AwardTier;
  href: string;
  features?: string[];
  cta: string;
  ctaSecondary?: { label: string; href: string };
  variant: "icon" | "voting" | "expert" | "all";
}

const DIRECTORY_STATS: DirectoryStat[] = [
  { value: "1,670", label: "Total Nominees", sublabel: "Education Champions", icon: Users },
  { value: "943", label: "Africa Regions", sublabel: "Across the Continent", icon: Globe },
  { value: "30", label: "Diaspora", sublabel: "Global Advocates", icon: Plane },
  { value: "60", label: "Friends of Africa", sublabel: "International Partners", icon: Heart },
];

const FILTER_CHIPS = [
  { id: "all", label: "All Nominees", icon: Users },
  { id: "africa", label: "Africa", icon: Globe },
  { id: "diaspora", label: "Diaspora", icon: Plane },
  { id: "icon", label: "Icon Award", icon: Crown },
  { id: "voting", label: "Public Voting", icon: Star },
  { id: "expert", label: "Expert Selected", icon: Shield },
];

const SORT_OPTIONS = [
  { id: "az", label: "A–Z" },
  { id: "views", label: "Most Viewed" },
  { id: "recent", label: "Recently Added" },
];

const AWARD_TRACKS: AwardTrack[] = [
  {
    id: "icon",
    title: "Lifetime Achievement",
    subtitle: "Africa Education Icon Award (2005–2025)",
    description: "Honoring individuals and institutions whose work has defined educational progress for a decade or more.",
    icon: Crown,
    tier: "icon",
    href: "/awards/icon",
    variant: "icon",
    features: [
      "10+ years of sustained educational impact",
      "Legacy and institutional contribution recognition",
      "Selected by an independent expert panel"
    ],
    cta: "Nominate an Education Icon",
    ctaSecondary: { label: "View Past Icons", href: "/past-winners?tier=icon" }
  },
  {
    id: "voting",
    title: "Most Popular Awards",
    subtitle: "Blue Garnet & Gold Awards (Annual Competition)",
    description: "Celebrating outstanding nominees through community participation and expert judgment.",
    count: "9 categories · 135 subcategories",
    icon: Star,
    href: "/awards/gold",
    variant: "voting",
    features: [
      "Earn voting points through verified engagement",
      "Vote using AGC during official voting windows",
      "Final results combine public votes + jury scores"
    ],
    cta: "Nominate for Public Voting",
    ctaSecondary: { label: "Learn How Voting Works", href: "/how-it-works#voting" }
  },
  {
    id: "expert",
    title: "Expert Selection",
    subtitle: "Platinum Certificate of Merit",
    description: "A merit-based recognition awarded to nominees who meet exceptional standards of impact and integrity.",
    count: "17 categories · 7 core + 10 standard",
    icon: Shield,
    tier: "platinum",
    href: "/awards/platinum",
    variant: "expert",
    features: [
      "Baseline excellence and verified contribution",
      "No public voting required",
      "Recognition based solely on expert evaluation"
    ],
    cta: "Learn About Platinum",
  },
  {
    id: "all",
    title: "All Nominees",
    subtitle: "Complete Education Champions Directory",
    description: "Every nominee represents impact. Every story represents progress.",
    count: "1,670+ Education Champions",
    icon: Users,
    href: "/nominees",
    variant: "all",
    cta: "Explore Full Directory",
  }
];

const BADGE_DEFINITIONS = [
  { tier: "icon" as AwardTier, label: "Icon", description: "Lifetime Achievement (2005–2025)" },
  { tier: "blue-garnet" as AwardTier, label: "Blue Garnet", description: "Public + Jury Weighted" },
  { tier: "gold" as AwardTier, label: "Gold", description: "100% Public Voting" },
  { tier: "platinum" as AwardTier, label: "Platinum", description: "Expert-Only Selection" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function EducationChampionsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("az");

  const allNominees = useMemo(() => getAllNominees(), []);

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

    // Apply filter
    if (activeFilter === "africa") {
      results = results.filter(n => !n.regionName?.toLowerCase().includes("diaspora") && !n.regionName?.toLowerCase().includes("friends"));
    } else if (activeFilter === "diaspora") {
      results = results.filter(n => n.regionName?.toLowerCase().includes("diaspora"));
    }

    return results.slice(0, 12);
  }, [allNominees, searchQuery, activeFilter]);

  return (
    <section id="champions-directory" className="bg-charcoal py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.header 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/30 px-4 py-1.5">
            <Trophy className="w-3.5 h-3.5 mr-1.5" />
            Education Champions Directory
          </Badge>
          
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Meet Our <span className="text-gold">Nominees</span>
          </h2>
          
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-8">
            Discover the educators, innovators, institutions, and partners transforming education across Africa and beyond.
            <span className="block mt-2 text-gold/80 text-sm md:text-base">
              This directory celebrates excellence, impact, and lifelong dedication to education.
            </span>
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 min-w-[200px]">
              <Link to="/nominees">
                <Search className="mr-2 h-4 w-4" />
                Explore Directory
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8 min-w-[200px]">
              <Link to="/nominate">
                <Sparkles className="mr-2 h-4 w-4" />
                Nominate a Champion
              </Link>
            </Button>
          </div>
        </motion.header>

        {/* ═══════════════════════════════════════════════════════════════════
            SNAPSHOT METRICS
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {DIRECTORY_STATS.map((stat, index) => (
            <div 
              key={stat.label}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5 text-center hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
            >
              <stat.icon className="h-5 w-5 text-gold/70 mx-auto mb-2 group-hover:text-gold transition-colors" />
              <p className="text-2xl md:text-3xl font-bold text-gold mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-white/80 font-medium">{stat.label}</p>
              {stat.sublabel && (
                <p className="text-[10px] md:text-xs text-white/50 mt-0.5">{stat.sublabel}</p>
              )}
            </div>
          ))}
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            SEARCH & DISCOVERY
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-medium text-white/80">Explore the Directory</h3>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search by name, achievement, country, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 h-12 bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-gold/50 focus:ring-gold/20"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                  ${activeFilter === chip.id 
                    ? "bg-gold text-charcoal" 
                    : "bg-white/5 text-white/70 border border-white/10 hover:border-gold/30 hover:text-gold"
                  }
                `}
              >
                <chip.icon className="h-3 w-3" />
                {chip.label}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-white/50" />
            <span className="text-xs text-white/50">Sort:</span>
            <div className="flex gap-1.5">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveSort(option.id)}
                  className={`
                    px-2.5 py-1 rounded-md text-xs transition-colors
                    ${activeSort === option.id 
                      ? "bg-gold/20 text-gold" 
                      : "text-white/50 hover:text-white/80"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            AWARD TRACKS (Recognition Pathways)
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-medium text-white/80">Browse by Award Track</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {AWARD_TRACKS.map((track) => (
              <AwardTrackCard key={track.id} track={track} />
            ))}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            BADGE SYSTEM LEGEND
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-gold" />
            <h3 className="text-sm font-medium text-white/80">Recognition Badges</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {BADGE_DEFINITIONS.map((badge) => {
              const tierInfo = TIER_INFO[badge.tier];
              return (
                <div 
                  key={badge.tier}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${tierInfo.borderColor} bg-white/5`}
                >
                  <Badge className={`${tierInfo.bgColor} ${tierInfo.color} border-transparent text-xs`}>
                    {badge.label}
                  </Badge>
                  <span className="text-xs text-white/60">{badge.description}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            NOMINEES PREVIEW GRID
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" />
              <h3 className="text-sm font-medium text-white/80">Featured Champions</h3>
            </div>
            <Link 
              to="/nominees" 
              className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1"
            >
              View All
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {filteredNominees.length === 0 ? (
              <EmptyState searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
            ) : (
              <motion.div
                key={`${activeFilter}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4"
              >
                {filteredNominees.map((nominee, index) => (
                  <NomineeCard key={nominee.id} nominee={nominee} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            TRUST SIGNALS & WHY IT MATTERS
        ═══════════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          <div className="text-center mb-6">
            <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
              Why the Directory Matters
            </h3>
            <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
              The Education Champions Directory is more than a list — it is a living archive of Africa's education journey, 
              spotlighting those who teach, build, innovate, fund, advocate, and lead.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <TrustIndicator icon={Shield} label="Transparent" sublabel="Open verification process" />
            <TrustIndicator icon={Users} label="Expert Review" sublabel="Independent jury panel" />
            <TrustIndicator icon={CheckCircle} label="Fair Voting" sublabel="Verified engagement only" />
            <TrustIndicator icon={Calendar} label="20 Years" sublabel="Legacy since 2005" />
          </div>

          {/* Closing Statement */}
          <div className="text-center border-t border-gold/20 pt-6">
            <p className="text-gold font-medium text-sm md:text-base mb-1">
              Every name represents impact.
            </p>
            <p className="text-white/60 text-sm">
              Every story represents progress.
            </p>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-10">
            <Link to="/nominees">
              Explore Full Directory
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function AwardTrackCard({ track }: { track: AwardTrack }) {
  const variantStyles = {
    icon: "border-purple-500/30 hover:border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent",
    voting: "border-blue-500/30 hover:border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-transparent",
    expert: "border-slate-400/30 hover:border-slate-400/50 bg-gradient-to-br from-slate-400/10 to-transparent",
    all: "border-gold/30 hover:border-gold/50 bg-gradient-to-br from-gold/10 to-transparent",
  };

  return (
    <div className={`group rounded-xl border p-5 transition-all duration-300 ${variantStyles[track.variant]}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
          <track.icon className="h-5 w-5 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white text-sm md:text-base">{track.title}</h4>
            {track.tier && (
              <Badge className={`${TIER_INFO[track.tier].bgColor} ${TIER_INFO[track.tier].color} border-transparent text-[10px]`}>
                {TIER_INFO[track.tier].shortName}
              </Badge>
            )}
          </div>
          <p className="text-gold/80 text-xs mb-2">{track.subtitle}</p>
          <p className="text-white/60 text-xs leading-relaxed mb-3">{track.description}</p>
          
          {track.count && (
            <p className="text-white/50 text-[10px] mb-3">{track.count}</p>
          )}

          {track.features && (
            <ul className="space-y-1 mb-4">
              {track.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-white/50">
                  <CheckCircle className="h-3 w-3 text-gold/60 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="bg-gold hover:bg-gold-dark text-charcoal text-xs rounded-full h-8 px-4">
              <Link to={track.href}>{track.cta}</Link>
            </Button>
            {track.ctaSecondary && (
              <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-gold text-xs h-8 px-3">
                <Link to={track.ctaSecondary.href}>
                  {track.ctaSecondary.label}
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NomineeCard({ 
  nominee, 
  index 
}: { 
  nominee: Nominee & { awardTitle?: string; subcategoryTitle?: string; regionName?: string }; 
  index: number;
}) {
  const isLogo = nominee.imageType === "logo";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/nominees/${encodeURIComponent(nominee.slug)}`}
        className="group block bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-gold/40 transition-all duration-300 hover:bg-white/10"
      >
        {/* Photo */}
        <div className="relative mb-2">
          <div className={`w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-gold/20 group-hover:border-gold/50 transition-colors flex items-center justify-center ${isLogo ? "bg-white/90 p-1" : "bg-gold/10"}`}>
            {nominee.imageUrl ? (
              <img 
                src={nominee.imageUrl} 
                alt={nominee.name}
                className={isLogo ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full"}
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <span className="text-gold text-lg font-bold">{nominee.name.charAt(0)}</span>
            )}
          </div>
        </div>

        {/* Name */}
        <h4 className="text-xs font-medium text-white text-center truncate group-hover:text-gold transition-colors">
          {nominee.name}
        </h4>

        {/* Country/Region */}
        {(nominee.country || nominee.regionName) && (
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <MapPin className="h-2.5 w-2.5 text-white/40" />
            <span className="text-[10px] text-white/50 truncate">
              {nominee.country || nominee.regionName}
            </span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

function TrustIndicator({ icon: Icon, label, sublabel }: { icon: React.ElementType; label: string; sublabel: string }) {
  return (
    <div className="text-center">
      <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gold/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <p className="text-xs font-medium text-white">{label}</p>
      <p className="text-[10px] text-white/50">{sublabel}</p>
    </div>
  );
}

function EmptyState({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12 bg-white/5 rounded-2xl border border-white/10"
    >
      <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
      <p className="text-white/60 text-sm mb-4 max-w-md mx-auto">
        {searchQuery 
          ? `No nominees match "${searchQuery}". Try adjusting your search or filters.`
          : "No nominees yet — try adjusting your filters."
        }
      </p>
      <Button onClick={onClear} variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10 rounded-full">
        Clear Search
      </Button>
    </motion.div>
  );
}

export default EducationChampionsDirectory;
