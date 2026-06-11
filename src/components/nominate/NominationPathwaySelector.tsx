import { Crown, Trophy, Gem, Megaphone, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { NominationPathway } from "./types";

const PATHWAYS: {
  key: NominationPathway;
  title: string;
  description: string;
  eligibility: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: string;
}[] = [
  {
    key: "icon",
    title: "Africa Education Icon",
    description:
      "Lifetime education impact leaders, continental icons, legacy contributors, diaspora figures, and friends of Africa.",
    eligibility: "Sustained, decades-long impact. Curated jury review.",
    icon: Crown,
  },
  {
    key: "gold-bluegarnet",
    title: "Gold-Blue Garnet Categories",
    description:
      "Competitive education changemakers — educators, NGOs, schools, CSR contributors, innovators, and organizations.",
    eligibility: "Open public nomination with category-fit and evidence review.",
    icon: Trophy,
  },
  {
    key: "platinum",
    title: "Platinum Recognition",
    description:
      "Institutions, ministries, foundations, universities, multilaterals, CSR bodies, and large-scale education organizations.",
    eligibility: "Institutional nominations with governance verification.",
    icon: Gem,
  },
  {
    key: "influencer",
    title: "Influencer Education Impact",
    description:
      "Creators, broadcasters, journalists, podcasters, social media educators, and digital voices advancing education.",
    eligibility: "Verified public reach and sustained education content.",
    icon: Megaphone,
  },
  {
    key: "special-needs-school",
    title: "Special Needs School Intervention",
    description:
      "Nominate a special needs school for the 2026/2027 EduAid-Africa Special Needs School Intervention powered through Rebuild My School Africa.",
    eligibility: "Schools serving learners with disabilities. Separate form.",
    icon: GraduationCap,
    external: "/impact/nominate-school",
  },
];

export function NominationPathwaySelector({
  onSelect,
  preselectFamily,
}: {
  onSelect: (p: NominationPathway) => void;
  preselectFamily?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">Step 2</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
          Who Are You Nominating?
        </h2>
        <p className="text-sm text-white/65 max-w-2xl">
          Choose the recognition pathway that best matches your nominee. You can add multiple
          nominees across pathways before final submission.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PATHWAYS.map((p) => {
          const Icon = p.icon;
          const f = preselectFamily?.toLowerCase() ?? "";
          const isPreselected = Boolean(
            f &&
              ((p.key === "icon" && /icon|lifetime|legend/.test(f)) ||
                (p.key === "influencer" &&
                  /influenc|creator|musician|footballer|sports|social-media/.test(f)) ||
                (p.key === "platinum" && /platinum|institutional/.test(f)) ||
                (p.key === "gold-bluegarnet" &&
                  /gold|blue|garnet|competitive/.test(f)) ||
                (p.key === "special-needs-school" &&
                  /rmsa|special-needs|school-intervention/.test(f))),
          );

          return (
            <Card
              key={p.key}
              className={`group relative overflow-hidden bg-charcoal/60 border transition-all hover:-translate-y-0.5 ${
                isPreselected ? "border-gold shadow-gold" : "border-white/10 hover:border-gold/40"
              }`}
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-gold/10 border border-gold/30 grid place-items-center">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-white">{p.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{p.description}</p>
                <p className="text-xs text-white/50 italic">{p.eligibility}</p>
                <div className="pt-2">
                  {p.external ? (
                    <Button
                      asChild
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2"
                    >
                      <Link to={p.external}>
                        Select <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onSelect(p.key)}
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2"
                    >
                      Select <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
