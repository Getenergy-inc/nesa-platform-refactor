/**
 * Education Champions Directory – Landing Page Section
 * 
 * A premium, celebratory showcase of Africa's education nominees.
 * Designed for clarity, trust, mobile-first UX, and 10-second comprehension.
 * 
 * Layout Order:
 * 1. Hero Section (headline + CTAs)
 * 2. Snapshot Metrics (stats)
 * 3. Search & Filters
 * 4. Award Tracks (recognition pathways)
 * 5. Special Recognition (Icon, Blue Garnet, Platinum)
 * 6. Why It Matters + Trust Signals
 * 7. Final CTAs
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ArrowUpDown,
  MapPin,
  Clock,
  Eye,
  Vote,
  ExternalLink
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
  sublabel: string;
  icon: React.ElementType;
  color: string;
}

interface FilterChip {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
}

interface AwardTrack {
  id: string;
  title: string;
  count: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

interface SpecialRecognition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tier?: AwardTier;
  icon: React.ElementType;
  href: string;
  features: string[];
  cta: string;
  ctaSecondary?: { label: string; href: string };
  variant: "icon" | "voting" | "expert";
}

// Source of truth stats
const DIRECTORY_STATS: DirectoryStat[] = [
  { 
    value: "1,670", 
    label: "Total Nominees", 
    sublabel: "Education Champions across all tracks",
    icon: Trophy,
    color: "text-gold"
  },
  { 
    value: "943", 
    label: "Africa Regions", 
    sublabel: "North, West, Central, East, Southern",
    icon: Globe,
    color: "text-emerald-400"
  },
  { 
    value: "30", 
    label: "Diaspora", 
    sublabel: "Global African education advocates",
    icon: Plane,
    color: "text-blue-400"
  },
  { 
    value: "60", 
    label: "Friends of Africa", 
    sublabel: "International partners & allies",
    icon: Heart,
    color: "text-rose-400"
  },
];

// Filter chips with clear categories
const FILTER_CHIPS: FilterChip[] = [
  { id: "all", label: "All", icon: Users, description: "Browse all nominees" },
  { id: "africa", label: "Africa", icon: Globe, description: "Regional nominees" },
  { id: "diaspora", label: "Diaspora", icon: Plane, description: "Global advocates" },
  { id: "icon", label: "Icon", icon: Crown, description: "Lifetime achievement" },
  { id: "voting", label: "Voting", icon: Vote, description: "Public competition" },
  { id: "expert", label: "Expert", icon: Shield, description: "Merit-based selection" },
];

const SORT_OPTIONS = [
  { id: "az", label: "A–Z", icon: ArrowUpDown },
  { id: "views", label: "Most Viewed", icon: Eye },
  { id: "recent", label: "Recently Added", icon: Clock },
];

// Award tracks for geographic/category browsing
const AWARD_TRACKS: AwardTrack[] = [
  {
    id: "all",
    title: "All Nominees",
    count: "1,670",
    description: "Complete Education Champions Directory",
    icon: Users,
    href: "/nominees",
    color: "border-gold/40 hover:border-gold bg-gradient-to-br from-gold/10 to-transparent",
  },
  {
    id: "africa",
    title: "Africa Regional",
    count: "943",
    description: "Changemakers across the continent",
    icon: Globe,
    href: "/nominees?region=africa",
    color: "border-emerald-500/40 hover:border-emerald-500 bg-gradient-to-br from-emerald-500/10 to-transparent",
  },
  {
    id: "diaspora",
    title: "Diaspora Contributors",
    count: "30",
    description: "Global African education advocates",
    icon: Plane,
    href: "/nominees?region=diaspora",
    color: "border-blue-500/40 hover:border-blue-500 bg-gradient-to-br from-blue-500/10 to-transparent",
  },
  {
    id: "friends",
    title: "Friends of Africa",
    count: "60",
    description: "International partners supporting African education",
    icon: Heart,
    href: "/nominees?region=friends",
    color: "border-rose-500/40 hover:border-rose-500 bg-gradient-to-br from-rose-500/10 to-transparent",
  },
];

// Special recognition tracks with clear hierarchy
const SPECIAL_RECOGNITION: SpecialRecognition[] = [
  {
    id: "icon",
    title: "Lifetime Achievement",
    subtitle: "Africa Education Icon Award (2005–2025)",
    description: "Honoring individuals and institutions whose work has defined educational progress for a decade or more.",
    tier: "icon",
    icon: Crown,
    href: "/awards/icon",
    variant: "icon",
    features: [
      "10+ years of sustained educational impact",
      "Legacy and institutional contribution",
      "Selected by independent expert panel"
    ],
    cta: "Nominate an Icon",
    ctaSecondary: { label: "View Past Icons", href: "/past-winners?tier=icon" }
  },
  {
    id: "voting",
    title: "Public Voting Awards",
    subtitle: "Blue Garnet & Gold Awards",
    description: "Celebrating excellence through community participation and expert judgment. 9 categories, 135 subcategories.",
    icon: Star,
    href: "/awards/gold",
    variant: "voting",
    features: [
      "Earn voting points through engagement",
      "Vote using AGC during voting windows",
      "Blue Garnet: 40% public + 60% jury weighted"
    ],
    cta: "Nominate for Voting",
    ctaSecondary: { label: "How Voting Works", href: "/how-it-works#voting" }
  },
  {
    id: "expert",
    title: "Expert Selection",
    subtitle: "Platinum Certificate of Merit",
    description: "Merit-based recognition for nominees who meet exceptional standards. 17 categories (7 core + 10 standard).",
    tier: "platinum",
    icon: Shield,
    href: "/awards/platinum",
    variant: "expert",
    features: [
      "Verified contribution and impact",
      "No public voting required",
      "Expert evaluation only"
    ],
    cta: "Learn About Platinum",
  },
];

// Badge hierarchy (highest to lowest prestige)
const BADGE_HIERARCHY = [
  { tier: "icon" as AwardTier, label: "Icon", description: "Lifetime Achievement" },
  { tier: "blue-garnet" as AwardTier, label: "Blue Garnet", description: "Jury + Public" },
  { tier: "gold" as AwardTier, label: "Gold", description: "Public Vote" },
  { tier: "platinum" as AwardTier, label: "Platinum", description: "Expert Merit" },
];

// Trust signals
const TRUST_SIGNALS = [
  { icon: Shield, label: "Transparent", sublabel: "Open nomination process" },
  { icon: Users, label: "Expert Review", sublabel: "Independent jury panel" },
  { icon: CheckCircle, label: "Fair Voting", sublabel: "Verified engagement" },
  { icon: Clock, label: "20 Years", sublabel: "Legacy since 2005" },
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
    
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(n => 
        n.name.toLowerCase().includes(q) ||
        n.country?.toLowerCase().includes(q) ||
        n.achievement?.toLowerCase().includes(q) ||
        n.awardTitle?.toLowerCase().includes(q)
      );
    }

    // Category filter
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
      case "icon":
        // Filter for icon tier nominees (would need tier data)
        break;
      case "voting":
        // Filter for voting-eligible nominees
        break;
      case "expert":
        // Filter for expert-selected nominees
        break;
    }

    // Sort
    switch (activeSort) {
      case "az":
        results = [...results].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "views":
        // Would sort by view count
        break;
      case "recent":
        // Would sort by date added
        break;
    }

    return results.slice(0, 12);
  }, [allNominees, searchQuery, activeFilter, activeSort]);

  return (
    <section id="champions-directory" className="bg-charcoal py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-20 left-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-56 h-56 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        
        {/* ═══════════════════════════════════════════════════════════════════
            1. HERO SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <HeroSection />

        {/* ═══════════════════════════════════════════════════════════════════
            2. SNAPSHOT METRICS
        ═══════════════════════════════════════════════════════════════════ */}
        <SnapshotMetrics />

        {/* ═══════════════════════════════════════════════════════════════════
            3. SEARCH & FILTERS
        ═══════════════════════════════════════════════════════════════════ */}
        <SearchAndFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            4. AWARD TRACKS (Geographic Browsing)
        ═══════════════════════════════════════════════════════════════════ */}
        <AwardTracksGrid />

        {/* ═══════════════════════════════════════════════════════════════════
            5. FEATURED NOMINEES PREVIEW
        ═══════════════════════════════════════════════════════════════════ */}
        <NomineesPreview 
          nominees={filteredNominees}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            6. SPECIAL RECOGNITION TRACKS
        ═══════════════════════════════════════════════════════════════════ */}
        <SpecialRecognitionSection />

        {/* ═══════════════════════════════════════════════════════════════════
            7. BADGE LEGEND
        ═══════════════════════════════════════════════════════════════════ */}
        <BadgeLegend />

        {/* ═══════════════════════════════════════════════════════════════════
            8. WHY IT MATTERS + TRUST SIGNALS
        ═══════════════════════════════════════════════════════════════════ */}
        <WhyItMattersSection />

        {/* ═══════════════════════════════════════════════════════════════════
            9. FINAL CTA
        ═══════════════════════════════════════════════════════════════════ */}
        <FinalCTA />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <motion.header 
      className="text-center mb-10 md:mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Section Badge */}
      <Badge className="mb-4 bg-gold/10 text-gold border-gold/30 px-4 py-1.5 text-xs">
        <Trophy className="w-3 h-3 mr-1.5" />
        Education Champions Directory
      </Badge>
      
      {/* Headline - Clear & Celebratory */}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
        Celebrating Africa's <span className="text-gold">Education Heroes</span>
      </h2>
      
      {/* Value Proposition - One clear sentence */}
      <p className="text-white/70 max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-6">
        Discover 1,670+ educators, innovators, and institutions transforming learning across Africa and beyond.
      </p>

      {/* Primary CTAs - Clear actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button 
          asChild 
          size="lg" 
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 min-w-[180px] h-12"
        >
          <Link to="/nominees">
            <Search className="mr-2 h-4 w-4" />
            Explore Directory
          </Link>
        </Button>
        <Button 
          asChild 
          variant="outline" 
          size="lg" 
          className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-8 min-w-[180px] h-12"
        >
          <Link to="/nominate">
            <Sparkles className="mr-2 h-4 w-4" />
            Nominate a Champion
          </Link>
        </Button>
      </div>
    </motion.header>
  );
}

function SnapshotMetrics() {
  return (
    <motion.div 
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
    >
      {DIRECTORY_STATS.map((stat) => (
        <div 
          key={stat.label}
          className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5 text-center hover:border-gold/30 hover:bg-white/[0.07] transition-all duration-300"
        >
          <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2 opacity-80 group-hover:opacity-100 transition-opacity`} />
          <p className="text-2xl md:text-3xl font-bold text-white mb-0.5">{stat.value}</p>
          <p className="text-xs md:text-sm text-white/80 font-medium">{stat.label}</p>
          <p className="text-[10px] md:text-xs text-white/50 mt-0.5 line-clamp-1">{stat.sublabel}</p>
        </div>
      ))}
    </motion.div>
  );
}

function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  activeSort,
  setActiveSort,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  activeSort: string;
  setActiveSort: (value: string) => void;
}) {
  return (
    <motion.div 
      className="mb-10 md:mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-medium text-white/80">Find Champions</h3>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          type="text"
          placeholder="Search by name, country, achievement, or organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 pr-4 py-3 h-12 bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-gold/50 focus:ring-gold/20"
        />
      </div>

      {/* Filter Chips - Mobile-friendly horizontal scroll */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 min-h-[36px]
              ${activeFilter === chip.id 
                ? "bg-gold text-charcoal shadow-md shadow-gold/20" 
                : "bg-white/5 text-white/70 border border-white/10 hover:border-gold/30 hover:text-gold active:scale-95"
              }
            `}
          >
            <chip.icon className="h-3.5 w-3.5" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-white/50">Sort by:</span>
        <div className="flex gap-1.5">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveSort(option.id)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors min-h-[32px]
                ${activeSort === option.id 
                  ? "bg-gold/20 text-gold" 
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }
              `}
            >
              <option.icon className="h-3 w-3" />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AwardTracksGrid() {
  return (
    <motion.div 
      className="mb-10 md:mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-medium text-white/80">Browse by Track</h3>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {AWARD_TRACKS.map((track) => (
          <Link
            key={track.id}
            to={track.href}
            className={`group block rounded-xl border p-4 transition-all duration-300 ${track.color} hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <track.icon className="h-4 w-4 text-white/80" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-lg font-bold text-gold">{track.count}</span>
                </div>
                <h4 className="font-medium text-white text-sm leading-tight">{track.title}</h4>
                <p className="text-[11px] text-white/50 mt-1 line-clamp-2">{track.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-end mt-3 text-gold/70 group-hover:text-gold transition-colors">
              <span className="text-[10px] font-medium">Explore</span>
              <ChevronRight className="h-3 w-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function NomineesPreview({ 
  nominees, 
  searchQuery, 
  onClearSearch 
}: { 
  nominees: (Nominee & { awardTitle?: string; subcategoryTitle?: string; regionName?: string })[];
  searchQuery: string;
  onClearSearch: () => void;
}) {
  return (
    <motion.div 
      className="mb-10 md:mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.25 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-medium text-white/80">Featured Champions</h3>
        </div>
        <Link 
          to="/nominees" 
          className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1 group"
        >
          View All
          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid or Empty State */}
      <AnimatePresence mode="wait">
        {nominees.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onClear={onClearSearch} />
        ) : (
          <motion.div
            key="nominees-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          >
            {nominees.map((nominee, index) => (
              <NomineeCard key={nominee.id} nominee={nominee} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SpecialRecognitionSection() {
  return (
    <motion.div 
      className="mb-10 md:mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-medium text-white/80">Special Recognition Tracks</h3>
      </div>

      {/* Recognition Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {SPECIAL_RECOGNITION.map((track) => (
          <SpecialRecognitionCard key={track.id} track={track} />
        ))}
      </div>
    </motion.div>
  );
}

function BadgeLegend() {
  return (
    <motion.div 
      className="mb-10 md:mb-14"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.35 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-4 w-4 text-gold" />
        <h3 className="text-sm font-medium text-white/80">Badge Hierarchy</h3>
        <span className="text-[10px] text-white/40">(Highest → Lowest)</span>
      </div>

      {/* Badge Pills */}
      <div className="flex flex-wrap gap-2">
        {BADGE_HIERARCHY.map((badge) => {
          const tierInfo = TIER_INFO[badge.tier];
          return (
            <div 
              key={badge.tier}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${tierInfo.borderColor} bg-white/5`}
            >
              <Badge className={`${tierInfo.bgColor} ${tierInfo.color} border-transparent text-[10px] px-2 py-0.5`}>
                {badge.label}
              </Badge>
              <span className="text-[11px] text-white/60">{badge.description}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function WhyItMattersSection() {
  return (
    <motion.div 
      className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 rounded-2xl p-5 md:p-8 mb-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
    >
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
          Why This Directory Matters
        </h3>
        <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          More than a list — a living archive of Africa's education journey, spotlighting those who teach, build, innovate, and lead.
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {TRUST_SIGNALS.map((signal) => (
          <div key={signal.label} className="text-center">
            <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gold/10 flex items-center justify-center">
              <signal.icon className="h-5 w-5 text-gold" />
            </div>
            <p className="text-xs font-medium text-white">{signal.label}</p>
            <p className="text-[10px] text-white/50">{signal.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <div className="text-center border-t border-gold/20 pt-5">
        <p className="text-gold font-medium text-sm md:text-base">
          Every name represents impact.
        </p>
        <p className="text-white/50 text-xs md:text-sm">
          Every story represents progress.
        </p>
      </div>
    </motion.div>
  );
}

function FinalCTA() {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.45 }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button 
          asChild 
          size="lg" 
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-10 h-12"
        >
          <Link to="/nominees">
            Explore Full Directory
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button 
          asChild 
          variant="ghost" 
          size="lg" 
          className="text-white/70 hover:text-gold hover:bg-gold/5 rounded-full px-8 h-12"
        >
          <Link to="/nominate">
            Nominate Someone
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SpecialRecognitionCard({ track }: { track: SpecialRecognition }) {
  const variantStyles = {
    icon: "border-purple-500/30 hover:border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent",
    voting: "border-blue-500/30 hover:border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-transparent",
    expert: "border-slate-400/30 hover:border-slate-400/50 bg-gradient-to-br from-slate-400/10 to-transparent",
  };

  return (
    <div className={`group rounded-xl border p-5 transition-all duration-300 ${variantStyles[track.variant]} hover:scale-[1.01]`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
          <track.icon className="h-5 w-5 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-semibold text-white text-sm">{track.title}</h4>
            {track.tier && (
              <Badge className={`${TIER_INFO[track.tier].bgColor} ${TIER_INFO[track.tier].color} border-transparent text-[9px] px-1.5`}>
                {TIER_INFO[track.tier].shortName}
              </Badge>
            )}
          </div>
          <p className="text-gold/80 text-[11px]">{track.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/60 text-xs leading-relaxed mb-3">{track.description}</p>

      {/* Features */}
      <ul className="space-y-1.5 mb-4">
        {track.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px] text-white/50">
            <CheckCircle className="h-3 w-3 text-gold/60 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div className="flex flex-wrap gap-2">
        <Button 
          asChild 
          size="sm" 
          className="bg-gold hover:bg-gold-dark text-charcoal text-xs rounded-full h-8 px-4"
        >
          <Link to={track.href}>{track.cta}</Link>
        </Button>
        {track.ctaSecondary && (
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="text-white/60 hover:text-gold text-xs h-8 px-3"
          >
            <Link to={track.ctaSecondary.href}>
              {track.ctaSecondary.label}
              <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        )}
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      viewport={{ once: true }}
    >
      <Link
        to={`/nominees/${encodeURIComponent(nominee.slug)}`}
        className="group block bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-gold/40 transition-all duration-200 hover:bg-white/[0.08] active:scale-[0.98]"
      >
        {/* Avatar */}
        <div className="relative mb-2.5">
          <div className={`w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-white/20 group-hover:border-gold/50 transition-colors flex items-center justify-center ${isLogo ? "bg-white/90 p-1" : "bg-gold/10"}`}>
            {nominee.imageUrl ? (
              <img 
                src={nominee.imageUrl} 
                alt={nominee.name}
                className={isLogo ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full"}
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <span className="text-gold text-base font-bold">{nominee.name.charAt(0)}</span>
            )}
          </div>
        </div>

        {/* Name */}
        <h4 className="text-xs font-medium text-white text-center truncate group-hover:text-gold transition-colors leading-tight">
          {nominee.name}
        </h4>

        {/* Country/Category */}
        {(nominee.country || nominee.awardTitle) && (
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <MapPin className="h-2.5 w-2.5 text-white/40 flex-shrink-0" />
            <span className="text-[10px] text-white/50 truncate">
              {nominee.country || nominee.regionName}
            </span>
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
      className="text-center py-10 bg-white/5 rounded-2xl border border-white/10"
    >
      <Search className="h-10 w-10 text-white/20 mx-auto mb-3" />
      <h3 className="text-base font-semibold text-white mb-1.5">No Results Found</h3>
      <p className="text-white/60 text-sm mb-4 max-w-sm mx-auto px-4">
        {searchQuery 
          ? `No nominees match "${searchQuery}". Try adjusting your search or filters.`
          : "No nominees yet — try adjusting your filters."
        }
      </p>
      <Button 
        onClick={onClear} 
        variant="outline" 
        size="sm" 
        className="border-gold/30 text-gold hover:bg-gold/10 rounded-full"
      >
        Clear Search
      </Button>
    </motion.div>
  );
}

export default EducationChampionsDirectory;
