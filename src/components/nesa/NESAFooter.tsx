import { Link } from "react-router-dom";

export function NESAFooter() {
  return (
    <footer className="bg-charcoal border-t border-primary/10 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-white/90 rounded flex items-center justify-center text-secondary font-bold text-xs">
              SCEF LOGO
            </div>
            <span className="text-secondary-foreground/50">|</span>
            <span className="text-primary font-medium">NESA-Africa</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/" className="text-secondary-foreground/70 hover:text-primary transition-colors">Home</Link>
            <Link to="/programs" className="text-secondary-foreground/70 hover:text-primary transition-colors">Programs</Link>
            <Link to="/categories" className="text-secondary-foreground/70 hover:text-primary transition-colors">Categories</Link>
            <Link to="/nominate" className="text-secondary-foreground/70 hover:text-primary transition-colors">Nominate</Link>
          </nav>

          <p className="text-secondary-foreground/50 text-sm">
            © 2025 Santa Claus Educational Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
