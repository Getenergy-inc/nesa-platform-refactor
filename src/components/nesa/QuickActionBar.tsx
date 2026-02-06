import { Link } from "react-router-dom";
import { Trophy, Vote, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * QuickActionBar - Minimal sticky mobile bar
 * 
 * Shows ONLY when user scrolls past hero.
 * 3 buttons for key actions.
 */
export function QuickActionBar() {
  return (
    <div className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-gold/15 md:hidden">
      <div className="px-4 py-2.5 flex gap-2">
        <Link to="/nominate" className="flex-1">
          <Button
            size="sm"
            className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-lg gap-1.5 h-10"
          >
            <Trophy className="h-4 w-4" />
            Nominate
          </Button>
        </Link>
        
        <Link to="/vote" className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-gold/40 text-gold hover:bg-gold/10 font-semibold rounded-lg gap-1.5 h-10"
          >
            <Vote className="h-4 w-4" />
            Vote
          </Button>
        </Link>

        <Link to="/donate" className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-primary/40 text-primary hover:bg-primary/10 font-semibold rounded-lg gap-1.5 h-10"
          >
            <Heart className="h-4 w-4" />
            Donate
          </Button>
        </Link>
      </div>
    </div>
  );
}