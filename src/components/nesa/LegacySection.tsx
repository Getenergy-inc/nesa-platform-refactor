import { Calendar, Check, Coins } from "lucide-react";
import { useSeason } from "@/contexts/SeasonContext";
import { LEGACY_REGIONS } from "@/config/schedule";

// Legacy focus areas
const LEGACY_FOCUS_AREAS = [
  "Inclusive classrooms",
  "Accessibility & assistive facilities",
  "Learning resources for children with disabilities",
];

// Funding channels
const FUNDING_CHANNELS = [
  "Ticket contributions",
  "EduAid-Africa donations",
  "CSR & partner contributions",
  "Post-award campaigns",
];

export function LegacySection() {
  const { currentEdition } = useSeason();
  const ceremonyYear = currentEdition.displayYear + 1;
  const legacyEndYear = ceremonyYear + 1;
  const dateRange = `June ${ceremonyYear} – June ${legacyEndYear}`;

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-sm font-medium mb-2">Post-Award Legacy Phase</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Rebuild My School Africa
          </h2>

          <div className="flex items-center gap-2 text-white/70 mb-6">
            <Calendar className="h-4 w-4 text-gold" />
            <span>{dateRange} • Implemented via EduAid-Africa</span>
          </div>

          <p className="text-white/70 mb-8 leading-relaxed">
            Translate recognition into direct, measurable education impact by rebuilding or
            renovating one Special Needs Education facility in each African region.
          </p>

          {/* Regions */}
          <div className="flex flex-wrap gap-2 mb-8">
            {LEGACY_REGIONS.map((region) => (
              <span
                key={region}
                className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm"
              >
                {region}
              </span>
            ))}
          </div>

          {/* Facilities */}
          <div className="bg-charcoal-light rounded-xl p-6 border border-gold/20 mb-8">
            <ul className="space-y-3">
              {LEGACY_FOCUS_AREAS.map((facility) => (
                <li key={facility} className="flex items-center gap-3 text-white">
                  <Check className="h-5 w-5 text-gold flex-shrink-0" />
                  {facility}
                </li>
              ))}
            </ul>
          </div>

          {/* Funding */}
          <div className="flex items-start gap-3 bg-charcoal-light rounded-xl p-4 border border-gold/20">
            <Coins className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gold text-sm font-medium mb-1">Funding Channels</p>
              <p className="text-white/70 text-sm">
                {FUNDING_CHANNELS.join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
