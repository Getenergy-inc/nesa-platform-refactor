// Ordered sequence of public pages for book-style navigation.
// 30-page architecture (2026 refactor) — task-focused, consolidated hubs.

export interface PageEntry {
  path: string;
  label: string;
  section?: string;
}

export const PAGE_SEQUENCE: PageEntry[] = [
  // 1. Home
  { path: "/", label: "Home", section: "Home" },

  // 2. About & Governance
  { path: "/about", label: "About NESA-Africa", section: "About" },

  // 3. Recognition Hub
  { path: "/recognition", label: "Recognition Season", section: "Recognition" },

  // 4–7. Tier pages / hubs
  { path: "/recognition/africa-education-icon", label: "Africa Education Icon", section: "Recognition" },
  { path: "/recognition/influencer-education-impact", label: "Influencer Education Impact", section: "Recognition" },
  { path: "/recognition/platinum", label: "Platinum Recognition Hub", section: "Recognition" },
  { path: "/recognition/gold-blue-garnet", label: "Gold-Blue Garnet Hub", section: "Recognition" },

  // 8–14. Seven Platinum category pages (dynamic slugs)
  { path: "/recognition/platinum/library-and-book-development", label: "Platinum · Library & Book Development", section: "Platinum Categories" },
  { path: "/recognition/platinum/research-and-development", label: "Platinum · Research & Development", section: "Platinum Categories" },
  { path: "/recognition/platinum/csr-in-education", label: "Platinum · CSR in Education", section: "Platinum Categories" },
  { path: "/recognition/platinum/international-education", label: "Platinum · International Education", section: "Platinum Categories" },
  { path: "/recognition/platinum/diaspora-education-impact", label: "Platinum · Diaspora Education Impact", section: "Platinum Categories" },
  { path: "/recognition/platinum/faith-based-organisations", label: "Platinum · Faith-Based Organisations", section: "Platinum Categories" },
  { path: "/recognition/platinum/political-leaders", label: "Platinum · Political Leaders", section: "Platinum Categories" },

  // 15–23. Nine Gold-Blue Garnet category pages (dynamic slugs)
  { path: "/recognition/gold-blue-garnet/ngo-education-impact", label: "GBG · NGO Education Impact", section: "Gold-Blue Garnet Categories" },
  { path: "/recognition/gold-blue-garnet/stem-education", label: "GBG · STEM Education", section: "Gold-Blue Garnet Categories" },
  { path: "/recognition/gold-blue-garnet/edu-tech", label: "GBG · Edu-Tech", section: "Gold-Blue Garnet Categories" },
  { path: "/recognition/gold-blue-garnet/media-advocacy", label: "GBG · Media & Advocacy", section: "Gold-Blue Garnet Categories" },
  { path: "/recognition/gold-blue-garnet/creative-arts", label: "GBG · Creative Arts", section: "Gold-Blue Garnet Categories" },
  { path: "/recognition/gold-blue-garnet/education-friendly-state", label: "GBG · Education-Friendly State", section: "Gold-Blue Garnet Categories" },
  { path: "/recognition/gold-blue-garnet/christian-education", label: "GBG · Christian Education", section: "Gold-Blue Garnet Categories" },
  { path: "/recognition/gold-blue-garnet/islamic-education", label: "GBG · Islamic Education", section: "Gold-Blue Garnet Categories" },
  { path: "/recognition/gold-blue-garnet/csr-national", label: "GBG · National CSR", section: "Gold-Blue Garnet Categories" },

  // 24. Directory
  { path: "/education-enablers", label: "Explore 2026 Education Enablers", section: "Directory" },

  // 25. Nominate
  { path: "/nominate", label: "Nominate", section: "Participate" },

  // 26. Timeline
  { path: "/timeline", label: "2026 Timeline", section: "Timeline" },

  // 27. EduAid-Africa Impact (consolidated)
  { path: "/eduaid-africa", label: "EduAid-Africa Impact", section: "Impact" },

  // 28. Media & Events (consolidated)
  { path: "/media", label: "Media & Events", section: "Media" },

  // 29. Gala & Tickets (consolidated)
  { path: "/gala", label: "Gala & Tickets", section: "Gala" },

  // 30. Support & Get Involved (consolidated)
  { path: "/support", label: "Support & Get Involved", section: "Support" },
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
