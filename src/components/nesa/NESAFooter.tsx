import { Link } from "react-router-dom";

export function NESAFooter() {
  return (
    <footer className="bg-nesa-navy-dark border-t border-nesa-gold/10 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-white/90 rounded flex items-center justify-center text-nesa-navy font-bold text-xs">
              SCEF LOGO
            </div>
            <span className="text-nesa-text-muted">|</span>
            <span className="text-nesa-gold font-medium">NESA-Africa</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-nesa-text-muted hover:text-nesa-gold transition-colors">Home</Link>
            <Link to="/programs" className="text-nesa-text-muted hover:text-nesa-gold transition-colors">Programs</Link>
            <Link to="/categories" className="text-nesa-text-muted hover:text-nesa-gold transition-colors">Categories</Link>
            <Link to="/nominate" className="text-nesa-text-muted hover:text-nesa-gold transition-colors">Nominate</Link>
          </nav>

          <p className="text-nesa-text-muted text-sm">
            © 2025 Santa Claus Educational Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
