/**
 * Dashboard Hero — Welcome area with primary CTAs
 * Fully responsive with proper text contrast
 */

import { Link } from "react-router-dom";
import { Trophy, FileCheck, Shield, Map, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function DashboardHero() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const name = user.firstName || user?.email?.split("@")[0] || "there";

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#0F0F0F] border border-gold/20 p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl">
      {/* Gold decorative accents - adjusted for mobile */}
      <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gold/10 rounded-full blur-2xl sm:blur-3xl -translate-y-1/2 translate-x-1/4 sm:translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-gold/5 rounded-full blur-xl sm:blur-2xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10 space-y-4 sm:space-y-6">
        {/* Header section with responsive text */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold tracking-tight">
            <span className="text-white">{getGreeting()}, </span>
            <span className="text-gold bg-gold/10 px-2 py-1 rounded-lg inline-block mt-1 sm:mt-0">
              {name}
            </span>
          </h1>
          <p className="text-white/70 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
            Access nominations, awards, education standards, local chapters, and
            institutional programs across the continent.
          </p>
        </div>

        {/* Primary CTAs - Responsive grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-3">
          {/* Primary Action - Gold */}
          <Button
            asChild
            className="w-full lg:w-auto bg-gold hover:bg-gold/90 text-charcoal font-semibold h-10 sm:h-11 px-3 sm:px-6 text-xs sm:text-sm order-1 col-span-2 xs:col-span-1"
          >
            <Link to="/awards">
              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span>Explore Awards</span>
            </Link>
          </Button>

          {/* Secondary Actions */}
          <Button
            asChild
            variant="outline"
            className="w-full lg:w-auto border-gold/40 text-gold hover:bg-gold/10 hover:text-gold h-10 sm:h-11 px-3 sm:px-6 text-xs sm:text-sm order-2"
          >
            <Link to="/nominate">
              <FileCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span>Nominate</span>
            </Link>
          </Button>

          {/* Tertiary Actions - Better contrast */}
          <Button
            asChild
            variant="outline"
            className="w-full lg:w-auto border-white/20 text-gold/80 hover:bg-white/10 hover:text-white h-10 sm:h-11 px-3 sm:px-6 text-xs sm:text-sm order-3"
          >
            <Link to="/guidelines/edi-matrix">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Standards</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full lg:w-auto border-white/20 text-gold/80 hover:bg-white/10 hover:text-white h-10 sm:h-11 px-3 sm:px-6 text-xs sm:text-sm order-4"
          >
            <Link to="/chapters">
              <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Chapters</span>
            </Link>
          </Button>
        </div>

        {/* Quick Stats or Additional Info - Optional enhancement */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4 border-t border-white/10 mt-4 sm:mt-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
            <span className="text-white/50 text-[10px] sm:text-xs">
              2026 Season
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
            <span className="text-white/50 text-[10px] sm:text-xs">
              17 Categories
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold/60" />
            <span className="text-white/50 text-[10px] sm:text-xs">
              Voting Open
            </span>
          </div>
          <Link
            to="/dashboard/overview"
            className="ml-auto flex items-center gap-1 text-gold/70 hover:text-gold text-[10px] sm:text-xs transition-colors"
          >
            View full dashboard
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
