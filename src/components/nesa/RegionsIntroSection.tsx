// Section 4 intro — One Continent. Ten Education Regions.
// Sits above InteractiveAfricaMap. Charcoal/Gold tokens only.
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const REGIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "Horn of Africa",
  "Sahel Region",
  "Indian Ocean Islands",
  "African Diaspora",
  "Friends of Africa (Global)",
];

export function RegionsIntroSection() {
  return (
    <section id="ten-regions" className="bg-charcoal pt-16 md:pt-20 pb-6">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <p className="text-gold text-sm font-medium mb-2 uppercase tracking-wide">
          Continental Reach
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          One Continent. Ten Education Regions.
        </h2>
        <p className="text-white/70 max-w-3xl mx-auto leading-relaxed mb-6">
          Discover education champions, impact stories, and opportunities across
          Africa's diverse regions.
        </p>

        <ul className="flex flex-wrap justify-center gap-2 mb-6 max-w-4xl mx-auto">
          {REGIONS.map((r) => (
            <li
              key={r}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-gold/25 bg-charcoal-light text-white/85"
            >
              {r}
            </li>
          ))}
        </ul>

        <Link to="/regions">
          <Button
            size="lg"
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-7 gap-2"
          >
            Explore All Regions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
