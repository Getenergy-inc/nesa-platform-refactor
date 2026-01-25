import { Handshake } from "lucide-react";
import sponsor1 from "@/assets/sponsors/sponsor-1.png";
import sponsor2 from "@/assets/sponsors/sponsor-2.png";
import sponsor3 from "@/assets/sponsors/sponsor-3.png";
import sponsor4 from "@/assets/sponsors/sponsor-4.png";

const sponsors = [
  { id: 1, name: "Partner 1", logo: sponsor1 },
  { id: 2, name: "Partner 2", logo: sponsor2 },
  { id: 3, name: "Partner 3", logo: sponsor3 },
  { id: 4, name: "Partner 4", logo: sponsor4 },
];

export function SponsorsSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20 overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Handshake className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">Strategic Alliances</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Our Partners & Sponsors
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            NESA-Africa is proud to partner with organizations committed to transforming education across the continent.
          </p>
        </div>

        {/* Scrolling Logo Strip */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-charcoal to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-charcoal to-transparent z-10" />
          
          {/* Scrolling Container */}
          <div className="flex animate-scroll-x">
            {/* First set */}
            {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className="flex-shrink-0 mx-6 h-20 w-40 bg-white/5 border border-gold/20 rounded-lg flex items-center justify-center p-4 hover:border-gold/40 transition-colors"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-h-full max-w-full object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
