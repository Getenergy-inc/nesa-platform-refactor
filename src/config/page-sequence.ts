// Ordered sequence of all public pages for book-style navigation

export interface PageEntry {
  path: string;
  label: string;
  section?: string;
}

// 60→38 public-page consolidation (2026 refactor).
// Removed: public voting routes (/vote, /how-voting-works, /trending, /earn-agc,
// /about-agc, /awards/winners, /results) per PUBLIC_AWARD_VOTING sunset.
// Collapsed: legacy category listings (/awards/categories, blue-garnet-categories,
// platinum-certificate-categories, /awards/gold, /awards/icon) into /recognition
// which fetches the DB spine.
export const PAGE_SEQUENCE: PageEntry[] = [
  // Home (1)
  { path: "/", label: "Home", section: "Home" },

  // About (6)
  { path: "/about", label: "About NESA", section: "About" },
  { path: "/about/vision-2035", label: "Vision 2035", section: "About" },
  { path: "/about/governance", label: "Governance", section: "About" },
  { path: "/about/timeline", label: "Timeline", section: "About" },
  { path: "/about/scef", label: "SCEF", section: "About" },
  { path: "/about/social-impact", label: "Social Impact", section: "About" },

  // Awards (6)
  { path: "/awards", label: "Awards Overview", section: "Awards" },
  { path: "/recognition", label: "Recognition Hub", section: "Awards" },
  { path: "/awards/africa-education-icon", label: "Africa Education Icon", section: "Awards" },
  { path: "/awards/influencers-education-impact", label: "Influencer Education Impact", section: "Awards" },
  { path: "/awards/gold-blue-garnet", label: "Gold-Blue Garnet", section: "Awards" },
  { path: "/awards/platinum", label: "Platinum Recognition", section: "Awards" },

  // Nominees (2)
  { path: "/nominees", label: "Nominees Directory", section: "Nominees" },
  { path: "/nominate", label: "Nominate Now", section: "Nominees" },

  // Regions (1)
  { path: "/regions", label: "Explore Regions", section: "Regions" },

  // Media (5)
  { path: "/media", label: "Media Hub", section: "Media" },
  { path: "/media/tv", label: "NESA TV", section: "Media" },
  { path: "/media/shows", label: "Shows", section: "Media" },
  { path: "/media/webinars", label: "Webinars", section: "Media" },
  { path: "/media/gala", label: "Gala Night", section: "Media" },

  // Get Involved (5)
  { path: "/donate", label: "Donate", section: "Get Involved" },
  { path: "/endorse", label: "Endorse NESA", section: "Get Involved" },
  { path: "/volunteer", label: "Volunteer", section: "Get Involved" },
  { path: "/ambassadors", label: "Ambassadors", section: "Get Involved" },
  { path: "/judges", label: "Meet Our Judges", section: "Get Involved" },

  // Programs (4)
  { path: "/programs", label: "Programs", section: "Programs" },
  { path: "/eduaid", label: "EduAid", section: "Programs" },
  { path: "/rebuild", label: "Rebuild My School", section: "Programs" },
  { path: "/impact", label: "Impact", section: "Programs" },

  // Shop (2)
  { path: "/shop", label: "Shop", section: "Shop" },
  { path: "/tickets", label: "Tickets", section: "Shop" },

  // Support (5)
  { path: "/partners", label: "Partners", section: "Support" },
  { path: "/contact", label: "Contact", section: "Support" },
  { path: "/faq", label: "FAQ", section: "Support" },
  { path: "/policies", label: "Policies", section: "Support" },
  { path: "/certificates/verify", label: "Verify Certificate", section: "Support" },

  // Guidelines (1)
  { path: "/guidelines/nominators", label: "For Nominators", section: "Guidelines" },
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
