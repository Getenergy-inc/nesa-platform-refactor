// Ordered sequence of all public pages for book-style navigation

export interface PageEntry {
  path: string;
  label: string;
  section?: string;
}

export const PAGE_SEQUENCE: PageEntry[] = [
  // Home
  { path: "/", label: "Home", section: "Home" },
  
  // About
  { path: "/about", label: "About NESA", section: "About" },
  { path: "/about/vision-2035", label: "Vision 2035", section: "About" },
  { path: "/about/governance", label: "Governance", section: "About" },
  { path: "/about/timeline", label: "Timeline", section: "About" },
  { path: "/about/scef", label: "SCEF", section: "About" },
  { path: "/about/social-impact", label: "Social Impact", section: "About" },
  
  // Awards
  { path: "/awards", label: "Awards Overview", section: "Awards" },
  { path: "/awards/platinum", label: "Platinum Award", section: "Awards" },
  { path: "/awards/gold", label: "Gold Award", section: "Awards" },
  { path: "/awards/blue-garnet", label: "Blue Garnet Award", section: "Awards" },
  { path: "/awards/icon", label: "Icon Award", section: "Awards" },
  { path: "/awards/gold-special-recognition", label: "Gold Special Recognition", section: "Awards" },
  { path: "/awards/winners", label: "Winners", section: "Awards" },
  { path: "/categories", label: "Categories", section: "Awards" },
  
  // Regions
  { path: "/regions", label: "Explore Regions", section: "Regions" },
  
  // Media
  { path: "/media", label: "Media Hub", section: "Media" },
  { path: "/media/tv", label: "NESA TV", section: "Media" },
  { path: "/media/shows", label: "Shows", section: "Media" },
  { path: "/media/webinars", label: "Webinars", section: "Media" },
  { path: "/media/gala", label: "Gala Night", section: "Media" },
  { path: "/videos", label: "Videos", section: "Media" },
  
  // Get Involved
  { path: "/nominate", label: "Nominate", section: "Get Involved" },
  { path: "/vote", label: "Vote", section: "Get Involved" },
  { path: "/donate", label: "Donate", section: "Get Involved" },
  { path: "/endorse", label: "Endorse NESA", section: "Get Involved" },
  { path: "/volunteer", label: "Volunteer", section: "Get Involved" },
  { path: "/ambassadors", label: "Ambassadors", section: "Get Involved" },
  { path: "/judges", label: "Judges", section: "Get Involved" },
  { path: "/judge/apply", label: "Apply as Judge", section: "Get Involved" },
  
  // Programs
  { path: "/programs", label: "Programs", section: "Programs" },
  { path: "/eduaid", label: "EduAid", section: "Programs" },
  { path: "/rebuild", label: "Rebuild", section: "Programs" },
  
  // Shop
  { path: "/shop", label: "Shop", section: "Shop" },
  { path: "/tickets", label: "Tickets", section: "Shop" },
  
  // Support
  { path: "/partners", label: "Partners", section: "Support" },
  { path: "/chapters", label: "Chapters", section: "Support" },
  { path: "/contact", label: "Contact", section: "Support" },
  { path: "/policies", label: "Policies", section: "Support" },
  
  // Guidelines
  { path: "/guidelines/edi-matrix", label: "EDI Matrix", section: "Guidelines" },
  { path: "/guidelines/nominators", label: "For Nominators", section: "Guidelines" },
  { path: "/guidelines/nominees", label: "For Nominees", section: "Guidelines" },
  { path: "/guidelines/judges", label: "For Judges", section: "Guidelines" },
  { path: "/guidelines/voters", label: "For Voters", section: "Guidelines" },
];

export function getPageIndex(pathname: string): number {
  return PAGE_SEQUENCE.findIndex((p) => p.path === pathname);
}

export function getPageNavigation(pathname: string) {
  const index = getPageIndex(pathname);
  const total = PAGE_SEQUENCE.length;
  const isKnown = index !== -1;

  return {
    currentIndex: index,
    currentPage: isKnown ? PAGE_SEQUENCE[index] : null,
    totalPages: total,
    pageNumber: isKnown ? index + 1 : null,
    previousPage: isKnown && index > 0 ? PAGE_SEQUENCE[index - 1] : null,
    nextPage: isKnown && index < total - 1 ? PAGE_SEQUENCE[index + 1] : null,
    isFirst: index === 0,
    isLast: index === total - 1,
    isKnown,
  };
}
