import { Award, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="bg-nesa-navy py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-16 w-16 rounded-full bg-nesa-gold/20 flex items-center justify-center mx-auto mb-6">
            <Award className="h-8 w-8 text-nesa-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Nominate a Champion of Education
          </h2>
          <p className="text-nesa-text-muted mb-8">
            Know someone making an exceptional impact in African education? Submit your nomination
            today on nesa.africa
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/nominate">
              <Button size="lg" className="bg-nesa-gold hover:bg-nesa-gold-muted text-nesa-navy-dark font-semibold rounded-full px-8 gap-2">
                <Award className="h-5 w-5" />
                Submit Nomination
              </Button>
            </Link>
            <a href="https://nesa.africa" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-nesa-gold text-nesa-gold hover:bg-nesa-gold/10 rounded-full px-8 gap-2">
                <ExternalLink className="h-5 w-5" />
                Visit NESA Africa
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
