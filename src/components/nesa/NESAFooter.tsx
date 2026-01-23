import { forwardRef } from "react";
import { Link } from "react-router-dom";

export const NESAFooter = forwardRef<HTMLElement>(function NESAFooter(_, ref) {
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="bg-charcoal border-t border-gold/20 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-charcoal-light rounded flex items-center justify-center border border-gold/30">
              <span className="text-gold font-display font-bold text-sm">SCEF</span>
            </div>
            <span className="text-white/30">|</span>
            <span className="text-gold font-medium">NESA-Africa</span>
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
});
