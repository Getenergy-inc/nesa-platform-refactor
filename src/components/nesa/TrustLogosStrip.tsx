import { Award, Shield } from "lucide-react";
import csacefa from "@/assets/endorsements/csacefa.png";
import faweKenya from "@/assets/endorsements/fawe-kenya.png";

const logos = [
  { id: "csacefa", name: "CSACEFA", src: csacefa },
  { id: "fawe", name: "FAWE Kenya", src: faweKenya },
];

export function TrustLogosStrip() {
  return (
    <section className="bg-charcoal-light/50 border-y border-gold/10 py-6">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Label */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
              <Shield className="h-4 w-4 text-gold" />
              <span className="text-xs font-medium text-gold uppercase tracking-wider">
                Endorsed & Trusted By
              </span>
            </div>
          </div>

          {/* Center: Logo Marquee */}
          <div className="relative flex-1 max-w-3xl overflow-hidden">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-charcoal-light/50 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-charcoal-light/50 to-transparent z-10" />
            
            {/* Scrolling Logos */}
            <div className="flex animate-scroll-x">
              {[...logos, ...logos, ...logos].map((logo, index) => (
                <div
                  key={`${logo.id}-${index}`}
                  className="flex-shrink-0 mx-6 h-10 w-20 flex items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Integrity badge */}
          <div className="flex items-center gap-2 shrink-0 text-white/50 text-xs">
            <Award className="h-4 w-4" />
            <span>Merit-Based Selection</span>
          </div>
        </div>
      </div>
    </section>
  );
}
