// VolunteerTrustBand — condensed live social proof for the global team.
// Counts come from useGlobalTeamStats (volunteers + judges + NRC + chapters).

import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";
import { useGlobalTeamStats } from "@/hooks/useGlobalTeamStats";

export function VolunteerTrustBand() {
  const stats = useGlobalTeamStats();
  return (
    <section aria-label="Global team social proof" className="bg-charcoal-light/40 py-8 border-y border-gold/15">
      <div className="container flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
            <Users className="h-5 w-5 text-gold" />
          </div>
          <p className="font-display text-gold uppercase tracking-[0.18em] text-xs">Powered by People</p>
        </div>
        <p className="text-white text-base md:text-lg flex-1">
          <span className="font-bold text-gold">{stats.people}</span> volunteers, judges & NRC members ·{" "}
          <span className="font-bold text-gold">{stats.countries}</span> countries ·{" "}
          <span className="font-bold text-gold">{stats.activeChapters}</span> active chapters
        </p>
        <Link to="/about/team" className="inline-flex items-center gap-1 text-gold font-semibold hover:underline">
          Meet the team <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default VolunteerTrustBand;
