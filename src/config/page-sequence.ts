// Ordered sequence of public pages for book-style navigation.
// 22-page architecture (2026 final refactor) — task-focused, consolidated hubs.

export interface PageEntry {
  path: string;
  label: string;
  section?: string;
}

export const PAGE_SEQUENCE: PageEntry[] = [
  { path: "/", label: "Home", section: "Home" },
  { path: "/about", label: "About NESA-Africa", section: "About" },
  { path: "/governance", label: "Governance & Integrity", section: "Governance" },
  { path: "/recognition", label: "Recognition Framework", section: "Recognition" },
  { path: "/africa-education-icon", label: "Africa Education Icon Award", section: "Recognition" },
  { path: "/gold-blue-garnet", label: "Gold-Blue Garnet Recognition", section: "Recognition" },
  { path: "/platinum", label: "Platinum Recognition", section: "Recognition" },
  { path: "/influencer-impact", label: "Influencer Education Impact", section: "Recognition" },
  { path: "/nominate", label: "Nominate", section: "Participate" },
  { path: "/directory", label: "Africa Education Impact Directory", section: "Directory" },
  { path: "/regions", label: "Regions", section: "Regions" },
  { path: "/impact", label: "Impact Programmes Hub", section: "Impact" },
  { path: "/eduaid-africa", label: "EduAid-Africa", section: "Impact" },
  { path: "/rebuild-my-school", label: "Rebuild My School Africa", section: "Impact" },
  { path: "/special-needs", label: "Special Needs Education", section: "Impact" },
  { path: "/afri-edutourism", label: "Afri-EduTourism", section: "Impact" },
  { path: "/media", label: "Media & Stories", section: "Media" },
  { path: "/gala", label: "Gala & Tickets", section: "Gala" },
  { path: "/sponsors", label: "Sponsors & Partners", section: "Support" },
  { path: "/shop", label: "Merchandise", section: "Support" },
  { path: "/endorsements", label: "Endorsements", section: "Support" },
  { path: "/chapters", label: "Local Chapters & Volunteers", section: "Support" },
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
