import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function NomineeBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ivory/60 mb-6">
      <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" />
        <span className="sr-only sm:not-sr-only">Home</span>
      </Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-ivory/30" />
          {c.href ? (
            <Link to={c.href} className="hover:text-gold transition-colors line-clamp-1">
              {c.label}
            </Link>
          ) : (
            <span className="text-ivory/90 line-clamp-1">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
