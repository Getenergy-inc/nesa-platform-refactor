import { Link } from "react-router-dom";
import { Award, Vote, PlayCircle, Ticket, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActionBar() {
  return (
    <div className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-gold/20 md:hidden">
      <div className="container py-2 px-2">
        <div className="flex justify-around items-center gap-1">
          <Link to="/nominate" className="flex-1">
            <Button
              size="sm"
              className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-lg gap-1 text-xs h-9"
            >
              <Award className="h-3.5 w-3.5" />
              Nominate
            </Button>
          </Link>
          
          <Link to="/vote" className="flex-1 flex flex-col items-center">
            <Button
              size="sm"
              className="w-full bg-[hsl(220,70%,50%)] hover:bg-[hsl(220,70%,45%)] text-white font-semibold rounded-lg gap-1 text-xs h-9"
            >
              <Vote className="h-3.5 w-3.5" />
              Vote
            </Button>
          </Link>
          
          <Link to="/media/tv" className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-gold/40 text-gold hover:bg-gold/10 rounded-lg gap-1 text-xs h-9"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Watch
            </Button>
          </Link>
          
          <Link to="/buy-your-ticket" className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-gold/40 text-gold hover:bg-gold/10 rounded-lg gap-1 text-xs h-9"
            >
              <Ticket className="h-3.5 w-3.5" />
              Tickets
            </Button>
          </Link>
        </div>
        
        {/* AGC Marketing Message */}
        <div className="flex items-center justify-center gap-1.5 mt-2 px-2 py-1.5 rounded-lg bg-gold/5 border border-gold/20">
          <Coins className="h-3 w-3 text-gold" />
          <p className="text-[10px] text-gold font-medium">
            Earn voting points → Vote with AGC for Gold & Blue Garnet winners
          </p>
        </div>
      </div>
    </div>
  );
}
