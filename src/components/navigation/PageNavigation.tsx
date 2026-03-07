// ═══════════════════════════════════════════════════════════════════════════
// Premium Page Navigation System
// Fixed top bar · Fixed bottom pagination · Pages drawer
// Identical on every page · Mobile-first · Accessible · Elegant
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PAGE_SEQUENCE, getPageNavigation } from "@/config/page-sequence";

// ─── TOP NAVIGATION BAR ─────────────────────────────────────────────────────
// Logo/title left · Back | Next | Pages right
// Sticky, translucent, minimal

export function TopPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!nav.isKnown) return null;

  return (
    <>
      <nav
        role="navigation"
        aria-label="Page navigation"
        className="sticky top-0 z-50 print:hidden"
      >
        {/* Glass bar */}
        <div className="bg-secondary/90 backdrop-blur-xl border-b border-primary/10 shadow-sm shadow-black/10">
          <div className="flex items-center justify-between h-12 px-3 sm:px-5 max-w-6xl mx-auto">

            {/* ── Left: Title + page context ── */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/"
                className="flex items-center gap-2 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-primary text-xs font-black tracking-tighter">N</span>
                </div>
                <span className="text-sm font-semibold text-secondary-foreground tracking-tight hidden sm:block">
                  NESA Africa
                </span>
              </Link>

              {/* Current page label (desktop) */}
              <div className="hidden md:flex items-center gap-2 min-w-0">
                <span className="text-secondary-foreground/20">·</span>
                <span className="text-xs text-secondary-foreground/50 truncate max-w-[200px]">
                  {nav.currentPage?.label}
                </span>
              </div>
            </div>

            {/* ── Right: Back · Next · Pages ── */}
            <div className="flex items-center gap-0.5">
              <NavPill
                to={nav.previousPage?.path}
                disabled={nav.isFirst}
                aria-label="Previous page"
                title={nav.previousPage ? `Back: ${nav.previousPage.label}` : undefined}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Back</span>
              </NavPill>

              <NavPill
                to={nav.nextPage?.path}
                disabled={nav.isLast}
                aria-label="Next page"
                title={nav.nextPage ? `Next: ${nav.nextPage.label}` : undefined}
              >
                <span className="hidden sm:inline text-xs">Next</span>
                <ChevronRight className="h-4 w-4" />
              </NavPill>

              {/* Separator */}
              <div className="w-px h-5 bg-secondary-foreground/10 mx-1" />

              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Browse all pages"
                className={cn(
                  "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition-all duration-200",
                  "text-primary/80 hover:text-primary hover:bg-primary/10 active:bg-primary/15 active:scale-[0.97]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Pages</span>
              </button>
            </div>
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

// ─── BOTTOM PAGINATION BAR ──────────────────────────────────────────────────
// Previous · [Page X of Y] · Next
// Fixed, translucent, with optional First/Last for large page counts

export function BottomPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!nav.isKnown) return null;

  const showEdgeButtons = nav.totalPages > 12;

  return (
    <>
      <nav
        role="navigation"
        aria-label="Page pagination"
        className="fixed bottom-0 inset-x-0 z-50 print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="bg-secondary/90 backdrop-blur-xl border-t border-primary/10 shadow-[0_-2px_12px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-between h-[56px] px-2 sm:px-4 max-w-6xl mx-auto">

            {/* ── Left: First? + Previous ── */}
            <div className="flex items-center gap-0.5 min-w-[80px]">
              {showEdgeButtons && (
                <PaginationLink
                  to={PAGE_SEQUENCE[0].path}
                  disabled={nav.isFirst}
                  aria-label="First page"
                  compact
                >
                  <ChevronsLeft className="h-4 w-4" />
                </PaginationLink>
              )}
              <PaginationLink
                to={nav.previousPage?.path}
                disabled={nav.isFirst}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Prev</span>
              </PaginationLink>
            </div>

            {/* ── Center: Page Indicator (tappable) ── */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label={`Page ${nav.pageNumber} of ${nav.totalPages}. Tap to jump to any page.`}
              className={cn(
                "relative flex items-center gap-2 h-10 px-5 rounded-full transition-all duration-200",
                "bg-primary/10 hover:bg-primary/15 active:bg-primary/20 active:scale-[0.97]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
                "group"
              )}
            >
              <span className="text-sm font-bold text-primary tabular-nums">
                {nav.pageNumber}
              </span>
              <span className="text-[10px] text-secondary-foreground/40 font-medium uppercase tracking-wide">
                / {nav.totalPages}
              </span>
              {/* Subtle expand hint */}
              <LayoutGrid className="h-3 w-3 text-primary/40 group-hover:text-primary/60 transition-colors ml-0.5" />
            </button>

            {/* ── Right: Next + Last? ── */}
            <div className="flex items-center gap-0.5 min-w-[80px] justify-end">
              <PaginationLink
                to={nav.nextPage?.path}
                disabled={nav.isLast}
                aria-label="Next page"
              >
                <span className="hidden sm:inline text-xs">Next</span>
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
              {showEdgeButtons && (
                <PaginationLink
                  to={PAGE_SEQUENCE[nav.totalPages - 1].path}
                  disabled={nav.isLast}
                  aria-label="Last page"
                  compact
                >
                  <ChevronsRight className="h-4 w-4" />
                </PaginationLink>
              )}
            </div>
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

// ─── SHARED NAV PILL (top bar) ──────────────────────────────────────────────

function NavPill({
  to,
  disabled,
  children,
  ...props
}: {
  to?: string;
  disabled: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
  title?: string;
}) {
  const base = cn(
    "inline-flex items-center gap-0.5 h-9 px-2.5 sm:px-3 rounded-lg text-xs font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
  );

  if (disabled || !to) {
    return (
      <span
        className={cn(base, "opacity-25 cursor-not-allowed text-secondary-foreground/40")}
        aria-disabled="true"
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        base,
        "text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-secondary-foreground/5 active:bg-secondary-foreground/10 active:scale-[0.97]"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

// ─── SHARED PAGINATION LINK (bottom bar) ────────────────────────────────────

function PaginationLink({
  to,
  disabled,
  compact,
  children,
  ...props
}: {
  to?: string;
  disabled: boolean;
  compact?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const base = cn(
    "inline-flex items-center justify-center gap-1 rounded-xl text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
    compact ? "h-10 w-10" : "h-10 min-w-[44px] px-3 sm:px-4"
  );

  if (disabled || !to) {
    return (
      <span
        className={cn(base, "opacity-20 cursor-not-allowed text-secondary-foreground/30")}
        aria-disabled="true"
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        base,
        "text-secondary-foreground/70 hover:text-primary hover:bg-primary/8 active:bg-primary/12 active:scale-[0.96]"
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

// ─── PAGES DRAWER ───────────────────────────────────────────────────────────
// Slide-in panel listing all pages grouped by section
// Current page highlighted · Numbers · Instant jump

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
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active page when drawer opens
  useEffect(() => {
    if (open && activeRef.current) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 350);
    }
  }, [open]);

  const handlePageClick = useCallback(
    (path: string) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
  );

  // Group pages by section
  const sections = PAGE_SEQUENCE.reduce<
    Record<string, (typeof PAGE_SEQUENCE)[number][]>
  >((acc, page) => {
    const s = page.section || "Other";
    if (!acc[s]) acc[s] = [];
    acc[s].push(page);
    return acc;
  }, {});

  const currentIndex = PAGE_SEQUENCE.findIndex((p) => p.path === currentPath);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="All pages"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 340 }}
            className={cn(
              "fixed top-0 right-0 bottom-0 z-[61] flex flex-col",
              "w-[85vw] max-w-[360px]",
              "bg-secondary border-l border-primary/10",
              "shadow-[-8px_0_30px_rgba(0,0,0,0.25)]"
            )}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-primary/10 shrink-0">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-secondary-foreground tracking-tight">
                  All Pages
                </h2>
                <span className="text-[10px] bg-primary/10 text-primary/70 font-semibold px-1.5 py-0.5 rounded-full">
                  {PAGE_SEQUENCE.length}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close page list"
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                  "text-secondary-foreground/50 hover:text-secondary-foreground hover:bg-secondary-foreground/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Page indicator bar ── */}
            <div className="px-4 py-2.5 border-b border-primary/5 bg-primary/[0.03] shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary-foreground/50">
                  Current page
                </span>
                <span className="text-xs font-bold text-primary tabular-nums">
                  {currentIndex + 1} of {PAGE_SEQUENCE.length}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-1.5 h-1 bg-secondary-foreground/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary/60 rounded-full"
                  initial={false}
                  animate={{
                    width: `${((currentIndex + 1) / PAGE_SEQUENCE.length) * 100}%`,
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                />
              </div>
            </div>

            {/* ── Page list (scrollable) ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain py-2 px-2 space-y-4">
              {Object.entries(sections).map(([section, pages]) => (
                <div key={section}>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary-foreground/30 mb-1 px-2.5">
                    {section}
                  </h3>
                  <ul className="space-y-px">
                    {pages.map((page) => {
                      const idx = PAGE_SEQUENCE.indexOf(page);
                      const isActive = currentPath === page.path;
                      return (
                        <li key={page.path}>
                          <button
                            ref={isActive ? activeRef : undefined}
                            onClick={() => handlePageClick(page.path)}
                            className={cn(
                              "flex items-center gap-3 w-full rounded-lg px-2.5 py-2 text-[13px] text-left transition-all duration-150",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              isActive
                                ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20"
                                : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5 active:bg-secondary-foreground/8"
                            )}
                          >
                            {/* Page number badge */}
                            <span
                              className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold shrink-0 tabular-nums transition-colors",
                                isActive
                                  ? "bg-primary-foreground/15 text-primary-foreground"
                                  : "bg-secondary-foreground/5 text-secondary-foreground/35"
                              )}
                            >
                              {idx + 1}
                            </span>
                            {/* Label */}
                            <span className="flex-1 truncate">{page.label}</span>
                            {/* Active indicator */}
                            {isActive && (
                              <Check className="h-3.5 w-3.5 text-primary-foreground/60 shrink-0" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div className="px-4 py-2.5 border-t border-primary/10 shrink-0">
              <button
                onClick={onClose}
                className={cn(
                  "w-full h-9 rounded-lg text-xs font-medium transition-colors",
                  "bg-secondary-foreground/5 text-secondary-foreground/50 hover:bg-secondary-foreground/10 hover:text-secondary-foreground/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                Close
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
