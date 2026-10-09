import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  ArrowRight,
  Users,
  Trophy,
  BookOpen,
  Globe,
  Leaf,
  GraduationCap,
  Handshake,
  Music2,
  Medal,
  Megaphone,
} from "lucide-react";
import { ICON_NOMINEES, ICON_SUBCATEGORIES } from "@/data/iconAward";
import { getAllGoldNominees, GOLD_CATEGORIES } from "@/data/goldSpecialRecognition";
import trackIcon from "@/assets/tracks/track-icon.jpg";
import trackCsr from "@/assets/tracks/track-csr.jpg";
import trackInfluencers from "@/assets/tracks/track-influencers.jpg";
import trackGlobal from "@/assets/tracks/track-global.jpg";
import docIcon from "@/assets/tracks/doc-icon.jpg";
import docCsr from "@/assets/tracks/doc-csr.jpg";
import docInfluencers from "@/assets/tracks/doc-influencers.jpg";
import docGlobal from "@/assets/tracks/doc-global.jpg";

type Theme = {
  // semantic tailwind classes per accent
  ring: string;
  text: string;
  textSoft: string;
  pill: string;
  pillBorder: string;
  badge: string;
  badgeBorder: string;
  primaryBtn: string;
  secondaryBtn: string;
  watchBtn: string;
  glow: string;
  docTitle: string;
};

const themes: Record<"gold" | "emerald" | "purple" | "blue", Theme> = {
  gold: {
    ring: "border-amber-500/30 hover:border-amber-400/60",
    text: "text-amber-400",
    textSoft: "text-amber-300/80",
    pill: "bg-amber-500/10 text-amber-300",
    pillBorder: "border-amber-400/40",
    badge: "bg-amber-500/10 text-amber-300",
    badgeBorder: "border-amber-400/50",
    primaryBtn: "bg-amber-500 hover:bg-amber-400 text-black",
    secondaryBtn: "border-amber-400/60 text-amber-200 hover:bg-amber-500/10",
    watchBtn: "text-amber-300 hover:text-amber-200",
    glow: "from-amber-500/20 via-amber-500/5 to-transparent",
    docTitle: "text-amber-400",
  },
  emerald: {
    ring: "border-emerald-500/30 hover:border-emerald-400/60",
    text: "text-emerald-400",
    textSoft: "text-emerald-300/80",
    pill: "bg-emerald-500/10 text-emerald-300",
    pillBorder: "border-emerald-400/40",
    badge: "bg-emerald-500/10 text-emerald-300",
    badgeBorder: "border-emerald-400/50",
    primaryBtn: "bg-emerald-500 hover:bg-emerald-400 text-black",
    secondaryBtn: "border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/10",
    watchBtn: "text-emerald-300 hover:text-emerald-200",
    glow: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    docTitle: "text-emerald-400",
  },
  purple: {
    ring: "border-fuchsia-500/30 hover:border-fuchsia-400/60",
    text: "text-fuchsia-400",
    textSoft: "text-fuchsia-300/80",
    pill: "bg-fuchsia-500/10 text-fuchsia-200",
    pillBorder: "border-fuchsia-400/40",
    badge: "bg-fuchsia-500/10 text-fuchsia-300",
    badgeBorder: "border-fuchsia-400/50",
    primaryBtn: "bg-fuchsia-500 hover:bg-fuchsia-400 text-white",
    secondaryBtn: "border-fuchsia-400/60 text-fuchsia-200 hover:bg-fuchsia-500/10",
    watchBtn: "text-fuchsia-300 hover:text-fuchsia-200",
    glow: "from-fuchsia-500/20 via-fuchsia-500/5 to-transparent",
    docTitle: "text-fuchsia-400",
  },
  blue: {
    ring: "border-sky-500/30 hover:border-sky-400/60",
    text: "text-sky-400",
    textSoft: "text-sky-300/80",
    pill: "bg-sky-500/10 text-sky-200",
    pillBorder: "border-sky-400/40",
    badge: "bg-sky-500/10 text-sky-300",
    badgeBorder: "border-sky-400/50",
    primaryBtn: "bg-sky-500 hover:bg-sky-400 text-black",
    secondaryBtn: "border-sky-400/60 text-sky-200 hover:bg-sky-500/10",
    watchBtn: "text-sky-300 hover:text-sky-200",
    glow: "from-sky-500/20 via-sky-500/5 to-transparent",
    docTitle: "text-sky-400",
  },
};

type Track = {
  accent: keyof typeof themes;
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  description: string;
  hero: string;
  doc: string;
  docTitle: string;
  docCopy: string;
  tags: string[];
  stats: { icon: React.ComponentType<{ className?: string }>; top: string; bottom: string }[];
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  watchHref: string;
  watchLabel: string;
};

export function AwardPillarsGrid() {
  const iconCount = ICON_NOMINEES.length;
  const goldCount = useMemo(() => getAllGoldNominees().length, []);

  const tracks: Track[] = [
    {
      accent: "gold",
      eyebrow: "Legacy · 2006–2026",
      titleStart: "Who Will Be Crowned",
      titleAccent: "Africa Education Icon?",
      description:
        "For two decades, Africa's most transformative education leaders have shaped learning, expanded opportunity, empowered communities, and inspired generations across the continent.",
      hero: trackIcon,
      doc: docIcon,
      docTitle: "Legacy Stories",
      docCopy:
        "Watch how Africa's education leaders transformed generations and built the foundations of our future.",
      tags: ["Legacy", "Impact", "Transformation", "Leadership", "Vision", "Empowerment", "Excellence", "Opportunity"],
      stats: [
        { icon: Users, top: "2006–2026", bottom: "Two Decades of Impact" },
        { icon: Trophy, top: "Legendary", bottom: `${iconCount}+ Education Leaders` },
        { icon: BookOpen, top: "Transforming", bottom: `${ICON_SUBCATEGORIES.length} Subcategories` },
      ],
      primary: { href: "/awards/africa-education-icon", label: "Explore Icon Nominees" },
      secondary: { href: "/nominate", label: "Nominate a Legend" },
      watchHref: "/media",
      watchLabel: "Watch Legacy Stories",
    },
    {
      accent: "emerald",
      eyebrow: "Corporate · Continental",
      titleStart: "Who Will Emerge as Africa's",
      titleAccent: "Leading CSR for Education Company?",
      description:
        "Across Africa, visionary corporations are funding innovation, supporting schools, empowering educators, and investing in future generations through education impact initiatives.",
      hero: trackCsr,
      doc: docCsr,
      docTitle: "Corporate Impact Stories",
      docCopy:
        "See how leading organizations are funding innovation and creating real change in African education.",
      tags: ["Innovation", "Infrastructure", "Scholarships", "Inclusion", "CSR Impact", "Technology", "Access", "Partnership"],
      stats: [
        { icon: Leaf, top: "Sustainable", bottom: "Education Impact" },
        { icon: GraduationCap, top: "Investing in", bottom: "Future Generations" },
        { icon: Handshake, top: "Corporate", bottom: "Impact Across Africa" },
      ],
      primary: { href: "/awards/csr-for-education", label: "Explore Corporate Nominees" },
      secondary: { href: "/sponsors", label: "Partner With NESA" },
      watchHref: "/media",
      watchLabel: "See Corporate Impact Stories",
    },
    {
      accent: "purple",
      eyebrow: "Creators · Music · Sports",
      titleStart: "Who Are Africa's Top",
      titleAccent: "Education Influencers?",
      description:
        "From music and sports to digital storytelling and social advocacy, influential African voices are transforming culture into a force for education, awareness, empowerment, and opportunity.",
      hero: trackInfluencers,
      doc: docInfluencers,
      docTitle: "Digital Voices Stories",
      docCopy:
        "Watch how creators, musicians, athletes and influencers are using their platforms to change lives.",
      tags: ["Influence", "Advocacy", "Creativity", "Youth Power", "Social Impact", "Music", "Sports", "Inspiration"],
      stats: [
        { icon: Music2, top: "Music", bottom: "Inspires Learning" },
        { icon: Medal, top: "Sports", bottom: "Mentor Future Leaders" },
        { icon: Megaphone, top: "Voices", bottom: "Driving Change" },
      ],
      primary: { href: "/awards/influencers-education-impact-2026-recognition", label: "Explore Gold Nominees" },
      secondary: { href: "/awards/gold-blue-garnet", label: "Vote for Influencers" },
      watchHref: "/media",
      watchLabel: "Watch Impact Stories",
    },
    {
      accent: "blue",
      eyebrow: "Global · Bilateral · Multilateral",
      titleStart: "Which Global Grants Are",
      titleAccent: "Powering Education in Africa?",
      description:
        "Global partnerships are expanding educational opportunity across Africa through funding, collaboration, innovation, and long-term investment in future generations.",
      hero: trackGlobal,
      doc: docGlobal,
      docTitle: "Partnership Stories",
      docCopy:
        "See how global institutions and partners are building stronger education systems in Africa.",
      tags: ["Collaboration", "Grants", "Diplomacy", "Global Impact", "SDGs", "Partnership", "Development", "Innovation"],
      stats: [
        { icon: Globe, top: "Global", bottom: "Collaboration" },
        { icon: Handshake, top: "Grants", bottom: "& Funding" },
        { icon: Users, top: "International", bottom: "Impact" },
      ],
      primary: { href: "/awards/global-partnerships", label: "Explore Global Partners" },
      secondary: { href: "/partners", label: "Become a Partner" },
      watchHref: "/media",
      watchLabel: "View Partnership Impact",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-charcoal-light to-charcoal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
            Four pillars · one standard
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-ivory mt-2">
            The Award Tracks
          </h2>
          <p className="text-ivory/60 max-w-2xl mx-auto mt-3 text-sm md:text-base">
            A cinematic look at the four recognition tracks driving Africa's education renaissance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {tracks.map((t, i) => (
            <TrackCard key={t.titleAccent} track={t} index={i} />
          ))}
        </div>

        {/* Bottom impact strip */}
        <div className="mt-10 md:mt-14 rounded-2xl border border-gold/20 bg-charcoal-light/60 backdrop-blur p-5 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 items-center">
            <ImpactStat icon={Users} title="Impacting Millions" sub="Across Africa" />
            <ImpactStat icon={Trophy} title="Celebrating Excellence" sub="in Education" />
            <ImpactStat icon={BookOpen} title="Building the Future" sub="Through Learning" />
            <ImpactStat icon={Globe} title="Uniting Africa & The World" sub="For Education" />
            <Link
              to="/awards"
              className="col-span-2 md:col-span-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold text-black font-semibold px-5 py-3 text-sm hover:bg-gold/90 transition"
            >
              Explore All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactStat({
  icon: Icon,
  title,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-gold shrink-0" />
      <div>
        <div className="text-ivory font-semibold text-sm md:text-base leading-tight">{title}</div>
        <div className="text-ivory/60 text-xs md:text-sm">{sub}</div>
      </div>
    </div>
  );
}

function TrackCard({ track, index }: { track: Track; index: number }) {
  const th = themes[track.accent];
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className={`relative rounded-2xl border ${th.ring} bg-charcoal/80 backdrop-blur overflow-hidden transition-colors`}
    >
      {/* Top hero region */}
      <div className="relative p-5 md:p-7">
        <div className={`absolute inset-0 bg-gradient-to-br ${th.glow} pointer-events-none`} />
        <div className="relative grid md:grid-cols-[1fr_minmax(220px,40%)] gap-5">
          {/* Left text */}
          <div>
            <span
              className={`inline-block text-[10px] md:text-[11px] uppercase tracking-[0.18em] font-semibold px-3 py-1 rounded-full border ${th.badgeBorder} ${th.badge}`}
            >
              {track.eyebrow}
            </span>
            <h3 className="font-display text-2xl md:text-3xl lg:text-[2rem] leading-tight font-bold text-ivory mt-3">
              {track.titleStart}{" "}
              <span className={th.text}>{track.titleAccent}</span>
            </h3>
            <p className="text-ivory/70 text-sm md:text-[15px] leading-relaxed mt-3">
              {track.description}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {track.stats.map((s) => (
                <div key={s.bottom} className="flex items-start gap-2">
                  <s.icon className={`w-5 h-5 mt-0.5 ${th.text} shrink-0`} />
                  <div className="text-[11px] leading-tight">
                    <div className="text-ivory font-semibold">{s.top}</div>
                    <div className="text-ivory/60">{s.bottom}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <Link
                to={track.primary.href}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${th.primaryBtn}`}
              >
                {track.primary.label} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={track.secondary.href}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition ${th.secondaryBtn}`}
              >
                {track.secondary.label}
              </Link>
              <Link
                to={track.watchHref}
                className={`inline-flex items-center gap-2 px-2 py-2 text-sm font-medium transition ${th.watchBtn}`}
              >
                <Play className="w-4 h-4" /> {track.watchLabel}
              </Link>
            </div>
          </div>

          {/* Right hero illustration with floating tag pills */}
          <div className="relative min-h-[220px] md:min-h-[260px] rounded-xl overflow-hidden bg-black/40 border border-ivory/5">
            <img
              src={track.hero}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-charcoal/60 via-charcoal/10 to-transparent" />
            {/* Floating pills */}
            <div className="absolute inset-0 p-3 flex flex-col items-end justify-center gap-1.5">
              {track.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className={`text-[10px] md:text-[11px] px-2.5 py-1 rounded-full border ${th.pillBorder} ${th.pill} backdrop-blur-sm`}
                  style={{ transform: `translateX(${(idx % 3) * -6}px)` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documentary preview */}
      <div className="px-5 md:px-7 pb-5 md:pb-7">
        <div className="rounded-xl border border-ivory/10 bg-black/40 overflow-hidden">
          <div className="grid grid-cols-[1fr_minmax(160px,44%)] sm:grid-cols-[1fr_minmax(220px,50%)]">
            <div className="p-4 md:p-5">
              <h4 className={`font-display text-base md:text-lg font-semibold ${th.docTitle}`}>
                {track.docTitle}
              </h4>
              <div className="text-ivory/80 text-xs md:text-sm font-medium mt-0.5">
                Documentary Coming Soon
              </div>
              <p className="text-ivory/60 text-[12px] md:text-[13px] mt-2 leading-relaxed">
                {track.docCopy}
              </p>
              <Link
                to={track.watchHref}
                className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${th.primaryBtn}`}
              >
                <Play className="w-3.5 h-3.5" /> Watch Preview
              </Link>
            </div>
            <div className="relative min-h-[140px] sm:min-h-[170px]">
              <img
                src={track.doc}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/40" />
              <button
                aria-label="Play preview"
                className="absolute inset-0 flex items-center justify-center group"
              >
                <span
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 ${th.badgeBorder} bg-black/40 backdrop-blur flex items-center justify-center group-hover:scale-110 transition`}
                >
                  <Play className={`w-5 h-5 ${th.text} ml-0.5`} fill="currentColor" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default AwardPillarsGrid;
