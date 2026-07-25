// TierShowcaseStrip — auto-rotating trio surfacing the three Certificate of
// Recognition tiers under the hero. Naming set B. prefers-reduced-motion
// safe (static grid fallback).

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Music2, Trophy, Building2, BookOpen, FlaskConical,
  Church, Landmark, Globe2, Newspaper, HeartHandshake, Cpu, Palette, Cog,
} from "lucide-react";

type Tier = {
  slug: string;
  label: string;
  href: string;
  blurb: string;
  icons: { Icon: React.ComponentType<{ className?: string }>; caption: string }[];
};

const TIERS: Tier[] = [
  {
    slug: "influencer",
    label: "Influencer Education Impact",
    href: "/awards/influencer-education-impact",
    blurb: "Social, sports and music icons who move Africa toward Education for All.",
    icons: [
      { Icon: Megaphone, caption: "Social Media" },
      { Icon: Trophy, caption: "Sports Icons" },
      { Icon: Music2, caption: "Music Icons" },
    ],
  },
  {
    slug: "platinum",
    label: "Platinum Certificate of Recognition",
    href: "/awards/platinum",
    blurb: "Institutions, libraries, research, faith, political and international education leadership.",
    icons: [
      { Icon: Building2, caption: "Institutions" },
      { Icon: BookOpen, caption: "Libraries" },
      { Icon: FlaskConical, caption: "Research" },
      { Icon: Church, caption: "Faith-based" },
      { Icon: Landmark, caption: "Leadership" },
      { Icon: Globe2, caption: "Diaspora" },
    ],
  },
  {
    slug: "gold-blue-garnet",
    label: "Gold-Blue Garnet Regional Recognition",
    href: "/awards/gold-blue-garnet",
    blurb: "CSR, EdTech, media, NGOs, STEM, creative arts and state-level policy across regions.",
    icons: [
      { Icon: HeartHandshake, caption: "CSR" },
      { Icon: Cpu, caption: "EdTech" },
      { Icon: Newspaper, caption: "Media" },
      { Icon: Cog, caption: "STEM" },
      { Icon: Palette, caption: "Creative Arts" },
    ],
  },
];

function TierCard({ tier }: { tier: Tier }) {
  return (
    <Link
      to={tier.href}
      className="block rounded-2xl border border-gold/25 bg-charcoal-light/60 p-5 md:p-6 hover:border-gold/60 transition-colors"
    >
      <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Certificate of Recognition</p>
      <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2">{tier.label}</h3>
      <p className="text-white/70 text-sm mb-4">{tier.blurb}</p>
      <ul className="flex flex-wrap gap-2">
        {tier.icons.map(({ Icon, caption }) => (
          <li key={caption} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gold/10 border border-gold/25 text-gold text-[11px]">
            <Icon className="h-3.5 w-3.5" /> {caption}
          </li>
        ))}
      </ul>
    </Link>
  );
}

export function TierShowcaseStrip() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % TIERS.length), 2800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section aria-label="Certificate of Recognition tiers" className="bg-charcoal py-10 md:py-12 border-y border-gold/15">
      <div className="container">
        <div className="text-center mb-6">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold/70">Three Certificate of Recognition Tiers</p>
          <h2 className="font-display text-2xl md:text-3xl text-white font-bold mt-1">Recognising Every Kind of Education Enabler</h2>
        </div>

        {reduce ? (
          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map((t) => <TierCard key={t.slug} tier={t} />)}
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              {TIERS.map((t, i) => (
                <div key={t.slug} className={`transition-opacity duration-500 ${i === idx ? "opacity-100" : "opacity-60"}`}>
                  <TierCard tier={t} />
                </div>
              ))}
            </div>
            <div className="md:hidden relative min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={TIERS[idx].slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  <TierCard tier={TIERS[idx]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default TierShowcaseStrip;
