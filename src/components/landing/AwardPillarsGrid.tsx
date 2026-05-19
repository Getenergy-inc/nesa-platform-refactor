import { useMemo } from "react";
import { Crown, HeartHandshake, Radio, Globe2 } from "lucide-react";
import { CinematicAwardCard } from "./CinematicAwardCard";
import { ICON_NOMINEES, ICON_SUBCATEGORIES } from "@/data/iconAward";
import { GOLD_CATEGORIES, getAllGoldNominees } from "@/data/goldSpecialRecognition";

export function AwardPillarsGrid() {
  const iconCount = ICON_NOMINEES.length;
  const goldCount = useMemo(() => getAllGoldNominees().length, []);

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-charcoal-light to-charcoal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
            Four pillars · one standard
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2">
            The Award Tracks
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <CinematicAwardCard
            icon={Crown}
            eyebrow="Lifetime Achievement"
            title="Africa Education Icon Award"
            description="Honouring 20 years of transformative leaders shaping curriculum, technical education, and philanthropy across Africa (2006–2026)."
            href="/awards/africa-education-icon"
            ctaLabel="Meet the Icons"
            stats={[
              { label: "Honourees", value: iconCount },
              { label: "Subcategories", value: ICON_SUBCATEGORIES.length },
              { label: "Years", value: "20" },
            ]}
          />
          <CinematicAwardCard
            icon={HeartHandshake}
            eyebrow="CSR for Education"
            title="Corporate Social Responsibility"
            description="Companies, foundations, and CSR programs investing in schools, scholarships, and learning infrastructure across the continent."
            href="/awards/csr-for-education"
            ctaLabel="Explore CSR"
            accent="ivory"
          />
          <CinematicAwardCard
            icon={Radio}
            eyebrow="Cultural Influence"
            title="Influencers Education Impact"
            description="Musicians, athletes, and digital voices using their platforms to advance education for African youth."
            href="/awards/gold-special-recognition"
            ctaLabel="See Influencers"
            stats={[
              { label: "Tracks", value: GOLD_CATEGORIES.length },
              { label: "Nominees", value: goldCount },
              { label: "Reach", value: "100M+" },
            ]}
          />
          <CinematicAwardCard
            icon={Globe2}
            eyebrow="Global Coalition"
            title="Global Partnerships"
            description="International institutions, governments, and Friends of Africa partnering on cross-border education impact."
            href="/awards/global-partnerships"
            ctaLabel="View Partners"
            accent="ivory"
          />
        </div>
      </div>
    </section>
  );
}

export default AwardPillarsGrid;
