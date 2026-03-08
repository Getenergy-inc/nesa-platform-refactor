// Universal Page Navigation System
// Fixed top bar + fixed bottom bar + pages drawer
// Consistent on every page, mobile-first, accessible

import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  List,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PAGE_SEQUENCE, getPageNavigation } from "@/config/page-sequence";

// ─── Shared Nav Button ───────────────────────────────────────────────────────

function NavButton({
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
  const base = cn(
    "inline-flex items-center justify-center gap-1 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    disabled
      ? "opacity-25 cursor-not-allowed pointer-events-none text-secondary-foreground/40"
      : "text-secondary-foreground/80 hover:text-primary hover:bg-primary/10 active:bg-primary/20",
    className
  );

  if (disabled || !to) {
    return (
      <span className={base} aria-disabled="true" {...props}>
        {children}
      </span>
    );
  }

  return (
    <Link to={to} className={base} {...props}>
      {children}
    </Link>
  );
}

// ─── Top Navigation Bar ──────────────────────────────────────────────────────

export function TopPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!nav.isKnown) return null;

  return (
    <>
      <nav
        aria-label="Page navigation"
        className="sticky top-0 z-50 border-b border-primary/15 bg-secondary/95 backdrop-blur-md print:hidden"
      >
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-3 sm:px-4">
          {/* Left: Page indicator */}
          <span className="text-xs font-semibold tabular-nums text-secondary-foreground/60">
            <span className="text-primary">{nav.pageNumber}</span>
            <span className="mx-0.5">/</span>
            <span>{nav.totalPages}</span>
          </span>

          {/* Right: Back + Next + Pages */}
          <div className="flex items-center gap-0.5">
            <NavButton
              to={nav.previousPage?.path}
              disabled={nav.isFirst}
              aria-label="Previous page"
              className="h-9 min-w-[40px] px-2 text-xs"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </NavButton>

            <NavButton
              to={nav.nextPage?.path}
              disabled={nav.isLast}
              aria-label="Next page"
              className="h-9 min-w-[40px] px-2 text-xs"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </NavButton>

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open page list"
              className="ml-1 flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-secondary-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary active:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <List className="h-4 w-4" />
              <span className="hidden xs:inline">Pages</span>
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

// ─── Bottom Navigation Bar ───────────────────────────────────────────────────

export function BottomPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [selectorOpen, setSelectorOpen] = useState(false);

  if (!nav.isKnown) return null;

  const showEdge = nav.totalPages > 10;

  return (
    <>
      <nav
        aria-label="Page pagination"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/15 bg-secondary/95 backdrop-blur-md print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-2 sm:px-4">
          {/* Left: First + Previous */}
          <div className="flex items-center gap-0.5">
            {showEdge && (
              <NavButton
                to={PAGE_SEQUENCE[0].path}
                disabled={nav.isFirst}
                aria-label="First page"
                className="h-11 min-w-[44px] px-2 text-sm"
              >
                <ChevronsLeft className="h-4 w-4" />
              </NavButton>
            )}
            <NavButton
              to={nav.previousPage?.path}
              disabled={nav.isFirst}
              aria-label="Previous page"
              className="h-11 min-w-[44px] px-3 text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Prev</span>
            </NavButton>
          </div>

          {/* Center: Page selector */}
          <button
            onClick={() => setSelectorOpen(true)}
            aria-label={`Page ${nav.pageNumber} of ${nav.totalPages}. Tap to jump.`}
            className="flex h-10 items-center gap-2 rounded-full bg-primary/10 px-5 transition-colors hover:bg-primary/20 active:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-sm font-bold tabular-nums text-primary">
              Page {nav.pageNumber}
            </span>
            <span className="text-xs text-secondary-foreground/50">
              of {nav.totalPages}
            </span>
          </button>

          {/* Right: Next + Last */}
          <div className="flex items-center gap-0.5">
            <NavButton
              to={nav.nextPage?.path}
              disabled={nav.isLast}
              aria-label="Next page"
              className="h-11 min-w-[44px] px-3 text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </NavButton>
            {showEdge && (
              <NavButton
                to={PAGE_SEQUENCE[nav.totalPages - 1].path}
                disabled={nav.isLast}
                aria-label="Last page"
                className="h-11 min-w-[44px] px-2 text-sm"
              >
                <ChevronsRight className="h-4 w-4" />
              </NavButton>
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
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active page into view
  useEffect(() => {
    if (open && activeRef.current) {
      requestAnimationFrame(() => {
        activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    }
  }, [open]);

  const handlePageClick = useCallback(
    (path: string) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
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

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="All pages"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed bottom-0 right-0 top-0 z-[61] flex w-[300px] flex-col border-l border-primary/20 bg-secondary shadow-2xl sm:w-[340px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/15 px-4 py-3">
              <h2 className="text-base font-bold text-primary">All Pages</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Page list */}
            <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-3">
              {Object.entries(sections).map(([section, pages]) => (
                <div key={section}>
                  <h3 className="mb-1 px-2 text-[11px] font-bold uppercase tracking-widest text-primary/50">
                    {section}
                  </h3>
                  <ul className="space-y-0.5">
                    {pages.map((page) => {
                      const idx = PAGE_SEQUENCE.indexOf(page);
                      const isActive = currentPath === page.path;
                      return (
                        <li key={page.path}>
                          <button
                            ref={isActive ? activeRef : undefined}
                            onClick={() => handlePageClick(page.path)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              isActive
                                ? "bg-primary font-semibold text-primary-foreground"
                                : "text-secondary-foreground/70 hover:bg-primary/10 hover:text-primary active:bg-primary/15"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums",
                                isActive
                                  ? "bg-primary-foreground/20 text-primary-foreground"
                                  : "bg-primary/10 text-primary/50"
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

            {/* Footer */}
            <div className="border-t border-primary/15 px-4 py-3 text-center">
              <span className="text-xs text-secondary-foreground/40">
                {PAGE_SEQUENCE.length} pages
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
