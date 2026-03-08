// NESA Portal Navigation System
// Document/book-style navigation for charter viewing, nominations, awards docs
// Fixed top bar + fixed bottom bar + table of contents drawer

import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  X,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PAGE_SEQUENCE, getPageNavigation } from "@/config/page-sequence";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

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
    "inline-flex items-center justify-center gap-1 rounded-lg font-medium transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-secondary",
    disabled
      ? "opacity-20 cursor-not-allowed pointer-events-none text-secondary-foreground/30"
      : "text-secondary-foreground/70 hover:text-primary hover:bg-primary/8 active:bg-primary/15 active:scale-[0.97]",
    className
  );

  if (disabled || !to) {
    return (
      <span className={base} aria-disabled="true" role="link" {...props}>
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

// ─── TOP NAVIGATION BAR ─────────────────────────────────────────────────────
// Layout: [Logo | Section Title]                    [Back] [Next] [Pages]  Page X of Y

export function TopPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!nav.isKnown) return null;

  const sectionName = nav.currentPage?.section || "";

  return (
    <>
      <nav
        aria-label="Page navigation"
        className="sticky top-0 z-50 border-b border-border/30 bg-secondary/97 backdrop-blur-xl print:hidden"
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-3 px-3 sm:px-5">
          {/* Left: Logo + Section title */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <img
              src={nesaStamp}
              alt="NESA Africa"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-primary/20"
            />
            <span className="hidden text-sm font-bold text-secondary-foreground sm:inline">
              NESA Africa
            </span>
          </Link>

          {sectionName && (
            <>
              <span className="text-secondary-foreground/20">|</span>
              <span className="truncate text-xs font-medium text-secondary-foreground/50">
                {sectionName}
              </span>
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Back + Next + Pages + Indicator */}
          <div className="flex items-center gap-1">
            <NavButton
              to={nav.previousPage?.path}
              disabled={nav.isFirst}
              aria-label="Previous page"
              className="h-9 min-w-[36px] px-2 text-xs sm:min-w-[44px] sm:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </NavButton>

            <NavButton
              to={nav.nextPage?.path}
              disabled={nav.isLast}
              aria-label="Next page"
              className="h-9 min-w-[36px] px-2 text-xs sm:min-w-[44px] sm:px-3"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </NavButton>

            <div className="mx-1 hidden h-5 w-px bg-border/30 sm:block" />

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open table of contents"
              className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-secondary-foreground/70 transition-all hover:bg-primary/8 hover:text-primary active:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:px-3"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Pages</span>
            </button>

            <div className="mx-1 hidden h-5 w-px bg-border/30 lg:block" />

            {/* Page indicator — visible on md+ */}
            <span className="hidden whitespace-nowrap text-xs tabular-nums text-secondary-foreground/40 lg:inline">
              Page{" "}
              <span className="font-semibold text-primary">{nav.pageNumber}</span>
              {" "}of {nav.totalPages}
            </span>
          </div>
        </div>
      </nav>

      <TableOfContents
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentPath={location.pathname}
      />
    </>
  );
}

// ─── BOTTOM NAVIGATION BAR ──────────────────────────────────────────────────
// Layout: [First] [Previous]     Page X of Y     [Next] [Last]

export function BottomPageNav() {
  const location = useLocation();
  const nav = getPageNavigation(location.pathname);
  const [tocOpen, setTocOpen] = useState(false);

  if (!nav.isKnown) return null;

  return (
    <>
      <nav
        aria-label="Page pagination"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/30 bg-secondary/97 backdrop-blur-xl print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-2 sm:px-4">
          {/* Left: First + Previous */}
          <div className="flex items-center gap-0.5">
            <NavButton
              to={PAGE_SEQUENCE[0].path}
              disabled={nav.isFirst}
              aria-label="First page"
              className="h-11 min-w-[44px] px-2 text-xs"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="hidden sm:inline">First</span>
            </NavButton>

            <NavButton
              to={nav.previousPage?.path}
              disabled={nav.isFirst}
              aria-label="Previous page"
              className="h-11 min-w-[44px] px-2.5 text-xs"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Prev</span>
            </NavButton>
          </div>

          {/* Center: Page selector pill */}
          <button
            onClick={() => setTocOpen(true)}
            aria-label={`Page ${nav.pageNumber} of ${nav.totalPages}. Tap to jump to a page.`}
            className="flex h-10 items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-4 tabular-nums transition-all hover:bg-primary/15 active:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:px-5"
          >
            <span className="text-xs text-secondary-foreground/50 sm:text-sm">Page</span>
            <span className="text-sm font-bold text-primary sm:text-base">{nav.pageNumber}</span>
            <span className="text-xs text-secondary-foreground/40">of {nav.totalPages}</span>
          </button>

          {/* Right: Next + Last */}
          <div className="flex items-center gap-0.5">
            <NavButton
              to={nav.nextPage?.path}
              disabled={nav.isLast}
              aria-label="Next page"
              className="h-11 min-w-[44px] px-2.5 text-xs"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </NavButton>

            <NavButton
              to={PAGE_SEQUENCE[nav.totalPages - 1].path}
              disabled={nav.isLast}
              aria-label="Last page"
              className="h-11 min-w-[44px] px-2 text-xs"
            >
              <span className="hidden sm:inline">Last</span>
              <ChevronsRight className="h-4 w-4" />
            </NavButton>
          </div>
        </div>
      </nav>

      <TableOfContents
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        currentPath={location.pathname}
      />
    </>
  );
}

// ─── TABLE OF CONTENTS (Pages Panel) ────────────────────────────────────────

function TableOfContents({
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
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-scroll to active page
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      const timer = setTimeout(() => {
        activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

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

  // Filter by search
  const filteredSections = searchQuery.trim()
    ? Object.entries(sections).reduce<Record<string, (typeof PAGE_SEQUENCE)[number][]>>(
        (acc, [section, pages]) => {
          const q = searchQuery.toLowerCase();
          const filtered = pages.filter(
            (p) =>
              p.label.toLowerCase().includes(q) ||
              section.toLowerCase().includes(q)
          );
          if (filtered.length) acc[section] = filtered;
          return acc;
        },
        {}
      )
    : sections;

  const currentNav = getPageNavigation(currentPath);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Table of Contents"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 400 }}
            className="fixed bottom-0 right-0 top-0 z-[61] flex w-[320px] flex-col border-l border-border/30 bg-secondary shadow-2xl sm:w-[360px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/20 px-4 py-3">
              <div>
                <h2 className="text-sm font-bold text-secondary-foreground">
                  Table of Contents
                </h2>
                {currentNav.isKnown && (
                  <p className="mt-0.5 text-[11px] text-secondary-foreground/40">
                    Page {currentNav.pageNumber} of {currentNav.totalPages}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close table of contents"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-foreground/50 transition-colors hover:bg-primary/8 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-border/15 px-4 py-2.5">
              <div className="flex h-9 items-center gap-2 rounded-lg bg-muted/50 px-3">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages…"
                  className="w-full bg-transparent text-xs text-secondary-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  aria-label="Search pages"
                />
              </div>
            </div>

            {/* Page list */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
              {Object.keys(filteredSections).length === 0 ? (
                <p className="px-3 py-8 text-center text-xs text-muted-foreground/50">
                  No pages found
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(filteredSections).map(([section, pages]) => (
                    <div key={section}>
                      <h3 className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary/40">
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
                                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition-all duration-150",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                  isActive
                                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                                    : "text-secondary-foreground/60 hover:bg-primary/8 hover:text-secondary-foreground active:bg-primary/12"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums",
                                    isActive
                                      ? "bg-primary-foreground/20 text-primary-foreground"
                                      : "bg-muted/60 text-muted-foreground/50"
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
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/15 px-4 py-2.5 text-center">
              <span className="text-[11px] text-secondary-foreground/30">
                {PAGE_SEQUENCE.length} pages
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
