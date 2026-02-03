import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs - Reusable navigation breadcrumb component
 * 
 * Can be used with:
 * 1. Custom items array
 * 2. Auto-generated from current URL path
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if no items provided
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbs(location.pathname);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center gap-1 text-sm text-muted-foreground ${className}`}
    >
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link 
              to={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Generate breadcrumb items from URL path
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];
  
  let currentPath = "";
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // Format label from segment (handle slugs with dashes)
    const label = formatSegmentLabel(segment);
    
    items.push({
      label,
      href: i < segments.length - 1 ? currentPath : undefined,
    });
  }
  
  return items;
}

/**
 * Format URL segment into readable label
 */
function formatSegmentLabel(segment: string): string {
  // Handle known routes
  const knownLabels: Record<string, string> = {
    "about": "About",
    "awards": "Awards",
    "categories": "Categories",
    "nominees": "Nominees",
    "media": "Media",
    "shop": "Shop",
    "vote": "Vote",
    "nominate": "Nominate",
    "judges": "Judges",
    "partners": "Partners",
    "donate": "Donate",
    "contact": "Contact",
    "chapters": "Chapters",
    "volunteer": "Volunteer",
    "platinum": "Platinum Certificate",
    "gold": "Gold Certificate",
    "blue-garnet": "Blue Garnet Award",
    "icon": "Icon Award",
    "winners": "Past Winners",
    "vision-2035": "Vision 2035",
    "governance": "Governance",
    "timeline": "Timeline",
    "scef": "SCEF Foundation",
    "tv": "NESA Africa TV",
    "shows": "Online Shows",
    "webinars": "Webinars",
    "gala": "Gala",
    "cart": "Cart",
    "checkout": "Checkout",
  };
  
  if (knownLabels[segment]) {
    return knownLabels[segment];
  }
  
  // Format slug: replace dashes with spaces, capitalize words
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default Breadcrumbs;
