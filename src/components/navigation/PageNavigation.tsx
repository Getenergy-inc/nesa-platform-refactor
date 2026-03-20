// Universal Page Navigation System
// Fixed top bar + fixed bottom bar + pages drawer
// Consistent on every page, mobile-first, accessible
// Fully responsive across all views

import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PAGE_SEQUENCE, getPageNavigation } from "@/config/page-sequence";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

// ─── Custom Hook for Responsive Design ─────────────────────────────────────

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// ─── Top Navigation Bar ──────────────────────────────────────────────────────

export function TopPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  if (!nav.isKnown) return null;

  return (
    <>
      <nav
        aria-label="Page navigation"
        className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-primary/20 print:hidden"
      >
        <div className="flex items-center justify-between h-12 px-2 sm:px-3 md:px-4 lg:px-6 max-w-7xl mx-auto">
          {/* Left: Logo / Title */}
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <img
              src={nesaStamp}
              alt="NESA"
              className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover"
            />
            <span className="text-xs sm:text-sm font-semibold text-secondary-foreground hidden xs:inline">
              NESA Africa
            </span>
          </Link>

          {/* Center: Page indicator for mobile/tablet */}
          {(isMobile || isTablet) && (
            <div className="flex items-center gap-1 px-2">
              <span className="text-xs font-medium text-secondary-foreground/60">
                {nav.pageNumber}/{nav.totalPages}
              </span>
            </div>
          )}

          {/* Right: Back, Next, Pages */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <TopNavLink
              to={nav.previousPage?.path}
              disabled={nav.isFirst}
              aria-label="Go to previous page"
              className="px-1.5 sm:px-2 md:px-3"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs hidden md:inline">Back</span>
            </TopNavLink>

            <TopNavLink
              to={nav.nextPage?.path}
              disabled={nav.isLast}
              aria-label="Go to next page"
              className="px-1.5 sm:px-2 md:px-3"
            >
              <span className="text-xs hidden md:inline">Next</span>
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </TopNavLink>

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open page list"
              className="flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-2 sm:px-3 rounded-lg text-xs font-medium text-secondary-foreground/80 hover:text-primary hover:bg-primary/10 active:bg-primary/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isMobile ? (
                <Menu className="h-4 w-4" />
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  <span>Pages</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <PagesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPath={location.pathname}
      />
    </>
  );
}

// ─── Top Nav Link ────────────────────────────────────────────────────────────

function TopNavLink({
  to,
  disabled,
  children,
  className,
  ...props
}: {
  to?: string;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const classes = cn(
    "inline-flex items-center gap-0.5 sm:gap-1 h-8 sm:h-9 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    disabled
      ? "opacity-30 cursor-not-allowed text-secondary-foreground/50"
      : "text-secondary-foreground/80 hover:text-primary hover:bg-primary/10 active:bg-primary/15",
    className,
  );

  if (disabled || !to) {
    return (
      <span className={classes} aria-disabled="true" {...props}>
        {children}
      </span>
    );
  }

  return (
    <Link to={to} className={classes} {...props}>
      {children}
    </Link>
  );
}

// ─── Bottom Navigation Bar ───────────────────────────────────────────────────

export function BottomPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isLandscape = useMediaQuery(
    "(orientation: landscape) and (max-height: 500px)",
  );

  if (!nav.isKnown) return null;

  // Don't show bottom nav on landscape mobile to save space
  if (isMobile && isLandscape) return null;

  return (
    <>
      <nav
        aria-label="Page pagination"
        className="fixed bottom-0 inset-x-0 z-50 bg-secondary/95 backdrop-blur-md border-t border-primary/20 print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-between h-12 sm:h-14 px-1 sm:px-2 md:px-4 max-w-7xl mx-auto">
          {/* Left: First + Previous */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {nav.totalPages > 8 && !isMobile && (
              <BottomNavLink
                to={PAGE_SEQUENCE[0].path}
                disabled={nav.isFirst}
                aria-label="Go to first page"
                className="px-2 sm:px-3"
              >
                <ChevronsLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </BottomNavLink>
            )}
            <BottomNavLink
              to={nav.previousPage?.path}
              disabled={nav.isFirst}
              aria-label="Go to previous page"
              className="px-2 sm:px-3"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {!isMobile && (
                <span className="hidden sm:inline text-xs sm:text-sm">
                  Previous
                </span>
              )}
            </BottomNavLink>
          </div>

          {/* Center: Page indicator + selector */}
          <button
            onClick={() => setSelectorOpen(true)}
            aria-label={`Page ${nav.pageNumber} of ${nav.totalPages}. Tap to jump to a page.`}
            className={cn(
              "flex items-center gap-1 sm:gap-2 h-8 sm:h-10 px-2 sm:px-3 md:px-4 rounded-lg bg-primary/10 hover:bg-primary/20 active:bg-primary/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isMobile && "max-w-[140px]",
            )}
          >
            <span className="text-xs sm:text-sm font-semibold text-primary truncate">
              {isMobile ? `Pg ${nav.pageNumber}` : `Page ${nav.pageNumber}`}
            </span>
            <span className="text-[10px] sm:text-xs text-secondary-foreground/50 whitespace-nowrap">
              {isMobile ? `/${nav.totalPages}` : `of ${nav.totalPages}`}
            </span>
          </button>

          {/* Right: Next + Last */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <BottomNavLink
              to={nav.nextPage?.path}
              disabled={nav.isLast}
              aria-label="Go to next page"
              className="px-2 sm:px-3"
            >
              {!isMobile && (
                <span className="hidden sm:inline text-xs sm:text-sm">
                  Next
                </span>
              )}
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </BottomNavLink>
            {nav.totalPages > 8 && !isMobile && (
              <BottomNavLink
                to={PAGE_SEQUENCE[nav.totalPages - 1].path}
                disabled={nav.isLast}
                aria-label="Go to last page"
                className="px-2 sm:px-3"
              >
                <ChevronsRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </BottomNavLink>
            )}
          </div>
        </div>
      </nav>

      <PagesDrawer
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        currentPath={location.pathname}
      />
    </>
  );
}

// ─── Bottom Nav Link ─────────────────────────────────────────────────────────

function BottomNavLink({
  to,
  disabled,
  children,
  className,
  ...props
}: {
  to?: string;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const classes = cn(
    "inline-flex items-center gap-0.5 sm:gap-1 h-8 sm:h-10 min-w-[36px] sm:min-w-[44px] justify-center px-1.5 sm:px-2 md:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    disabled
      ? "opacity-30 cursor-not-allowed text-secondary-foreground/40"
      : "text-secondary-foreground/80 hover:text-primary hover:bg-primary/10 active:bg-primary/15",
    className,
  );

  if (disabled || !to) {
    return (
      <span className={classes} aria-disabled="true" {...props}>
        {children}
      </span>
    );
  }

  return (
    <Link to={to} className={classes} {...props}>
      {children}
    </Link>
  );
}

// ─── Pages Drawer ────────────────────────────────────────────────────────────

function PagesDrawer({
  open,
  onClose,
  currentPath,
}: {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const handlePageClick = useCallback(
    (path: string) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose],
  );

  // Group by section
  const sections = PAGE_SEQUENCE.reduce<
    Record<string, (typeof PAGE_SEQUENCE)[number][]>
  >((acc, page) => {
    const s = page.section || "Other";
    if (!acc[s]) acc[s] = [];
    acc[s].push(page);
    return acc;
  }, {});

  // Responsive drawer width
  const drawerWidth = isMobile
    ? "w-[280px]"
    : isTablet
      ? "w-[320px]"
      : "w-[360px]";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="All pages"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={cn(
              "fixed top-0 right-0 bottom-0 z-[61] bg-secondary border-l border-primary/20 flex flex-col shadow-2xl",
              drawerWidth,
            )}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-primary/15">
              <h2 className="text-sm sm:text-base font-bold text-primary">
                All Pages
              </h2>
              <button
                onClick={onClose}
                aria-label="Close page list"
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-secondary-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Page list */}
            <div className="flex-1 overflow-y-auto overscroll-contain py-2 sm:py-3 px-2 sm:px-3 space-y-4 sm:space-y-5">
              {Object.entries(sections).map(([section, pages]) => (
                <div key={section}>
                  <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-primary/50 mb-1 sm:mb-1.5 px-1 sm:px-2">
                    {section}
                  </h3>
                  <ul className="space-y-0.5">
                    {pages.map((page) => {
                      const idx = PAGE_SEQUENCE.indexOf(page);
                      const isActive = currentPath === page.path;
                      return (
                        <li key={page.path}>
                          <button
                            onClick={() => handlePageClick(page.path)}
                            className={cn(
                              "flex items-center gap-2 sm:gap-3 w-full rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              isActive
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "text-secondary-foreground/70 hover:bg-primary/10 hover:text-primary active:bg-primary/15",
                            )}
                          >
                            <span
                              className={cn(
                                "flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[8px] sm:text-[10px] font-bold shrink-0 tabular-nums",
                                isActive
                                  ? "bg-primary-foreground/20 text-primary-foreground"
                                  : "bg-primary/10 text-primary/50",
                              )}
                            >
                              {idx + 1}
                            </span>
                            <span className="truncate">{page.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Drawer footer */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-primary/15 text-center">
              <span className="text-[10px] sm:text-xs text-secondary-foreground/40">
                {PAGE_SEQUENCE.length} pages total
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Add this to your global CSS file for the xs breakpoint
// @media (min-width: 480px) {
//   .xs\:inline {
//     display: inline;
//   }
// }
