import { Award, Shield } from "lucide-react";
import csacefa from "@/assets/endorsements/csacefa.png";
import faweKenya from "@/assets/endorsements/fawe-kenya.png";

// CMS-ready endorsement data structure
export interface Endorser {
  id: string;
  name: string;
  logo: string;
  country?: string;
  website?: string;
  endorsementDate?: string;
  isActive: boolean;
}

// Current endorsers - ready for CMS integration
const endorsers: Endorser[] = [
  { id: "csacefa", name: "Civil Society Action Coalition on Education for All", logo: csacefa, country: "Nigeria", isActive: true },
  { id: "fawe-kenya", name: "Forum for African Women Educationalists - Kenya", logo: faweKenya, country: "Kenya", isActive: true },
];

export function TrustLogosStrip() {
  const activeEndorsers = endorsers.filter((e) => e.isActive);

  return (
    <section className="bg-charcoal border-b border-white/5 py-4">
      <div className="container">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <span className="text-xs text-white/40 uppercase tracking-wider shrink-0">
            Endorsed by
          </span>
          <div className="flex items-center gap-6">
            {activeEndorsers.map((endorser) => (
              <img
                key={endorser.id}
                src={endorser.logo}
                alt={endorser.name}
                className="h-8 sm:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
