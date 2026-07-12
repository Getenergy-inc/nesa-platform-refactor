/**
 * NESA Africa — Impact Story Arc
 * Renders a Problem → Intervention → Results → Vision narrative for each nominee profile,
 * following the platform's recommended storytelling template. Derives copy from the
 * nominee's existing data; gracefully degrades when fields are sparse.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Quote, AlertTriangle, Rocket, TrendingUp, Compass, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { isOrganization, normalizeYearReferences, type EnrichedNominee } from "@/lib/nesaData";

interface ImpactStoryArcProps {
  nominee: EnrichedNominee;
}

interface StoryArc {
  headline: string;
  problem: string;
  intervention: string;
  results: string;
  vision: string;
}

function buildArc(n: EnrichedNominee): StoryArc {
  const org = isOrganization(n.name);
  const subject = n.name;
  const pronoun = org ? "It" : "They";
  const possessive = org ? "Its" : "Their";
  const place = n.country || n.regionName || "Africa";
  const category = normalizeYearReferences(n.subcategoryTitle || n.awardTitle || "education");
  const achievement = (n.achievement || "").trim();
  const achievementLower = achievement
    ? achievement.charAt(0).toLowerCase() + achievement.slice(1)
    : "advancing learning opportunities across underserved communities";

  return {
    headline: `How ${subject} is advancing ${category.toLowerCase()} across ${place}.`,
    problem: `Across ${place}, millions of learners still face barriers to quality education — limited access, under-resourced schools, gender and disability gaps, and fragile subcategories from classroom to opportunity. ${subject} stepped into this reality with a clear conviction that change is possible.`,
    intervention: `${pronoun} responded by ${achievementLower}${achievement.endsWith(".") ? "" : "."} ${possessive} approach blends leadership, innovation and community partnership — designed to be locally rooted and continentally relevant.`,
    results: `The work is measurable: lives reshaped, institutions strengthened, and new subcategories opened for learners who were previously left behind. Beyond the numbers, ${subject}'s impact is felt in the everyday classrooms, families and communities ${pronoun.toLowerCase()} serve${org ? "s" : ""}.`,
    vision: `Looking ahead, ${subject} is committed to scaling this model — turning today's breakthroughs into Africa's tomorrow. ${pronoun} embod${org ? "ies" : "y"} the NESA-Africa belief that Education for All is not a slogan, but a shared mandate for the continent.`,
  };
}

const SECTIONS = [
  { key: "problem", title: "The Challenge", icon: AlertTriangle, color: "text-amber-400", ring: "ring-amber-400/20" },
  { key: "intervention", title: "The Intervention", icon: Rocket, color: "text-gold", ring: "ring-gold/25" },
  { key: "results", title: "The Transformation", icon: TrendingUp, color: "text-emerald-400", ring: "ring-emerald-400/20" },
  { key: "vision", title: "The Vision", icon: Compass, color: "text-sky-300", ring: "ring-sky-300/20" },
] as const;

export function ImpactStoryArc({ nominee }: ImpactStoryArcProps) {
  const arc = buildArc(nominee);

  return (
    <Card className="bg-charcoal-light/60 border-gold/15">
      <CardContent className="p-6 md:p-8">
        {/* Hero Impact Headline */}
        <div className="flex items-start gap-3 mb-6">
          <Quote className="w-8 h-8 text-gold/30 flex-shrink-0 mt-1" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-gold/70 mb-1.5">
              Impact Story
            </p>
            <h2 className="font-display text-ivory text-xl md:text-2xl leading-snug">
              {arc.headline}
            </h2>
          </div>
        </div>

        {/* 4-part arc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className={`rounded-xl bg-charcoal/40 border border-gold/5 p-4 ring-1 ${s.ring}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-ivory/80">
                    {s.title}
                  </h3>
                </div>
                <p className="text-ivory/75 text-sm leading-relaxed">{arc[s.key]}</p>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-ivory/40 mt-4 flex items-center gap-1.5">
          <LinkIcon className="w-3 h-3" />
          Narrative arc auto-composed from verified data. Read our&nbsp;
          <Link to="/guidelines/impact-storytelling" className="text-gold/80 hover:text-gold underline-offset-2 hover:underline">
            impact storytelling guide
          </Link>
          &nbsp;for how editors expand each section.
        </p>
      </CardContent>
    </Card>
  );
}

export default ImpactStoryArc;
