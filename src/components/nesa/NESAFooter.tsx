import { Link } from "react-router-dom";
import { NESALogo } from "@/components/nesa/NESALogo";

export function NESAFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-gold/20 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <NESALogo variant="full" size="sm" />
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 bg-charcoal-light rounded flex items-center justify-center border border-gold/30">
                <span className="text-gold font-display font-bold text-xs">SCEF</span>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-white/70 hover:text-gold transition-colors">Home</Link>
            <Link to="/programs" className="text-white/70 hover:text-gold transition-colors">Programs</Link>
            <Link to="/categories" className="text-white/70 hover:text-gold transition-colors">Categories</Link>
            <Link to="/nominate" className="text-white/70 hover:text-gold transition-colors">Nominate</Link>
          </nav>

          <p className="text-white/50 text-sm">
            © {currentYear} Santa Claus Educational Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}