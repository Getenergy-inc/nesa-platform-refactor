import { Link } from "react-router-dom";
import { Trophy, Vote, Heart, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * QuickActionBar - Minimal sticky mobile bar
 * 
 * Shows ONLY when user scrolls past hero.
 * 4 buttons for key actions including Music.
 */
export function QuickActionBar() {
  const scrollToMusic = () => {
    const musicSection = document.getElementById('music');
    if (musicSection) {
      musicSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-gold/15 md:hidden">
      <div className="px-3 py-2.5 flex gap-1.5">
        <Link to="/nominate" className="flex-1">
          <Button
            size="sm"
            className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-lg gap-1 h-10 px-2 text-xs"
          >
            <Trophy className="h-3.5 w-3.5" />
            Nominate
          </Button>
        </Link>
        
        <Link to="/vote" className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-gold/40 text-gold hover:bg-gold/10 font-semibold rounded-lg gap-1 h-10 px-2 text-xs"
          >
            <Vote className="h-3.5 w-3.5" />
            Vote
          </Button>
        </Link>

        <button onClick={scrollToMusic} className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-semibold rounded-lg gap-1 h-10 px-2 text-xs"
          >
            <Music className="h-3.5 w-3.5" />
            Music
          </Button>
        </button>

        <Link to="/donate" className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-primary/40 text-primary hover:bg-primary/10 font-semibold rounded-lg gap-1 h-10 px-2 text-xs"
          >
            <Heart className="h-3.5 w-3.5" />
            Donate
          </Button>
        </Link>
      </div>
    </div>
  );
}