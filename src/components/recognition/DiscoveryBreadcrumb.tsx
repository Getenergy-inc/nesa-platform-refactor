// Universal progressive-discovery breadcrumb.
// Renders any subset of: Pathway → Category → Subcategory → Region → Country → Nominee.

import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface DiscoveryStep {
  label: string;
  href?: string;
}

interface Props {
  steps: DiscoveryStep[];
  className?: string;
}

export function DiscoveryBreadcrumb({ steps, className = "" }: Props) {
  return (
    <nav
      aria-label="Recognition discovery path"
      className={`flex items-center overflow-x-auto text-xs md:text-sm ${className}`}
    >
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-white/60 hover:text-gold"
      >
        <Home className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only md:not-sr-only">Home</span>
      </Link>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <span key={`${step.label}-${idx}`} className="flex items-center">
            <ChevronRight className="mx-2 h-3.5 w-3.5 text-white/40" aria-hidden />
            {step.href && !isLast ? (
              <Link
                to={step.href}
                className="whitespace-nowrap text-white/70 hover:text-gold"
              >
                {step.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="whitespace-nowrap font-medium text-gold"
              >
                {step.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default DiscoveryBreadcrumb;
