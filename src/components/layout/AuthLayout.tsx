import { Link } from "react-router-dom";
import { Home, Trophy, Users, Play, Award } from "lucide-react";
import { NESALogo } from "@/components/nesa/NESALogo";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gradient-hero pattern-african">
      {/* Navigation Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Logo / Home Link */}
          <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-gold transition-colors">
            <NESALogo variant="icon" size="sm" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-lg">NESA-Africa</span>
              <span className="text-[8px] text-white/50 italic tracking-wider">The African Blue-Garnet Awards for Education</span>
            </div>
          </Link>

          {/* Quick Navigation Icons */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/10">
              <Link to="/" className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/10">
              <Link to="/categories" className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Categories</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/10">
              <Link to="/nominees" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Nominees</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-gold hover:bg-white/10">
              <Link to="/media/tv" className="flex items-center gap-1.5">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Watch</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center px-4 py-20">
        {children}
      </main>

      {/* Footer Quick Links */}
      <footer className="absolute bottom-0 left-0 right-0 px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-4 text-white/50 text-xs">
          <Link to="/about" className="hover:text-gold transition-colors">About</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
          <span>•</span>
          <Link to="/policies" className="hover:text-gold transition-colors">Policies</Link>
        </div>
      </footer>
    </div>
  );
}
