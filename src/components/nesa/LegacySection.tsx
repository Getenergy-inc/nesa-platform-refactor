import { Calendar, Check, Coins } from "lucide-react";

const regions = ["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"];

const facilities = [
  "Inclusive classrooms",
  "Accessibility & assistive facilities",
  "Learning resources for children with disabilities",
];

export function LegacySection() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary text-sm font-medium mb-2">Post-Award Legacy Phase</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Rebuild My School Africa
          </h2>

          <div className="flex items-center gap-2 text-secondary-foreground/70 mb-6">
            <Calendar className="h-4 w-4 text-primary" />
            <span>June 2026 – June 2027 • Implemented via EduAid-Africa</span>
          </div>

          <p className="text-secondary-foreground/70 mb-8 leading-relaxed">
            Translate recognition into direct, measurable education impact by rebuilding or
            renovating one Special Needs Education facility in each African region.
          </p>

          {/* Regions */}
          <div className="flex flex-wrap gap-2 mb-8">
            {regions.map((region) => (
              <span
                key={region}
                className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm"
              >
                {region}
              </span>
            ))}
          </div>

          {/* Facilities */}
          <div className="bg-charcoal/50 rounded-xl p-6 border border-primary/10 mb-8">
            <ul className="space-y-3">
              {facilities.map((facility) => (
                <li key={facility} className="flex items-center gap-3 text-secondary-foreground">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  {facility}
                </li>
              ))}
            </ul>
          </div>

          {/* Funding */}
          <div className="flex items-start gap-3 bg-charcoal/50 rounded-xl p-4 border border-primary/10">
            <Coins className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-primary text-sm font-medium mb-1">Funding Channels</p>
              <p className="text-secondary-foreground/70 text-sm">
                Ticket contributions • EduAid-Africa donations • CSR & partner contributions •
                Post-award campaigns
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
