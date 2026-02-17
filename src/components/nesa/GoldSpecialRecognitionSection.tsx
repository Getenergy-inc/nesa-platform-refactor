/**
 * Gold Special Recognition — 2025 Edition
 * Cultural Impact Recognition · 3 Categories
 * 
 * Master refactor: recognition pathway diagram, social CTA strip,
 * enhanced card layout with subcategories, live counters, share CTAs,
 * QR codes, EDI badges, and volunteer/partner engagement.
 */
import { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Music, Smartphone, ChevronRight, ChevronLeft,
  QrCode, Share2, ExternalLink, ShieldCheck,
  Award, Sparkles, Globe, Upload, Users, Eye,
  ArrowDown, CheckCircle2, Star, Megaphone, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

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
  accentGlow: string;
}

// ─── Profile Data ────────────────────────────────────────────
const SPORTS_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇳🇬", regionTag: "West Africa", country: "Nigeria", impactSummary: "Built 12 school libraries across rural Nigeria through sports foundation scholarships.", fullImpact: "Established a sports education foundation impacting 5,000+ students. Funded 12 school libraries, sponsored athletic scholarship programs, and partnered with local governments on youth mentorship.", ediVerified: true, nominationCount: 47, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇰🇪", regionTag: "East Africa", country: "Kenya", impactSummary: "Funded 500+ student athletes' education via marathon charity events.", fullImpact: "Organized annual charity marathons raising $1.2M for education. Programs support student athletes in 8 East African countries with tuition, equipment, and coaching.", ediVerified: true, nominationCount: 32, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇿🇦", regionTag: "Southern Africa", country: "South Africa", impactSummary: "Established after-school sports & learning hubs in 8 underserved communities.", fullImpact: "Created a network of 8 community hubs combining sports training with academic tutoring. Over 2,000 youth enrolled annually with 85% school retention rate.", ediVerified: false, nominationCount: 18, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇪🇬", regionTag: "North Africa", country: "Egypt", impactSummary: "Partnered with ministries on youth sports education policy reform across MENA.", fullImpact: "Advisory role in Ministry of Education sports integration policy. Advocated for mandatory physical education standards and after-school programs in public schools.", ediVerified: true, nominationCount: 24, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇨🇲", regionTag: "Central Africa", country: "Cameroon", impactSummary: "Created mobile learning centers combining athletics and literacy.", fullImpact: "Deployed 6 mobile education buses reaching 15,000 students in remote areas. Programs combine literacy training with sports activities to boost engagement.", ediVerified: false, nominationCount: 15, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇬🇧", regionTag: "Diaspora", country: "United Kingdom", impactSummary: "Raised $2M for African student-athlete scholarship programs globally.", fullImpact: "Founded an international scholarship fund supporting 200+ African student athletes at universities in UK, US, and Canada.", ediVerified: true, nominationCount: 56, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇺🇸", regionTag: "Friend of Africa", country: "United States", impactSummary: "International sports education alliance impacting 15 African nations.", fullImpact: "Built a cross-continental partnership connecting 15 African nations with US collegiate sports programs. Over 300 scholarships awarded annually.", ediVerified: true, nominationCount: 41, profileLink: "/nominees" },
];

const MUSIC_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇳🇬", regionTag: "West Africa", country: "Nigeria", impactSummary: "Scholarship foundation supporting 200+ students in music and STEM education.", fullImpact: "Created a foundation awarding full scholarships to 200+ students annually. Combines music education with STEM training. Raised $3M through concert tours.", ediVerified: true, nominationCount: 63, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇹🇿", regionTag: "East Africa", country: "Tanzania", impactSummary: "Youth mentorship program reaching 10,000+ aspiring musicians and learners.", fullImpact: "Runs a continent-wide mentorship program pairing established musicians with young talent. Academic requirements are built into the program structure.", ediVerified: true, nominationCount: 29, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇿🇦", regionTag: "Southern Africa", country: "South Africa", impactSummary: "Built 3 community learning centers through concert tour proceeds.", fullImpact: "Dedicated 15% of concert revenue to building fully equipped learning centers in Soweto, Khayelitsha, and Limpopo. Each center serves 500+ students daily.", ediVerified: false, nominationCount: 22, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇲🇦", regionTag: "North Africa", country: "Morocco", impactSummary: "Advocacy campaigns for girls' education reaching 5M+ social media impressions.", fullImpact: "Launched 'Music for Her Education' campaign driving awareness for girls' education access in North Africa. Generated policy discussions at AU level.", ediVerified: true, nominationCount: 35, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇨🇩", regionTag: "Central Africa", country: "DR Congo", impactSummary: "Music academy providing free education to displaced youth.", fullImpact: "Founded a free music and education academy for 1,200 displaced youth. Combines vocational music training with formal education certifications.", ediVerified: false, nominationCount: 12, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇫🇷", regionTag: "Diaspora", country: "France", impactSummary: "Global benefit concerts raising funds for African education infrastructure.", fullImpact: "Organized 25+ benefit concerts across Europe raising $5M for school construction in West and Central Africa. 12 schools built to date.", ediVerified: true, nominationCount: 48, profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇨🇦", regionTag: "Friend of Africa", country: "Canada", impactSummary: "Cross-cultural education exchange programs connecting 12 countries.", fullImpact: "Established a music education exchange connecting Canadian and African schools. Over 3,000 students have participated in cross-cultural learning programs.", ediVerified: true, nominationCount: 37, profileLink: "/nominees" },
];

const SOCIAL_MEDIA_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇬🇭", regionTag: "West Africa", country: "Ghana", impactSummary: "Educational content reaching 2M+ monthly views on scholarship opportunities.", fullImpact: "Creates viral education content helping students discover scholarship opportunities. Over 500 confirmed scholarship placements tracked from content referrals.", ediVerified: true, nominationCount: 71, platformIcons: ["YouTube", "TikTok"], profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇺🇬", regionTag: "East Africa", country: "Uganda", impactSummary: "Digital learning advocacy campaigns promoting free online courses.", fullImpact: "Curates and promotes free online learning resources in local languages. Community of 300K+ active learners across 6 East African countries.", ediVerified: true, nominationCount: 44, platformIcons: ["Instagram", "X"], profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇧🇼", regionTag: "Southern Africa", country: "Botswana", impactSummary: "Created viral education challenge reaching 500K+ participants across Africa.", fullImpact: "Launched #LearnAfricaChallenge generating 500K+ video submissions. Challenge drove measurable increases in online course enrollments across the continent.", ediVerified: false, nominationCount: 33, platformIcons: ["TikTok", "Instagram"], profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇹🇳", regionTag: "North Africa", country: "Tunisia", impactSummary: "Bilingual scholarship database platform connecting students with opportunities.", fullImpact: "Built and maintains a bilingual (Arabic/French) scholarship database serving 100K+ monthly visitors. Partnered with 50+ institutions for verified listings.", ediVerified: true, nominationCount: 28, platformIcons: ["YouTube", "LinkedIn"], profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇷🇼", regionTag: "Central Africa", country: "Rwanda", impactSummary: "CSR advocacy content driving corporate education partnerships.", fullImpact: "Creates compelling CSR content that has directly influenced 15+ corporate education sponsorship deals worth $2M+ in aggregate.", ediVerified: false, nominationCount: 19, platformIcons: ["LinkedIn", "X"], profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇩🇪", regionTag: "Diaspora", country: "Germany", impactSummary: "African education storytelling reaching global audiences weekly.", fullImpact: "Documentary-style content showcasing African education innovations. 5M+ views across platforms, featured by BBC Africa and CNN.", ediVerified: true, nominationCount: 52, platformIcons: ["YouTube", "Instagram"], profileLink: "/nominees" },
  { name: "Nominee Placeholder", region: "🇦🇺", regionTag: "Friend of Africa", country: "Australia", impactSummary: "International ed-tech collaboration spotlight series.", fullImpact: "Produces a weekly spotlight series connecting African ed-tech founders with international investors. 30+ startups funded through platform exposure.", ediVerified: true, nominationCount: 39, platformIcons: ["LinkedIn", "YouTube"], profileLink: "/nominees" },
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
    accentGlow: "from-amber-500/20 to-yellow-600/5",
  },
  {
    id: "music",
    title: "Africa Music Education Impact Recognition",
    subtitle: "Recognizing music artists championing education advocacy across Africa.",
    icon: Music,
    subcategories: ["Music Education Advocate (Artist / Producer / Cultural Ambassador)"],
    profiles: MUSIC_PROFILES,
    ctaHeadline: "Influence + Education = Impact",
    ctaSubline: "Recognize artists making a difference.",
    accentGlow: "from-gold/20 to-amber-700/5",
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
    accentGlow: "from-yellow-400/15 to-gold/5",
  },
];

// ─── Recognition Pathway Steps ───────────────────────────────
const PATHWAY_STEPS = [
  { label: "Nomination", icon: Award, description: "Submit or re-nominate a cultural leader" },
  { label: "EDI Review", icon: ShieldCheck, description: "Education Development Index evaluation" },
  { label: "Gold Special Recognition", icon: Star, description: "Gold Certificate of Recognition" },
  { label: "Platinum Stage", icon: CheckCircle2, description: "Platinum verification pathway" },
  { label: "Gold Public Voting", icon: Users, description: "Community-validated recognition" },
  { label: "Blue Garnet Icon", icon: Globe, description: "Africa Education Icon — Lifetime" },
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
            i === current ? "w-6 bg-primary" : "w-1.5 bg-secondary-foreground/15 hover:bg-secondary-foreground/25"
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
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
            <span className="text-2xl">{profile.region}</span>
          </div>
          {profile.ediVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center border-2 border-secondary" title="EDI Verified">
              <ShieldCheck className="w-3 h-3 text-success-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-semibold text-secondary-foreground text-sm group-hover:text-primary transition-colors">{profile.name}</span>
            <Badge variant="outline" className="text-[10px] border-primary/25 text-primary/80 px-1.5 py-0 h-4">
              {profile.regionTag}
            </Badge>
          </div>
          <p className="text-secondary-foreground/50 text-xs leading-relaxed mb-1.5">
            {profile.impactSummary}
          </p>
          {profile.platformIcons && (
            <div className="flex gap-1">
              {profile.platformIcons.map((p) => (
                <span key={p} className="text-[9px] text-primary/60 bg-primary/[0.08] rounded px-1.5 py-0.5 border border-primary/10">{p}</span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 mt-1">
            {profile.nominationCount && profile.nominationCount > 0 && (
              <span className="text-[10px] text-secondary-foreground/30 inline-flex items-center gap-1">
                <Heart className="w-2.5 h-2.5" /> {profile.nominationCount} nominations
              </span>
            )}
            <Link
              to={profile.profileLink || "/nominees"}
              className="text-[10px] text-primary/60 hover:text-primary transition-colors inline-flex items-center gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-2.5 h-2.5" /> View Profile
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="text-[10px] border-primary/25 text-primary hover:bg-primary/10 hover:border-primary/40 h-6 px-2 rounded-md"
            asChild
          >
            <Link to="/nominate?tier=gold-special">Re-Nominate</Link>
          </Button>
          <button
            className="text-secondary-foreground/25 hover:text-primary transition-colors p-1"
            aria-label="Share"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({ title: `Nominate ${profile.name}`, url: window.location.href });
              }
            }}
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
      <DialogContent className="bg-secondary border-primary/20 text-secondary-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-serif text-lg">{profile.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <span className="text-3xl">{profile.region}</span>
              </div>
              {profile.ediVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-secondary">
                  <ShieldCheck className="w-3.5 h-3.5 text-success-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-secondary-foreground/70">{profile.country} · {profile.regionTag}</p>
              <p className="text-xs text-primary/60 mt-1">{category}</p>
              {profile.ediVerified && (
                <Badge className="mt-1.5 bg-success/15 text-success border-success/30 text-[10px]">
                  <ShieldCheck className="w-3 h-3 mr-1" /> EDI Verified
                </Badge>
              )}
            </div>
          </div>

          {/* Full impact */}
          <div className="bg-secondary-foreground/5 rounded-lg p-4 border border-secondary-foreground/5">
            <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-2">Education Impact</h4>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed">{profile.fullImpact}</p>
          </div>

          {/* EDI compliance notice */}
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
            <p className="text-[11px] text-secondary-foreground/50 leading-relaxed">
              <span className="text-primary font-medium">EDI Compliance:</span> All Gold Special Recognition nominees are evaluated against the Education Development Index (EDI) Matrix. Verified nominees have passed measurable impact assessment.
            </p>
          </div>

          {/* Platform icons */}
          {profile.platformIcons && (
            <div className="flex gap-2">
              {profile.platformIcons.map((p) => (
                <span key={p} className="text-xs text-primary/60 bg-primary/[0.08] rounded-md px-2.5 py-1 border border-primary/10">{p}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9" asChild>
              <Link to="/nominate?tier=gold-special">Support Nomination</Link>
            </Button>
            <Button variant="outline" className="flex-1 border-primary/25 text-primary hover:bg-primary/10 text-xs h-9" asChild>
              <Link to="/nominate?tier=gold-special">
                Submit Evidence <Upload className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          <p className="text-[10px] text-secondary-foreground/25 text-center">
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
        className="relative rounded-2xl border border-primary/15 overflow-hidden group/card transition-all duration-300 hover:border-primary/30"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Card background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,10%)] to-secondary" />
        <div className={`absolute inset-0 bg-gradient-to-br ${card.accentGlow} pointer-events-none`} />
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 30px hsl(var(--primary) / 0.05)' }} />

        {/* Header */}
        <div className="relative px-5 pt-5 pb-3 border-b border-secondary-foreground/5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-md shadow-primary/5">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-bold text-secondary-foreground leading-tight mb-1">{card.title}</h3>
              <p className="text-[10px] text-secondary-foreground/40 leading-snug">{card.subtitle}</p>
            </div>
          </div>
          {/* Subcategories */}
          <div className="flex flex-wrap gap-1">
            {card.subcategories.map((sub) => (
              <span key={sub} className="text-[9px] text-primary/70 bg-primary/[0.08] rounded-full px-2 py-0.5 border border-primary/10">
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Slider area */}
        <div className="relative min-h-[140px]">
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
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-secondary-foreground/5 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center hover:bg-secondary-foreground/10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-secondary-foreground/50" />
          </button>
          <button
            onClick={advance}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-secondary-foreground/5 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center hover:bg-secondary-foreground/10"
            aria-label="Next"
          >
            <ChevronRight className="w-3.5 h-3.5 text-secondary-foreground/50" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="px-5 pb-1">
          <SlideDots current={activeIndex} total={card.profiles.length} onDotClick={setActiveIndex} />
        </div>

        {/* CTA footer */}
        <div className="relative px-5 py-4 mt-1 border-t border-secondary-foreground/5">
          <p className="text-[11px] text-secondary-foreground/50 mb-3 leading-relaxed">
            <span className="text-primary font-medium">{card.ctaHeadline}</span>{" "}
            {card.ctaSubline}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[11px] h-8 flex-1 shadow-md shadow-primary/10 hover:shadow-primary/20 transition-shadow"
              asChild
            >
              <Link to="/nominate?tier=gold-special">
                Nominate New Person <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </Button>
            <button
              className="w-8 h-8 rounded-lg border border-primary/15 flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
              aria-label="QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
          {/* Download & Eligibility links */}
          <div className="flex items-center gap-3 mt-3">
            <Link to="/guidelines/edi-matrix" className="text-[10px] text-primary/50 hover:text-primary transition-colors inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> View Eligibility (EDI)
            </Link>
            <Link to="/nominees?tier=gold-special" className="text-[10px] text-secondary-foreground/30 hover:text-secondary-foreground/60 transition-colors inline-flex items-center gap-1">
              <Users className="w-3 h-3" /> View All Profiles
            </Link>
          </div>
        </div>
      </div>

      <ProfileModal
        profile={modalProfile}
        category={card.title}
        open={!!modalProfile}
        onClose={() => setModalProfile(null)}
      />
    </>
  );
}

// ─── Recognition Pathway Diagram ─────────────────────────────
function RecognitionPathway() {
  return (
    <div className="mt-16 md:mt-20">
      <h3 className="text-center text-lg font-serif text-secondary-foreground mb-8">
        Recognition Pathway
      </h3>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-0">
          {PATHWAY_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center text-center w-28">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[11px] font-semibold text-secondary-foreground leading-tight">{step.label}</span>
                  <span className="text-[9px] text-secondary-foreground/40 mt-0.5 leading-tight">{step.description}</span>
                </div>
                {i < PATHWAY_STEPS.length - 1 && (
                  <div className="hidden md:flex items-center text-primary/30 mx-1">
                    <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                  </div>
                )}
                {i < PATHWAY_STEPS.length - 1 && (
                  <div className="md:hidden flex items-center text-primary/30 my-1">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Pathway CTAs */}
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs" asChild>
            <Link to="/nominate?tier=gold-special">Start Nomination</Link>
          </Button>
          <Button size="sm" variant="outline" className="border-primary/25 text-primary hover:bg-primary/10 text-xs" asChild>
            <Link to="/nominees?tier=gold-special">Access Nominee Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Social CTA Footer Strip ─────────────────────────────────
function SocialCTAStrip() {
  return (
    <div className="mt-16 border-t border-secondary-foreground/5 pt-10">
      <div className="text-center mb-6">
        <p className="text-secondary-foreground/50 text-sm mb-1">
          Know a <span className="text-primary font-medium">Sports Hero</span>? A{" "}
          <span className="text-primary font-medium">Music Leader</span>? A{" "}
          <span className="text-primary font-medium">Digital Educator</span>?
        </p>
        <p className="text-lg font-serif text-secondary-foreground font-semibold">
          Nominate Them Today.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/10" asChild>
          <Link to="/nominate?tier=gold-special">
            <Award className="w-4 h-4 mr-1.5" /> Submit Nomination
          </Link>
        </Button>
        <Button variant="outline" className="border-primary/25 text-primary hover:bg-primary/10" asChild>
          <Link to="/nominate?tier=gold-special">
            <Megaphone className="w-4 h-4 mr-1.5" /> Re-Activate Nominee
          </Link>
        </Button>
        <Button variant="ghost" className="text-secondary-foreground/40 hover:text-secondary-foreground hover:bg-secondary-foreground/5" asChild>
          <Link to="/guidelines/edi-matrix">
            <Users className="w-4 h-4 mr-1.5" /> Volunteer as Reviewer
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────
export function GoldSpecialRecognitionSection() {
  return (
    <section className="relative overflow-hidden" id="gold-special">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%)] via-secondary to-[hsl(220,30%,8%)] pointer-events-none" />

      {/* Africa map watermark */}
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
            <Sparkles className="w-4 h-4 text-primary/60" />
            <Badge variant="outline" className="border-primary/25 text-primary text-[11px] px-3 py-0.5">
              2025 Edition
            </Badge>
            <Sparkles className="w-4 h-4 text-primary/60" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-foreground mb-3 font-serif leading-tight">
            Gold Special Recognition
          </h2>
          <p className="text-lg text-primary/80 font-medium mb-3">Cultural Impact Recognition</p>
          <p className="text-secondary-foreground/45 max-w-xl mx-auto text-sm leading-relaxed mb-2">
            Celebrating cultural leaders using influence to advance education across Africa and the Diaspora.
          </p>
          <p className="text-primary/60 text-xs font-medium tracking-wide">
            Recognize Impact · Re-Nominate Champions · Discover New Voices
          </p>

          {/* Primary CTAs */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-shadow" asChild>
              <Link to="/nominate?tier=gold-special">
                <Award className="w-4 h-4 mr-1.5" /> Nominate a Leader
              </Link>
            </Button>
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" asChild>
              <Link to="/nominate?tier=gold-special">Re-Nominate an Existing Honoree</Link>
            </Button>
            <Button variant="ghost" className="text-secondary-foreground/50 hover:text-primary hover:bg-primary/5" asChild>
              <Link to="/nominees?tier=gold-special">
                View All Impact Profiles <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-secondary-foreground/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            Platinum Clearance → Gold Special Recognition
          </div>
        </div>

        {/* ── 3 Category Cards ── */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {CATEGORIES.map((card) => (
            <GoldCategoryCard key={card.id} card={card} />
          ))}
        </div>

        {/* ── Recognition Pathway Diagram ── */}
        <RecognitionPathway />

        {/* ── Closing Banner ── */}
        <div className="mt-16 md:mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-secondary-foreground/20 text-xs uppercase tracking-[0.2em] mb-4">Recognition · Accountability · Impact</p>

            <h3 className="text-2xl md:text-3xl font-serif text-secondary-foreground mb-2 leading-tight">
              Influence is powerful.
            </h3>
            <h3 className="text-2xl md:text-3xl font-serif text-primary mb-2 leading-tight">
              Education impact is measurable.
            </h3>
            <h3 className="text-2xl md:text-3xl font-serif text-secondary-foreground/60 mb-6 leading-tight">
              Africa deserves both.
            </h3>

            <p className="text-primary font-semibold text-sm mb-6 tracking-wide">
              Nominate. Validate. Elevate Education.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow" asChild>
                <Link to="/nominate?tier=gold-special">
                  <Award className="w-4 h-4 mr-1.5" /> Nominate
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" asChild>
                <Link to="/nominate?tier=gold-special">Re-Nominate</Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-secondary-foreground/40 hover:text-secondary-foreground hover:bg-secondary-foreground/5" asChild>
                <Link to="/guidelines/edi-matrix">
                  <Globe className="w-4 h-4 mr-1.5" /> View Platinum Pathway
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Social CTA Footer Strip ── */}
        <SocialCTAStrip />
      </div>
    </section>
  );
}

export default GoldSpecialRecognitionSection;
