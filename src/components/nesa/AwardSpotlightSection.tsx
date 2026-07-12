// Recognition Hub — NESA Africa 2026
// Cinematic 4-card grid with embedded YouTube storytelling experiences.

import { motion } from "framer-motion";
import {
  Crown,
  Building2,
  Megaphone,
  Globe2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PathwayVideoCard, type PathwayVideoCardData } from "./PathwayVideoCard";
import { usePathwayCards } from "@/hooks/usePathwayCards";
import posterIcon from "@/assets/pathway-cards/icon.jpg";
import posterCsr from "@/assets/pathway-cards/csr.jpg";
import posterInfluencer from "@/assets/pathway-cards/influencer.jpg";
import posterGrants from "@/assets/pathway-cards/grants.jpg";

const pathways: PathwayVideoCardData[] = [
  {
    id: "icon",
    icon: Crown,
    accentLabel: "Lifetime Honour • 2006–2026",
    category: "Africa Education Icon Award",
    headline: "Who Earns Africa's Highest Education Honour?",
    story:
      "Across three pillars — Literary & New Curriculum Advocates, Africa Technical Educators, and Lifetime Education Champions — meet the Africans in Africa, Diaspora Africans, and Friends of Africa whose decades of work rewrote what learning means on this continent.",
    videoTitle: "Africa Education Icon — Two Decades, One Legacy",
    posterAlt: "Africa Education Icon — cinematic legacy storytelling",
    posterImage: posterIcon,
    visualGradient: "from-gold/45 via-emerald-900/40 to-charcoal",
    actionWords: [
      "Lifetime Legacy", "Curriculum Reform", "Technical Education",
      "Literary Advocacy", "Diaspora Excellence", "Friends of Africa",
      "Generational Change", "Pan-African Vision", "Mentorship",
      "Pioneers", "Education for All", "Decade of Impact",
    ],
    animatedPhrases: [
      "Three Icon Pillars. One Continental Legacy.",
      "Honouring Two Decades of Education Pioneers",
      "Africans in Africa • Diaspora • Friends of Africa",
      "From Literary Reform to Technical Mastery",
    ],
    previewSummary:
      "Inside the Africa Education Icon of the Decade — the lifetime tier honouring literary advocates, technical educators, and education champions reshaping the continent.",
    primaryCta: { label: "Explore Icon Nominees", href: "/nominees/icon" },
    secondaryCta: { label: "Nominate a Legend", href: "/nominate?category=icon" },
    tertiaryCta: { label: "Explore Nominees", href: "/nominees?category=icon" },
    engagementCtaLabel: "Watch Legacy Preview",
  },
  {
    id: "csr",
    icon: Building2,
    accentLabel: "Blue Garnet • Corporate Tier",
    category: "Corporate Recognition (CSR in Education)",
    headline: "Which Corporations Are Rebuilding Africa's Classrooms?",
    story:
      "Banks, telcos, energy majors, EdTech innovators and multinationals turning CSR budgets into scholarships, school infrastructure, teacher training, digital access and STEM pipelines — measured, audited, and ranked through the Blue Garnet competitive vote.",
    videoTitle: "Corporate Recognition — CSR That Builds Schools",
    posterAlt: "Corporate Recognition — cinematic CSR storytelling",
    posterImage: posterCsr,
    visualGradient: "from-emerald-800/55 via-emerald-900/30 to-charcoal",
    actionWords: [
      "CSR in Education", "School Infrastructure", "Scholarships",
      "Teacher Training", "Digital Access", "STEM Pipelines",
      "Banks & Telcos", "EdTech Investment", "Audited Impact",
      "Blue Garnet Vote", "Sustainability", "Continental Reach",
    ],
    animatedPhrases: [
      "Capital That Builds Classrooms",
      "Corporate Champions of African Learning",
      "From CSR Budgets to Measurable Impact",
      "Audited. Ranked. Recognised.",
    ],
    previewSummary:
      "Meet the corporations whose CSR programmes are funding scholarships, schools, and digital learning — competing on the Blue Garnet stage for Africa's top corporate education honour.",
    primaryCta: { label: "Explore Corporate Nominees", href: "/awards/csr-education" },
    secondaryCta: { label: "Submit Your CSR Story", href: "/nominate?category=csr-education" },
    tertiaryCta: { label: "Explore Nominees", href: "/nominees?category=csr-education" },
    engagementCtaLabel: "View Impact Story",
  },
  {
    id: "influencer",
    icon: Megaphone,
    accentLabel: "Gold Recognition • Public Voices",
    category: "Digital Voices & Cultural Advocacy",
    headline: "Whose Voice Is Moving Africa's Next Generation?",
    story:
      "Musicians, athletes, actors, faith leaders, content creators and youth influencers turning followers into learners — championing literacy, girl-child education, mental health, scholarships, and back-to-school movements across Africa and the diaspora.",
    videoTitle: "Digital Voices — Influence Into Education Impact",
    posterAlt: "Digital Voices — cinematic creator storytelling",
    posterImage: posterInfluencer,
    visualGradient: "from-gold/35 via-orange-900/35 to-charcoal",
    actionWords: [
      "Music for Education", "Sports for Schools", "Creator Advocacy",
      "Girl-Child Learning", "Literacy Campaigns", "Faith & Education",
      "Youth Influence", "Back-to-School", "Mental Health",
      "Diaspora Voices", "Cultural Power", "Followers to Learners",
    ],
    animatedPhrases: [
      "When Culture Becomes Curriculum",
      "Followers Turned Into Learners",
      "Music, Sport & Story for Education",
      "The Gold Tier of Public Advocacy",
    ],
    previewSummary:
      "Discover the artists, athletes and creators using their platforms to drive literacy, scholarships and school access — honoured under NESA-Africa's Gold Recognition tier.",
    primaryCta: { label: "Explore Gold Nominees", href: "/nominees/gold" },
    secondaryCta: { label: "Vote With AGC", href: "/vote" },
    tertiaryCta: { label: "Explore Nominees", href: "/nominees?category=influencers" },
    engagementCtaLabel: "Explore the Journey",
  },
  {
    id: "grants",
    icon: Globe2,
    accentLabel: "Platinum • Global Allies",
    category: "Global Partnerships & Grants",
    headline: "Which Global Allies Power Africa's Education Future?",
    story:
      "Bilateral donors, multilateral institutions, UN agencies, embassies and global foundations funding scholarships, research, infrastructure and SDG 4 delivery — the Platinum-tier partners standing with Africa from policy to classroom.",
    videoTitle: "Global Partnerships — Allies of African Education",
    posterAlt: "Global Partnerships — cinematic alliance storytelling",
    posterImage: posterGrants,
    visualGradient: "from-emerald-900/55 via-gold/15 to-charcoal",
    actionWords: [
      "Bilateral Grants", "Multilateral Funding", "UN Agencies",
      "Embassies & Diplomacy", "Global Foundations", "SDG 4 Delivery",
      "Research Investment", "Scholarship Pipelines", "Policy Support",
      "Continental Programmes", "Education Diplomacy", "Platinum Allies",
    ],
    animatedPhrases: [
      "Allies Standing With African Learners",
      "From Policy Rooms to Classrooms",
      "Global Capital • African Outcomes",
      "Platinum Partners for SDG 4",
    ],
    previewSummary:
      "Inside the bilateral grants, multilateral programmes and global foundations driving Africa's education agenda — recognised at the Platinum tier for continental-scale partnership.",
    primaryCta: { label: "Explore Global Partners", href: "/awards/grants-global-support" },
    secondaryCta: { label: "Become a Strategic Partner", href: "/partners" },
    tertiaryCta: { label: "Explore Nominees", href: "/nominees?category=grants-global-support" },
    engagementCtaLabel: "Watch Partnership Story",
  },
];


const pathwayDefaults = Object.fromEntries(pathways.map((p) => [p.id, p]));

export function AwardSpotlightSection() {
  const { cards: dbCards } = usePathwayCards();

  // Merge DB overrides (text/links) on top of cinematic defaults; keep videos + icons.
  const merged: PathwayVideoCardData[] = (() => {
    const byId: Record<string, PathwayVideoCardData> = { ...pathwayDefaults };
    for (const row of dbCards) {
      if (!row.is_active) {
        delete byId[row.id];
        continue;
      }
      const base = pathwayDefaults[row.id] ?? pathways[0];
      byId[row.id] = {
        ...base,
        id: row.id,
        category: row.category || base.category,
        headline: row.headline || base.headline,
        story: row.description || base.story,
        accentLabel: row.accent_label || base.accentLabel,
        visualGradient: row.visual_gradient || base.visualGradient,
        primaryCta: row.href
          ? { label: row.cta || base.primaryCta.label, href: row.href }
          : base.primaryCta,
      };
    }
    const order = dbCards.length
      ? dbCards.filter((r) => r.is_active && byId[r.id]).map((r) => r.id)
      : pathways.map((p) => p.id);
    const seen = new Set<string>();
    const ordered: PathwayVideoCardData[] = [];
    for (const id of order) {
      if (byId[id] && !seen.has(id)) {
        ordered.push(byId[id]);
        seen.add(id);
      }
    }
    for (const p of pathways) if (!seen.has(p.id) && byId[p.id]) ordered.push(byId[p.id]);
    return ordered;
  })();

  return (
    <section
      className="relative bg-charcoal py-16 sm:py-24 overflow-hidden"
      aria-labelledby="pathways-heading"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-emerald-700/10 blur-3xl" />
      </div>

      <div className="container relative px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-5">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs sm:text-sm font-semibold text-gold uppercase tracking-[0.2em]">
              Nominate & Vote
            </span>
          </div>
          <h2
            id="pathways-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
          >
            Nominate and <span className="text-gold">Vote</span>
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-7">
            Celebrate Africa's education changemakers — from lifetime icons and corporate champions
            to digital voices and global partners advancing{" "}
            <span className="text-gold font-medium">Education for All</span> across Africa and the
            diaspora.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/nominate">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-7 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.6)]"
              >
                Start a Nomination
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vote">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-gold/60 text-gold hover:bg-gold/10 rounded-full gap-2 px-7"
              >
                Vote for Nominees
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-white/80 hover:text-gold hover:bg-white/5 rounded-full gap-2 px-7"
              >
                Explore Categories
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Cinematic 2×2 video card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-4">
          {merged.map((card, idx) => (
            <PathwayVideoCard key={card.id} card={card} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AwardSpotlightSection;
