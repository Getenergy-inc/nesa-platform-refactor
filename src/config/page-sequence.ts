// Ordered sequence of public pages for book-style navigation.
// Paths here MUST match canonical routes in src/App.tsx (no redirect aliases),
// so the flow bar and Pages drawer work on every public surface.

export interface PageEntry {
  path: string;
  label: string;
  section?: string;
}

export const PAGE_SEQUENCE: PageEntry[] = [
  { path: "/", label: "Home", section: "Home" },

  // About
  { path: "/about", label: "About NESA-Africa", section: "About" },
  { path: "/about/nesa-africa-2026", label: "About 2026", section: "About" },
  { path: "/about/nesa-africa-2027", label: "About 2027", section: "About" },
  { path: "/about/nesa-africa-2028-2030", label: "About 2028–2030", section: "About" },
  { path: "/governance", label: "Governance & Integrity", section: "About" },
  { path: "/timeline", label: "2026–2027 Timeline", section: "About" },
  { path: "/faqs", label: "FAQs", section: "About" },

  // Recognition
  { path: "/recognition", label: "Recognition Framework", section: "Recognition" },
  { path: "/awards", label: "Awards Overview", section: "Recognition" },
  { path: "/awards/africa-education-icon", label: "Africa Education Icon", section: "Recognition" },
  { path: "/awards/gold-blue-garnet", label: "Gold-Blue Garnet", section: "Recognition" },
  { path: "/awards/platinum", label: "Platinum Recognition", section: "Recognition" },
  { path: "/awards/influencer-education-impact", label: "Influencer Education Impact", section: "Recognition" },

  // Participate
  { path: "/nominate", label: "Nominate an Enabler", section: "Participate" },
  { path: "/nominees", label: "Explore Existing Nominees", section: "Participate" },
  { path: "/directory", label: "Education Impact Directory", section: "Participate" },
  { path: "/judges", label: "Judges", section: "Participate" },
  { path: "/nrc", label: "Nominee Research Corps", section: "Participate" },
  { path: "/chapters", label: "Local Chapters & Volunteers", section: "Participate" },
  { path: "/vacancies", label: "Join Our Team", section: "Participate" },

  // Regions & Impact
  { path: "/regions", label: "Regions", section: "Impact" },
  { path: "/impact", label: "Impact Programmes Hub", section: "Impact" },
  { path: "/eduaid-africa", label: "EduAid-Africa", section: "Impact" },
  { path: "/rebuild-my-school", label: "Rebuild My School Africa", section: "Impact" },
  { path: "/special-needs", label: "Special Needs Education", section: "Impact" },
  { path: "/afri-edutourism", label: "Afri-EduTourism", section: "Impact" },

  // Media & Gala
  { path: "/media", label: "Media & Stories", section: "Media" },
  { path: "/gala", label: "Award Gala", section: "Media" },
  { path: "/tickets", label: "Buy Gala Ticket", section: "Media" },

  // Support
  { path: "/support", label: "Support NESA-Africa", section: "Support" },
  { path: "/donate", label: "Donate", section: "Support" },
  { path: "/merch", label: "Merchandise", section: "Support" },
  { path: "/sponsors", label: "Sponsors & Partners", section: "Support" },
  { path: "/endorsements", label: "Endorsements", section: "Support" },
  { path: "/contact", label: "Contact", section: "Support" },
];

export function getPageIndex(pathname: string): number {
  return PAGE_SEQUENCE.findIndex((p) => p.path === pathname);
}

/**
 * Nearest known page for an unlisted route (e.g. /awards/explore/... or
 * /nominee/:slug) so deep pages still get sensible prev/next context.
 */
export function getNearestPageIndex(pathname: string): number {
  const exact = getPageIndex(pathname);
  if (exact !== -1) return exact;

  let bestIndex = -1;
  let bestLength = 0;
  PAGE_SEQUENCE.forEach((p, i) => {
    if (p.path === "/") return;
    if (pathname === p.path || pathname.startsWith(p.path + "/")) {
      if (p.path.length > bestLength) {
        bestLength = p.path.length;
        bestIndex = i;
      }
    }
  });
  return bestIndex;
}

export function getPageNavigation(pathname: string) {
  const exactIndex = getPageIndex(pathname);
  const index = exactIndex !== -1 ? exactIndex : getNearestPageIndex(pathname);
  const total = PAGE_SEQUENCE.length;
  const isKnown = index !== -1;

  return {
    currentIndex: index,
    currentPage: isKnown ? PAGE_SEQUENCE[index] : null,
    /** true only when the URL matches a sequence entry exactly */
    isExact: exactIndex !== -1,
    totalPages: total,
    pageNumber: isKnown ? index + 1 : null,
    previousPage: isKnown && index > 0 ? PAGE_SEQUENCE[index - 1] : null,
    nextPage: isKnown && index < total - 1 ? PAGE_SEQUENCE[index + 1] : null,
    isFirst: index <= 0,
    isLast: index === total - 1,
    isKnown,
  };
}
