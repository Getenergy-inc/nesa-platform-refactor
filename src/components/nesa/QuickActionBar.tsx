import { Link } from "react-router-dom";
import { Award, Vote, PlayCircle, Ticket, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActionBar() {
  return (
    <div className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-gold/20 md:hidden">
      <div className="px-3 py-2">
        {/* Primary Actions Row */}
        <div className="flex gap-2">
          <Link to="/nominate" className="flex-1">
            <Button
              size="sm"
              className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-lg gap-1.5 text-xs h-10"
            >
              <Award className="h-4 w-4" />
              Nominate
            </Button>
          </Link>
          
          <Link to="/vote" className="flex-1">
            <Button
              size="sm"
              className="w-full bg-[hsl(220,70%,50%)] hover:bg-[hsl(220,70%,45%)] text-white font-semibold rounded-lg gap-1.5 text-xs h-10"
            >
              <Vote className="h-4 w-4" />
              Vote
            </Button>
          </Link>
        </div>
        
        {/* Secondary Actions Row */}
        <div className="flex gap-2 mt-2">
          <Link to="/media/tv" className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-gold/30 text-gold hover:bg-gold/10 rounded-lg gap-1.5 text-xs h-9"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Watch
            </Button>
          </Link>
          
          <Link to="/buy-your-ticket" className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-gold/30 text-gold hover:bg-gold/10 rounded-lg gap-1.5 text-xs h-9"
            >
              <Ticket className="h-3.5 w-3.5" />
              Tickets
            </Button>
          </Link>
          
          <Link to="/earn-voting-credits" className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-gold/30 text-gold hover:bg-gold/10 rounded-lg gap-1.5 text-xs h-9"
            >
              <Coins className="h-3.5 w-3.5" />
              Earn AGC
            </Button>
          </Link>
        </div>
        
        {/* AGC Marketing Message - Compact */}
        <Link 
          to="/about-agc"
          className="flex items-center justify-between mt-2 px-3 py-2 rounded-lg bg-gold/5 border border-gold/20 group"
        >
          <div className="flex items-center gap-2">
            <Coins className="h-3.5 w-3.5 text-gold" />
            <p className="text-[11px] text-gold font-medium">
              Earn points → Vote for Gold & Blue Garnet
            </p>
          </div>
          <ArrowRight className="h-3 w-3 text-gold/60 group-hover:text-gold transition-colors" />
        </Link>
      </div>
    </div>
  );
}
