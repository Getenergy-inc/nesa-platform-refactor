/**
 * Gold Special Recognition — 2025 Edition
 * Cultural Impact Recognition · 3 Categories
 * 
 * Premium conversion-engine section with:
 * - 3 luxury category cards (Sports, Music, Social Media)
 * - 7-profile auto-rotating slider (2s, pause on hover)
 * - Profile detail modal with EDI compliance
 * - Gold metallic + dark navy aesthetic
 * - Mobile-first responsive with touch swipe
 * - Persistent QR code + share CTAs
 */
import { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Music, Smartphone, ChevronRight, ChevronLeft,
  QrCode, Share2, ExternalLink, ShieldCheck, X,
  Instagram, Youtube, Award, Sparkles, Globe, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ─── Types ───────────────────────────────────────────────────
interface ProfileSlide {
  name: string;
  region: string;
  regionTag: string;
  country: string;
  impactLine1: string;
  impactLine2: string;
  fullImpact: string;
  ediVerified: boolean;
  platformIcons?: string[];
  nominationCount?: number;
}

interface CategoryCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  tags: string[];
  profiles: ProfileSlide[];
  ctaHeadline: string;
  ctaSubline: string;
  finalSlideHeadline: string;
  accentClass: string;
}

// ─── Profile Data ────────────────────────────────────────────
const SPORTS_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇳🇬", regionTag: "West Africa", country: "Nigeria", impactLine1: "Built 12 school libraries across rural Nigeria", impactLine2: "through sports foundation scholarships.", fullImpact: "Established a sports education foundation impacting 5,000+ students. Funded 12 school libraries, sponsored athletic scholarship programs, and partnered with local governments on youth mentorship.", ediVerified: true, nominationCount: 47 },
  { name: "Nominee Placeholder", region: "🇰🇪", regionTag: "East Africa", country: "Kenya", impactLine1: "Funded 500+ student athletes' education", impactLine2: "via marathon charity events.", fullImpact: "Organized annual charity marathons raising $1.2M for education. Programs support student athletes in 8 East African countries with tuition, equipment, and coaching.", ediVerified: true, nominationCount: 32 },
  { name: "Nominee Placeholder", region: "🇿🇦", regionTag: "Southern Africa", country: "South Africa", impactLine1: "Established after-school sports & learning hubs", impactLine2: "in 8 underserved communities.", fullImpact: "Created a network of 8 community hubs combining sports training with academic tutoring. Over 2,000 youth enrolled annually with 85% school retention rate.", ediVerified: false, nominationCount: 18 },
  { name: "Nominee Placeholder", region: "🇪🇬", regionTag: "North Africa", country: "Egypt", impactLine1: "Partnered with ministries on youth sports education", impactLine2: "policy reform across MENA.", fullImpact: "Advisory role in Ministry of Education sports integration policy. Advocated for mandatory physical education standards and after-school programs in public schools.", ediVerified: true, nominationCount: 24 },
  { name: "Nominee Placeholder", region: "🇨🇲", regionTag: "Central Africa", country: "Cameroon", impactLine1: "Created mobile learning centers", impactLine2: "combining athletics and literacy.", fullImpact: "Deployed 6 mobile education buses reaching 15,000 students in remote areas. Programs combine literacy training with sports activities to boost engagement.", ediVerified: false, nominationCount: 15 },
  { name: "Nominee Placeholder", region: "🇬🇧", regionTag: "Diaspora", country: "United Kingdom", impactLine1: "Raised $2M for African student-athlete", impactLine2: "scholarship programs globally.", fullImpact: "Founded an international scholarship fund supporting 200+ African student athletes at universities in UK, US, and Canada. Advocacy campaigns reaching 10M+ impressions.", ediVerified: true, nominationCount: 56 },
  { name: "Nominee Placeholder", region: "🇺🇸", regionTag: "Friend of Africa", country: "United States", impactLine1: "International sports education alliance", impactLine2: "impacting 15 African nations.", fullImpact: "Built a cross-continental partnership connecting 15 African nations with US collegiate sports programs. Over 300 scholarships awarded annually.", ediVerified: true, nominationCount: 41 },
];

const MUSIC_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇳🇬", regionTag: "West Africa", country: "Nigeria", impactLine1: "Scholarship foundation supporting 200+ students", impactLine2: "in music and STEM education.", fullImpact: "Created a foundation awarding full scholarships to 200+ students annually. Combines music education with STEM training. Raised $3M through concert tours.", ediVerified: true, nominationCount: 63 },
  { name: "Nominee Placeholder", region: "🇹🇿", regionTag: "East Africa", country: "Tanzania", impactLine1: "Youth mentorship program reaching 10,000+", impactLine2: "aspiring musicians and learners.", fullImpact: "Runs a continent-wide mentorship program pairing established musicians with young talent. Academic requirements are built into the program structure.", ediVerified: true, nominationCount: 29 },
  { name: "Nominee Placeholder", region: "🇿🇦", regionTag: "Southern Africa", country: "South Africa", impactLine1: "Built 3 community learning centers", impactLine2: "through concert tour proceeds.", fullImpact: "Dedicated 15% of concert revenue to building fully equipped learning centers in Soweto, Khayelitsha, and Limpopo. Each center serves 500+ students daily.", ediVerified: false, nominationCount: 22 },
  { name: "Nominee Placeholder", region: "🇲🇦", regionTag: "North Africa", country: "Morocco", impactLine1: "Advocacy campaigns for girls' education", impactLine2: "reaching 5M+ social media impressions.", fullImpact: "Launched 'Music for Her Education' campaign driving awareness for girls' education access in North Africa. Generated policy discussions at AU level.", ediVerified: true, nominationCount: 35 },
  { name: "Nominee Placeholder", region: "🇨🇩", regionTag: "Central Africa", country: "DR Congo", impactLine1: "Music academy providing free education", impactLine2: "to displaced youth.", fullImpact: "Founded a free music and education academy for 1,200 displaced youth. Combines vocational music training with formal education certifications.", ediVerified: false, nominationCount: 12 },
  { name: "Nominee Placeholder", region: "🇫🇷", regionTag: "Diaspora", country: "France", impactLine1: "Global benefit concerts raising funds for", impactLine2: "African education infrastructure.", fullImpact: "Organized 25+ benefit concerts across Europe raising $5M for school construction in West and Central Africa. 12 schools built to date.", ediVerified: true, nominationCount: 48 },
  { name: "Nominee Placeholder", region: "🇨🇦", regionTag: "Friend of Africa", country: "Canada", impactLine1: "Cross-cultural education exchange programs", impactLine2: "connecting 12 countries.", fullImpact: "Established a music education exchange connecting Canadian and African schools. Over 3,000 students have participated in cross-cultural learning programs.", ediVerified: true, nominationCount: 37 },
];

const SOCIAL_MEDIA_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇬🇭", regionTag: "West Africa", country: "Ghana", impactLine1: "Educational content reaching 2M+ monthly views", impactLine2: "on scholarship opportunities.", fullImpact: "Creates viral education content helping students discover scholarship opportunities. Over 500 confirmed scholarship placements tracked from content referrals.", ediVerified: true, nominationCount: 71, platformIcons: ["YouTube", "TikTok"] },
  { name: "Nominee Placeholder", region: "🇺🇬", regionTag: "East Africa", country: "Uganda", impactLine1: "Digital learning advocacy campaigns", impactLine2: "promoting free online courses.", fullImpact: "Curates and promotes free online learning resources in local languages. Community of 300K+ active learners across 6 East African countries.", ediVerified: true, nominationCount: 44, platformIcons: ["Instagram", "X"] },
  { name: "Nominee Placeholder", region: "🇧🇼", regionTag: "Southern Africa", country: "Botswana", impactLine1: "Created viral education challenge reaching", impactLine2: "500K+ participants across Africa.", fullImpact: "Launched #LearnAfricaChallenge generating 500K+ video submissions. Challenge drove measurable increases in online course enrollments across the continent.", ediVerified: false, nominationCount: 33, platformIcons: ["TikTok", "Instagram"] },
  { name: "Nominee Placeholder", region: "🇹🇳", regionTag: "North Africa", country: "Tunisia", impactLine1: "Bilingual scholarship database platform", impactLine2: "connecting students with opportunities.", fullImpact: "Built and maintains a bilingual (Arabic/French) scholarship database serving 100K+ monthly visitors. Partnered with 50+ institutions for verified listings.", ediVerified: true, nominationCount: 28, platformIcons: ["YouTube", "LinkedIn"] },
  { name: "Nominee Placeholder", region: "🇷🇼", regionTag: "Central Africa", country: "Rwanda", impactLine1: "CSR advocacy content driving corporate", impactLine2: "education partnerships.", fullImpact: "Creates compelling CSR content that has directly influenced 15+ corporate education sponsorship deals worth $2M+ in aggregate.", ediVerified: false, nominationCount: 19, platformIcons: ["LinkedIn", "X"] },
  { name: "Nominee Placeholder", region: "🇩🇪", regionTag: "Diaspora", country: "Germany", impactLine1: "African education storytelling reaching", impactLine2: "global audiences weekly.", fullImpact: "Documentary-style content showcasing African education innovations. 5M+ views across platforms, featured by BBC Africa and CNN.", ediVerified: true, nominationCount: 52, platformIcons: ["YouTube", "Instagram"] },
  { name: "Nominee Placeholder", region: "🇦🇺", regionTag: "Friend of Africa", country: "Australia", impactLine1: "International ed-tech collaboration", impactLine2: "spotlight series.", fullImpact: "Produces a weekly spotlight series connecting African ed-tech founders with international investors. 30+ startups funded through platform exposure.", ediVerified: true, nominationCount: 39, platformIcons: ["LinkedIn", "YouTube"] },
];

const CATEGORIES: CategoryCard[] = [
  {
    id: "sports",
    title: "Africa Sports Education Impact Recognition",
    subtitle: "Recognizing sportsmen and sportswomen championing education advocacy across Africa",
    icon: Trophy,
    tags: ["Direct Education Investment", "Youth Mentorship & School Advocacy"],
    profiles: SPORTS_PROFILES,
    ctaHeadline: "Know a stronger sports education advocate?",
    ctaSubline: "Nominate today.",
    finalSlideHeadline: "Athletic excellence meets education advocacy.",
    accentClass: "from-amber-500/20 to-yellow-600/5",
  },
  {
    id: "music",
    title: "Africa Music Education Impact Recognition",
    subtitle: "Recognizing music artists championing education advocacy",
    icon: Music,
    tags: ["Education Investment & Youth Advocacy"],
    profiles: MUSIC_PROFILES,
    ctaHeadline: "Influence + Education = Impact",
    ctaSubline: "Recognize artists making a difference.",
    finalSlideHeadline: "Music moves culture. Education transforms nations.",
    accentClass: "from-gold/20 to-amber-700/5",
  },
  {
    id: "social-media",
    title: "Africa Social Media Education Impact Recognition",
    subtitle: "Recognizing digital influencers championing education advocacy",
    icon: Smartphone,
    tags: ["Digital Learning Advocacy", "Scholarship Awareness", "Youth Empowerment"],
    profiles: SOCIAL_MEDIA_PROFILES,
    ctaHeadline: "Digital Influence Must Show Education Impact.",
    ctaSubline: "Nominate an influencer championing education.",
    finalSlideHeadline: "Every post can power a scholarship.",
    accentClass: "from-yellow-400/15 to-gold/5",
  },
];

// ─── Slide Progress Dots ─────────────────────────────────────
function SlideDots({ current, total, onDotClick }: { current: number; total: number; onDotClick: (i: number) => void }) {
  return (
    <div className="flex gap-1.5 justify-center mt-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i === current ? "w-6 bg-gold" : "w-1.5 bg-white/15 hover:bg-white/25"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── Profile Slide ───────────────────────────────────────────
function ProfileSlideContent({
  profile,
  onProfileClick,
}: {
  profile: ProfileSlide;
  onProfileClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="px-4 py-3"
    >
      <div className="flex items-start gap-4 cursor-pointer group" onClick={onProfileClick}>
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/40 to-gold-dark/20 border-2 border-gold/30 flex items-center justify-center shadow-lg shadow-gold/10">
            <span className="text-2xl">{profile.region}</span>
          </div>
          {profile.ediVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-charcoal" title="EDI Verified">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-semibold text-white text-sm group-hover:text-gold transition-colors">{profile.name}</span>
            <Badge variant="outline" className="text-[10px] border-gold/25 text-gold/80 px-1.5 py-0 h-4">
              {profile.regionTag}
            </Badge>
          </div>
          <p className="text-white/50 text-xs leading-relaxed mb-1.5">
            {profile.impactLine1}<br />{profile.impactLine2}
          </p>
          {profile.platformIcons && (
            <div className="flex gap-1">
              {profile.platformIcons.map((p) => (
                <span key={p} className="text-[9px] text-gold/60 bg-gold/8 rounded px-1.5 py-0.5 border border-gold/10">{p}</span>
              ))}
            </div>
          )}
          {profile.nominationCount && profile.nominationCount > 0 && (
            <span className="text-[10px] text-white/30 mt-1 inline-block">{profile.nominationCount} nominations</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="text-[10px] border-gold/25 text-gold hover:bg-gold/10 hover:border-gold/40 h-6 px-2 rounded-md"
            onClick={(e) => { e.stopPropagation(); window.location.href = '/nominate?tier=gold-special'; }}
          >
            Re-Nominate
          </Button>
          <button
            className="text-white/25 hover:text-gold transition-colors p-1"
            aria-label="Share"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="w-3 h-3" />
          </button>
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
      <DialogContent className="bg-charcoal border-gold/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gold font-serif text-lg">{profile.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/40 to-gold-dark/20 border-2 border-gold/30 flex items-center justify-center">
                <span className="text-3xl">{profile.region}</span>
              </div>
              {profile.ediVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-charcoal">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-white/70">{profile.country} · {profile.regionTag}</p>
              <p className="text-xs text-gold/60 mt-1">{category}</p>
              {profile.ediVerified && (
                <Badge className="mt-1.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                  <ShieldCheck className="w-3 h-3 mr-1" /> EDI Verified
                </Badge>
              )}
            </div>
          </div>

          {/* Full impact */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/5">
            <h4 className="text-xs font-semibold text-gold/80 uppercase tracking-wider mb-2">Education Impact</h4>
            <p className="text-sm text-white/70 leading-relaxed">{profile.fullImpact}</p>
          </div>

          {/* EDI compliance notice */}
          <div className="bg-gold/5 rounded-lg p-3 border border-gold/10">
            <p className="text-[11px] text-white/50 leading-relaxed">
              <span className="text-gold font-medium">EDI Compliance:</span> All Gold Special Recognition nominees are evaluated against the Education Development Index (EDI) Matrix. Verified nominees have passed measurable impact assessment.
            </p>
          </div>

          {/* Platform icons */}
          {profile.platformIcons && (
            <div className="flex gap-2">
              {profile.platformIcons.map((p) => (
                <span key={p} className="text-xs text-gold/60 bg-gold/8 rounded-md px-2.5 py-1 border border-gold/10">{p}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-gold hover:bg-gold-dark text-charcoal font-semibold text-xs h-9"
              onClick={() => window.location.href = '/nominate?tier=gold-special'}
            >
              Support Nomination
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gold/25 text-gold hover:bg-gold/10 text-xs h-9"
              onClick={() => window.location.href = '/nominate?tier=gold-special'}
            >
              Submit Evidence
              <Upload className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <p className="text-[10px] text-white/25 text-center">
            Platinum Clearance pathway available after Gold eligibility verification.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Gold Category Card ──────────────────────────────────────
function GoldCategoryCard({ card }: { card: CategoryCard }) {
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
    const timer = setInterval(advance, 2000);
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
      <div
        className="relative rounded-2xl border border-gold/15 overflow-hidden group/card transition-all duration-300 hover:border-gold/30"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Card background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,10%)] to-charcoal" />
        <div className={`absolute inset-0 bg-gradient-to-br ${card.accentClass} pointer-events-none`} />

        {/* Subtle gold border glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 30px rgba(212, 165, 40, 0.05)' }} />

        {/* Header */}
        <div className="relative px-5 pt-5 pb-3 border-b border-white/5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center shadow-md shadow-gold/5">
              <Icon className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-bold text-white leading-tight mb-1">{card.title}</h3>
              <p className="text-[10px] text-white/40 leading-snug">{card.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {card.tags.map((tag) => (
              <span key={tag} className="text-[9px] text-gold/70 bg-gold/8 rounded-full px-2 py-0.5 border border-gold/10">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Slider area */}
        <div className="relative min-h-[130px]">
          <AnimatePresence mode="wait">
            <ProfileSlideContent
              key={activeIndex}
              profile={card.profiles[activeIndex]}
              onProfileClick={() => setModalProfile(card.profiles[activeIndex])}
            />
          </AnimatePresence>

          {/* Nav arrows (visible on hover) */}
          <button
            onClick={goBack}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/5 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center hover:bg-white/10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white/50" />
          </button>
          <button
            onClick={advance}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/5 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center hover:bg-white/10"
            aria-label="Next"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="px-5 pb-1">
          <SlideDots current={activeIndex} total={card.profiles.length} onDotClick={setActiveIndex} />
        </div>

        {/* CTA footer */}
        <div className="relative px-5 py-4 mt-1 border-t border-white/5">
          <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
            <span className="text-gold font-medium">{card.ctaHeadline}</span>{" "}
            {card.ctaSubline}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-[11px] h-8 flex-1 shadow-md shadow-gold/10 hover:shadow-gold/20 transition-shadow"
              onClick={() => window.location.href = `/nominate?tier=gold-special`}
            >
              Nominate New Person
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
            <button
              className="w-8 h-8 rounded-lg border border-gold/15 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all"
              aria-label="QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Detail Modal */}
      <ProfileModal
        profile={modalProfile}
        category={card.title}
        open={!!modalProfile}
        onClose={() => setModalProfile(null)}
      />
    </>
  );
}

// ─── Main Section ────────────────────────────────────────────
export function GoldSpecialRecognitionSection() {
  return (
    <section className="relative overflow-hidden" id="gold-special">
      {/* Deep navy-to-charcoal background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%)] via-charcoal to-[hsl(220,30%,8%)] pointer-events-none" />

      {/* Subtle Africa map watermark */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 20 C85 25,70 40,65 55 C60 70,55 85,58 100 C60 115,65 125,75 135 C85 145,90 155,95 165 C97 170,100 175,103 170 C108 160,110 150,115 140 C125 125,135 115,138 100 C140 85,135 70,125 55 C115 40,110 25,100 20Z' fill='%23D4A528'/%3E%3C/svg%3E")`,
          backgroundSize: "700px",
          backgroundPosition: "center 40%",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* ── Section Header ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-gold/60" />
            <Badge variant="outline" className="border-gold/25 text-gold text-[11px] px-3 py-0.5">
              2025 Edition
            </Badge>
            <Sparkles className="w-4 h-4 text-gold/60" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 font-serif leading-tight">
            Gold Special Recognition
          </h2>
          <p className="text-lg text-gold/80 font-medium mb-3">Cultural Impact Recognition</p>
          <p className="text-white/45 max-w-xl mx-auto text-sm leading-relaxed">
            Celebrating sports icons, music artists, and digital voices using their influence to advance education across Africa and beyond.
          </p>

          {/* Primary CTAs */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Button
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold shadow-lg shadow-gold/15 hover:shadow-gold/25 transition-shadow"
              onClick={() => window.location.href = '/nominate?tier=gold-special'}
            >
              <Award className="w-4 h-4 mr-1.5" />
              Nominate
            </Button>
            <Button
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10"
              onClick={() => window.location.href = '/nominate?tier=gold-special'}
            >
              Re-Nominate
            </Button>
            <Button
              variant="ghost"
              className="text-white/50 hover:text-gold hover:bg-gold/5"
              onClick={() => window.location.href = '/guidelines/edi-matrix'}
            >
              View Eligibility
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>

          {/* Pathway indicator */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
            Platinum Clearance → Gold Special Recognition
          </div>
        </div>

        {/* ── 3 Category Cards ── */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {CATEGORIES.map((card) => (
            <GoldCategoryCard key={card.id} card={card} />
          ))}
        </div>

        {/* ── Closing Banner ── */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-white/20 text-xs uppercase tracking-[0.2em] mb-4">Recognition · Accountability · Impact</p>

            <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 leading-tight">
              Influence is powerful.
            </h3>
            <h3 className="text-2xl md:text-3xl font-serif text-gold mb-2 leading-tight">
              Education impact is measurable.
            </h3>
            <h3 className="text-2xl md:text-3xl font-serif text-white/60 mb-6 leading-tight">
              Africa deserves both.
            </h3>

            <p className="text-gold font-semibold text-sm mb-6 tracking-wide">
              Nominate. Validate. Elevate Education.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-bold shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-shadow"
                onClick={() => window.location.href = '/nominate?tier=gold-special'}
              >
                <Award className="w-4 h-4 mr-1.5" />
                Nominate
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10"
                onClick={() => window.location.href = '/nominate?tier=gold-special'}
              >
                Re-Nominate
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white/40 hover:text-white hover:bg-white/5"
                onClick={() => window.location.href = '/guidelines/edi-matrix'}
              >
                <Globe className="w-4 h-4 mr-1.5" />
                View Platinum Pathway
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GoldSpecialRecognitionSection;
