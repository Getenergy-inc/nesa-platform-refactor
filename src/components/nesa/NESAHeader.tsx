import { Globe, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NESAHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-charcoal/95 backdrop-blur-md border-b border-gold/20">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/programs/nesa-africa" className="flex items-center gap-2">
          <div className="h-10 w-24 bg-charcoal-light rounded flex items-center justify-center border border-gold/30">
            <span className="text-gold font-display font-bold text-sm">SCEF</span>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-white hover:text-gold hover:bg-gold/10 gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">English</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-gold hover:bg-gold/10">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
