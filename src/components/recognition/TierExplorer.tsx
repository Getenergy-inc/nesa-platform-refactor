// Awards Tier Explorer — canonical 4 Recognition Tiers for NESA-Africa 2026.
// Aligned with the Master Tiers document: tier order, winner counts, selection
// method, and detailed category/subcategory breakdowns per tier.

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Crown, Trophy, Medal, Sparkles, type LucideIcon } from "lucide-react";
import { trackPathwayView } from "@/lib/analytics";

type TierSlug =
  | "africa-education-icon"
  | "blue-garnet"
  | "platinum-recognition"
  | "influencers-education-impact";

interface TierCategory {
  name: string;
  scope?: string;
  subcount?: number;
  subItems?: string[];
}

interface Tier {
  slug: TierSlug;
  tierNumber: 1 | 2 | 3 | 4;
  name: string;
  type: string;
  selection: string;
  selectionBadge: string;
  winners: string;
  purpose: string;
  icon: LucideIcon;
  href: string;
  exploreHref: string;
  categories: TierCategory[];
}

const TIERS: Tier[] = [
  {
    slug: "africa-education-icon",
    tierNumber: 1,
    name: "Africa Education Icon Award",
    type: "Lifetime Achievement",
    selection: "Jury-selected only",
    selectionBadge: "Jury Only",
    winners: "9 Icons",
    purpose:
      "Highest lifetime honour for transformative education impact. 3 honorees per subcategory (Africa residents · Diaspora · Friends of Africa).",
    icon: Crown,
    href: "/awards/africa-education-icon",
    exploreHref: "/awards/explore/africa-education-icon",
    categories: [
      { name: "Literary & New Curriculum Advocate Icon of the Decade", scope: "Continental", subcount: 3 },
      { name: "Africa Technical Educator Icon of the Decade", scope: "Continental", subcount: 3 },
      { name: "Africa Education Philanthropy Icon of the Decade", scope: "Continental", subcount: 3 },
    ],
  },
  {
    slug: "blue-garnet",
    tierNumber: 2,
    name: "Blue Garnet Award",
    type: "Competitive Excellence",
    selection: "60% Jury + 40% Public AGC Vote",
    selectionBadge: "Hybrid 60/40",
    winners: "9 Winners",
    purpose: "Premier competitive recognition across 9 main categories and 63 subcategories.",
    icon: Trophy,
    href: "/awards/blue-garnet",
    exploreHref: "/awards/explore/blue-garnet",
    categories: [
      {
        name: "Best CSR for Education",
        scope: "Africa Regional",
        subcount: 6,
        subItems: ["Banking & Finance", "Telecom", "Tech & ICT", "Oil & Gas", "Food & Beverages", "Aviation"],
      },
      { name: "Best CSR for Education", scope: "Nigeria", subcount: 23 },
      {
        name: "Best EduTech Innovation for Education",
        scope: "Africa Regional",
        subcount: 3,
        subItems: ["Startup", "Established Company", "Social Impact Initiative"],
      },
      {
        name: "Best Media Organisation for Education Advocacy",
        scope: "Nigeria",
        subcount: 4,
        subItems: ["Print", "Radio", "TV", "Digital"],
      },
      {
        name: "Best NGO for Education Advancement",
        scope: "Nigeria",
        subcount: 5,
        subItems: ["Infrastructure", "Materials", "Aid & Scholarships", "Youth", "Women & Girls"],
      },
      {
        name: "Best NGO for Education Advancement",
        scope: "Africa Regional",
        subcount: 5,
        subItems: ["Infrastructure", "Aid", "Materials", "Youth Skills", "Women & Girls"],
      },
      {
        name: "Best STEM Education Programme",
        scope: "Africa Regional",
        subcount: 4,
        subItems: ["Inclusive", "Digital Innovation", "Community Outreach", "Girls in STEM"],
      },
      {
        name: "Best Creative Arts Contribution to Education",
        scope: "Nigeria",
        subcount: 7,
        subItems: [
          "Nollywood",
          "Music",
          "Literature",
          "Visual Arts",
          "Performing Arts",
          "Film & Media",
          "Creative Advocacy",
        ],
      },
      {
        name: "Best Education Policy & Implementation State",
        scope: "Nigeria",
        subcount: 6,
        subItems: ["North Central", "North East", "North West", "South East", "South South", "South West"],
      },
    ],
  },
  {
    slug: "platinum-recognition",
    tierNumber: 3,
    name: "Platinum Recognition",
    type: "Institutional Leadership",
    selection: "Non-competitive · Verified",
    selectionBadge: "Verified",
    winners: "Multiple Honorees",
    purpose: "Baseline verified institutional honour for tertiary, research, faith, policy, and partnership leadership.",
    icon: Medal,
    href: "/awards/platinum",
    exploreHref: "/awards/explore/platinum-recognition",
    categories: [
      {
        name: "Best Tertiary Institution Library",
        scope: "Nigeria",
        subcount: 8,
        subItems: ["University (Public/Private)", "Polytechnic", "College of Education", "College of Nursing"],
      },
      {
        name: "Excellence in Research & Development for Education",
        scope: "Nigeria",
        subcount: 3,
        subItems: ["Agricultural", "Pharmaceutical", "Environmental & Ecological"],
      },
      {
        name: "Excellence in Christian Education Impact",
        scope: "Africa Regional",
        subcount: 4,
        subItems: ["Infrastructure", "Scholarship", "Holistic Support", "Advocacy"],
      },
      {
        name: "Excellence in Islamic Education Impact",
        scope: "Africa Regional",
        subcount: 4,
        subItems: ["Infrastructure", "Scholarship", "Holistic Support", "Advocacy"],
      },
      {
        name: "Excellence in Political Leadership for Education",
        scope: "Nigeria",
        subcount: 3,
        subItems: ["Scholarship Program", "Infrastructure & Donations", "Advocacy & Policy"],
      },
      {
        name: "Excellence in International Partnership for Education",
        scope: "International",
        subcount: 6,
        subItems: [
          "Embassies",
          "Bilateral Agencies",
          "International NGOs",
          "Grant Foundations",
          "Airlines",
          "Leadership / Training Orgs",
        ],
      },
      {
        name: "Excellence in Diaspora Educational Impact",
        scope: "International",
        subcount: 5,
        subItems: [
          "Diaspora Association Partnership",
          "Individual Champion",
          "Institutional Development",
          "Philanthropy & CSR",
          "Digital Innovation",
        ],
      },
    ],
  },
  {
    slug: "influencers-education-impact",
    tierNumber: 4,
    name: "Influencers Education Impact Award",
    type: "Public Recognition",
    selection: "Verification-led assessment · No public voting",
    selectionBadge: "Public Vote",
    winners: "3 Winners",
    purpose: "Public-driven recognition for influencers using their platforms to advance education.",
    icon: Sparkles,
    href: "/awards/influencers-education-impact-2026-recognition",
    exploreHref: "/awards/explore/influencers-education-impact",
    categories: [
      { name: "African Social Media Influencers Education Impact Award", scope: "Continental" },
      { name: "African Sports Icons Supporting Education", scope: "Continental" },
      { name: "African Music Icons Supporting Education", scope: "Continental" },
    ],
  },
];

interface Props {
  className?: string;
}

export function TierExplorer({ className = "" }: Props) {
  const [expanded, setExpanded] = useState<TierSlug | null>(null);

  return (
    <section aria-label="Recognition Tiers" className={`relative w-full ${className}`}>
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Official Recognition Tiers · NESA-Africa 2026
        </p>
        <h2 className="font-display text-3xl text-white md:text-4xl">
          Four Recognition Tiers
        </h2>
        <p className="mt-3 text-sm text-white/70 md:text-base">
          One continental platform · 4 tiers · 18 main categories · ~100 recognition
          subcategories. Lifetime honours, competitive excellence, institutional
          leadership, and public-voted influence.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const isOpen = expanded === tier.slug;
          return (
            <motion.article
              key={tier.slug}
              layout
              className={`group relative overflow-hidden rounded-2xl border bg-black/60 p-6 transition-colors ${
                isOpen ? "border-gold/70" : "border-gold/20 hover:border-gold/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/40">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="text-right">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/70">
                    Tier {tier.tierNumber}
                  </span>
                  <span className="mt-1 inline-block rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                    {tier.selectionBadge}
                  </span>
                </div>
              </div>

              <h3 className="mt-4 font-display text-xl text-white md:text-2xl">{tier.name}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gold/80">
                {tier.type}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-white/50">Winners</dt>
                  <dd className="mt-1 font-semibold text-white">{tier.winners}</dd>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-white/50">Selection</dt>
                  <dd className="mt-1 font-semibold text-white">{tier.selection}</dd>
                </div>
              </dl>

              <p className="mt-4 text-sm text-white/70">{tier.purpose}</p>

              <button
                type="button"
                onClick={() => {
                  setExpanded(isOpen ? null : tier.slug);
                  if (!isOpen) trackPathwayView(tier.slug);
                }}
                aria-expanded={isOpen}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold/80"
              >
                {isOpen ? "Hide" : "View"} {tier.categories.length} {tier.categories.length === 1 ? "Category" : "Categories"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 space-y-2 border-t border-gold/15 pt-3"
                  >
                    {tier.categories.map((cat, idx) => (
                      <li
                        key={`${cat.name}-${cat.scope ?? idx}`}
                        className="rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white">{cat.name}</p>
                            {cat.scope && (
                              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gold/70">
                                {cat.scope}
                              </p>
                            )}
                          </div>
                          {cat.subcount != null && (
                            <span className="shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">
                              {cat.subcount} sub
                            </span>
                          )}
                        </div>
                        {cat.subItems && cat.subItems.length > 0 && (
                          <p className="mt-2 text-xs text-white/60">{cat.subItems.join(" · ")}</p>
                        )}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  to={tier.href}
                  onClick={() => trackPathwayView(tier.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-charcoal hover:bg-gold/90"
                >
                  Explore tier
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <Link
                  to={tier.exploreHref}
                  onClick={() => trackPathwayView(tier.slug)}
                  className="text-sm font-medium text-white/70 underline-offset-4 hover:text-gold hover:underline"
                >
                  Browse categories
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default TierExplorer;
