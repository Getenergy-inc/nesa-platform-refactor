/**
 * Gold Special Recognition — 2025 Edition
 * Cultural Impact Recognition · 3 Categories
 * 
 * Premium gallery with immersive category cards, large nominee showcases,
 * animated pathway diagram, and institutional closing.
 */
import { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Music, Smartphone, ChevronRight, ChevronLeft,
  QrCode, Share2, ExternalLink, ShieldCheck,
  Award, Sparkles, Globe, Upload, Users, Eye,
  ArrowRight, CheckCircle2, Star, Megaphone, Heart, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

// Nominee images
import sportsNominee1 from "@/assets/nominees/sports-nominee-1.jpg";
import sportsNominee2 from "@/assets/nominees/sports-nominee-2.jpg";
import sportsNominee3 from "@/assets/nominees/sports-nominee-3.jpg";
import musicNominee1 from "@/assets/nominees/music-nominee-1.jpg";
import musicNominee2 from "@/assets/nominees/music-nominee-2.jpg";
import musicNominee3 from "@/assets/nominees/music-nominee-3.jpg";
import socialNominee1 from "@/assets/nominees/social-nominee-1.jpg";
import socialNominee2 from "@/assets/nominees/social-nominee-2.jpg";
import socialNominee3 from "@/assets/nominees/social-nominee-3.jpg";

// ─── Types ───────────────────────────────────────────────────
interface ProfileSlide {
  name: string;
  region: string;
  regionTag: string;
  country: string;
  impactSummary: string;
  fullImpact: string;
  ediVerified: boolean;
  platformIcons?: string[];
  nominationCount?: number;
  profileLink?: string;
  imageUrl?: string;
}

interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  subcategories: string[];
  profiles: ProfileSlide[];
  ctaHeadline: string;
  ctaSubline: string;
  gradient: string;
  iconBg: string;
}

// ─── Profile Data ────────────────────────────────────────────
const SPORTS_PROFILES: ProfileSlide[] = [
  { name: "Didier Drogba", region: "🇨🇮", regionTag: "West Africa", country: "Côte d'Ivoire", impactSummary: "Built hospitals, schools, and funded education for thousands of youth through the Didier Drogba Foundation.", fullImpact: "Through the Didier Drogba Foundation, invested over $8M in education infrastructure including school construction, scholarship programs, and healthcare facilities across Côte d'Ivoire. Named UNDP Goodwill Ambassador for championing education access.", ediVerified: true, nominationCount: 142, profileLink: "/nominees", imageUrl: sportsNominee1 },
  { name: "Tegla Loroupe", region: "🇰🇪", regionTag: "East Africa", country: "Kenya", impactSummary: "Founded the Tegla Loroupe Peace Foundation supporting education for refugee and marginalized youth.", fullImpact: "World record marathon holder who established the Tegla Loroupe Peace Foundation, providing education and sports training to over 10,000 refugee children across Kenya and Uganda. UN Ambassador for Sport.", ediVerified: true, nominationCount: 98, profileLink: "/nominees", imageUrl: sportsNominee2 },
  { name: "Siya Kolisi", region: "🇿🇦", regionTag: "Southern Africa", country: "South Africa", impactSummary: "Co-founded the Kolisi Foundation to improve education, nutrition, and gender-based violence awareness.", fullImpact: "South Africa's first Black Rugby World Cup-winning captain. The Kolisi Foundation has impacted 500,000+ lives through education programs, school feeding schemes, and youth sports development in underserved communities.", ediVerified: true, nominationCount: 117, profileLink: "/nominees", imageUrl: sportsNominee3 },
];

const MUSIC_PROFILES: ProfileSlide[] = [
  { name: "Burna Boy", region: "🇳🇬", regionTag: "West Africa", country: "Nigeria", impactSummary: "Grammy-winning artist funding scholarship programs and youth education initiatives across Nigeria.", fullImpact: "Grammy Award-winning Afrobeats pioneer who has funded scholarship programs for 200+ Nigerian students. Advocates for African youth empowerment through education and cultural identity. Concert proceeds regularly support school construction.", ediVerified: true, nominationCount: 156, profileLink: "/nominees", imageUrl: musicNominee1 },
  { name: "Angélique Kidjo", region: "🇧🇯", regionTag: "West Africa", country: "Benin", impactSummary: "Founded Batonga Foundation empowering girls' education across Africa with 15+ years of impact.", fullImpact: "Multiple Grammy winner and UNICEF Goodwill Ambassador. Founded the Batonga Foundation in 2006, providing secondary education and leadership training to thousands of girls across Benin, Ethiopia, and 8 other African countries.", ediVerified: true, nominationCount: 134, profileLink: "/nominees", imageUrl: musicNominee2 },
  { name: "Tems", region: "🇳🇬", regionTag: "West Africa", country: "Nigeria", impactSummary: "Global music icon championing youth creative education and mentorship programs.", fullImpact: "Grammy-winning vocalist using her global platform to advocate for creative arts education in African schools. Supports music and arts scholarships for young Nigerians, promoting education through cultural expression and mentorship.", ediVerified: true, nominationCount: 89, profileLink: "/nominees", imageUrl: musicNominee3 },
];

const SOCIAL_MEDIA_PROFILES: ProfileSlide[] = [
  { name: "Mark Angel", region: "🇳🇬", regionTag: "West Africa", country: "Nigeria", impactSummary: "Africa's most-subscribed YouTuber using comedy to promote education and literacy for millions.", fullImpact: "Creator of Mark Angel Comedy with 10M+ YouTube subscribers. Uses comedic storytelling to promote education awareness and literacy. Funds school supplies and scholarship programs across Nigeria through content revenue.", ediVerified: true, nominationCount: 128, platformIcons: ["YouTube", "Instagram"], profileLink: "/nominees", imageUrl: socialNominee1 },
  { name: "Elsa Majimbo", region: "🇰🇪", regionTag: "East Africa", country: "Kenya", impactSummary: "Award-winning content creator advocating for youth empowerment and educational opportunities.", fullImpact: "Forbes 30 Under 30 honoree using her global platform to champion African youth education. Partners with education NGOs to raise awareness for scholarship access and youth empowerment programs across East Africa.", ediVerified: true, nominationCount: 76, platformIcons: ["Instagram", "TikTok"], profileLink: "/nominees", imageUrl: socialNominee2 },
  { name: "Wode Maya", region: "🇬🇭", regionTag: "West Africa", country: "Ghana", impactSummary: "Top African travel creator reshaping education narratives and funding schools across the continent.", fullImpact: "YouTube creator with 3M+ subscribers documenting African stories. Built schools in rural Ghana through content revenue, promotes Pan-African education initiatives, and has inspired thousands of diaspora youth to invest in African education.", ediVerified: true, nominationCount: 94, platformIcons: ["YouTube", "X"], profileLink: "/nominees", imageUrl: socialNominee3 },
];

const CATEGORIES: CategoryCard[] = [
  {
    id: "sports",
    title: "Africa Sports Education Impact Recognition",
    subtitle: "Recognizing sportsmen and sportswomen championing education advocacy across Africa.",
    icon: Trophy,
    subcategories: ["Athlete Education Advocate", "Sports Foundation / Academy Impact Leader"],
    profiles: SPORTS_PROFILES,
    ctaHeadline: "Know a stronger sports education advocate?",
    ctaSubline: "Nominate today.",
    gradient: "from-amber-900/30 via-charcoal to-charcoal",
    iconBg: "from-amber-500/25 to-primary/15",
  },
  {
    id: "music",
    title: "Africa Music Education Impact Recognition",
    subtitle: "Recognizing music artists championing education advocacy across Africa.",
    icon: Music,
    subcategories: ["Music Education Advocate (Artist / Producer / Cultural Ambassador)"],
    profiles: MUSIC_PROFILES,
    ctaHeadline: "Influence + Education = Impact.",
    ctaSubline: "Recognize artists making a difference.",
    gradient: "from-purple-900/20 via-charcoal to-charcoal",
    iconBg: "from-purple-400/25 to-primary/15",
  },
  {
    id: "social-media",
    title: "Africa Social Media Education Impact Recognition",
    subtitle: "Recognizing digital creators advancing education awareness across Africa.",
    icon: Smartphone,
    subcategories: ["Education Content Creator", "Youth Digital Advocacy Leader"],
    profiles: SOCIAL_MEDIA_PROFILES,
    ctaHeadline: "Digital Influence Must Show Education Impact.",
    ctaSubline: "Nominate an influencer championing education.",
    gradient: "from-sky-900/20 via-charcoal to-charcoal",
    iconBg: "from-sky-400/25 to-primary/15",
  },
];

// ─── Recognition Pathway Steps ───────────────────────────────
const PATHWAY_STEPS = [
  { label: "Nomination", icon: Award, description: "Submit or re-nominate a cultural leader" },
  { label: "EDI Review", icon: ShieldCheck, description: "Education Development Index evaluation" },
  { label: "Gold Special", icon: Star, description: "Gold Certificate of Recognition" },
  { label: "Platinum", icon: CheckCircle2, description: "Platinum verification pathway" },
  { label: "Public Voting", icon: Users, description: "Community-validated recognition" },
  { label: "Blue Garnet", icon: Globe, description: "Africa Education Icon — Lifetime" },
];

// ─── Slide Progress Bar ─────────────────────────────────────
function SlideProgressBar({ current, total, onDotClick, isPaused }: { current: number; total: number; onDotClick: (i: number) => void; isPaused: boolean }) {
  return (
    <div className="flex gap-1.5 w-full mt-4 px-1">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className="relative h-1 flex-1 rounded-full bg-white/10 overflow-hidden"
          aria-label={`Go to slide ${i + 1}`}
        >
          {i === current ? (
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: isPaused ? `${((Date.now() % 6000) / 6000) * 100}%` : "100%" }}
              transition={{ duration: isPaused ? 0 : 6, ease: "linear" }}
              key={`progress-${current}`}
            />
          ) : i < current ? (
            <div className="absolute inset-0 bg-primary/50 rounded-full" />
          ) : null}
        </button>
      ))}
    </div>
  );
}

// ─── Profile Slide (Large Format) ────────────────────────────
function ProfileSlideContent({
  profile,
  onProfileClick,
}: {
  profile: ProfileSlide;
  onProfileClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="px-5 py-4"
    >
      <div className="flex gap-5 cursor-pointer group" onClick={onProfileClick}>
        {/* Large Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-primary/20 overflow-hidden shadow-xl shadow-black/30 group-hover:border-primary/40 transition-colors">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center">
                <span className="text-4xl">{profile.region}</span>
              </div>
            )}
          </div>
          {profile.ediVerified && (
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-charcoal shadow-lg" title="EDI Verified">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h4 className="font-bold text-white text-base group-hover:text-primary transition-colors">{profile.name}</h4>
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary/90 px-2 py-0 h-[18px] font-medium">
              {profile.regionTag}
            </Badge>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">
            {profile.impactSummary}
          </p>
          {profile.platformIcons && (
            <div className="flex gap-1.5 mb-2">
              {profile.platformIcons.map((p) => (
                <span key={p} className="text-[10px] text-primary/70 bg-primary/[0.08] rounded-md px-2 py-0.5 border border-primary/15 font-medium">{p}</span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4">
            {profile.nominationCount && profile.nominationCount > 0 && (
              <span className="text-xs text-white/30 inline-flex items-center gap-1">
                <Heart className="w-3 h-3 text-primary/50" /> {profile.nominationCount} nominations
              </span>
            )}
            <Link
              to={profile.profileLink || "/nominees"}
              className="text-xs text-primary/60 hover:text-primary transition-colors inline-flex items-center gap-1 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-3 h-3" /> View Profile
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Profile Detail Modal ────────────────────────────────────
function ProfileModal({
  profile,
  category,
  open,
  onClose,
}: {
  profile: ProfileSlide | null;
  category: string;
  open: boolean;
  onClose: () => void;
}) {
  if (!profile) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-charcoal border-primary/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-serif text-xl">{profile.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Profile header with image */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30">
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center">
                    <span className="text-3xl">{profile.region}</span>
                  </div>
                )}
              </div>
              {profile.ediVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-charcoal">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-white/60">{profile.country} · {profile.regionTag}</p>
              <p className="text-xs text-primary/60 mt-1">{category}</p>
              {profile.ediVerified && (
                <Badge className="mt-1.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                  <ShieldCheck className="w-3 h-3 mr-1" /> EDI Verified
                </Badge>
              )}
            </div>
          </div>

          {/* Full impact */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-2">Education Impact</h4>
            <p className="text-sm text-white/60 leading-relaxed">{profile.fullImpact}</p>
          </div>

          {/* EDI compliance */}
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
            <p className="text-[11px] text-white/40 leading-relaxed">
              <span className="text-primary font-medium">EDI Compliance:</span> All Gold Special Recognition nominees are evaluated against the Education Development Index (EDI) Matrix. Verified nominees have passed measurable impact assessment.
            </p>
          </div>

          {profile.platformIcons && (
            <div className="flex gap-2">
              {profile.platformIcons.map((p) => (
                <span key={p} className="text-xs text-primary/60 bg-primary/[0.08] rounded-md px-2.5 py-1 border border-primary/10">{p}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-10" asChild>
              <Link to="/nominate?tier=gold-special">Support Nomination</Link>
            </Button>
            <Button variant="outline" className="flex-1 border-primary/25 text-primary hover:bg-primary/10 text-xs h-10" asChild>
              <Link to="/nominate?tier=gold-special">
                Submit Evidence <Upload className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          <p className="text-[10px] text-white/20 text-center">
            Platinum Clearance pathway available after Gold eligibility verification.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Gold Category Card (Redesigned) ─────────────────────────
function GoldCategoryCard({ card, index }: { card: CategoryCard; index: number }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [modalProfile, setModalProfile] = useState<ProfileSlide | null>(null);
  const touchStartX = useRef(0);
  const Icon = card.icon;

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % card.profiles.length);
  }, [card.profiles.length]);

  const goBack = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + card.profiles.length) % card.profiles.length);
  }, [card.profiles.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(advance, 6000);
    return () => clearInterval(timer);
  }, [advance, isPaused]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? advance() : goBack();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.15 }}
      >
        <div
          className="relative rounded-2xl border border-white/[0.08] overflow-hidden group/card transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 bg-charcoal"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top gradient accent */}
          <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${card.gradient} pointer-events-none`} />

          {/* Header */}
          <div className="relative px-5 pt-6 pb-4">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconBg} border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 shrink-0`}>
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white leading-snug mb-1">{card.title}</h3>
                <p className="text-[11px] text-white/35 leading-snug">{card.subtitle}</p>
              </div>
            </div>
            {/* Subcategory tags */}
            <div className="flex flex-wrap gap-1.5">
              {card.subcategories.map((sub) => (
                <span key={sub} className="text-[10px] text-primary/80 bg-primary/[0.08] rounded-lg px-2.5 py-1 border border-primary/15 font-medium">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {/* Slider area */}
          <div className="relative min-h-[160px]">
            <AnimatePresence mode="wait">
              <ProfileSlideContent
                key={activeIndex}
                profile={card.profiles[activeIndex]}
                onProfileClick={() => setModalProfile(card.profiles[activeIndex])}
              />
            </AnimatePresence>

            {/* Nav arrows */}
            <button
              onClick={goBack}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/5 backdrop-blur-sm opacity-0 group-hover/card:opacity-100 transition-all flex items-center justify-center hover:bg-white/10 border border-white/5"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-white/60" />
            </button>
            <button
              onClick={advance}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/5 backdrop-blur-sm opacity-0 group-hover/card:opacity-100 transition-all flex items-center justify-center hover:bg-white/10 border border-white/5"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-5">
            <SlideProgressBar current={activeIndex} total={card.profiles.length} onDotClick={setActiveIndex} isPaused={isPaused} />
          </div>

          {/* CTA footer */}
          <div className="relative px-5 py-5 mt-2">
            <p className="text-xs text-white/40 mb-3 leading-relaxed">
              <span className="text-primary font-semibold">{card.ctaHeadline}</span>{" "}
              {card.ctaSubline}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 flex-1 shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all"
                asChild
              >
                <Link to="/nominate?tier=gold-special">
                  Nominate <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10 font-medium text-xs h-9"
                asChild
              >
                <Link to="/nominate?tier=gold-special">Re-Nominate</Link>
              </Button>
            </div>
            {/* Secondary links */}
            <div className="flex items-center gap-4 mt-3">
              <Link to="/guidelines/edi-matrix" className="text-[10px] text-primary/50 hover:text-primary transition-colors inline-flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" /> EDI Eligibility
              </Link>
              <Link to="/nominees?tier=gold-special" className="text-[10px] text-white/25 hover:text-white/50 transition-colors inline-flex items-center gap-1">
                <Users className="w-3 h-3" /> All Profiles
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <ProfileModal
        profile={modalProfile}
        category={card.title}
        open={!!modalProfile}
        onClose={() => setModalProfile(null)}
      />
    </>
  );
}

// ─── Recognition Pathway Diagram (Horizontal) ────────────────
function RecognitionPathway() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-20 md:mt-28"
    >
      <div className="text-center mb-10">
        <Badge variant="outline" className="border-primary/20 text-primary/70 text-[10px] mb-3">
          Recognition Journey
        </Badge>
        <h3 className="text-xl md:text-2xl font-serif text-white font-semibold">
          From Nomination to <span className="text-primary">Icon</span>
        </h3>
      </div>

      <div className="max-w-4xl mx-auto bg-white/[0.02] rounded-2xl border border-white/[0.06] p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-2">
          {PATHWAY_STEPS.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <div key={step.label} className="relative flex flex-col items-center text-center group">
                {/* Step number */}
                <span className="text-[9px] text-primary/40 font-bold mb-2">{String(i + 1).padStart(2, '0')}</span>
                {/* Icon circle */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center mb-3 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
                  <StepIcon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-white leading-tight mb-0.5">{step.label}</span>
                <span className="text-[9px] text-white/30 leading-tight max-w-[120px]">{step.description}</span>
                {/* Connector arrow (hidden on last) */}
                {i < PATHWAY_STEPS.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-10 w-3.5 h-3.5 text-primary/20" />
                )}
              </div>
            );
          })}
        </div>

        {/* Pathway CTAs */}
        <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-white/[0.04]">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 shadow-md shadow-primary/10" asChild>
            <Link to="/nominate?tier=gold-special">
              <Award className="w-3.5 h-3.5 mr-1.5" /> Start Nomination
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 text-xs h-9" asChild>
            <Link to="/nominees?tier=gold-special">Access Nominee Dashboard</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Closing Statement ───────────────────────────────────────
function ClosingStatement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-20 md:mt-28"
    >
      {/* Impact statement */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-white/15 text-[10px] uppercase tracking-[0.25em] mb-8 font-medium">Recognition · Accountability · Impact</p>

        <div className="space-y-1 mb-8">
          <h3 className="text-2xl md:text-4xl font-serif text-white/90 leading-tight">
            Influence is powerful.
          </h3>
          <h3 className="text-2xl md:text-4xl font-serif text-primary leading-tight">
            Education impact is measurable.
          </h3>
          <h3 className="text-2xl md:text-4xl font-serif text-white/40 leading-tight">
            Africa deserves both.
          </h3>
        </div>

        <p className="text-primary/80 font-semibold text-sm tracking-wide mb-8">
          Nominate. Validate. Elevate Education.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all h-12 px-6" asChild>
            <Link to="/nominate?tier=gold-special">
              <Award className="w-4 h-4 mr-2" /> Nominate a Leader
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary/25 text-primary hover:bg-primary/10 h-12 px-6" asChild>
            <Link to="/nominate?tier=gold-special">Re-Nominate</Link>
          </Button>
          <Button size="lg" variant="ghost" className="text-white/30 hover:text-white hover:bg-white/5 h-12 px-6" asChild>
            <Link to="/guidelines/edi-matrix">
              <Globe className="w-4 h-4 mr-2" /> Platinum Pathway
            </Link>
          </Button>
        </div>
      </div>

      {/* Final CTA strip */}
      <div className="border-t border-white/[0.04] pt-10">
        <div className="text-center mb-6">
          <p className="text-white/35 text-sm mb-1">
            Know a <span className="text-primary font-medium">Sports Hero</span>? A{" "}
            <span className="text-primary font-medium">Music Leader</span>? A{" "}
            <span className="text-primary font-medium">Digital Educator</span>?
          </p>
          <p className="text-lg font-serif text-white font-semibold">
            Nominate Them Today.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/10" asChild>
            <Link to="/nominate?tier=gold-special">
              <Award className="w-4 h-4 mr-1.5" /> Submit Nomination
            </Link>
          </Button>
          <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10" asChild>
            <Link to="/nominate?tier=gold-special">
              <Megaphone className="w-4 h-4 mr-1.5" /> Re-Activate Nominee
            </Link>
          </Button>
          <Button variant="ghost" className="text-white/30 hover:text-white hover:bg-white/5" asChild>
            <Link to="/guidelines/edi-matrix">
              <Users className="w-4 h-4 mr-1.5" /> Volunteer as Reviewer
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ────────────────────────────────────────────
export function GoldSpecialRecognitionSection() {
  return (
    <section className="relative overflow-hidden" id="gold-special">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal pointer-events-none" />
      
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Africa map watermark */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 20 C85 25,70 40,65 55 C60 70,55 85,58 100 C60 115,65 125,75 135 C85 145,90 155,95 165 C97 170,100 175,103 170 C108 160,110 150,115 140 C125 125,135 115,138 100 C140 85,135 70,125 55 C115 40,110 25,100 20Z' fill='%23D4A528'/%3E%3C/svg%3E")`,
          backgroundSize: "800px",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-32">
        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/40" />
            <Badge variant="outline" className="border-primary/30 text-primary text-xs px-4 py-1 font-semibold tracking-wider">
              <Sparkles className="w-3 h-3 mr-1.5" />
              2025 EDITION
            </Badge>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-serif leading-[1.1] tracking-tight">
            Gold Special{" "}
            <span className="text-primary">Recognition</span>
          </h1>
          <p className="text-lg md:text-xl text-primary/70 font-medium mb-4">
            Cultural Impact Recognition
          </p>
          <p className="text-white/40 max-w-lg mx-auto text-sm md:text-base leading-relaxed mb-3">
            Celebrating cultural leaders using influence to advance education across Africa and the Diaspora.
          </p>
          <p className="text-primary/50 text-xs font-medium tracking-widest uppercase">
            Recognize Impact · Re-Nominate Champions · Discover New Voices
          </p>

          {/* Primary CTAs */}
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all h-12 px-6" asChild>
              <Link to="/nominate?tier=gold-special">
                <Award className="w-4 h-4 mr-2" /> Nominate a Leader
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/25 text-primary hover:bg-primary/10 h-12 px-6" asChild>
              <Link to="/nominate?tier=gold-special">Re-Nominate Honoree</Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-white/40 hover:text-primary hover:bg-primary/5 h-12" asChild>
              <Link to="/nominees?tier=gold-special">
                View Impact Profiles <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

          {/* Tier indicator */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/20">
            <div className="flex items-center gap-1.5 bg-white/[0.03] rounded-full px-4 py-1.5 border border-white/[0.05]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
              Platinum Clearance → Gold Special Recognition
            </div>
          </div>
        </motion.div>

        {/* ── 3 Category Cards ── */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {CATEGORIES.map((card, i) => (
            <GoldCategoryCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* ── Recognition Pathway ── */}
        <RecognitionPathway />

        {/* ── Closing Statement & CTAs ── */}
        <ClosingStatement />
      </div>
    </section>
  );
}

export default GoldSpecialRecognitionSection;
