import { Link } from "react-router-dom";
import { Heart, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  variant?: "wide" | "compact";
  headline?: string;
  subline?: string;
}

/**
 * Cross-page volunteer conversion banner.
 * Drop into nominee pages, category pages, gala, impact, etc.
 */
export function VolunteerCTABanner({
  variant = "wide",
  headline = "Want to help build Africa's education movement?",
  subline = "Join thousands of contributors powering NESA-Africa across 30+ countries.",
}: Props) {
  if (variant === "compact") {
    return (
      <Link
        to="/volunteer"
        className="flex items-center justify-between gap-3 rounded-xl border border-gold/30 bg-gradient-to-r from-gold/5 to-transparent p-4 hover:border-gold/60 transition"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center">
            <Heart className="h-4 w-4 text-gold" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gold">Become a Volunteer</div>
            <div className="text-xs text-white/60">Power the movement</div>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-gold" />
      </Link>
    );
  }

  return (
    <section className="my-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-charcoal via-black to-charcoal p-8 md:p-10">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-gold/15 flex items-center justify-center flex-shrink-0">
              <Users className="h-7 w-7 text-gold" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-playfair text-2xl md:text-3xl text-gold mb-2">{headline}</h3>
              <p className="text-white/70 text-sm md:text-base">{subline}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
                <Link to="/volunteer">
                  Become a Volunteer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                <Link to="/volunteers">Meet the Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
