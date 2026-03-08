/**
 * Dashboard Hero — Welcome area with primary CTAs
 */

import { Link } from "react-router-dom";
import { Trophy, FileCheck, Shield, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardHero() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(30_8%_8%)] via-[hsl(30_8%_6%)] to-[hsl(30_8%_4%)] border border-gold/10 p-6 md:p-8 lg:p-10">
      {/* Gold decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/3 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display text-white mb-2">
          Welcome to <span className="text-gold">NESA Africa</span>
        </h1>
        <p className="text-white/50 text-sm md:text-base max-w-2xl mb-6 lg:mb-8">
          Access nominations, awards, education standards, local chapters, and institutional programs across the continent.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-gold hover:bg-gold/90 text-charcoal font-semibold h-11 px-6 text-sm">
            <Link to="/awards">
              <Trophy className="h-4 w-4 mr-2" />
              Explore Awards
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold h-11 px-6 text-sm">
            <Link to="/nominate">
              <FileCheck className="h-4 w-4 mr-2" />
              Submit Nomination
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white h-11 px-6 text-sm">
            <Link to="/guidelines/edi-matrix">
              <Shield className="h-4 w-4 mr-2" />
              View Standards
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white h-11 px-6 text-sm">
            <Link to="/chapters">
              <Map className="h-4 w-4 mr-2" />
              Join Local Chapter
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
