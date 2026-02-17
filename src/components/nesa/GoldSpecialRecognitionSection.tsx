/**
 * Gold Special Recognition — 2025 Edition
 * Cultural Impact Recognition · 3 Categories
 * 
 * Premium section with auto-rotating 7-profile sliders per category card.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Music, Smartphone, ChevronRight, QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Data Types ---
interface ProfileSlide {
  name: string;
  region: string;
  regionTag: "West Africa" | "East Africa" | "Southern Africa" | "North Africa" | "Central Africa" | "Diaspora" | "Friend of Africa";
  impactLine1: string;
  impactLine2: string;
  platformIcons?: string[];
}

interface CategoryCard {
  id: string;
  title: string;
  icon: React.ElementType;
  tags: string[];
  profiles: ProfileSlide[];
  ctaHeadline: string;
  ctaDescription: string;
}

// --- Profile Data ---
const SPORTS_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇳🇬", regionTag: "West Africa", impactLine1: "Built 12 school libraries across rural Nigeria", impactLine2: "through sports foundation scholarships." },
  { name: "Nominee Placeholder", region: "🇰🇪", regionTag: "East Africa", impactLine1: "Funded 500+ student athletes' education", impactLine2: "via marathon charity events." },
  { name: "Nominee Placeholder", region: "🇿🇦", regionTag: "Southern Africa", impactLine1: "Established after-school sports & learning hubs", impactLine2: "in 8 underserved communities." },
  { name: "Nominee Placeholder", region: "🇪🇬", regionTag: "North Africa", impactLine1: "Partnered with ministries on youth sports education", impactLine2: "policy reform across MENA." },
  { name: "Nominee Placeholder", region: "🇨🇲", regionTag: "Central Africa", impactLine1: "Created mobile learning centers", impactLine2: "combining athletics and literacy." },
  { name: "Nominee Placeholder", region: "🇬🇧", regionTag: "Diaspora", impactLine1: "Raised $2M for African student-athlete", impactLine2: "scholarship programs globally." },
  { name: "Nominee Placeholder", region: "🇺🇸", regionTag: "Friend of Africa", impactLine1: "International sports education alliance", impactLine2: "impacting 15 African nations." },
];

const MUSIC_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇳🇬", regionTag: "West Africa", impactLine1: "Scholarship foundation supporting 200+ students", impactLine2: "in music and STEM education." },
  { name: "Nominee Placeholder", region: "🇹🇿", regionTag: "East Africa", impactLine1: "Youth mentorship program reaching 10,000+", impactLine2: "aspiring musicians and learners." },
  { name: "Nominee Placeholder", region: "🇿🇦", regionTag: "Southern Africa", impactLine1: "Built 3 community learning centers", impactLine2: "through concert tour proceeds." },
  { name: "Nominee Placeholder", region: "🇲🇦", regionTag: "North Africa", impactLine1: "Advocacy campaigns for girls' education", impactLine2: "reaching 5M+ social media impressions." },
  { name: "Nominee Placeholder", region: "🇨🇩", regionTag: "Central Africa", impactLine1: "Music academy providing free education", impactLine2: "to displaced youth." },
  { name: "Nominee Placeholder", region: "🇫🇷", regionTag: "Diaspora", impactLine1: "Global benefit concerts raising funds for", impactLine2: "African education infrastructure." },
  { name: "Nominee Placeholder", region: "🇨🇦", regionTag: "Friend of Africa", impactLine1: "Cross-cultural education exchange programs", impactLine2: "connecting 12 countries." },
];

const SOCIAL_MEDIA_PROFILES: ProfileSlide[] = [
  { name: "Nominee Placeholder", region: "🇬🇭", regionTag: "West Africa", impactLine1: "Educational content reaching 2M+ monthly views", impactLine2: "on scholarship opportunities.", platformIcons: ["YouTube", "TikTok"] },
  { name: "Nominee Placeholder", region: "🇺🇬", regionTag: "East Africa", impactLine1: "Digital learning advocacy campaigns", impactLine2: "promoting free online courses.", platformIcons: ["Instagram", "X"] },
  { name: "Nominee Placeholder", region: "🇧🇼", regionTag: "Southern Africa", impactLine1: "Created viral education challenge reaching", impactLine2: "500K+ participants across Africa.", platformIcons: ["TikTok", "Instagram"] },
  { name: "Nominee Placeholder", region: "🇹🇳", regionTag: "North Africa", impactLine1: "Bilingual scholarship database platform", impactLine2: "connecting students with opportunities.", platformIcons: ["YouTube", "LinkedIn"] },
  { name: "Nominee Placeholder", region: "🇷🇼", regionTag: "Central Africa", impactLine1: "CSR advocacy content driving corporate", impactLine2: "education partnerships.", platformIcons: ["LinkedIn", "X"] },
  { name: "Nominee Placeholder", region: "🇩🇪", regionTag: "Diaspora", impactLine1: "African education storytelling reaching", impactLine2: "global audiences weekly.", platformIcons: ["YouTube", "Instagram"] },
  { name: "Nominee Placeholder", region: "🇦🇺", regionTag: "Friend of Africa", impactLine1: "International ed-tech collaboration", impactLine2: "spotlight series.", platformIcons: ["LinkedIn", "YouTube"] },
];

const CATEGORIES: CategoryCard[] = [
  {
    id: "sports",
    title: "Africa Sports Education Impact Recognition",
    icon: Trophy,
    tags: ["Direct Education Investment", "Youth Mentorship & School Advocacy"],
    profiles: SPORTS_PROFILES,
    ctaHeadline: "Know a stronger education advocate in sports?",
    ctaDescription: "Nominate now.",
  },
  {
    id: "music",
    title: "Africa Music Education Impact Recognition",
    icon: Music,
    tags: ["Education Investment & Youth Advocacy"],
    profiles: MUSIC_PROFILES,
    ctaHeadline: "Influence is powerful. Education impact is measurable.",
    ctaDescription: "Recognize artists making a difference.",
  },
  {
    id: "social-media",
    title: "Africa Social Media Education Impact Recognition",
    icon: Smartphone,
    tags: ["Digital Learning Advocacy", "Scholarship Awareness & Youth Empowerment"],
    profiles: SOCIAL_MEDIA_PROFILES,
    ctaHeadline: "Digital Influence Must Show Education Impact.",
    ctaDescription: "Nominate an influencer championing education.",
  },
];

// --- Sub-components ---

function SlideProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mt-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
            i === current ? "bg-gold" : i < current ? "bg-gold/40" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

function ProfileCard({ profile, isActive }: { profile: ProfileSlide; isActive: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={profile.regionTag}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center gap-4 p-4"
        >
          {/* Profile avatar placeholder */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-gold-dark/20 border-2 border-gold/40 flex items-center justify-center shrink-0">
            <span className="text-2xl">{profile.region}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white text-sm">{profile.name}</span>
              <Badge variant="outline" className="text-[10px] border-gold/30 text-gold-light px-1.5 py-0">
                {profile.regionTag}
              </Badge>
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              {profile.impactLine1}
              <br />
              {profile.impactLine2}
            </p>
            {profile.platformIcons && (
              <div className="flex gap-1.5 mt-1.5">
                {profile.platformIcons.map((p) => (
                  <span key={p} className="text-[10px] text-gold/70 bg-gold/10 rounded px-1.5 py-0.5">{p}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button size="sm" variant="outline" className="text-xs border-gold/30 text-gold hover:bg-gold/10 h-7 px-2.5">
              Re-Nominate
            </Button>
            <button className="text-white/40 hover:text-gold transition-colors" aria-label="Share">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GoldCategoryCard({ card }: { card: CategoryCard }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const Icon = card.icon;

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % card.profiles.length);
  }, [card.profiles.length]);

  useEffect(() => {
    const timer = setInterval(advance, 3000);
    return () => clearInterval(timer);
  }, [advance]);

  return (
    <div className="relative rounded-2xl border border-gold/20 bg-gradient-to-b from-charcoal-light to-charcoal overflow-hidden group">
      {/* Subtle gold glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3 pointer-events-none" />

      {/* Header */}
      <div className="relative p-5 pb-3 border-b border-gold/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white leading-tight">{card.title}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-gold/80 bg-gold/10 rounded-full px-2.5 py-0.5 border border-gold/15">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Rotating profile slider */}
      <div className="relative min-h-[120px]">
        {card.profiles.map((profile, i) => (
          <ProfileCard key={profile.regionTag} profile={profile} isActive={i === activeIndex} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-5">
        <SlideProgressBar current={activeIndex} total={card.profiles.length} />
      </div>

      {/* CTA footer */}
      <div className="relative p-5 pt-4 mt-2 border-t border-gold/10">
        <p className="text-xs text-white/70 mb-3">
          <span className="text-gold font-medium">{card.ctaHeadline}</span>{" "}
          {card.ctaDescription}
        </p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-xs h-8 flex-1"
            onClick={() => window.location.href = `/nominate?tier=gold-special`}
          >
            Nominate New Person
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
          <button className="w-8 h-8 rounded-lg border border-gold/20 flex items-center justify-center text-gold/50 hover:text-gold hover:border-gold/40 transition-colors" aria-label="QR Code">
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Export ---

export function GoldSpecialRecognitionSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="gold-special">
      {/* Background with subtle Africa map motif */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/50 to-charcoal pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M100 20 C85 25,70 40,65 55 C60 70,55 85,58 100 C60 115,65 125,75 135 C85 145,90 155,95 165 C97 170,100 175,103 170 C108 160,110 150,115 140 C125 125,135 115,138 100 C140 85,135 70,125 55 C115 40,110 25,100 20Z' fill='%23D4A528' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "600px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs px-3">
            🥇 2025 Edition
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-serif">
            Gold Special Recognition
          </h2>
          <p className="text-white/60 max-w-lg mx-auto text-sm">
            Cultural Impact Recognition — Celebrating Africa's changemakers in Sports, Music, and Digital Influence who champion education.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
            Platinum Clearance → Gold Special Recognition
          </div>
        </div>

        {/* 3 Category Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {CATEGORIES.map((card) => (
            <GoldCategoryCard key={card.id} card={card} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gold font-semibold text-lg mb-2">
            Nominate. Validate. Elevate Education.
          </p>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Every nomination drives accountability. Every recognition amplifies impact.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"
              onClick={() => window.location.href = `/nominate?tier=gold-special`}
            >
              Start a Nomination
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10"
              onClick={() => window.location.href = `/guidelines/edi-matrix`}
            >
              View Eligibility
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GoldSpecialRecognitionSection;
