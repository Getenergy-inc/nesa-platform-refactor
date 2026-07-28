import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PillarFooterNote() {
  return (
    <section className="py-12 md:py-16 border-t border-gold/15 bg-charcoal-light/30">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <p className="font-display text-xl md:text-2xl font-bold text-ivory">
          NESA-Africa 2026
        </p>
        <p className="text-gold/90 italic text-sm md:text-base mt-1">
          The African Blue-Garnet Awards for Education
        </p>
        <p className="text-ivory/70 text-sm mt-1">
          Africa's Highest Honour for Education Enablers
        </p>
        <p className="text-ivory/55 text-xs mt-2">
          Powered by Santos Creations Educational Foundation
        </p>

        <p className="mt-6 text-ivory/65 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
          Recognition is based on evidence, category criteria, and independent
          review. Sponsorship does not influence nominations, judging,
          shortlisting, finalists, laureate selection, or winners.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full"
          >
            <Link to="/nominate">Nominate an Education Champion</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10 rounded-full"
          >
            <Link to="/awards/pillars">Explore Recognition Pillars</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PillarFooterNote;
